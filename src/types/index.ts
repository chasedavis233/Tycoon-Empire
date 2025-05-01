export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  level: number;
  cost: number;
  revenue: number;
  interval: number;
  employees: number;
  maxEmployees: number;
  employeeCost: number;
  upgradeCost: number;
  owned: boolean;
  lastCollected: number;
  upgradeMultiplier: number;
  position?: {
    x: number;
    y: number;
  };
  sprite?: string;
  customerCount?: number;
}

export enum BusinessType {
  FOOD = "FOOD",
  RETAIL = "RETAIL",
  TECH = "TECH",
  REAL_ESTATE = "REAL_ESTATE",
  ENTERTAINMENT = "ENTERTAINMENT",
  EDUCATION = "EDUCATION",
  HEALTHCARE = "HEALTHCARE",
  TRANSPORT = "TRANSPORT",
  INDUSTRY = "INDUSTRY"
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  condition: (state: GameState) => boolean;
  reward?: {
    type: 'money' | 'prestige' | 'unlock';
    amount: number;
  };
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  effect: (state: GameState) => GameState;
  probability: number;
}

export interface CityView {
  unlocked: boolean;
  population: number;
  satisfaction: number;
}

export interface GameState {
  player: {
    name: string;
    money: number;
    day: number;
    happiness: number;
    prestige: number;
  };
  businesses: Business[];
  achievements: Achievement[];
  gameSpeed: number;
  paused: boolean;
  cityView: CityView;
}

export type GameAction = 
  | { type: 'BUY_BUSINESS'; businessId: string }
  | { type: 'COLLECT_REVENUE'; businessId: string }
  | { type: 'UPGRADE_BUSINESS'; businessId: string }
  | { type: 'HIRE_EMPLOYEE'; businessId: string }
  | { type: 'ADVANCE_TIME' }
  | { type: 'TOGGLE_PAUSE' }
  | { type: 'TRIGGER_EVENT'; event: RandomEvent }
  | { type: 'RESET_GAME' }
  | { type: 'SET_GAME_SPEED'; speed: number }
  | { type: 'COLLECT_ALL_REVENUE' }
  | { type: 'UNLOCK_ACHIEVEMENT'; achievementId: string }
  | { type: 'UPDATE_CITY' }
  | { type: 'UNLOCK_CITY' }
  | { type: 'PRESTIGE' };