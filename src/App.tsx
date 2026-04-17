/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text flex flex-col p-6 gap-5 h-screen overflow-hidden relative animate-crt">
      <div className="scanlines"></div>
      <div className="noise-bg"></div>
      
      {/* Header */}
      <header className="flex justify-between items-center pb-2 border-b-4 border-brand-cyan shrink-0 z-10 relative">
        <div className="text-4xl text-brand-magenta glitch-text" data-text="NEON_PULSE_SYSV3">
          NEON_PULSE_SYSV3
        </div>
        <div className="text-brand-cyan text-xl animate-pulse">
          [ SESSION_ACTIVE ]
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-5 h-full overflow-hidden min-h-0 z-10 relative">
        <div className="flex-shrink-0 w-full lg:w-[300px] flex flex-col gap-4 overflow-y-auto">
          <MusicPlayer />
        </div>
        
        <div className="flex-1 w-full min-w-0 border-4 border-brand-magenta flex items-center justify-center relative overflow-hidden bg-black text-brand-text shadow-[0_0_20px_rgba(255,0,255,0.4)]">
          <div className="w-full h-full flex items-center justify-center p-4">
            <SnakeGame />
          </div>
        </div>
      </main>
    </div>
  );
}
