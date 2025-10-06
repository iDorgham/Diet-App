# Challenge System Specification

## EARS Requirements

**EARS-CHL-001**: The system shall provide daily and weekly challenges with varying difficulty levels.

**EARS-CHL-002**: The system shall generate personalized challenges based on user behavior and preferences.

**EARS-CHL-003**: The system shall track challenge progress and provide real-time updates.

**EARS-CHL-004**: The system shall award XP, coins, and special rewards upon challenge completion.

**EARS-CHL-005**: The system shall implement challenge streaks and bonus multipliers.

**EARS-CHL-006**: The system shall provide social challenges and team competitions.

## Challenge Types and Categories

### Daily Challenges
```typescript
const DAILY_CHALLENGES = {
  WATER_CHAMPION: {
    id: 'water_champion_daily',
    name: 'Water Champion',
    description: 'Drink 8 glasses of water today',
    category: 'health',
    difficulty: 'easy',
    xpReward: 50,
    coinReward: 25,
    progressTarget: 8,
    timeLimit: 24, // hours
    requirements: {
      waterGlasses: 8,
      timeWindow: 'daily',
      trackingMethod: 'manual_logging'
    },
    streakBonus: {
      multiplier: 1.1,
      maxStreak: 7
    }
  },
  
  VEGGIE_HERO: {
    id: 'veggie_hero_daily',
    name: 'Veggie Hero',
    description: 'Eat 5 different vegetables today',
    category: 'nutrition',
    difficulty: 'medium',
    xpReward: 75,
    coinReward: 40,
    progressTarget: 5,
    timeLimit: 24,
    requirements: {
      uniqueVegetables: 5,
      timeWindow: 'daily',
      trackingMethod: 'meal_logging'
    },
    streakBonus: {
      multiplier: 1.15,
      maxStreak: 5
    }
  },
  
  STEP_MASTER: {
    id: 'step_master_daily',
    name: 'Step Master',
    description: 'Walk 10,000 steps today',
    category: 'fitness',
    difficulty: 'medium',
    xpReward: 60,
    coinReward: 30,
    progressTarget: 10000,
    timeLimit: 24,
    requirements: {
      steps: 10000,
      timeWindow: 'daily',
      trackingMethod: 'fitness_tracker'
    },
    streakBonus: {
      multiplier: 1.2,
      maxStreak: 10
    }
  },
  
  MACRO_MASTER: {
    id: 'macro_master_daily',
    name: 'Macro Master',
    description: 'Hit your protein target today',
    category: 'nutrition',
    difficulty: 'hard',
    xpReward: 100,
    coinReward: 50,
    progressTarget: 1,
    timeLimit: 24,
    requirements: {
      proteinTarget: 100, // percentage
      timeWindow: 'daily',
      trackingMethod: 'macro_tracking'
    },
    streakBonus: {
      multiplier: 1.25,
      maxStreak: 14
    }
  },
  
  EARLY_BIRD: {
    id: 'early_bird_daily',
    name: 'Early Bird',
    description: 'Complete your first meal before 9 AM',
    category: 'lifestyle',
    difficulty: 'easy',
    xpReward: 40,
    coinReward: 20,
    progressTarget: 1,
    timeLimit: 24,
    requirements: {
      firstMealTime: '09:00',
      timeWindow: 'daily',
      trackingMethod: 'meal_timing'
    },
    streakBonus: {
      multiplier: 1.1,
      maxStreak: 7
    }
  }
};
```

### Weekly Challenges
```typescript
const WEEKLY_CHALLENGES = {
  MEAL_PREP_WARRIOR: {
    id: 'meal_prep_warrior_weekly',
    name: 'Meal Prep Warrior',
    description: 'Prep 5 meals for the week',
    category: 'cooking',
    difficulty: 'medium',
    xpReward: 200,
    coinReward: 100,
    progressTarget: 5,
    timeLimit: 168, // 7 days
    requirements: {
      mealPrepSessions: 5,
      timeWindow: 'weekly',
      trackingMethod: 'meal_prep_logging'
    },
    streakBonus: {
      multiplier: 1.3,
      maxStreak: 4
    }
  },
  
  MACRO_CONSISTENCY: {
    id: 'macro_consistency_weekly',
    name: 'Macro Consistency',
    description: 'Hit macro targets 5 out of 7 days',
    category: 'nutrition',
    difficulty: 'hard',
    xpReward: 300,
    coinReward: 150,
    progressTarget: 5,
    timeLimit: 168,
    requirements: {
      macroTargetDays: 5,
      totalDays: 7,
      timeWindow: 'weekly',
      trackingMethod: 'macro_tracking'
    },
    streakBonus: {
      multiplier: 1.4,
      maxStreak: 3
    }
  },
  
  SOCIAL_BUTTERFLY: {
    id: 'social_butterfly_weekly',
    name: 'Social Butterfly',
    description: 'Share 3 achievements with friends',
    category: 'social',
    difficulty: 'easy',
    xpReward: 150,
    coinReward: 75,
    progressTarget: 3,
    timeLimit: 168,
    requirements: {
      sharedAchievements: 3,
      timeWindow: 'weekly',
      trackingMethod: 'social_sharing'
    },
    streakBonus: {
      multiplier: 1.2,
      maxStreak: 6
    }
  },
  
  FITNESS_CONSISTENCY: {
    id: 'fitness_consistency_weekly',
    name: 'Fitness Consistency',
    description: 'Complete 4 workout sessions this week',
    category: 'fitness',
    difficulty: 'medium',
    xpReward: 250,
    coinReward: 125,
    progressTarget: 4,
    timeLimit: 168,
    requirements: {
      workoutSessions: 4,
      timeWindow: 'weekly',
      trackingMethod: 'workout_logging'
    },
    streakBonus: {
      multiplier: 1.35,
      maxStreak: 5
    }
  },
  
  NUTRITION_EXPLORER: {
    id: 'nutrition_explorer_weekly',
    name: 'Nutrition Explorer',
    description: 'Try 7 different types of vegetables this week',
    category: 'nutrition',
    difficulty: 'medium',
    xpReward: 180,
    coinReward: 90,
    progressTarget: 7,
    timeLimit: 168,
    requirements: {
      uniqueVegetables: 7,
      timeWindow: 'weekly',
      trackingMethod: 'meal_logging'
    },
    streakBonus: {
      multiplier: 1.25,
      maxStreak: 4
    }
  }
};
```

### Monthly Challenges
```typescript
const MONTHLY_CHALLENGES = {
  TRANSFORMATION_CHALLENGE: {
    id: 'transformation_challenge_monthly',
    name: 'Monthly Transformation',
    description: 'Complete 20 days of perfect nutrition this month',
    category: 'transformation',
    difficulty: 'epic',
    xpReward: 1000,
    coinReward: 500,
    progressTarget: 20,
    timeLimit: 720, // 30 days
    requirements: {
      perfectNutritionDays: 20,
      timeWindow: 'monthly',
      trackingMethod: 'comprehensive_tracking'
    },
    streakBonus: {
      multiplier: 1.5,
      maxStreak: 2
    }
  },
  
  HABIT_FORMATION: {
    id: 'habit_formation_monthly',
    name: 'Habit Formation',
    description: 'Maintain a 15-day streak this month',
    category: 'consistency',
    difficulty: 'hard',
    xpReward: 600,
    coinReward: 300,
    progressTarget: 15,
    timeLimit: 720,
    requirements: {
      streakDays: 15,
      timeWindow: 'monthly',
      trackingMethod: 'streak_tracking'
    },
    streakBonus: {
      multiplier: 1.4,
      maxStreak: 2
    }
  },
  
  KNOWLEDGE_SEEKER: {
    id: 'knowledge_seeker_monthly',
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
      timeWindow: 'monthly',
      trackingMethod: 'ai_interaction'
    },
    streakBonus: {
      multiplier: 1.3,
      maxStreak: 3
    }
  }
};
```

## Challenge Data Models

### Challenge Interface
```typescript
interface Challenge {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: ChallengeDifficulty;
  type: 'daily' | 'weekly' | 'monthly';
  xpReward: number;
  coinReward: number;
  progressTarget: number;
  timeLimit: number; // hours
  requirements: ChallengeRequirements;
  streakBonus: StreakBonus;
  prerequisites?: string[];
  isRepeatable: boolean;
  maxCompletions?: number;
  createdAt: Date;
  expiresAt: Date;
  tags: string[];
}

interface ChallengeRequirements {
  [key: string]: any;
  timeWindow: 'daily' | 'weekly' | 'monthly';
  trackingMethod: string;
}

interface StreakBonus {
  multiplier: number;
  maxStreak: number;
}

interface UserChallenge {
  challenge: Challenge;
  progress: ChallengeProgress;
  status: ChallengeStatus;
  startedAt: Date;
  completedAt?: Date;
  streakCount: number;
  isNew: boolean;
  personalizedTarget?: number;
}

interface ChallengeProgress {
  currentProgress: number;
  targetProgress: number;
  progressPercentage: number;
  isCompleted: boolean;
  lastUpdated: Date;
  dailyProgress: DailyProgress[];
  weeklyProgress: WeeklyProgress[];
}

enum ChallengeDifficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EPIC = 'epic',
  LEGENDARY = 'legendary'
}

enum ChallengeStatus {
  AVAILABLE = 'available',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  FAILED = 'failed'
}
```

## Challenge Generation System

### Personalized Challenge Generator
```typescript
class ChallengeGenerator {
  private userProfile: UserProfile;
  private userHistory: UserHistory;
  private challengeTemplates: ChallengeTemplate[];
  
  constructor(userProfile: UserProfile, userHistory: UserHistory) {
    this.userProfile = userProfile;
    this.userHistory = userHistory;
    this.challengeTemplates = this.loadChallengeTemplates();
  }
  
  generateDailyChallenges(): Challenge[] {
    const availableChallenges: Challenge[] = [];
    const userPreferences = this.userProfile.preferences;
    const recentActivity = this.userHistory.getRecentActivity(7);
    
    // Generate personalized challenges based on user behavior
    if (userPreferences.focusAreas.includes('nutrition')) {
      availableChallenges.push(this.generateNutritionChallenge());
    }
    
    if (userPreferences.focusAreas.includes('fitness')) {
      availableChallenges.push(this.generateFitnessChallenge());
    }
    
    if (userPreferences.focusAreas.includes('health')) {
      availableChallenges.push(this.generateHealthChallenge());
    }
    
    // Generate challenges to address weak areas
    const weakAreas = this.identifyWeakAreas(recentActivity);
    weakAreas.forEach(area => {
      availableChallenges.push(this.generateImprovementChallenge(area));
    });
    
    // Add random challenges for variety
    availableChallenges.push(this.generateRandomChallenge());
    
    return availableChallenges.slice(0, 3); // Limit to 3 daily challenges
  }
  
  generateWeeklyChallenges(): Challenge[] {
    const availableChallenges: Challenge[] = [];
    const userGoals = this.userProfile.goals;
    
    // Generate challenges aligned with user goals
    userGoals.forEach(goal => {
      availableChallenges.push(this.generateGoalAlignedChallenge(goal));
    });
    
    // Add consistency and social challenges
    availableChallenges.push(this.generateConsistencyChallenge());
    availableChallenges.push(this.generateSocialChallenge());
    
    return availableChallenges.slice(0, 2); // Limit to 2 weekly challenges
  }
  
  generateMonthlyChallenges(): Challenge[] {
    const availableChallenges: Challenge[] = [];
    const userLevel = this.userProfile.level;
    
    // Generate challenges appropriate for user level
    if (userLevel >= 5) {
      availableChallenges.push(this.generateTransformationChallenge());
    }
    
    if (userLevel >= 3) {
      availableChallenges.push(this.generateHabitFormationChallenge());
    }
    
    return availableChallenges.slice(0, 1); // Limit to 1 monthly challenge
  }
  
  private generateNutritionChallenge(): Challenge {
    const templates = DAILY_CHALLENGES;
    const template = templates.VEGGIE_HERO;
    
    // Personalize based on user's current nutrition habits
    const currentVeggieIntake = this.userHistory.getAverageVeggieIntake(7);
    const personalizedTarget = Math.max(3, Math.min(7, currentVeggieIntake + 2));
    
    return {
      ...template,
      id: `daily_veggie_hero_${Date.now()}`,
      progressTarget: personalizedTarget,
      xpReward: Math.floor(template.xpReward * this.getDifficultyMultiplier()),
      coinReward: Math.floor(template.coinReward * this.getDifficultyMultiplier()),
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + template.timeLimit * 60 * 60 * 1000),
      personalizedTarget
    };
  }
  
  private getDifficultyMultiplier(): number {
    const userLevel = this.userProfile.level;
    return Math.min(1 + (userLevel * 0.1), 2.0); // Cap at 2x multiplier
  }
}
```

## Challenge Progress Tracking

### Progress Calculator
```typescript
class ChallengeProgressCalculator {
  calculateProgress(challenge: Challenge, userData: UserData): ChallengeProgress {
    let currentProgress = 0;
    
    switch (challenge.id) {
      case 'water_champion_daily':
        currentProgress = userData.todayWaterGlasses;
        break;
      case 'veggie_hero_daily':
        currentProgress = userData.todayUniqueVegetables;
        break;
      case 'step_master_daily':
        currentProgress = userData.todaySteps;
        break;
      case 'macro_master_daily':
        currentProgress = userData.todayProteinTargetMet ? 1 : 0;
        break;
      case 'meal_prep_warrior_weekly':
        currentProgress = userData.weeklyMealPrepSessions;
        break;
      case 'macro_consistency_weekly':
        currentProgress = userData.weeklyMacroTargetDays;
        break;
      // Add more cases as needed
    }
    
    const progressPercentage = Math.min(
      (currentProgress / challenge.progressTarget) * 100,
      100
    );
    
    const isCompleted = currentProgress >= challenge.progressTarget;
    
    return {
      currentProgress,
      targetProgress: challenge.progressTarget,
      progressPercentage,
      isCompleted,
      lastUpdated: new Date(),
      dailyProgress: this.calculateDailyProgress(challenge, userData),
      weeklyProgress: this.calculateWeeklyProgress(challenge, userData)
    };
  }
  
  updateChallengeProgress(userChallenges: UserChallenge[], userData: UserData): UserChallenge[] {
    return userChallenges.map(userChallenge => {
      if (userChallenge.status === ChallengeStatus.COMPLETED) {
        return userChallenge;
      }
      
      const newProgress = this.calculateProgress(userChallenge.challenge, userData);
      
      return {
        ...userChallenge,
        progress: newProgress,
        status: newProgress.isCompleted ? ChallengeStatus.COMPLETED : userChallenge.status
      };
    });
  }
}
```

## Challenge Completion System

### Challenge Completion Handler
```typescript
class ChallengeCompletionHandler {
  async completeChallenge(
    userChallenge: UserChallenge,
    userProfile: UserProfile,
    onReward: (rewards: ChallengeReward[]) => void
  ): Promise<void> {
    if (userChallenge.status !== ChallengeStatus.COMPLETED) {
      throw new Error('Challenge is not completed');
    }
    
    const challenge = userChallenge.challenge;
    const rewards = this.calculateRewards(challenge, userChallenge.streakCount, userProfile);
    
    // Award rewards
    await this.awardRewards(rewards, userProfile);
    
    // Update challenge status
    userChallenge.status = ChallengeStatus.COMPLETED;
    userChallenge.completedAt = new Date();
    
    // Update streak count
    userChallenge.streakCount += 1;
    
    // Trigger reward notification
    onReward(rewards);
    
    // Log completion
    await this.logChallengeCompletion(userChallenge, rewards);
  }
  
  private calculateRewards(
    challenge: Challenge,
    streakCount: number,
    userProfile: UserProfile
  ): ChallengeReward[] {
    const levelMultiplier = 1 + (userProfile.level * 0.05);
    const streakMultiplier = Math.min(
      challenge.streakBonus.multiplier,
      1 + (streakCount * 0.1)
    );
    
    const rewards: ChallengeReward[] = [
      {
        type: 'xp',
        amount: Math.floor(challenge.xpReward * streakMultiplier * levelMultiplier)
      },
      {
        type: 'coins',
        amount: Math.floor(challenge.coinReward * streakMultiplier * levelMultiplier)
      }
    ];
    
    // Add special rewards for epic/legendary challenges
    if (challenge.difficulty === ChallengeDifficulty.EPIC || challenge.difficulty === ChallengeDifficulty.LEGENDARY) {
      rewards.push({
        type: 'badge',
        badgeId: `challenge_${challenge.difficulty}_${challenge.category}`
      });
    }
    
    // Add streak bonus rewards
    if (streakCount > 1) {
      rewards.push({
        type: 'streak_bonus',
        amount: Math.floor(streakCount * 10)
      });
    }
    
    return rewards;
  }
  
  private async awardRewards(rewards: ChallengeReward[], userProfile: UserProfile): Promise<void> {
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
        case 'streak_bonus':
          await this.addCoins(reward.amount!, userProfile.userId);
          break;
      }
    }
  }
}
```

## UI Components

### Challenge Card
```typescript
interface ChallengeCardProps {
  userChallenge: UserChallenge;
  onStart: (challenge: Challenge) => void;
  onComplete: (challenge: Challenge) => void;
  onViewDetails: (challenge: Challenge) => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({
  userChallenge,
  onStart,
  onComplete,
  onViewDetails
}) => {
  const { challenge, progress, status, streakCount } = userChallenge;
  
  const getDifficultyColor = (difficulty: ChallengeDifficulty): string => {
    switch (difficulty) {
      case ChallengeDifficulty.EASY: return '#10B981';
      case ChallengeDifficulty.MEDIUM: return '#F59E0B';
      case ChallengeDifficulty.HARD: return '#EF4444';
      case ChallengeDifficulty.EPIC: return '#8B5CF6';
      case ChallengeDifficulty.LEGENDARY: return '#F59E0B';
      default: return '#6B7280';
    }
  };
  
  const getStatusColor = (status: ChallengeStatus): string => {
    switch (status) {
      case ChallengeStatus.AVAILABLE: return '#6B7280';
      case ChallengeStatus.ACTIVE: return '#3B82F6';
      case ChallengeStatus.COMPLETED: return '#10B981';
      case ChallengeStatus.EXPIRED: return '#EF4444';
      default: return '#6B7280';
    }
  };
  
  return (
    <div 
      className={`challenge-card ${challenge.difficulty} ${status}`}
      style={{
        borderColor: getDifficultyColor(challenge.difficulty),
        boxShadow: `0 0 15px ${getDifficultyColor(challenge.difficulty)}30`
      }}
    >
      <div className="challenge-header">
        <div className="challenge-info">
          <h3 className="challenge-name">{challenge.name}</h3>
          <div className="challenge-meta">
            <span className="challenge-type">{challenge.type}</span>
            <span className="challenge-difficulty">
              {challenge.difficulty.toUpperCase()}
            </span>
            <span className="challenge-category">{challenge.category}</span>
          </div>
        </div>
        
        <div className="challenge-rewards">
          <span className="xp-reward">+{challenge.xpReward} XP</span>
          <span className="coin-reward">+{challenge.coinReward} 🪙</span>
          {streakCount > 0 && (
            <span className="streak-bonus">🔥 {streakCount}x Streak</span>
          )}
        </div>
      </div>
      
      <p className="challenge-description">{challenge.description}</p>
      
      {status === ChallengeStatus.ACTIVE && (
        <div className="challenge-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${progress.progressPercentage}%`,
                backgroundColor: getDifficultyColor(challenge.difficulty)
              }}
            />
          </div>
          <span className="progress-text">
            {progress.currentProgress} / {progress.targetProgress}
          </span>
        </div>
      )}
      
      <div className="challenge-timer">
        <span>⏰ {this.formatTimeRemaining(challenge.expiresAt)}</span>
      </div>
      
      <div className="challenge-actions">
        {status === ChallengeStatus.AVAILABLE && (
          <button 
            className="start-challenge-btn"
            onClick={() => onStart(challenge)}
          >
            Start Challenge
          </button>
        )}
        
        {status === ChallengeStatus.ACTIVE && progress.isCompleted && (
          <button 
            className="complete-challenge-btn"
            onClick={() => onComplete(challenge)}
          >
            Complete Challenge
          </button>
        )}
        
        <button 
          className="view-details-btn"
          onClick={() => onViewDetails(challenge)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};
```

### Challenge Dashboard
```typescript
interface ChallengeDashboardProps {
  userChallenges: UserChallenge[];
  onChallengeAction: (action: string, challenge: Challenge) => void;
  filter: {
    type?: 'daily' | 'weekly' | 'monthly';
    status?: ChallengeStatus;
    difficulty?: ChallengeDifficulty;
  };
}

const ChallengeDashboard: React.FC<ChallengeDashboardProps> = ({
  userChallenges,
  onChallengeAction,
  filter
}) => {
  const filteredChallenges = userChallenges.filter(userChallenge => {
    const { challenge, status } = userChallenge;
    
    if (filter.type && challenge.type !== filter.type) return false;
    if (filter.status && status !== filter.status) return false;
    if (filter.difficulty && challenge.difficulty !== filter.difficulty) return false;
    
    return true;
  });
  
  const challengesByType = filteredChallenges.reduce((acc, userChallenge) => {
    const type = userChallenge.challenge.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(userChallenge);
    return acc;
  }, {} as Record<string, UserChallenge[]>);
  
  return (
    <div className="challenge-dashboard">
      <div className="dashboard-header">
        <h1>Daily Challenges</h1>
        <div className="challenge-stats">
          <div className="stat">
            <span className="stat-value">{challengesByType.daily?.length || 0}</span>
            <span className="stat-label">Daily</span>
          </div>
          <div className="stat">
            <span className="stat-value">{challengesByType.weekly?.length || 0}</span>
            <span className="stat-label">Weekly</span>
          </div>
          <div className="stat">
            <span className="stat-value">{challengesByType.monthly?.length || 0}</span>
            <span className="stat-label">Monthly</span>
          </div>
        </div>
      </div>
      
      <div className="challenge-filters">
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
        
        <select 
          value={filter.difficulty || 'all'}
          onChange={(e) => onFilterChange({ ...filter, difficulty: e.target.value })}
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="epic">Epic</option>
        </select>
      </div>
      
      {Object.entries(challengesByType).map(([type, challenges]) => (
        <div key={type} className="challenge-section">
          <h2 className="section-title">
            {type.charAt(0).toUpperCase() + type.slice(1)} Challenges
          </h2>
          <div className="challenges-grid">
            {challenges.map(userChallenge => (
              <ChallengeCard
                key={userChallenge.challenge.id}
                userChallenge={userChallenge}
                onStart={(challenge) => onChallengeAction('start', challenge)}
                onComplete={(challenge) => onChallengeAction('complete', challenge)}
                onViewDetails={(challenge) => onChallengeAction('view', challenge)}
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
interface ChallengeDocument {
  userId: string;
  activeChallenges: UserChallenge[];
  completedChallenges: UserChallenge[];
  challengeHistory: ChallengeCompletion[];
  lastUpdated: Timestamp;
}

const updateUserChallenges = async (
  userId: string,
  userChallenges: UserChallenge[]
): Promise<void> => {
  const challengeDoc: ChallengeDocument = {
    userId,
    activeChallenges: userChallenges.filter(c => c.status === ChallengeStatus.ACTIVE),
    completedChallenges: userChallenges.filter(c => c.status === ChallengeStatus.COMPLETED),
    challengeHistory: await getChallengeHistory(userId),
    lastUpdated: serverTimestamp()
  };
  
  await updateDoc(doc(db, 'userChallenges', userId), challengeDoc);
};
```

### Real-time Updates
```typescript
const subscribeToChallenges = (
  userId: string,
  onUpdate: (challenges: UserChallenge[]) => void
): Unsubscribe => {
  return onSnapshot(
    doc(db, 'userChallenges', userId),
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as ChallengeDocument;
        const allChallenges = [...data.activeChallenges, ...data.completedChallenges];
        onUpdate(allChallenges);
      }
    }
  );
};
```

## Analytics and Metrics

### Challenge Analytics
```typescript
interface ChallengeAnalytics {
  totalChallengesCompleted: number;
  averageCompletionTime: number;
  challengeTypeBreakdown: Record<string, number>;
  difficultyBreakdown: Record<ChallengeDifficulty, number>;
  completionRate: number;
  streakStatistics: StreakStats;
  userEngagementScore: number;
}

interface StreakStats {
  averageStreak: number;
  maxStreak: number;
  streakDistribution: Record<number, number>;
  streakRetentionRate: number;
}

const calculateChallengeAnalytics = (
  userChallenges: UserChallenge[]
): ChallengeAnalytics => {
  const completedChallenges = userChallenges.filter(c => c.status === ChallengeStatus.COMPLETED);
  
  return {
    totalChallengesCompleted: completedChallenges.length,
    averageCompletionTime: calculateAverageCompletionTime(completedChallenges),
    challengeTypeBreakdown: completedChallenges.reduce((acc, challenge) => {
      const type = challenge.challenge.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    difficultyBreakdown: completedChallenges.reduce((acc, challenge) => {
      const difficulty = challenge.challenge.difficulty;
      acc[difficulty] = (acc[difficulty] || 0) + 1;
      return acc;
    }, {} as Record<ChallengeDifficulty, number>),
    completionRate: calculateCompletionRate(userChallenges),
    streakStatistics: calculateStreakStatistics(completedChallenges),
    userEngagementScore: calculateEngagementScore(userChallenges)
  };
};
```

## Testing Requirements

### Unit Tests
- Challenge generation algorithms
- Progress calculation logic
- Reward distribution system
- Challenge completion validation
- Streak bonus calculations

### Integration Tests
- Firestore challenge updates
- Real-time synchronization
- Challenge notification system
- UI state management
- Personalized challenge generation

### Performance Tests
- Large challenge collections
- Real-time update frequency
- Challenge generation performance
- Progress calculation efficiency
- Streak tracking performance

## Future Enhancements

### Advanced Features
- Challenge chains and storylines
- Seasonal challenge events
- Community challenge competitions
- AI-generated personalized challenges
- Challenge trading system
- Dynamic difficulty adjustment

### Social Features
- Challenge sharing and collaboration
- Challenge leaderboards
- Challenge mentoring
- Challenge guilds
- Challenge competitions
- Social challenge streaks
