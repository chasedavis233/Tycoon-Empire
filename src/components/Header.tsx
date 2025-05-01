import React from 'react';
import { useGame } from '../context/GameContext';
import { Building2 } from 'lucide-react';

const Header: React.FC = () => {
  const { state, dispatch } = useGame();
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Building2 className="h-10 w-10 text-blue-500 mr-3" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            Tycoon Empire
          </h1>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center">
            <span className="text-xl font-bold mr-2">${state.player.money.toLocaleString()}</span>
            <span className="text-sm text-gray-300">Day {state.player.day}</span>
          </div>
          
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-300 mr-2">Game Speed:</span>
            <div className="flex">
              {[1, 2, 3].map(speed => (
                <button
                  key={speed}
                  className={`px-2 py-1 text-xs rounded ${
                    state.gameSpeed === speed
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => dispatch({ type: 'SET_GAME_SPEED', speed })}
                >
                  {speed}x
                </button>
              ))}
            </div>
            
            <button
              className={`ml-2 px-2 py-1 text-xs rounded ${
                state.paused
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              onClick={() => dispatch({ type: 'TOGGLE_PAUSE' })}
            >
              {state.paused ? 'Resume' : 'Pause'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;