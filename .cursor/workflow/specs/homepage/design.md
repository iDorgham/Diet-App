# Homepage - Design

## Layout Structure

### Component Hierarchy
```
HomePage
├── HeaderStatusPanel
│   ├── TimeDisplay
│   ├── DietTypeIndicator
│   ├── NextMealTimer
│   └── WorkoutStatus
├── DashboardMetrics (4-column grid)
│   ├── DaysCardWithStars
│   ├── LevelCardWithXP
│   ├── FitnessScoreCard
│   └── DietCoinsCard
├── NewsTicker
│   ├── TickerItem
│   ├── TickerControls
│   └── TickerProgress
└── WeeklyFocus (2-column grid)
    ├── TodaysPlan (Left)
    │   ├── DailyFocusSummary
    │   └── ActionItemsList
    └── ShoppingList (Right)
        ├── NutritionMetricsGrid
        ├── RecommendedMarkets
        └── KeyItemsSummary
```

### Current Implementation Status
✅ **IMPLEMENTED** - Core HomePage structure with all major components
✅ **IMPLEMENTED** - Dashboard metrics with 4-column responsive grid
✅ **IMPLEMENTED** - News ticker with rotating content
✅ **IMPLEMENTED** - Task management with completion functionality
✅ **IMPLEMENTED** - Shopping list with nutrition metrics
✅ **IMPLEMENTED** - Real-time data integration with Zustand store
✅ **IMPLEMENTED** - Responsive design with Tailwind CSS
✅ **IMPLEMENTED** - Oceanic color palette (#085492, #71E6DE)

### Responsive Breakpoints
```typescript
const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1440px'
};

const gridLayouts = {
  mobile: {
    metrics: '1 column',
    focus: '1 column',
    spacing: '16px'
  },
  tablet: {
    metrics: '2 columns',
    focus: '2 columns',
    spacing: '24px'
  },
  desktop: {
    metrics: '4 columns',
    focus: '2 columns',
    spacing: '32px'
  }
};
```

## Implementation Details

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **State Management**: Zustand store (`nutriStore.ts`)
- **Styling**: Tailwind CSS with custom oceanic theme
- **Icons**: Lucide React icon library
- **Animations**: Custom AnimatedProgressBar component
- **Real-time Updates**: Zustand store with reactive updates

### Data Flow Architecture
```typescript
// Store Integration
const progress = useProgress();           // User progress data
const userProfile = useUserProfile();    // User profile information
const headerStatus = useHeaderStatus();  // Time and status data
const { completeTask } = useNutriStore(); // Task completion actions

// Real-time Updates
- Progress updates trigger re-renders automatically
- Task completion updates store state immediately
- News ticker rotates every 4 seconds
- XP progress bars animate on data changes
```

### Performance Optimizations
- **Memoization**: Expensive calculations memoized with `useMemo`
- **Component Splitting**: Separate components for each metric card
- **Lazy Loading**: Ready for future lazy loading implementation
- **Efficient Re-renders**: Zustand store minimizes unnecessary updates

## Component Specifications

### HeaderStatusPanel
```typescript
interface HeaderStatusProps {
  currentTime: Date;
  dietType: DietType;
  nextMeal: Meal;
  workoutStatus: WorkoutStatus;
  onTimeUpdate: (time: Date) => void;
}

const HeaderStatusPanel: React.FC<HeaderStatusProps> = ({
  currentTime,
  dietType,
  nextMeal,
  workoutStatus,
  onTimeUpdate
}) => {
  return (
    <div className="header-status-panel">
      <TimeDisplay time={currentTime} onUpdate={onTimeUpdate} />
      <DietTypeIndicator type={dietType} />
      <NextMealTimer meal={nextMeal} />
      <WorkoutStatus status={workoutStatus} />
    </div>
  );
};
```

### DashboardMetrics
```typescript
interface DashboardMetricsProps {
  progress: UserProgress;
  onMetricClick: (metric: MetricType) => void;
}

const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  progress,
  onMetricClick
}) => {
  return (
    <div className="dashboard-metrics grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <DaysCardWithStars 
        score={progress.daysScore}
        stars={progress.starMilestones}
        onClick={() => onMetricClick('days')}
      />
      <LevelCardWithXP
        level={progress.level}
        currentXP={progress.currentXP}
        xpToNext={progress.xpToNext}
        bodyType={progress.bodyType}
        onClick={() => onMetricClick('level')}
      />
      <FitnessScoreCard
        score={progress.fitnessScore}
        trend={progress.fitnessTrend}
        onClick={() => onMetricClick('fitness')}
      />
      <DietCoinsCard
        coins={progress.coins}
        earningHistory={progress.coinHistory}
        onClick={() => onMetricClick('coins')}
      />
    </div>
  );
};
```

### DaysCardWithStars
```typescript
interface DaysCardProps {
  score: number;
  stars: StarMilestone[];
  onClick: () => void;
}

const DaysCardWithStars: React.FC<DaysCardProps> = ({
  score,
  stars,
  onClick
}) => {
  return (
    <div 
      className="metric-card days-card bg-gradient-to-br from-primary-500 to-primary-600 text-white"
      onClick={onClick}
    >
      <div className="card-header">
        <h3 className="card-title">Days</h3>
        <StarIcon className="w-6 h-6" />
      </div>
      <div className="card-content">
        <div className="score-display">
          <span className="score-number text-4xl font-bold">{score}</span>
          <span className="score-label text-sm opacity-90">days</span>
        </div>
        <div className="stars-container">
          {stars.map((star, index) => (
            <StarMilestone
              key={index}
              milestone={star}
              isActive={star.isUnlocked}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
```

### LevelCardWithXP
```typescript
interface LevelCardProps {
  level: number;
  currentXP: number;
  xpToNext: number;
  bodyType: BodyType;
  onClick: () => void;
}

const LevelCardWithXP: React.FC<LevelCardProps> = ({
  level,
  currentXP,
  xpToNext,
  bodyType,
  onClick
}) => {
  const progressPercentage = (currentXP / (currentXP + xpToNext)) * 100;
  
  return (
    <div 
      className="metric-card level-card bg-gradient-to-br from-secondary-500 to-secondary-600 text-white"
      onClick={onClick}
    >
      <div className="card-header">
        <h3 className="card-title">Level</h3>
        <BodyTypeIcon type={bodyType} className="w-6 h-6" />
      </div>
      <div className="card-content">
        <div className="level-display">
          <span className="level-number text-4xl font-bold">{level}</span>
          <span className="level-label text-sm opacity-90">level</span>
        </div>
        <div className="xp-progress">
          <div className="xp-bar">
            <div 
              className="xp-fill bg-white"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="xp-text text-sm">
            {currentXP} / {currentXP + xpToNext} XP
          </div>
        </div>
      </div>
    </div>
  );
};
```

### NewsTicker
```typescript
interface NewsTickerProps {
  items: NewsItem[];
  isPaused: boolean;
  onPauseToggle: () => void;
  onItemClick: (item: NewsItem) => void;
}

const NewsTicker: React.FC<NewsTickerProps> = ({
  items,
  isPaused,
  onPauseToggle,
  onItemClick
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isPaused, items.length]);
  
  return (
    <div className="news-ticker bg-white rounded-lg shadow-md p-4">
      <div className="ticker-header flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800">Health Tips</h3>
        <button
          onClick={onPauseToggle}
          className="ticker-control p-2 rounded-full hover:bg-gray-100"
        >
          {isPaused ? <PlayIcon className="w-4 h-4" /> : <PauseIcon className="w-4 h-4" />}
        </button>
      </div>
      <div className="ticker-content">
        <div className="ticker-item flex items-center space-x-3">
          <div className="ticker-icon">
            {items[currentIndex]?.icon}
          </div>
          <div className="ticker-text flex-1">
            <p className="text-gray-700">{items[currentIndex]?.content}</p>
          </div>
        </div>
        <div className="ticker-progress mt-3">
          <div className="progress-bar bg-gray-200 rounded-full h-1">
            <div 
              className="progress-fill bg-primary-500 h-1 rounded-full transition-all duration-100"
              style={{ width: `${((currentIndex + 1) / items.length) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
```

### WeeklyFocus
```typescript
interface WeeklyFocusProps {
  todaysPlan: DailyPlan;
  shoppingList: ShoppingList;
  onTaskComplete: (taskId: string) => void;
  onShoppingItemClick: (itemId: string) => void;
}

const WeeklyFocus: React.FC<WeeklyFocusProps> = ({
  todaysPlan,
  shoppingList,
  onTaskComplete,
  onShoppingItemClick
}) => {
  return (
    <div className="weekly-focus grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      <TodaysPlan
        plan={todaysPlan}
        onTaskComplete={onTaskComplete}
      />
      <ShoppingList
        list={shoppingList}
        onItemClick={onShoppingItemClick}
      />
    </div>
  );
};
```

### TodaysPlan
```typescript
interface TodaysPlanProps {
  plan: DailyPlan;
  onTaskComplete: (taskId: string) => void;
}

const TodaysPlan: React.FC<TodaysPlanProps> = ({
  plan,
  onTaskComplete
}) => {
  return (
    <div className="todays-plan bg-white rounded-lg shadow-md p-6">
      <div className="plan-header mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Today's Plan</h3>
        <p className="text-sm text-gray-600">{plan.focus}</p>
      </div>
      
      <div className="daily-focus-summary mb-6">
        <div className="focus-card bg-gradient-to-r from-primary-50 to-secondary-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">Daily Focus</h4>
          <p className="text-gray-600">{plan.dailyFocus}</p>
        </div>
      </div>
      
      <div className="action-items">
        <h4 className="font-medium text-gray-800 mb-3">Action Items</h4>
        <div className="space-y-3">
          {plan.actionItems.map((item) => (
            <ActionItem
              key={item.id}
              item={item}
              onComplete={() => onTaskComplete(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
```

### ShoppingList
```typescript
interface ShoppingListProps {
  list: ShoppingList;
  onItemClick: (itemId: string) => void;
}

const ShoppingList: React.FC<ShoppingListProps> = ({
  list,
  onItemClick
}) => {
  return (
    <div className="shopping-list bg-white rounded-lg shadow-md p-6">
      <div className="list-header mb-4">
        <h3 className="text-xl font-semibold text-gray-800">Shopping List</h3>
        <p className="text-sm text-gray-600">{list.itemCount} items</p>
      </div>
      
      <div className="nutrition-metrics-grid grid grid-cols-2 gap-4 mb-6">
        <MetricCard
          title="Calories"
          value={list.nutritionMetrics.calories}
          target={list.nutritionMetrics.calorieTarget}
          unit="kcal"
        />
        <MetricCard
          title="Protein"
          value={list.nutritionMetrics.protein}
          target={list.nutritionMetrics.proteinTarget}
          unit="g"
        />
        <MetricCard
          title="Carbs"
          value={list.nutritionMetrics.carbs}
          target={list.nutritionMetrics.carbTarget}
          unit="g"
        />
        <MetricCard
          title="Fat"
          value={list.nutritionMetrics.fat}
          target={list.nutritionMetrics.fatTarget}
          unit="g"
        />
      </div>
      
      <div className="recommended-markets mb-4">
        <h4 className="font-medium text-gray-800 mb-2">Recommended Markets</h4>
        <div className="flex space-x-2">
          {list.recommendedMarkets.map((market) => (
            <MarketTag key={market.id} market={market} />
          ))}
        </div>
      </div>
      
      <div className="key-items">
        <h4 className="font-medium text-gray-800 mb-3">Key Items</h4>
        <div className="space-y-2">
          {list.keyItems.map((item) => (
            <ShoppingItem
              key={item.id}
              item={item}
              onClick={() => onItemClick(item.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
```

## State Management

### HomePage State
```typescript
interface HomePageState {
  // User Data
  progress: UserProgress;
  userProfile: UserProfile;
  
  // UI State
  localCompletedTasks: number[];
  headerStatus: HeaderStatus;
  isAnyTaskLoading: boolean;
  
  // News Ticker
  newsItems: NewsItem[];
  tickerPaused: boolean;
  currentTickerIndex: number;
  
  // Real-time Updates
  lastUpdateTime: Date;
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting';
  
  // Error Handling
  errors: ErrorState[];
  retryAttempts: number;
}

interface UserProgress {
  daysScore: number;
  level: number;
  currentXP: number;
  xpToNext: number;
  fitnessScore: number;
  fitnessTrend: 'up' | 'down' | 'stable';
  coins: number;
  coinHistory: CoinEarning[];
  starMilestones: StarMilestone[];
  bodyType: BodyType;
}

interface HeaderStatus {
  currentTime: Date;
  dietType: DietType;
  nextMeal: Meal;
  workoutStatus: WorkoutStatus;
}
```

### Real-time Data Flow
```typescript
class HomePageDataManager {
  private firestore: Firestore;
  private unsubscribeFunctions: (() => void)[] = [];
  
  async initializeRealTimeUpdates(userId: string): Promise<void> {
    // Subscribe to user progress updates
    const progressUnsubscribe = onSnapshot(
      doc(this.firestore, 'users', userId, 'progress', 'current'),
      (doc) => {
        if (doc.exists()) {
          this.updateUserProgress(doc.data() as UserProgress);
        }
      }
    );
    
    // Subscribe to task updates
    const tasksUnsubscribe = onSnapshot(
      collection(this.firestore, 'users', userId, 'tasks'),
      (snapshot) => {
        const tasks = snapshot.docs.map(doc => doc.data() as Task);
        this.updateTasks(tasks);
      }
    );
    
    // Subscribe to news updates
    const newsUnsubscribe = onSnapshot(
      collection(this.firestore, 'news'),
      (snapshot) => {
        const newsItems = snapshot.docs.map(doc => doc.data() as NewsItem);
        this.updateNewsItems(newsItems);
      }
    );
    
    this.unsubscribeFunctions.push(
      progressUnsubscribe,
      tasksUnsubscribe,
      newsUnsubscribe
    );
  }
  
  private updateUserProgress(progress: UserProgress): void {
    // Update state with new progress data
    this.setState(prevState => ({
      ...prevState,
      progress,
      lastUpdateTime: new Date()
    }));
    
    // Trigger any necessary side effects
    this.checkForLevelUp(progress);
    this.updateLocalStorage(progress);
  }
  
  cleanup(): void {
    this.unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    this.unsubscribeFunctions = [];
  }
}
```

## Performance Optimization

### Memoization Strategy
```typescript
const HomePage: React.FC = () => {
  const { progress, userProfile, tasks } = useHomePageData();
  
  // Memoize expensive calculations
  const processedTasks = useMemo(() => {
    return tasks.map(task => ({
      ...task,
      timeRemaining: calculateTimeRemaining(task.deadline),
      isOverdue: isTaskOverdue(task.deadline)
    }));
  }, [tasks]);
  
  // Memoize filtered data
  const todaysTasks = useMemo(() => {
    return processedTasks.filter(task => isToday(task.date));
  }, [processedTasks]);
  
  // Memoize component props
  const dashboardProps = useMemo(() => ({
    progress,
    onMetricClick: handleMetricClick
  }), [progress]);
  
  return (
    <div className="homepage">
      <HeaderStatusPanel {...headerProps} />
      <DashboardMetrics {...dashboardProps} />
      <NewsTicker {...tickerProps} />
      <WeeklyFocus {...focusProps} />
    </div>
  );
};
```

### Lazy Loading
```typescript
const HomePage: React.FC = () => {
  // Lazy load heavy components
  const ShoppingList = lazy(() => import('./ShoppingList'));
  const TaskManager = lazy(() => import('./TaskManager'));
  
  return (
    <div className="homepage">
      <Suspense fallback={<LoadingSpinner />}>
        <DashboardMetrics />
        <NewsTicker />
        <Suspense fallback={<ShoppingListSkeleton />}>
          <ShoppingList />
        </Suspense>
        <Suspense fallback={<TaskManagerSkeleton />}>
          <TaskManager />
        </Suspense>
      </Suspense>
    </div>
  );
};
```

### Error Boundaries
```typescript
class HomePageErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('HomePage Error:', error, errorInfo);
    // Send error to monitoring service
    this.reportError(error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <p>We're working to fix this issue.</p>
          <button onClick={() => window.location.reload()}>
            Refresh Page
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

## Accessibility Features

### Keyboard Navigation
```typescript
const HomePage: React.FC = () => {
  const [focusedElement, setFocusedElement] = useState<string | null>(null);
  
  const handleKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'Tab':
        // Handle tab navigation
        break;
      case 'Enter':
      case ' ':
        // Handle activation
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        // Handle horizontal navigation
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        // Handle vertical navigation
        break;
    }
  };
  
  return (
    <div 
      className="homepage"
      onKeyDown={handleKeyDown}
      role="main"
      aria-label="Diet Game Homepage"
    >
      {/* Components with proper ARIA labels */}
    </div>
  );
};
```

### Screen Reader Support
```typescript
const MetricCard: React.FC<MetricCardProps> = ({ title, value, onClick }) => {
  return (
    <div
      className="metric-card"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${title}: ${value}`}
      aria-describedby={`${title}-description`}
    >
      <h3 className="card-title">{title}</h3>
      <div className="card-value" aria-live="polite">
        {value}
      </div>
      <div id={`${title}-description`} className="sr-only">
        Click to view detailed information about {title}
      </div>
    </div>
  );
};
```
