# Header Component Specification

## EARS Requirements

**EARS-UI-001**: The system shall display a header with app title and user status information.

**EARS-UI-002**: The system shall show real-time status panel with current time, diet type, next meal, and workout information.

**EARS-UI-003**: The system shall provide user dropdown menu with profile and settings access.

**EARS-UI-004**: The system shall display navigation menu with active page highlighting.

**EARS-UI-005**: The system shall show task completion badges and reward notifications.

## Component Structure

### Header Layout
```
┌─────────────────────────────────────────────────────────────┐
│ [App Title]                    [Status Panel] [User Menu]   │
├─────────────────────────────────────────────────────────────┤
│ [Home] [Coach] [Tasks] [Nutrition] [Workouts] [Finance] [Rewards] │
└─────────────────────────────────────────────────────────────┘
```

### Status Panel Components
- **Time Display**: Current day and time
- **Diet Type**: User's current diet (e.g., "Keto")
- **Next Meal**: Countdown to next scheduled meal
- **Workout**: Next workout time or completion status
- **Next Plan**: Days until next planning session

### User Menu Items
```
Account Section:
├── Profile
├── Account Upgrade
├── Privacy
└── Sign Out

Diet & Preferences:
├── Diet Type
└── Food Preferences

Financial:
└── Budget

Health Data:
├── Health Metrics
├── Workout Plan
├── Progress Reports
└── Media (Body & Food Photos)

Game:
├── Goals & Targets
└── Score Board
```

## Technical Specifications

### Props Interface
```typescript
interface HeaderProps {
  currentDayTime: {
    day: string;
    time: string;
  };
  daysUntilNextPlan: number;
  dietType: string;
  nextCookingTime: {
    isPending: boolean;
    timeString: string;
    minutesRemaining: number;
    isPast?: boolean;
  };
  nextWorkoutTime: {
    isPending: boolean;
    timeString: string;
  };
  userName: string;
  activePage: string;
  onPageChange: (page: string) => void;
  onUserMenuClick: (item: string, title: string) => void;
}
```

### State Management
```typescript
interface HeaderState {
  isUserMenuOpen: boolean;
  isLanguageMenuOpen: boolean;
  currentLanguage: string;
}
```

## Styling Requirements

### Color Scheme
- **Background**: #085492 (Ocean Blue)
- **Secondary**: #71E6DE (Mint Green)
- **Text**: White (#FFFFFF)
- **Accent**: #998B73 (Warm Brown)

### Responsive Design
- **Desktop**: Full status panel visible
- **Tablet**: Condensed status panel
- **Mobile**: Hidden status panel, icon-only navigation

### Typography
- **Title**: 3xl font-extrabold
- **Navigation**: sm font-semibold
- **Status**: xs font-medium

## Interactive Elements

### Navigation
- Active page highlighting with bottom border
- Hover effects for inactive pages
- Smooth transitions between pages

### User Menu
- Dropdown with grouped sections
- Click outside to close
- Keyboard navigation support

### Status Panel
- Real-time time updates
- Color-coded status indicators
- Responsive visibility

## Data Sources

### Real-time Data
- Current time (updated every 5 seconds)
- Task countdown timers
- User progress status

### Static Data
- Navigation menu items
- User menu structure
- App configuration

## Accessibility Requirements

### ARIA Labels
- Proper labeling for all interactive elements
- Screen reader support for status information
- Keyboard navigation indicators

### Visual Indicators
- High contrast mode support
- Focus indicators for keyboard users
- Color-blind friendly status indicators

## Performance Considerations

### Optimization
- Memoize status calculations
- Debounce time updates
- Lazy load user menu content

### Real-time Updates
- Efficient interval management
- Proper cleanup on unmount
- Minimal re-renders

## Testing Requirements

### Unit Tests
- Component rendering
- Props handling
- State management

### Integration Tests
- Navigation functionality
- User menu interactions
- Real-time updates

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation
- Color contrast validation

## Implementation Notes

### Dependencies
- React Hooks (useState, useEffect, useRef)
- Lucide React icons
- Tailwind CSS classes

### Error Handling
- Graceful fallbacks for missing data
- Error boundaries for component failures
- Loading states for async operations

### Future Enhancements
- Notification badges
- Quick action buttons
- Theme switching
- Multi-language support
