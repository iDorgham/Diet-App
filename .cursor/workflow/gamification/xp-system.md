# XP System Specification

## EARS Requirements

**EARS-GAM-001**: The system shall award XP for task completion based on task type and difficulty.

**EARS-GAM-002**: The system shall calculate level progression using the formula: XP required = level × 100.

**EARS-GAM-003**: The system shall award bonus coins (+50) for each level up achieved.

**EARS-GAM-004**: The system shall display level up notifications with celebration messages.

**EARS-GAM-005**: The system shall track XP progress with visual progress bars.

## XP Award System

### Task XP Rewards
```typescript
const XP_REWARDS = {
  MEAL: 15,           // Basic meal completion
  SHOPPING: 20,       // Shopping task completion
  COOKING: 30,        // Cooking/prep tasks
  EXERCISE: 40,       // Workout logging
  WATER: 15,          // Hydration goals
  DAILY_CHECKIN: 20,  // Daily check-in
  AI_CHAT: 10,        // AI coach interaction
};
```

### Level Calculation
```typescript
const calculateXPForNextLevel = (level: number): number => {
  return level * 100;
};

const checkAndApplyLevelUp = (
  currentProgress: UserProgress,
  xpGained: number,
  setMessage: (msg: string) => void
): LevelUpResult => {
  let { level, currentXP, coins } = currentProgress;
  let newXP = currentXP + xpGained;
  let leveledUp = false;
  let bonusCoins = 0;

  while (newXP >= calculateXPForNextLevel(level)) {
    const xpRequired = calculateXPForNextLevel(level);
    newXP -= xpRequired;
    level += 1;
    leveledUp = true;
    bonusCoins += 50;
    setMessage(`✨ Congratulations! You reached Level ${level}! (+${bonusCoins} Bonus Coins!)`);
  }

  return {
    level,
    currentXP: newXP,
    bonusCoins,
    leveledUp
  };
};
```

## Star Milestone System

### Days Score Stars
```typescript
const STAR_THRESHOLDS = [50, 250, 750, 2000, 5000];

const calculateStars = (score: number): number => {
  return STAR_THRESHOLDS.filter(threshold => score >= threshold).length;
};
```

### Star Display Logic
- ⭐ 1 star: 50+ score
- ⭐⭐ 2 stars: 250+ score  
- ⭐⭐⭐ 3 stars: 750+ score
- ⭐⭐⭐⭐ 4 stars: 2000+ score
- ⭐⭐⭐⭐⭐ 5 stars: 5000+ score

## Reward Multipliers

### Streak Bonuses
```typescript
const STREAK_MULTIPLIERS = {
  3: 1.2,    // 20% bonus for 3-day streak
  7: 1.5,    // 50% bonus for 7-day streak
  14: 2.0,   // 100% bonus for 14-day streak
  30: 3.0,   // 200% bonus for 30-day streak
};
```

### Time-based Bonuses
- Early completion: +25% XP
- On-time completion: Standard XP
- Late completion: -10% XP

## UI Components

### Level Card Component
```typescript
interface LevelCardProps {
  level: number;
  currentXP: number;
  bodyType: string;
  nextLevelXP: number;
}
```

### Progress Bar
- Visual representation of XP progress
- Smooth animations for level ups
- Color coding: Blue for progress, Green for completion

### Star Display
- Dynamic star rendering based on score
- Hover effects for milestone information
- Celebration animations for new stars

## Data Models

### User Progress
```typescript
interface UserProgress {
  score: number;        // Total score points
  coins: number;        // Currency for unlocks
  level: number;        // Current level
  currentXP: number;    // XP towards next level
  recipesUnlocked: number;
  hasClaimedGift: boolean;
}
```

### Level Up Result
```typescript
interface LevelUpResult {
  level: number;
  currentXP: number;
  bonusCoins: number;
  leveledUp: boolean;
}
```

## Integration Points

### Firestore Integration
- Real-time XP updates
- Level progression tracking
- Achievement history

### UI Updates
- Progress bar animations
- Level up notifications
- Star milestone celebrations

### Analytics
- XP earning patterns
- Level progression rates
- Engagement metrics

## Testing Requirements

### Unit Tests
- XP calculation functions
- Level up logic
- Star milestone calculations

### Integration Tests
- Firestore XP updates
- UI state synchronization
- Notification system

### Performance Tests
- Large XP calculations
- Real-time update frequency
- Animation performance

## Future Enhancements

### Advanced Features
- XP boost items
- Seasonal multipliers
- Guild/team bonuses
- Achievement badges

### Social Features
- Leaderboards
- XP sharing
- Challenge competitions
- Mentor systems
