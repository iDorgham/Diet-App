# DietTypePage Documentation

## Overview

The DietTypePage provides users with comprehensive diet selection and adjustment capabilities, featuring AI recommendations for various diet types (e.g., keto, high-protein, vegan, paleo). It offers personalized diet guidance, nutritional analysis, and meal planning integration based on selected dietary preferences.

## EARS Requirements

**EARS-DIET-001**: The system shall provide diet type selection and adjustment options.

**EARS-DIET-002**: The system shall offer AI recommendations for diet types.

**EARS-DIET-003**: The system shall provide nutritional analysis for selected diets.

**EARS-DIET-004**: The system shall offer meal planning integration.

**EARS-DIET-005**: The system shall provide diet transition guidance.

**EARS-DIET-006**: The system shall offer dietary restriction management.

## Page Structure

### Header Section
- **Page Title**: "Diet Preferences"
- **Current Diet**: Active diet type display
- **Diet Status**: Diet adherence status
- **AI Coach**: AI diet recommendations
- **Help Center**: Diet guidance and support

### Main Content (3-Column Layout)

#### Left Column: Diet Categories
- **Popular Diets**: Trending diet types
- **Medical Diets**: Health-condition specific diets
- **Lifestyle Diets**: Lifestyle-based dietary choices
- **Cultural Diets**: Cultural and regional diets
- **Custom Diets**: User-defined diet preferences
- **Diet History**: Previously tried diets

#### Center Column: Diet Details
- **Diet Information**: Detailed diet description
- **Nutritional Profile**: Macro and micronutrient breakdown
- **Allowed Foods**: Foods included in diet
- **Restricted Foods**: Foods to avoid
- **Meal Examples**: Sample meal plans
- **Benefits & Risks**: Health benefits and considerations

#### Right Column: Personalization
- **AI Recommendations**: Personalized diet suggestions
- **Diet Compatibility**: Compatibility with user profile
- **Transition Plan**: Diet change guidance
- **Meal Planning**: Integrated meal planning
- **Progress Tracking**: Diet adherence tracking
- **Support Resources**: Diet support and community

### Detailed Sections

#### Diet Categories
- **Popular Diets**:
  - **Ketogenic**: High-fat, low-carb diet
  - **Mediterranean**: Heart-healthy Mediterranean diet
  - **Paleo**: Paleolithic diet approach
  - **Intermittent Fasting**: Time-restricted eating
  - **Low-Carb**: Reduced carbohydrate intake
  - **High-Protein**: Increased protein consumption

- **Medical Diets**:
  - **Diabetic**: Diabetes management diet
  - **Heart-Healthy**: Cardiovascular health diet
  - **Anti-Inflammatory**: Inflammation reduction diet
  - **Gluten-Free**: Celiac disease and gluten sensitivity
  - **Low-Sodium**: Hypertension management diet
  - **Renal**: Kidney disease management diet

- **Lifestyle Diets**:
  - **Vegetarian**: Plant-based diet without meat
  - **Vegan**: Plant-based diet without animal products
  - **Pescatarian**: Plant-based diet with fish
  - **Flexitarian**: Flexible vegetarian approach
  - **Raw Food**: Uncooked and unprocessed foods
  - **Whole30**: 30-day elimination diet

#### Diet Information
- **Diet Overview**:
  - **Description**: Detailed diet explanation
  - **History**: Diet origin and development
  - **Principles**: Core dietary principles
  - **Scientific Basis**: Research and evidence
  - **Popularity**: Current popularity and trends
  - **Expert Opinions**: Professional recommendations

- **Nutritional Analysis**:
  - **Macronutrients**: Protein, carbs, fat ratios
  - **Micronutrients**: Vitamin and mineral content
  - **Calorie Distribution**: Calorie source breakdown
  - **Fiber Content**: Dietary fiber analysis
  - **Antioxidants**: Antioxidant-rich foods
  - **Phytonutrients**: Plant-based nutrients

- **Food Guidelines**:
  - **Allowed Foods**: Foods to include
  - **Restricted Foods**: Foods to avoid
  - **Moderation Foods**: Foods to limit
  - **Portion Sizes**: Recommended serving sizes
  - **Meal Timing**: Optimal meal timing
  - **Hydration**: Fluid intake recommendations

#### AI Recommendations
- **Personalized Suggestions**:
  - **Health Goals**: Diet alignment with goals
  - **Medical Conditions**: Health condition considerations
  - **Lifestyle Factors**: Work, activity, preferences
  - **Food Preferences**: Taste and cultural preferences
  - **Budget Considerations**: Cost-effective options
  - **Time Constraints**: Time-friendly approaches

- **Compatibility Analysis**:
  - **Current Habits**: Alignment with current eating
  - **Transition Difficulty**: Ease of diet adoption
  - **Sustainability**: Long-term adherence potential
  - **Social Factors**: Social eating considerations
  - **Travel Compatibility**: Travel-friendly aspects
  - **Family Considerations**: Family meal planning

## Component Architecture

### Main Components

#### DietSelector
```typescript
interface DietSelectorProps {
  diets: Diet[];
  currentDiet: Diet;
  onDietSelect: (diet: Diet) => void;
  onDietChange: (diet: Diet) => void;
  onCustomDiet: (diet: CustomDiet) => void;
}
```
- Diet selection interface
- Diet comparison
- Custom diet creation
- Diet change management

#### DietDetails
```typescript
interface DietDetailsProps {
  diet: Diet;
  userProfile: UserProfile;
  onMealPlan: (diet: Diet) => void;
  onTransition: (diet: Diet) => void;
  onSupport: (diet: Diet) => void;
}
```
- Detailed diet information
- Nutritional analysis
- Meal planning integration
- Transition guidance

#### AIRecommendations
```typescript
interface AIRecommendationsProps {
  userProfile: UserProfile;
  healthGoals: HealthGoal[];
  onRecommendationSelect: (diet: Diet) => void;
  onAnalysis: (diet: Diet) => void;
}
```
- AI-powered diet recommendations
- Personalized suggestions
- Compatibility analysis
- Health goal alignment

#### DietTransition
```typescript
interface DietTransitionProps {
  currentDiet: Diet;
  targetDiet: Diet;
  onTransitionPlan: (plan: TransitionPlan) => void;
  onProgress: (progress: TransitionProgress) => void;
}
```
- Diet transition planning
- Gradual change guidance
- Progress tracking
- Support resources

### Data Models

#### Diet
```typescript
interface Diet {
  id: string;
  name: string;
  description: string;
  category: DietCategory;
  type: DietType;
  nutritionalProfile: NutritionalProfile;
  allowedFoods: Food[];
  restrictedFoods: Food[];
  moderationFoods: Food[];
  mealExamples: MealExample[];
  benefits: DietBenefit[];
  risks: DietRisk[];
  scientificEvidence: ScientificEvidence[];
  expertOpinions: ExpertOpinion[];
  popularity: number;
  difficulty: DifficultyLevel;
  sustainability: SustainabilityRating;
  cost: CostRating;
  timeCommitment: TimeCommitment;
  socialCompatibility: SocialCompatibility;
  travelCompatibility: TravelCompatibility;
  familyCompatibility: FamilyCompatibility;
}
```

#### NutritionalProfile
```typescript
interface NutritionalProfile {
  macronutrients: {
    protein: MacroRange;
    carbohydrates: MacroRange;
    fat: MacroRange;
    fiber: MacroRange;
  };
  micronutrients: {
    vitamins: VitaminProfile[];
    minerals: MineralProfile[];
    antioxidants: AntioxidantProfile[];
    phytonutrients: PhytonutrientProfile[];
  };
  calorieDistribution: {
    protein: number;
    carbohydrates: number;
    fat: number;
  };
  hydration: {
    dailyWater: number;
    additionalFluids: string[];
    timing: HydrationTiming[];
  };
}
```

#### DietRecommendation
```typescript
interface DietRecommendation {
  id: string;
  diet: Diet;
  userId: string;
  compatibilityScore: number;
  reasons: RecommendationReason[];
  benefits: PersonalBenefit[];
  considerations: PersonalConsideration[];
  transitionPlan: TransitionPlan;
  mealPlan: MealPlan;
  supportResources: SupportResource[];
  aiConfidence: number;
  createdAt: Date;
  expiresAt: Date;
}
```

#### TransitionPlan
```typescript
interface TransitionPlan {
  id: string;
  fromDiet: Diet;
  toDiet: Diet;
  duration: number;
  phases: TransitionPhase[];
  milestones: TransitionMilestone[];
  challenges: TransitionChallenge[];
  supportResources: SupportResource[];
  progressTracking: ProgressTracking;
  estimatedSuccess: number;
}
```

## Data Flow

### State Management
- **Zustand Store**: Global diet state
- **Local State**: Component-specific state
- **Real-time Updates**: Firebase synchronization
- **AI State**: AI recommendation state

### Data Sources
- **Diet Database**: Firebase diets collection
- **User Profile**: Firebase user documents
- **AI Service**: Grok AI API integration
- **Nutrition Data**: External nutrition APIs
- **Analytics**: Firebase analytics data

### Update Triggers
- **Diet Selection**: Updates current diet
- **AI Analysis**: Generates recommendations
- **Transition Start**: Initiates diet transition
- **Progress Updates**: Updates diet adherence
- **Meal Planning**: Integrates with meal planning

## Interactive Features

### Diet Selection
- **Category Browsing**: Browse diet categories
- **Diet Comparison**: Compare multiple diets
- **Custom Diets**: Create personalized diets
- **Diet History**: View previous diet choices
- **Favorites**: Save preferred diets

### AI Recommendations
- **Personalized Suggestions**: AI-powered recommendations
- **Compatibility Analysis**: Diet compatibility assessment
- **Health Goal Alignment**: Goal-based recommendations
- **Lifestyle Matching**: Lifestyle-based suggestions
- **Progress Optimization**: Performance-based adjustments

### Diet Transition
- **Transition Planning**: Gradual diet change plans
- **Progress Tracking**: Track transition progress
- **Challenge Management**: Address transition challenges
- **Support Resources**: Access support materials
- **Milestone Celebration**: Celebrate transition milestones

### Meal Integration
- **Meal Planning**: Integrated meal planning
- **Recipe Suggestions**: Diet-specific recipes
- **Shopping Lists**: Diet-appropriate shopping lists
- **Restaurant Guides**: Diet-friendly dining options
- **Social Eating**: Social meal planning

## Styling and Theming

### Diet Interface
- **Diet Cards**: Clean diet display cards
- **Category Tabs**: Easy category navigation
- **Comparison Tables**: Side-by-side diet comparison
- **Progress Indicators**: Visual progress displays
- **Recommendation Badges**: AI recommendation indicators

### Nutritional Display
- **Macro Charts**: Visual macronutrient breakdown
- **Food Lists**: Organized food category lists
- **Benefit Cards**: Health benefit displays
- **Risk Alerts**: Important risk information
- **Evidence Links**: Scientific evidence access

### AI Recommendations
- **Recommendation Cards**: AI suggestion displays
- **Compatibility Scores**: Visual compatibility ratings
- **Reason Lists**: Recommendation explanations
- **Confidence Indicators**: AI confidence levels
- **Action Buttons**: Clear recommendation actions

## Performance Considerations

### Optimization Strategies
- **Lazy Loading**: Load diets on demand
- **Caching**: Cache diet recommendations
- **AI Optimization**: Optimize AI API calls
- **Image Optimization**: Compress diet images
- **Bundle Splitting**: Code splitting for performance

### Data Management
- **Pagination**: Paginate large diet lists
- **Filtering**: Client-side filtering for performance
- **Indexing**: Database indexing for fast queries
- **Compression**: Compress diet data
- **Cleanup**: Remove unused diet data

## Accessibility Features

### Screen Reader Support
- **ARIA Labels**: Comprehensive ARIA labeling
- **Semantic HTML**: Proper HTML structure
- **Alt Text**: Descriptive image alternatives
- **Focus Management**: Logical focus order
- **Keyboard Navigation**: Full keyboard support

### Visual Accessibility
- **Color Contrast**: WCAG AA compliant colors
- **Text Size**: Adjustable text sizes
- **High Contrast**: High contrast mode support
- **Focus Indicators**: Clear focus states
- **Motion Reduction**: Respect motion preferences

## Testing Requirements

### Unit Tests
- **Component Rendering**: Test component display
- **Props Validation**: Test prop handling
- **State Management**: Test state updates
- **Event Handlers**: Test user interactions
- **AI Integration**: Test AI functionality

### Integration Tests
- **Diet Management**: Test diet operations
- **AI Recommendations**: Test AI functionality
- **Transition Planning**: Test transition features
- **Meal Integration**: Test meal planning integration
- **Data Synchronization**: Test real-time updates

### E2E Tests
- **Complete Workflow**: Test full user journey
- **Cross-browser**: Test browser compatibility
- **Mobile Testing**: Test mobile functionality
- **Performance**: Test loading and response times
- **Accessibility**: Test accessibility compliance

## Future Enhancements

### Planned Features
- **Genetic Diet Matching**: DNA-based diet recommendations
- **Microbiome Analysis**: Gut health-based diet suggestions
- **Real-time Adaptation**: Dynamic diet adjustments
- **Social Diet Challenges**: Community diet challenges
- **Expert Consultation**: Professional dietitian access

### Technical Improvements
- **Advanced AI**: More sophisticated AI models
- **Biometric Integration**: Health data integration
- **Predictive Analytics**: Diet outcome predictions
- **Offline Support**: Offline diet management
- **Cross-platform**: Enhanced mobile app integration

## Implementation Notes

### Development Approach
- **Spec-Driven Development**: Following EARS requirements
- **Component-First**: Reusable component architecture
- **Type Safety**: Full TypeScript implementation
- **Testing**: Comprehensive test coverage

### Code Quality
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking
- **Documentation**: Comprehensive code documentation

### Performance Monitoring
- **Bundle Size**: Monitor bundle size impact
- **Load Times**: Track page load performance
- **User Interactions**: Monitor user engagement
- **Error Tracking**: Track and resolve errors
- **Analytics**: User behavior analytics

---

*This documentation is maintained as part of the Diet Game SDD workflow. For the most up-to-date information, always refer to the latest version in the repository.*
