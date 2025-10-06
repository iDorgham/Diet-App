# Skill Trees & Specialization System Specification

## EARS Requirements

**EARS-SKT-001**: The system shall provide specialized skill trees for different user interests and goals.

**EARS-SKT-002**: The system shall allow users to unlock skill branches and perks through XP investment.

**EARS-SKT-003**: The system shall provide unique bonuses and abilities based on skill tree progression.

**EARS-SKT-004**: The system shall track skill mastery levels and provide visual progression indicators.

**EARS-SKT-005**: The system shall allow skill tree respec with appropriate costs and cooldowns.

**EARS-SKT-006**: The system shall provide skill tree recommendations based on user behavior.

## Skill Tree Categories

### Nutrition Master Tree

```typescript
const NUTRITION_MASTER_TREE = {
  id: 'nutrition_master',
  name: 'Nutrition Master',
  description: 'Master the art of healthy eating and nutrition tracking',
  icon: '🥗',
  color: '#10B981',
  branches: {
    MACRO_TRACKING: {
      id: 'macro_tracking',
      name: 'Macro Tracking',
      description: 'Advanced macro nutrient tracking and analysis',
      levels: [
        {
          level: 1,
          name: 'Macro Basics',
          description: 'Track protein, carbs, and fats',
          xpCost: 100,
          perks: ['basic_macro_display', 'macro_goals']
        },
        {
          level: 2,
          name: 'Macro Analysis',
          description: 'Detailed macro breakdown and trends',
          xpCost: 250,
          perks: ['macro_trends', 'macro_balance_insights']
        },
        {
          level: 3,
          name: 'Macro Optimization',
          description: 'AI-powered macro recommendations',
          xpCost: 500,
          perks: ['ai_macro_suggestions', 'macro_optimization']
        }
      ]
    },
    MEAL_PLANNING: {
      id: 'meal_planning',
      name: 'Meal Planning',
      description: 'Advanced meal planning and preparation skills',
      levels: [
        {
          level: 1,
          name: 'Basic Planning',
          description: 'Create simple meal plans',
          xpCost: 150,
          perks: ['meal_plan_creator', 'basic_recipes']
        },
        {
          level: 2,
          name: 'Advanced Planning',
          description: 'Multi-day meal planning with shopping lists',
          xpCost: 300,
          perks: ['weekly_meal_plans', 'shopping_list_generator']
        },
        {
          level: 3,
          name: 'Meal Prep Master',
          description: 'Bulk meal preparation and storage optimization',
          xpCost: 600,
          perks: ['meal_prep_optimizer', 'storage_tips']
        }
      ]
    },
    NUTRITION_ANALYSIS: {
      id: 'nutrition_analysis',
      name: 'Nutrition Analysis',
      description: 'Deep nutrition insights and health tracking',
      levels: [
        {
          level: 1,
          name: 'Nutrition Basics',
          description: 'Basic nutrition information and tips',
          xpCost: 200,
          perks: ['nutrition_tips', 'vitamin_tracking']
        },
        {
          level: 2,
          name: 'Health Insights',
          description: 'Health correlation analysis',
          xpCost: 400,
          perks: ['health_correlations', 'deficiency_alerts']
        },
        {
          level: 3,
          name: 'Nutrition Expert',
          description: 'Advanced nutrition science and recommendations',
          xpCost: 800,
          perks: ['advanced_insights', 'personalized_recommendations']
        }
      ]
    }
  }
};
```

### Fitness Warrior Tree

```typescript
const FITNESS_WARRIOR_TREE = {
  id: 'fitness_warrior',
  name: 'Fitness Warrior',
  description: 'Master physical fitness and exercise tracking',
  icon: '💪',
  color: '#EF4444',
  branches: {
    CARDIO: {
      id: 'cardio',
      name: 'Cardio Master',
      description: 'Cardiovascular fitness and endurance training',
      levels: [
        {
          level: 1,
          name: 'Cardio Basics',
          description: 'Basic cardio tracking and recommendations',
          xpCost: 120,
          perks: ['cardio_tracking', 'basic_workouts']
        },
        {
          level: 2,
          name: 'Endurance Training',
          description: 'Advanced endurance and stamina building',
          xpCost: 300,
          perks: ['endurance_programs', 'heart_rate_analysis']
        },
        {
          level: 3,
          name: 'Cardio Expert',
          description: 'Professional-level cardio optimization',
          xpCost: 600,
          perks: ['advanced_cardio_plans', 'performance_metrics']
        }
      ]
    },
    STRENGTH: {
      id: 'strength',
      name: 'Strength Training',
      description: 'Muscle building and strength development',
      levels: [
        {
          level: 1,
          name: 'Strength Basics',
          description: 'Basic strength training fundamentals',
          xpCost: 150,
          perks: ['strength_tracking', 'basic_exercises']
        },
        {
          level: 2,
          name: 'Progressive Overload',
          description: 'Advanced strength progression techniques',
          xpCost: 350,
          perks: ['progression_tracking', 'form_analysis']
        },
        {
          level: 3,
          name: 'Strength Master',
          description: 'Elite strength training and optimization',
          xpCost: 700,
          perks: ['advanced_programs', 'recovery_optimization']
        }
      ]
    },
    FLEXIBILITY: {
      id: 'flexibility',
      name: 'Flexibility & Mobility',
      description: 'Flexibility, mobility, and injury prevention',
      levels: [
        {
          level: 1,
          name: 'Flexibility Basics',
          description: 'Basic stretching and mobility routines',
          xpCost: 100,
          perks: ['stretching_routines', 'mobility_tracking']
        },
        {
          level: 2,
          name: 'Advanced Mobility',
          description: 'Advanced mobility and injury prevention',
          xpCost: 250,
          perks: ['injury_prevention', 'mobility_assessments']
        },
        {
          level: 3,
          name: 'Mobility Expert',
          description: 'Professional mobility and recovery techniques',
          xpCost: 500,
          perks: ['recovery_protocols', 'performance_optimization']
        }
      ]
    }
  }
};
```

### Cooking Chef Tree

```typescript
const COOKING_CHEF_TREE = {
  id: 'cooking_chef',
  name: 'Cooking Chef',
  description: 'Master culinary skills and cooking techniques',
  icon: '👨‍🍳',
  color: '#F59E0B',
  branches: {
    MEAL_PREP: {
      id: 'meal_prep',
      name: 'Meal Prep Master',
      description: 'Efficient meal preparation and batch cooking',
      levels: [
        {
          level: 1,
          name: 'Basic Prep',
          description: 'Simple meal preparation techniques',
          xpCost: 100,
          perks: ['prep_timers', 'basic_techniques']
        },
        {
          level: 2,
          name: 'Batch Cooking',
          description: 'Advanced batch cooking and storage',
          xpCost: 250,
          perks: ['batch_optimization', 'storage_solutions']
        },
        {
          level: 3,
          name: 'Prep Efficiency',
          description: 'Maximum efficiency meal preparation',
          xpCost: 500,
          perks: ['time_optimization', 'advanced_prep_methods']
        }
      ]
    },
    TECHNIQUE_MASTERY: {
      id: 'technique_mastery',
      name: 'Technique Mastery',
      description: 'Advanced cooking techniques and methods',
      levels: [
        {
          level: 1,
          name: 'Basic Techniques',
          description: 'Fundamental cooking techniques',
          xpCost: 150,
          perks: ['technique_videos', 'basic_methods']
        },
        {
          level: 2,
          name: 'Advanced Methods',
          description: 'Professional cooking techniques',
          xpCost: 350,
          perks: ['advanced_techniques', 'cooking_tips']
        },
        {
          level: 3,
          name: 'Culinary Master',
          description: 'Master-level cooking skills',
          xpCost: 700,
          perks: ['master_techniques', 'culinary_insights']
        }
      ]
    },
    INGREDIENT_KNOWLEDGE: {
      id: 'ingredient_knowledge',
      name: 'Ingredient Knowledge',
      description: 'Deep knowledge of ingredients and substitutions',
      levels: [
        {
          level: 1,
          name: 'Ingredient Basics',
          description: 'Basic ingredient knowledge and selection',
          xpCost: 120,
          perks: ['ingredient_guide', 'selection_tips']
        },
        {
          level: 2,
          name: 'Smart Substitutions',
          description: 'Ingredient substitutions and alternatives',
          xpCost: 300,
          perks: ['substitution_guide', 'dietary_alternatives']
        },
        {
          level: 3,
          name: 'Ingredient Expert',
          description: 'Professional ingredient knowledge',
          xpCost: 600,
          perks: ['expert_insights', 'seasonal_guide']
        }
      ]
    }
  }
};
```

## Skill Tree Data Models

### Skill Tree Interface

```typescript
interface SkillTree {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  branches: Record<string, SkillBranch>;
  maxLevel: number;
  totalXPRequired: number;
}

interface SkillBranch {
  id: string;
  name: string;
  description: string;
  levels: SkillLevel[];
  prerequisites?: string[];
  isUnlocked: boolean;
}

interface SkillLevel {
  level: number;
  name: string;
  description: string;
  xpCost: number;
  perks: string[];
  isUnlocked: boolean;
  isActive: boolean;
}

interface UserSkillTree {
  userId: string;
  activeTree: string;
  trees: Record<string, UserTreeProgress>;
  totalXPInvested: number;
  availableXP: number;
  lastRespecDate?: Date;
}

interface UserTreeProgress {
  treeId: string;
  branches: Record<string, UserBranchProgress>;
  totalLevel: number;
  xpInvested: number;
  isActive: boolean;
}

interface UserBranchProgress {
  branchId: string;
  currentLevel: number;
  xpInvested: number;
  unlockedPerks: string[];
  isMaxed: boolean;
}
```

## Skill Tree Management System

### Skill Tree Service

```typescript
export class SkillTreeService {
  static async unlockSkillLevel(
    userId: string,
    treeId: string,
    branchId: string,
    level: number
  ): Promise<SkillUnlockResult> {
    const userSkillTree = await this.getUserSkillTree(userId);
    const tree = SKILL_TREES[treeId];
    const branch = tree.branches[branchId];
    const skillLevel = branch.levels[level - 1];
    
    // Validate prerequisites
    const validation = await this.validateSkillUnlock(userSkillTree, treeId, branchId, level);
    if (!validation.valid) {
      throw new Error(validation.reason);
    }
    
    // Check XP availability
    if (userSkillTree.availableXP < skillLevel.xpCost) {
      throw new Error('Insufficient XP');
    }
    
    // Unlock skill level
    await this.updateUserSkillProgress(userId, treeId, branchId, level);
    
    // Apply perks
    await this.applySkillPerks(userId, skillLevel.perks);
    
    // Update available XP
    userSkillTree.availableXP -= skillLevel.xpCost;
    userSkillTree.totalXPInvested += skillLevel.xpCost;
    
    await this.saveUserSkillTree(userId, userSkillTree);
    
    return {
      success: true,
      unlockedPerks: skillLevel.perks,
      xpSpent: skillLevel.xpCost,
      newLevel: level
    };
  }
  
  static async respecSkillTree(
    userId: string,
    treeId: string,
    cost: number
  ): Promise<void> {
    const userSkillTree = await this.getUserSkillTree(userId);
    
    // Check cooldown
    const cooldownDays = 30;
    if (userSkillTree.lastRespecDate) {
      const daysSinceRespec = (Date.now() - userSkillTree.lastRespecDate.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceRespec < cooldownDays) {
        throw new Error(`Respec cooldown active. ${Math.ceil(cooldownDays - daysSinceRespec)} days remaining.`);
      }
    }
    
    // Check cost
    if (userSkillTree.availableXP < cost) {
      throw new Error('Insufficient XP for respec');
    }
    
    // Reset tree progress
    const treeProgress = userSkillTree.trees[treeId];
    const refundedXP = treeProgress.xpInvested;
    
    // Remove all perks
    await this.removeAllTreePerks(userId, treeId);
    
    // Reset tree
    userSkillTree.trees[treeId] = this.createEmptyTreeProgress(treeId);
    userSkillTree.availableXP += refundedXP - cost;
    userSkillTree.lastRespecDate = new Date();
    
    await this.saveUserSkillTree(userId, userSkillTree);
  }
  
  static async getRecommendedTree(
    userId: string
  ): Promise<string> {
    const userProfile = await UserService.getUserProfile(userId);
    const userHistory = await UserService.getUserHistory(userId);
    
    // Analyze user behavior
    const nutritionActivity = userHistory.getNutritionActivity(30);
    const fitnessActivity = userHistory.getFitnessActivity(30);
    const cookingActivity = userHistory.getCookingActivity(30);
    
    // Calculate scores
    const nutritionScore = nutritionActivity.mealsLogged * 0.4 + nutritionActivity.macroAccuracy * 0.6;
    const fitnessScore = fitnessActivity.workoutsCompleted * 0.5 + fitnessActivity.consistency * 0.5;
    const cookingScore = cookingActivity.recipesTried * 0.4 + cookingActivity.mealPrepFrequency * 0.6;
    
    // Return highest scoring tree
    if (nutritionScore >= fitnessScore && nutritionScore >= cookingScore) {
      return 'nutrition_master';
    } else if (fitnessScore >= cookingScore) {
      return 'fitness_warrior';
    } else {
      return 'cooking_chef';
    }
  }
}
```

## UI Components

### Skill Tree Display

```typescript
interface SkillTreeDisplayProps {
  userSkillTree: UserSkillTree;
  selectedTree: string;
  onTreeSelect: (treeId: string) => void;
  onSkillUnlock: (treeId: string, branchId: string, level: number) => void;
  onRespec: (treeId: string) => void;
}

const SkillTreeDisplay: React.FC<SkillTreeDisplayProps> = ({
  userSkillTree,
  selectedTree,
  onTreeSelect,
  onSkillUnlock,
  onRespec
}) => {
  const tree = SKILL_TREES[selectedTree];
  const treeProgress = userSkillTree.trees[selectedTree];
  
  return (
    <div className="skill-tree-display">
      <div className="tree-header">
        <div className="tree-selector">
          {Object.values(SKILL_TREES).map(tree => (
            <button
              key={tree.id}
              className={`tree-tab ${selectedTree === tree.id ? 'active' : ''}`}
              onClick={() => onTreeSelect(tree.id)}
            >
              <span className="tree-icon">{tree.icon}</span>
              <span className="tree-name">{tree.name}</span>
            </button>
          ))}
        </div>
        
        <div className="tree-info">
          <h2>{tree.name}</h2>
          <p>{tree.description}</p>
          <div className="tree-stats">
            <span>Total Level: {treeProgress.totalLevel}</span>
            <span>XP Invested: {treeProgress.xpInvested}</span>
            <span>Available XP: {userSkillTree.availableXP}</span>
          </div>
        </div>
      </div>
      
      <div className="tree-branches">
        {Object.values(tree.branches).map(branch => (
          <SkillBranchDisplay
            key={branch.id}
            branch={branch}
            progress={treeProgress.branches[branch.id]}
            availableXP={userSkillTree.availableXP}
            onSkillUnlock={(level) => onSkillUnlock(selectedTree, branch.id, level)}
          />
        ))}
      </div>
      
      <div className="tree-actions">
        <button
          className="respec-button"
          onClick={() => onRespec(selectedTree)}
          disabled={treeProgress.xpInvested === 0}
        >
          Respec Tree (Cost: 100 XP)
        </button>
      </div>
    </div>
  );
};
```

### Skill Branch Display

```typescript
interface SkillBranchDisplayProps {
  branch: SkillBranch;
  progress: UserBranchProgress;
  availableXP: number;
  onSkillUnlock: (level: number) => void;
}

const SkillBranchDisplay: React.FC<SkillBranchDisplayProps> = ({
  branch,
  progress,
  availableXP,
  onSkillUnlock
}) => {
  return (
    <div className="skill-branch">
      <div className="branch-header">
        <h3>{branch.name}</h3>
        <p>{branch.description}</p>
        <div className="branch-progress">
          <span>Level {progress.currentLevel} / {branch.levels.length}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(progress.currentLevel / branch.levels.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="skill-levels">
        {branch.levels.map((level, index) => (
          <SkillLevelCard
            key={level.level}
            level={level}
            isUnlocked={index < progress.currentLevel}
            isAvailable={index === progress.currentLevel && availableXP >= level.xpCost}
            onUnlock={() => onSkillUnlock(level.level)}
          />
        ))}
      </div>
    </div>
  );
};
```

## Integration Points

### Firestore Integration

```typescript
interface SkillTreeDocument {
  userId: string;
  skillTree: UserSkillTree;
  lastUpdated: Timestamp;
}

const updateUserSkillTree = async (
  userId: string,
  skillTree: UserSkillTree
): Promise<void> => {
  const skillTreeDoc: SkillTreeDocument = {
    userId,
    skillTree,
    lastUpdated: serverTimestamp()
  };
  
  await updateDoc(doc(db, 'userSkillTrees', userId), skillTreeDoc);
};
```

### Real-time Updates

```typescript
const subscribeToSkillTree = (
  userId: string,
  onUpdate: (skillTree: UserSkillTree) => void
): Unsubscribe => {
  return onSnapshot(
    doc(db, 'userSkillTrees', userId),
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as SkillTreeDocument;
        onUpdate(data.skillTree);
      }
    }
  );
};
```

## Analytics and Metrics

### Skill Tree Analytics

```typescript
interface SkillTreeAnalytics {
  totalUsers: number;
  treeDistribution: Record<string, number>;
  averageLevel: number;
  mostPopularBranches: string[];
  respecFrequency: number;
  xpInvestmentPatterns: Record<string, number>;
}

const calculateSkillTreeAnalytics = (
  userSkillTrees: UserSkillTree[]
): SkillTreeAnalytics => {
  return {
    totalUsers: userSkillTrees.length,
    treeDistribution: userSkillTrees.reduce((acc, user) => {
      acc[user.activeTree] = (acc[user.activeTree] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    averageLevel: userSkillTrees.reduce((sum, user) => {
      return sum + Object.values(user.trees).reduce((treeSum, tree) => treeSum + tree.totalLevel, 0);
    }, 0) / userSkillTrees.length,
    mostPopularBranches: getMostPopularBranches(userSkillTrees),
    respecFrequency: calculateRespecFrequency(userSkillTrees),
    xpInvestmentPatterns: calculateXPInvestmentPatterns(userSkillTrees)
  };
};
```

## Testing Requirements

### Unit Tests

- Skill unlock validation
- XP cost calculations
- Prerequisite checking
- Respec functionality

### Integration Tests

- Firestore skill tree updates
- Real-time synchronization
- Perk application system
- Recommendation engine

### Performance Tests

- Large skill tree collections
- Real-time update frequency
- Skill tree rendering performance
- XP calculation efficiency

## Future Enhancements

### Advanced Features

- Cross-tree synergies
- Seasonal skill trees
- Skill tree competitions
- Mastery achievements
- Skill tree sharing

### Social Features

- Skill tree leaderboards
- Mentorship based on skills
- Skill-based team formation
- Skill tree showcases
- Collaborative skill development
