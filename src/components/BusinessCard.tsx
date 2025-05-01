import React, { useState, useEffect } from 'react';
import { Business, BusinessType } from '../types';
import { useGame } from '../context/GameContext';
import { formatMoney } from '../utils/formatters';
import { 
  Coffee, Store, Cpu, Building, Film, Users, ArrowUpCircle, Coins
} from 'lucide-react';

interface BusinessCardProps {
  business: Business;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ business }) => {
  const { state, dispatch } = useGame();
  const [collectionProgress, setCollectionProgress] = useState(0);
  const [isCollecting, setIsCollecting] = useState(false);
  
  // Calculate the revenue that can be collected right now
  const calculateRevenue = () => {
    if (!business.owned) return 0;
    
    const timeSinceLastCollection = (Date.now() - business.lastCollected) / 1000;
    const cycles = Math.floor(timeSinceLastCollection / business.interval);
    return cycles * business.revenue * (1 + (business.employees * 0.1));
  };
  
  // Update progress indicator
  useEffect(() => {
    if (!business.owned) return;
    
    const updateProgress = () => {
      const timeSinceLastCollection = (Date.now() - business.lastCollected) / 1000;
      const progress = (timeSinceLastCollection % business.interval) / business.interval * 100;
      setCollectionProgress(progress);
    };
    
    const intervalId = setInterval(updateProgress, 100);
    updateProgress();
    
    return () => clearInterval(intervalId);
  }, [business.owned, business.lastCollected, business.interval]);
  
  const handleBuy = () => {
    dispatch({ type: 'BUY_BUSINESS', businessId: business.id });
  };
  
  const handleCollect = () => {
    if (calculateRevenue() > 0) {
      setIsCollecting(true);
      setTimeout(() => {
        dispatch({ type: 'COLLECT_REVENUE', businessId: business.id });
        setIsCollecting(false);
      }, 300);
    }
  };
  
  const handleUpgrade = () => {
    dispatch({ type: 'UPGRADE_BUSINESS', businessId: business.id });
  };
  
  const handleHire = () => {
    dispatch({ type: 'HIRE_EMPLOYEE', businessId: business.id });
  };
  
  const getBusinessIcon = (type: BusinessType) => {
    switch(type) {
      case BusinessType.FOOD:
        return <Coffee className="h-6 w-6 text-yellow-500" />;
      case BusinessType.RETAIL:
        return <Store className="h-6 w-6 text-blue-500" />;
      case BusinessType.TECH:
        return <Cpu className="h-6 w-6 text-purple-500" />;
      case BusinessType.REAL_ESTATE:
        return <Building className="h-6 w-6 text-green-500" />;
      case BusinessType.ENTERTAINMENT:
        return <Film className="h-6 w-6 text-red-500" />;
      default:
        return <Building className="h-6 w-6 text-gray-500" />;
    }
  };
  
  // Calculate collectible revenue
  const collectibleRevenue = calculateRevenue();
  const canCollect = collectibleRevenue > 0;
  
  return (
    <div 
      className={`bg-gray-800 rounded-lg p-5 border-2 transition-all ${
        business.owned 
          ? 'border-blue-500 shadow-lg shadow-blue-500/20' 
          : 'border-gray-700'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          {getBusinessIcon(business.type)}
          <div className="ml-3">
            <h3 className="text-xl font-bold">{business.name}</h3>
            <p className="text-sm text-gray-400">
              {business.type.charAt(0) + business.type.slice(1).toLowerCase().replace('_', ' ')}
            </p>
          </div>
        </div>
        
        {business.owned && (
          <div className="bg-gray-700 px-2 py-1 rounded-md text-xs">
            Level {business.level}
          </div>
        )}
      </div>
      
      {business.owned ? (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-gray-700 p-2 rounded-md">
              <p className="text-xs text-gray-400">Revenue</p>
              <p className="font-medium">${business.revenue.toLocaleString()}</p>
              <p className="text-xs text-gray-400">
                every {business.interval}s
              </p>
            </div>
            
            <div className="bg-gray-700 p-2 rounded-md">
              <p className="text-xs text-gray-400">Employees</p>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-blue-400" />
                <p className="font-medium">{business.employees}/{business.maxEmployees}</p>
              </div>
              <p className="text-xs text-gray-400">
                +{(business.employees * 10)}% production
              </p>
            </div>
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Revenue cycle</span>
              {canCollect && (
                <span className="text-green-400">
                  ${collectibleRevenue.toLocaleString()} available
                </span>
              )}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${canCollect ? 'bg-green-500 animate-pulse' : 'bg-blue-500'}`}
                style={{ width: `${canCollect ? 100 : collectionProgress}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              className={`px-3 py-2 rounded-md flex items-center justify-center font-medium transition-all ${
                canCollect 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              } ${isCollecting ? 'scale-95' : ''}`}
              onClick={handleCollect}
              disabled={!canCollect}
            >
              <Coins className="h-5 w-5 mr-1" />
              Collect
            </button>
            
            <button
              className={`px-3 py-2 rounded-md flex items-center justify-center font-medium transition-colors ${
                state.player.money >= business.upgradeCost
                  ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
              onClick={handleUpgrade}
              disabled={state.player.money < business.upgradeCost}
            >
              <ArrowUpCircle className="h-5 w-5 mr-1" />
              Upgrade (${formatMoney(business.upgradeCost)})
            </button>
          </div>
          
          <button
            className={`w-full mt-2 px-3 py-2 rounded-md flex items-center justify-center font-medium transition-colors ${
              state.player.money >= business.employeeCost && business.employees < business.maxEmployees
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleHire}
            disabled={state.player.money < business.employeeCost || business.employees >= business.maxEmployees}
          >
            <Users className="h-5 w-5 mr-1" />
            Hire Employee (${formatMoney(business.employeeCost)})
          </button>
        </>
      ) : (
        <>
          <div className="mt-4">
            <div className="bg-gray-700 p-3 rounded-md">
              <p className="text-sm">Potential Revenue: ${business.revenue.toLocaleString()} / {business.interval}s</p>
              <p className="text-sm mt-1">Max Employees: {business.maxEmployees}</p>
            </div>
          </div>
          
          <button
            className={`w-full mt-4 px-4 py-3 rounded-md font-medium transition-colors ${
              state.player.money >= business.cost
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleBuy}
            disabled={state.player.money < business.cost}
          >
            Buy for ${business.cost.toLocaleString()}
          </button>
        </>
      )}
    </div>
  );
};

export default BusinessCard;