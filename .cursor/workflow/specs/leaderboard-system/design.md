# Leaderboard System Specification

## Overview
The Leaderboard System provides competitive rankings and social comparison features to motivate users and foster community engagement in the Diet Planner Game application.

## EARS Requirements

### Epic Requirements
- **EPIC-LS-001**: The system SHALL provide comprehensive leaderboards for various metrics and time periods
- **EPIC-LS-002**: The system SHALL implement fair ranking algorithms and anti-cheating measures
- **EPIC-LS-003**: The system SHALL ensure real-time updates and accurate rankings

### Feature Requirements
- **FEAT-LS-001**: The system SHALL display user rankings based on points, streaks, and achievements
- **FEAT-LS-002**: The system SHALL provide daily, weekly, and monthly leaderboards
- **FEAT-LS-003**: The system SHALL implement seasonal leaderboards and special events
- **FEAT-LS-004**: The system SHALL support friend comparisons and social features

### User Story Requirements
- **US-LS-001**: As a user, I want to see my ranking compared to others so that I can stay motivated
- **US-LS-002**: As a user, I want to compete with friends so that we can support each other
- **US-LS-003**: As a user, I want to see different types of leaderboards so that I can find my strengths

### Acceptance Criteria
- **AC-LS-001**: Given a leaderboard request, when the system processes it, then it SHALL return accurate rankings
- **AC-LS-002**: Given a user's score changes, when the system updates, then the leaderboard SHALL reflect the new ranking
- **AC-LS-003**: Given a new user, when they join, then they SHALL be included in appropriate leaderboards

## Leaderboard Types

### 1. Point-Based Leaderboards
- **Total Points**: Lifetime points earned
- **Weekly Points**: Points earned in the current week
- **Monthly Points**: Points earned in the current month
- **Daily Points**: Points earned today

### 2. Streak-Based Leaderboards
- **Current Streak**: Longest current streak
- **Best Streak**: Longest streak ever achieved
- **Weekly Streak**: Streak maintained this week
- **Monthly Streak**: Streak maintained this month

### 3. Achievement-Based Leaderboards
- **Total Achievements**: Number of achievements unlocked
- **Rare Achievements**: Number of rare achievements
- **Recent Achievements**: Achievements unlocked recently
- **Category Achievements**: Achievements in specific categories

### 4. Activity-Based Leaderboards
- **Meals Logged**: Total meals logged
- **Water Intake**: Daily water intake consistency
- **Goal Completion**: Percentage of goals completed
- **Community Participation**: Social interactions and sharing

## Implementation

### 1. Leaderboard Service
```typescript
class LeaderboardService {
  async getLeaderboard(type: string, period: string, limit: number = 100): Promise<LeaderboardEntry[]> {
    const cacheKey = `leaderboard:${type}:${period}`;
    
    // Try cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }
    
    // Calculate leaderboard
    const entries = await this.calculateLeaderboard(type, period, limit);
    
    // Cache for 5 minutes
    await this.cache.set(cacheKey, entries, 300);
    
    return entries;
  }

  private async calculateLeaderboard(type: string, period: string, limit: number): Promise<LeaderboardEntry[]> {
    const query = this.buildQuery(type, period);
    const results = await this.database.query(query, [limit]);
    
    return results.map((row: any, index: number) => ({
      rank: index + 1,
      userId: row.user_id,
      username: row.username,
      score: row.score,
      avatar: row.avatar_url,
      level: row.level,
      badge: row.badge,
      change: await this.getRankChange(row.user_id, type, period)
    }));
  }

  private buildQuery(type: string, period: string): string {
    const baseQuery = `
      SELECT 
        u.id as user_id,
        u.username,
        u.avatar_url,
        u.level,
        u.badge,
        ${this.getScoreField(type, period)} as score
      FROM users u
      WHERE u.is_active = true
      ORDER BY score DESC
      LIMIT $1
    `;
    
    return baseQuery;
  }

  private getScoreField(type: string, period: string): string {
    const fields = {
      'total_points': 'u.total_points',
      'weekly_points': 'COALESCE(wp.points, 0)',
      'monthly_points': 'COALESCE(mp.points, 0)',
      'daily_points': 'COALESCE(dp.points, 0)',
      'current_streak': 'u.current_streak',
      'best_streak': 'u.longest_streak',
      'achievements': 'u.achievements_unlocked',
      'meals_logged': 'u.meals_logged'
    };
    
    return fields[`${type}_${period}`] || fields[type] || 'u.total_points';
  }

  async getUserRank(userId: string, type: string, period: string): Promise<number> {
    const query = `
      SELECT rank FROM (
        SELECT 
          u.id,
          ROW_NUMBER() OVER (ORDER BY ${this.getScoreField(type, period)} DESC) as rank
        FROM users u
        WHERE u.is_active = true
      ) ranked
      WHERE id = $1
    `;
    
    const result = await this.database.query(query, [userId]);
    return result[0]?.rank || 0;
  }

  async getRankChange(userId: string, type: string, period: string): Promise<number> {
    const currentRank = await this.getUserRank(userId, type, period);
    const previousRank = await this.getPreviousRank(userId, type, period);
    
    if (previousRank === 0) return 0;
    return previousRank - currentRank; // Positive means improved
  }

  async updateLeaderboard(userId: string, type: string, score: number): Promise<void> {
    // Update user score
    await this.updateUserScore(userId, type, score);
    
    // Invalidate cache
    const cacheKey = `leaderboard:${type}:*`;
    await this.cache.invalidatePattern(cacheKey);
    
    // Update real-time leaderboard
    await this.updateRealTimeLeaderboard(userId, type, score);
  }
}
```

### 2. Real-Time Updates
```typescript
class RealTimeLeaderboardService {
  private io: SocketIOServer;
  private leaderboardCache: Map<string, LeaderboardEntry[]> = new Map();

  constructor(io: SocketIOServer) {
    this.io = io;
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket) => {
      socket.on('join_leaderboard', (data) => {
        socket.join(`leaderboard:${data.type}:${data.period}`);
      });

      socket.on('leave_leaderboard', (data) => {
        socket.leave(`leaderboard:${data.type}:${data.period}`);
      });
    });
  }

  async updateRealTimeLeaderboard(userId: string, type: string, score: number): Promise<void> {
    const periods = ['daily', 'weekly', 'monthly', 'total'];
    
    for (const period of periods) {
      const leaderboard = await this.leaderboardService.getLeaderboard(type, period, 100);
      this.leaderboardCache.set(`${type}:${period}`, leaderboard);
      
      // Broadcast update to connected clients
      this.io.to(`leaderboard:${type}:${period}`).emit('leaderboard_update', {
        type,
        period,
        leaderboard,
        updatedUser: userId
      });
    }
  }

  async getCachedLeaderboard(type: string, period: string): Promise<LeaderboardEntry[]> {
    const cacheKey = `${type}:${period}`;
    return this.leaderboardCache.get(cacheKey) || [];
  }
}
```

### 3. Anti-Cheating Measures
```typescript
class AntiCheatService {
  async validateScore(userId: string, type: string, score: number): Promise<boolean> {
    // Check for suspicious patterns
    const user = await this.getUser(userId);
    const previousScore = await this.getPreviousScore(userId, type);
    
    // Check for unrealistic score increases
    if (score > previousScore * 10) {
      await this.flagSuspiciousActivity(userId, 'unrealistic_score_increase');
      return false;
    }
    
    // Check for rapid score changes
    const recentChanges = await this.getRecentScoreChanges(userId, type);
    if (recentChanges.length > 10) {
      await this.flagSuspiciousActivity(userId, 'rapid_score_changes');
      return false;
    }
    
    // Check for bot-like behavior
    if (await this.detectBotBehavior(userId)) {
      await this.flagSuspiciousActivity(userId, 'bot_behavior');
      return false;
    }
    
    return true;
  }

  private async detectBotBehavior(userId: string): Promise<boolean> {
    const activities = await this.getRecentActivities(userId);
    
    // Check for too regular intervals
    const intervals = activities.map((a, i) => 
      i > 0 ? a.timestamp - activities[i-1].timestamp : 0
    );
    
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const variance = intervals.reduce((a, b) => a + Math.pow(b - avgInterval, 2), 0) / intervals.length;
    
    // If variance is too low, it might be a bot
    return variance < 1000; // Less than 1 second variance
  }

  async flagSuspiciousActivity(userId: string, reason: string): Promise<void> {
    await this.database.query(
      'INSERT INTO suspicious_activities (user_id, reason, timestamp) VALUES ($1, $2, NOW())',
      [userId, reason]
    );
    
    // Temporarily disable user if too many flags
    const flagCount = await this.getFlagCount(userId);
    if (flagCount > 5) {
      await this.temporarilyDisableUser(userId);
    }
  }
}
```

## Usage Examples

### 1. Leaderboard Component
```typescript
import React, { useState, useEffect } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard';

const Leaderboard: React.FC = () => {
  const [type, setType] = useState('total_points');
  const [period, setPeriod] = useState('total');
  const [limit, setLimit] = useState(100);
  
  const { leaderboard, loading, error } = useLeaderboard(type, period, limit);

  if (loading) return <div className="loading">Loading leaderboard...</div>;
  if (error) return <div className="error">Error loading leaderboard</div>;

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>Leaderboard</h2>
        <div className="leaderboard-controls">
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="total_points">Total Points</option>
            <option value="weekly_points">Weekly Points</option>
            <option value="monthly_points">Monthly Points</option>
            <option value="current_streak">Current Streak</option>
            <option value="achievements">Achievements</option>
          </select>
          
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="total">All Time</option>
            <option value="daily">Today</option>
            <option value="weekly">This Week</option>
            <option value="monthly">This Month</option>
          </select>
        </div>
      </div>

      <div className="leaderboard-list">
        {leaderboard.map((entry, index) => (
          <div key={entry.userId} className={`leaderboard-entry ${index < 3 ? 'top-three' : ''}`}>
            <div className="rank">
              {index === 0 && '🥇'}
              {index === 1 && '🥈'}
              {index === 2 && '🥉'}
              {index > 2 && `#${entry.rank}`}
            </div>
            
            <div className="user-info">
              <img src={entry.avatar} alt={entry.username} className="avatar" />
              <div className="user-details">
                <div className="username">{entry.username}</div>
                <div className="level">Level {entry.level}</div>
              </div>
            </div>
            
            <div className="score">
              <div className="score-value">{entry.score.toLocaleString()}</div>
              {entry.change !== 0 && (
                <div className={`score-change ${entry.change > 0 ? 'positive' : 'negative'}`}>
                  {entry.change > 0 ? '↑' : '↓'} {Math.abs(entry.change)}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
```

### 2. Friend Comparison
```typescript
const FriendComparison: React.FC = () => {
  const { friends, loading } = useFriends();
  const { userRank } = useUserRank();

  return (
    <div className="friend-comparison">
      <h3>Compare with Friends</h3>
      
      {friends.map(friend => (
        <div key={friend.id} className="friend-comparison-item">
          <div className="friend-info">
            <img src={friend.avatar} alt={friend.username} className="avatar" />
            <span className="username">{friend.username}</span>
          </div>
          
          <div className="comparison-stats">
            <div className="stat">
              <span className="label">Points:</span>
              <span className="value">{friend.totalPoints}</span>
            </div>
            <div className="stat">
              <span className="label">Streak:</span>
              <span className="value">{friend.currentStreak}</span>
            </div>
            <div className="stat">
              <span className="label">Rank:</span>
              <span className="value">#{friend.rank}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
```

## Styling

### 1. CSS Styles
```css
.leaderboard {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.leaderboard-header {
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.leaderboard-header h2 {
  margin: 0;
  color: #333;
}

.leaderboard-controls {
  display: flex;
  gap: 10px;
}

.leaderboard-controls select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  font-size: 14px;
}

.leaderboard-list {
  max-height: 500px;
  overflow-y: auto;
}

.leaderboard-entry {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s ease;
}

.leaderboard-entry:hover {
  background: #f8f9fa;
}

.leaderboard-entry.top-three {
  background: linear-gradient(135deg, #fff3e0, #ffe0b2);
}

.leaderboard-entry.top-three:first-child {
  background: linear-gradient(135deg, #fff8e1, #ffecb3);
}

.rank {
  font-size: 24px;
  font-weight: 700;
  color: #4CAF50;
  min-width: 60px;
  text-align: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 600;
  color: #333;
  font-size: 16px;
}

.level {
  font-size: 12px;
  color: #666;
}

.score {
  text-align: right;
  min-width: 100px;
}

.score-value {
  font-size: 18px;
  font-weight: 700;
  color: #4CAF50;
}

.score-change {
  font-size: 12px;
  font-weight: 600;
  margin-top: 2px;
}

.score-change.positive {
  color: #4CAF50;
}

.score-change.negative {
  color: #f44336;
}

.friend-comparison {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.friend-comparison h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.friend-comparison-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
}

.friend-comparison-item:last-child {
  border-bottom: none;
}

.friend-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.comparison-stats {
  display: flex;
  gap: 20px;
}

.stat {
  text-align: center;
}

.stat .label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.stat .value {
  display: block;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

@media (max-width: 768px) {
  .leaderboard-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .leaderboard-controls {
    justify-content: center;
  }

  .leaderboard-entry {
    padding: 12px 15px;
  }

  .rank {
    font-size: 20px;
    min-width: 50px;
  }

  .avatar {
    width: 32px;
    height: 32px;
  }

  .username {
    font-size: 14px;
  }

  .score-value {
    font-size: 16px;
  }

  .comparison-stats {
    gap: 15px;
  }
}
```

## Testing Strategy

### 1. Unit Testing
```typescript
describe('LeaderboardService', () => {
  let leaderboardService: LeaderboardService;

  beforeEach(() => {
    leaderboardService = new LeaderboardService();
  });

  it('calculates leaderboard correctly', async () => {
    const leaderboard = await leaderboardService.getLeaderboard('total_points', 'total', 10);
    
    expect(leaderboard).toHaveLength(10);
    expect(leaderboard[0].rank).toBe(1);
    expect(leaderboard[0].score).toBeGreaterThanOrEqual(leaderboard[1].score);
  });

  it('gets user rank correctly', async () => {
    const rank = await leaderboardService.getUserRank('user123', 'total_points', 'total');
    
    expect(rank).toBeGreaterThan(0);
  });

  it('updates leaderboard when user score changes', async () => {
    await leaderboardService.updateLeaderboard('user123', 'total_points', 1000);
    
    const rank = await leaderboardService.getUserRank('user123', 'total_points', 'total');
    expect(rank).toBeGreaterThan(0);
  });
});
```

## Future Enhancements

### 1. Advanced Features
- **Dynamic Leaderboards**: AI-generated leaderboards based on user behavior
- **Team Leaderboards**: Group-based competitions
- **Seasonal Events**: Special leaderboards for holidays and events
- **Personalized Rankings**: Custom leaderboards for individual users

### 2. Performance Optimizations
- **Caching**: Advanced caching strategies for leaderboard data
- **Real-time Updates**: WebSocket-based real-time leaderboard updates
- **Batch Processing**: Efficient batch updates for multiple users
- **Database Optimization**: Optimized queries and indexing

