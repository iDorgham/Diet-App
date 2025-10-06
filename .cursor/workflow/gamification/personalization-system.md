# Personalization & AI-Driven Features Specification

## EARS Requirements

**EARS-PER-001**: The system shall provide adaptive difficulty adjustment based on user performance.

**EARS-PER-002**: The system shall implement smart recommendations for challenges, recipes, and goals.

**EARS-PER-003**: The system shall track user mood and energy levels to adapt the experience.

**EARS-PER-004**: The system shall provide personalized content based on user preferences and history.

**EARS-PER-005**: The system shall implement AI-powered insights and predictions.

**EARS-PER-006**: The system shall provide dynamic content generation based on user behavior.

## Adaptive Difficulty System

### Difficulty Adjustment Algorithm
```typescript
const ADAPTIVE_DIFFICULTY_CONFIG = {
  NUTRITION_TRACKING: {
    baseDifficulty: 0.5,
    adjustmentFactors: {
      successRate: 0.4,
      completionTime: 0.3,
      userFeedback: 0.2,
      consistency: 0.1
    },
    adjustmentRange: [0.1, 1.0],
    adjustmentSpeed: 0.05,
    stabilityThreshold: 0.1
  },
  
  EXERCISE_LOGGING: {
    baseDifficulty: 0.6,
    adjustmentFactors: {
      successRate: 0.5,
      intensity: 0.3,
      recovery: 0.2
    },
    adjustmentRange: [0.2, 1.0],
    adjustmentSpeed: 0.03,
    stabilityThreshold: 0.15
  },
  
  CHALLENGE_COMPLETION: {
    baseDifficulty: 0.4,
    adjustmentFactors: {
      successRate: 0.6,
      timeToComplete: 0.2,
      userSatisfaction: 0.2
    },
    adjustmentRange: [0.1, 0.9],
    adjustmentSpeed: 0.04,
    stabilityThreshold: 0.12
  }
};

class AdaptiveDifficultyService {
  static async adjustDifficulty(
    userId: string,
    activityType: string,
    performance: PerformanceMetrics
  ): Promise<DifficultyAdjustment> {
    const config = ADAPTIVE_DIFFICULTY_CONFIG[activityType];
    const userProfile = await this.getUserProfile(userId);
    const currentDifficulty = userProfile.difficultySettings[activityType] || config.baseDifficulty;
    
    // Calculate performance score
    const performanceScore = this.calculatePerformanceScore(performance, config);
    
    // Determine adjustment direction
    const adjustmentDirection = this.calculateAdjustmentDirection(performanceScore, currentDifficulty);
    
    // Calculate new difficulty
    const adjustmentAmount = config.adjustmentSpeed * adjustmentDirection;
    const newDifficulty = Math.max(
      config.adjustmentRange[0],
      Math.min(config.adjustmentRange[1], currentDifficulty + adjustmentAmount)
    );
    
    // Check if adjustment is significant enough
    const adjustmentMagnitude = Math.abs(newDifficulty - currentDifficulty);
    if (adjustmentMagnitude < config.stabilityThreshold) {
      return {
        adjusted: false,
        currentDifficulty,
        newDifficulty,
        reason: 'Adjustment too small'
      };
    }
    
    // Update user difficulty
    await this.updateUserDifficulty(userId, activityType, newDifficulty);
    
    return {
      adjusted: true,
      currentDifficulty,
      newDifficulty,
      adjustmentAmount,
      reason: this.getAdjustmentReason(adjustmentDirection, performanceScore)
    };
  }
  
  private static calculatePerformanceScore(
    performance: PerformanceMetrics,
    config: DifficultyConfig
  ): number {
    let score = 0;
    
    // Success rate factor
    if (performance.successRate !== undefined) {
      score += performance.successRate * config.adjustmentFactors.successRate;
    }
    
    // Completion time factor
    if (performance.completionTime !== undefined) {
      const normalizedTime = Math.min(1, performance.completionTime / 3600); // Normalize to 1 hour
      score += (1 - normalizedTime) * config.adjustmentFactors.completionTime;
    }
    
    // User feedback factor
    if (performance.userFeedback !== undefined) {
      score += performance.userFeedback * config.adjustmentFactors.userFeedback;
    }
    
    // Consistency factor
    if (performance.consistency !== undefined) {
      score += performance.consistency * config.adjustmentFactors.consistency;
    }
    
    return Math.max(0, Math.min(1, score));
  }
  
  private static calculateAdjustmentDirection(
    performanceScore: number,
    currentDifficulty: number
  ): number {
    // If performance is too high, increase difficulty
    if (performanceScore > 0.8) {
      return 1;
    }
    
    // If performance is too low, decrease difficulty
    if (performanceScore < 0.4) {
      return -1;
    }
    
    // If performance is in optimal range, maintain current difficulty
    return 0;
  }
}
```

## Smart Recommendation Engine

### Recommendation System
```typescript
const RECOMMENDATION_ENGINE_CONFIG = {
  CHALLENGES: {
    weightFactors: {
      userPreferences: 0.3,
      historicalSuccess: 0.25,
      currentGoals: 0.2,
      difficultyMatch: 0.15,
      novelty: 0.1
    },
    maxRecommendations: 5,
    diversityThreshold: 0.3
  },
  
  RECIPES: {
    weightFactors: {
      dietaryPreferences: 0.4,
      nutritionalNeeds: 0.25,
      cookingSkill: 0.15,
      availableIngredients: 0.1,
      seasonalRelevance: 0.1
    },
    maxRecommendations: 8,
    diversityThreshold: 0.4
  },
  
  GOALS: {
    weightFactors: {
      userMotivation: 0.3,
      currentProgress: 0.25,
      timeAvailability: 0.2,
      skillLevel: 0.15,
      socialSupport: 0.1
    },
    maxRecommendations: 3,
    diversityThreshold: 0.5
  }
};

class SmartRecommendationService {
  static async generateRecommendations(
    userId: string,
    recommendationType: string,
    context: RecommendationContext
  ): Promise<Recommendation[]> {
    const userProfile = await this.getUserProfile(userId);
    const userHistory = await this.getUserHistory(userId);
    const config = RECOMMENDATION_ENGINE_CONFIG[recommendationType];
    
    // Get candidate items
    const candidates = await this.getCandidateItems(recommendationType, context);
    
    // Score each candidate
    const scoredCandidates = await Promise.all(
      candidates.map(async (candidate) => {
        const score = await this.calculateRecommendationScore(
          candidate,
          userProfile,
          userHistory,
          config
        );
        return { candidate, score };
      })
    );
    
    // Sort by score and apply diversity
    const sortedCandidates = scoredCandidates.sort((a, b) => b.score - a.score);
    const diverseRecommendations = this.applyDiversityFilter(
      sortedCandidates,
      config.diversityThreshold
    );
    
    // Return top recommendations
    return diverseRecommendations
      .slice(0, config.maxRecommendations)
      .map(item => ({
        id: item.candidate.id,
        type: recommendationType,
        score: item.score,
        reason: this.generateRecommendationReason(item.candidate, userProfile),
        confidence: this.calculateConfidence(item.score, userHistory),
        metadata: item.candidate.metadata
      }));
  }
  
  private static async calculateRecommendationScore(
    candidate: any,
    userProfile: UserProfile,
    userHistory: UserHistory,
    config: RecommendationConfig
  ): Promise<number> {
    let score = 0;
    
    // User preferences factor
    if (config.weightFactors.userPreferences) {
      const preferenceScore = this.calculatePreferenceScore(candidate, userProfile.preferences);
      score += preferenceScore * config.weightFactors.userPreferences;
    }
    
    // Historical success factor
    if (config.weightFactors.historicalSuccess) {
      const successScore = this.calculateHistoricalSuccess(candidate, userHistory);
      score += successScore * config.weightFactors.historicalSuccess;
    }
    
    // Current goals factor
    if (config.weightFactors.currentGoals) {
      const goalAlignmentScore = this.calculateGoalAlignment(candidate, userProfile.goals);
      score += goalAlignmentScore * config.weightFactors.currentGoals;
    }
    
    // Difficulty match factor
    if (config.weightFactors.difficultyMatch) {
      const difficultyScore = this.calculateDifficultyMatch(candidate, userProfile.skillLevel);
      score += difficultyScore * config.weightFactors.difficultyMatch;
    }
    
    // Novelty factor
    if (config.weightFactors.novelty) {
      const noveltyScore = this.calculateNoveltyScore(candidate, userHistory);
      score += noveltyScore * config.weightFactors.novelty;
    }
    
    return Math.max(0, Math.min(1, score));
  }
  
  private static applyDiversityFilter(
    candidates: ScoredCandidate[],
    diversityThreshold: number
  ): ScoredCandidate[] {
    const diverseCandidates: ScoredCandidate[] = [];
    const usedCategories = new Set<string>();
    
    for (const candidate of candidates) {
      const category = candidate.candidate.category;
      
      if (!usedCategories.has(category) || 
          Math.random() < diversityThreshold) {
        diverseCandidates.push(candidate);
        usedCategories.add(category);
      }
    }
    
    return diverseCandidates;
  }
}
```

## Mood and Energy Tracking

### Mood Tracking System
```typescript
const MOOD_TRACKING_CONFIG = {
  MOOD_LEVELS: {
    EXCELLENT: { value: 5, color: '#10B981', emoji: '😄' },
    GOOD: { value: 4, color: '#3B82F6', emoji: '😊' },
    NEUTRAL: { value: 3, color: '#F59E0B', emoji: '😐' },
    POOR: { value: 2, color: '#EF4444', emoji: '😔' },
    TERRIBLE: { value: 1, color: '#DC2626', emoji: '😢' }
  },
  
  ENERGY_LEVELS: {
    HIGH: { value: 5, color: '#10B981', emoji: '⚡' },
    GOOD: { value: 4, color: '#3B82F6', emoji: '🔋' },
    MODERATE: { value: 3, color: '#F59E0B', emoji: '🔌' },
    LOW: { value: 2, color: '#EF4444', emoji: '🔋' },
    VERY_LOW: { value: 1, color: '#DC2626', emoji: '🪫' }
  },
  
  TRACKING_FREQUENCY: {
    MOOD: 'daily',
    ENERGY: 'multiple_daily',
    STRESS: 'weekly'
  }
};

interface MoodEntry {
  id: string;
  userId: string;
  mood: number;
  energy: number;
  stress: number;
  timestamp: Date;
  notes?: string;
  factors: MoodFactor[];
  location?: string;
  weather?: string;
}

interface MoodFactor {
  type: 'sleep' | 'exercise' | 'nutrition' | 'social' | 'work' | 'weather' | 'other';
  impact: number; // -1 to 1
  description: string;
}

class MoodTrackingService {
  static async recordMoodEntry(
    userId: string,
    moodData: MoodData
  ): Promise<MoodEntry> {
    const moodEntry: MoodEntry = {
      id: generateId(),
      userId,
      mood: moodData.mood,
      energy: moodData.energy,
      stress: moodData.stress,
      timestamp: new Date(),
      notes: moodData.notes,
      factors: moodData.factors,
      location: moodData.location,
      weather: moodData.weather
    };
    
    await this.saveMoodEntry(moodEntry);
    
    // Analyze mood patterns
    await this.analyzeMoodPatterns(userId);
    
    // Generate insights
    const insights = await this.generateMoodInsights(userId, moodEntry);
    
    // Update personalization settings
    await this.updatePersonalizationFromMood(userId, moodEntry, insights);
    
    return moodEntry;
  }
  
  static async analyzeMoodPatterns(userId: string): Promise<MoodAnalysis> {
    const moodHistory = await this.getMoodHistory(userId, 30); // Last 30 days
    
    const analysis: MoodAnalysis = {
      averageMood: this.calculateAverageMood(moodHistory),
      averageEnergy: this.calculateAverageEnergy(moodHistory),
      averageStress: this.calculateAverageStress(moodHistory),
      trends: this.calculateMoodTrends(moodHistory),
      correlations: this.findMoodCorrelations(moodHistory),
      patterns: this.identifyMoodPatterns(moodHistory),
      recommendations: this.generateMoodRecommendations(moodHistory)
    };
    
    return analysis;
  }
  
  private static findMoodCorrelations(moodHistory: MoodEntry[]): MoodCorrelation[] {
    const correlations: MoodCorrelation[] = [];
    
    // Analyze sleep correlation
    const sleepCorrelation = this.calculateCorrelation(
      moodHistory.map(m => m.factors.find(f => f.type === 'sleep')?.impact || 0),
      moodHistory.map(m => m.mood)
    );
    if (Math.abs(sleepCorrelation) > 0.3) {
      correlations.push({
        factor: 'sleep',
        correlation: sleepCorrelation,
        strength: Math.abs(sleepCorrelation),
        description: this.getCorrelationDescription('sleep', sleepCorrelation)
      });
    }
    
    // Analyze exercise correlation
    const exerciseCorrelation = this.calculateCorrelation(
      moodHistory.map(m => m.factors.find(f => f.type === 'exercise')?.impact || 0),
      moodHistory.map(m => m.mood)
    );
    if (Math.abs(exerciseCorrelation) > 0.3) {
      correlations.push({
        factor: 'exercise',
        correlation: exerciseCorrelation,
        strength: Math.abs(exerciseCorrelation),
        description: this.getCorrelationDescription('exercise', exerciseCorrelation)
      });
    }
    
    // Analyze nutrition correlation
    const nutritionCorrelation = this.calculateCorrelation(
      moodHistory.map(m => m.factors.find(f => f.type === 'nutrition')?.impact || 0),
      moodHistory.map(m => m.mood)
    );
    if (Math.abs(nutritionCorrelation) > 0.3) {
      correlations.push({
        factor: 'nutrition',
        correlation: nutritionCorrelation,
        strength: Math.abs(nutritionCorrelation),
        description: this.getCorrelationDescription('nutrition', nutritionCorrelation)
      });
    }
    
    return correlations.sort((a, b) => b.strength - a.strength);
  }
}
```

## AI-Powered Insights

### Insight Generation System
```typescript
const INSIGHT_TYPES = {
  NUTRITION: {
    id: 'nutrition_insights',
    name: 'Nutrition Insights',
    description: 'AI-powered nutrition analysis and recommendations',
    frequency: 'weekly',
    priority: 'high'
  },
  
  BEHAVIOR: {
    id: 'behavior_insights',
    name: 'Behavior Insights',
    description: 'Pattern analysis and behavior recommendations',
    frequency: 'bi-weekly',
    priority: 'medium'
  },
  
  PREDICTION: {
    id: 'prediction_insights',
    name: 'Prediction Insights',
    description: 'Future trend predictions and early warnings',
    frequency: 'monthly',
    priority: 'high'
  },
  
  OPTIMIZATION: {
    id: 'optimization_insights',
    name: 'Optimization Insights',
    description: 'Performance optimization recommendations',
    frequency: 'weekly',
    priority: 'medium'
  }
};

class AIInsightService {
  static async generateInsights(
    userId: string,
    insightType: string
  ): Promise<AIInsight[]> {
    const userProfile = await this.getUserProfile(userId);
    const userHistory = await this.getUserHistory(userId);
    const userData = await this.getUserData(userId);
    
    switch (insightType) {
      case 'nutrition_insights':
        return await this.generateNutritionInsights(userProfile, userHistory, userData);
      case 'behavior_insights':
        return await this.generateBehaviorInsights(userProfile, userHistory, userData);
      case 'prediction_insights':
        return await this.generatePredictionInsights(userProfile, userHistory, userData);
      case 'optimization_insights':
        return await this.generateOptimizationInsights(userProfile, userHistory, userData);
      default:
        throw new Error('Unknown insight type');
    }
  }
  
  private static async generateNutritionInsights(
    userProfile: UserProfile,
    userHistory: UserHistory,
    userData: UserData
  ): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];
    
    // Analyze macro balance
    const macroAnalysis = await this.analyzeMacroBalance(userHistory);
    if (macroAnalysis.imbalance) {
      insights.push({
        id: generateId(),
        type: 'nutrition_insights',
        category: 'macro_balance',
        title: 'Macro Balance Alert',
        description: `Your ${macroAnalysis.imbalancedMacro} intake is ${macroAnalysis.deviation}% from target.`,
        recommendation: macroAnalysis.recommendation,
        confidence: macroAnalysis.confidence,
        priority: macroAnalysis.priority,
        actionable: true,
        metadata: macroAnalysis.metadata
      });
    }
    
    // Analyze micronutrient gaps
    const micronutrientAnalysis = await this.analyzeMicronutrients(userHistory);
    if (micronutrientAnalysis.gaps.length > 0) {
      insights.push({
        id: generateId(),
        type: 'nutrition_insights',
        category: 'micronutrients',
        title: 'Micronutrient Gaps Detected',
        description: `You may be deficient in ${micronutrientAnalysis.gaps.join(', ')}.`,
        recommendation: micronutrientAnalysis.recommendation,
        confidence: micronutrientAnalysis.confidence,
        priority: 'medium',
        actionable: true,
        metadata: micronutrientAnalysis.metadata
      });
    }
    
    // Analyze meal timing
    const mealTimingAnalysis = await this.analyzeMealTiming(userHistory);
    if (mealTimingAnalysis.irregular) {
      insights.push({
        id: generateId(),
        type: 'nutrition_insights',
        category: 'meal_timing',
        title: 'Irregular Meal Timing',
        description: 'Your meal timing shows irregular patterns that may affect metabolism.',
        recommendation: mealTimingAnalysis.recommendation,
        confidence: mealTimingAnalysis.confidence,
        priority: 'low',
        actionable: true,
        metadata: mealTimingAnalysis.metadata
      });
    }
    
    return insights;
  }
  
  private static async generatePredictionInsights(
    userProfile: UserProfile,
    userHistory: UserHistory,
    userData: UserData
  ): Promise<AIInsight[]> {
    const insights: AIInsight[] = [];
    
    // Predict weight trend
    const weightPrediction = await this.predictWeightTrend(userHistory);
    if (weightPrediction.significant) {
      insights.push({
        id: generateId(),
        type: 'prediction_insights',
        category: 'weight_trend',
        title: 'Weight Trend Prediction',
        description: `Based on current patterns, you're predicted to ${weightPrediction.direction} ${weightPrediction.amount} lbs in the next month.`,
        recommendation: weightPrediction.recommendation,
        confidence: weightPrediction.confidence,
        priority: weightPrediction.priority,
        actionable: true,
        metadata: weightPrediction.metadata
      });
    }
    
    // Predict goal achievement
    const goalPrediction = await this.predictGoalAchievement(userProfile, userHistory);
    if (goalPrediction.atRisk) {
      insights.push({
        id: generateId(),
        type: 'prediction_insights',
        category: 'goal_achievement',
        title: 'Goal Achievement Risk',
        description: `Your current progress suggests you may not reach your goal by the target date.`,
        recommendation: goalPrediction.recommendation,
        confidence: goalPrediction.confidence,
        priority: 'high',
        actionable: true,
        metadata: goalPrediction.metadata
      });
    }
    
    return insights;
  }
}
```

## Dynamic Content Generation

### Content Generation System
```typescript
const CONTENT_GENERATION_CONFIG = {
  CHALLENGES: {
    templates: [
      'nutrition_challenge',
      'fitness_challenge',
      'wellness_challenge',
      'social_challenge'
    ],
    personalizationFactors: [
      'user_skill_level',
      'current_goals',
      'preferred_activities',
      'available_time',
      'mood_state'
    ]
  },
  
  RECIPES: {
    templates: [
      'quick_meal',
      'meal_prep',
      'healthy_snack',
      'dessert',
      'beverage'
    ],
    personalizationFactors: [
      'dietary_restrictions',
      'cooking_skill',
      'available_ingredients',
      'nutritional_needs',
      'taste_preferences'
    ]
  },
  
  TIPS: {
    templates: [
      'nutrition_tip',
      'fitness_tip',
      'wellness_tip',
      'motivation_tip',
      'lifestyle_tip'
    ],
    personalizationFactors: [
      'current_challenges',
      'user_goals',
      'mood_state',
      'time_of_day',
      'seasonal_relevance'
    ]
  }
};

class DynamicContentService {
  static async generatePersonalizedContent(
    userId: string,
    contentType: string,
    context: ContentContext
  ): Promise<GeneratedContent[]> {
    const userProfile = await this.getUserProfile(userId);
    const userHistory = await this.getUserHistory(userId);
    const config = CONTENT_GENERATION_CONFIG[contentType];
    
    const generatedContent: GeneratedContent[] = [];
    
    for (const template of config.templates) {
      const content = await this.generateContentFromTemplate(
        template,
        userProfile,
        userHistory,
        context
      );
      
      if (content) {
        generatedContent.push(content);
      }
    }
    
    // Rank and filter content
    const rankedContent = this.rankContent(generatedContent, userProfile);
    const filteredContent = this.filterContent(rankedContent, context);
    
    return filteredContent.slice(0, context.maxItems || 5);
  }
  
  private static async generateContentFromTemplate(
    template: string,
    userProfile: UserProfile,
    userHistory: UserHistory,
    context: ContentContext
  ): Promise<GeneratedContent | null> {
    switch (template) {
      case 'nutrition_challenge':
        return await this.generateNutritionChallenge(userProfile, userHistory, context);
      case 'fitness_challenge':
        return await this.generateFitnessChallenge(userProfile, userHistory, context);
      case 'quick_meal':
        return await this.generateQuickMeal(userProfile, userHistory, context);
      case 'nutrition_tip':
        return await this.generateNutritionTip(userProfile, userHistory, context);
      default:
        return null;
    }
  }
  
  private static async generateNutritionChallenge(
    userProfile: UserProfile,
    userHistory: UserHistory,
    context: ContentContext
  ): Promise<GeneratedContent | null> {
    // Analyze user's nutrition patterns
    const nutritionAnalysis = await this.analyzeNutritionPatterns(userHistory);
    
    // Identify improvement areas
    const improvementAreas = this.identifyImprovementAreas(nutritionAnalysis);
    
    if (improvementAreas.length === 0) {
      return null;
    }
    
    // Generate challenge based on improvement area
    const improvementArea = improvementAreas[0];
    const challenge = await this.createNutritionChallenge(improvementArea, userProfile);
    
    return {
      id: generateId(),
      type: 'challenge',
      category: 'nutrition',
      title: challenge.title,
      description: challenge.description,
      content: challenge.content,
      difficulty: challenge.difficulty,
      estimatedTime: challenge.estimatedTime,
      personalizationScore: challenge.personalizationScore,
      metadata: {
        improvementArea,
        userSkillLevel: userProfile.skillLevel,
        challengeType: 'nutrition'
      }
    };
  }
}
```

## UI Components

### Personalization Dashboard
```typescript
interface PersonalizationDashboardProps {
  userProfile: UserProfile;
  moodData: MoodEntry[];
  insights: AIInsight[];
  recommendations: Recommendation[];
  onUpdateMood: (moodData: MoodData) => void;
  onViewInsight: (insight: AIInsight) => void;
  onAcceptRecommendation: (recommendation: Recommendation) => void;
}

const PersonalizationDashboard: React.FC<PersonalizationDashboardProps> = ({
  userProfile,
  moodData,
  insights,
  recommendations,
  onUpdateMood,
  onViewInsight,
  onAcceptRecommendation
}) => {
  const currentMood = moodData[0];
  const recentInsights = insights.slice(0, 3);
  const topRecommendations = recommendations.slice(0, 5);
  
  return (
    <div className="personalization-dashboard">
      <div className="dashboard-header">
        <h1>Personalized Experience</h1>
        <div className="personalization-stats">
          <div className="stat">
            <span className="stat-value">{userProfile.adaptationLevel}</span>
            <span className="stat-label">Adaptation Level</span>
          </div>
          <div className="stat">
            <span className="stat-value">{insights.length}</span>
            <span className="stat-label">AI Insights</span>
          </div>
          <div className="stat">
            <span className="stat-value">{recommendations.length}</span>
            <span className="stat-label">Recommendations</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        <div className="left-column">
          <MoodTracker 
            currentMood={currentMood}
            onUpdateMood={onUpdateMood}
          />
          
          <AIInsights 
            insights={recentInsights}
            onViewInsight={onViewInsight}
          />
        </div>
        
        <div className="right-column">
          <SmartRecommendations 
            recommendations={topRecommendations}
            onAcceptRecommendation={onAcceptRecommendation}
          />
          
          <AdaptiveSettings 
            userProfile={userProfile}
          />
        </div>
      </div>
    </div>
  );
};
```

### Mood Tracker Component
```typescript
interface MoodTrackerProps {
  currentMood: MoodEntry;
  onUpdateMood: (moodData: MoodData) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({
  currentMood,
  onUpdateMood
}) => {
  const [mood, setMood] = useState(currentMood?.mood || 3);
  const [energy, setEnergy] = useState(currentMood?.energy || 3);
  const [stress, setStress] = useState(currentMood?.stress || 3);
  const [notes, setNotes] = useState('');
  
  const handleSubmit = () => {
    onUpdateMood({
      mood,
      energy,
      stress,
      notes,
      factors: [],
      timestamp: new Date()
    });
  };
  
  return (
    <div className="mood-tracker">
      <h2>How are you feeling?</h2>
      
      <div className="mood-selector">
        <label>Mood</label>
        <div className="mood-options">
          {Object.entries(MOOD_TRACKING_CONFIG.MOOD_LEVELS).map(([key, config]) => (
            <button
              key={key}
              className={`mood-option ${mood === config.value ? 'selected' : ''}`}
              onClick={() => setMood(config.value)}
            >
              <span className="emoji">{config.emoji}</span>
              <span className="label">{key}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="energy-selector">
        <label>Energy Level</label>
        <div className="energy-options">
          {Object.entries(MOOD_TRACKING_CONFIG.ENERGY_LEVELS).map(([key, config]) => (
            <button
              key={key}
              className={`energy-option ${energy === config.value ? 'selected' : ''}`}
              onClick={() => setEnergy(config.value)}
            >
              <span className="emoji">{config.emoji}</span>
              <span className="label">{key}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="stress-selector">
        <label>Stress Level</label>
        <input
          type="range"
          min="1"
          max="5"
          value={stress}
          onChange={(e) => setStress(Number(e.target.value))}
          className="stress-slider"
        />
        <div className="stress-labels">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>
      
      <div className="notes-section">
        <label>Notes (optional)</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What's affecting your mood today?"
          className="notes-input"
        />
      </div>
      
      <button 
        className="submit-mood-btn"
        onClick={handleSubmit}
      >
        Update Mood
      </button>
    </div>
  );
};
```

## Integration Points

### Firestore Integration
```typescript
interface PersonalizationDocument {
  userId: string;
  userProfile: UserProfile;
  moodHistory: MoodEntry[];
  insights: AIInsight[];
  recommendations: Recommendation[];
  adaptiveSettings: AdaptiveSettings;
  lastUpdated: Timestamp;
}

const updatePersonalizationData = async (
  userId: string,
  personalizationData: Partial<PersonalizationDocument>
): Promise<void> => {
  await updateDoc(doc(db, 'userPersonalization', userId), {
    ...personalizationData,
    lastUpdated: serverTimestamp()
  });
};
```

### Real-time Updates
```typescript
const subscribeToPersonalization = (
  userId: string,
  onUpdate: (data: PersonalizationDocument) => void
): Unsubscribe => {
  return onSnapshot(
    doc(db, 'userPersonalization', userId),
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as PersonalizationDocument;
        onUpdate(data);
      }
    }
  );
};
```

## Analytics and Metrics

### Personalization Analytics
```typescript
interface PersonalizationAnalytics {
  adaptationLevel: number;
  recommendationAcceptanceRate: number;
  insightEngagementRate: number;
  moodTrackingConsistency: number;
  personalizationEffectiveness: number;
  userSatisfactionScore: number;
  contentRelevanceScore: number;
  engagementImprovement: number;
}

const calculatePersonalizationAnalytics = (
  userProfile: UserProfile,
  moodHistory: MoodEntry[],
  insights: AIInsight[],
  recommendations: Recommendation[]
): PersonalizationAnalytics => {
  return {
    adaptationLevel: userProfile.adaptationLevel,
    recommendationAcceptanceRate: recommendations.filter(r => r.accepted).length / recommendations.length,
    insightEngagementRate: insights.filter(i => i.viewed).length / insights.length,
    moodTrackingConsistency: calculateMoodTrackingConsistency(moodHistory),
    personalizationEffectiveness: calculatePersonalizationEffectiveness(userProfile),
    userSatisfactionScore: calculateUserSatisfactionScore(userProfile),
    contentRelevanceScore: calculateContentRelevanceScore(recommendations),
    engagementImprovement: calculateEngagementImprovement(userProfile)
  };
};
```

## Testing Requirements

### Unit Tests
- Difficulty adjustment algorithms
- Recommendation scoring systems
- Mood analysis calculations
- Insight generation logic

### Integration Tests
- Firestore personalization updates
- Real-time synchronization
- AI service integration
- UI state management

### Performance Tests
- Large data processing
- Real-time update frequency
- AI model performance
- Recommendation generation speed

## Future Enhancements

### Advanced Features
- Machine learning model training
- Advanced behavioral analysis
- Predictive analytics
- Automated content generation
- Cross-platform personalization

### AI Features
- Natural language processing
- Computer vision integration
- Advanced pattern recognition
- Automated insight generation
- Personalized coaching AI
