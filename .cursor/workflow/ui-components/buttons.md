# Button Components Specification

## EARS Requirements

**EARS-UI-031**: The system shall provide primary action buttons with loading states and disabled handling.

**EARS-UI-032**: The system shall display secondary buttons with hover effects and keyboard navigation.

**EARS-UI-033**: The system shall show icon buttons with tooltips and accessibility labels.

**EARS-UI-034**: The system shall provide floating action buttons for quick access to primary functions.

**EARS-UI-035**: The system shall display button groups with consistent spacing and alignment.

## Component Structure

### Primary Button Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Primary Button]                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Icon] Button Text                    [Loading Spinner] │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Button Group Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Button 1] [Button 2] [Button 3]                           │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                       │
│ │ Active  │ │ Normal  │ │ Disabled│                       │
│ └─────────┘ └─────────┘ └─────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

### Floating Action Button Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                    [FAB]                    │
│                                 ┌─────────┐                 │
│                                 │   [+]   │                 │
│                                 └─────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## Technical Specifications

### Props Interfaces

#### ButtonProps
```typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ComponentType;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}
```

#### IconButtonProps
```typescript
interface IconButtonProps {
  icon: React.ComponentType;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
  onClick?: () => void;
  className?: string;
  'aria-label': string;
}
```

#### FloatingActionButtonProps
```typescript
interface FloatingActionButtonProps {
  icon: React.ComponentType;
  label: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  'aria-label': string;
}
```

#### ButtonGroupProps
```typescript
interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'segmented' | 'attached';
  className?: string;
}
```

## Button Variants

### Primary Variants
```typescript
const buttonVariants = {
  primary: {
    base: 'bg-blue-600 text-white border border-blue-600',
    hover: 'hover:bg-blue-700 hover:border-blue-700',
    focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    active: 'active:bg-blue-800',
    disabled: 'disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300'
  },
  secondary: {
    base: 'bg-gray-200 text-gray-900 border border-gray-300',
    hover: 'hover:bg-gray-300 hover:border-gray-400',
    focus: 'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    active: 'active:bg-gray-400',
    disabled: 'disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200'
  },
  outline: {
    base: 'bg-transparent text-blue-600 border border-blue-600',
    hover: 'hover:bg-blue-50 hover:border-blue-700',
    focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    active: 'active:bg-blue-100',
    disabled: 'disabled:bg-transparent disabled:text-gray-400 disabled:border-gray-300'
  },
  ghost: {
    base: 'bg-transparent text-gray-700 border border-transparent',
    hover: 'hover:bg-gray-100 hover:text-gray-900',
    focus: 'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    active: 'active:bg-gray-200',
    disabled: 'disabled:bg-transparent disabled:text-gray-400'
  },
  danger: {
    base: 'bg-red-600 text-white border border-red-600',
    hover: 'hover:bg-red-700 hover:border-red-700',
    focus: 'focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    active: 'active:bg-red-800',
    disabled: 'disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300'
  }
};
```

### Size Variants
```typescript
const sizeVariants = {
  sm: {
    padding: 'px-3 py-1.5',
    fontSize: 'text-sm',
    iconSize: 'w-4 h-4',
    minHeight: 'h-8'
  },
  md: {
    padding: 'px-4 py-2',
    fontSize: 'text-base',
    iconSize: 'w-5 h-5',
    minHeight: 'h-10'
  },
  lg: {
    padding: 'px-6 py-3',
    fontSize: 'text-lg',
    iconSize: 'w-6 h-6',
    minHeight: 'h-12'
  },
  xl: {
    padding: 'px-8 py-4',
    fontSize: 'text-xl',
    iconSize: 'w-7 h-7',
    minHeight: 'h-14'
  }
};
```

### FAB Positions
```typescript
const fabPositions = {
  'bottom-right': 'fixed bottom-6 right-6',
  'bottom-left': 'fixed bottom-6 left-6',
  'top-right': 'fixed top-6 right-6',
  'top-left': 'fixed top-6 left-6'
};
```

## Styling Requirements

### Color Scheme
- **Primary**: #3B82F6 (Blue 500)
- **Secondary**: #6B7280 (Gray 500)
- **Success**: #10B981 (Emerald 500)
- **Warning**: #F59E0B (Amber 500)
- **Danger**: #EF4444 (Red 500)
- **Background**: #FFFFFF (White)
- **Border**: #D1D5DB (Gray 300)
- **Text**: #111827 (Gray 900)

### Responsive Design
- **Desktop**: Full button with hover effects
- **Tablet**: Touch-friendly button sizes
- **Mobile**: Larger touch targets (minimum 44px)

### Typography
- **Button Text**: font-medium
- **Icon Size**: Matches text size
- **Loading Text**: font-normal

## Interactive Elements

### Hover Effects
- Color transitions (200ms ease-in-out)
- Shadow elevation increase
- Scale transform (1.02x)
- Border color changes

### Focus States
- Ring outline (2px)
- Ring offset (2px)
- High contrast colors
- Keyboard navigation support

### Loading States
- Spinner animation
- Disabled interaction
- Loading text overlay
- Progress indication

### Click Effects
- Ripple animation
- Scale down (0.98x)
- Haptic feedback on mobile
- Success/error feedback

## Animation System

### Button Animations
```typescript
const buttonAnimations = {
  hover: {
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  active: {
    scale: 0.98,
    transition: { duration: 0.1, ease: 'easeIn' }
  },
  loading: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: 'linear' }
  },
  ripple: {
    scale: [0, 1],
    opacity: [0.6, 0],
    transition: { duration: 0.6, ease: 'easeOut' }
  }
};
```

### FAB Animations
```typescript
const fabAnimations = {
  enter: {
    scale: [0, 1],
    rotate: [180, 0],
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    scale: [1, 0],
    rotate: [0, 180],
    transition: { duration: 0.2, ease: 'easeIn' }
  },
  pulse: {
    scale: [1, 1.1, 1],
    transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
  }
};
```

## Data Sources

### Button Data
- Button configuration
- Icon mappings
- Loading states
- Disabled states

### External Data
- User interactions
- Form validation states
- API response states
- Navigation events

## Accessibility Requirements

### ARIA Labels
- Proper button landmarks
- Screen reader descriptions
- Loading state announcements
- Disabled state indicators

### Keyboard Navigation
- Tab order through buttons
- Enter/Space activation
- Arrow key navigation for button groups
- Escape to cancel actions

### Visual Indicators
- High contrast mode support
- Focus indicators
- Color-blind friendly states
- Touch target compliance

## Performance Considerations

### Optimization
- Memoize button rendering
- Debounce click events
- Optimize animation performance
- Lazy load button icons

### Memory Management
- Cleanup event listeners
- Cancel pending animations
- Release focus on unmount
- Optimize re-renders

## Testing Requirements

### Unit Tests
- Button rendering with different props
- Click handler execution
- Loading state management
- Disabled state handling

### Integration Tests
- Button interaction flows
- Form submission handling
- Navigation functionality
- Keyboard navigation

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation flow
- Focus management
- Color contrast validation

## Implementation Notes

### Dependencies
- Framer Motion for animations
- Lucide React for icons
- React Hook Form for form buttons
- Tailwind CSS for styling

### Error Handling
- Graceful fallbacks for missing icons
- Loading state error handling
- Network error feedback
- Retry mechanisms for failed actions

### Future Enhancements
- Button customization options
- Advanced animation presets
- Button analytics tracking
- Multi-language support
- Theme-based button styling
