# Notification Components Specification

## EARS Requirements

**EARS-UI-026**: The system shall display toast notifications with auto-dismiss and manual dismissal options.

**EARS-UI-027**: The system shall show in-app notifications with action buttons and priority levels.

**EARS-UI-028**: The system shall provide push notification support with permission management.

**EARS-UI-029**: The system shall display notification badges with count indicators and animation effects.

**EARS-UI-030**: The system shall show notification center with grouped notifications and filtering options.

## Component Structure

### Toast Notification Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Icon] Notification Title                    [Close] [Time] │
│ Notification message content goes here...                   │
│ [Action Button] [Action Button]                            │
└─────────────────────────────────────────────────────────────┘
```

### In-App Notification Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [🔔] Notifications (3)                        [Mark All Read] │
├─────────────────────────────────────────────────────────────┤
│ [Icon] Task Completed Successfully              [2m ago]    │
│ You earned 50 points for completing your workout!          │
│ [View Details] [Dismiss]                                   │
├─────────────────────────────────────────────────────────────┤
│ [Icon] New Achievement Unlocked!                [5m ago]    │
│ Congratulations! You've reached Level 5!                   │
│ [Claim Reward] [Dismiss]                                   │
└─────────────────────────────────────────────────────────────┘
```

### Notification Badge Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [🔔] (3) - Bell icon with red badge showing count          │
│ [📧] (1) - Email icon with blue badge                      │
│ [🎯] (0) - Target icon with no badge (hidden)              │
└─────────────────────────────────────────────────────────────┘
```

## Technical Specifications

### Props Interfaces

#### ToastNotificationProps
```typescript
interface ToastNotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number; // milliseconds, 0 = no auto-dismiss
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  onClose?: () => void;
  persistent?: boolean;
  closable?: boolean;
}
```

#### InAppNotificationProps
```typescript
interface InAppNotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'achievement' | 'task' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }>;
  onMarkAsRead?: () => void;
  onDismiss?: () => void;
  metadata?: Record<string, any>;
}
```

#### NotificationBadgeProps
```typescript
interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  showZero?: boolean;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  animated?: boolean;
  pulse?: boolean;
  className?: string;
}
```

#### NotificationCenterProps
```typescript
interface NotificationCenterProps {
  notifications: InAppNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDismiss: (id: string) => void;
  onDismissAll: () => void;
  filter?: 'all' | 'unread' | 'priority';
  groupBy?: 'type' | 'date' | 'priority';
  maxHeight?: string;
  className?: string;
}
```

## Notification Types

### Toast Types
```typescript
const toastTypes = {
  success: {
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-500'
  },
  error: {
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    iconColor: 'text-red-500'
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    iconColor: 'text-yellow-500'
  },
  info: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-500'
  }
};
```

### Priority Levels
```typescript
const priorityLevels = {
  low: {
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  },
  medium: {
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  high: {
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  urgent: {
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    pulse: true
  }
};
```

### Notification Positions
```typescript
const notificationPositions = {
  'top-right': 'top-4 right-4',
  'top-left': 'top-4 left-4',
  'bottom-right': 'bottom-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
};
```

## Styling Requirements

### Color Scheme
- **Success**: #10B981 (Emerald 500)
- **Error**: #EF4444 (Red 500)
- **Warning**: #F59E0B (Amber 500)
- **Info**: #3B82F6 (Blue 500)
- **Background**: #FFFFFF (White)
- **Border**: #E5E7EB (Gray 200)
- **Text**: #111827 (Gray 900)
- **Secondary Text**: #6B7280 (Gray 500)

### Responsive Design
- **Desktop**: Fixed position notifications with hover effects
- **Tablet**: Touch-friendly notifications with swipe gestures
- **Mobile**: Full-width notifications with large touch targets

### Typography
- **Notification Title**: sm font-semibold
- **Notification Message**: sm font-normal
- **Action Button**: xs font-medium
- **Timestamp**: xs font-normal

## Interactive Elements

### Toast Interactions
- Auto-dismiss with countdown
- Manual dismissal with close button
- Click to dismiss (optional)
- Hover to pause auto-dismiss

### In-App Interactions
- Mark as read/unread
- Dismiss individual notifications
- Bulk actions (mark all read, dismiss all)
- Click to navigate to related content

### Badge Interactions
- Animated count updates
- Pulse animation for urgent notifications
- Hover effects for interactive badges
- Click to open notification center

## Animation System

### Toast Animations
```typescript
const toastAnimations = {
  enter: {
    opacity: [0, 1],
    y: [-20, 0],
    scale: [0.95, 1],
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    opacity: [1, 0],
    x: [0, 300],
    scale: [1, 0.95],
    transition: { duration: 0.2, ease: 'easeIn' }
  },
  slide: {
    x: [300, 0],
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};
```

### Badge Animations
```typescript
const badgeAnimations = {
  pulse: {
    scale: [1, 1.1, 1],
    transition: { duration: 1, repeat: Infinity, ease: 'easeInOut' }
  },
  bounce: {
    y: [0, -4, 0],
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  shake: {
    x: [0, -2, 2, -2, 2, 0],
    transition: { duration: 0.5, ease: 'easeInOut' }
  }
};
```

## Data Sources

### Real-time Data
- Notification updates from WebSocket
- Push notification payloads
- User interaction events
- System status updates

### Static Data
- Notification templates
- Icon mappings
- Color schemes
- Animation presets

## Accessibility Requirements

### ARIA Labels
- Proper notification landmarks
- Screen reader announcements
- Live regions for dynamic updates
- Button state descriptions

### Keyboard Navigation
- Tab order through notifications
- Enter/Space to activate actions
- Escape to dismiss notifications
- Arrow keys for notification center

### Visual Indicators
- High contrast mode support
- Focus indicators for interactive elements
- Color-blind friendly status indicators
- Motion reduction for accessibility

## Performance Considerations

### Optimization
- Debounce notification updates
- Memoize notification rendering
- Lazy load notification content
- Optimize animation performance

### Memory Management
- Cleanup expired notifications
- Limit notification history
- Efficient re-rendering
- Proper event listener cleanup

## Testing Requirements

### Unit Tests
- Notification rendering with different types
- Animation state management
- Auto-dismiss functionality
- Badge count calculations

### Integration Tests
- Notification flow end-to-end
- Push notification handling
- Notification center interactions
- Bulk action operations

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation flow
- Focus management
- Color contrast validation

## Implementation Notes

### Dependencies
- Framer Motion for animations
- React Hot Toast for toast notifications
- Web Push API for push notifications
- Lucide React for icons

### Error Handling
- Graceful fallbacks for notification failures
- Network error handling for push notifications
- Fallback for unsupported browsers
- Retry mechanisms for failed notifications

### Future Enhancements
- Rich media notifications
- Notification scheduling
- Custom notification sounds
- Advanced filtering and search
- Notification analytics
- Cross-device synchronization
