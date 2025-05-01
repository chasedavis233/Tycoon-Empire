import React from 'react';
import { Business } from '../types';
import BusinessCard from './BusinessCard';
import { useGame } from '../context/GameContext';

interface BusinessListProps {
  businesses: Business[];
}

const BusinessList: React.FC<BusinessListProps> = ({ businesses }) => {
  const { dispatch } = useGame();
  
  const handleCollectAll = () => {
    dispatch({ type: 'COLLECT_ALL_REVENUE' });
  };
  
  const ownedBusinesses = businesses.filter(b => b.owned);
  
  return (
    <div>
      {ownedBusinesses.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md font-medium transition-colors"
            onClick={handleCollectAll}
          >
            Collect All Revenue
          </button>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {businesses.map(business => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </div>
  );
};

export default BusinessList;