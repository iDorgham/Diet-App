# Quest System Specification

## EARS Requirements

**EARS-QST-001**: The system shall provide daily, weekly, and monthly quests with varying difficulty levels.

**EARS-QST-002**: The system shall generate dynamic quests based on user behavior and preferences.

**EARS-QST-003**: The system shall track quest progress and provide real-time updates.

**EARS-QST-004**: The system shall award XP, coins, and special rewards upon quest completion.

**EARS-QST-005**: The system shall implement quest chains and storylines for narrative engagement.

**EARS-QST-006**: The system shall provide quest filtering, sorting, and recommendation features.

## Quest Types and Categories

### Daily Quests
```typescript
const DAILY_QUEST_TEMPLATES = {
  MEAL_LOGGING: {
    id: 'daily_meal_logging',
    name: 'Meal Logger',
    description: 'Log all 3 meals today',
    category: 'nutrition',
    difficulty: 'easy',
    xpReward: 50,
    coinReward: 25,
    progressTarget: 3,
    timeLimit: 24, // hours
    requirements: {
      mealsLogged: 3,
      timeWindow: 'daily'
    }
  },
  WATER_CHALLENGE: {
    id: 'daily_water_challenge',
    name: 'Hydration Hero',
    description: 'Drink 8 glasses of water today',
    category: 'health',
    difficulty: 'easy',
    xpReward: 30,
    coinReward: 15,
    progressTarget: 8,
    timeLimit: 24,
    requirements: {
      waterGlasses: 8,
      timeWindow: 'daily'
    }
  },
  MACRO_TARGET: {
    id: 'daily_macro_target',
    name: 'Macro Master',
    description: 'Hit your protein target today',
    category: 'nutrition',
    difficulty: 'medium',
    xpReward: 75,
    coinReward: 40,
    progressTarget: 1,
    timeLimit: 24,
    requirements: {
      proteinTarget: 100, // percentage
      timeWindow: 'daily'
    }
  },
  EXERCISE_LOG: {
    id: 'daily_exercise_log',
    name: 'Active Lifestyle',
    description: 'Log 30 minutes of exercise',
    category: 'fitness',
    difficulty: 'medium',
    xpReward: 60,
    coinReward: 30,
    progressTarget: 30, // minutes
    timeLimit: 24,
    requirements: {
      exerciseMinutes: 30,
      timeWindow: 'daily'
    }
  }
};
```

### Weekly Quests
```typescript
const WEEKLY_QUEST_TEMPLATES = {
  CONSISTENCY_CHALLENGE: {
    id: 'weekly_consistency',
    name: 'Consistency Champion',
    description: 'Complete daily check-ins for 5 days this week',
    category: 'consistency',
    difficulty: 'medium',
    xpReward: 200,
    coinReward: 100,
    progressTarget: 5,
    timeLimit: 168, // hours (7 days)
    requirements: {
      dailyCheckins: 5,
      timeWindow: 'weekly'
    }
  },
  NUTRITION_VARIETY: {
    id: 'weekly_nutrition_variety',
    name: 'Nutrition Explorer',
    description: 'Try 7 different types of vegetables this week',
    category: 'nutrition',
    difficulty: 'medium',
    xpReward: 150,
    coinReward: 75,
    progressTarget: 7,
    timeLimit: 168,
    requirements: {
      uniqueVegetables: 7,
      timeWindow: 'weekly'
    }
  },
  SOCIAL_ENGAGEMENT: {
    id: 'weekly_social_engagement',
    name: 'Community Builder',
    description: 'Interact with 5 community posts this week',
    category: 'social',
    difficulty: 'easy',
    xpReward: 100,
    coinReward: 50,
    progressTarget: 5,
    timeLimit: 168,
    requirements: {
      communityInteractions: 5,
      timeWindow: 'weekly'
    }
  },
  FITNESS_GOAL: {
    id: 'weekly_fitness_goal',
    name: 'Fitness Warrior',
    description: 'Complete 3 workout sessions this week',
    category: 'fitness',
    difficulty: 'hard',
    xpReward: 300,
    coinReward: 150,
    progressTarget: 3,
    timeLimit: 168,
    requirements: {
      workoutSessions: 3,
      timeWindow: 'weekly'
    }
  }
};
```

### Monthly Quests
```typescript
const MONTHLY_QUEST_TEMPLATES = {
  TRANSFORMATION_CHALLENGE: {
    id: 'monthly_transformation',
    name: 'Monthly Transformation',
    description: 'Complete 20 days of perfect nutrition this month',
    category: 'transformation',
    difficulty: 'epic',
    xpReward: 1000,
    coinReward: 500,
    progressTarget: 20,
    timeLimit: 720, // hours (30 days)
    requirements: {
      perfectNutritionDays: 20,
      timeWindow: 'monthly'
    }
  },
  HABIT_FORMATION: {
    id: 'monthly_habit_formation',
    name: 'Habit Master',
    description: 'Maintain a 15-day streak this month',
    category: 'consistency',
    difficulty: 'hard',
    xpReward: 600,
    coinReward: 300,
    progressTarget: 15,
    timeLimit: 720,
    requirements: {
      streakDays: 15,
      timeWindow: 'monthly'
    }
  },
  KNOWLEDGE_SEEKER: {
    id: 'monthly_knowledge_seeker',
    name: 'Knowledge Seeker',
    description: 'Complete 10 AI coaching sessions this month',
    category: 'learning',
    difficulty: 'medium',
    xpReward: 400,
    coinReward: 200,
    progressTarget: 10,
    timeLimit: 720,
    requirements: {
      aiCoachingSessions: 10,
      timeWindow: 'monthly'
    }
  }
};
```

## Quest Difficulty System

### Difficulty Levels
```typescript
enum QuestDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

const DIFFICULTY_CONFIG = {
  [QuestDifficulty.EASY]: {
    xpMultiplier: 1.0,
    coinMultiplier: 1.0,
    completionRate: 0.8,
    color: '#10B981', // Green
    icon: '🟢'
  },
  [QuestDifficulty.MEDIUM]: {
    xpMultiplier: 1.5,
    coinMultiplier: 1.5,
    completionRate: 0.6,
    color: '#F59E0B', // Yellow
    icon: '🟡'
  },
  [QuestDifficulty.HARD]: {
    xpMultiplier: 2.0,
    coinMultiplier: 2.0,
    completionRate: 0.4,
    color: '#EF4444', // Red
    icon: '🔴'
  },
  [QuestDifficulty.EPIC]: {
    xpMultiplier: 3.0,
    coinMultiplier: 3.0,
    completionRate: 0.2,
    color: '#8B5CF6', // Purple
    icon: '🟣'
  },
  [QuestDifficulty.LEGENDARY]: {
    xpMultiplier: 5.0,
    coinMultiplier: 5.0,
    completionRate: 0.1,
    color: '#F59E0B', // Gold
    icon: '⭐'
  }
};
```

## Quest Data Models

### Quest Interface
```typescript
interface Quest {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: QuestDifficulty;
  type: 'daily' | 'weekly' | 'monthly';
  xpReward: number;
  coinReward: number;
  progressTarget: number;
  timeLimit: number; // hours
  requirements: QuestRequirements;
  rewards: QuestReward[];
  prerequisites?: string[];
  isRepeatable: boolean;
  maxCompletions?: number;
  createdAt: Date;
  expiresAt: Date;
}

interface QuestRequirements {
  [key: string]: any;
  timeWindow: 'daily' | 'weekly' | 'monthly';
}

interface QuestReward {
  type: 'xp' | 'coins' | 'item' | 'badge' | 'recipe';
  amount?: number;
  itemId?: string;
  badgeId?: string;
  recipeId?: string;
}

interface UserQuest {
  quest: Quest;
  progress: QuestProgress;
  status: QuestStatus;
  startedAt: Date;
  completedAt?: Date;
  isNew: boolean;
}

interface QuestProgress {
  currentProgress: number;
  targetProgress: number;
  progressPercentage: number;
  isCompleted: boolean;
  lastUpdated: Date;
}

enum QuestStatus {
  AVAILABLE = 'available',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  FAILED = 'failed'
}
```

## Dynamic Quest Generation

### Quest Generator
```typescript
class QuestGenerator {
  private userProfile: UserProfile;
  private userHistory: UserHistory;
  private questTemplates: QuestTemplate[];
  
  constructor(userProfile: UserProfile, userHistory: UserHistory) {
    this.userProfile = userProfile;
    this.userHistory = userHistory;
    this.questTemplates = this.loadQuestTemplates();
  }
  
  generateDailyQuests(): Quest[] {
    const availableQuests: Quest[] = [];
    const userPreferences = this.userProfile.preferences;
    const recentActivity = this.userHistory.getRecentActivity(7); // last 7 days
    
    // Generate personalized quests based on user behavior
    if (userPreferences.focusAreas.includes('nutrition')) {
      availableQuests.push(this.generateNutritionQuest());
    }
    
    if (userPreferences.focusAreas.includes('fitness')) {
      availableQuests.push(this.generateFitnessQuest());
    }
    
    // Generate quests to address weak areas
    const weakAreas = this.identifyWeakAreas(recentActivity);
    weakAreas.forEach(area => {
      availableQuests.push(this.generateImprovementQuest(area));
    });
    
    // Add random quests for variety
    availableQuests.push(this.generateRandomQuest());
    
    return availableQuests.slice(0, 3); // Limit to 3 daily quests
  }
  
  generateWeeklyQuests(): Quest[] {
    const availableQuests: Quest[] = [];
    const userGoals = this.userProfile.goals;
    
    // Generate quests aligned with user goals
    userGoals.forEach(goal => {
      availableQuests.push(this.generateGoalAlignedQuest(goal));
    });
    
    // Add consistency and social quests
    availableQuests.push(this.generateConsistencyQuest());
    availableQuests.push(this.generateSocialQuest());
    
    return availableQuests.slice(0, 2); // Limit to 2 weekly quests
  }
  
  generateMonthlyQuests(): Quest[] {
    const availableQuests: Quest[] = [];
    const userLevel = this.userProfile.level;
    
    // Generate quests appropriate for user level
    if (userLevel >= 5) {
      availableQuests.push(this.generateTransformationQuest());
    }
    
    if (userLevel >= 3) {
      availableQuests.push(this.generateHabitFormationQuest());
    }
    
    return availableQuests.slice(0, 1); // Limit to 1 monthly quest
  }
  
  private generateNutritionQuest(): Quest {
    const templates = DAILY_QUEST_TEMPLATES;
    const template = templates.MEAL_LOGGING;
    
    return {
      ...template,
      id: `daily_meal_logging_${Date.now()}`,
      xpReward: Math.floor(template.xpReward * this.getDifficultyMultiplier()),
      coinReward: Math.floor(template.coinReward * this.getDifficultyMultiplier()),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + template.timeLimit * 60 * 60 * 1000)
    };
  }
  
  private getDifficultyMultiplier(): number {
    const userLevel = this.userProfile.level;
    return Math.min(1 + (userLevel * 0.1), 2.0); // Cap at 2x multiplier
  }
}
```

## Quest Progress Tracking

### Progress Calculator
```typescript
class QuestProgressCalculator {
  calculateProgress(quest: Quest, userData: UserData): QuestProgress {
    let currentProgress = 0;
    
    switch (quest.id) {
      case 'daily_meal_logging':
        currentProgress = userData.todayMealsLogged;
        break;
      case 'daily_water_challenge':
        currentProgress = userData.todayWaterGlasses;
        break;
      case 'weekly_consistency':
        currentProgress = userData.weeklyCheckins;
        break;
      case 'monthly_transformation':
        currentProgress = userData.monthlyPerfectDays;
        break;
      // Add more cases as needed
    }
    
    const progressPercentage = Math.min(
      (currentProgress / quest.progressTarget) * 100,
      100
    );
    
    const isCompleted = currentProgress >= quest.progressTarget;
    
    return {
      currentProgress,
      targetProgress: quest.progressTarget,
      progressPercentage,
      isCompleted,
      lastUpdated: new Date()
    };
  }
  
  updateQuestProgress(userQuests: UserQuest[], userData: UserData): UserQuest[] {
    return userQuests.map(userQuest => {
      if (userQuest.status === QuestStatus.COMPLETED) {
        return userQuest;
      }
      
      const newProgress = this.calculateProgress(userQuest.quest, userData);
      
      return {
        ...userQuest,
        progress: newProgress,
        status: newProgress.isCompleted ? QuestStatus.COMPLETED : userQuest.status
      };
    });
  }
}
```

## Quest Completion System

### Quest Completion Handler
```typescript
class QuestCompletionHandler {
  async completeQuest(
    userQuest: UserQuest,
    userProfile: UserProfile,
    onReward: (rewards: QuestReward[]) => void
  ): Promise<void> {
    if (userQuest.status !== QuestStatus.COMPLETED) {
      throw new Error('Quest is not completed');
    }
    
    const quest = userQuest.quest;
    const rewards = this.calculateRewards(quest, userProfile);
    
    // Award rewards
    await this.awardRewards(rewards, userProfile);
    
    // Update quest status
    userQuest.status = QuestStatus.COMPLETED;
    userQuest.completedAt = new Date();
    
    // Trigger reward notification
    onReward(rewards);
    
    // Log completion
    await this.logQuestCompletion(userQuest, rewards);
  }
  
  private calculateRewards(quest: Quest, userProfile: UserProfile): QuestReward[] {
    const difficultyConfig = DIFFICULTY_CONFIG[quest.difficulty];
    const levelMultiplier = 1 + (userProfile.level * 0.05);
    
    const rewards: QuestReward[] = [
      {
        type: 'xp',
        amount: Math.floor(quest.xpReward * difficultyConfig.xpMultiplier * levelMultiplier)
      },
      {
        type: 'coins',
        amount: Math.floor(quest.coinReward * difficultyConfig.coinMultiplier * levelMultiplier)
      }
    ];
    
    // Add special rewards for epic/legendary quests
    if (quest.difficulty === QuestDifficulty.EPIC || quest.difficulty === QuestDifficulty.LEGENDARY) {
      rewards.push({
        type: 'badge',
        badgeId: `quest_${quest.difficulty}_${quest.category}`
      });
    }
    
    return rewards;
  }
  
  private async awardRewards(rewards: QuestReward[], userProfile: UserProfile): Promise<void> {
    for (const reward of rewards) {
      switch (reward.type) {
        case 'xp':
          await this.addXP(reward.amount!, userProfile.userId);
          break;
        case 'coins':
          await this.addCoins(reward.amount!, userProfile.userId);
          break;
        case 'badge':
          await this.unlockBadge(reward.badgeId!, userProfile.userId);
          break;
        case 'recipe':
          await this.unlockRecipe(reward.recipeId!, userProfile.userId);
          break;
      }
    }
  }
}
```

## Quest UI Components

### Quest Card
```typescript
interface QuestCardProps {
  userQuest: UserQuest;
  onStart: (quest: Quest) => void;
  onComplete: (quest: Quest) => void;
  onViewDetails: (quest: Quest) => void;
}

const QuestCard: React.FC<QuestCardProps> = ({
  userQuest,
  onStart,
  onComplete,
  onViewDetails
}) => {
  const { quest, progress, status } = userQuest;
  const difficultyConfig = DIFFICULTY_CONFIG[quest.difficulty];
  
  const getStatusColor = (status: QuestStatus): string => {
    switch (status) {
      case QuestStatus.AVAILABLE: return '#6B7280';
      case QuestStatus.ACTIVE: return '#3B82F6';
      case QuestStatus.COMPLETED: return '#10B981';
      case QuestStatus.EXPIRED: return '#EF4444';
      default: return '#6B7280';
    }
  };
  
  return (
    <div 
      className={`quest-card ${quest.difficulty} ${status}`}
      style={{
        borderColor: difficultyConfig.color,
        boxShadow: `0 0 15px ${difficultyConfig.color}30`
      }}
    >
      <div className="quest-header">
        <div className="quest-info">
          <h3 className="quest-name">{quest.name}</h3>
          <div className="quest-meta">
            <span className="quest-type">{quest.type}</span>
            <span className="quest-difficulty">
              {difficultyConfig.icon} {quest.difficulty}
            </span>
            <span className="quest-category">{quest.category}</span>
          </div>
        </div>
        
        <div className="quest-rewards">
          <span className="xp-reward">+{quest.xpReward} XP</span>
          <span className="coin-reward">+{quest.coinReward} 🪙</span>
        </div>
      </div>
      
      <p className="quest-description">{quest.description}</p>
      
      {status === QuestStatus.ACTIVE && (
        <div className="quest-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${progress.progressPercentage}%`,
                backgroundColor: difficultyConfig.color
              }}
            />
          </div>
          <span className="progress-text">
            {progress.currentProgress} / {progress.targetProgress}
          </span>
        </div>
      )}
      
      <div className="quest-actions">
        {status === QuestStatus.AVAILABLE && (
          <button 
            className="start-quest-btn"
            onClick={() => onStart(quest)}
          >
            Start Quest
          </button>
        )}
        
        {status === QuestStatus.ACTIVE && progress.isCompleted && (
          <button 
            className="complete-quest-btn"
            onClick={() => onComplete(quest)}
          >
            Complete Quest
          </button>
        )}
        
        <button 
          className="view-details-btn"
          onClick={() => onViewDetails(quest)}
        >
          View Details
        </button>
      </div>
      
      <div className="quest-timer">
        <span>⏰ {this.formatTimeRemaining(quest.expiresAt)}</span>
      </div>
    </div>
  );
};
```

### Quest Board
```typescript
interface QuestBoardProps {
  userQuests: UserQuest[];
  onQuestAction: (action: string, quest: Quest) => void;
  filter: {
    type?: 'daily' | 'weekly' | 'monthly';
    status?: QuestStatus;
    difficulty?: QuestDifficulty;
  };
}

const QuestBoard: React.FC<QuestBoardProps> = ({
  userQuests,
  onQuestAction,
  filter
}) => {
  const filteredQuests = userQuests.filter(userQuest => {
    const { quest, status } = userQuest;
    
    if (filter.type && quest.type !== filter.type) return false;
    if (filter.status && status !== filter.status) return false;
    if (filter.difficulty && quest.difficulty !== filter.difficulty) return false;
    
    return true;
  });
  
  const questsByType = filteredQuests.reduce((acc, userQuest) => {
    const type = userQuest.quest.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(userQuest);
    return acc;
  }, {} as Record<string, UserQuest[]>);
  
  return (
    <div className="quest-board">
      <div className="quest-filters">
        <select 
          value={filter.type || 'all'}
          onChange={(e) => onFilterChange({ ...filter, type: e.target.value })}
        >
          <option value="all">All Types</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
        
        <select 
          value={filter.status || 'all'}
          onChange={(e) => onFilterChange({ ...filter, status: e.target.value })}
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      {Object.entries(questsByType).map(([type, quests]) => (
        <div key={type} className="quest-section">
          <h2 className="section-title">
            {type.charAt(0).toUpperCase() + type.slice(1)} Quests
          </h2>
          <div className="quests-grid">
            {quests.map(userQuest => (
              <QuestCard
                key={userQuest.quest.id}
                userQuest={userQuest}
                onStart={(quest) => onQuestAction('start', quest)}
                onComplete={(quest) => onQuestAction('complete', quest)}
                onViewDetails={(quest) => onQuestAction('view', quest)}
              />
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
interface QuestDocument {
  userId: string;
  activeQuests: UserQuest[];
  completedQuests: UserQuest[];
  questHistory: QuestCompletion[];
  lastUpdated: Timestamp;
}

const updateUserQuests = async (
  userId: string,
  userQuests: UserQuest[]
): Promise<void> => {
  const questDoc: QuestDocument = {
    userId,
    activeQuests: userQuests.filter(q => q.status === QuestStatus.ACTIVE),
    completedQuests: userQuests.filter(q => q.status === QuestStatus.COMPLETED),
    questHistory: await getQuestHistory(userId),
    lastUpdated: serverTimestamp()
  };
  
  await updateDoc(doc(db, 'userQuests', userId), questDoc);
};
```

### Real-time Updates
```typescript
const subscribeToQuests = (
  userId: string,
  onUpdate: (quests: UserQuest[]) => void
): Unsubscribe => {
  return onSnapshot(
    doc(db, 'userQuests', userId),
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as QuestDocument;
        const allQuests = [...data.activeQuests, ...data.completedQuests];
        onUpdate(allQuests);
      }
    }
  );
};
```

## Analytics and Metrics

### Quest Analytics
```typescript
interface QuestAnalytics {
  totalQuestsCompleted: number;
  averageCompletionTime: number;
  questTypeBreakdown: Record<string, number>;
  difficultyBreakdown: Record<QuestDifficulty, number>;
  completionRate: number;
  userEngagementScore: number;
}

const calculateQuestAnalytics = (
  userQuests: UserQuest[]
): QuestAnalytics => {
  const completedQuests = userQuests.filter(q => q.status === QuestStatus.COMPLETED);
  
  return {
    totalQuestsCompleted: completedQuests.length,
    averageCompletionTime: calculateAverageCompletionTime(completedQuests),
    questTypeBreakdown: completedQuests.reduce((acc, quest) => {
      const type = quest.quest.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    difficultyBreakdown: completedQuests.reduce((acc, quest) => {
      const difficulty = quest.quest.difficulty;
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {} as Record<QuestDifficulty, number>),
    completionRate: calculateCompletionRate(userQuests),
    userEngagementScore: calculateEngagementScore(userQuests)
  };
};
```

## Testing Requirements

### Unit Tests
- Quest generation algorithms
- Progress calculation logic
- Reward distribution system
- Quest completion validation

### Integration Tests
- Firestore quest updates
- Real-time synchronization
- Quest notification system
- UI state management

### Performance Tests
- Large quest collections
- Real-time update frequency
- Quest generation performance
- Progress calculation efficiency

## Future Enhancements

### Advanced Features
- Quest chains and storylines
- Seasonal quest events
- Community quest challenges
- AI-generated personalized quests
- Quest trading system

### Social Features
- Quest sharing and collaboration
- Quest leaderboards
- Quest mentoring
- Quest guilds
- Quest competitions
