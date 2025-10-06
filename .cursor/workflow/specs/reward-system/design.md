# Reward System Specification

## Overview
The Reward System provides a comprehensive framework for recognizing and incentivizing user achievements, healthy behaviors, and engagement in the Diet Planner Game application.

## EARS Requirements

### Epic Requirements
- **EPIC-RS-001**: The system SHALL provide a comprehensive reward system to motivate healthy eating behaviors
- **EPIC-RS-002**: The system SHALL implement multiple reward types and distribution mechanisms
- **EPIC-RS-003**: The system SHALL ensure fair and balanced reward distribution

### Feature Requirements
- **FEAT-RS-001**: The system SHALL award points for various healthy eating activities
- **FEAT-RS-002**: The system SHALL provide achievement badges and milestones
- **FEAT-RS-003**: The system SHALL implement daily, weekly, and monthly rewards
- **FEAT-RS-004**: The system SHALL support custom rewards and special events

### User Story Requirements
- **US-RS-001**: As a user, I want to earn rewards for healthy eating so that I feel motivated to continue
- **US-RS-002**: As a user, I want to unlock achievements so that I can see my progress and feel accomplished
- **US-RS-003**: As a user, I want to receive special rewards so that I feel valued and engaged

### Acceptance Criteria
- **AC-RS-001**: Given a user completes a healthy activity, when the system processes the action, then they SHALL receive appropriate rewards
- **AC-RS-002**: Given a user achieves a milestone, when the system detects the achievement, then they SHALL receive a badge and notification
- **AC-RS-003**: Given a user participates in a special event, when the event ends, then they SHALL receive special rewards

## Reward Types

### 1. Point Rewards
- **Base Points**: Points for basic activities (logging meals, meeting goals)
- **Bonus Points**: Extra points for exceptional behavior (streaks, variety)
- **Multiplier Points**: Point multipliers for special events or achievements
- **Daily Bonus**: Bonus points for daily engagement

### 2. Achievement Rewards
- **Badges**: Visual representations of achievements
- **Milestones**: Significant progress markers
- **Streaks**: Consecutive day achievements
- **Variety**: Diversity in food choices
- **Social**: Community-based achievements

### 3. Special Rewards
- **Seasonal**: Holiday and seasonal event rewards
- **Limited Time**: Time-limited special rewards
- **Community**: Group achievement rewards
- **Personal**: Custom user-defined rewards

## Implementation

### 1. Reward Service
```typescript
class RewardService {
  async awardPoints(userId: string, activity: string, data: any): Promise<number> {
    const points = this.calculatePoints(activity, data);
    await this.addPoints(userId, points, activity);
    return points;
  }

  private calculatePoints(activity: string, data: any): number {
    const basePoints = this.getBasePoints(activity);
    const multiplier = this.getMultiplier(activity, data);
    const bonus = this.getBonus(activity, data);
    return Math.floor((basePoints + bonus) * multiplier);
  }

  private getBasePoints(activity: string): number {
    const points = {
      'log_meal': 10,
      'log_water': 5,
      'complete_goal': 25,
      'maintain_streak': 20,
      'log_variety': 15,
      'share_meal': 10,
      'complete_challenge': 50
    };
    return points[activity] || 0;
  }

  private getMultiplier(activity: string, data: any): number {
    let multiplier = 1.0;
    
    // Weekend multiplier
    if (new Date().getDay() === 0 || new Date().getDay() === 6) {
      multiplier *= 1.5;
    }
    
    // Holiday multiplier
    if (this.isHoliday()) {
      multiplier *= 2.0;
    }
    
    // Streak multiplier
    if (data.streak && data.streak > 7) {
      multiplier *= 1.2;
    }
    
    return multiplier;
  }

  private getBonus(activity: string, data: any): number {
    let bonus = 0;
    
    // Variety bonus
    if (activity === 'log_meal' && data.variety) {
      bonus += data.variety * 5;
    }
    
    // Goal completion bonus
    if (activity === 'complete_goal' && data.goalType === 'weight_loss') {
      bonus += 50;
    }
    
    return bonus;
  }

  async checkAchievements(userId: string, activity: string, data: any): Promise<Achievement[]> {
    const achievements = await this.getAvailableAchievements(userId);
    const unlocked = [];
    
    for (const achievement of achievements) {
      if (this.checkAchievementCondition(achievement, activity, data)) {
        await this.unlockAchievement(userId, achievement.id);
        unlocked.push(achievement);
      }
    }
    
    return unlocked;
  }

  private checkAchievementCondition(achievement: Achievement, activity: string, data: any): boolean {
    switch (achievement.condition.type) {
      case 'count':
        return data.count >= achievement.condition.target;
      case 'streak':
        return data.streak >= achievement.condition.target;
      case 'variety':
        return data.variety >= achievement.condition.target;
      case 'custom':
        return achievement.condition.custom(data);
      default:
        return false;
    }
  }
}
```

### 2. Achievement System
```typescript
interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: AchievementCondition;
  rewards: Reward[];
  isActive: boolean;
}

interface AchievementCondition {
  type: 'count' | 'streak' | 'variety' | 'custom';
  target: number;
  activity?: string;
  custom?: (data: any) => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_meal',
    name: 'First Meal',
    description: 'Log your first meal',
    icon: '🍽️',
    category: 'milestone',
    rarity: 'common',
    condition: {
      type: 'count',
      target: 1,
      activity: 'log_meal'
    },
    rewards: [
      { type: 'points', value: 50 },
      { type: 'badge', value: 'first_meal' }
    ],
    isActive: true
  },
  {
    id: 'week_warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    category: 'streak',
    rarity: 'rare',
    condition: {
      type: 'streak',
      target: 7,
      activity: 'daily_goal'
    },
    rewards: [
      { type: 'points', value: 200 },
      { type: 'badge', value: 'week_warrior' }
    ],
    isActive: true
  },
  {
    id: 'variety_master',
    name: 'Variety Master',
    description: 'Try 50 different foods',
    icon: '🌈',
    category: 'variety',
    rarity: 'epic',
    condition: {
      type: 'variety',
      target: 50,
      activity: 'log_meal'
    },
    rewards: [
      { type: 'points', value: 500 },
      { type: 'badge', value: 'variety_master' }
    ],
    isActive: true
  }
];
```

### 3. Reward Distribution
```typescript
class RewardDistributionService {
  async distributeRewards(userId: string, activity: string, data: any): Promise<RewardResult> {
    const result: RewardResult = {
      points: 0,
      achievements: [],
      notifications: []
    };

    // Award points
    const points = await this.rewardService.awardPoints(userId, activity, data);
    result.points = points;

    // Check achievements
    const achievements = await this.rewardService.checkAchievements(userId, activity, data);
    result.achievements = achievements;

    // Create notifications
    if (points > 0) {
      result.notifications.push({
        type: 'points',
        message: `You earned ${points} points!`,
        data: { points }
      });
    }

    for (const achievement of achievements) {
      result.notifications.push({
        type: 'achievement',
        message: `Achievement unlocked: ${achievement.name}`,
        data: { achievement }
      });
    }

    return result;
  }

  async processDailyRewards(userId: string): Promise<void> {
    const today = new Date();
    const user = await this.getUser(userId);
    
    // Daily engagement bonus
    if (user.dailyActivities.length > 0) {
      await this.awardPoints(userId, 'daily_engagement', {
        activities: user.dailyActivities.length
      });
    }
    
    // Streak maintenance
    if (user.currentStreak > 0) {
      await this.awardPoints(userId, 'maintain_streak', {
        streak: user.currentStreak
      });
    }
  }

  async processWeeklyRewards(userId: string): Promise<void> {
    const week = this.getCurrentWeek();
    const user = await this.getUser(userId);
    
    // Weekly goal completion
    const weeklyGoals = await this.getWeeklyGoals(userId, week);
    const completedGoals = weeklyGoals.filter(goal => goal.completed);
    
    if (completedGoals.length > 0) {
      await this.awardPoints(userId, 'weekly_goals', {
        completed: completedGoals.length,
        total: weeklyGoals.length
      });
    }
  }

  async processMonthlyRewards(userId: string): Promise<void> {
    const month = this.getCurrentMonth();
    const user = await this.getUser(userId);
    
    // Monthly progress bonus
    const monthlyProgress = await this.getMonthlyProgress(userId, month);
    
    if (monthlyProgress.goalAchievement > 0.8) {
      await this.awardPoints(userId, 'monthly_progress', {
        achievement: monthlyProgress.goalAchievement
      });
    }
  }
}
```

## Usage Examples

### 1. Meal Logging Rewards
```typescript
// Award rewards for meal logging
const handleMealLog = async (mealData: any) => {
  try {
    // Log the meal
    await mealService.logMeal(mealData);
    
    // Award rewards
    const rewards = await rewardDistributionService.distributeRewards(
      userId,
      'log_meal',
      {
        mealType: mealData.mealType,
        calories: mealData.totalCalories,
        variety: mealData.foodVariety,
        count: user.mealCount + 1
      }
    );
    
    // Show notifications
    if (rewards.points > 0) {
      showNotification(`You earned ${rewards.points} points!`);
    }
    
    for (const achievement of rewards.achievements) {
      showNotification(`Achievement unlocked: ${achievement.name}`);
    }
    
  } catch (error) {
    console.error('Failed to log meal:', error);
  }
};
```

### 2. Challenge Completion Rewards
```typescript
// Award rewards for challenge completion
const handleChallengeComplete = async (challengeId: string) => {
  try {
    // Complete the challenge
    await challengeService.completeChallenge(userId, challengeId);
    
    // Award rewards
    const rewards = await rewardDistributionService.distributeRewards(
      userId,
      'complete_challenge',
      {
        challengeId,
        challengeType: 'weekly',
        difficulty: 'medium'
      }
    );
    
    // Show celebration
    if (rewards.achievements.length > 0) {
      showCelebration(rewards.achievements[0]);
    }
    
  } catch (error) {
    console.error('Failed to complete challenge:', error);
  }
};
```

## Styling

### 1. CSS Styles
```css
.reward-notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #4CAF50;
  color: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease;
}

.reward-notification.achievement {
  background: #FF9800;
}

.reward-notification.points {
  background: #4CAF50;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.achievement-badge {
  display: inline-block;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin: 2px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.achievement-badge.rare {
  background: linear-gradient(135deg, #9C27B0, #673AB7);
}

.achievement-badge.epic {
  background: linear-gradient(135deg, #E91E63, #9C27B0);
}

.achievement-badge.legendary {
  background: linear-gradient(135deg, #FF5722, #E91E63);
}

.points-display {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f8f9fa;
  padding: 8px 12px;
  border-radius: 20px;
  font-weight: 600;
  color: #4CAF50;
}

.points-display .icon {
  font-size: 16px;
}

.reward-celebration {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  text-align: center;
  z-index: 2000;
  animation: popIn 0.5s ease;
}

@keyframes popIn {
  from {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

.celebration-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.celebration-title {
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
}

.celebration-description {
  color: #666;
  margin-bottom: 20px;
}

.celebration-rewards {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.reward-item {
  text-align: center;
}

.reward-item .icon {
  font-size: 24px;
  display: block;
  margin-bottom: 5px;
}

.reward-item .value {
  font-weight: 600;
  color: #4CAF50;
}
```

## Testing Strategy

### 1. Unit Testing
```typescript
describe('RewardService', () => {
  let rewardService: RewardService;

  beforeEach(() => {
    rewardService = new RewardService();
  });

  it('calculates points correctly for meal logging', () => {
    const points = rewardService.calculatePoints('log_meal', {
      mealType: 'lunch',
      calories: 500
    });
    
    expect(points).toBe(10); // Base points for meal logging
  });

  it('applies weekend multiplier correctly', () => {
    // Mock weekend
    jest.spyOn(Date.prototype, 'getDay').mockReturnValue(0); // Sunday
    
    const points = rewardService.calculatePoints('log_meal', {
      mealType: 'lunch',
      calories: 500
    });
    
    expect(points).toBe(15); // 10 * 1.5 weekend multiplier
  });

  it('checks achievement conditions correctly', () => {
    const achievement = ACHIEVEMENTS.find(a => a.id === 'first_meal');
    const condition = rewardService.checkAchievementCondition(
      achievement,
      'log_meal',
      { count: 1 }
    );
    
    expect(condition).toBe(true);
  });
});
```

## Future Enhancements

### 1. Advanced Features
- **Dynamic Rewards**: AI-calculated rewards based on user behavior
- **Social Rewards**: Rewards for community participation
- **Seasonal Events**: Special rewards for holidays and events
- **Personalized Rewards**: Custom rewards based on user preferences

### 2. Performance Optimizations
- **Batch Processing**: Process multiple rewards efficiently
- **Caching**: Cache reward calculations and achievements
- **Async Processing**: Process rewards asynchronously
- **Rate Limiting**: Prevent reward farming and abuse

