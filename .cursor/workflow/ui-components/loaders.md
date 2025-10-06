# Loader Components Specification

## EARS Requirements

**EARS-UI-051**: The system shall display loading spinners with customizable sizes and colors.

**EARS-UI-052**: The system shall provide skeleton loaders for content placeholders during data fetching.

**EARS-UI-053**: The system shall show progress bars with percentage indicators and animated fills.

**EARS-UI-054**: The system shall display loading overlays with backdrop blur and cancellation options.

**EARS-UI-055**: The system shall provide pulse loaders for quick loading states and micro-interactions.

## Component Structure

### Spinner Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Spinner] Loading...                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │           ╭─╮                                           │ │
│ │         ╭─╯ ╰─╮                                         │ │
│ │       ╭─╯     ╰─╮                                       │ │
│ │     ╭─╯         ╰─╮                                     │ │
│ │   ╭─╯             ╰─╮                                   │ │
│ │ ╭─╯                 ╰─╮                                 │ │
│ │ ╰─╮                 ╭─╯                                 │ │
│ │   ╰─╮             ╭─╯                                   │ │
│ │     ╰─╮         ╭─╯                                     │ │
│ │       ╰─╮     ╭─╯                                       │ │
│ │         ╰─╮ ╭─╯                                         │ │
│ │           ╰─╯                                           │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Skeleton Loader Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Skeleton Card]                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ██████████████████████████████████████████████████████ │ │
│ │ ██████████████████████████████████████████████████████ │ │
│ │ ██████████████████████████████████████████████████████ │ │
│ │ ██████████████████████████████████████████████████████ │ │
│ │ ██████████████████████████████████████████████████████ │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Progress Bar Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Uploading File... 75%                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ██████████████████████████████████████████████████████ │ │
│ │ ██████████████████████████████████████████████████████ │ │
│ │ ██████████████████████████████████████████████████████ │ │
│ │ ██████████████████████████████████████████████████████ │ │
│ └─────────────────────────────────────────────────────────┘ │
│ [Cancel]                                                   │
└─────────────────────────────────────────────────────────────┘
```

## Technical Specifications

### Props Interfaces

#### SpinnerProps
```typescript
interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  speed?: 'slow' | 'normal' | 'fast';
  label?: string;
  className?: string;
  'aria-label'?: string;
}

interface SpinnerSize {
  xs: 'w-3 h-3';
  sm: 'w-4 h-4';
  md: 'w-6 h-6';
  lg: 'w-8 h-8';
  xl: 'w-12 h-12';
}
```

#### SkeletonProps
```typescript
interface SkeletonProps {
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

interface SkeletonTextProps {
  lines?: number;
  spacing?: 'sm' | 'md' | 'lg';
  lastLineWidth?: string;
  className?: string;
}
```

#### ProgressBarProps
```typescript
interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
  striped?: boolean;
  className?: string;
}
```

#### LoadingOverlayProps
```typescript
interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  spinner?: boolean;
  backdrop?: boolean;
  backdropBlur?: boolean;
  message?: string;
  onCancel?: () => void;
  cancellable?: boolean;
  className?: string;
}
```

#### PulseLoaderProps
```typescript
interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}
```

## Loader Variants

### Spinner Types
```typescript
const spinnerTypes = {
  circular: {
    animation: 'spin',
    duration: '1s',
    timing: 'linear',
    iteration: 'infinite'
  },
  dots: {
    animation: 'bounce',
    duration: '1.4s',
    timing: 'ease-in-out',
    iteration: 'infinite'
  },
  bars: {
    animation: 'pulse',
    duration: '1.2s',
    timing: 'ease-in-out',
    iteration: 'infinite'
  }
};
```

### Skeleton Variants
```typescript
const skeletonVariants = {
  text: {
    shape: 'rectangular',
    borderRadius: 'rounded',
    height: 'h-4'
  },
  rectangular: {
    shape: 'rectangular',
    borderRadius: 'rounded-none',
    height: 'h-32'
  },
  circular: {
    shape: 'circular',
    borderRadius: 'rounded-full',
    height: 'h-12',
    width: 'w-12'
  },
  rounded: {
    shape: 'rectangular',
    borderRadius: 'rounded-lg',
    height: 'h-24'
  }
};
```

### Progress Bar Variants
```typescript
const progressVariants = {
  default: {
    background: 'bg-gray-200',
    fill: 'bg-blue-600',
    text: 'text-gray-700'
  },
  success: {
    background: 'bg-gray-200',
    fill: 'bg-green-600',
    text: 'text-green-700'
  },
  warning: {
    background: 'bg-gray-200',
    fill: 'bg-yellow-600',
    text: 'text-yellow-700'
  },
  danger: {
    background: 'bg-gray-200',
    fill: 'bg-red-600',
    text: 'text-red-700'
  },
  info: {
    background: 'bg-gray-200',
    fill: 'bg-cyan-600',
    text: 'text-cyan-700'
  }
};
```

## Styling Requirements

### Color Scheme
- **Primary**: #3B82F6 (Blue 500)
- **Secondary**: #6B7280 (Gray 500)
- **Success**: #10B981 (Emerald 500)
- **Warning**: #F59E0B (Amber 500)
- **Danger**: #EF4444 (Red 500)
- **Info**: #06B6D4 (Cyan 500)
- **Background**: #F3F4F6 (Gray 100)
- **Skeleton**: #E5E7EB (Gray 200)

### Responsive Design
- **Desktop**: Full-size loaders with detailed animations
- **Tablet**: Medium-size loaders with touch-friendly interactions
- **Mobile**: Compact loaders optimized for small screens

### Typography
- **Loading Text**: sm font-medium
- **Progress Label**: sm font-semibold
- **Percentage**: lg font-bold

## Interactive Elements

### Loading Interactions
- Smooth animation transitions
- Hover effects on interactive loaders
- Click to cancel functionality
- Keyboard navigation support

### Progress Interactions
- Real-time progress updates
- Cancellation options
- Success/error state transitions
- Completion celebrations

### Overlay Interactions
- Backdrop click to cancel
- Escape key to cancel
- Focus management
- Accessibility announcements

## Animation System

### Spinner Animations
```typescript
const spinnerAnimations = {
  spin: {
    rotate: [0, 360],
    transition: { duration: 1, repeat: Infinity, ease: 'linear' }
  },
  bounce: {
    y: [0, -20, 0],
    transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
  },
  pulse: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.5, 1],
    transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
  }
};
```

### Skeleton Animations
```typescript
const skeletonAnimations = {
  pulse: {
    opacity: [0.4, 1, 0.4],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
  },
  wave: {
    backgroundPosition: ['200% 0', '-200% 0'],
    transition: { duration: 1.6, repeat: Infinity, ease: 'linear' }
  }
};
```

### Progress Animations
```typescript
const progressAnimations = {
  fill: {
    width: ['0%', '100%'],
    transition: { duration: 0.5, ease: 'easeOut' }
  },
  striped: {
    backgroundPosition: ['0 0', '40px 0'],
    transition: { duration: 1, repeat: Infinity, ease: 'linear' }
  }
};
```

## Data Sources

### Loader Data
- Loading state management
- Progress values
- Animation configurations
- User interaction events

### External Data
- API response states
- File upload progress
- Real-time updates
- User cancellation events

## Accessibility Requirements

### ARIA Labels
- Proper loading landmarks
- Screen reader announcements
- Progress state descriptions
- Cancellation instructions

### Keyboard Navigation
- Tab order through interactive loaders
- Enter/Space for cancellation
- Escape to cancel operations
- Focus management during loading

### Visual Indicators
- High contrast mode support
- Reduced motion preferences
- Color-blind friendly indicators
- Clear loading state indication

## Performance Considerations

### Optimization
- Efficient animation rendering
- Minimal DOM updates
- Optimized CSS animations
- Reduced motion for accessibility

### Memory Management
- Cleanup animation timers
- Cancel pending operations
- Optimize re-renders
- Efficient state management

## Testing Requirements

### Unit Tests
- Loader rendering with different props
- Animation state management
- Progress calculations
- Cancellation functionality

### Integration Tests
- Loading state transitions
- Progress update flows
- User interaction handling
- Accessibility compliance

### Visual Tests
- Animation smoothness
- Loading state consistency
- Progress accuracy
- Cross-browser compatibility

## Implementation Notes

### Dependencies
- Framer Motion for animations
- React Spring for smooth transitions
- Tailwind CSS for styling
- CSS-in-JS for dynamic animations

### Error Handling
- Graceful fallbacks for animation failures
- Loading state error handling
- Network error feedback
- Retry mechanisms for failed operations

### Future Enhancements
- Advanced animation presets
- Custom loader themes
- Performance monitoring
- Accessibility improvements
- Multi-language support
- Advanced progress tracking
