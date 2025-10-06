# Gamification Engine - Design

## Technical Architecture

### Core Gamification Engine
```typescript
interface GamificationEngine {
  // XP and Leveling
  calculateXP(task: Task, userContext: UserContext): number;
  processLevelUp(userProgress: UserProgress): LevelUpResult;
  calculateLevelProgress(currentXP: number, level: number): number;
  
  // Achievements and Badges
  checkAchievements(userProgress: UserProgress, action: UserAction): Achievement[];
  awardBadge(userId: string, badgeId: string): BadgeAward;
  getAvailableBadges(userProgress: UserProgress): Badge[];
  
  // Streaks and Consistency
  updateStreak(userId: string, action: UserAction): StreakUpdate;
  calculateStreakBonus(streakDays: number): number;
  getStreakStatus(userId: string): StreakStatus;
  
  // Virtual Economy
  calculateCoinReward(xpEarned: number, multiplier: number): number;
  processPurchase(userId: string, itemId: string): PurchaseResult;
  getAvailableItems(userLevel: number): ShopItem[];
}
```

### Data Models
```typescript
interface UserProgress {
  userId: string;
  level: number;
  currentXP: number;
  totalXP: number;
  coins: number;
  streak: StreakData;
  achievements: Achievement[];
  badges: Badge[];
  statistics: UserStatistics;
  lastUpdated: Date;
}

interface Task {
  id: string;
  type: TaskType;
  difficulty: DifficultyLevel;
  baseXP: number;
  timeLimit?: number;
  requirements: TaskRequirement[];
  rewards: TaskReward[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  type: AchievementType;
  requirements: AchievementRequirement[];
  rewards: AchievementReward[];
  rarity: Rarity;
  icon: string;
  unlockedAt?: Date;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: Rarity;
  category: BadgeCategory;
  requirements: BadgeRequirement[];
  effects: BadgeEffect[];
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  streakType: StreakType;
  lastActivity: Date;
  bonusMultiplier: number;
}
```

## XP and Leveling System

### XP Calculation Algorithm
```typescript
class XPCalculator {
  private readonly BASE_XP_VALUES = {
    MEAL_LOG: 15,
    EXERCISE_LOG: 25,
    WATER_LOG: 10,
    RECIPE_TRY: 20,
    GOAL_ACHIEVEMENT: 50,
    STREAK_MILESTONE: 100,
    COMMUNITY_INTERACTION: 5,
    AI_CHAT: 10
  };

  private readonly DIFFICULTY_MULTIPLIERS = {
    EASY: 1.0,
    MEDIUM: 1.5,
    HARD: 2.0,
    EXPERT: 3.0
  };

  calculateXP(task: Task, userContext: UserContext): number {
    let baseXP = this.BASE_XP_VALUES[task.type] || 10;
    
    // Apply difficulty multiplier
    baseXP *= this.DIFFICULTY_MULTIPLIERS[task.difficulty];
    
    // Apply streak bonus
    const streakBonus = this.calculateStreakBonus(userContext.streak.currentStreak);
    baseXP *= streakBonus;
    
    // Apply time bonus (early completion)
    if (task.timeLimit && userContext.completionTime < task.timeLimit * 0.5) {
      baseXP *= 1.25; // 25% bonus for early completion
    }
    
    // Apply level scaling (higher levels get slightly less XP)
    const levelScaling = Math.max(0.8, 1 - (userContext.level * 0.01));
    baseXP *= levelScaling;
    
    return Math.round(baseXP);
  }

  private calculateStreakBonus(streakDays: number): number {
    if (streakDays >= 30) return 3.0;      // 200% bonus
    if (streakDays >= 14) return 2.0;      // 100% bonus
    if (streakDays >= 7) return 1.5;       // 50% bonus
    if (streakDays >= 3) return 1.2;       // 20% bonus
    return 1.0;                            // No bonus
  }
}
```

### Level Progression System
```typescript
class LevelingSystem {
  private readonly LEVEL_XP_REQUIREMENTS = [
    0,    // Level 1
    100,  // Level 2
    250,  // Level 3
    450,  // Level 4
    700,  // Level 5
    1000, // Level 6
    1350, // Level 7
    1750, // Level 8
    2200, // Level 9
    2700, // Level 10
    // ... continues with increasing requirements
  ];

  calculateLevelProgress(currentXP: number, level: number): number {
    const currentLevelXP = this.LEVEL_XP_REQUIREMENTS[level - 1] || 0;
    const nextLevelXP = this.LEVEL_XP_REQUIREMENTS[level] || currentLevelXP + 1000;
    
    const progressXP = currentXP - currentLevelXP;
    const requiredXP = nextLevelXP - currentLevelXP;
    
    return Math.min(100, (progressXP / requiredXP) * 100);
  }

  processLevelUp(userProgress: UserProgress): LevelUpResult {
    const newLevel = this.calculateLevel(userProgress.currentXP);
    const leveledUp = newLevel > userProgress.level;
    
    if (leveledUp) {
      const bonusCoins = this.calculateLevelUpBonus(newLevel);
      const unlockedFeatures = this.getUnlockedFeatures(newLevel);
      
      return {
        newLevel,
        bonusCoins,
        unlockedFeatures,
        leveledUp: true,
        celebrationMessage: this.generateCelebrationMessage(newLevel)
      };
    }
    
    return { leveledUp: false };
  }

  private calculateLevelUpBonus(level: number): number {
    // Base bonus + level-based bonus
    return 50 + (level * 10);
  }
}
```

## Achievement System

### Achievement Engine
```typescript
class AchievementEngine {
  private readonly ACHIEVEMENTS: Achievement[] = [
    {
      id: 'first_meal',
      name: 'First Steps',
      description: 'Log your first meal',
      type: 'MILESTONE',
      requirements: [{ type: 'MEAL_COUNT', value: 1 }],
      rewards: [{ type: 'COINS', value: 50 }],
      rarity: 'COMMON',
      icon: '🍽️'
    },
    {
      id: 'week_warrior',
      name: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      type: 'STREAK',
      requirements: [{ type: 'STREAK_DAYS', value: 7 }],
      rewards: [{ type: 'COINS', value: 200 }, { type: 'XP', value: 100 }],
      rarity: 'RARE',
      icon: '🔥'
    },
    {
      id: 'nutrition_master',
      name: 'Nutrition Master',
      description: 'Achieve perfect nutrition score for 30 days',
      type: 'PERFECTION',
      requirements: [{ type: 'PERFECT_DAYS', value: 30 }],
      rewards: [{ type: 'COINS', value: 1000 }, { type: 'BADGE', value: 'nutrition_master' }],
      rarity: 'LEGENDARY',
      icon: '👑'
    }
  ];

  checkAchievements(userProgress: UserProgress, action: UserAction): Achievement[] {
    const unlockedAchievements: Achievement[] = [];
    
    for (const achievement of this.ACHIEVEMENTS) {
      if (this.isAchievementUnlocked(achievement, userProgress, action)) {
        unlockedAchievements.push(achievement);
      }
    }
    
    return unlockedAchievements;
  }

  private isAchievementUnlocked(
    achievement: Achievement, 
    userProgress: UserProgress, 
    action: UserAction
  ): boolean {
    // Check if already unlocked
    if (userProgress.achievements.some(a => a.id === achievement.id)) {
      return false;
    }
    
    // Check requirements
    return achievement.requirements.every(requirement => 
      this.checkRequirement(requirement, userProgress, action)
    );
  }
}
```

## Streak System

### Streak Management
```typescript
class StreakManager {
  async updateStreak(userId: string, action: UserAction): Promise<StreakUpdate> {
    const currentStreak = await this.getCurrentStreak(userId);
    const lastActivity = await this.getLastActivity(userId);
    const now = new Date();
    
    // Check if streak should continue or reset
    const shouldContinue = this.shouldContinueStreak(lastActivity, now, action);
    
    if (shouldContinue) {
      const newStreak = currentStreak + 1;
      const bonusMultiplier = this.calculateStreakBonus(newStreak);
      
      await this.updateStreakData(userId, {
        currentStreak: newStreak,
        longestStreak: Math.max(currentStreak.longestStreak, newStreak),
        lastActivity: now,
        bonusMultiplier
      });
      
      return {
        streakContinued: true,
        newStreakCount: newStreak,
        bonusMultiplier,
        milestoneReached: this.checkStreakMilestone(newStreak)
      };
    } else {
      await this.resetStreak(userId);
      return {
        streakContinued: false,
        streakReset: true,
        previousStreak: currentStreak
      };
    }
  }

  private shouldContinueStreak(lastActivity: Date, now: Date, action: UserAction): boolean {
    const hoursSinceLastActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
    
    // Allow up to 48 hours between activities to maintain streak
    return hoursSinceLastActivity <= 48;
  }
}
```

## Virtual Economy

### Coin System
```typescript
class VirtualEconomy {
  private readonly COIN_RATES = {
    XP_TO_COINS: 0.3,        // 30% of XP becomes coins
    LEVEL_UP_BONUS: 50,      // Base coins for leveling up
    ACHIEVEMENT_BONUS: 100,  // Base coins for achievements
    DAILY_BONUS: 25          // Daily login bonus
  };

  calculateCoinReward(xpEarned: number, multiplier: number = 1): number {
    const baseCoins = Math.floor(xpEarned * this.COIN_RATES.XP_TO_COINS);
    return Math.floor(baseCoins * multiplier);
  }

  async processPurchase(userId: string, itemId: string): Promise<PurchaseResult> {
    const user = await this.getUser(userId);
    const item = await this.getShopItem(itemId);
    
    if (!this.canAfford(user.coins, item.price)) {
      return {
        success: false,
        error: 'INSUFFICIENT_FUNDS',
        requiredCoins: item.price - user.coins
      };
    }
    
    if (!this.meetsRequirements(user, item.requirements)) {
      return {
        success: false,
        error: 'REQUIREMENTS_NOT_MET',
        missingRequirements: this.getMissingRequirements(user, item.requirements)
      };
    }
    
    // Process purchase
    await this.deductCoins(userId, item.price);
    await this.grantItem(userId, item);
    
    return {
      success: true,
      itemGranted: item,
      remainingCoins: user.coins - item.price
    };
  }
}
```

## API Endpoints

### Gamification Data
```typescript
// GET /api/gamification/progress/:userId
interface GamificationProgressResponse {
  userProgress: UserProgress;
  recentAchievements: Achievement[];
  availableBadges: Badge[];
  streakStatus: StreakStatus;
  nextMilestones: Milestone[];
}

// POST /api/gamification/complete-task
interface CompleteTaskRequest {
  userId: string;
  taskId: string;
  completionData: TaskCompletionData;
}

interface CompleteTaskResponse {
  xpEarned: number;
  coinsEarned: number;
  levelUp?: LevelUpResult;
  achievementsUnlocked: Achievement[];
  streakUpdate: StreakUpdate;
  nextActions: string[];
}

// GET /api/gamification/achievements/:userId
interface AchievementsResponse {
  unlocked: Achievement[];
  available: Achievement[];
  progress: AchievementProgress[];
  categories: AchievementCategory[];
}
```

## Database Schema

### Gamification Tables
```sql
CREATE TABLE user_progress (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  level INTEGER DEFAULT 1,
  current_xp INTEGER DEFAULT 0,
  total_xp INTEGER DEFAULT 0,
  coins INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE achievements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  achievement_id VARCHAR(100),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  progress_data JSONB
);

CREATE TABLE streaks (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  streak_type VARCHAR(50),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity TIMESTAMP,
  bonus_multiplier DECIMAL(3,2) DEFAULT 1.0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE shop_items (
  id UUID PRIMARY KEY,
  name VARCHAR(200),
  description TEXT,
  price INTEGER,
  category VARCHAR(100),
  rarity VARCHAR(50),
  requirements JSONB,
  effects JSONB,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_purchases (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  item_id UUID REFERENCES shop_items(id),
  purchase_price INTEGER,
  purchased_at TIMESTAMP DEFAULT NOW()
);
```

## Performance Optimization

### Caching Strategy
```typescript
class GamificationCache {
  private cache = new Map<string, CachedData>();
  
  async getCachedProgress(userId: string): Promise<UserProgress | null> {
    const cached = this.cache.get(`progress_${userId}`);
    if (cached && !this.isExpired(cached.timestamp)) {
      return cached.data;
    }
    return null;
  }
  
  async cacheProgress(userId: string, progress: UserProgress): Promise<void> {
    this.cache.set(`progress_${userId}`, {
      data: progress,
      timestamp: Date.now(),
      ttl: 300000 // 5 minutes
    });
  }
}
```

### Batch Processing
```typescript
class GamificationBatchProcessor {
  private batchQueue: GamificationEvent[] = [];
  private batchSize = 50;
  private batchTimeout = 5000; // 5 seconds
  
  async addEvent(event: GamificationEvent): Promise<void> {
    this.batchQueue.push(event);
    
    if (this.batchQueue.length >= this.batchSize) {
      await this.processBatch();
    }
  }
  
  private async processBatch(): Promise<void> {
    const batch = this.batchQueue.splice(0, this.batchSize);
    await this.processGamificationEvents(batch);
  }
}
```

## Security Considerations

### Data Protection
```typescript
class GamificationSecurity {
  async validateUserAction(userId: string, action: UserAction): Promise<boolean> {
    // Validate user permissions
    const user = await this.getUser(userId);
    if (!user || !user.isActive) {
      return false;
    }
    
    // Validate action authenticity
    if (!this.isValidAction(action)) {
      return false;
    }
    
    // Check for suspicious activity
    if (await this.detectSuspiciousActivity(userId, action)) {
      return false;
    }
    
    return true;
  }
  
  private async detectSuspiciousActivity(userId: string, action: UserAction): Promise<boolean> {
    // Check for rapid-fire actions
    const recentActions = await this.getRecentActions(userId, 60000); // Last minute
    if (recentActions.length > 10) {
      return true;
    }
    
    // Check for impossible XP gains
    const xpGain = this.calculateXPGain(action);
    if (xpGain > 1000) { // Suspiciously high XP gain
      return true;
    }
    
    return false;
  }
}
```

### Anti-Cheating Measures
```typescript
class AntiCheatSystem {
  async validateXPClaim(userId: string, claimedXP: number, task: Task): Promise<boolean> {
    // Calculate expected XP
    const expectedXP = this.calculateExpectedXP(task);
    
    // Allow for small variations due to bonuses
    const tolerance = expectedXP * 0.1; // 10% tolerance
    
    if (Math.abs(claimedXP - expectedXP) > tolerance) {
      await this.flagSuspiciousActivity(userId, 'XP_MISMATCH');
      return false;
    }
    
    return true;
  }
  
  async validateStreakClaim(userId: string, claimedStreak: number): Promise<boolean> {
    const actualStreak = await this.calculateActualStreak(userId);
    
    if (claimedStreak > actualStreak + 1) { // Allow for 1 day variation
      await this.flagSuspiciousActivity(userId, 'STREAK_MISMATCH');
      return false;
    }
    
    return true;
  }
}
```
