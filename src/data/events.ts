import { RandomEvent, GameState } from '../types';

export const randomEvents: RandomEvent[] = [
  {
    id: 'e1',
    title: 'Economic Boom',
    description: 'The economy is thriving! All businesses generate 20% more revenue for the next period.',
    probability: 0.2,
    effect: (state: GameState) => ({
      ...state,
      businesses: state.businesses.map(b => ({
        ...b,
        revenue: b.revenue * 1.2
      }))
    })
  },
  {
    id: 'e2',
    title: 'Economic Recession',
    description: 'Economic downturn! Revenues decrease by 15% for the next period.',
    probability: 0.15,
    effect: (state: GameState) => ({
      ...state,
      businesses: state.businesses.map(b => ({
        ...b,
        revenue: Math.max(b.revenue * 0.85, b.revenue / b.level)
      }))
    })
  },
  {
    id: 'e3',
    title: 'Unexpected Donation',
    description: 'A generous benefactor donated to your business empire!',
    probability: 0.1,
    effect: (state: GameState) => ({
      ...state,
      player: {
        ...state.player,
        money: state.player.money + 5000
      }
    })
  },
  {
    id: 'e4',
    title: 'Tax Inspection',
    description: 'The tax office found some irregularities. Pay a fine.',
    probability: 0.1,
    effect: (state: GameState) => ({
      ...state,
      player: {
        ...state.player,
        money: Math.max(state.player.money - 2000, 0)
      }
    })
  },
  {
    id: 'e5',
    title: 'Happy Employees',
    description: 'Your employees are satisfied! Productivity increases.',
    probability: 0.2,
    effect: (state: GameState) => ({
      ...state,
      player: {
        ...state.player,
        happiness: Math.min(state.player.happiness + 15, 100)
      }
    })
  },
  {
    id: 'e6',
    title: 'Employee Strike',
    description: 'Your employees are on strike! Revenue decreases.',
    probability: 0.08,
    effect: (state: GameState) => ({
      ...state,
      player: {
        ...state.player,
        happiness: Math.max(state.player.happiness - 20, 0)
      },
      businesses: state.businesses.map(b => ({
        ...b,
        revenue: b.revenue * 0.7
      }))
    })
  }
];