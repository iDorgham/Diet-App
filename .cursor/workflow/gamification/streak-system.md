# Streak & Momentum System Specification

## EARS Requirements

**EARS-STR-001**: The system shall track multiple types of streaks with different durations and rewards.

**EARS-STR-002**: The system shall provide streak bonuses and multipliers based on streak length.

**EARS-STR-003**: The system shall implement streak protection mechanisms to prevent accidental breaks.

**EARS-STR-004**: The system shall display streak progress with visual indicators and celebrations.

**EARS-STR-005**: The system shall provide streak recovery options for missed days.

**EARS-STR-006**: The system shall track streak statistics and provide analytics.

## Streak Types and Categories

### Daily Login Streak
```typescript
const DAILY_LOGIN_STREAK = {
  id: 'daily_login_streak',
  name: 'Daily Login Streak',
  description: 'Consecutive days of app usage',
  category: 'engagement',
  maxStreak: 365,
  rewards: {
    milestones: [
      { days: 3, xp: 50, coins: 25, bonus: 'login_bonus_3' },
      { days: 7, xp: 150, coins: 75, bonus: 'login_bonus_7' },
      { days: 14, xp: 300, coins: 150, bonus: 'login_bonus_14' },
      { days: 30, xp: 750, coins: 375, bonus: 'login_bonus_30' },
      { days: 60, xp: 1500, coins: 750, bonus: 'login_bonus_60' },
      { days: 100, xp: 3000, coins: 1500, bonus: 'login_bonus_100' },
      { days: 200, xp: 6000, coins: 3000, bonus: 'login_bonus_200' },
      { days: 365, xp: 12000, coins: 6000, bonus: 'login_bonus_365' }
    ],
    dailyBonus: {
      baseXP: 10,
      baseCoins: 5,
      multiplier: 1.1,
      maxMultiplier: 3.0
    }
  },
  protection: {
    gracePeriod: 24, // hours
    freezeTokens: 3, // per month
    recoveryCost: 100 // coins
  }
};
```

### Meal Logging Streak
```typescript
const MEAL_LOGGING_STREAK = {
  id: 'meal_logging_streak',
  name: 'Meal Logging Streak',
  description: 'Consecutive days of logging all meals',
  category: 'nutrition',
  maxStreak: 30,
  rewards: {
    milestones: [
      { days: 3, xp: 75, coins: 40, bonus: 'meal_logging_3' },
      { days: 7, xp: 200, coins: 100, bonus: 'meal_logging_7' },
      { days: 14, xp: 450, coins: 225, bonus: 'meal_logging_14' },
      { days: 21, xp: 750, coins: 375, bonus: 'meal_logging_21' },
      { days: 30, xp: 1200, coins: 600, bonus: 'meal_logging_30' }
    ],
    dailyBonus: {
      baseXP: 15,
      baseCoins: 8,
      multiplier: 1.15,
      maxMultiplier: 2.5
    }
  },
  protection: {
    gracePeriod: 12, // hours
    freezeTokens: 2, // per month
    recoveryCost: 50 // coins
  }
};
```

### Exercise Streak
```typescript
const EXERCISE_STREAK = {
  id: 'exercise_streak',
  name: 'Exercise Streak',
  description: 'Consecutive days of exercise logging',
  category: 'fitness',
  maxStreak: 21,
  rewards: {
    milestones: [
      { days: 3, xp: 100, coins: 50, bonus: 'exercise_3' },
      { days: 7, xp: 250, coins: 125, bonus: 'exercise_7' },
      { days: 14, xp: 600, coins: 300, bonus: 'exercise_14' },
      { days: 21, xp: 1000, coins: 500, bonus: 'exercise_21' }
    ],
    dailyBonus: {
      baseXP: 20,
      baseCoins: 10,
      multiplier: 1.2,
      maxMultiplier: 2.0
    }
  },
  protection: {
    gracePeriod: 36, // hours
    freezeTokens: 1, // per month
    recoveryCost: 75 // coins
  }
};
```

### Water Intake Streak
```typescript
const WATER_INTAKE_STREAK = {
  id: 'water_intake_streak',
  name: 'Water Intake Streak',
  description: 'Consecutive days of meeting water goals',
  category: 'health',
  maxStreak: 14,
  rewards: {
    milestones: [
      { days: 3, xp: 50, coins: 25, bonus: 'water_3' },
      { days: 7, xp: 150, coins: 75, bonus: 'water_7' },
      { days: 14, xp: 350, coins: 175, bonus: 'water_14' }
    ],
    dailyBonus: {
      baseXP: 10,
      baseCoins: 5,
      multiplier: 1.1,
      maxMultiplier: 1.5
    }
  },
  protection: {
    gracePeriod: 12, // hours
    freezeTokens: 2, // per month
    recoveryCost: 25 // coins
  }
};
```

### Macro Target Streak
```typescript
const MACRO_TARGET_STREAK = {
  id: 'macro_target_streak',
  name: 'Macro Target Streak',
  description: 'Consecutive days of hitting macro targets',
  category: 'nutrition',
  maxStreak: 30,
  rewards: {
    milestones: [
      { days: 3, xp: 100, coins: 50, bonus: 'macro_3' },
      { days: 7, xp: 300, coins: 150, bonus: 'macro_7' },
      { days: 14, xp: 700, coins: 350, bonus: 'macro_14' },
      { days: 21, xp: 1200, coins: 600, bonus: 'macro_21' },
      { days: 30, xp: 2000, coins: 1000, bonus: 'macro_30' }
    ],
    dailyBonus: {
      baseXP: 25,
      baseCoins: 12,
      multiplier: 1.25,
      maxMultiplier: 3.0
    }
  },
  protection: {
    gracePeriod: 24, // hours
    freezeTokens: 1, // per month
    recoveryCost: 100 // coins
  }
};
```

## Streak Data Models

### Streak Interface
```typescript
interface Streak {
  id: string;
  name: string;
  description: string;
  category: string;
  maxStreak: number;
  rewards: StreakRewards;
  protection: StreakProtection;
  isActive: boolean;
  createdAt: Date;
}

interface StreakRewards {
  milestones: StreakMilestone[];
  dailyBonus: DailyBonus;
}

interface StreakMilestone {
  days: number;
  xp: number;
  coins: number;
  bonus: string;
}

interface DailyBonus {
  baseXP: number;
  baseCoins: number;
  multiplier: number;
  maxMultiplier: number;
}

interface StreakProtection {
  gracePeriod: number; // hours
  freezeTokens: number; // per month
  recoveryCost: number; // coins
}

interface UserStreak {
  streak: Streak;
  currentCount: number;
  maxCount: number;
  lastActivity: Date;
  isActive: boolean;
  isProtected: boolean;
  protectionExpires?: Date;
  freezeTokensUsed: number;
  freezeTokensAvailable: number;
  milestonesReached: number[];
  totalXP: number;
  totalCoins: number;
}

interface StreakProgress {
  currentStreak: number;
  maxStreak: number;
  progressPercentage: number;
  daysToNextMilestone: number;
  nextMilestone?: StreakMilestone;
  isAtRisk: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}
```

## Streak Management System

### Streak Service
```typescript
export class StreakService {
  static async updateStreak(
    userId: string,
    streakId: string,
    activityData: ActivityData
  ): Promise<StreakUpdateResult> {
    const userStreak = await this.getUserStreak(userId, streakId);
    const streak = STREAKS[streakId];
    
    if (!userStreak) {
      // Create new streak
      return await this.createNewStreak(userId, streakId, activityData);
    }
    
    // Check if activity qualifies for streak
    const qualifies = await this.checkStreakQualification(streakId, activityData);
    if (!qualifies) {
      return { success: false, reason: 'Activity does not qualify for streak' };
    }
    
    // Check if streak is still active
    const timeSinceLastActivity = Date.now() - userStreak.lastActivity.getTime();
    const hoursSinceLastActivity = timeSinceLastActivity / (1000 * 60 * 60);
    
    if (hoursSinceLastActivity > 24 + streak.protection.gracePeriod) {
      // Streak broken
      return await this.handleStreakBreak(userId, streakId, userStreak);
    }
    
    // Update streak
    const isNewDay = this.isNewDay(userStreak.lastActivity, new Date());
    if (isNewDay) {
      userStreak.currentCount += 1;
      userStreak.maxCount = Math.max(userStreak.maxCount, userStreak.currentCount);
    }
    
    userStreak.lastActivity = new Date();
    userStreak.isActive = true;
    
    // Check for milestone rewards
    const milestoneRewards = await this.checkMilestoneRewards(userStreak);
    
    // Calculate daily bonus
    const dailyBonus = this.calculateDailyBonus(userStreak);
    
    // Save updated streak
    await this.saveUserStreak(userId, userStreak);
    
    return {
      success: true,
      streakCount: userStreak.currentCount,
      milestoneRewards,
      dailyBonus,
      isNewMilestone: milestoneRewards.length > 0
    };
  }
  
  static async protectStreak(
    userId: string,
    streakId: string
  ): Promise<StreakProtectionResult> {
    const userStreak = await this.getUserStreak(userId, streakId);
    const streak = STREAKS[streakId];
    
    if (!userStreak) {
      throw new Error('Streak not found');
    }
    
    if (userStreak.freezeTokensAvailable <= 0) {
      throw new Error('No freeze tokens available');
    }
    
    if (userStreak.isProtected) {
      throw new Error('Streak is already protected');
    }
    
    // Check if user has enough coins
    const userCoins = await this.getUserCoins(userId);
    if (userCoins < streak.protection.recoveryCost) {
      throw new Error('Insufficient coins for protection');
    }
    
    // Apply protection
    userStreak.isProtected = true;
    userStreak.protectionExpires = new Date(Date.now() + streak.protection.gracePeriod * 60 * 60 * 1000);
    userStreak.freezeTokensUsed += 1;
    userStreak.freezeTokensAvailable -= 1;
    
    // Deduct coins
    await this.deductCoins(userId, streak.protection.recoveryCost);
    
    // Save updated streak
    await this.saveUserStreak(userId, userStreak);
    
    return {
      success: true,
      protectionExpires: userStreak.protectionExpires,
      tokensRemaining: userStreak.freezeTokensAvailable
    };
  }
  
  static async recoverStreak(
    userId: string,
    streakId: string
  ): Promise<StreakRecoveryResult> {
    const userStreak = await this.getUserStreak(userId, streakId);
    const streak = STREAKS[streakId];
    
    if (!userStreak) {
      throw new Error('Streak not found');
    }
    
    if (userStreak.isActive) {
      throw new Error('Streak is still active');
    }
    
    // Check if recovery is possible
    const timeSinceBreak = Date.now() - userStreak.lastActivity.getTime();
    const hoursSinceBreak = timeSinceBreak / (1000 * 60 * 60);
    
    if (hoursSinceBreak > streak.protection.gracePeriod) {
      throw new Error('Recovery period has expired');
    }
    
    // Check if user has enough coins
    const userCoins = await this.getUserCoins(userId);
    if (userCoins < streak.protection.recoveryCost) {
      throw new Error('Insufficient coins for recovery');
    }
    
    // Recover streak
    userStreak.isActive = true;
    userStreak.lastActivity = new Date();
    
    // Deduct coins
    await this.deductCoins(userId, streak.protection.recoveryCost);
    
    // Save updated streak
    await this.saveUserStreak(userId, userStreak);
    
    return {
      success: true,
      recoveredStreak: userStreak.currentCount,
      coinsSpent: streak.protection.recoveryCost
    };
  }
  
  private static async checkMilestoneRewards(userStreak: UserStreak): Promise<StreakMilestone[]> {
    const streak = STREAKS[userStreak.streak.id];
    const newMilestones: StreakMilestone[] = [];
    
    for (const milestone of streak.rewards.milestones) {
      if (userStreak.currentCount >= milestone.days && 
          !userStreak.milestonesReached.includes(milestone.days)) {
        newMilestones.push(milestone);
        userStreak.milestonesReached.push(milestone.days);
        userStreak.totalXP += milestone.xp;
        userStreak.totalCoins += milestone.coins;
      }
    }
    
    return newMilestones;
  }
  
  private static calculateDailyBonus(userStreak: UserStreak): DailyBonus {
    const streak = STREAKS[userStreak.streak.id];
    const multiplier = Math.min(
      streak.rewards.dailyBonus.maxMultiplier,
      streak.rewards.dailyBonus.multiplier * userStreak.currentCount
    );
    
    return {
      baseXP: Math.floor(streak.rewards.dailyBonus.baseXP * multiplier),
      baseCoins: Math.floor(streak.rewards.dailyBonus.baseCoins * multiplier),
      multiplier,
      maxMultiplier: streak.rewards.dailyBonus.maxMultiplier
    };
  }
}
```

## Streak Progress Tracking

### Progress Calculator
```typescript
class StreakProgressCalculator {
  calculateProgress(userStreak: UserStreak): StreakProgress {
    const streak = STREAKS[userStreak.streak.id];
    const currentStreak = userStreak.currentCount;
    const maxStreak = userStreak.maxCount;
    
    const progressPercentage = (currentStreak / streak.maxStreak) * 100;
    
    // Find next milestone
    const nextMilestone = streak.rewards.milestones.find(
      milestone => milestone.days > currentStreak
    );
    
    const daysToNextMilestone = nextMilestone ? nextMilestone.days - currentStreak : 0;
    
    // Calculate risk level
    const timeSinceLastActivity = Date.now() - userStreak.lastActivity.getTime();
    const hoursSinceLastActivity = timeSinceLastActivity / (1000 * 60 * 60);
    
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let isAtRisk = false;
    
    if (hoursSinceLastActivity > 20) {
      isAtRisk = true;
      riskLevel = 'high';
    } else if (hoursSinceLastActivity > 16) {
      isAtRisk = true;
      riskLevel = 'medium';
    } else if (hoursSinceLastActivity > 12) {
      isAtRisk = true;
      riskLevel = 'low';
    }
    
    return {
      currentStreak,
      maxStreak,
      progressPercentage,
      daysToNextMilestone,
      nextMilestone,
      isAtRisk,
      riskLevel
    };
  }
  
  calculateStreakStatistics(userStreaks: UserStreak[]): StreakStatistics {
    const totalStreaks = userStreaks.length;
    const activeStreaks = userStreaks.filter(s => s.isActive).length;
    const totalDays = userStreaks.reduce((sum, s) => sum + s.currentCount, 0);
    const maxStreak = Math.max(...userStreaks.map(s => s.maxCount));
    const averageStreak = totalDays / totalStreaks;
    
    const categoryBreakdown = userStreaks.reduce((acc, streak) => {
      const category = streak.streak.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      totalStreaks,
      activeStreaks,
      totalDays,
      maxStreak,
      averageStreak,
      categoryBreakdown,
      streakRetentionRate: activeStreaks / totalStreaks
    };
  }
}
```

## UI Components

### Streak Display
```typescript
interface StreakDisplayProps {
  userStreak: UserStreak;
  progress: StreakProgress;
  onProtect: (streakId: string) => void;
  onRecover: (streakId: string) => void;
  onViewDetails: (streakId: string) => void;
}

const StreakDisplay: React.FC<StreakDisplayProps> = ({
  userStreak,
  progress,
  onProtect,
  onRecover,
  onViewDetails
}) => {
  const { streak, currentCount, isActive, isProtected } = userStreak;
  
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'engagement': return '#3B82F6';
      case 'nutrition': return '#10B981';
      case 'fitness': return '#EF4444';
      case 'health': return '#8B5CF6';
      default: return '#6B7280';
    }
  };
  
  const getRiskColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'low': return '#F59E0B';
      case 'medium': return '#EF4444';
      case 'high': return '#DC2626';
      default: return '#10B981';
    }
  };
  
  return (
    <div 
      className={`streak-display ${streak.category} ${isActive ? 'active' : 'broken'} ${isProtected ? 'protected' : ''}`}
      style={{
        borderColor: getCategoryColor(streak.category),
        boxShadow: `0 0 15px ${getCategoryColor(streak.category)}30`
      }}
    >
      <div className="streak-header">
        <div className="streak-info">
          <h3 className="streak-name">{streak.name}</h3>
          <p className="streak-description">{streak.description}</p>
          <div className="streak-meta">
            <span className="streak-category">{streak.category}</span>
            <span className="streak-status">
              {isActive ? 'Active' : 'Broken'}
            </span>
            {isProtected && (
              <span className="protection-status">Protected</span>
            )}
          </div>
        </div>
        
        <div className="streak-count">
          <span className="current-count">{currentCount}</span>
          <span className="max-count">/ {streak.maxStreak}</span>
        </div>
      </div>
      
      <div className="streak-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${progress.progressPercentage}%`,
              backgroundColor: getCategoryColor(streak.category)
            }}
          />
        </div>
        <span className="progress-text">
          {Math.round(progress.progressPercentage)}% Complete
        </span>
      </div>
      
      {progress.nextMilestone && (
        <div className="next-milestone">
          <span className="milestone-text">
            {progress.daysToNextMilestone} days to next milestone
          </span>
          <div className="milestone-reward">
            <span>+{progress.nextMilestone.xp} XP</span>
            <span>+{progress.nextMilestone.coins} 🪙</span>
          </div>
        </div>
      )}
      
      {progress.isAtRisk && isActive && (
        <div className="risk-warning" style={{ color: getRiskColor(progress.riskLevel) }}>
          ⚠️ Streak at risk! {progress.riskLevel.toUpperCase()} risk level
        </div>
      )}
      
      <div className="streak-actions">
        {isActive && progress.isAtRisk && !isProtected && (
          <button 
            className="protect-btn"
            onClick={() => onProtect(streak.id)}
          >
            Protect Streak ({streak.protection.recoveryCost} 🪙)
          </button>
        )}
        
        {!isActive && (
          <button 
            className="recover-btn"
            onClick={() => onRecover(streak.id)}
          >
            Recover Streak ({streak.protection.recoveryCost} 🪙)
          </button>
        )}
        
        <button 
          className="view-details-btn"
          onClick={() => onViewDetails(streak.id)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};
```

### Streak Dashboard
```typescript
interface StreakDashboardProps {
  userStreaks: UserStreak[];
  onStreakAction: (action: string, streakId: string) => void;
  filter: {
    category?: string;
    status?: 'all' | 'active' | 'broken' | 'protected';
  };
}

const StreakDashboard: React.FC<StreakDashboardProps> = ({
  userStreaks,
  onStreakAction,
  filter
}) => {
  const filteredStreaks = userStreaks.filter(userStreak => {
    const { streak, isActive, isProtected } = userStreak;
    
    if (filter.category && streak.category !== filter.category) return false;
    if (filter.status === 'active' && !isActive) return false;
    if (filter.status === 'broken' && isActive) return false;
    if (filter.status === 'protected' && !isProtected) return false;
    
    return true;
  });
  
  const streaksByCategory = filteredStreaks.reduce((acc, userStreak) => {
    const category = userStreak.streak.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(userStreak);
    return acc;
  }, {} as Record<string, UserStreak[]>);
  
  const statistics = calculateStreakStatistics(userStreaks);
  
  return (
    <div className="streak-dashboard">
      <div className="dashboard-header">
        <h1>Streak Dashboard</h1>
        <div className="streak-stats">
          <div className="stat">
            <span className="stat-value">{statistics.activeStreaks}</span>
            <span className="stat-label">Active Streaks</span>
          </div>
          <div className="stat">
            <span className="stat-value">{statistics.maxStreak}</span>
            <span className="stat-label">Max Streak</span>
          </div>
          <div className="stat">
            <span className="stat-value">{statistics.totalDays}</span>
            <span className="stat-label">Total Days</span>
          </div>
          <div className="stat">
            <span className="stat-value">{Math.round(statistics.averageStreak)}</span>
            <span className="stat-label">Average</span>
          </div>
        </div>
      </div>
      
      <div className="streak-filters">
        <select 
          value={filter.category || 'all'}
          onChange={(e) => onFilterChange({ ...filter, category: e.target.value })}
        >
          <option value="all">All Categories</option>
          <option value="engagement">Engagement</option>
          <option value="nutrition">Nutrition</option>
          <option value="fitness">Fitness</option>
          <option value="health">Health</option>
        </select>
        
        <select 
          value={filter.status || 'all'}
          onChange={(e) => onFilterChange({ ...filter, status: e.target.value })}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="broken">Broken</option>
          <option value="protected">Protected</option>
        </select>
      </div>
      
      {Object.entries(streaksByCategory).map(([category, streaks]) => (
        <div key={category} className="streak-category">
          <h2 className="category-title">
            {category.charAt(0).toUpperCase() + category.slice(1)} Streaks
            <span className="streak-count">({streaks.length})</span>
          </h2>
          <div className="streaks-grid">
            {streaks.map(userStreak => {
              const progress = calculateStreakProgress(userStreak);
              return (
                <StreakDisplay
                  key={userStreak.streak.id}
                  userStreak={userStreak}
                  progress={progress}
                  onProtect={(streakId) => onStreakAction('protect', streakId)}
                  onRecover={(streakId) => onStreakAction('recover', streakId)}
                  onViewDetails={(streakId) => onStreakAction('view', streakId)}
                />
              );
            })}
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
interface StreakDocument {
  userId: string;
  streaks: UserStreak[];
  statistics: StreakStatistics;
  lastUpdated: Timestamp;
}

const updateUserStreaks = async (
  userId: string,
  streaks: UserStreak[]
): Promise<void> => {
  const statistics = calculateStreakStatistics(streaks);
  const streakDoc: StreakDocument = {
    userId,
    streaks,
    statistics,
    lastUpdated: serverTimestamp()
  };
  
  await updateDoc(doc(db, 'userStreaks', userId), streakDoc);
};
```

### Real-time Updates
```typescript
const subscribeToStreaks = (
  userId: string,
  onUpdate: (streaks: UserStreak[]) => void
): Unsubscribe => {
  return onSnapshot(
    doc(db, 'userStreaks', userId),
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as StreakDocument;
        onUpdate(data.streaks);
      }
    }
  );
};
```

## Analytics and Metrics

### Streak Analytics
```typescript
interface StreakAnalytics {
  totalStreaks: number;
  activeStreaks: number;
  brokenStreaks: number;
  averageStreakLength: number;
  maxStreakLength: number;
  streakRetentionRate: number;
  categoryBreakdown: Record<string, number>;
  milestoneCompletionRate: Record<number, number>;
  protectionUsage: number;
  recoverySuccessRate: number;
}

const calculateStreakAnalytics = (
  userStreaks: UserStreak[]
): StreakAnalytics => {
  const activeStreaks = userStreaks.filter(s => s.isActive);
  const brokenStreaks = userStreaks.filter(s => !s.isActive);
  
  return {
    totalStreaks: userStreaks.length,
    activeStreaks: activeStreaks.length,
    brokenStreaks: brokenStreaks.length,
    averageStreakLength: userStreaks.reduce((sum, s) => sum + s.currentCount, 0) / userStreaks.length,
    maxStreakLength: Math.max(...userStreaks.map(s => s.maxCount)),
    streakRetentionRate: activeStreaks.length / userStreaks.length,
    categoryBreakdown: userStreaks.reduce((acc, streak) => {
      const category = streak.streak.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    milestoneCompletionRate: calculateMilestoneCompletionRate(userStreaks),
    protectionUsage: userStreaks.reduce((sum, s) => sum + s.freezeTokensUsed, 0),
    recoverySuccessRate: calculateRecoverySuccessRate(userStreaks)
  };
};
```

## Testing Requirements

### Unit Tests
- Streak qualification checking
- Milestone reward calculation
- Protection and recovery logic
- Progress calculation algorithms

### Integration Tests
- Firestore streak updates
- Real-time synchronization
- Streak notification system
- UI state management

### Performance Tests
- Large streak collections
- Real-time update frequency
- Streak calculation performance
- Progress tracking efficiency

## Future Enhancements

### Advanced Features
- Streak multipliers and bonuses
- Seasonal streak events
- Streak competitions
- Streak sharing and social features
- Advanced protection mechanisms

### Social Features
- Streak leaderboards
- Streak challenges
- Streak mentoring
- Streak showcases
- Streak recovery assistance
