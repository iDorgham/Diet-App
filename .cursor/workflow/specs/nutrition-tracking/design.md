# Nutrition Tracking - Design

## Technical Architecture

### Nutrition Analysis Engine
```typescript
interface NutritionAnalysisEngine {
  // Core Analysis Functions
  analyzeFoodItem(foodItem: FoodItem, portionSize: number): Promise<NutritionAnalysis>;
  calculateDailyNutrition(meals: Meal[]): Promise<DailyNutritionSummary>;
  compareToGoals(nutrition: NutritionData, goals: NutritionGoals): Promise<GoalComparison>;
  generateNutritionInsights(nutritionHistory: NutritionData[]): Promise<NutritionInsight[]>;
  
  // Goal Management
  calculatePersonalizedGoals(userProfile: UserProfile): Promise<NutritionGoals>;
  adjustGoalsBasedOnProgress(goals: NutritionGoals, progress: ProgressData): Promise<NutritionGoals>;
  validateGoalAchievability(goals: NutritionGoals, userProfile: UserProfile): Promise<ValidationResult>;
  
  // Food Database Integration
  searchFoodDatabase(query: string, filters: SearchFilters): Promise<FoodItem[]>;
  getFoodByBarcode(barcode: string): Promise<FoodItem>;
  recognizeFoodFromImage(imageData: string): Promise<FoodRecognitionResult>;
}
```

### Data Models
```typescript
interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  category: FoodCategory;
  nutritionalInfo: NutritionalInfo;
  servingSize: ServingSize;
  ingredients: string[];
  allergens: string[];
  certifications: string[];
  verified: boolean;
  source: DataSource;
}

interface NutritionalInfo {
  calories: number;
  macronutrients: {
    protein: number;      // grams
    carbohydrates: number; // grams
    fat: number;          // grams
    fiber: number;        // grams
    sugar: number;        // grams
  };
  micronutrients: {
    vitamins: VitaminContent[];
    minerals: MineralContent[];
    antioxidants: AntioxidantContent[];
  };
  other: {
    sodium: number;       // mg
    cholesterol: number;  // mg
    caffeine: number;     // mg
    alcohol: number;      // grams
  };
}

interface NutritionGoals {
  userId: string;
  dailyCalories: number;
  macronutrientRatios: {
    protein: number;      // percentage
    carbohydrates: number; // percentage
    fat: number;          // percentage
  };
  micronutrientTargets: {
    vitamins: VitaminTarget[];
    minerals: MineralTarget[];
  };
  dietaryRestrictions: DietaryRestriction[];
  healthGoals: HealthGoal[];
  lastUpdated: Date;
}

interface DailyNutritionSummary {
  date: Date;
  totalCalories: number;
  macronutrientBreakdown: MacronutrientBreakdown;
  micronutrientSummary: MicronutrientSummary;
  goalProgress: GoalProgress;
  mealBreakdown: MealBreakdown[];
  insights: NutritionInsight[];
  score: number; // Overall nutrition score (0-100)
}
```

## Food Database Integration

### External API Integration
```typescript
class NutritionDatabaseService {
  private readonly API_ENDPOINTS = {
    USDA: 'https://api.nal.usda.gov/fdc/v1',
    EDAMAM: 'https://api.edamam.com/api/nutrition-data',
    SPOONACULAR: 'https://api.spoonacular.com/food/products'
  };

  async searchFoodDatabase(query: string, filters: SearchFilters): Promise<FoodItem[]> {
    const results: FoodItem[] = [];
    
    // Search multiple databases in parallel
    const [usdaResults, edamamResults, spoonacularResults] = await Promise.all([
      this.searchUSDA(query, filters),
      this.searchEdamam(query, filters),
      this.searchSpoonacular(query, filters)
    ]);
    
    // Merge and deduplicate results
    results.push(...usdaResults, ...edamamResults, ...spoonacularResults);
    return this.deduplicateAndRank(results, query);
  }

  async getFoodByBarcode(barcode: string): Promise<FoodItem> {
    try {
      // Try multiple barcode databases
      const results = await Promise.allSettled([
        this.getFromUSDA(barcode),
        this.getFromEdamam(barcode),
        this.getFromSpoonacular(barcode)
      ]);
      
      // Return the first successful result
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          return result.value;
        }
      }
      
      throw new Error('Food item not found in any database');
    } catch (error) {
      throw new Error(`Failed to retrieve food item: ${error.message}`);
    }
  }

  private async searchUSDA(query: string, filters: SearchFilters): Promise<FoodItem[]> {
    const response = await fetch(`${this.API_ENDPOINTS.USDA}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': process.env.USDA_API_KEY
      },
      body: JSON.stringify({
        query,
        pageSize: filters.limit || 20,
        dataType: filters.dataTypes || ['Foundation', 'SR Legacy']
      })
    });
    
    const data = await response.json();
    return this.mapUSDAResults(data.foods);
  }
}
```

### Image Recognition Service
```typescript
class FoodRecognitionService {
  async recognizeFoodFromImage(imageData: string): Promise<FoodRecognitionResult> {
    try {
      // Use multiple recognition services for better accuracy
      const [googleVision, clarifai, customModel] = await Promise.allSettled([
        this.recognizeWithGoogleVision(imageData),
        this.recognizeWithClarifai(imageData),
        this.recognizeWithCustomModel(imageData)
      ]);
      
      // Combine results and determine best match
      const results = this.combineRecognitionResults([
        googleVision,
        clarifai,
        customModel
      ]);
      
      return {
        success: true,
        foodItems: results.foodItems,
        confidence: results.confidence,
        alternatives: results.alternatives,
        portionEstimate: results.portionEstimate
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        suggestions: await this.getFallbackSuggestions()
      };
    }
  }

  private async recognizeWithGoogleVision(imageData: string): Promise<RecognitionResult> {
    const client = new vision.ImageAnnotatorClient();
    const [result] = await client.labelDetection({
      image: { content: imageData }
    });
    
    const labels = result.labelAnnotations || [];
    const foodLabels = labels.filter(label => 
      this.isFoodRelated(label.description)
    );
    
    return {
      foodItems: foodLabels.map(label => ({
        name: label.description,
        confidence: label.score
      })),
      confidence: Math.max(...foodLabels.map(l => l.score))
    };
  }
}
```

## Goal Management System

### Personalized Goal Calculation
```typescript
class NutritionGoalCalculator {
  async calculatePersonalizedGoals(userProfile: UserProfile): Promise<NutritionGoals> {
    // Calculate BMR (Basal Metabolic Rate)
    const bmr = this.calculateBMR(userProfile);
    
    // Calculate TDEE (Total Daily Energy Expenditure)
    const tdee = this.calculateTDEE(bmr, userProfile.activityLevel);
    
    // Adjust for health goals
    const adjustedCalories = this.adjustForHealthGoals(tdee, userProfile.healthGoals);
    
    // Calculate macronutrient ratios
    const macronutrientRatios = this.calculateMacronutrientRatios(
      userProfile.healthGoals,
      userProfile.dietaryRestrictions
    );
    
    // Set micronutrient targets
    const micronutrientTargets = this.calculateMicronutrientTargets(
      userProfile.age,
      userProfile.gender,
      userProfile.healthGoals
    );
    
    return {
      userId: userProfile.userId,
      dailyCalories: Math.round(adjustedCalories),
      macronutrientRatios,
      micronutrientTargets,
      dietaryRestrictions: userProfile.dietaryRestrictions,
      healthGoals: userProfile.healthGoals,
      lastUpdated: new Date()
    };
  }

  private calculateBMR(userProfile: UserProfile): number {
    // Mifflin-St Jeor Equation
    if (userProfile.gender === 'male') {
      return 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;
    } else {
      return 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age - 161;
    }
  }

  private calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
    const activityMultipliers = {
      SEDENTARY: 1.2,
      LIGHTLY_ACTIVE: 1.375,
      MODERATELY_ACTIVE: 1.55,
      VERY_ACTIVE: 1.725,
      EXTRA_ACTIVE: 1.9
    };
    
    return bmr * activityMultipliers[activityLevel];
  }

  private calculateMacronutrientRatios(
    healthGoals: HealthGoal[],
    dietaryRestrictions: DietaryRestriction[]
  ): MacronutrientRatios {
    let baseRatios = { protein: 25, carbohydrates: 45, fat: 30 };
    
    // Adjust for health goals
    if (healthGoals.includes('WEIGHT_LOSS')) {
      baseRatios.protein = 30;
      baseRatios.carbohydrates = 35;
      baseRatios.fat = 35;
    } else if (healthGoals.includes('MUSCLE_GAIN')) {
      baseRatios.protein = 35;
      baseRatios.carbohydrates = 40;
      baseRatios.fat = 25;
    }
    
    // Adjust for dietary restrictions
    if (dietaryRestrictions.includes('KETO')) {
      baseRatios.carbohydrates = 5;
      baseRatios.fat = 70;
      baseRatios.protein = 25;
    } else if (dietaryRestrictions.includes('LOW_CARB')) {
      baseRatios.carbohydrates = 20;
      baseRatios.fat = 50;
      baseRatios.protein = 30;
    }
    
    return baseRatios;
  }
}
```

## Progress Tracking and Analytics

### Nutrition Analytics Engine
```typescript
class NutritionAnalyticsEngine {
  async generateNutritionInsights(nutritionHistory: NutritionData[]): Promise<NutritionInsight[]> {
    const insights: NutritionInsight[] = [];
    
    // Analyze trends over time
    const trends = await this.analyzeTrends(nutritionHistory);
    insights.push(...trends);
    
    // Identify patterns
    const patterns = await this.identifyPatterns(nutritionHistory);
    insights.push(...patterns);
    
    // Generate recommendations
    const recommendations = await this.generateRecommendations(nutritionHistory);
    insights.push(...recommendations);
    
    // Calculate nutrition score
    const score = await this.calculateNutritionScore(nutritionHistory);
    insights.push({
      type: 'SCORE',
      title: 'Overall Nutrition Score',
      description: `Your current nutrition score is ${score}/100`,
      actionable: true,
      priority: score < 70 ? 'HIGH' : 'MEDIUM',
      recommendations: this.getScoreImprovementRecommendations(score)
    });
    
    return insights;
  }

  private async analyzeTrends(nutritionHistory: NutritionData[]): Promise<NutritionInsight[]> {
    const insights: NutritionInsight[] = [];
    
    // Analyze calorie trends
    const calorieTrend = this.calculateTrend(nutritionHistory.map(d => d.totalCalories));
    if (Math.abs(calorieTrend) > 0.1) {
      insights.push({
        type: 'TREND',
        title: 'Calorie Intake Trend',
        description: `Your calorie intake is ${calorieTrend > 0 ? 'increasing' : 'decreasing'} by ${Math.abs(calorieTrend * 100).toFixed(1)}% per week`,
        actionable: true,
        priority: 'MEDIUM'
      });
    }
    
    // Analyze macronutrient balance
    const proteinTrend = this.calculateTrend(nutritionHistory.map(d => d.macronutrients.protein));
    if (proteinTrend < -0.05) {
      insights.push({
        type: 'TREND',
        title: 'Protein Intake Declining',
        description: 'Your protein intake has been decreasing. Consider adding more protein-rich foods.',
        actionable: true,
        priority: 'HIGH',
        recommendations: ['Add lean meats', 'Include dairy products', 'Try plant-based proteins']
      });
    }
    
    return insights;
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;
    
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;
    
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    return slope;
  }
}
```

## API Endpoints

### Nutrition Tracking
```typescript
// POST /api/nutrition/log-food
interface LogFoodRequest {
  userId: string;
  foodItem: FoodItem;
  portionSize: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: Date;
}

interface LogFoodResponse {
  loggedFood: LoggedFood;
  updatedNutrition: DailyNutritionSummary;
  goalProgress: GoalProgress;
  insights: NutritionInsight[];
}

// GET /api/nutrition/daily-summary/:userId/:date
interface DailySummaryResponse {
  summary: DailyNutritionSummary;
  goalComparison: GoalComparison;
  mealBreakdown: MealBreakdown[];
  insights: NutritionInsight[];
  recommendations: string[];
}

// POST /api/nutrition/scan-barcode
interface BarcodeScanRequest {
  barcode: string;
  userId: string;
}

interface BarcodeScanResponse {
  foodItem: FoodItem;
  portionSuggestions: PortionSuggestion[];
  nutritionalInfo: NutritionalInfo;
  alternatives: FoodItem[];
}

// POST /api/nutrition/recognize-image
interface ImageRecognitionRequest {
  imageData: string;
  userId: string;
}

interface ImageRecognitionResponse {
  recognizedFoods: RecognizedFood[];
  confidence: number;
  portionEstimate: PortionEstimate;
  alternatives: FoodItem[];
}
```

## Database Schema

### Nutrition Tables
```sql
CREATE TABLE food_items (
  id UUID PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  brand VARCHAR(100),
  barcode VARCHAR(50) UNIQUE,
  category VARCHAR(100),
  nutritional_info JSONB NOT NULL,
  serving_size JSONB NOT NULL,
  ingredients TEXT[],
  allergens TEXT[],
  certifications TEXT[],
  verified BOOLEAN DEFAULT FALSE,
  source VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_nutrition_goals (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  daily_calories INTEGER,
  macronutrient_ratios JSONB,
  micronutrient_targets JSONB,
  dietary_restrictions TEXT[],
  health_goals TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE nutrition_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  food_item_id UUID REFERENCES food_items(id),
  portion_size DECIMAL(8,2),
  meal_type VARCHAR(20),
  logged_at TIMESTAMP DEFAULT NOW(),
  nutritional_data JSONB
);

CREATE TABLE daily_nutrition_summaries (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  date DATE,
  total_calories INTEGER,
  macronutrient_breakdown JSONB,
  micronutrient_summary JSONB,
  goal_progress JSONB,
  nutrition_score INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Performance Optimization

### Caching Strategy
```typescript
class NutritionCacheManager {
  private cache = new Map<string, CachedNutritionData>();
  
  async getCachedFoodItem(foodId: string): Promise<FoodItem | null> {
    const cached = this.cache.get(`food_${foodId}`);
    if (cached && !this.isExpired(cached.timestamp)) {
      return cached.data;
    }
    return null;
  }
  
  async cacheFoodItem(foodId: string, foodItem: FoodItem): Promise<void> {
    this.cache.set(`food_${foodId}`, {
      data: foodItem,
      timestamp: Date.now(),
      ttl: 3600000 // 1 hour
    });
  }
  
  async getCachedNutritionSummary(userId: string, date: string): Promise<DailyNutritionSummary | null> {
    const cached = this.cache.get(`summary_${userId}_${date}`);
    if (cached && !this.isExpired(cached.timestamp)) {
      return cached.data;
    }
    return null;
  }
}
```

### Batch Processing
```typescript
class NutritionBatchProcessor {
  private batchQueue: NutritionLog[] = [];
  private batchSize = 50;
  private batchTimeout = 5000; // 5 seconds
  
  async addNutritionLog(log: NutritionLog): Promise<void> {
    this.batchQueue.push(log);
    
    if (this.batchQueue.length >= this.batchSize) {
      await this.processBatch();
    }
  }
  
  private async processBatch(): Promise<void> {
    const batch = this.batchQueue.splice(0, this.batchSize);
    await this.processNutritionLogs(batch);
  }
}
```

## Security Considerations

### Data Validation
```typescript
class NutritionDataValidator {
  validateFoodItem(foodItem: FoodItem): ValidationResult {
    const errors: string[] = [];
    
    if (!foodItem.name || foodItem.name.trim().length === 0) {
      errors.push('Food name is required');
    }
    
    if (!foodItem.nutritionalInfo || !this.isValidNutritionalInfo(foodItem.nutritionalInfo)) {
      errors.push('Valid nutritional information is required');
    }
    
    if (foodItem.calories < 0 || foodItem.calories > 10000) {
      errors.push('Calorie value must be between 0 and 10000');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  validatePortionSize(portionSize: number): ValidationResult {
    if (portionSize <= 0 || portionSize > 10000) {
      return {
        isValid: false,
        errors: ['Portion size must be between 0 and 10000 grams']
      };
    }
    
    return { isValid: true, errors: [] };
  }
}
```

### Privacy Protection
```typescript
class NutritionPrivacyManager {
  async anonymizeNutritionData(userId: string): Promise<void> {
    // Remove personally identifiable information
    await this.removeUserIdentifiers(userId);
    
    // Aggregate data for analytics
    await this.aggregateNutritionData(userId);
    
    // Delete detailed logs older than 2 years
    await this.deleteOldNutritionLogs(userId);
  }
  
  async exportUserNutritionData(userId: string): Promise<NutritionDataExport> {
    const nutritionData = await this.getUserNutritionData(userId);
    
    return {
      userId: this.anonymizeUserId(userId),
      nutritionLogs: nutritionData.logs,
      goals: nutritionData.goals,
      summaries: nutritionData.summaries,
      exportedAt: new Date()
    };
  }
}
```
