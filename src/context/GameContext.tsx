import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, GameAction, BusinessType } from '../types';
import { gameReducer } from '../reducers/gameReducer';
import { initialBusinesses } from '../data/businesses';
import { achievements } from '../data/achievements';
import { randomEvents } from '../data/events';
import { useToast } from '../hooks/useToast';
import { create } from 'zustand';

interface AchievementStore {
  recentlyAchieved: string[];
  addAchievement: (id: string) => void;
  clearAchievements: () => void;
}

export const useAchievementStore = create<AchievementStore>((set) => ({
  recentlyAchieved: [],
  addAchievement: (id) => set((state) => ({
    recentlyAchieved: [...state.recentlyAchieved, id]
  })),
  clearAchievements: () => set({ recentlyAchieved: [] })
}));

const initialState: GameState = {
  player: {
    name: 'Entrepreneur',
    money: 5000,
    day: 1,
    happiness: 100,
    prestige: 0
  },
  businesses: initialBusinesses,
  achievements: achievements,
  gameSpeed: 1,
  paused: false,
  cityView: {
    unlocked: false,
    population: 1000,
    satisfaction: 50
  }
};

type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const { toast } = useToast();
  const addAchievement = useAchievementStore((state) => state.addAchievement);

  useEffect(() => {
    if (state.paused) return;

    const gameLoopInterval = setInterval(() => {
      dispatch({ type: 'ADVANCE_TIME' });
      
      if (Math.random() < 0.1) {
        const possibleEvents = randomEvents.filter(
          event => Math.random() < event.probability
        );
        
        if (possibleEvents.length > 0) {
          const randomEvent = possibleEvents[Math.floor(Math.random() * possibleEvents.length)];
          dispatch({ type: 'TRIGGER_EVENT', event: randomEvent });
          toast({
            title: randomEvent.title,
            description: randomEvent.description,
            variant: 'event'
          });
        }
      }

      // City population growth
      if (state.cityView.unlocked && Math.random() < 0.2) {
        dispatch({ type: 'UPDATE_CITY' });
      }
    }, 1000 / state.gameSpeed);

    return () => clearInterval(gameLoopInterval);
  }, [state.paused, state.gameSpeed]);

  useEffect(() => {
    state.achievements.forEach(achievement => {
      if (!achievement.achieved && achievement.condition(state)) {
        addAchievement(achievement.id);
        dispatch({ type: 'UNLOCK_ACHIEVEMENT', achievementId: achievement.id });
        toast({
          title: "Achievement Unlocked!",
          description: achievement.title,
          variant: 'success'
        });
      }
    });
  }, [state.player, state.businesses]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};