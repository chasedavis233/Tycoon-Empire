import React from 'react';
import { useGame } from '../context/GameContext';
import { RefreshCw } from 'lucide-react';

const Controls: React.FC = () => {
  const { dispatch } = useGame();
  
  const handleReset = () => {
    if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
      dispatch({ type: 'RESET_GAME' });
    }
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 mt-4">
      <h2 className="text-xl font-bold mb-3">Game Controls</h2>
      
      <div className="space-y-2">
        <button
          className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md font-medium transition-colors flex items-center justify-center"
          onClick={handleReset}
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default Controls;