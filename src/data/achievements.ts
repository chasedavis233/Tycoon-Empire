import { Achievement, GameState } from '../types';

export const achievements: Achievement[] = [
  {
    id: 'a1',
    title: 'First Steps',
    description: 'Buy your first business',
    achieved: false,
    condition: (state: GameState) => state.businesses.some(b => b.owned)
  },
  {
    id: 'a2',
    title: 'Expansion',
    description: 'Own 3 different businesses',
    achieved: false,
    condition: (state: GameState) => 
      state.businesses.filter(b => b.owned).length >= 3
  },
  {
    id: 'a3',
    title: 'Empire Builder',
    description: 'Own all available businesses',
    achieved: false,
    condition: (state: GameState) => 
      state.businesses.every(b => b.owned)
  },
  {
    id: 'a4',
    title: 'Level Up',
    description: 'Upgrade a business to level 5',
    achieved: false,
    condition: (state: GameState) => 
      state.businesses.some(b => b.level >= 5)
  },
  {
    id: 'a5',
    title: 'Workforce',
    description: 'Hire a total of 20 employees',
    achieved: false,
    condition: (state: GameState) => 
      state.businesses.reduce((total, b) => total + b.employees, 0) >= 20
  },
  {
    id: 'a6',
    title: 'Millionaire',
    description: 'Have $1,000,000 cash',
    achieved: false,
    condition: (state: GameState) => state.player.money >= 1000000
  },
  {
    id: 'a7',
    title: 'Survivor',
    description: 'Reach day 100 in business',
    achieved: false,
    condition: (state: GameState) => state.player.day >= 100
  },
  {
    id: 'a8',
    title: 'Quick Profit',
    description: 'Collect $10,000 in a single collection',
    achieved: false,
    // We'll need to track this separately in the actual collection action
    condition: (state: GameState) => false 
  }
];