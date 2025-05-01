import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BusinessType } from '../types';
import Header from './Header';
import BusinessList from './BusinessList';
import PlayerStats from './PlayerStats';
import Controls from './Controls';
import AchievementsList from './AchievementsList';
import CityView from './CityView';

type Tab = 'businesses' | 'achievements' | 'stats' | 'city';

const Dashboard: React.FC = () => {
  const { state } = useGame();
  const [activeTab, setActiveTab] = useState<Tab>('businesses');
  const [filter, setFilter] = useState<BusinessType | 'ALL'>('ALL');

  const filteredBusinesses = state.businesses.filter(
    business => filter === 'ALL' || business.type === filter
  );

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <Header />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        <div className="lg:col-span-1">
          <PlayerStats />
          <Controls />
          
          <div className="bg-gray-800 rounded-lg p-4 mt-4">
            <h2 className="text-xl font-bold mb-3">Navigation</h2>
            <div className="flex flex-col space-y-2">
              {['businesses', 'achievements', 'stats', 'city'].map((tab) => (
                <button 
                  key={tab}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    activeTab === tab 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                  onClick={() => setActiveTab(tab as Tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          {activeTab === 'businesses' && (
            <>
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h2 className="text-xl font-bold mb-3">Filter Businesses</h2>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`px-3 py-1 rounded-md transition-colors ${
                      filter === 'ALL' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setFilter('ALL')}
                  >
                    All
                  </button>
                  {Object.values(BusinessType).map(type => (
                    <button
                      key={type}
                      className={`px-3 py-1 rounded-md transition-colors ${
                        filter === type ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => setFilter(type)}
                    >
                      {type.charAt(0) + type.slice(1).toLowerCase().replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <BusinessList businesses={filteredBusinesses} />
            </>
          )}
          
          {activeTab === 'achievements' && (
            <AchievementsList achievements={state.achievements} />
          )}
          
          {activeTab === 'stats' && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Game Statistics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Business Empire</h3>
                  <p>Businesses Owned: {state.businesses.filter(b => b.owned).length}/{state.businesses.length}</p>
                  <p>Total Employees: {state.businesses.reduce((acc, b) => acc + b.employees, 0)}</p>
                  <p>Highest Level Business: {Math.max(...state.businesses.map(b => b.level))}</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Financial</h3>
                  <p>Current Cash: ${state.player.money.toLocaleString()}</p>
                  <p>Prestige Points: {state.player.prestige}</p>
                  <p>Estimated Hourly Income: $
                    {state.businesses
                      .filter(b => b.owned)
                      .reduce((acc, b) => acc + (3600 / b.interval) * b.revenue * (1 + b.employees * 0.1), 0)
                      .toFixed(2)}
                  </p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Progress</h3>
                  <p>Days in Business: {state.player.day}</p>
                  <p>Achievements: {state.achievements.filter(a => a.achieved).length}/{state.achievements.length}</p>
                </div>
                
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Player Status</h3>
                  <p>Happiness: {state.player.happiness}%</p>
                  <div className="w-full bg-gray-600 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-green-500 h-2.5 rounded-full" 
                      style={{ width: `${state.player.happiness}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'city' && <CityView />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;