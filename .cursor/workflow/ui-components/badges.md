# Badge Components Specification

## EARS Requirements

**EARS-UI-056**: The system shall display status badges with color-coded indicators and text labels.

**EARS-UI-057**: The system shall provide notification badges with count indicators and animation effects.

**EARS-UI-058**: The system shall show achievement badges with unlock animations and rarity indicators.

**EARS-UI-059**: The system shall display skill badges with progress indicators and level information.

**EARS-UI-060**: The system shall provide category badges with filtering and selection capabilities.

## Component Structure

### Status Badge Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Status Badge]                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [●] Active                                             │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Notification Badge Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Notification Badge]                                       │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [🔔] (3)                                               │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Achievement Badge Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Achievement Badge]                                        │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [🏆] First Workout                                     │ │
│ │ [Rare] [Unlocked]                                      │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Technical Specifications

### Props Interfaces

#### BadgeProps
```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'pill' | 'square';
  icon?: React.ComponentType;
  iconPosition?: 'left' | 'right';
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
  'aria-label'?: string;
}
```

#### NotificationBadgeProps
```typescript
interface NotificationBadgeProps {
  count: number;
  maxCount?: number;
  showZero?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  animated?: boolean;
  pulse?: boolean;
  className?: string;
}
```

#### AchievementBadgeProps
```typescript
interface AchievementBadgeProps {
  title: string;
  description?: string;
  icon: React.ComponentType;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isUnlocked: boolean;
  progress?: number; // 0-100
  unlockedAt?: Date;
  onClaim?: () => void;
  animated?: boolean;
  className?: string;
}
```

#### SkillBadgeProps
```typescript
interface SkillBadgeProps {
  skill: string;
  level: number;
  experience: number;
  maxExperience: number;
  icon?: React.ComponentType;
  showProgress?: boolean;
  animated?: boolean;
  className?: string;
}
```

#### CategoryBadgeProps
```typescript
interface CategoryBadgeProps {
  category: string;
  count?: number;
  selected?: boolean;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}
```

## Badge Variants

### Status Variants
```typescript
const statusVariants = {
  default: {
    background: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200'
  },
  primary: {
    background: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200'
  },
  secondary: {
    background: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200'
  },
  success: {
    background: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200'
  },
  warning: {
    background: 'bg-yellow-100',
    text: 'text-yellow-800',
    border: 'border-yellow-200'
  },
  danger: {
    background: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200'
  },
  info: {
    background: 'bg-cyan-100',
    text: 'text-cyan-800',
    border: 'border-cyan-200'
  }
};
```

### Size Variants
```typescript
const sizeVariants = {
  xs: {
    padding: 'px-1.5 py-0.5',
    fontSize: 'text-xs',
    iconSize: 'w-3 h-3'
  },
  sm: {
    padding: 'px-2 py-1',
    fontSize: 'text-sm',
    iconSize: 'w-4 h-4'
  },
  md: {
    padding: 'px-2.5 py-1.5',
    fontSize: 'text-sm',
    iconSize: 'w-4 h-4'
  },
  lg: {
    padding: 'px-3 py-2',
    fontSize: 'text-base',
    iconSize: 'w-5 h-5'
  }
};
```

### Shape Variants
```typescript
const shapeVariants = {
  rounded: 'rounded-md',
  pill: 'rounded-full',
  square: 'rounded-none'
};
```

### Rarity Variants
```typescript
const rarityVariants = {
  common: {
    background: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-300',
    glow: 'shadow-gray-200'
  },
  rare: {
    background: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-300',
    glow: 'shadow-blue-200'
  },
  epic: {
    background: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-300',
    glow: 'shadow-purple-200'
  },
  legendary: {
    background: 'bg-gradient-to-r from-yellow-100 to-orange-100',
    text: 'text-yellow-800',
    border: 'border-yellow-300',
    glow: 'shadow-yellow-200'
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
- **Background**: #FFFFFF (White)
- **Border**: #E5E7EB (Gray 200)

### Responsive Design
- **Desktop**: Full badge with hover effects
- **Tablet**: Touch-friendly badge sizes
- **Mobile**: Optimized badge layouts for small screens

### Typography
- **Badge Text**: sm font-medium
- **Count Text**: xs font-bold
- **Achievement Title**: sm font-semibold
- **Description**: xs font-normal

## Interactive Elements

### Badge Interactions
- Hover effects with subtle elevation
- Click handlers for interactive badges
- Remove button functionality
- Selection state management

### Notification Interactions
- Animated count updates
- Pulse animation for urgent notifications
- Click to view notifications
- Hover effects for interactive badges

### Achievement Interactions
- Unlock animation sequences
- Claim reward functionality
- Progress indicator updates
- Rarity-based visual effects

## Animation System

### Badge Animations
```typescript
const badgeAnimations = {
  enter: {
    scale: [0, 1],
    opacity: [0, 1],
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  exit: {
    scale: [1, 0],
    opacity: [1, 0],
    transition: { duration: 0.15, ease: 'easeIn' }
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.2, ease: 'easeOut' }
  }
};
```

### Notification Animations
```typescript
const notificationAnimations = {
  pulse: {
    scale: [1, 1.2, 1],
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

### Achievement Animations
```typescript
const achievementAnimations = {
  unlock: {
    scale: [0, 1.2, 1],
    rotate: [0, 360],
    transition: { duration: 0.8, ease: 'easeOut' }
  },
  glow: {
    boxShadow: [
      '0 0 0 0 rgba(59, 130, 246, 0.7)',
      '0 0 0 10px rgba(59, 130, 246, 0)',
      '0 0 0 0 rgba(59, 130, 246, 0)'
    ],
    transition: { duration: 1.5, repeat: Infinity, ease: 'easeOut' }
  }
};
```

## Data Sources

### Badge Data
- Status information
- Notification counts
- Achievement progress
- User skill levels

### External Data
- Real-time updates
- User interaction events
- Achievement unlocks
- Progress tracking

## Accessibility Requirements

### ARIA Labels
- Proper badge landmarks
- Screen reader descriptions
- Count announcements
- Status indicators

### Keyboard Navigation
- Tab order through interactive badges
- Enter/Space for badge selection
- Escape to clear selections
- Arrow key navigation for badge groups

### Visual Indicators
- High contrast mode support
- Color-blind friendly indicators
- Clear status indication
- Touch target compliance

## Performance Considerations

### Optimization
- Memoize badge rendering
- Optimize animation performance
- Efficient count updates
- Lazy load badge content

### Memory Management
- Cleanup animation timers
- Cancel pending operations
- Optimize re-renders
- Efficient state management

## Testing Requirements

### Unit Tests
- Badge rendering with different props
- Animation state management
- Count calculations
- Interaction handling

### Integration Tests
- Badge interaction flows
- Notification updates
- Achievement unlocks
- Progress tracking

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- Focus management

## Implementation Notes

### Dependencies
- Framer Motion for animations
- Lucide React for icons
- Tailwind CSS for styling
- React Spring for smooth transitions

### Error Handling
- Graceful fallbacks for missing data
- Animation error handling
- Network error feedback
- Retry mechanisms

### Future Enhancements
- Advanced badge customization
- Badge templates and presets
- Badge analytics tracking
- Multi-language support
- Advanced animation effects
- Badge sharing functionality
