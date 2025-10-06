# Navigation Component Specification

## EARS Requirements

**EARS-UI-006**: The system shall display a responsive navigation menu with active page highlighting.

**EARS-UI-007**: The system shall provide mobile-friendly navigation with collapsible menu.

**EARS-UI-008**: The system shall show navigation breadcrumbs for deep page navigation.

**EARS-UI-009**: The system shall display quick action buttons for common tasks.

**EARS-UI-010**: The system shall provide keyboard navigation support for accessibility.

## Component Structure

### Navigation Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [Home] [Coach] [Tasks] [Nutrition] [Workouts] [Finance] [Rewards] │
├─────────────────────────────────────────────────────────────┤
│ Breadcrumbs: Home > Tasks > Today's Tasks                   │
└─────────────────────────────────────────────────────────────┘
```

### Mobile Navigation
```
┌─────────────────────────────────────────────────────────────┐
│ [☰] App Title                                    [🔔] [👤] │
├─────────────────────────────────────────────────────────────┤
│ [Home] [Coach] [Tasks] [Nutrition] [Workouts] [Finance] [Rewards] │
└─────────────────────────────────────────────────────────────┘
```

### Quick Actions Panel
```
┌─────────────────────────────────────────────────────────────┐
│ Quick Actions:                                              │
│ [➕ Add Task] [🍽️ Log Meal] [💧 Water] [📊 Progress]        │
└─────────────────────────────────────────────────────────────┘
```

## Technical Specifications

### Props Interface
```typescript
interface NavigationProps {
  activePage: string;
  onPageChange: (page: string) => void;
  breadcrumbs?: BreadcrumbItem[];
  showQuickActions?: boolean;
  onQuickAction?: (action: string) => void;
  isMobile?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType;
  color: string;
  shortcut?: string;
}
```

### State Management
```typescript
interface NavigationState {
  isMobileMenuOpen: boolean;
  isQuickActionsOpen: boolean;
  currentBreadcrumbs: BreadcrumbItem[];
  keyboardFocusIndex: number;
}
```

## Navigation Items

### Main Navigation
```typescript
const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    path: '/',
    shortcut: 'H'
  },
  {
    id: 'coach',
    label: 'Coach',
    icon: Bot,
    path: '/coach',
    shortcut: 'C'
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: CheckSquare,
    path: '/tasks',
    shortcut: 'T'
  },
  {
    id: 'nutrition',
    label: 'Nutrition',
    icon: Apple,
    path: '/nutrition',
    shortcut: 'N'
  },
  {
    id: 'workouts',
    label: 'Workouts',
    icon: Dumbbell,
    path: '/workouts',
    shortcut: 'W'
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    path: '/finance',
    shortcut: 'F'
  },
  {
    id: 'rewards',
    label: 'Rewards',
    icon: Gift,
    path: '/rewards',
    shortcut: 'R'
  }
];
```

### Quick Actions
```typescript
const quickActions = [
  {
    id: 'add-task',
    label: 'Add Task',
    icon: Plus,
    color: 'bg-blue-500',
    shortcut: 'Ctrl+T'
  },
  {
    id: 'log-meal',
    label: 'Log Meal',
    icon: Utensils,
    color: 'bg-green-500',
    shortcut: 'Ctrl+M'
  },
  {
    id: 'water-intake',
    label: 'Water',
    icon: Droplets,
    color: 'bg-cyan-500',
    shortcut: 'Ctrl+W'
  },
  {
    id: 'progress',
    label: 'Progress',
    icon: TrendingUp,
    color: 'bg-purple-500',
    shortcut: 'Ctrl+P'
  }
];
```

## Styling Requirements

### Color Scheme
- **Active Item**: #085492 (Ocean Blue)
- **Inactive Item**: #6B7280 (Gray 500)
- **Hover State**: #71E6DE (Mint Green)
- **Background**: #FFFFFF (White)
- **Border**: #E5E7EB (Gray 200)

### Responsive Design
- **Desktop**: Horizontal navigation with full labels
- **Tablet**: Condensed navigation with icons and labels
- **Mobile**: Collapsible hamburger menu with vertical layout

### Typography
- **Navigation Items**: sm font-semibold
- **Breadcrumbs**: xs font-medium
- **Quick Actions**: sm font-medium

## Interactive Elements

### Navigation
- Active page highlighting with bottom border
- Hover effects with color transitions
- Smooth page transitions
- Keyboard navigation with arrow keys

### Mobile Menu
- Slide-in animation from left
- Backdrop overlay with blur
- Touch-friendly tap targets
- Swipe gestures for closing

### Quick Actions
- Tooltip on hover showing shortcut
- Keyboard shortcut support
- Loading states for async actions
- Success/error feedback

## Data Sources

### Static Data
- Navigation menu structure
- Quick action definitions
- Breadcrumb configuration

### Dynamic Data
- Current active page
- User permissions for navigation items
- Breadcrumb trail based on current route

## Accessibility Requirements

### ARIA Labels
- Proper navigation landmarks
- Screen reader announcements for page changes
- Keyboard navigation indicators
- Focus management for mobile menu

### Keyboard Navigation
- Tab order through navigation items
- Arrow key navigation within menu
- Enter/Space to activate items
- Escape to close mobile menu

### Visual Indicators
- High contrast mode support
- Focus indicators for keyboard users
- Clear active state indication
- Touch target size compliance (44px minimum)

## Performance Considerations

### Optimization
- Memoize navigation item rendering
- Lazy load page components
- Debounce keyboard navigation
- Optimize mobile menu animations

### Loading States
- Skeleton loading for navigation
- Progressive enhancement for quick actions
- Graceful degradation for offline mode

## Testing Requirements

### Unit Tests
- Component rendering with different props
- Navigation item click handling
- Mobile menu toggle functionality
- Breadcrumb generation logic

### Integration Tests
- Page navigation flow
- Quick action execution
- Mobile menu interactions
- Keyboard navigation

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation flow
- Focus management
- Color contrast validation

## Implementation Notes

### Dependencies
- React Router for navigation
- Framer Motion for animations
- Lucide React for icons
- Tailwind CSS for styling

### Error Handling
- Graceful fallbacks for missing routes
- Error boundaries for navigation failures
- Loading states for async navigation

### Future Enhancements
- Search functionality in navigation
- Recent pages quick access
- Customizable navigation order
- Multi-language support
- Theme-based navigation styling
