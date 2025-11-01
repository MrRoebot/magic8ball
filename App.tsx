
import React, { useState, useCallback } from 'react';
import Magic8Ball from './components/Magic8Ball';
import LeadCaptureForm from './components/LeadCaptureForm';
import { get8BallResponseStream } from './services/geminiService';
import type { GameState, LeadFormData } from './types';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);

  const handleAskQuestion = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    setGameState('shaking');
    setError(null);
    setAnswer(''); // Start with empty string for streaming
    setFormSubmitted(false);

    try {
      const stream = get8BallResponseStream();
      const animationTimeout = new Promise(resolve => setTimeout(resolve, 2000));
      
      // Concurrently process the stream and update the answer state.
      const streamingPromise = (async () => {
        for await (const chunk of stream) {
          // Use functional update to append chunk to the current answer
          setAnswer(currentAnswer => (currentAnswer || '') + chunk);
        }
      })();

      // Wait for the animation duration to complete.
      await animationTimeout;

      // By now, streaming has likely started, so text will appear with the reveal.
      setGameState('revealed');

      // Wait for the streaming to fully complete before setting isLoading to false.
      await streamingPromise;

    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred';
      setError(`Failed to get an answer. ${errorMessage}`);
      setGameState('idle');
      setAnswer(null);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);
  
  const handleFormSubmit = (formData: LeadFormData) => {
    console.log('Lead Captured:', formData);
    // In a real application, you would send this data to your backend or CRM.
    setFormSubmitted(true);
  };

  const handleReset = () => {
    setGameState('idle');
    setAnswer(null);
    setError(null);
    setFormSubmitted(false);
  };

  const renderActionArea = () => {
    if (gameState === 'revealed') {
      if (formSubmitted) {
        return (
          <div className="text-center animate-fade-in-deep">
            <h3 className="text-2xl font-bold text-green-400">Thank You!</h3>
            <p className="text-gray-300 mt-2">We'll be in touch shortly to discuss your AI journey.</p>
            <button
              onClick={handleReset}
              className="mt-6 px-8 py-4 bg-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Play Again
            </button>
          </div>
        );
      }
      return <LeadCaptureForm revealedAnswer={answer || ''} onSubmit={handleFormSubmit} />;
    }

    return (
      <button
        onClick={handleAskQuestion}
        disabled={isLoading}
        className="px-8 py-4 bg-purple-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:transform-none"
      >
        {isLoading ? 'Consulting...' : 'Ask the AI 8-Ball'}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-indigo-900/50 to-gray-900 text-white flex flex-col items-center justify-center p-4 antialiased">
      <header className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
          Be Honest, Are You Ready for AI?
        </h1>
        <p className="mt-2 text-lg text-gray-400">The Magic 8-Ball knows all... about your AI readiness.</p>
      </header>

      <main className="flex flex-col items-center justify-center gap-10 [perspective:1000px]">
        <Magic8Ball gameState={gameState} answer={answer} />
        <div className="h-48 flex items-center justify-center w-full">
            {renderActionArea()}
        </div>
        {error && <p className="mt-4 text-red-400">{error}</p>}
      </main>
      
      <footer className="absolute bottom-4 text-center text-gray-500 text-sm">
        <p>Powered by Gemini</p>
      </footer>
    </div>
  );
};

export default App;