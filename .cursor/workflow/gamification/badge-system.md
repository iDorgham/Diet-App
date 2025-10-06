# Badge & Title System Specification

## EARS Requirements

**EARS-BDG-001**: The system shall provide visual badges for various achievements and milestones.

**EARS-BDG-002**: The system shall implement a title system with unlockable display names.

**EARS-BDG-003**: The system shall categorize badges by type, rarity, and achievement category.

**EARS-BDG-004**: The system shall provide badge collections and showcase features.

**EARS-BDG-005**: The system shall implement badge sharing and social recognition.

**EARS-BDG-006**: The system shall track badge statistics and user progression.

## Badge Categories and Types

### Nutrition Badges
```typescript
const NUTRITION_BADGES = {
  MACRO_MASTER: {
    id: 'macro_master_badge',
    name: 'Macro Master',
    description: 'Hit your macro targets for 30 consecutive days',
    category: 'nutrition',
    rarity: 'epic',
    icon: '📊',
    color: '#8B5CF6',
    unlockCondition: {
      type: 'streak',
      metric: 'macro_targets',
      value: 30,
      operator: 'gte'
    },
    xpReward: 500,
    coinReward: 250,
    isDisplayable: true,
    displayOrder: 1
  },
  
  VEGGIE_LOVER: {
    id: 'veggie_lover_badge',
    name: 'Veggie Lover',
    description: 'Eat 5 different vegetables daily for 2 weeks',
    category: 'nutrition',
    rarity: 'rare',
    icon: '🥕',
    color: '#10B981',
    unlockCondition: {
      type: 'streak',
      metric: 'daily_vegetables',
      value: 14,
      operator: 'gte'
    },
    xpReward: 300,
    coinReward: 150,
    isDisplayable: true,
    displayOrder: 2
  },
  
  HYDRATION_HERO: {
    id: 'hydration_hero_badge',
    name: 'Hydration Hero',
    description: 'Drink 8 glasses of water daily for 1 week',
    category: 'nutrition',
    rarity: 'uncommon',
    icon: '💧',
    color: '#3B82F6',
    unlockCondition: {
      type: 'streak',
      metric: 'daily_water',
      value: 7,
      operator: 'gte'
    },
    xpReward: 200,
    coinReward: 100,
    isDisplayable: true,
    displayOrder: 3
  },
  
  MEAL_PREP_MASTER: {
    id: 'meal_prep_master_badge',
    name: 'Meal Prep Master',
    description: 'Complete 20 meal prep sessions',
    category: 'nutrition',
    rarity: 'rare',
    icon: '🍱',
    color: '#F59E0B',
    unlockCondition: {
      type: 'cumulative',
      metric: 'meal_prep_sessions',
      value: 20,
      operator: 'gte'
    },
    xpReward: 400,
    coinReward: 200,
    isDisplayable: true,
    displayOrder: 4
  },
  
  NUTRITION_EXPERT: {
    id: 'nutrition_expert_badge',
    name: 'Nutrition Expert',
    description: 'Log 100 meals with complete nutritional data',
    category: 'nutrition',
    rarity: 'epic',
    icon: '🥗',
    color: '#10B981',
    unlockCondition: {
      type: 'cumulative',
      metric: 'complete_meals_logged',
      value: 100,
      operator: 'gte'
    },
    xpReward: 600,
    coinReward: 300,
    isDisplayable: true,
    displayOrder: 5
  }
};
```

### Consistency Badges
```typescript
const CONSISTENCY_BADGES = {
  STREAK_KING: {
    id: 'streak_king_badge',
    name: 'Streak King',
    description: 'Maintain a 100-day activity streak',
    category: 'consistency',
    rarity: 'legendary',
    icon: '👑',
    color: '#F59E0B',
    unlockCondition: {
      type: 'streak',
      metric: 'daily_activity',
      value: 100,
      operator: 'gte'
    },
    xpReward: 1000,
    coinReward: 500,
    isDisplayable: true,
    displayOrder: 1
  },
  
  DAILY_WARRIOR: {
    id: 'daily_warrior_badge',
    name: 'Daily Warrior',
    description: 'Complete daily check-ins for 50 days',
    category: 'consistency',
    rarity: 'rare',
    icon: '⚔️',
    color: '#EF4444',
    unlockCondition: {
      type: 'streak',
      metric: 'daily_checkins',
      value: 50,
      operator: 'gte'
    },
    xpReward: 400,
    coinReward: 200,
    isDisplayable: true,
    displayOrder: 2
  },
  
  WEEKEND_WARRIOR: {
    id: 'weekend_warrior_badge',
    name: 'Weekend Warrior',
    description: 'Stay active on 10 consecutive weekends',
    category: 'consistency',
    rarity: 'uncommon',
    icon: '🏃‍♂️',
    color: '#8B5CF6',
    unlockCondition: {
      type: 'streak',
      metric: 'weekend_activity',
      value: 10,
      operator: 'gte'
    },
    xpReward: 250,
    coinReward: 125,
    isDisplayable: true,
    displayOrder: 3
  },
  
  EARLY_BIRD: {
    id: 'early_bird_badge',
    name: 'Early Bird',
    description: 'Complete your first meal before 8 AM for 30 days',
    category: 'consistency',
    rarity: 'rare',
    icon: '🐦',
    color: '#F59E0B',
    unlockCondition: {
      type: 'streak',
      metric: 'early_meal_completion',
      value: 30,
      operator: 'gte'
    },
    xpReward: 350,
    coinReward: 175,
    isDisplayable: true,
    displayOrder: 4
  },
  
  NIGHT_OWL: {
    id: 'night_owl_badge',
    name: 'Night Owl',
    description: 'Complete your last meal after 8 PM for 30 days',
    category: 'consistency',
    rarity: 'rare',
    icon: '🦉',
    color: '#6366F1',
    unlockCondition: {
      type: 'streak',
      metric: 'late_meal_completion',
      value: 30,
      operator: 'gte'
    },
    xpReward: 350,
    coinReward: 175,
    isDisplayable: true,
    displayOrder: 5
  }
};
```

### Social Badges
```typescript
const SOCIAL_BADGES = {
  MENTOR: {
    id: 'mentor_badge',
    name: 'Mentor',
    description: 'Successfully mentor 5 new users',
    category: 'social',
    rarity: 'epic',
    icon: '🎓',
    color: '#8B5CF6',
    unlockCondition: {
      type: 'cumulative',
      metric: 'users_mentored',
      value: 5,
      operator: 'gte'
    },
    xpReward: 600,
    coinReward: 300,
    isDisplayable: true,
    displayOrder: 1
  },
  
  CHEERLEADER: {
    id: 'cheerleader_badge',
    name: 'Cheerleader',
    description: 'Encourage 50 friends with positive messages',
    category: 'social',
    rarity: 'rare',
    icon: '📣',
    color: '#F59E0B',
    unlockCondition: {
      type: 'cumulative',
      metric: 'encouragement_messages',
      value: 50,
      operator: 'gte'
    },
    xpReward: 400,
    coinReward: 200,
    isDisplayable: true,
    displayOrder: 2
  },
  
  TEAM_PLAYER: {
    id: 'team_player_badge',
    name: 'Team Player',
    description: 'Complete 10 collaborative challenges',
    category: 'social',
    rarity: 'rare',
    icon: '🤝',
    color: '#10B981',
    unlockCondition: {
      type: 'cumulative',
      metric: 'collaborative_challenges',
      value: 10,
      operator: 'gte'
    },
    xpReward: 450,
    coinReward: 225,
    isDisplayable: true,
    displayOrder: 3
  },
  
  COMMUNITY_BUILDER: {
    id: 'community_builder_badge',
    name: 'Community Builder',
    description: 'Help 25 community members with advice',
    category: 'social',
    rarity: 'epic',
    icon: '🏗️',
    color: '#EF4444',
    unlockCondition: {
      type: 'cumulative',
      metric: 'helpful_interactions',
      value: 25,
      operator: 'gte'
    },
    xpReward: 500,
    coinReward: 250,
    isDisplayable: true,
    displayOrder: 4
  },
  
  SOCIAL_BUTTERFLY: {
    id: 'social_butterfly_badge',
    name: 'Social Butterfly',
    description: 'Participate in 100 community discussions',
    category: 'social',
    rarity: 'rare',
    icon: '🦋',
    color: '#EC4899',
    unlockCondition: {
      type: 'cumulative',
      metric: 'community_participations',
      value: 100,
      operator: 'gte'
    },
    xpReward: 350,
    coinReward: 175,
    isDisplayable: true,
    displayOrder: 5
  }
};
```

### Special Badges
```typescript
const SPECIAL_BADGES = {
  FOUNDER: {
    id: 'founder_badge',
    name: 'Founder',
    description: 'One of the first 100 users to join',
    category: 'special',
    rarity: 'legendary',
    icon: '🌟',
    color: '#F59E0B',
    unlockCondition: {
      type: 'special',
      metric: 'user_registration_order',
      value: 100,
      operator: 'lte'
    },
    xpReward: 1000,
    coinReward: 500,
    isDisplayable: true,
    displayOrder: 1,
    isLimited: true
  },
  
  BETA_TESTER: {
    id: 'beta_tester_badge',
    name: 'Beta Tester',
    description: 'Participated in the beta testing program',
    category: 'special',
    rarity: 'epic',
    icon: '🧪',
    color: '#8B5CF6',
    unlockCondition: {
      type: 'special',
      metric: 'beta_participation',
      value: 1,
      operator: 'gte'
    },
    xpReward: 750,
    coinReward: 375,
    isDisplayable: true,
    displayOrder: 2,
    isLimited: true
  },
  
  PERFECTIONIST: {
    id: 'perfectionist_badge',
    name: 'Perfectionist',
    description: 'Complete 7 perfect days (all goals met)',
    category: 'special',
    rarity: 'epic',
    icon: '💎',
    color: '#10B981',
    unlockCondition: {
      type: 'streak',
      metric: 'perfect_days',
      value: 7,
      operator: 'gte'
    },
    xpReward: 800,
    coinReward: 400,
    isDisplayable: true,
    displayOrder: 3
  },
  
  SPEED_DEMON: {
    id: 'speed_demon_badge',
    name: 'Speed Demon',
    description: 'Complete 10 daily challenges in under 2 hours',
    category: 'special',
    rarity: 'rare',
    icon: '⚡',
    color: '#EF4444',
    unlockCondition: {
      type: 'cumulative',
      metric: 'fast_challenge_completions',
      value: 10,
      operator: 'gte'
    },
    xpReward: 500,
    coinReward: 250,
    isDisplayable: true,
    displayOrder: 4
  },
  
  COLLECTOR: {
    id: 'collector_badge',
    name: 'Collector',
    description: 'Unlock 50 different badges',
    category: 'special',
    rarity: 'legendary',
    icon: '🏆',
    color: '#F59E0B',
    unlockCondition: {
      type: 'cumulative',
      metric: 'badges_unlocked',
      value: 50,
      operator: 'gte'
    },
    xpReward: 1200,
    coinReward: 600,
    isDisplayable: true,
    displayOrder: 5
  }
};
```

## Title System

### Title Categories
```typescript
const TITLE_CATEGORIES = {
  NUTRITION_TITLES: {
    NOVICE_NUTRITIONIST: {
      id: 'novice_nutritionist',
      name: 'Novice Nutritionist',
      description: 'Beginner in nutrition tracking',
      category: 'nutrition',
      rarity: 'common',
      unlockCondition: {
        type: 'level',
        metric: 'nutrition_skill_level',
        value: 5,
        operator: 'gte'
      }
    },
    
    NUTRITION_ENTHUSIAST: {
      id: 'nutrition_enthusiast',
      name: 'Nutrition Enthusiast',
      description: 'Passionate about healthy eating',
      category: 'nutrition',
      rarity: 'uncommon',
      unlockCondition: {
        type: 'level',
        metric: 'nutrition_skill_level',
        value: 15,
        operator: 'gte'
      }
    },
    
    NUTRITION_EXPERT: {
      id: 'nutrition_expert',
      name: 'Nutrition Expert',
      description: 'Advanced knowledge in nutrition',
      category: 'nutrition',
      rarity: 'rare',
      unlockCondition: {
        type: 'level',
        metric: 'nutrition_skill_level',
        value: 30,
        operator: 'gte'
      }
    },
    
    NUTRITION_MASTER: {
      id: 'nutrition_master',
      name: 'Nutrition Master',
      description: 'Master of nutrition science',
      category: 'nutrition',
      rarity: 'epic',
      unlockCondition: {
        type: 'level',
        metric: 'nutrition_skill_level',
        value: 50,
        operator: 'gte'
      }
    }
  },
  
  FITNESS_TITLES: {
    FITNESS_BEGINNER: {
      id: 'fitness_beginner',
      name: 'Fitness Beginner',
      description: 'Starting your fitness journey',
      category: 'fitness',
      rarity: 'common',
      unlockCondition: {
        type: 'level',
        metric: 'fitness_skill_level',
        value: 5,
        operator: 'gte'
      }
    },
    
    FITNESS_ENTHUSIAST: {
      id: 'fitness_enthusiast',
      name: 'Fitness Enthusiast',
      description: 'Committed to physical fitness',
      category: 'fitness',
      rarity: 'uncommon',
      unlockCondition: {
        type: 'level',
        metric: 'fitness_skill_level',
        value: 15,
        operator: 'gte'
      }
    },
    
    FITNESS_WARRIOR: {
      id: 'fitness_warrior',
      name: 'Fitness Warrior',
      description: 'Dedicated fitness warrior',
      category: 'fitness',
      rarity: 'rare',
      unlockCondition: {
        type: 'level',
        metric: 'fitness_skill_level',
        value: 30,
        operator: 'gte'
      }
    },
    
    FITNESS_LEGEND: {
      id: 'fitness_legend',
      name: 'Fitness Legend',
      description: 'Legendary fitness achievement',
      category: 'fitness',
      rarity: 'epic',
      unlockCondition: {
        type: 'level',
        metric: 'fitness_skill_level',
        value: 50,
        operator: 'gte'
      }
    }
  },
  
  SOCIAL_TITLES: {
    COMMUNITY_MEMBER: {
      id: 'community_member',
      name: 'Community Member',
      description: 'Active community participant',
      category: 'social',
      rarity: 'common',
      unlockCondition: {
        type: 'cumulative',
        metric: 'community_interactions',
        value: 25,
        operator: 'gte'
      }
    },
    
    COMMUNITY_LEADER: {
      id: 'community_leader',
      name: 'Community Leader',
      description: 'Leader in the community',
      category: 'social',
      rarity: 'rare',
      unlockCondition: {
        type: 'cumulative',
        metric: 'helpful_interactions',
        value: 50,
        operator: 'gte'
      }
    },
    
    MENTOR: {
      id: 'mentor_title',
      name: 'Mentor',
      description: 'Experienced mentor and guide',
      category: 'social',
      rarity: 'epic',
      unlockCondition: {
        type: 'cumulative',
        metric: 'users_mentored',
        value: 10,
        operator: 'gte'
      }
    },
    
    COMMUNITY_LEGEND: {
      id: 'community_legend',
      name: 'Community Legend',
      description: 'Legendary community contributor',
      category: 'social',
      rarity: 'legendary',
      unlockCondition: {
        type: 'cumulative',
        metric: 'community_impact_score',
        value: 1000,
        operator: 'gte'
      }
    }
  }
};
```

## Badge Data Models

### Badge Interface
```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  category: string;
  rarity: BadgeRarity;
  icon: string;
  color: string;
  unlockCondition: UnlockCondition;
  xpReward: number;
  coinReward: number;
  isDisplayable: boolean;
  displayOrder: number;
  isLimited?: boolean;
  createdAt: Date;
}

interface Title {
  id: string;
  name: string;
  description: string;
  category: string;
  rarity: BadgeRarity;
  unlockCondition: UnlockCondition;
  isActive: boolean;
  displayOrder: number;
}

interface UnlockCondition {
  type: 'streak' | 'cumulative' | 'level' | 'special' | 'achievement';
  metric: string;
  value: number;
  operator: 'gte' | 'lte' | 'eq' | 'in';
  additionalRequirements?: string[];
}

interface UserBadge {
  badge: Badge;
  unlockedAt: Date;
  isDisplayed: boolean;
  displayOrder: number;
  isNew: boolean;
}

interface UserTitle {
  title: Title;
  unlockedAt: Date;
  isActive: boolean;
  isNew: boolean;
}

enum BadgeRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic'
}
```

## Badge Unlock System

### Badge Unlock Service
```typescript
export class BadgeUnlockService {
  static async checkBadgeUnlocks(
    userId: string,
    userData: UserData
  ): Promise<BadgeUnlockResult[]> {
    const userBadges = await this.getUserBadges(userId);
    const unlockedBadges: BadgeUnlockResult[] = [];
    
    // Check all available badges
    const allBadges = this.getAllBadges();
    
    for (const badge of allBadges) {
      // Skip if already unlocked
      if (userBadges.some(ub => ub.badge.id === badge.id)) {
        continue;
      }
      
      // Check unlock condition
      const isUnlocked = await this.checkUnlockCondition(badge.unlockCondition, userData);
      
      if (isUnlocked) {
        const userBadge = await this.unlockBadge(userId, badge);
        unlockedBadges.push({
          badge: userBadge,
          xpReward: badge.xpReward,
          coinReward: badge.coinReward,
          isNew: true
        });
      }
    }
    
    return unlockedBadges;
  }
  
  static async unlockBadge(
    userId: string,
    badge: Badge
  ): Promise<UserBadge> {
    const userBadge: UserBadge = {
      badge,
      unlockedAt: new Date(),
      isDisplayed: false,
      displayOrder: badge.displayOrder,
      isNew: true
    };
    
    // Save to database
    await this.saveUserBadge(userId, userBadge);
    
    // Award XP and coins
    await this.awardBadgeRewards(userId, badge.xpReward, badge.coinReward);
    
    // Send notification
    await this.sendBadgeUnlockNotification(userId, badge);
    
    return userBadge;
  }
  
  private static async checkUnlockCondition(
    condition: UnlockCondition,
    userData: UserData
  ): Promise<boolean> {
    let currentValue = 0;
    
    switch (condition.metric) {
      case 'macro_targets':
        currentValue = userData.consecutiveMacroDays;
        break;
      case 'daily_vegetables':
        currentValue = userData.consecutiveVeggieDays;
        break;
      case 'daily_water':
        currentValue = userData.consecutiveWaterDays;
        break;
      case 'meal_prep_sessions':
        currentValue = userData.totalMealPrepSessions;
        break;
      case 'complete_meals_logged':
        currentValue = userData.totalCompleteMeals;
        break;
      case 'daily_activity':
        currentValue = userData.currentActivityStreak;
        break;
      case 'daily_checkins':
        currentValue = userData.consecutiveCheckins;
        break;
      case 'users_mentored':
        currentValue = userData.totalUsersMentored;
        break;
      case 'encouragement_messages':
        currentValue = userData.totalEncouragementMessages;
        break;
      case 'collaborative_challenges':
        currentValue = userData.totalCollaborativeChallenges;
        break;
      case 'helpful_interactions':
        currentValue = userData.totalHelpfulInteractions;
        break;
      case 'community_participations':
        currentValue = userData.totalCommunityParticipations;
        break;
      case 'perfect_days':
        currentValue = userData.consecutivePerfectDays;
        break;
      case 'fast_challenge_completions':
        currentValue = userData.totalFastChallengeCompletions;
        break;
      case 'badges_unlocked':
        currentValue = userData.totalBadgesUnlocked;
        break;
      // Add more metrics as needed
    }
    
    switch (condition.operator) {
      case 'gte':
        return currentValue >= condition.value;
      case 'lte':
        return currentValue <= condition.value;
      case 'eq':
        return currentValue === condition.value;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(currentValue);
      default:
        return false;
    }
  }
}
```

## UI Components

### Badge Display
```typescript
interface BadgeDisplayProps {
  userBadge: UserBadge;
  onToggleDisplay: (badgeId: string) => void;
  onViewDetails: (badge: Badge) => void;
  showActions?: boolean;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({
  userBadge,
  onToggleDisplay,
  onViewDetails,
  showActions = true
}) => {
  const { badge, unlockedAt, isDisplayed, isNew } = userBadge;
  
  const getRarityColor = (rarity: BadgeRarity): string => {
    switch (rarity) {
      case BadgeRarity.COMMON: return '#6B7280';
      case BadgeRarity.UNCOMMON: return '#3B82F6';
      case BadgeRarity.RARE: return '#8B5CF6';
      case BadgeRarity.EPIC: return '#F59E0B';
      case BadgeRarity.LEGENDARY: return '#EF4444';
      case BadgeRarity.MYTHIC: return '#10B981';
      default: return '#6B7280';
    }
  };
  
  return (
    <div 
      className={`badge-display ${badge.rarity} ${isDisplayed ? 'displayed' : 'hidden'} ${isNew ? 'new' : ''}`}
      style={{
        borderColor: getRarityColor(badge.rarity),
        boxShadow: `0 0 15px ${getRarityColor(badge.rarity)}30`
      }}
    >
      <div className="badge-icon">
        <span className="icon" style={{ color: badge.color }}>
          {badge.icon}
        </span>
        {isNew && (
          <div className="new-indicator">NEW!</div>
        )}
        {badge.isLimited && (
          <div className="limited-indicator">LIMITED</div>
        )}
      </div>
      
      <div className="badge-info">
        <h3 className="badge-name">{badge.name}</h3>
        <p className="badge-description">{badge.description}</p>
        <div className="badge-meta">
          <span className="badge-category">{badge.category}</span>
          <span className="badge-rarity">{badge.rarity.toUpperCase()}</span>
          <span className="unlock-date">
            Unlocked {formatDate(unlockedAt)}
          </span>
        </div>
      </div>
      
      {showActions && (
        <div className="badge-actions">
          <button
            className={`toggle-display-btn ${isDisplayed ? 'active' : 'inactive'}`}
            onClick={() => onToggleDisplay(badge.id)}
          >
            {isDisplayed ? 'Hide' : 'Show'}
          </button>
          <button
            className="view-details-btn"
            onClick={() => onViewDetails(badge)}
          >
            Details
          </button>
        </div>
      )}
    </div>
  );
};
```

### Badge Collection
```typescript
interface BadgeCollectionProps {
  userBadges: UserBadge[];
  onBadgeAction: (action: string, badge: Badge) => void;
  filter: {
    category?: string;
    rarity?: BadgeRarity;
    status?: 'all' | 'displayed' | 'hidden' | 'new';
  };
}

const BadgeCollection: React.FC<BadgeCollectionProps> = ({
  userBadges,
  onBadgeAction,
  filter
}) => {
  const filteredBadges = userBadges.filter(userBadge => {
    const { badge, isDisplayed, isNew } = userBadge;
    
    if (filter.category && badge.category !== filter.category) return false;
    if (filter.rarity && badge.rarity !== filter.rarity) return false;
    if (filter.status === 'displayed' && !isDisplayed) return false;
    if (filter.status === 'hidden' && isDisplayed) return false;
    if (filter.status === 'new' && !isNew) return false;
    
    return true;
  });
  
  const badgesByCategory = filteredBadges.reduce((acc, userBadge) => {
    const category = userBadge.badge.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(userBadge);
    return acc;
  }, {} as Record<string, UserBadge[]>);
  
  return (
    <div className="badge-collection">
      <div className="collection-header">
        <h1>Badge Collection</h1>
        <div className="collection-stats">
          <div className="stat">
            <span className="stat-value">{userBadges.length}</span>
            <span className="stat-label">Total Badges</span>
          </div>
          <div className="stat">
            <span className="stat-value">{userBadges.filter(b => b.isDisplayed).length}</span>
            <span className="stat-label">Displayed</span>
          </div>
          <div className="stat">
            <span className="stat-value">{userBadges.filter(b => b.isNew).length}</span>
            <span className="stat-label">New</span>
          </div>
        </div>
      </div>
      
      <div className="collection-filters">
        <select 
          value={filter.category || 'all'}
          onChange={(e) => onFilterChange({ ...filter, category: e.target.value })}
        >
          <option value="all">All Categories</option>
          <option value="nutrition">Nutrition</option>
          <option value="consistency">Consistency</option>
          <option value="social">Social</option>
          <option value="special">Special</option>
        </select>
        
        <select 
          value={filter.rarity || 'all'}
          onChange={(e) => onFilterChange({ ...filter, rarity: e.target.value })}
        >
          <option value="all">All Rarities</option>
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>
        
        <select 
          value={filter.status || 'all'}
          onChange={(e) => onFilterChange({ ...filter, status: e.target.value })}
        >
          <option value="all">All Status</option>
          <option value="displayed">Displayed</option>
          <option value="hidden">Hidden</option>
          <option value="new">New</option>
        </select>
      </div>
      
      {Object.entries(badgesByCategory).map(([category, badges]) => (
        <div key={category} className="badge-category">
          <h2 className="category-title">
            {category.charAt(0).toUpperCase() + category.slice(1)} Badges
            <span className="badge-count">({badges.length})</span>
          </h2>
          <div className="badges-grid">
            {badges.map(userBadge => (
              <BadgeDisplay
                key={userBadge.badge.id}
                userBadge={userBadge}
                onToggleDisplay={(badgeId) => onBadgeAction('toggle', userBadge.badge)}
                onViewDetails={(badge) => onBadgeAction('view', badge)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

### Title Selector
```typescript
interface TitleSelectorProps {
  userTitles: UserTitle[];
  activeTitle: string;
  onTitleSelect: (titleId: string) => void;
}

const TitleSelector: React.FC<TitleSelectorProps> = ({
  userTitles,
  activeTitle,
  onTitleSelect
}) => {
  const titlesByCategory = userTitles.reduce((acc, userTitle) => {
    const category = userTitle.title.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(userTitle);
    return acc;
  }, {} as Record<string, UserTitle[]>);
  
  return (
    <div className="title-selector">
      <h2>Select Title</h2>
      
      {Object.entries(titlesByCategory).map(([category, titles]) => (
        <div key={category} className="title-category">
          <h3 className="category-title">
            {category.charAt(0).toUpperCase() + category.slice(1)} Titles
          </h3>
          <div className="titles-list">
            {titles.map(userTitle => (
              <div
                key={userTitle.title.id}
                className={`title-option ${activeTitle === userTitle.title.id ? 'active' : ''}`}
                onClick={() => onTitleSelect(userTitle.title.id)}
              >
                <span className="title-name">{userTitle.title.name}</span>
                <span className="title-description">{userTitle.title.description}</span>
                {userTitle.isNew && (
                  <span className="new-indicator">NEW!</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
```

## Integration Points

### Firestore Integration
```typescript
interface BadgeDocument {
  userId: string;
  badges: UserBadge[];
  titles: UserTitle[];
  activeTitle: string;
  displayedBadges: string[];
  lastUpdated: Timestamp;
}

const updateUserBadges = async (
  userId: string,
  badges: UserBadge[],
  titles: UserTitle[],
  activeTitle: string,
  displayedBadges: string[]
): Promise<void> => {
  const badgeDoc: BadgeDocument = {
    userId,
    badges,
    titles,
    activeTitle,
    displayedBadges,
    lastUpdated: serverTimestamp()
  };
  
  await updateDoc(doc(db, 'userBadges', userId), badgeDoc);
};
```

### Real-time Updates
```typescript
const subscribeToBadges = (
  userId: string,
  onUpdate: (badges: UserBadge[], titles: UserTitle[]) => void
): Unsubscribe => {
  return onSnapshot(
    doc(db, 'userBadges', userId),
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as BadgeDocument;
        onUpdate(data.badges, data.titles);
      }
    }
  );
};
```

## Analytics and Metrics

### Badge Analytics
```typescript
interface BadgeAnalytics {
  totalBadgesUnlocked: number;
  badgesByCategory: Record<string, number>;
  badgesByRarity: Record<BadgeRarity, number>;
  averageUnlockTime: number;
  mostPopularBadges: string[];
  badgeDisplayRate: number;
  titleUsage: Record<string, number>;
}

const calculateBadgeAnalytics = (
  userBadges: UserBadge[],
  userTitles: UserTitle[]
): BadgeAnalytics => {
  return {
    totalBadgesUnlocked: userBadges.length,
    badgesByCategory: userBadges.reduce((acc, userBadge) => {
      const category = userBadge.badge.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    badgesByRarity: userBadges.reduce((acc, userBadge) => {
      const rarity = userBadge.badge.rarity;
      acc[rarity] = (acc[rarity] || 0) + 1;
      return acc;
    }, {} as Record<BadgeRarity, number>),
    averageUnlockTime: calculateAverageUnlockTime(userBadges),
    mostPopularBadges: getMostPopularBadges(userBadges),
    badgeDisplayRate: userBadges.filter(b => b.isDisplayed).length / userBadges.length,
    titleUsage: calculateTitleUsage(userTitles)
  };
};
```

## Testing Requirements

### Unit Tests
- Badge unlock condition checking
- Title unlock validation
- Badge display management
- Reward distribution system

### Integration Tests
- Firestore badge updates
- Real-time synchronization
- Badge notification system
- UI state management

### Performance Tests
- Large badge collections
- Real-time update frequency
- Badge rendering performance
- Unlock condition evaluation

## Future Enhancements

### Advanced Features
- Badge animations and effects
- Seasonal badge events
- Badge trading system
- Badge mastery levels
- Custom badge creation

### Social Features
- Badge sharing
- Badge leaderboards
- Badge showcases
- Badge competitions
- Badge mentoring
