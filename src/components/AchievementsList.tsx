import React from 'react';
import { Achievement } from '../types';
import { Award, CheckCircle, XCircle } from 'lucide-react';

interface AchievementsListProps {
  achievements: Achievement[];
}

const AchievementsList: React.FC<AchievementsListProps> = ({ achievements }) => {
  const achievedCount = achievements.filter(a => a.achieved).length;
  const achievementPercentage = (achievedCount / achievements.length) * 100;
  
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Award className="h-6 w-6 text-yellow-500 mr-2" />
          Achievements
        </h2>
        <div className="text-right">
          <p className="text-lg font-medium">
            {achievedCount}/{achievements.length} Completed
          </p>
          <div className="w-40 bg-gray-700 rounded-full h-2.5 mt-1">
            <div 
              className="bg-yellow-500 h-2.5 rounded-full transition-all" 
              style={{ width: `${achievementPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4">
        {achievements.map(achievement => (
          <div 
            key={achievement.id}
            className={`p-4 rounded-lg border-2 transition-all ${
              achievement.achieved 
                ? 'border-yellow-500 bg-yellow-500/10' 
                : 'border-gray-700 bg-gray-700/50'
            }`}
          >
            <div className="flex items-start">
              {achievement.achieved ? (
                <CheckCircle className="h-6 w-6 text-yellow-500 flex-shrink-0" />
              ) : (
                <XCircle className="h-6 w-6 text-gray-500 flex-shrink-0" />
              )}
              
              <div className="ml-3">
                <h3 className={`text-lg font-bold ${
                  achievement.achieved ? 'text-yellow-500' : 'text-gray-300'
                }`}>
                  {achievement.title}
                </h3>
                <p className="text-gray-400">{achievement.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsList;