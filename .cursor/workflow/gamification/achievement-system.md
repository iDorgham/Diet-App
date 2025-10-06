# Achievement System Specification

## EARS Requirements

**EARS-ACH-001**: The system shall provide unlockable achievements for various dietary and behavioral milestones.

**EARS-ACH-002**: The system shall categorize achievements by type, rarity, and difficulty level.

**EARS-ACH-003**: The system shall track achievement progress and provide visual progress indicators.

**EARS-ACH-004**: The system shall award XP and coins upon achievement completion.

**EARS-ACH-005**: The system shall display achievement unlock notifications with celebration animations.

**EARS-ACH-006**: The system shall maintain an achievement gallery with filtering and search capabilities.

## Achievement Categories

### Nutrition Achievements
```typescript
const NUTRITION_ACHIEVEMENTS = {
  MEAL_LOGGER: {
    id: 'meal_logger_10',
    name: 'Meal Logger',
    description: 'Log 10 meals',
    category: 'nutrition',
    rarity: 'common',
    xpReward: 100,
    coinReward: 50,
    progressTarget: 10,
    icon: '🍽️'
  },
  NUTRITION_EXPERT: {
    id: 'nutrition_expert_100',
    name: 'Nutrition Expert',
    description: 'Log 100 meals with complete nutritional data',
    category: 'nutrition',
    rarity: 'epic',
    xpReward: 500,
    coinReward: 250,
    progressTarget: 100,
    icon: '🥗'
  },
  MACRO_MASTER: {
    id: 'macro_master_30',
    name: 'Macro Master',
    description: 'Hit your macro targets for 30 consecutive days',
    category: 'nutrition',
    rarity: 'legendary',
    xpReward: 1000,
    coinReward: 500,
    progressTarget: 30,
    icon: '📊'
  }
};
```

### Consistency Achievements
```typescript
const CONSISTENCY_ACHIEVEMENTS = {
  STREAK_STARTER: {
    id: 'streak_starter_3',
    name: 'Streak Starter',
    description: 'Maintain a 3-day activity streak',
    category: 'consistency',
    rarity: 'common',
    xpReward: 75,
    coinReward: 25,
    progressTarget: 3,
    icon: '🔥'
  },
  STREAK_MASTER: {
    id: 'streak_master_30',
    name: 'Streak Master',
    description: 'Maintain a 30-day activity streak',
    category: 'consistency',
    rarity: 'legendary',
    xpReward: 1500,
    coinReward: 750,
    progressTarget: 30,
    icon: '👑'
  },
  DAILY_WARRIOR: {
    id: 'daily_warrior_100',
    name: 'Daily Warrior',
    description: 'Complete daily check-ins for 100 days',
    category: 'consistency',
    rarity: 'epic',
    xpReward: 800,
    coinReward: 400,
    progressTarget: 100,
    icon: '⚔️'
  }
};
```

### Social Achievements
```typescript
const SOCIAL_ACHIEVEMENTS = {
  COMMUNITY_HELPER: {
    id: 'community_helper_10',
    name: 'Community Helper',
    description: 'Help 10 community members with advice',
    category: 'social',
    rarity: 'rare',
    xpReward: 300,
    coinReward: 150,
    progressTarget: 10,
    icon: '🤝'
  },
  MENTOR: {
    id: 'mentor_5',
    name: 'Mentor',
    description: 'Successfully mentor 5 new users',
    category: 'social',
    rarity: 'epic',
    xpReward: 600,
    coinReward: 300,
    progressTarget: 5,
    icon: '🎓'
  },
  SOCIAL_BUTTERFLY: {
    id: 'social_butterfly_50',
    name: 'Social Butterfly',
    description: 'Participate in 50 community discussions',
    category: 'social',
    rarity: 'rare',
    xpReward: 400,
    coinReward: 200,
    progressTarget: 50,
    icon: '🦋'
  }
};
```

### Challenge Achievements
```typescript
const CHALLENGE_ACHIEVEMENTS = {
  QUEST_COMPLETER: {
    id: 'quest_completer_10',
    name: 'Quest Completer',
    description: 'Complete 10 daily quests',
    category: 'challenge',
    rarity: 'common',
    xpReward: 200,
    coinReward: 100,
    progressTarget: 10,
    icon: '✅'
  },
  WEEKLY_CHAMPION: {
    id: 'weekly_champion_4',
    name: 'Weekly Champion',
    description: 'Complete 4 weekly challenges',
    category: 'challenge',
    rarity: 'rare',
    xpReward: 500,
    coinReward: 250,
    progressTarget: 4,
    icon: '🏆'
  },
  PERFECTIONIST: {
    id: 'perfectionist_7',
    name: 'Perfectionist',
    description: 'Complete 7 perfect days (all goals met)',
    category: 'challenge',
    rarity: 'epic',
    xpReward: 700,
    coinReward: 350,
    progressTarget: 7,
    icon: '💎'
  }
};
```

## Rarity System

### Rarity Tiers
```typescript
enum AchievementRarity {
  COMMON = 'common',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic'
}

const RARITY_CONFIG = {
  [AchievementRarity.COMMON]: {
    color: '#6B7280',      // Gray
    glowColor: '#9CA3AF',
    borderColor: '#D1D5DB',
    multiplier: 1.0,
    dropRate: 0.6
  },
  [AchievementRarity.RARE]: {
    color: '#3B82F6',      // Blue
    glowColor: '#60A5FA',
    borderColor: '#93C5FD',
    multiplier: 1.5,
    dropRate: 0.25
  },
  [AchievementRarity.EPIC]: {
    color: '#8B5CF6',      // Purple
    glowColor: '#A78BFA',
    borderColor: '#C4B5FD',
    multiplier: 2.0,
    dropRate: 0.12
  },
  [AchievementRarity.LEGENDARY]: {
    color: '#F59E0B',      // Orange
    glowColor: '#FBBF24',
    borderColor: '#FCD34D',
    multiplier: 3.0,
    dropRate: 0.025
  },
  [AchievementRarity.MYTHIC]: {
    color: '#EF4444',      // Red
    glowColor: '#F87171',
    borderColor: '#FCA5A5',
    multiplier: 5.0,
    dropRate: 0.005
  }
};
```

## Achievement Progress Tracking

### Progress Interface
```typescript
interface AchievementProgress {
  achievementId: string;
  currentProgress: number;
  targetProgress: number;
  isCompleted: boolean;
  completedAt?: Date;
  progressPercentage: number;
}

interface UserAchievement {
  id: string;
  name: string;
  description: string;
  category: string;
  rarity: AchievementRarity;
  xpReward: number;
  coinReward: number;
  icon: string;
  progress: AchievementProgress;
  unlockedAt?: Date;
  isNew: boolean;
}
```

### Progress Calculation
```typescript
const calculateAchievementProgress = (
  achievement: Achievement,
  userData: UserData
): AchievementProgress => {
  let currentProgress = 0;
  
  switch (achievement.id) {
    case 'meal_logger_10':
      currentProgress = userData.totalMealsLogged;
      break;
    case 'streak_master_30':
      currentProgress = userData.currentStreak;
      break;
    case 'macro_master_30':
      currentProgress = userData.consecutiveMacroDays;
      break;
    // Add more cases as needed
  }
  
  const isCompleted = currentProgress >= achievement.progressTarget;
  const progressPercentage = Math.min(
    (currentProgress / achievement.progressTarget) * 100,
    100
  );
  
  return {
    achievementId: achievement.id,
    currentProgress,
    targetProgress: achievement.progressTarget,
    isCompleted,
    progressPercentage
  };
};
```

## Achievement Unlock System

### Unlock Detection
```typescript
const checkAchievementUnlocks = (
  userAchievements: UserAchievement[],
  userData: UserData,
  onUnlock: (achievement: UserAchievement) => void
): UserAchievement[] => {
  const updatedAchievements = userAchievements.map(achievement => {
    if (achievement.progress.isCompleted) {
      return achievement;
    }
    
    const newProgress = calculateAchievementProgress(
      achievement,
      userData
    );
    
    if (newProgress.isCompleted && !achievement.progress.isCompleted) {
      const unlockedAchievement = {
        ...achievement,
        progress: newProgress,
        unlockedAt: new Date(),
        isNew: true
      };
      
      // Award XP and coins
      awardAchievementRewards(unlockedAchievement);
      
      // Trigger unlock notification
      onUnlock(unlockedAchievement);
      
      return unlockedAchievement;
    }
    
    return {
      ...achievement,
      progress: newProgress
    };
  });
  
  return updatedAchievements;
};
```

### Reward System
```typescript
const awardAchievementRewards = (achievement: UserAchievement): void => {
  const { xpReward, coinReward, rarity } = achievement;
  
  // Apply rarity multiplier
  const rarityMultiplier = RARITY_CONFIG[rarity].multiplier;
  const finalXPReward = Math.floor(xpReward * rarityMultiplier);
  const finalCoinReward = Math.floor(coinReward * rarityMultiplier);
  
  // Award XP and coins
  addXP(finalXPReward);
  addCoins(finalCoinReward);
  
  // Log achievement unlock
  logAchievementUnlock(achievement, finalXPReward, finalCoinReward);
};
```

## UI Components

### Achievement Card
```typescript
interface AchievementCardProps {
  achievement: UserAchievement;
  onViewDetails: (achievement: UserAchievement) => void;
  showProgress?: boolean;
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  achievement,
  onViewDetails,
  showProgress = true
}) => {
  const rarityConfig = RARITY_CONFIG[achievement.rarity];
  const { progress } = achievement;
  
  return (
    <div 
      className={`achievement-card ${achievement.rarity} ${
        progress.isCompleted ? 'completed' : 'in-progress'
      } ${achievement.isNew ? 'new-achievement' : ''}`}
      style={{
        borderColor: rarityConfig.borderColor,
        boxShadow: `0 0 20px ${rarityConfig.glowColor}40`
      }}
      onClick={() => onViewDetails(achievement)}
    >
      <div className="achievement-icon">
        <span className="icon">{achievement.icon}</span>
        {achievement.isNew && (
          <div className="new-badge">NEW!</div>
        )}
      </div>
      
      <div className="achievement-content">
        <h3 className="achievement-name">{achievement.name}</h3>
        <p className="achievement-description">{achievement.description}</p>
        
        {showProgress && !progress.isCompleted && (
          <div className="progress-section">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress.progressPercentage}%` }}
              />
            </div>
            <span className="progress-text">
              {progress.currentProgress} / {progress.targetProgress}
            </span>
          </div>
        )}
        
        <div className="achievement-rewards">
          <span className="xp-reward">+{achievement.xpReward} XP</span>
          <span className="coin-reward">+{achievement.coinReward} 🪙</span>
        </div>
      </div>
    </div>
  );
};
```

### Achievement Gallery
```typescript
interface AchievementGalleryProps {
  achievements: UserAchievement[];
  filter: {
    category?: string;
    rarity?: AchievementRarity;
    status?: 'all' | 'completed' | 'in-progress';
  };
  onFilterChange: (filter: any) => void;
}

const AchievementGallery: React.FC<AchievementGalleryProps> = ({
  achievements,
  filter,
  onFilterChange
}) => {
  const filteredAchievements = achievements.filter(achievement => {
    if (filter.category && achievement.category !== filter.category) {
      return false;
    }
    if (filter.rarity && achievement.rarity !== filter.rarity) {
      return false;
    }
    if (filter.status === 'completed' && !achievement.progress.isCompleted) {
      return false;
    }
    if (filter.status === 'in-progress' && achievement.progress.isCompleted) {
      return false;
    }
    return true;
  });
  
  return (
    <div className="achievement-gallery">
      <div className="gallery-filters">
        <select 
          value={filter.category || 'all'}
          onChange={(e) => onFilterChange({ ...filter, category: e.target.value })
        >
          <option value="all">All Categories</option>
          <option value="nutrition">Nutrition</option>
          <option value="consistency">Consistency</option>
          <option value="social">Social</option>
          <option value="challenge">Challenge</option>
        </select>
        
        <select 
          value={filter.rarity || 'all'}
          onChange={(e) => onFilterChange({ ...filter, rarity: e.target.value })
        >
          <option value="all">All Rarities</option>
          <option value="common">Common</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
          <option value="mythic">Mythic</option>
        </select>
      </div>
      
      <div className="achievements-grid">
        {filteredAchievements.map(achievement => (
          <AchievementCard
            key={achievement.id}
            achievement={achievement}
            onViewDetails={(achievement) => {
              // Show achievement details modal
            }}
          />
        ))}
      </div>
    </div>
  );
};
```

## Integration Points

### Firestore Integration
```typescript
interface AchievementDocument {
  userId: string;
  achievements: UserAchievement[];
  totalAchievements: number;
  completedAchievements: number;
  lastUpdated: Timestamp;
}

const updateUserAchievements = async (
  userId: string,
  achievements: UserAchievement[]
): Promise<void> => {
  const achievementDoc: AchievementDocument = {
    userId,
    achievements,
    totalAchievements: achievements.length,
    completedAchievements: achievements.filter(a => a.progress.isCompleted).length,
    lastUpdated: serverTimestamp()
  };
  
  await updateDoc(doc(db, 'userAchievements', userId), achievementDoc);
};
```

### Real-time Updates
```typescript
const subscribeToAchievements = (
  userId: string,
  onUpdate: (achievements: UserAchievement[]) => void
): Unsubscribe => {
  return onSnapshot(
    doc(db, 'userAchievements', userId),
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as AchievementDocument;
        onUpdate(data.achievements);
      }
    }
  );
};
```

## Analytics and Metrics

### Achievement Analytics
```typescript
interface AchievementAnalytics {
  totalUnlocked: number;
  categoryBreakdown: Record<string, number>;
  rarityBreakdown: Record<AchievementRarity, number>;
  averageCompletionTime: number;
  mostPopularAchievements: string[];
  userEngagementScore: number;
}

const calculateAchievementAnalytics = (
  achievements: UserAchievement[]
): AchievementAnalytics => {
  const completed = achievements.filter(a => a.progress.isCompleted);
  
  return {
    totalUnlocked: completed.length,
    categoryBreakdown: completed.reduce((acc, achievement) => {
      acc[achievement.category] = (acc[achievement.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    rarityBreakdown: completed.reduce((acc, achievement) => {
      acc[achievement.rarity] = (acc[achievement.rarity] || 0) + 1;
      return acc;
    }, {} as Record<AchievementRarity, number>),
    averageCompletionTime: calculateAverageCompletionTime(completed),
    mostPopularAchievements: getMostPopularAchievements(completed),
    userEngagementScore: calculateEngagementScore(achievements)
  };
};
```

## Testing Requirements

### Unit Tests
- Achievement progress calculation
- Rarity system and multipliers
- Unlock detection logic
- Reward distribution

### Integration Tests
- Firestore achievement updates
- Real-time synchronization
- Achievement notification system
- UI state management

### Performance Tests
- Large achievement collections
- Real-time update frequency
- Achievement gallery rendering
- Progress calculation performance

## Future Enhancements

### Advanced Features
- Achievement sets and collections
- Seasonal achievement events
- Community achievement challenges
- Achievement trading system
- Achievement mastery levels

### Social Features
- Achievement sharing
- Achievement leaderboards
- Achievement mentoring
- Achievement guilds
- Achievement competitions
