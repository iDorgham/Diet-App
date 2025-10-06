# Onboarding Page Specification

## EARS Requirements

**EARS-ONB-001**: The system shall provide a guided onboarding flow for new users to set up their profile and preferences.

**EARS-ONB-002**: The system shall collect essential user information including diet type, body type, and weight goals.

**EARS-ONB-003**: The system shall introduce key features through interactive tutorials and demonstrations.

**EARS-ONB-004**: The system shall provide progress indicators and allow users to skip non-essential steps.

**EARS-ONB-005**: The system shall save progress and allow users to resume onboarding at any time.

**EARS-ONB-006**: The system shall provide contextual help and tooltips throughout the onboarding process.

## Onboarding Flow Structure

### Step 1: Welcome & Introduction

```typescript
interface WelcomeStep {
  id: 'welcome';
  title: 'Welcome to NutriQuest!';
  description: 'Your journey to better nutrition starts here';
  content: {
    heroImage: '/images/onboarding/hero.png';
    features: [
      {
        icon: 'target';
        title: 'Set Goals';
        description: 'Define your nutrition and fitness objectives'
      },
      {
        icon: 'track';
        title: 'Track Progress';
        description: 'Monitor your daily nutrition intake'
      },
      {
        icon: 'game';
        title: 'Gamified Experience';
        description: 'Earn rewards and level up as you progress'
      }
    ];
  };
  actions: {
    primary: {
      text: 'Get Started';
      action: 'next';
    };
    secondary: {
      text: 'Learn More';
      action: 'show_features';
    };
  };
  required: true;
  skippable: false;
}
```

### Step 2: Personal Information

```typescript
interface PersonalInfoStep {
  id: 'personal_info';
  title: 'Tell us about yourself';
  description: 'Help us personalize your experience';
  fields: [
    {
      name: 'name';
      label: 'Full Name';
      type: 'text';
      required: true;
      placeholder: 'Enter your full name';
      validation: {
        minLength: 2;
        maxLength: 50;
        pattern: '^[a-zA-Z\\s]+$';
      };
    },
    {
      name: 'age';
      label: 'Age';
      type: 'number';
      required: true;
      min: 13;
      max: 120;
      placeholder: 'Enter your age';
    },
    {
      name: 'gender';
      label: 'Gender';
      type: 'select';
      required: true;
      options: [
        { value: 'male'; label: 'Male' },
        { value: 'female'; label: 'Female' },
        { value: 'other'; label: 'Other' },
        { value: 'prefer_not_to_say'; label: 'Prefer not to say' }
      ];
    },
    {
      name: 'height';
      label: 'Height';
      type: 'select';
      required: true;
      options: this.generateHeightOptions();
    },
    {
      name: 'weight';
      label: 'Current Weight';
      type: 'number';
      required: true;
      min: 30;
      max: 300;
      unit: 'kg';
      placeholder: 'Enter your weight';
    }
  ];
  required: true;
  skippable: false;
}
```

### Step 3: Health & Fitness Goals

```typescript
interface GoalsStep {
  id: 'goals';
  title: 'What are your goals?';
  description: 'Select your primary health and fitness objectives';
  goalCategories: [
    {
      id: 'weight_management';
      title: 'Weight Management';
      icon: 'scale';
      goals: [
        {
          id: 'lose_weight';
          title: 'Lose Weight';
          description: 'Create a calorie deficit to lose weight';
          icon: 'trending-down';
        },
        {
          id: 'maintain_weight';
          title: 'Maintain Weight';
          description: 'Keep your current weight stable';
          icon: 'trending-flat';
        },
        {
          id: 'gain_weight';
          title: 'Gain Weight';
          description: 'Increase weight through healthy eating';
          icon: 'trending-up';
        }
      ];
    },
    {
      id: 'nutrition';
      title: 'Nutrition';
      icon: 'apple';
      goals: [
        {
          id: 'improve_nutrition';
          title: 'Improve Nutrition';
          description: 'Eat more balanced and nutritious meals';
          icon: 'heart';
        },
        {
          id: 'track_macros';
          title: 'Track Macros';
          description: 'Monitor protein, carbs, and fat intake';
          icon: 'pie-chart';
        },
        {
          id: 'eat_healthier';
          title: 'Eat Healthier';
          description: 'Make better food choices';
          icon: 'leaf';
        }
      ];
    },
    {
      id: 'lifestyle';
      title: 'Lifestyle';
      icon: 'activity';
      goals: [
        {
          id: 'build_habits';
          title: 'Build Healthy Habits';
          description: 'Develop consistent healthy eating patterns';
          icon: 'repeat';
        },
        {
          id: 'learn_nutrition';
          title: 'Learn About Nutrition';
          description: 'Understand nutrition science and best practices';
          icon: 'book';
        },
        {
          id: 'meal_planning';
          title: 'Meal Planning';
          description: 'Plan and prepare meals in advance';
          icon: 'calendar';
        }
      ];
    }
  ];
  selectionType: 'multiple';
  maxSelections: 3;
  required: true;
  skippable: false;
}
```

### Step 4: Diet Preferences

```typescript
interface DietPreferencesStep {
  id: 'diet_preferences';
  title: 'Dietary Preferences';
  description: 'Tell us about your dietary restrictions and preferences';
  preferences: [
    {
      id: 'diet_type';
      title: 'Diet Type';
      type: 'select';
      required: true;
      options: [
        { value: 'balanced'; label: 'Balanced Diet'; description: 'No restrictions' },
        { value: 'vegetarian'; label: 'Vegetarian'; description: 'No meat or fish' },
        { value: 'vegan'; label: 'Vegan'; description: 'No animal products' },
        { value: 'keto'; label: 'Ketogenic'; description: 'Low carb, high fat' },
        { value: 'paleo'; label: 'Paleo'; description: 'Whole foods, no processed' },
        { value: 'mediterranean'; label: 'Mediterranean'; description: 'Mediterranean style' },
        { value: 'low_carb'; label: 'Low Carb'; description: 'Reduced carbohydrates' },
        { value: 'low_fat'; label: 'Low Fat'; description: 'Reduced fat intake' },
        { value: 'custom'; label: 'Custom'; description: 'Define your own' }
      ];
    },
    {
      id: 'allergies';
      title: 'Food Allergies';
      type: 'multiselect';
      required: false;
      options: [
        { value: 'nuts'; label: 'Tree Nuts' },
        { value: 'peanuts'; label: 'Peanuts' },
        { value: 'dairy'; label: 'Dairy' },
        { value: 'eggs'; label: 'Eggs' },
        { value: 'soy'; label: 'Soy' },
        { value: 'wheat'; label: 'Wheat/Gluten' },
        { value: 'fish'; label: 'Fish' },
        { value: 'shellfish'; label: 'Shellfish' },
        { value: 'sesame'; label: 'Sesame' }
      ];
    },
    {
      id: 'dislikes';
      title: 'Food Dislikes';
      type: 'multiselect';
      required: false;
      options: [
        { value: 'spicy'; label: 'Spicy Food' },
        { value: 'bitter'; label: 'Bitter Foods' },
        { value: 'seafood'; label: 'Seafood' },
        { value: 'mushrooms'; label: 'Mushrooms' },
        { value: 'olives'; label: 'Olives' },
        { value: 'cilantro'; label: 'Cilantro' }
      ];
    }
  ];
  required: true;
  skippable: true;
}
```

### Step 5: Activity Level

```typescript
interface ActivityLevelStep {
  id: 'activity_level';
  title: 'Activity Level';
  description: 'How active are you in your daily life?';
  activityLevels: [
    {
      id: 'sedentary';
      title: 'Sedentary';
      description: 'Little to no exercise, desk job';
      icon: 'monitor';
      multiplier: 1.2;
      examples: ['Office work', 'No regular exercise', 'Mostly sitting'];
    },
    {
      id: 'lightly_active';
      title: 'Lightly Active';
      description: 'Light exercise 1-3 days per week';
      icon: 'walk';
      multiplier: 1.375;
      examples: ['Light walking', 'Occasional exercise', 'Some daily activity'];
    },
    {
      id: 'moderately_active';
      title: 'Moderately Active';
      description: 'Moderate exercise 3-5 days per week';
      icon: 'run';
      multiplier: 1.55;
      examples: ['Regular workouts', 'Active job', 'Daily exercise'];
    },
    {
      id: 'very_active';
      title: 'Very Active';
      description: 'Hard exercise 6-7 days per week';
      icon: 'zap';
      multiplier: 1.725;
      examples: ['Intense workouts', 'Physical job', 'Athletic training'];
    },
    {
      id: 'extremely_active';
      title: 'Extremely Active';
      description: 'Very hard exercise, physical job, or training twice daily';
      icon: 'flame';
      multiplier: 1.9;
      examples: ['Professional athlete', 'Construction work', 'Double training'];
    }
  ];
  required: true;
  skippable: false;
}
```

### Step 6: Feature Introduction

```typescript
interface FeatureIntroductionStep {
  id: 'feature_intro';
  title: 'Key Features';
  description: 'Discover what makes NutriQuest special';
  features: [
    {
      id: 'ai_coach';
      title: 'AI Nutrition Coach';
      description: 'Get personalized advice and meal suggestions';
      icon: 'brain';
      demo: {
        type: 'interactive';
        content: 'Try asking: "What should I eat for breakfast?"';
        action: 'demo_chat';
      };
    },
    {
      id: 'gamification';
      title: 'Gamified Experience';
      description: 'Earn XP, level up, and unlock achievements';
      icon: 'trophy';
      demo: {
        type: 'animation';
        content: 'Watch your progress bar fill up!';
        action: 'demo_progress';
      };
    },
    {
      id: 'social';
      title: 'Social Community';
      description: 'Connect with friends and share your journey';
      icon: 'users';
      demo: {
        type: 'preview';
        content: 'See how others are progressing';
        action: 'demo_community';
      };
    },
    {
      id: 'tracking';
      title: 'Smart Tracking';
      description: 'Easy meal logging with photo recognition';
      icon: 'camera';
      demo: {
        type: 'interactive';
        content: 'Take a photo of your meal!';
        action: 'demo_camera';
      };
    }
  ];
  required: false;
  skippable: true;
}
```

### Step 7: Goal Setting

```typescript
interface GoalSettingStep {
  id: 'goal_setting';
  title: 'Set Your Goals';
  description: 'Define specific targets for your journey';
  goals: [
    {
      id: 'weight_goal';
      title: 'Weight Goal';
      type: 'number';
      unit: 'kg';
      min: 30;
      max: 300;
      placeholder: 'Enter target weight';
      helpText: 'Based on your current weight and goals';
    },
    {
      id: 'timeline';
      title: 'Timeline';
      type: 'select';
      options: [
        { value: '1_month'; label: '1 Month' },
        { value: '3_months'; label: '3 Months' },
        { value: '6_months'; label: '6 Months' },
        { value: '1_year'; label: '1 Year' },
        { value: 'custom'; label: 'Custom' }
      ];
    },
    {
      id: 'daily_calories';
      title: 'Daily Calorie Target';
      type: 'number';
      unit: 'calories';
      min: 800;
      max: 4000;
      placeholder: 'Enter daily calorie target';
      helpText: 'Calculated based on your goals and activity level';
    }
  ];
  required: true;
  skippable: false;
}
```

### Step 8: Completion & Next Steps

```typescript
interface CompletionStep {
  id: 'completion';
  title: 'You\'re all set!';
  description: 'Welcome to your nutrition journey';
  content: {
    summary: {
      name: 'User Name';
      goals: ['Selected Goals'];
      dietType: 'Selected Diet';
      activityLevel: 'Selected Activity Level';
    };
    nextSteps: [
      {
        title: 'Complete your first meal log';
        description: 'Start tracking your nutrition today';
        action: 'go_to_tracking';
        priority: 'high';
      },
      {
        title: 'Set up your first quest';
        description: 'Choose a quest to begin your journey';
        action: 'go_to_quests';
        priority: 'medium';
      },
      {
        title: 'Explore the community';
        description: 'Connect with other users';
        action: 'go_to_community';
        priority: 'low';
      }
    ];
  };
  actions: {
    primary: {
      text: 'Start My Journey';
      action: 'complete_onboarding';
    };
    secondary: {
      text: 'Review Settings';
      action: 'edit_profile';
    };
  };
  required: true;
  skippable: false;
}
```

## Onboarding State Management

### State Structure

```typescript
interface OnboardingState {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  skippedSteps: number[];
  userData: {
    personalInfo: PersonalInfo;
    goals: Goal[];
    dietPreferences: DietPreferences;
    activityLevel: ActivityLevel;
    targetGoals: TargetGoals;
  };
  progress: {
    percentage: number;
    estimatedTimeRemaining: number;
    canSkip: boolean;
  };
  settings: {
    autoSave: boolean;
    showTooltips: boolean;
    skipOptionalSteps: boolean;
  };
}
```

### Progress Tracking

```typescript
export class OnboardingService {
  static async saveProgress(
    userId: string,
    stepData: any,
    stepId: string
  ): Promise<void> {
    const progress = await this.getOnboardingProgress(userId);
    
    progress.userData[stepId] = stepData;
    progress.completedSteps.push(parseInt(stepId));
    progress.currentStep = Math.max(progress.currentStep, parseInt(stepId) + 1);
    
    await this.updateOnboardingProgress(userId, progress);
  }
  
  static async skipStep(
    userId: string,
    stepId: string,
    reason?: string
  ): Promise<void> {
    const progress = await this.getOnboardingProgress(userId);
    
    progress.skippedSteps.push(parseInt(stepId));
    progress.currentStep = Math.max(progress.currentStep, parseInt(stepId) + 1);
    
    await this.updateOnboardingProgress(userId, progress);
    
    // Log skip reason for analytics
    await this.logStepSkip(userId, stepId, reason);
  }
  
  static async completeOnboarding(
    userId: string
  ): Promise<OnboardingResult> {
    const progress = await this.getOnboardingProgress(userId);
    
    // Validate required steps
    const requiredSteps = this.getRequiredSteps();
    const missingSteps = requiredSteps.filter(
      step => !progress.completedSteps.includes(step)
    );
    
    if (missingSteps.length > 0) {
      throw new Error(`Missing required steps: ${missingSteps.join(', ')}`);
    }
    
    // Create user profile
    const userProfile = await this.createUserProfile(progress.userData);
    
    // Award onboarding completion rewards
    const rewards = await this.awardOnboardingRewards(userId);
    
    // Mark onboarding as complete
    await this.markOnboardingComplete(userId);
    
    return {
      success: true,
      userProfile,
      rewards,
      nextSteps: this.getNextSteps(progress.userData)
    };
  }
}
```

## UI Components

### Onboarding Container

```typescript
const OnboardingContainer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userData, setUserData] = useState<OnboardingState['userData']>({});
  const [progress, setProgress] = useState(0);
  
  const steps = [
    WelcomeStep,
    PersonalInfoStep,
    GoalsStep,
    DietPreferencesStep,
    ActivityLevelStep,
    FeatureIntroductionStep,
    GoalSettingStep,
    CompletionStep
  ];
  
  const handleStepComplete = async (stepData: any, stepId: string) => {
    await OnboardingService.saveProgress(userId, stepData, stepId);
    setUserData(prev => ({ ...prev, [stepId]: stepData }));
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  const handleStepSkip = async (stepId: string, reason?: string) => {
    await OnboardingService.skipStep(userId, stepId, reason);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  
  return (
    <div className="onboarding-container">
      <div className="onboarding-header">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="step-indicator">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>
      
      <div className="onboarding-content">
        {React.createElement(steps[currentStep], {
          onComplete: handleStepComplete,
          onSkip: handleStepSkip,
          userData,
          currentStep
        })}
      </div>
      
      <div className="onboarding-navigation">
        {currentStep > 0 && (
          <button 
            className="back-button"
            onClick={() => setCurrentStep(prev => prev - 1)}
          >
            Back
          </button>
        )}
        
        <div className="step-actions">
          {steps[currentStep].skippable && (
            <button 
              className="skip-button"
              onClick={() => handleStepSkip(currentStep.toString())}
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
```

### Progress Indicator

```typescript
const ProgressIndicator: React.FC<{
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
}> = ({ currentStep, totalSteps, completedSteps }) => {
  return (
    <div className="progress-indicator">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`progress-dot ${
            index < currentStep ? 'completed' :
            index === currentStep ? 'current' : 'upcoming'
          }`}
        >
          {index < currentStep && (
            <Check className="w-4 h-4" />
          )}
        </div>
      ))}
    </div>
  );
};
```

### Interactive Demo

```typescript
const InteractiveDemo: React.FC<{
  demoType: string;
  content: string;
  onAction: (action: string) => void;
}> = ({ demoType, content, onAction }) => {
  const [isActive, setIsActive] = useState(false);
  
  const handleDemo = () => {
    setIsActive(true);
    onAction('demo_started');
    
    // Simulate demo interaction
    setTimeout(() => {
      setIsActive(false);
      onAction('demo_completed');
    }, 3000);
  };
  
  return (
    <div className={`interactive-demo ${isActive ? 'active' : ''}`}>
      <div className="demo-content">
        <p>{content}</p>
        <button 
          className="demo-button"
          onClick={handleDemo}
          disabled={isActive}
        >
          {isActive ? 'Demo Running...' : 'Try It Now'}
        </button>
      </div>
      
      {isActive && (
        <div className="demo-animation">
          <div className="demo-visual">
            {/* Demo-specific animation */}
          </div>
        </div>
      )}
    </div>
  );
};
```

This comprehensive onboarding system provides a smooth, engaging introduction to the application while collecting essential user information and setting up their personalized experience.
