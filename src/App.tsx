import React from 'react';
import { GameProvider } from './context/GameContext';
import Dashboard from './components/Dashboard';
import { Toaster } from './components/ui/Toaster';

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <Dashboard />
        <Toaster />
      </div>
    </GameProvider>
  );
}

export default App;