# Mini-Games & Interactive Elements Specification

## EARS Requirements

**EARS-MNG-001**: The system shall provide educational mini-games related to nutrition and health.

**EARS-MNG-002**: The system shall implement skill-based games with progressive difficulty.

**EARS-MNG-003**: The system shall award XP and coins for mini-game completion and performance.

**EARS-MNG-004**: The system shall provide daily and weekly mini-game challenges.

**EARS-MNG-005**: The system shall track mini-game statistics and leaderboards.

**EARS-MNG-006**: The system shall implement social features for mini-game sharing and competition.

## Mini-Game Types

### Nutrition Quiz Game
```typescript
const NUTRITION_QUIZ_GAME = {
  id: 'nutrition_quiz',
  name: 'Nutrition Quiz',
  description: 'Test your nutrition knowledge with interactive quizzes',
  category: 'educational',
  type: 'quiz',
  difficulty: 'adaptive',
  duration: 300, // seconds
  maxQuestions: 10,
  
  gameModes: {
    DAILY_QUIZ: {
      id: 'daily_quiz',
      name: 'Daily Quiz',
      description: 'Daily nutrition knowledge challenge',
      frequency: 'daily',
      xpReward: 50,
      coinReward: 25,
      maxAttempts: 3
    },
    WEEKLY_CHALLENGE: {
      id: 'weekly_challenge',
      name: 'Weekly Challenge',
      description: 'Weekly advanced nutrition quiz',
      frequency: 'weekly',
      xpReward: 200,
      coinReward: 100,
      maxAttempts: 1
    },
    PRACTICE_MODE: {
      id: 'practice_mode',
      name: 'Practice Mode',
      description: 'Unlimited practice with no rewards',
      frequency: 'unlimited',
      xpReward: 0,
      coinReward: 0,
      maxAttempts: -1
    }
  },
  
  questionTypes: [
    'multiple_choice',
    'true_false',
    'image_identification',
    'nutrient_calculation',
    'food_group_classification'
  ],
  
  topics: [
    'macronutrients',
    'micronutrients',
    'food_groups',
    'nutrition_labels',
    'healthy_eating',
    'dietary_guidelines',
    'food_safety',
    'cooking_methods'
  ],
  
  rewards: {
    perfectScore: { xp: 100, coins: 50, badge: 'quiz_master' },
    highScore: { xp: 75, coins: 37, badge: 'quiz_expert' },
    completion: { xp: 50, coins: 25 },
    streak: { multiplier: 1.1, maxStreak: 7 }
  }
};
```

### Ingredient Matching Game
```typescript
const INGREDIENT_MATCHING_GAME = {
  id: 'ingredient_matching',
  name: 'Ingredient Matching',
  description: 'Match ingredients with their nutritional benefits',
  category: 'memory',
  type: 'matching',
  difficulty: 'progressive',
  duration: 180, // seconds
  
  gameModes: {
    CLASSIC_MATCH: {
      id: 'classic_match',
      name: 'Classic Match',
      description: 'Match ingredients with their benefits',
      xpReward: 40,
      coinReward: 20,
      maxAttempts: 5
    },
    SPEED_MATCH: {
      id: 'speed_match',
      name: 'Speed Match',
      description: 'Match as many as possible in time limit',
      xpReward: 60,
      coinReward: 30,
      maxAttempts: 3
    },
    MEMORY_CHALLENGE: {
      id: 'memory_challenge',
      name: 'Memory Challenge',
      description: 'Remember ingredient combinations',
      xpReward: 80,
      coinReward: 40,
      maxAttempts: 2
    }
  },
  
  matchingTypes: [
    'ingredient_to_benefit',
    'ingredient_to_food_group',
    'ingredient_to_recipe',
    'ingredient_to_season',
    'ingredient_to_color'
  ],
  
  difficultyLevels: [
    { level: 1, pairs: 6, timeLimit: 120 },
    { level: 2, pairs: 8, timeLimit: 100 },
    { level: 3, pairs: 10, timeLimit: 80 },
    { level: 4, pairs: 12, timeLimit: 60 },
    { level: 5, pairs: 15, timeLimit: 45 }
  ],
  
  rewards: {
    perfectMatch: { xp: 100, coins: 50, badge: 'matching_master' },
    highScore: { xp: 75, coins: 37, badge: 'matching_expert' },
    completion: { xp: 40, coins: 20 },
    speedBonus: { multiplier: 1.2 }
  }
};
```

### Cooking Simulator Game
```typescript
const COOKING_SIMULATOR_GAME = {
  id: 'cooking_simulator',
  name: 'Cooking Simulator',
  description: 'Virtual cooking experience with real recipes',
  category: 'simulation',
  type: 'cooking',
  difficulty: 'skill_based',
  duration: 600, // seconds
  
  gameModes: {
    RECIPE_CHALLENGE: {
      id: 'recipe_challenge',
      name: 'Recipe Challenge',
      description: 'Follow a recipe step by step',
      xpReward: 100,
      coinReward: 50,
      maxAttempts: 3
    },
    INGREDIENT_SUBSTITUTION: {
      id: 'ingredient_substitution',
      name: 'Ingredient Substitution',
      description: 'Find healthy substitutes for ingredients',
      xpReward: 80,
      coinReward: 40,
      maxAttempts: 5
    },
    COOKING_TECHNIQUE: {
      id: 'cooking_technique',
      name: 'Cooking Technique',
      description: 'Master different cooking techniques',
      xpReward: 120,
      coinReward: 60,
      maxAttempts: 2
    }
  },
  
  cookingSteps: [
    'ingredient_preparation',
    'cooking_method_selection',
    'temperature_control',
    'timing_management',
    'seasoning_application',
    'plating_presentation'
  ],
  
  skillLevels: [
    { level: 'beginner', recipes: 5, techniques: 3, xpMultiplier: 1.0 },
    { level: 'intermediate', recipes: 10, techniques: 6, xpMultiplier: 1.2 },
    { level: 'advanced', recipes: 20, techniques: 10, xpMultiplier: 1.5 },
    { level: 'expert', recipes: 50, techniques: 15, xpMultiplier: 2.0 }
  ],
  
  rewards: {
    perfectCooking: { xp: 150, coins: 75, badge: 'master_chef' },
    goodCooking: { xp: 100, coins: 50, badge: 'skilled_chef' },
    completion: { xp: 80, coins: 40 },
    techniqueBonus: { multiplier: 1.3 }
  }
};
```

### Macro Calculator Game
```typescript
const MACRO_CALCULATOR_GAME = {
  id: 'macro_calculator',
  name: 'Macro Calculator',
  description: 'Calculate macronutrients for different foods and meals',
  category: 'educational',
  type: 'calculation',
  difficulty: 'progressive',
  duration: 240, // seconds
  
  gameModes: {
    FOOD_CALCULATION: {
      id: 'food_calculation',
      name: 'Food Calculation',
      description: 'Calculate macros for individual foods',
      xpReward: 30,
      coinReward: 15,
      maxAttempts: 10
    },
    MEAL_PLANNING: {
      id: 'meal_planning',
      name: 'Meal Planning',
      description: 'Plan meals to meet macro targets',
      xpReward: 60,
      coinReward: 30,
      maxAttempts: 5
    },
    PORTION_CONTROL: {
      id: 'portion_control',
      name: 'Portion Control',
      description: 'Estimate correct portion sizes',
      xpReward: 40,
      coinReward: 20,
      maxAttempts: 8
    }
  },
  
  calculationTypes: [
    'protein_calculation',
    'carb_calculation',
    'fat_calculation',
    'calorie_calculation',
    'fiber_calculation',
    'sugar_calculation'
  ],
  
  difficultyLevels: [
    { level: 1, foods: 5, accuracy: 0.8, timeLimit: 60 },
    { level: 2, foods: 8, accuracy: 0.85, timeLimit: 45 },
    { level: 3, foods: 12, accuracy: 0.9, timeLimit: 30 },
    { level: 4, foods: 15, accuracy: 0.95, timeLimit: 20 }
  ],
  
  rewards: {
    perfectCalculation: { xp: 80, coins: 40, badge: 'macro_master' },
    accurateCalculation: { xp: 60, coins: 30, badge: 'macro_expert' },
    completion: { xp: 40, coins: 20 },
    speedBonus: { multiplier: 1.25 }
  }
};
```

### Hydration Tracker Game
```typescript
const HYDRATION_TRACKER_GAME = {
  id: 'hydration_tracker',
  name: 'Hydration Tracker',
  description: 'Interactive water intake tracking with gamification',
  category: 'health',
  type: 'tracking',
  difficulty: 'easy',
  duration: 1440, // minutes (all day)
  
  gameModes: {
    DAILY_HYDRATION: {
      id: 'daily_hydration',
      name: 'Daily Hydration',
      description: 'Track daily water intake goals',
      xpReward: 50,
      coinReward: 25,
      maxAttempts: 1
    },
    HYDRATION_STREAK: {
      id: 'hydration_streak',
      name: 'Hydration Streak',
      description: 'Maintain hydration streak',
      xpReward: 100,
      coinReward: 50,
      maxAttempts: 1
    },
    HYDRATION_CHALLENGE: {
      id: 'hydration_challenge',
      name: 'Hydration Challenge',
      description: 'Complete hydration challenges',
      xpReward: 75,
      coinReward: 37,
      maxAttempts: 3
    }
  },
  
  trackingElements: [
    'water_glasses',
    'water_bottles',
    'hydration_reminders',
    'hydration_tips',
    'progress_visualization'
  ],
  
  challenges: [
    { id: 'morning_hydration', name: 'Morning Hydration', target: 2, timeWindow: 'morning' },
    { id: 'afternoon_hydration', name: 'Afternoon Hydration', target: 4, timeWindow: 'afternoon' },
    { id: 'evening_hydration', name: 'Evening Hydration', target: 2, timeWindow: 'evening' }
  ],
  
  rewards: {
    perfectHydration: { xp: 100, coins: 50, badge: 'hydration_hero' },
    goodHydration: { xp: 75, coins: 37, badge: 'hydration_champion' },
    completion: { xp: 50, coins: 25 },
    streakBonus: { multiplier: 1.2 }
  }
};
```

## Mini-Game Data Models

### Mini-Game Interface
```typescript
interface MiniGame {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  difficulty: string;
  duration: number; // seconds
  gameModes: Record<string, GameMode>;
  rewards: GameRewards;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface GameMode {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  coinReward: number;
  maxAttempts: number;
  frequency?: string;
  requirements?: GameRequirements;
}

interface GameRequirements {
  minLevel?: number;
  unlockedBadges?: string[];
  completedGames?: string[];
  timeRestrictions?: TimeRestriction[];
}

interface TimeRestriction {
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  days: string[]; // ['monday', 'tuesday', ...]
}

interface GameRewards {
  perfectScore?: Reward;
  highScore?: Reward;
  completion: Reward;
  streak?: StreakReward;
  speedBonus?: SpeedReward;
  techniqueBonus?: TechniqueReward;
}

interface Reward {
  xp: number;
  coins: number;
  badge?: string;
  item?: string;
}

interface StreakReward {
  multiplier: number;
  maxStreak: number;
}

interface SpeedReward {
  multiplier: number;
  timeThreshold: number;
}

interface TechniqueReward {
  multiplier: number;
  techniqueTypes: string[];
}

interface UserMiniGame {
  game: MiniGame;
  progress: GameProgress;
  statistics: GameStatistics;
  achievements: GameAchievement[];
  isUnlocked: boolean;
  lastPlayed?: Date;
  totalPlayTime: number;
}

interface GameProgress {
  currentLevel: number;
  maxLevel: number;
  currentScore: number;
  bestScore: number;
  gamesPlayed: number;
  gamesCompleted: number;
  completionRate: number;
  averageScore: number;
  streakCount: number;
  maxStreak: number;
}

interface GameStatistics {
  totalGamesPlayed: number;
  totalPlayTime: number;
  averageScore: number;
  bestScore: number;
  perfectScores: number;
  completionRate: number;
  favoriteMode: string;
  improvementRate: number;
  lastPlayed: Date;
}

interface GameAchievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: Date;
  progress: number;
  target: number;
  isCompleted: boolean;
}
```

## Mini-Game Management System

### Mini-Game Service
```typescript
export class MiniGameService {
  static async playMiniGame(
    userId: string,
    gameId: string,
    modeId: string,
    gameData: GameData
  ): Promise<GameResult> {
    const userGame = await this.getUserMiniGame(userId, gameId);
    const game = MINI_GAMES[gameId];
    const mode = game.gameModes[modeId];
    
    if (!userGame) {
      throw new Error('Game not found');
    }
    
    if (!userGame.isUnlocked) {
      throw new Error('Game is locked');
    }
    
    // Check attempt limits
    const attemptsToday = await this.getTodayAttempts(userId, gameId, modeId);
    if (mode.maxAttempts > 0 && attemptsToday >= mode.maxAttempts) {
      throw new Error('Maximum attempts reached for today');
    }
    
    // Validate game data
    const validation = await this.validateGameData(gameId, modeId, gameData);
    if (!validation.valid) {
      throw new Error(validation.reason);
    }
    
    // Calculate score and performance
    const performance = await this.calculatePerformance(gameId, modeId, gameData);
    
    // Update user progress
    await this.updateUserProgress(userId, gameId, performance);
    
    // Calculate rewards
    const rewards = await this.calculateRewards(game, mode, performance);
    
    // Award rewards
    await this.awardRewards(userId, rewards);
    
    // Check for achievements
    const newAchievements = await this.checkAchievements(userId, gameId, performance);
    
    // Save game session
    await this.saveGameSession(userId, gameId, modeId, gameData, performance);
    
    return {
      success: true,
      score: performance.score,
      accuracy: performance.accuracy,
      timeSpent: performance.timeSpent,
      rewards,
      newAchievements,
      isNewBestScore: performance.score > userGame.progress.bestScore,
      isPerfectScore: performance.accuracy >= 1.0
    };
  }
  
  static async unlockMiniGame(
    userId: string,
    gameId: string
  ): Promise<GameUnlockResult> {
    const game = MINI_GAMES[gameId];
    if (!game) {
      throw new Error('Game not found');
    }
    
    // Check unlock requirements
    const requirements = await this.checkUnlockRequirements(userId, gameId);
    if (!requirements.met) {
      throw new Error(requirements.reason);
    }
    
    // Create user game record
    const userGame: UserMiniGame = {
      game,
      progress: {
        currentLevel: 1,
        maxLevel: game.difficultyLevels?.length || 1,
        currentScore: 0,
        bestScore: 0,
        gamesPlayed: 0,
        gamesCompleted: 0,
        completionRate: 0,
        averageScore: 0,
        streakCount: 0,
        maxStreak: 0
      },
      statistics: {
        totalGamesPlayed: 0,
        totalPlayTime: 0,
        averageScore: 0,
        bestScore: 0,
        perfectScores: 0,
        completionRate: 0,
        favoriteMode: '',
        improvementRate: 0,
        lastPlayed: new Date()
      },
      achievements: [],
      isUnlocked: true,
      totalPlayTime: 0
    };
    
    await this.saveUserMiniGame(userId, userGame);
    
    return {
      success: true,
      gameId,
      unlockedAt: new Date(),
      message: `Unlocked ${game.name}!`
    };
  }
  
  static async getMiniGameLeaderboard(
    gameId: string,
    modeId: string,
    timeRange: 'daily' | 'weekly' | 'monthly' | 'all',
    limit: number = 100
  ): Promise<GameLeaderboardEntry[]> {
    const startDate = this.getTimeRangeStart(timeRange);
    const endDate = new Date();
    
    const gameSessions = await this.getGameSessions(gameId, modeId, startDate, endDate);
    
    // Group by user and calculate best scores
    const userScores = gameSessions.reduce((acc, session) => {
      const userId = session.userId;
      if (!acc[userId]) {
        acc[userId] = {
          userId,
          bestScore: 0,
          totalGames: 0,
          averageScore: 0,
          lastPlayed: session.playedAt
        };
      }
      
      acc[userId].bestScore = Math.max(acc[userId].bestScore, session.score);
      acc[userId].totalGames += 1;
      acc[userId].averageScore = (acc[userId].averageScore + session.score) / acc[userId].totalGames;
      acc[userId].lastPlayed = new Date(Math.max(
        acc[userId].lastPlayed.getTime(),
        session.playedAt.getTime()
      ));
      
      return acc;
    }, {} as Record<string, any>);
    
    // Sort by best score
    const sortedScores = Object.values(userScores)
      .sort((a: any, b: any) => b.bestScore - a.bestScore)
      .slice(0, limit);
    
    // Get user profiles
    const leaderboard = await Promise.all(
      sortedScores.map(async (entry: any, index) => {
        const userProfile = await this.getUserProfile(entry.userId);
        return {
          rank: index + 1,
          userId: entry.userId,
          username: userProfile.username,
          avatar: userProfile.avatar,
          bestScore: entry.bestScore,
          totalGames: entry.totalGames,
          averageScore: Math.round(entry.averageScore),
          lastPlayed: entry.lastPlayed
        };
      })
    );
    
    return leaderboard;
  }
  
  private static async calculatePerformance(
    gameId: string,
    modeId: string,
    gameData: GameData
  ): Promise<GamePerformance> {
    switch (gameId) {
      case 'nutrition_quiz':
        return this.calculateQuizPerformance(gameData);
      case 'ingredient_matching':
        return this.calculateMatchingPerformance(gameData);
      case 'cooking_simulator':
        return this.calculateCookingPerformance(gameData);
      case 'macro_calculator':
        return this.calculateCalculationPerformance(gameData);
      case 'hydration_tracker':
        return this.calculateHydrationPerformance(gameData);
      default:
        throw new Error('Unknown game type');
    }
  }
  
  private static async calculateQuizPerformance(gameData: GameData): Promise<GamePerformance> {
    const { answers, timeSpent, totalQuestions } = gameData;
    const correctAnswers = answers.filter((answer: any) => answer.isCorrect).length;
    const accuracy = correctAnswers / totalQuestions;
    const score = Math.round(accuracy * 1000);
    
    return {
      score,
      accuracy,
      timeSpent,
      correctAnswers,
      totalQuestions,
      bonusPoints: timeSpent < 180 ? 50 : 0 // Speed bonus
    };
  }
}
```

## UI Components

### Mini-Game Card
```typescript
interface MiniGameCardProps {
  userGame: UserMiniGame;
  onPlay: (gameId: string, modeId: string) => void;
  onViewLeaderboard: (gameId: string) => void;
  onViewDetails: (gameId: string) => void;
}

const MiniGameCard: React.FC<MiniGameCardProps> = ({
  userGame,
  onPlay,
  onViewLeaderboard,
  onViewDetails
}) => {
  const { game, progress, statistics, isUnlocked } = userGame;
  
  const getCategoryColor = (category: string): string => {
    switch (category) {
      case 'educational': return '#3B82F6';
      case 'memory': return '#8B5CF6';
      case 'simulation': return '#10B981';
      case 'calculation': return '#F59E0B';
      case 'health': return '#EF4444';
      default: return '#6B7280';
    }
  };
  
  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'hard': return '#EF4444';
      case 'expert': return '#8B5CF6';
      default: return '#6B7280';
    }
  };
  
  return (
    <div 
      className={`mini-game-card ${game.category} ${isUnlocked ? 'unlocked' : 'locked'}`}
      style={{
        borderColor: getCategoryColor(game.category),
        boxShadow: `0 0 15px ${getCategoryColor(game.category)}30`
      }}
    >
      <div className="game-header">
        <div className="game-info">
          <h3 className="game-name">{game.name}</h3>
          <p className="game-description">{game.description}</p>
          <div className="game-meta">
            <span className="game-category">{game.category}</span>
            <span className="game-difficulty">{game.difficulty}</span>
            <span className="game-type">{game.type}</span>
          </div>
        </div>
        
        <div className="game-status">
          {isUnlocked ? (
            <span className="status-unlocked">Unlocked</span>
          ) : (
            <span className="status-locked">Locked</span>
          )}
        </div>
      </div>
      
      {isUnlocked && (
        <>
          <div className="game-progress">
            <div className="progress-stats">
              <div className="stat">
                <span className="stat-value">{progress.bestScore}</span>
                <span className="stat-label">Best Score</span>
              </div>
              <div className="stat">
                <span className="stat-value">{progress.gamesPlayed}</span>
                <span className="stat-label">Games Played</span>
              </div>
              <div className="stat">
                <span className="stat-value">{Math.round(progress.completionRate * 100)}%</span>
                <span className="stat-label">Completion</span>
              </div>
            </div>
            
            <div className="level-progress">
              <span>Level {progress.currentLevel} / {progress.maxLevel}</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${(progress.currentLevel / progress.maxLevel) * 100}%`,
                    backgroundColor: getCategoryColor(game.category)
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="game-modes">
            <h4>Available Modes</h4>
            <div className="modes-list">
              {Object.values(game.gameModes).map(mode => (
                <div key={mode.id} className="mode-item">
                  <span className="mode-name">{mode.name}</span>
                  <span className="mode-reward">
                    +{mode.xpReward} XP, +{mode.coinReward} 🪙
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      
      <div className="game-actions">
        {isUnlocked ? (
          <>
            <button 
              className="play-btn"
              onClick={() => onPlay(game.id, Object.keys(game.gameModes)[0])}
            >
              Play Game
            </button>
            <button 
              className="leaderboard-btn"
              onClick={() => onViewLeaderboard(game.id)}
            >
              Leaderboard
            </button>
          </>
        ) : (
          <button 
            className="unlock-btn"
            onClick={() => onViewDetails(game.id)}
          >
            View Requirements
          </button>
        )}
        
        <button 
          className="details-btn"
          onClick={() => onViewDetails(game.id)}
        >
          Details
        </button>
      </div>
    </div>
  );
};
```

### Mini-Game Dashboard
```typescript
interface MiniGameDashboardProps {
  userGames: UserMiniGame[];
  onGameAction: (action: string, gameId: string, modeId?: string) => void;
  filter: {
    category?: string;
    status?: 'all' | 'unlocked' | 'locked';
    difficulty?: string;
  };
}

const MiniGameDashboard: React.FC<MiniGameDashboardProps> = ({
  userGames,
  onGameAction,
  filter
}) => {
  const filteredGames = userGames.filter(userGame => {
    const { game, isUnlocked } = userGame;
    
    if (filter.category && game.category !== filter.category) return false;
    if (filter.status === 'unlocked' && !isUnlocked) return false;
    if (filter.status === 'locked' && isUnlocked) return false;
    if (filter.difficulty && game.difficulty !== filter.difficulty) return false;
    
    return true;
  });
  
  const gamesByCategory = filteredGames.reduce((acc, userGame) => {
    const category = userGame.game.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(userGame);
    return acc;
  }, {} as Record<string, UserMiniGame[]>);
  
  const statistics = calculateGameStatistics(userGames);
  
  return (
    <div className="mini-game-dashboard">
      <div className="dashboard-header">
        <h1>Mini-Games</h1>
        <div className="game-stats">
          <div className="stat">
            <span className="stat-value">{statistics.totalGames}</span>
            <span className="stat-label">Total Games</span>
          </div>
          <div className="stat">
            <span className="stat-value">{statistics.unlockedGames}</span>
            <span className="stat-label">Unlocked</span>
          </div>
          <div className="stat">
            <span className="stat-value">{statistics.totalPlayTime}</span>
            <span className="stat-label">Play Time</span>
          </div>
          <div className="stat">
            <span className="stat-value">{statistics.averageScore}</span>
            <span className="stat-label">Avg Score</span>
          </div>
        </div>
      </div>
      
      <div className="game-filters">
        <select 
          value={filter.category || 'all'}
          onChange={(e) => onFilterChange({ ...filter, category: e.target.value })}
        >
          <option value="all">All Categories</option>
          <option value="educational">Educational</option>
          <option value="memory">Memory</option>
          <option value="simulation">Simulation</option>
          <option value="calculation">Calculation</option>
          <option value="health">Health</option>
        </select>
        
        <select 
          value={filter.status || 'all'}
          onChange={(e) => onFilterChange({ ...filter, status: e.target.value })}
        >
          <option value="all">All Status</option>
          <option value="unlocked">Unlocked</option>
          <option value="locked">Locked</option>
        </select>
        
        <select 
          value={filter.difficulty || 'all'}
          onChange={(e) => onFilterChange({ ...filter, difficulty: e.target.value })}
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
          <option value="expert">Expert</option>
        </select>
      </div>
      
      {Object.entries(gamesByCategory).map(([category, games]) => (
        <div key={category} className="game-category">
          <h2 className="category-title">
            {category.charAt(0).toUpperCase() + category.slice(1)} Games
            <span className="game-count">({games.length})</span>
          </h2>
          <div className="games-grid">
            {games.map(userGame => (
              <MiniGameCard
                key={userGame.game.id}
                userGame={userGame}
                onPlay={(gameId, modeId) => onGameAction('play', gameId, modeId)}
                onViewLeaderboard={(gameId) => onGameAction('leaderboard', gameId)}
                onViewDetails={(gameId) => onGameAction('details', gameId)}
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
interface MiniGameDocument {
  userId: string;
  games: UserMiniGame[];
  statistics: GameStatistics;
  achievements: GameAchievement[];
  lastUpdated: Timestamp;
}

const updateUserMiniGames = async (
  userId: string,
  games: UserMiniGame[]
): Promise<void> => {
  const statistics = calculateGameStatistics(games);
  const achievements = games.flatMap(game => game.achievements);
  
  const gameDoc: MiniGameDocument = {
    userId,
    games,
    statistics,
    achievements,
    lastUpdated: serverTimestamp()
  };
  
  await updateDoc(doc(db, 'userMiniGames', userId), gameDoc);
};
```

### Real-time Updates
```typescript
const subscribeToMiniGames = (
  userId: string,
  onUpdate: (games: UserMiniGame[]) => void
): Unsubscribe => {
  return onSnapshot(
    doc(db, 'userMiniGames', userId),
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as MiniGameDocument;
        onUpdate(data.games);
      }
    }
  );
};
```

## Analytics and Metrics

### Mini-Game Analytics
```typescript
interface MiniGameAnalytics {
  totalGames: number;
  unlockedGames: number;
  totalPlayTime: number;
  averageScore: number;
  completionRate: number;
  categoryBreakdown: Record<string, number>;
  difficultyBreakdown: Record<string, number>;
  userEngagementScore: number;
  improvementRate: number;
}

const calculateMiniGameAnalytics = (
  userGames: UserMiniGame[]
): MiniGameAnalytics => {
  const unlockedGames = userGames.filter(g => g.isUnlocked);
  const totalPlayTime = userGames.reduce((sum, game) => sum + game.totalPlayTime, 0);
  const totalScores = userGames.reduce((sum, game) => sum + game.statistics.averageScore, 0);
  
  return {
    totalGames: userGames.length,
    unlockedGames: unlockedGames.length,
    totalPlayTime,
    averageScore: totalScores / userGames.length,
    completionRate: unlockedGames.filter(g => g.progress.completionRate >= 1.0).length / unlockedGames.length,
    categoryBreakdown: userGames.reduce((acc, game) => {
      acc[game.game.category] = (acc[game.game.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    difficultyBreakdown: userGames.reduce((acc, game) => {
      acc[game.game.difficulty] = (acc[game.game.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    userEngagementScore: calculateEngagementScore(userGames),
    improvementRate: calculateImprovementRate(userGames)
  };
};
```

## Testing Requirements

### Unit Tests
- Game performance calculations
- Score and reward algorithms
- Achievement unlocking logic
- Leaderboard calculations

### Integration Tests
- Firestore game updates
- Real-time synchronization
- Game session management
- UI state management

### Performance Tests
- Large game collections
- Real-time update frequency
- Game rendering performance
- Score calculation efficiency

## Future Enhancements

### Advanced Features
- Multiplayer mini-games
- AI-powered game generation
- Advanced analytics and insights
- Game customization options
- Cross-platform compatibility

### Social Features
- Game sharing and challenges
- Mini-game tournaments
- Social leaderboards
- Game mentoring
- Collaborative games
