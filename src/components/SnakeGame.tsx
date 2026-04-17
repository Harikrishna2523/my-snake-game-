import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const INITIAL_SPEED = 150;

type Point = { x: number; y: number };

export function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef(direction);
  
  // Update ref when direction changes to prevent rapid multi-key turning issues
  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
      // Make sure food is not generated on the snake
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is interacting with another element like a button
      if (document.activeElement && ['BUTTON', 'INPUT'].includes(document.activeElement.tagName)) {
        return;
      }

      if (gameOver) return;
      
      const { x, y } = directionRef.current;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
        case 'Escape':
          setIsPaused(prev => !prev);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  // Game Loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y
        };

        // Check Wall Collision
        if (
          newHead.x < 0 || 
          newHead.x >= GRID_SIZE || 
          newHead.y < 0 || 
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check Self Collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check Food Collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop(); // Remove tail if no food eaten
        }

        return newSnake;
      });
    };

    // Increase speed slightly as score goes up
    const dynamicSpeed = Math.max(50, INITIAL_SPEED - Math.floor(score / 50) * 10);
    const intervalId = setInterval(moveSnake, dynamicSpeed);

    return () => clearInterval(intervalId);
  }, [direction, food, gameOver, isPaused, generateFood, score]);

  useEffect(() => {
    if (gameOver && score > highScore) {
      setHighScore(score);
    }
  }, [gameOver, score, highScore]);

  return (
    <div className="flex flex-col xl:flex-row items-center justify-center gap-8 w-full h-full relative z-10">
      
      {/* Game Grid Container */}
      <div className="relative border-4 border-brand-cyan bg-brand-bg shadow-[0_0_20px_var(--color-brand-cyan)]">
        <div 
          className="grid p-1"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
            gap: '1px',
            width: '400px',
            height: '400px'
          }}
        >
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some(s => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={`
                  w-full h-full
                  ${isSnake ? 'bg-brand-cyan shadow-[0_0_5px_var(--color-brand-cyan)] z-10' : ''}
                  ${isFood ? 'bg-brand-magenta shadow-[0_0_10px_var(--color-brand-magenta)] z-10 animate-pulse' : ''}
                  ${!isSnake && !isFood ? 'bg-brand-cyan/10' : ''}
                `}
              />
            );
          })}
        </div>

        {/* Overlays */}
        {gameOver && (
          <div className="absolute inset-0 bg-brand-bg/90 flex flex-col items-center justify-center z-20">
            <h2 className="text-4xl font-black text-brand-magenta mb-2 glitch-text" data-text="SYSTEM_FAILURE">SYSTEM_FAILURE</h2>
            <p className="text-brand-cyan mb-8 text-xl">FINAL_SCORE: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-3 border-2 border-brand-cyan text-brand-cyan text-xl hover:bg-brand-cyan hover:text-black hover:shadow-[0_0_15px_var(--color-brand-cyan)] transition-colors uppercase"
            >
              [ REBOOT_SYSTEM ]
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-brand-bg/80 flex items-center justify-center z-20 cursor-pointer" onClick={() => setIsPaused(false)}>
            <div className="text-4xl text-brand-cyan glitch-text" data-text="PAUSED_">
              PAUSED_
            </div>
          </div>
        )}
        
        <div className="absolute -bottom-8 left-0 right-0 text-center text-brand-magenta text-sm">
          INPUT: <span className="text-brand-cyan">WASD / ARROWS</span> | <span className="text-brand-cyan">SPACE</span> to Pause
        </div>
      </div>

      {/* Stats - mimics the right sidebar */}
      <div className="flex flex-row xl:flex-col gap-6 w-[400px] xl:w-[240px]">
        <div className="p-4 border-2 border-brand-cyan bg-black shadow-[0_0_15px_rgba(0,255,255,0.2)]">
          <div className="text-lg text-brand-cyan mb-1 glitch-text" data-text="SCORE>_">SCORE&gt;_</div>
          <div className="text-4xl text-brand-text mt-1">{score}</div>
        </div>
        <div className="p-4 border-2 border-brand-magenta bg-black shadow-[0_0_15px_rgba(255,0,255,0.2)]">
          <div className="text-lg text-brand-magenta mb-1 glitch-text" data-text="HI_SCORE>_">HI_SCORE&gt;_</div>
          <div className="text-4xl text-brand-text mt-1">{highScore}</div>
        </div>
      </div>

    </div>
  );
}
