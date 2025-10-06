# Leaderboard System Specification

## EARS Requirements

**EARS-LDR-001**: The system shall provide multiple leaderboard categories including global, regional, and friend-based rankings.

**EARS-LDR-002**: The system shall update leaderboard rankings in real-time based on user performance metrics.

**EARS-LDR-003**: The system shall implement fair ranking algorithms that prevent gaming and ensure competitive integrity.

**EARS-LDR-004**: The system shall provide seasonal leaderboards with reset periods and special rewards.

**EARS-LDR-005**: The system shall display leaderboard positions with visual indicators and progress tracking.

**EARS-LDR-006**: The system shall implement anti-cheat measures and ranking validation systems.

## Leaderboard Categories

### Global Leaderboards
```typescript
const GLOBAL_LEADERBOARDS = {
  OVERALL_SCORE: {
    id: 'global_overall_score',
    name: 'Global Champions',
    description: 'Top performers across all metrics',
    category: 'overall',
    scope: 'global',
    metrics: ['totalScore', 'level', 'achievements'],
    updateFrequency: 'real-time',
    maxEntries: 1000,
    rewards: {
      top1: { xp: 1000, coins: 500, badge: 'crown' },
      top10: { xp: 500, coins: 250, badge: 'gold' },
      top100: { xp: 100, coins: 50, badge: 'silver' }
    }
  },
  
  NUTRITION_MASTERY: {
    id: 'global_nutrition_mastery',
    name: 'Nutrition Masters',
    description: 'Best nutrition tracking consistency',
    category: 'nutrition',
    scope: 'global',
    metrics: ['mealsLogged', 'macroAccuracy', 'streakDays'],
    updateFrequency: 'daily',
    maxEntries: 500,
    rewards: {
      top1: { xp: 800, coins: 400, badge: 'nutrition_king' },
      top10: { xp: 400, coins: 200, badge: 'nutrition_expert' },
      top100: { xp: 80, coins: 40, badge: 'nutrition_enthusiast' }
    }
  },
  
  QUEST_COMPLETION: {
    id: 'global_quest_completion',
    name: 'Quest Conquerors',
    description: 'Most quests completed',
    category: 'quests',
    scope: 'global',
    metrics: ['questsCompleted', 'questStreak', 'difficultyBonus'],
    updateFrequency: 'real-time',
    maxEntries: 500,
    rewards: {
      top1: { xp: 1200, coins: 600, badge: 'quest_master' },
      top10: { xp: 600, coins: 300, badge: 'quest_hero' },
      top100: { xp: 120, coins: 60, badge: 'quest_warrior' }
    }
  }
};
```

### Regional Leaderboards
```typescript
const REGIONAL_LEADERBOARDS = {
  NORTH_AMERICA: {
    id: 'regional_north_america',
    name: 'North America Champions',
    description: 'Top performers in North America',
    category: 'regional',
    scope: 'north_america',
    timezone: 'America/New_York',
    metrics: ['totalScore', 'level', 'achievements'],
    updateFrequency: 'daily',
    maxEntries: 100
  },
  
  EUROPE: {
    id: 'regional_europe',
    name: 'European Champions',
    description: 'Top performers in Europe',
    category: 'regional',
    scope: 'europe',
    timezone: 'Europe/London',
    metrics: ['totalScore', 'level', 'achievements'],
    updateFrequency: 'daily',
    maxEntries: 100
  },
  
  ASIA_PACIFIC: {
    id: 'regional_asia_pacific',
    name: 'Asia Pacific Champions',
    description: 'Top performers in Asia Pacific',
    category: 'regional',
    scope: 'asia_pacific',
    timezone: 'Asia/Tokyo',
    metrics: ['totalScore', 'level', 'achievements'],
    updateFrequency: 'daily',
    maxEntries: 100
  }
};
```

### Friend Leaderboards
```typescript
const FRIEND_LEADERBOARDS = {
  FRIENDS_SCORE: {
    id: 'friends_score',
    name: 'Friend Competition',
    description: 'Ranking among your friends',
    category: 'friends',
    scope: 'friends',
    metrics: ['totalScore', 'level', 'achievements'],
    updateFrequency: 'real-time',
    maxEntries: 50,
    requirements: {
      minFriends: 1,
      maxFriends: 100
    }
  },
  
  FRIENDS_WEEKLY: {
    id: 'friends_weekly',
    name: 'Weekly Friend Challenge',
    description: 'Weekly competition among friends',
    category: 'friends',
    scope: 'friends',
    metrics: ['weeklyScore', 'weeklyQuests', 'weeklyStreak'],
    updateFrequency: 'real-time',
    resetPeriod: 'weekly',
    maxEntries: 50
  }
};
```

## Ranking Algorithm

### Score Calculation
```typescript
interface LeaderboardScore {
  userId: string;
  totalScore: number;
  level: number;
  achievements: number;
  streakDays: number;
  questsCompleted: number;
  mealsLogged: number;
  macroAccuracy: number;
  lastActivity: Date;
  rank: number;
  previousRank: number;
  rankChange: number;
}

const calculateLeaderboardScore = (
  userData: UserData,
  leaderboardType: string
): number => {
  let score = 0;
  
  switch (leaderboardType) {
    case 'overall':
      score = (
        userData.totalScore * 1.0 +
        userData.level * 100 +
        userData.achievements * 50 +
        userData.streakDays * 10
      );
      break;
      
    case 'nutrition':
      score = (
        userData.mealsLogged * 5 +
        userData.macroAccuracy * 2 +
        userData.nutritionStreak * 15
      );
      break;
      
    case 'quests':
      score = (
        userData.questsCompleted * 20 +
        userData.questStreak * 25 +
        userData.difficultyBonus * 10
      );
      break;
  }
  
  // Apply activity bonus/penalty
  const daysSinceActivity = getDaysSinceLastActivity(userData.lastActivity);
  if (daysSinceActivity > 7) {
    score *= 0.9; // 10% penalty for inactivity
  } else if (daysSinceActivity <= 1) {
    score *= 1.1; // 10% bonus for recent activity
  }
  
  return Math.round(score);
};
```

### Ranking Updates
```typescript
export class LeaderboardService {
  static async updateLeaderboard(
    leaderboardId: string,
    userId: string,
    newScore: number
  ): Promise<LeaderboardUpdate> {
    const leaderboard = await this.getLeaderboard(leaderboardId);
    const userEntry = leaderboard.entries.find(e => e.userId === userId);
    
    if (!userEntry) {
      // New user entry
      const newEntry = {
        userId,
        score: newScore,
        rank: 0,
        previousRank: 0,
        rankChange: 0,
        lastUpdated: new Date()
      };
      
      leaderboard.entries.push(newEntry);
    } else {
      // Update existing entry
      userEntry.previousRank = userEntry.rank;
      userEntry.score = newScore;
      userEntry.lastUpdated = new Date();
    }
    
    // Sort and rank entries
    leaderboard.entries.sort((a, b) => b.score - a.score);
    leaderboard.entries.forEach((entry, index) => {
      entry.rank = index + 1;
      entry.rankChange = entry.previousRank - entry.rank;
    });
    
    // Keep only top entries
    leaderboard.entries = leaderboard.entries.slice(0, leaderboard.maxEntries);
    
    // Save updated leaderboard
    await this.saveLeaderboard(leaderboard);
    
    // Check for rank changes and rewards
    const rankChange = userEntry?.rankChange || 0;
    if (rankChange > 0) {
      await this.awardRankUpRewards(userId, leaderboardId, userEntry.rank);
    }
    
    return {
      leaderboardId,
      userId,
      newRank: userEntry?.rank || 0,
      rankChange,
      score: newScore
    };
  }
}
```

## Seasonal Leaderboards

### Season Configuration
```typescript
interface Season {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  duration: number; // days
  leaderboards: string[];
  rewards: SeasonRewards;
  theme: string;
  specialRules: string[];
}

const SEASONS = {
  SPRING_CHALLENGE: {
    id: 'spring_challenge_2024',
    name: 'Spring Nutrition Challenge',
    description: 'Fresh start with healthy eating habits',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-05-31'),
    duration: 92,
    leaderboards: ['nutrition_mastery', 'quest_completion'],
    rewards: {
      participation: { xp: 100, coins: 50 },
      top10: { xp: 1000, coins: 500, badge: 'spring_champion' },
      top100: { xp: 500, coins: 250, badge: 'spring_warrior' }
    },
    theme: 'spring',
    specialRules: [
      'Double XP for vegetable logging',
      'Bonus coins for meal prep tasks',
      'Special spring-themed quests'
    ]
  },
  
  SUMMER_FITNESS: {
    id: 'summer_fitness_2024',
    name: 'Summer Fitness Blitz',
    description: 'Get active and stay healthy this summer',
    startDate: new Date('2024-06-01'),
    endDate: new Date('2024-08-31'),
    duration: 92,
    leaderboards: ['overall_score', 'quest_completion'],
    rewards: {
      participation: { xp: 150, coins: 75 },
      top10: { xp: 1500, coins: 750, badge: 'summer_athlete' },
      top100: { xp: 750, coins: 375, badge: 'summer_warrior' }
    },
    theme: 'summer',
    specialRules: [
      'Triple XP for exercise logging',
      'Bonus coins for outdoor activities',
      'Special summer-themed achievements'
    ]
  }
};
```

### Season Management
```typescript
export class SeasonService {
  static async getCurrentSeason(): Promise<Season | null> {
    const now = new Date();
    const seasons = Object.values(SEASONS);
    
    return seasons.find(season => 
      now >= season.startDate && now <= season.endDate
    ) || null;
  }
  
  static async endSeason(seasonId: string): Promise<SeasonResults> {
    const season = SEASONS[seasonId];
    if (!season) throw new Error('Season not found');
    
    // Calculate final rankings
    const finalRankings = await this.calculateFinalRankings(season);
    
    // Award season rewards
    const rewards = await this.awardSeasonRewards(season, finalRankings);
    
    // Archive season data
    await this.archiveSeasonData(season, finalRankings);
    
    // Reset leaderboards for next season
    await this.resetSeasonalLeaderboards(season.leaderboards);
    
    return {
      seasonId,
      finalRankings,
      rewards,
      participants: finalRankings.length,
      endDate: new Date()
    };
  }
}
```

## Anti-Cheat System

### Validation Rules
```typescript
interface ValidationRule {
  id: string;
  name: string;
  description: string;
  check: (userData: UserData) => ValidationResult;
  severity: 'warning' | 'error' | 'critical';
  action: 'flag' | 'penalty' | 'ban';
}

const VALIDATION_RULES = {
  IMPOSSIBLE_SCORE: {
    id: 'impossible_score',
    name: 'Impossible Score Detection',
    description: 'Detect scores that are mathematically impossible',
    check: (userData) => {
      const maxPossibleScore = calculateMaxPossibleScore(userData);
      if (userData.totalScore > maxPossibleScore * 1.1) {
        return {
          passed: false,
          reason: 'Score exceeds maximum possible value',
          confidence: 0.9
        };
      }
      return { passed: true };
    },
    severity: 'critical',
    action: 'ban'
  },
  
  SUSPICIOUS_ACTIVITY: {
    id: 'suspicious_activity',
    name: 'Suspicious Activity Pattern',
    description: 'Detect unusual activity patterns',
    check: (userData) => {
      const activityPattern = analyzeActivityPattern(userData);
      if (activityPattern.suspiciousness > 0.8) {
        return {
          passed: false,
          reason: 'Suspicious activity pattern detected',
          confidence: activityPattern.suspiciousness
        };
      }
      return { passed: true };
    },
    severity: 'warning',
    action: 'flag'
  },
  
  RAPID_PROGRESSION: {
    id: 'rapid_progression',
    name: 'Rapid Progression Detection',
    description: 'Detect unusually fast progression',
    check: (userData) => {
      const progressionRate = calculateProgressionRate(userData);
      if (progressionRate > 2.0) { // 2x normal rate
        return {
          passed: false,
          reason: 'Progression rate exceeds normal limits',
          confidence: Math.min(progressionRate / 2, 1.0)
        };
      }
      return { passed: true };
    },
    severity: 'error',
    action: 'penalty'
  }
};
```

### Cheat Detection Service
```typescript
export class CheatDetectionService {
  static async validateUserData(userId: string): Promise<ValidationReport> {
    const userData = await UserService.getUserData(userId);
    const violations: ValidationViolation[] = [];
    
    // Run all validation rules
    for (const rule of Object.values(VALIDATION_RULES)) {
      const result = rule.check(userData);
      if (!result.passed) {
        violations.push({
          ruleId: rule.id,
          ruleName: rule.name,
          reason: result.reason,
          confidence: result.confidence,
          severity: rule.severity,
          action: rule.action,
          timestamp: new Date()
        });
      }
    }
    
    // Determine overall validation status
    const criticalViolations = violations.filter(v => v.severity === 'critical');
    const errorViolations = violations.filter(v => v.severity === 'error');
    
    let status: 'clean' | 'flagged' | 'suspended' | 'banned';
    if (criticalViolations.length > 0) {
      status = 'banned';
    } else if (errorViolations.length > 0) {
      status = 'suspended';
    } else if (violations.length > 0) {
      status = 'flagged';
    } else {
      status = 'clean';
    }
    
    return {
      userId,
      status,
      violations,
      validatedAt: new Date(),
      nextValidation: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };
  }
}
```

## UI Components

### Leaderboard Display
```typescript
interface LeaderboardProps {
  leaderboardId: string;
  currentUserId: string;
  showRankChange?: boolean;
  showRewards?: boolean;
  maxEntries?: number;
}

const Leaderboard: React.FC<LeaderboardProps> = ({
  leaderboardId,
  currentUserId,
  showRankChange = true,
  showRewards = true,
  maxEntries = 100
}) => {
  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', leaderboardId],
    queryFn: () => LeaderboardService.getLeaderboard(leaderboardId),
    refetchInterval: 30000 // 30 seconds
  });
  
  if (isLoading) return <LeaderboardSkeleton />;
  
  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>{leaderboard.name}</h2>
        <p>{leaderboard.description}</p>
        <div className="leaderboard-stats">
          <span>Total Participants: {leaderboard.totalParticipants}</span>
          <span>Last Updated: {formatTime(leaderboard.lastUpdated)}</span>
        </div>
      </div>
      
      <div className="leaderboard-entries">
        {leaderboard.entries.slice(0, maxEntries).map((entry, index) => (
          <LeaderboardEntry
            key={entry.userId}
            entry={entry}
            position={index + 1}
            isCurrentUser={entry.userId === currentUserId}
            showRankChange={showRankChange}
            showRewards={showRewards}
          />
        ))}
      </div>
      
      {currentUserId && (
        <UserRankCard
          userId={currentUserId}
          leaderboardId={leaderboardId}
        />
      )}
    </div>
  );
};
```

### Rank Change Indicators
```typescript
const RankChangeIndicator: React.FC<{ change: number }> = ({ change }) => {
  if (change > 0) {
    return (
      <div className="rank-change rank-up">
        <ArrowUp className="w-4 h-4" />
        <span>+{change}</span>
      </div>
    );
  } else if (change < 0) {
    return (
      <div className="rank-change rank-down">
        <ArrowDown className="w-4 h-4" />
        <span>{Math.abs(change)}</span>
      </div>
    );
  }
  
  return (
    <div className="rank-change rank-same">
      <Minus className="w-4 h-4" />
    </div>
  );
};
```

## Integration Points

### Real-time Updates
```typescript
// WebSocket integration for real-time leaderboard updates
export class LeaderboardWebSocket {
  private static ws: WebSocket;
  
  static connect(userId: string) {
    this.ws = new WebSocket(`ws://localhost:8080/leaderboard?userId=${userId}`);
    
    this.ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      this.handleLeaderboardUpdate(update);
    };
  }
  
  private static handleLeaderboardUpdate(update: LeaderboardUpdate) {
    // Update local leaderboard state
    queryClient.setQueryData(
      ['leaderboard', update.leaderboardId],
      (oldData: Leaderboard) => {
        if (!oldData) return oldData;
        
        const updatedEntries = oldData.entries.map(entry => {
          if (entry.userId === update.userId) {
            return {
              ...entry,
              score: update.score,
              rank: update.newRank,
              rankChange: update.rankChange
            };
          }
          return entry;
        });
        
        return {
          ...oldData,
          entries: updatedEntries.sort((a, b) => a.rank - b.rank),
          lastUpdated: new Date()
        };
      }
    );
    
    // Show rank change notification
    if (update.rankChange > 0) {
      showNotification({
        type: 'success',
        message: `You moved up ${update.rankChange} positions!`,
        duration: 3000
      });
    }
  }
}
```

This leaderboard system provides comprehensive competitive features while maintaining fairness and preventing cheating through robust validation systems.
