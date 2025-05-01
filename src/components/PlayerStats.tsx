import React from 'react';
import { useGame } from '../context/GameContext';
import { DollarSign, Calendar, HeartPulse } from 'lucide-react';

const PlayerStats: React.FC = () => {
  const { state } = useGame();
  
  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-3">Player Stats</h2>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <DollarSign className="h-5 w-5 text-green-500 mr-2" />
          <div>
            <p className="text-sm text-gray-400">Cash</p>
            <p className="font-medium">${state.player.money.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-blue-500 mr-2" />
          <div>
            <p className="text-sm text-gray-400">Day</p>
            <p className="font-medium">{state.player.day}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <HeartPulse className="h-5 w-5 text-red-500 mr-2" />
          <div className="flex-1">
            <p className="text-sm text-gray-400">Happiness</p>
            <div className="flex items-center">
              <p className="font-medium mr-2">{state.player.happiness}%</p>
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    state.player.happiness > 66
                      ? 'bg-green-500'
                      : state.player.happiness > 33
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${state.player.happiness}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;