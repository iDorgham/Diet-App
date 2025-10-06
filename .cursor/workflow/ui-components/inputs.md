# Input Components Specification

## EARS Requirements

**EARS-UI-046**: The system shall provide text input fields with validation and error handling.

**EARS-UI-047**: The system shall display number inputs with min/max constraints and step controls.

**EARS-UI-048**: The system shall show search inputs with autocomplete and suggestion features.

**EARS-UI-049**: The system shall provide textarea inputs with character counting and auto-resize functionality.

**EARS-UI-050**: The system shall display toggle switches with smooth animations and accessibility support.

## Component Structure

### Text Input Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Label] *Required                                           │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Icon] Input Value                    [Clear] [Status] │ │
│ └─────────────────────────────────────────────────────────┘ │
│ [Helper Text] [Error Message]                              │
└─────────────────────────────────────────────────────────────┘
```

### Search Input Layout
```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [🔍] Search...                    [Clear] [Filters]     │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Suggestion 1]                                         │ │
│ │ [Suggestion 2]                                         │ │
│ │ [Suggestion 3]                                         │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Toggle Switch Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Label]                                    [Toggle Switch] │
│ [Description]                              ┌─────────────┐ │
│                                            │     ●      │ │
│                                            └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Technical Specifications

### Props Interfaces

#### InputProps
```typescript
interface InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  error?: string;
  helperText?: string;
  icon?: React.ComponentType;
  iconPosition?: 'left' | 'right';
  clearable?: boolean;
  maxLength?: number;
  autoComplete?: string;
  autoFocus?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
}
```

#### NumberInputProps
```typescript
interface NumberInputProps {
  name: string;
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  unit?: string;
  showStepper?: boolean;
  className?: string;
}
```

#### SearchInputProps
```typescript
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
  showFilters?: boolean;
  onFilterClick?: () => void;
  loading?: boolean;
  className?: string;
}
```

#### TextareaProps
```typescript
interface TextareaProps {
  name: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  maxRows?: number;
  minRows?: number;
  autoResize?: boolean;
  maxLength?: number;
  showCharCount?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
}
```

#### ToggleProps
```typescript
interface ToggleProps {
  name: string;
  label?: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
  'aria-label'?: string;
}
```

## Input Variants

### Input States
```typescript
const inputStates = {
  default: {
    border: 'border-gray-300',
    focus: 'focus:border-blue-500 focus:ring-blue-500',
    background: 'bg-white'
  },
  error: {
    border: 'border-red-500',
    focus: 'focus:border-red-500 focus:ring-red-500',
    background: 'bg-white'
  },
  success: {
    border: 'border-green-500',
    focus: 'focus:border-green-500 focus:ring-green-500',
    background: 'bg-white'
  },
  disabled: {
    border: 'border-gray-200',
    focus: 'focus:border-gray-200 focus:ring-0',
    background: 'bg-gray-50'
  }
};
```

### Input Sizes
```typescript
const inputSizes = {
  sm: {
    padding: 'px-3 py-1.5',
    fontSize: 'text-sm',
    height: 'h-8'
  },
  md: {
    padding: 'px-3 py-2',
    fontSize: 'text-base',
    height: 'h-10'
  },
  lg: {
    padding: 'px-4 py-3',
    fontSize: 'text-lg',
    height: 'h-12'
  }
};
```

### Toggle Variants
```typescript
const toggleVariants = {
  default: {
    track: 'bg-gray-200',
    thumb: 'bg-white',
    checked: 'bg-blue-600'
  },
  success: {
    track: 'bg-gray-200',
    thumb: 'bg-white',
    checked: 'bg-green-600'
  },
  warning: {
    track: 'bg-gray-200',
    thumb: 'bg-white',
    checked: 'bg-yellow-600'
  },
  danger: {
    track: 'bg-gray-200',
    thumb: 'bg-white',
    checked: 'bg-red-600'
  }
};
```

## Styling Requirements

### Color Scheme
- **Primary**: #3B82F6 (Blue 500)
- **Success**: #10B981 (Emerald 500)
- **Warning**: #F59E0B (Amber 500)
- **Error**: #EF4444 (Red 500)
- **Background**: #FFFFFF (White)
- **Border**: #D1D5DB (Gray 300)
- **Text**: #111827 (Gray 900)
- **Placeholder**: #9CA3AF (Gray 400)

### Responsive Design
- **Desktop**: Full input with hover effects
- **Tablet**: Touch-friendly input sizes
- **Mobile**: Larger touch targets and simplified layouts

### Typography
- **Label**: sm font-medium
- **Input Text**: base font-normal
- **Helper Text**: xs font-normal
- **Error Text**: xs font-medium

## Interactive Elements

### Input Interactions
- Focus state highlighting
- Hover effects on interactive elements
- Clear button functionality
- Icon click handlers

### Search Interactions
- Real-time suggestion filtering
- Keyboard navigation for suggestions
- Click to select suggestions
- Clear search functionality

### Toggle Interactions
- Smooth toggle animation
- Haptic feedback on mobile
- Keyboard activation support
- Visual state feedback

### Number Input Interactions
- Stepper button controls
- Keyboard arrow key support
- Min/max value constraints
- Step increment/decrement

## Animation System

### Input Animations
```typescript
const inputAnimations = {
  focus: {
    scale: 1.02,
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  error: {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.5, ease: 'easeInOut' }
    }
  },
  success: {
    pulse: {
      scale: [1, 1.05, 1],
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }
};
```

### Toggle Animations
```typescript
const toggleAnimations = {
  switch: {
    x: [0, 20],
    transition: { duration: 0.2, ease: 'easeInOut' }
  },
  track: {
    backgroundColor: ['#D1D5DB', '#3B82F6'],
    transition: { duration: 0.2, ease: 'easeInOut' }
  }
};
```

## Data Sources

### Input Data
- User input values
- Validation rules
- Default values
- Error states

### External Data
- Autocomplete suggestions
- Validation responses
- User preferences
- Form state management

## Accessibility Requirements

### ARIA Labels
- Proper input landmarks
- Screen reader descriptions
- Error message announcements
- Required field indicators

### Keyboard Navigation
- Tab order through inputs
- Enter to submit forms
- Escape to clear inputs
- Arrow keys for number inputs

### Visual Indicators
- High contrast mode support
- Focus indicators
- Color-blind friendly states
- Touch target compliance

## Performance Considerations

### Optimization
- Debounce input validation
- Memoize input rendering
- Optimize suggestion filtering
- Lazy load autocomplete data

### Memory Management
- Cleanup event listeners
- Cancel pending validations
- Optimize re-renders
- Efficient data structures

## Testing Requirements

### Unit Tests
- Input rendering with different props
- Validation logic
- Event handler execution
- State management

### Integration Tests
- Form submission flows
- Validation error handling
- Autocomplete functionality
- Toggle state management

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation
- Focus management
- Color contrast validation

## Implementation Notes

### Dependencies
- React Hook Form for form management
- Framer Motion for animations
- Lucide React for icons
- Tailwind CSS for styling

### Error Handling
- Graceful validation error display
- Network error handling
- Fallback for missing data
- Retry mechanisms

### Future Enhancements
- Advanced autocomplete features
- Rich text input support
- Voice input integration
- Advanced validation rules
- Input analytics and tracking
