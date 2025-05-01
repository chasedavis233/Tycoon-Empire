import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { useSpring, animated } from '@react-spring/web';
import { Building2, Users, Heart, TrendingUp, CircleDollarSign } from 'lucide-react';

const CityView: React.FC = () => {
  const { state, dispatch } = useGame();
  const { cityView, businesses } = state;
  const [gridSize, setGridSize] = useState({ width: 8, height: 6 });

  const populationSpring = useSpring({
    number: cityView.population,
    from: { number: 0 }
  });

  const satisfactionSpring = useSpring({
    number: cityView.satisfaction,
    from: { number: 0 }
  });

  useEffect(() => {
    // Unlock city view when player owns at least one business
    if (!cityView.unlocked && businesses.some(b => b.owned)) {
      dispatch({ type: 'UNLOCK_CITY' });
    }
  }, [businesses]);

  const getBusinessColor = (type: string) => {
    const colors: Record<string, string> = {
      FOOD: 'bg-yellow-600',
      RETAIL: 'bg-blue-600',
      TECH: 'bg-purple-600',
      REAL_ESTATE: 'bg-green-600',
      ENTERTAINMENT: 'bg-red-600',
      EDUCATION: 'bg-indigo-600',
      HEALTHCARE: 'bg-pink-600',
      TRANSPORT: 'bg-orange-600',
      INDUSTRY: 'bg-gray-600'
    };
    return colors[type] || 'bg-blue-600';
  };

  if (!cityView.unlocked) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <Building2 className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">City View Locked</h3>
        <p className="text-gray-400">Purchase your first business to unlock the city view!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Building2 className="h-6 w-6 text-blue-500 mr-2" />
          City Overview
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-gray-300">Population</span>
              </div>
              <animated.span className="text-xl font-bold">
                {populationSpring.number.to(n => Math.floor(n).toLocaleString())}
              </animated.span>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Growing with your empire
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-gray-300">Satisfaction</span>
              </div>
              <animated.span className="text-xl font-bold">
                {satisfactionSpring.number.to(n => `${Math.floor(n)}%`)}
              </animated.span>
            </div>
            <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  cityView.satisfaction > 66
                    ? 'bg-green-500'
                    : cityView.satisfaction > 33
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${cityView.satisfaction}%` }}
              />
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Building2 className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-gray-300">Businesses</span>
              </div>
              <span className="text-xl font-bold">
                {businesses.filter(b => b.owned).length}/{businesses.length}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              Active enterprises
            </div>
          </div>

          <div className="bg-gray-700 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CircleDollarSign className="h-5 w-5 text-yellow-400 mr-2" />
                <span className="text-gray-300">Economy</span>
              </div>
              <span className="text-xl font-bold">
                ${(cityView.population * 10).toLocaleString()}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-400">
              City GDP
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">City Map</h3>
        <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
          <div 
            className="absolute inset-0 grid gap-1 p-2"
            style={{
              gridTemplateColumns: `repeat(${gridSize.width}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${gridSize.height}, minmax(0, 1fr))`
            }}
          >
            {businesses.filter(b => b.owned && b.position).map((business) => (
              <div
                key={business.id}
                className="relative group"
                style={{
                  gridColumn: business.position!.x,
                  gridRow: business.position!.y,
                }}
              >
                <div 
                  className={`absolute inset-0 ${getBusinessColor(business.type)} rounded-md flex items-center justify-center transform transition-all duration-200 group-hover:scale-105 cursor-pointer`}
                  title={business.name}
                >
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                    {business.name}
                  </div>
                  <span className="text-xs font-bold text-white">
                    {business.name.slice(0, 2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 text-green-500 mr-2" />
          Growth Metrics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Population Growth</h4>
            <p className="text-sm text-gray-400">
              +{(businesses.filter(b => b.owned).length * 10)} citizens per cycle
            </p>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg">
            <h4 className="text-lg font-semibold mb-2">Business Distribution</h4>
            <div className="space-y-2">
              {Object.entries(
                businesses
                  .filter(b => b.owned)
                  .reduce((acc, b) => ({
                    ...acc,
                    [b.type]: (acc[b.type] || 0) + 1
                  }), {} as Record<string, number>)
              ).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{type}</span>
                  <span className="text-sm font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityView;