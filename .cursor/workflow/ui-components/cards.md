# Card Components Specification

## EARS Requirements

**EARS-UI-011**: The system shall display metric cards with animated progress indicators and real-time updates.

**EARS-UI-012**: The system shall show task cards with completion status, rewards, and interactive elements.

**EARS-UI-013**: The system shall provide nutrition cards with detailed metrics and visual progress bars.

**EARS-UI-014**: The system shall display achievement cards with unlock animations and reward notifications.

**EARS-UI-015**: The system shall show shopping list cards with item details and purchase tracking.

## Component Structure

### Metric Card Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Icon] Metric Name                    [Value] [Unit]        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Progress Bar (Animated)                                │ │
│ └─────────────────────────────────────────────────────────┘ │
│ Trend: ↗️ +5% from yesterday                              │
└─────────────────────────────────────────────────────────────┘
```

### Task Card Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Task Icon] Task Title                    [Priority Badge]  │
│ Category: Cooking | Time: 30m | Difficulty: Medium         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Rewards: ⭐ +50 | ⚡ +25 XP | 🪙 +10 Coins             │ │
│ └─────────────────────────────────────────────────────────┘ │
│ [Complete Button] [Details] [Schedule]                     │
└─────────────────────────────────────────────────────────────┘
```

### Nutrition Card Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Food Icon] Meal Name                    [Calories]         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Protein: ████████░░ 80% | Carbs: ██████░░░░ 60%       │ │
│ │ Fats: ███████░░░ 70% | Fiber: █████░░░░░ 50%          │ │
│ └─────────────────────────────────────────────────────────┘ │
│ [Log Meal] [View Details] [Add to Favorites]               │
└─────────────────────────────────────────────────────────────┘
```

## Technical Specifications

### Props Interfaces

#### MetricCardProps
```typescript
interface MetricCardProps {
  icon: React.ComponentType;
  title: string;
  value: string | number;
  unit?: string;
  progress?: number; // 0-100
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
    period: string;
  };
  color?: string;
  animated?: boolean;
  onClick?: () => void;
  className?: string;
}
```

#### TaskCardProps
```typescript
interface TaskCardProps {
  task: {
    id: number;
    title: string;
    type: 'MEAL' | 'SHOPPING' | 'COOKING' | 'EXERCISE' | 'WATER' | 'DAILY_CHECKIN' | 'AI_CHAT';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    estimatedTime: number;
    difficulty: 'easy' | 'medium' | 'hard';
    rewards: {
      score: number;
      coins: number;
      xp: number;
    };
    streak: number;
    isCompleted: boolean;
    scheduledTime?: string;
    category: string;
    tags: string[];
  };
  onComplete?: (taskId: number) => void;
  onDetails?: (taskId: number) => void;
  onSchedule?: (taskId: number) => void;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'detailed';
}
```

#### NutritionCardProps
```typescript
interface NutritionCardProps {
  meal: {
    id: string;
    name: string;
    calories: number;
    macros: {
      protein: number;
      carbs: number;
      fats: number;
      fiber: number;
    };
    micronutrients?: {
      vitamins: Record<string, number>;
      minerals: Record<string, number>;
    };
    ingredients: string[];
    allergens: string[];
    image?: string;
  };
  onLogMeal?: (mealId: string) => void;
  onViewDetails?: (mealId: string) => void;
  onAddToFavorites?: (mealId: string) => void;
  showMacros?: boolean;
  showMicronutrients?: boolean;
}
```

#### AchievementCardProps
```typescript
interface AchievementCardProps {
  achievement: {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    isUnlocked: boolean;
    progress?: number; // 0-100
    rewards: {
      xp: number;
      coins: number;
      title?: string;
    };
    unlockedAt?: Date;
  };
  onClaim?: (achievementId: string) => void;
  showProgress?: boolean;
  animated?: boolean;
}
```

## Card Variants

### Metric Card Variants
```typescript
const metricCardVariants = {
  default: 'bg-white shadow-lg border border-gray-200',
  primary: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
  success: 'bg-gradient-to-r from-green-500 to-green-600 text-white',
  warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white',
  danger: 'bg-gradient-to-r from-red-500 to-red-600 text-white',
  info: 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white'
};
```

### Task Card Variants
```typescript
const taskCardVariants = {
  default: 'bg-white border-l-4 border-l-gray-400',
  high: 'bg-white border-l-4 border-l-orange-500',
  urgent: 'bg-white border-l-4 border-l-red-500',
  completed: 'bg-gray-50 border-l-4 border-l-green-500 opacity-75',
  streak: 'bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-l-orange-500'
};
```

### Priority Colors
```typescript
const priorityColors = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600'
};
```

### Difficulty Colors
```typescript
const difficultyColors = {
  easy: 'bg-green-100 text-green-600',
  medium: 'bg-yellow-100 text-yellow-600',
  hard: 'bg-red-100 text-red-600'
};
```

## Styling Requirements

### Color Scheme
- **Primary**: #085492 (Ocean Blue)
- **Secondary**: #71E6DE (Mint Green)
- **Success**: #10B981 (Emerald 500)
- **Warning**: #F59E0B (Amber 500)
- **Danger**: #EF4444 (Red 500)
- **Info**: #06B6D4 (Cyan 500)
- **Background**: #FFFFFF (White)
- **Border**: #E5E7EB (Gray 200)

### Responsive Design
- **Desktop**: Full card layout with all details
- **Tablet**: Condensed layout with essential information
- **Mobile**: Stack layout with touch-friendly buttons

### Typography
- **Card Title**: lg font-bold
- **Card Subtitle**: sm font-medium
- **Card Content**: base font-normal
- **Card Actions**: sm font-semibold

## Interactive Elements

### Hover Effects
- Subtle shadow elevation increase
- Color transition animations
- Scale transform (1.02x)
- Border color changes

### Click Interactions
- Ripple effect on button clicks
- Loading states for async actions
- Success/error feedback animations
- Haptic feedback on mobile

### Progress Animations
- Smooth progress bar fills
- Staggered animation delays
- Completion celebration effects
- Trend indicator animations

## Data Sources

### Real-time Data
- Metric values from Firestore
- Task completion status
- Progress updates
- Achievement unlocks

### Static Data
- Card configuration
- Icon mappings
- Color schemes
- Animation presets

## Accessibility Requirements

### ARIA Labels
- Proper card landmarks
- Screen reader descriptions
- Progress announcements
- Action button labels

### Keyboard Navigation
- Tab order through interactive elements
- Enter/Space activation
- Arrow key navigation for card grids
- Escape to close modals

### Visual Indicators
- High contrast mode support
- Focus indicators
- Color-blind friendly progress bars
- Touch target compliance

## Performance Considerations

### Optimization
- Memoize card rendering
- Virtual scrolling for large lists
- Lazy load card images
- Debounce progress updates

### Animation Performance
- Use transform and opacity for animations
- GPU acceleration for smooth transitions
- Reduce motion for accessibility
- Optimize animation frame rates

## Testing Requirements

### Unit Tests
- Card rendering with different props
- Progress bar calculations
- Animation state management
- Click handler execution

### Integration Tests
- Card interaction flows
- Progress update mechanisms
- Achievement unlock sequences
- Navigation from cards

### Visual Tests
- Card layout consistency
- Animation smoothness
- Responsive behavior
- Color contrast validation

## Implementation Notes

### Dependencies
- Framer Motion for animations
- Lucide React for icons
- Tailwind CSS for styling
- React Hook Form for form cards

### Error Handling
- Graceful fallbacks for missing data
- Loading skeletons for async content
- Error boundaries for card failures
- Retry mechanisms for failed actions

### Future Enhancements
- Drag and drop card reordering
- Card customization options
- Advanced filtering and sorting
- Card sharing functionality
- Offline card caching
