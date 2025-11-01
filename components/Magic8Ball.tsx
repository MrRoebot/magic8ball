import React from 'react';
import type { GameState } from '../types';

interface Magic8BallProps {
  gameState: GameState;
  answer: string | null;
}

// Front face of the inner window, shows the "8"
const FrontFace: React.FC = () => (
  <div className="absolute w-full h-full bg-white rounded-full flex items-center justify-center [backface-visibility:hidden] shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)]">
    <span className="text-8xl font-black text-black select-none">8</span>
  </div>
);

// Back face of the inner window, shows the spinner or the answer
const BackFace: React.FC<Magic8BallProps> = ({ gameState, answer }) => {
  const renderContent = () => {
    switch (gameState) {
      case 'shaking':
        return (
          <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center relative overflow-hidden">
            <div className="absolute w-20 h-20 bg-indigo-500 rounded-full animate-[pulsate_2.5s_ease-in-out_infinite]"></div>
            <div className="absolute w-2 h-2 bg-purple-300 rounded-full animate-[orbit_5s_linear_infinite]" style={{ animationDelay: '0s' }}></div>
            <div className="absolute w-3 h-3 bg-indigo-200 rounded-full animate-[orbit_7s_linear_infinite]" style={{ animationDelay: '-2s' }}></div>
            <div className="absolute w-2 h-2 bg-purple-400 rounded-full animate-[orbit_9s_linear_infinite]" style={{ animationDelay: '-4s' }}></div>
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          </div>
        );
      case 'revealed':
        return (
          <div className="relative w-full h-full flex items-center justify-center animate-fade-in-deep">
            <div
              className="absolute w-[90%] h-[80%] bg-indigo-500"
              style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            ></div>
            <p className="z-10 text-center text-white font-bold text-xl px-6 leading-tight select-none">
              {answer}
            </p>
          </div>
        );
      default:
        // Render a blank state for idle, though it shouldn't be visible
        return <div className="w-full h-full bg-black rounded-full"></div>;
    }
  };

  return (
    <div className="absolute w-full h-full bg-gray-800 rounded-full [backface-visibility:hidden] rotate-y-180">
      <div className="absolute inset-0 bg-black opacity-30 rounded-full"></div>
      {renderContent()}
    </div>
  );
};

const Magic8Ball: React.FC<Magic8BallProps> = ({ gameState, answer }) => {
  const isFlipped = gameState === 'shaking' || gameState === 'revealed';

  return (
    <div
      className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-black shadow-2xl shadow-indigo-500/20 flex items-center justify-center overflow-hidden"
      aria-live="polite"
    >
      {/* Glossy reflection effect to mimic the photo */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2),rgba(255,255,255,0.0)_50%)]"></div>
      
      <div className="absolute w-full h-full rounded-full border-4 border-black"></div>
      <div 
        className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full shadow-inner-lg transition-transform duration-1000 [transform-style:preserve-3d] ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        <FrontFace />
        <BackFace gameState={gameState} answer={answer} />
      </div>
    </div>
  );
};

export default Magic8Ball;