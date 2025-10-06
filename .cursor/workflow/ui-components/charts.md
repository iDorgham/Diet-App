# Chart Components Specification

## EARS Requirements

**EARS-UI-041**: The system shall display progress charts with animated transitions and real-time updates.

**EARS-UI-042**: The system shall provide nutrition charts with macro and micronutrient breakdowns.

**EARS-UI-043**: The system shall show weight tracking charts with trend analysis and goal visualization.

**EARS-UI-044**: The system shall display activity charts with workout intensity and duration metrics.

**EARS-UI-045**: The system shall provide financial charts with budget tracking and expense categorization.

## Component Structure

### Progress Chart Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Progress Overview                                           │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Circular Progress] 75% Complete                       │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ [Bar Chart] Daily Progress                          │ │ │
│ │ │ ████████████████████████████████████████████████████ │ │ │
│ │ │ Mon Tue Wed Thu Fri Sat Sun                         │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Nutrition Chart Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Nutrition Breakdown                                         │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Pie Chart] Macro Distribution                          │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Protein: 30% ████████████████████████████████████  │ │ │
│ │ │ Carbs: 45%   ████████████████████████████████████  │ │ │
│ │ │ Fats: 25%    ████████████████████████████████████  │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Weight Tracking Chart Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Weight Progress                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Line Chart] Weight Over Time                           │ │
│ │ 200┤                                                   │ │
│ │ 195┤     ●                                             │ │
│ │ 190┤   ●   ●                                           │ │
│ │ 185┤ ●       ●                                         │ │
│ │ 180┤           ●                                       │ │
│ │ 175┤             ●                                     │ │
│ │    └─────────────────────────────────────────────────  │ │
│ │     Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec    │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Technical Specifications

### Props Interfaces

#### ChartProps
```typescript
interface ChartProps {
  data: ChartData[];
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'area' | 'scatter';
  width?: number;
  height?: number;
  responsive?: boolean;
  animation?: boolean;
  interactive?: boolean;
  onDataPointClick?: (dataPoint: any) => void;
  onHover?: (dataPoint: any) => void;
  className?: string;
}

interface ChartData {
  label: string;
  value: number;
  color?: string;
  metadata?: Record<string, any>;
}
```

#### ProgressChartProps
```typescript
interface ProgressChartProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circular' | 'linear' | 'semi-circular';
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  showValue?: boolean;
  animated?: boolean;
  strokeWidth?: number;
  className?: string;
}
```

#### NutritionChartProps
```typescript
interface NutritionChartProps {
  macros: {
    protein: number;
    carbs: number;
    fats: number;
    fiber?: number;
  };
  goals?: {
    protein: number;
    carbs: number;
    fats: number;
    fiber?: number;
  };
  type?: 'pie' | 'doughnut' | 'bar' | 'radial';
  showGoals?: boolean;
  showPercentages?: boolean;
  animated?: boolean;
  className?: string;
}
```

#### WeightChartProps
```typescript
interface WeightChartProps {
  data: Array<{
    date: Date;
    weight: number;
    goal?: number;
  }>;
  goalWeight?: number;
  showGoal?: boolean;
  showTrend?: boolean;
  period?: 'week' | 'month' | 'quarter' | 'year';
  animated?: boolean;
  className?: string;
}
```

## Chart Types

### Chart Variants
```typescript
const chartTypes = {
  line: {
    component: 'LineChart',
    description: 'Time series data with trend lines',
    useCase: 'Weight tracking, progress over time'
  },
  bar: {
    component: 'BarChart',
    description: 'Categorical data comparison',
    useCase: 'Daily calories, workout intensity'
  },
  pie: {
    component: 'PieChart',
    description: 'Part-to-whole relationships',
    useCase: 'Macro distribution, expense categories'
  },
  doughnut: {
    component: 'DoughnutChart',
    description: 'Part-to-whole with center space',
    useCase: 'Progress indicators, completion rates'
  },
  area: {
    component: 'AreaChart',
    description: 'Filled time series data',
    useCase: 'Cumulative progress, volume tracking'
  },
  scatter: {
    component: 'ScatterChart',
    description: 'Correlation between two variables',
    useCase: 'Calories vs weight, exercise vs mood'
  }
};
```

### Progress Chart Variants
```typescript
const progressVariants = {
  circular: {
    shape: 'circle',
    strokeLinecap: 'round',
    animation: 'rotate'
  },
  linear: {
    shape: 'line',
    strokeLinecap: 'round',
    animation: 'slide'
  },
  'semi-circular': {
    shape: 'semicircle',
    strokeLinecap: 'round',
    animation: 'arc'
  }
};
```

### Color Schemes
```typescript
const colorSchemes = {
  nutrition: {
    protein: '#EF4444',    // Red
    carbs: '#F59E0B',      // Amber
    fats: '#10B981',       // Emerald
    fiber: '#8B5CF6'       // Violet
  },
  progress: {
    primary: '#3B82F6',    // Blue
    success: '#10B981',    // Emerald
    warning: '#F59E0B',    // Amber
    danger: '#EF4444'      // Red
  },
  weight: {
    current: '#3B82F6',    // Blue
    goal: '#10B981',       // Emerald
    trend: '#6B7280'       // Gray
  }
};
```

## Styling Requirements

### Color Scheme
- **Primary**: #3B82F6 (Blue 500)
- **Success**: #10B981 (Emerald 500)
- **Warning**: #F59E0B (Amber 500)
- **Danger**: #EF4444 (Red 500)
- **Info**: #06B6D4 (Cyan 500)
- **Background**: #FFFFFF (White)
- **Grid Lines**: #E5E7EB (Gray 200)
- **Text**: #111827 (Gray 900)

### Responsive Design
- **Desktop**: Full chart with detailed tooltips
- **Tablet**: Responsive sizing with touch interactions
- **Mobile**: Simplified charts with essential information

### Typography
- **Chart Title**: lg font-semibold
- **Axis Labels**: sm font-medium
- **Data Labels**: xs font-normal
- **Tooltips**: sm font-normal

## Interactive Elements

### Chart Interactions
- Hover effects with data highlighting
- Click events for data point selection
- Zoom and pan for detailed analysis
- Legend toggling for data series

### Progress Interactions
- Animated progress fills
- Hover tooltips with detailed information
- Click to view detailed breakdown
- Real-time updates with smooth transitions

### Navigation
- Time period selection
- Chart type switching
- Data filtering options
- Export functionality

## Animation System

### Chart Animations
```typescript
const chartAnimations = {
  enter: {
    opacity: [0, 1],
    scale: [0.8, 1],
    transition: { duration: 0.6, ease: 'easeOut' }
  },
  update: {
    transition: { duration: 0.4, ease: 'easeInOut' }
  },
  exit: {
    opacity: [1, 0],
    scale: [1, 0.8],
    transition: { duration: 0.3, ease: 'easeIn' }
  }
};
```

### Progress Animations
```typescript
const progressAnimations = {
  fill: {
    strokeDasharray: [0, 100],
    transition: { duration: 1.5, ease: 'easeInOut' }
  },
  pulse: {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  },
  bounce: {
    y: [0, -10, 0],
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};
```

## Data Sources

### Chart Data
- Real-time progress updates
- Historical data from database
- User goal settings
- Calculated metrics and trends

### External Data
- API responses for chart data
- User interaction events
- Time-based data aggregation
- Export and sharing functionality

## Accessibility Requirements

### ARIA Labels
- Proper chart landmarks
- Screen reader data descriptions
- Interactive element labels
- Data point announcements

### Keyboard Navigation
- Tab order through chart elements
- Arrow key navigation for data points
- Enter/Space for data selection
- Escape to close tooltips

### Visual Indicators
- High contrast mode support
- Color-blind friendly palettes
- Alternative text descriptions
- Focus indicators for interactive elements

## Performance Considerations

### Optimization
- Canvas rendering for large datasets
- Data aggregation for performance
- Lazy loading for chart libraries
- Memoization of chart calculations

### Memory Management
- Cleanup chart instances
- Cancel pending animations
- Optimize data structures
- Efficient re-rendering

## Testing Requirements

### Unit Tests
- Chart rendering with different data
- Animation state management
- Data point interactions
- Progress calculations

### Integration Tests
- Chart data flow
- Real-time updates
- User interaction flows
- Export functionality

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- Alternative text accuracy

## Implementation Notes

### Dependencies
- Chart.js or D3.js for chart rendering
- Framer Motion for animations
- React Spring for smooth transitions
- Tailwind CSS for styling

### Error Handling
- Graceful fallbacks for missing data
- Loading states for chart rendering
- Error boundaries for chart failures
- Retry mechanisms for data fetching

### Future Enhancements
- Advanced chart customization
- Real-time data streaming
- Chart templates and presets
- Advanced analytics features
- Chart sharing and collaboration
- Mobile-optimized interactions
