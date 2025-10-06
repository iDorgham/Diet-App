# Component Architecture

## Overview
This document describes the component architecture of the Diet Planner Game application, following React best practices and atomic design principles.

## Component Hierarchy

### Application Structure
```
App
├── Header
│   ├── Navigation
│   ├── UserStatus
│   └── LanguageSelector
├── Main
│   ├── HomePage
│   │   ├── MetricCards
│   │   ├── TaskList
│   │   ├── NewsTicker
│   │   └── ProgressOverview
│   ├── TasksPage
│   │   ├── KanbanBoard
│   │   ├── TaskCards
│   │   └── TaskFilters
│   ├── CoachPage
│   │   ├── AIChat
│   │   ├── CoachInterface
│   │   └── ChatHistory
│   ├── NutritionPage
│   │   ├── MealPlanner
│   │   ├── NutritionTracker
│   │   └── RecipeBrowser
│   └── GamificationPage
│       ├── RewardSystem
│       ├── LevelProgress
│       └── AchievementDisplay
└── Footer
    ├── LegalLinks
    ├── SupportLinks
    └── LanguageSelector
```

## Atomic Design Principles

### 1. Atoms (Basic Building Blocks)
```typescript
// Button Component
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

// Input Component
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

// Icon Component
interface IconProps {
  name: IconType;
  size?: number;
  color?: string;
  className?: string;
}
```

### 2. Molecules (Simple Combinations)
```typescript
// MetricCard Component
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: IconType;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

// TaskCard Component
interface TaskCardProps {
  task: Task;
  onComplete: (taskId: number) => void;
  onEdit?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
}

// ProgressBar Component
interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  animated?: boolean;
}
```

### 3. Organisms (Complex Components)
```typescript
// Header Component
interface HeaderProps {
  userProfile: UserProfile;
  headerStatus: HeaderStatus;
  onNavigate: (page: string) => void;
  onUserMenuClick: (action: string) => void;
}

// KanbanBoard Component
interface KanbanBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: number, newStatus: TaskStatus) => void;
  onTaskComplete: (taskId: number) => void;
  onTaskCreate: (task: Omit<Task, 'id'>) => void;
}

// AIChat Component
interface AIChatProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  onClearHistory?: () => void;
}
```

### 4. Templates (Page Layouts)
```typescript
// PageTemplate Component
interface PageTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  loading?: boolean;
  error?: string;
}

// DashboardTemplate Component
interface DashboardTemplateProps {
  metrics: MetricCardProps[];
  recentTasks: Task[];
  quickActions: QuickAction[];
  children?: React.ReactNode;
}
```

## Component Patterns

### 1. Container/Presentational Pattern
```typescript
// Container Component (Logic)
const TasksPageContainer = () => {
  const { tasks, loading, error } = useTasks();
  const { completeTask, updateTask } = useTaskActions();
  
  return (
    <TasksPage
      tasks={tasks}
      loading={loading}
      error={error}
      onCompleteTask={completeTask}
      onUpdateTask={updateTask}
    />
  );
};

// Presentational Component (UI)
interface TasksPageProps {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  onCompleteTask: (taskId: number) => void;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
}

const TasksPage: React.FC<TasksPageProps> = ({
  tasks,
  loading,
  error,
  onCompleteTask,
  onUpdateTask
}) => {
  // Pure UI logic only
};
```

### 2. Custom Hooks Pattern
```typescript
// useTaskManagement Hook
export const useTaskManagement = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const completeTask = useCallback(async (taskId: number) => {
    setLoading(true);
    try {
      await TaskService.completeTask(taskId);
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, completed: true } : task
      ));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { tasks, loading, error, completeTask };
};
```

### 3. Compound Component Pattern
```typescript
// MetricCard Compound Component
const MetricCard = {
  Root: ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {children}
    </div>
  ),
  
  Header: ({ title, icon }: { title: string; icon: IconType }) => (
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <Icon name={icon} size={20} className="text-gray-400" />
    </div>
  ),
  
  Value: ({ value, className }: { value: string | number; className?: string }) => (
    <div className={`text-2xl font-bold ${className}`}>
      {value}
    </div>
  ),
  
  Trend: ({ trend, value }: { trend: 'up' | 'down' | 'neutral'; value?: string }) => (
    <div className={`flex items-center text-sm ${
      trend === 'up' ? 'text-green-600' : 
      trend === 'down' ? 'text-red-600' : 
      'text-gray-500'
    }`}>
      <Icon 
        name={trend === 'up' ? 'TrendingUp' : trend === 'down' ? 'TrendingDown' : 'Minus'} 
        size={16} 
      />
      {value && <span className="ml-1">{value}</span>}
    </div>
  )
};

// Usage
<MetricCard.Root>
  <MetricCard.Header title="Total Score" icon="Star" />
  <MetricCard.Value value="3,500" className="text-indigo-600" />
  <MetricCard.Trend trend="up" value="+12%" />
</MetricCard.Root>
```

## State Management Integration

### 1. Zustand Integration
```typescript
// Component using Zustand store
const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { completeTask, updateProgress } = useNutriActions();
  const { progress } = useProgress();
  
  const handleComplete = async () => {
    await completeTask(task.id, task.type, 1);
    // Progress is automatically updated via store
  };
  
  return (
    <div className="task-card">
      <h3>{task.name}</h3>
      <p>Reward: {task.xpReward} XP</p>
      <button onClick={handleComplete}>
        Complete Task
      </button>
    </div>
  );
};
```

### 2. React Query Integration
```typescript
// Component using React Query
const RecipeBrowser: React.FC = () => {
  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => RecipeService.getRecipes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="recipe-grid">
      {recipes?.map(recipe => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};
```

## Animation and Interaction Patterns

### 1. Framer Motion Integration
```typescript
// Animated Component
const AnimatedTaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="task-card"
    >
      <h3>{task.name}</h3>
      <motion.button
        whileHover={{ backgroundColor: '#4F46E5' }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onComplete(task.id)}
      >
        Complete
      </motion.button>
    </motion.div>
  );
};
```

### 2. Progress Animation
```typescript
// Animated Progress Bar
const AnimatedProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  label,
  animated = true
}) => {
  const progress = (current / max) * 100;
  
  return (
    <div className="progress-container">
      {label && <span className="progress-label">{label}</span>}
      <div className="progress-track">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: animated ? 0.8 : 0 }}
        />
      </div>
      <span className="progress-text">{current}/{max}</span>
    </div>
  );
};
```

## Form Components

### 1. Form with Validation
```typescript
// UserProfileForm Component
const UserProfileForm: React.FC = () => {
  const { userProfile, updateProfile } = useNutriActions();
  const [formData, setFormData] = useState(userProfile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = (data: UserProfile): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    
    if (!data.userName.trim()) {
      newErrors.userName = 'Username is required';
    }
    
    if (!data.dietType) {
      newErrors.dietType = 'Diet type is required';
    }
    
    return newErrors;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    
    if (Object.keys(newErrors).length === 0) {
      updateProfile(formData);
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="profile-form">
      <Input
        label="Username"
        value={formData.userName}
        onChange={(value) => setFormData(prev => ({ ...prev, userName: value }))}
        error={errors.userName}
      />
      
      <Select
        label="Diet Type"
        value={formData.dietType}
        onChange={(value) => setFormData(prev => ({ ...prev, dietType: value }))}
        options={DIET_TYPES}
        error={errors.dietType}
      />
      
      <Button type="submit" variant="primary">
        Save Profile
      </Button>
    </form>
  );
};
```

## Error Handling Patterns

### 1. Error Boundary
```typescript
// ErrorBoundary Component
class ErrorBoundary extends React.Component<
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
    console.error('Error caught by boundary:', error, errorInfo);
    // Send to error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>We're sorry, but something unexpected happened.</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Try Again
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### 2. Error Display Component
```typescript
// ErrorMessage Component
interface ErrorMessageProps {
  error: string | Error;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  error,
  onRetry,
  onDismiss
}) => {
  const message = typeof error === 'string' ? error : error.message;
  
  return (
    <div className="error-message">
      <Icon name="AlertCircle" size={20} className="text-red-500" />
      <span>{message}</span>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
      {onDismiss && (
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Dismiss
        </Button>
      )}
    </div>
  );
};
```

## Performance Optimization

### 1. Memoization
```typescript
// Memoized Component
const TaskList = React.memo<TaskListProps>(({ tasks, onTaskComplete }) => {
  const sortedTasks = useMemo(() => 
    tasks.sort((a, b) => a.priority - b.priority),
    [tasks]
  );
  
  return (
    <div className="task-list">
      {sortedTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onTaskComplete}
        />
      ))}
    </div>
  );
});
```

### 2. Virtual Scrolling
```typescript
// VirtualizedList Component for large datasets
const VirtualizedTaskList: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
  return (
    <FixedSizeList
      height={600}
      itemCount={tasks.length}
      itemSize={80}
      itemData={tasks}
    >
      {({ index, style, data }) => (
        <div style={style}>
          <TaskCard task={data[index]} />
        </div>
      )}
    </FixedSizeList>
  );
};
```

## Testing Patterns

### 1. Component Testing
```typescript
// TaskCard.test.tsx
describe('TaskCard', () => {
  const mockTask: Task = {
    id: 1,
    name: 'Test Task',
    completed: false,
    xpReward: 10,
    // ... other properties
  };
  
  it('renders task information correctly', () => {
    render(<TaskCard task={mockTask} onComplete={jest.fn()} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('10 XP')).toBeInTheDocument();
  });
  
  it('calls onComplete when button is clicked', () => {
    const onComplete = jest.fn();
    render(<TaskCard task={mockTask} onComplete={onComplete} />);
    
    fireEvent.click(screen.getByText('Complete'));
    expect(onComplete).toHaveBeenCalledWith(1);
  });
});
```

### 2. Hook Testing
```typescript
// useTaskManagement.test.ts
describe('useTaskManagement', () => {
  it('should complete task successfully', async () => {
    const { result } = renderHook(() => useTaskManagement());
    
    act(() => {
      result.current.completeTask(1);
    });
    
    await waitFor(() => {
      expect(result.current.tasks[0].completed).toBe(true);
    });
  });
});
```

## Accessibility Patterns

### 1. ARIA Labels and Roles
```typescript
// Accessible Button Component
const AccessibleButton: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
  loading,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={loading ? 'Loading...' : undefined}
      aria-disabled={disabled || loading}
      role="button"
      {...props}
    >
      {loading ? <LoadingSpinner /> : children}
    </button>
  );
};
```

### 2. Keyboard Navigation
```typescript
// Keyboard Navigation Hook
const useKeyboardNavigation = (items: any[], onSelect: (item: any) => void) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex(prev => (prev + 1) % items.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex(prev => (prev - 1 + items.length) % items.length);
          break;
        case 'Enter':
          e.preventDefault();
          onSelect(items[focusedIndex]);
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [items, focusedIndex, onSelect]);
  
  return { focusedIndex };
};
```

This component architecture provides a solid foundation for building maintainable, scalable, and performant React components while following industry best practices and accessibility standards.
