# Modal Components Specification

## EARS Requirements

**EARS-UI-021**: The system shall display modal dialogs with backdrop overlay and focus management.

**EARS-UI-022**: The system shall provide confirmation dialogs with customizable actions and styling.

**EARS-UI-023**: The system shall show loading modals with progress indicators and cancellation options.

**EARS-UI-024**: The system shall display form modals with validation and submission handling.

**EARS-UI-025**: The system shall provide notification modals with auto-dismiss and action buttons.

## Component Structure

### Modal Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop Overlay]                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Modal Header]                              [Close X]  │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ [Modal Content]                                        │ │
│ │                                                         │ │
│ │                                                         │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ [Modal Footer] [Cancel] [Confirm]                      │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Confirmation Dialog Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop Overlay]                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Warning Icon] Confirm Action                           │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Are you sure you want to delete this item?             │ │
│ │ This action cannot be undone.                          │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ [Cancel] [Delete]                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Loading Modal Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Backdrop Overlay]                                          │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Spinner] Processing...                                 │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ Please wait while we process your request.             │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ [Progress Bar] 75%                                 │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ ├─────────────────────────────────────────────────────────┤ │
│ │ [Cancel]                                              │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Technical Specifications

### Props Interfaces

#### ModalProps
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  animation?: 'fade' | 'slide' | 'scale' | 'none';
}
```

#### ConfirmationModalProps
```typescript
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'error' | 'success';
  icon?: React.ComponentType;
  isLoading?: boolean;
  destructive?: boolean;
}
```

#### LoadingModalProps
```typescript
interface LoadingModalProps {
  isOpen: boolean;
  onCancel?: () => void;
  title: string;
  message: string;
  progress?: number; // 0-100
  showProgress?: boolean;
  cancellable?: boolean;
  cancelText?: string;
}
```

#### FormModalProps
```typescript
interface FormModalProps extends ModalProps {
  onSubmit: (data: any) => void | Promise<void>;
  onCancel: () => void;
  initialValues?: Record<string, any>;
  validationSchema?: z.ZodSchema;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  children: React.ReactNode;
}
```

#### NotificationModalProps
```typescript
interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  icon?: React.ComponentType;
  autoClose?: boolean;
  autoCloseDelay?: number; // milliseconds
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
}
```

## Modal Variants

### Size Variants
```typescript
const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
  full: 'max-w-full mx-4'
};
```

### Type Variants
```typescript
const modalTypes = {
  info: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  success: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  },
  error: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200'
  }
};
```

### Animation Variants
```typescript
const animationVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },
  slide: {
    initial: { y: '-100%', opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: '-100%', opacity: 0 }
  },
  scale: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 }
  }
};
```

## Styling Requirements

### Color Scheme
- **Backdrop**: rgba(0, 0, 0, 0.5)
- **Modal Background**: #FFFFFF (White)
- **Border**: #E5E7EB (Gray 200)
- **Text**: #111827 (Gray 900)
- **Secondary Text**: #6B7280 (Gray 500)
- **Primary Button**: #3B82F6 (Blue 500)
- **Danger Button**: #EF4444 (Red 500)

### Responsive Design
- **Desktop**: Centered modal with backdrop
- **Tablet**: Full-width modal with margins
- **Mobile**: Full-screen modal with swipe gestures

### Typography
- **Modal Title**: lg font-semibold
- **Modal Content**: base font-normal
- **Button Text**: sm font-medium
- **Helper Text**: sm font-normal

## Interactive Elements

### Modal Interactions
- Backdrop click to close
- Escape key to close
- Focus trap within modal
- Smooth open/close animations

### Button Interactions
- Loading states for async actions
- Disabled states for invalid forms
- Hover and focus effects
- Click ripple animations

### Gesture Support
- Swipe down to close on mobile
- Pinch to zoom for content
- Touch-friendly button sizes
- Haptic feedback for actions

## Focus Management

### Focus Trap
```typescript
const focusTrapConfig = {
  initialFocus: false, // Don't focus first element automatically
  fallbackFocus: 'modal-container', // Fallback if no focusable elements
  checkCanFocusTrap: (trapContainers: HTMLElement[]) => {
    return new Promise((resolve) => {
      // Check if modal is fully rendered
      setTimeout(() => resolve(trapContainers), 100);
    });
  }
};
```

### Focus Restoration
```typescript
const focusRestoration = {
  // Store the element that was focused before modal opened
  storeFocusedElement: () => {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      return activeElement;
    }
    return null;
  },
  
  // Restore focus to the stored element
  restoreFocusedElement: (element: HTMLElement | null) => {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }
};
```

## Data Sources

### Modal Data
- Modal configuration
- Form data for form modals
- Progress data for loading modals
- Notification content

### External Data
- API responses for async operations
- File upload progress
- Real-time updates
- User preferences

## Accessibility Requirements

### ARIA Labels
- Proper modal landmarks
- Screen reader announcements
- Focus management indicators
- Button state descriptions

### Keyboard Navigation
- Tab order within modal
- Escape key to close
- Enter/Space to activate buttons
- Arrow keys for navigation

### Visual Indicators
- High contrast mode support
- Focus indicators for all interactive elements
- Color-blind friendly status indicators
- Touch target size compliance

## Performance Considerations

### Optimization
- Lazy load modal content
- Memoize modal rendering
- Optimize animation performance
- Debounce backdrop clicks

### Memory Management
- Cleanup event listeners on unmount
- Cancel pending operations on close
- Clear form state on close
- Release focus trap on unmount

## Testing Requirements

### Unit Tests
- Modal rendering with different props
- Focus management functionality
- Animation state handling
- Button click handling

### Integration Tests
- Modal open/close flow
- Form submission in modals
- Confirmation dialog interactions
- Loading modal progress tracking

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation flow
- Focus management
- Color contrast validation

## Implementation Notes

### Dependencies
- Framer Motion for animations
- React Focus Trap for focus management
- React Hook Form for form modals
- Lucide React for icons

### Error Handling
- Graceful fallbacks for modal failures
- Error boundaries for modal content
- Network error handling
- Form validation error display

### Future Enhancements
- Modal stacking support
- Custom modal animations
- Modal templates and presets
- Advanced gesture support
- Modal analytics and tracking
