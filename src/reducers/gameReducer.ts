import { GameState, GameAction, Business } from '../types';

export const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'BUY_BUSINESS': {
      const business = state.businesses.find(b => b.id === action.businessId);
      if (!business || business.owned || state.player.money < business.cost) {
        return state;
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          money: state.player.money - business.cost
        },
        businesses: state.businesses.map(b => 
          b.id === action.businessId 
            ? { ...b, owned: true, lastCollected: Date.now() } 
            : b
        )
      };
    }
    
    case 'COLLECT_REVENUE': {
      const business = state.businesses.find(b => b.id === action.businessId);
      if (!business || !business.owned) {
        return state;
      }
      
      const timeSinceLastCollection = (Date.now() - business.lastCollected) / 1000;
      const cycles = Math.floor(timeSinceLastCollection / business.interval);
      
      if (cycles <= 0) {
        return state;
      }
      
      const revenue = cycles * business.revenue * (1 + (business.employees * 0.1));
      
      return {
        ...state,
        player: {
          ...state.player,
          money: state.player.money + revenue,
          happiness: Math.min(100, state.player.happiness + 2)
        },
        businesses: state.businesses.map(b =>
          b.id === action.businessId
            ? { ...b, lastCollected: Date.now() }
            : b
        )
      };
    }
    
    case 'COLLECT_ALL_REVENUE': {
      let totalRevenue = 0;
      const updatedBusinesses = state.businesses.map(business => {
        if (!business.owned) return business;
        
        const timeSinceLastCollection = (Date.now() - business.lastCollected) / 1000;
        const cycles = Math.floor(timeSinceLastCollection / business.interval);
        
        if (cycles <= 0) return business;
        
        const revenue = cycles * business.revenue * (1 + (business.employees * 0.1));
        totalRevenue += revenue;
        
        return { ...business, lastCollected: Date.now() };
      });
      
      return {
        ...state,
        player: {
          ...state.player,
          money: state.player.money + totalRevenue,
          happiness: Math.min(100, state.player.happiness + 5)
        },
        businesses: updatedBusinesses
      };
    }
    
    case 'UPGRADE_BUSINESS': {
      const business = state.businesses.find(b => b.id === action.businessId);
      if (!business || !business.owned || state.player.money < business.upgradeCost) {
        return state;
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          money: state.player.money - business.upgradeCost
        },
        businesses: state.businesses.map(b =>
          b.id === action.businessId
            ? { 
                ...b, 
                level: b.level + 1,
                revenue: b.revenue * b.upgradeMultiplier,
                upgradeCost: Math.round(b.upgradeCost * 1.5),
                maxEmployees: b.maxEmployees + 2
              }
            : b
        )
      };
    }
    
    case 'HIRE_EMPLOYEE': {
      const business = state.businesses.find(b => b.id === action.businessId);
      if (
        !business || 
        !business.owned || 
        business.employees >= business.maxEmployees || 
        state.player.money < business.employeeCost
      ) {
        return state;
      }
      
      return {
        ...state,
        player: {
          ...state.player,
          money: state.player.money - business.employeeCost
        },
        businesses: state.businesses.map(b =>
          b.id === action.businessId
            ? { 
                ...b, 
                employees: b.employees + 1,
                employeeCost: Math.round(b.employeeCost * 1.2)
              }
            : b
        )
      };
    }
    
    case 'ADVANCE_TIME': {
      const ownedBusinesses = state.businesses.filter(b => b.owned);
      const poorlyManagedBusinesses = ownedBusinesses.filter(b => 
        b.employees < b.maxEmployees / 2 && b.level < 3
      );
      
      const happinessReduction = poorlyManagedBusinesses.length > 0 ? 0.5 : 0;
      
      return {
        ...state,
        player: {
          ...state.player,
          day: state.player.day + 1,
          happiness: Math.max(0, state.player.happiness - happinessReduction)
        }
      };
    }
    
    case 'TOGGLE_PAUSE': {
      return {
        ...state,
        paused: !state.paused
      };
    }
    
    case 'TRIGGER_EVENT': {
      return action.event.effect(state);
    }
    
    case 'RESET_GAME': {
      return {
        ...state,
        player: {
          ...state.player,
          money: 5000,
          day: 1,
          happiness: 100
        },
        businesses: state.businesses.map(b => ({
          ...b,
          owned: false,
          level: 1,
          employees: 0
        }))
      };
    }
    
    case 'SET_GAME_SPEED': {
      return {
        ...state,
        gameSpeed: action.speed
      };
    }

    case 'UNLOCK_ACHIEVEMENT': {
      return {
        ...state,
        achievements: state.achievements.map(achievement => 
          achievement.id === action.achievementId
            ? { ...achievement, achieved: true }
            : achievement
        ),
        player: {
          ...state.player,
          money: state.player.money + (
            state.achievements.find(a => a.id === action.achievementId)?.reward?.type === 'money'
              ? state.achievements.find(a => a.id === action.achievementId)?.reward?.amount || 0
              : 0
          ),
          prestige: state.player.prestige + (
            state.achievements.find(a => a.id === action.achievementId)?.reward?.type === 'prestige'
              ? state.achievements.find(a => a.id === action.achievementId)?.reward?.amount || 0
              : 0
          )
        }
      };
    }
    
    case 'UPDATE_CITY': {
      const ownedBusinesses = state.businesses.filter(b => b.owned).length;
      const satisfactionChange = Math.random() * 2 - 1;
      
      return {
        ...state,
        cityView: {
          ...state.cityView,
          population: state.cityView.population + (ownedBusinesses * 10),
          satisfaction: Math.max(0, Math.min(100, state.cityView.satisfaction + satisfactionChange))
        }
      };
    }

    case 'UNLOCK_CITY': {
      return {
        ...state,
        cityView: {
          ...state.cityView,
          unlocked: true
        }
      };
    }
    
    default:
      return state;
  }
};