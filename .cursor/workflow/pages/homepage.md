# HomePage Documentation

## Overview

The HomePage serves as the main dashboard and central hub of the Diet Game application. It provides users with a comprehensive overview of their daily progress, upcoming tasks, and quick access to key features.

## EARS Requirements

**EARS-HOME-001**: The system shall display a dashboard with four metric cards showing user progress.

**EARS-HOME-002**: The system shall show a news ticker with dynamic content updates.

**EARS-HOME-003**: The system shall display today's task list with completion status.

**EARS-HOME-004**: The system shall show shopping list with nutrition metrics and recommended markets.

**EARS-HOME-005**: The system shall update all content in real-time based on user actions.

## Page Structure

### Header Section
- **Application Title**: "NutriQuest" branding
- **Current Time**: Day and time display
- **User Welcome**: Personalized greeting with username
- **Diet Type**: Current diet preference display

### Dashboard Metrics (4-Column Grid)

#### 1. Days Score Card with Stars
- **Icon**: Calendar icon with blue theme
- **Primary Value**: Current score points
- **Star System**: 5-star milestone display
- **Progress Indicator**: Points remaining to next star
- **Visual Elements**: 
  - Filled stars for achieved milestones
  - Gray stars for unachieved milestones
  - Progress text showing remaining points

#### 2. Level Card with XP Progress
- **Icon**: Trophy icon with green theme
- **Primary Value**: Current level number
- **Body Type**: User's body type display
- **XP Progress Bar**: Animated progress bar
- **Progress Text**: Current XP / Required XP format
- **Visual Elements**:
  - Animated progress bar with green color
  - Level number prominently displayed
  - Body type in top-right corner

#### 3. Fitness Score Card
- **Icon**: Activity icon with orange theme
- **Primary Value**: Fitness score (0-100)
- **Purpose**: Overall fitness assessment
- **Visual Elements**:
  - Orange color scheme
  - Activity icon representation

#### 4. Diet Coins Card
- **Icon**: Coins icon with yellow theme
- **Primary Value**: Current coin balance
- **Purpose**: Virtual currency display
- **Visual Elements**:
  - Yellow color scheme
  - Coins icon representation

### News Ticker
- **Location**: Below dashboard metrics
- **Content**: Rotating news items with 4-second intervals
- **Items Include**:
  - Recipe suggestions
  - Achievement notifications
  - Shopping reminders
  - Progress milestones
  - Motivational messages
- **Visual Elements**:
  - Gradient background (blue to green)
  - White text with icons
  - Smooth transitions between items

### Weekly Focus Section (2-Column Grid)

#### Left Column: Today's Plan
- **Header**: "Today's Plan" title
- **Content**: Task list with completion status
- **Task Items**:
  - Task name and description
  - Scheduled time
  - Task type (Meal, Shopping, Cooking)
  - Completion status
  - XP rewards
- **Interactive Elements**:
  - Complete button for unfinished tasks
  - Visual feedback for completed tasks
  - XP reward display

#### Right Column: Shopping List
- **Header**: "Shopping List" title
- **Nutrition Metrics Grid**:
  - Items count
  - Total weight
  - Total price
  - Total calories
- **Nutrition Breakdown**:
  - Protein content
  - Fats content
  - Carbs content
- **Recommended Markets**:
  - Market name and location
  - Contact information
  - Specialization reason
  - Action buttons (call, website)

## Component Architecture

### Main Components

#### DaysCardWithStars
```typescript
interface DaysCardWithStarsProps {
  score: number;
}
```
- Displays current score with star milestones
- Shows progress to next star
- Uses star rating system (1-5 stars)

#### LevelCardWithXP
```typescript
interface LevelCardWithXPProps {
  level: number;
  currentXP: number;
  bodyType: string;
}
```
- Shows current level and XP progress
- Displays body type information
- Includes animated progress bar

#### DashboardCard
```typescript
interface DashboardCardProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string | number;
  bgColor?: string;
  textColor?: string;
}
```
- Generic card component for metrics
- Customizable colors and icons
- Consistent styling across cards

#### NewsTicker
```typescript
interface NewsTickerProps {}
```
- Rotating news items display
- 4-second interval rotation
- Gradient background styling

#### TaskList
```typescript
interface TaskListProps {}
```
- Today's tasks display
- Task completion functionality
- XP reward tracking

#### ShoppingList
```typescript
interface ShoppingListProps {}
```
- Shopping metrics display
- Nutrition breakdown
- Recommended markets

## Data Flow

### State Management
- **Zustand Store**: Global state management
- **Real-time Updates**: Firebase integration
- **Local State**: Component-specific state
- **Optimistic Updates**: Immediate UI feedback

### Data Sources
- **User Progress**: From Zustand store
- **User Profile**: From Zustand store
- **Task Data**: Mock data (to be replaced with API)
- **Shopping Data**: Mock data (to be replaced with API)
- **News Items**: Static data with rotation

### Update Triggers
- **Task Completion**: Updates progress and XP
- **Time Changes**: Updates news ticker
- **User Actions**: Triggers real-time updates
- **External Events**: Firebase listeners

## Styling and Theming

### Color Palette
- **Primary Blue**: #085492 (Ocean Blue)
- **Secondary Green**: #71E6DE (Mint Green)
- **Accent Brown**: #998B73 (Warm Brown)
- **Background**: #EDF0F2 (Light Gray)
- **Text**: #374151 (Dark Gray)

### Component Styling
- **Cards**: White background with shadow
- **Borders**: Light gray borders
- **Rounded Corners**: 12px border radius
- **Spacing**: Consistent 6-unit spacing
- **Typography**: Inter font family

### Responsive Design
- **Mobile**: Single column layout
- **Tablet**: 2-column grid for metrics
- **Desktop**: 4-column grid for metrics
- **Large Screens**: 2-column grid for focus section

## Interactive Features

### Task Completion
- **Click Handler**: Complete task button
- **Visual Feedback**: Green background for completed tasks
- **XP Rewards**: Display earned XP
- **Progress Updates**: Real-time progress updates

### Navigation
- **Quick Actions**: Direct access to other pages
- **Breadcrumbs**: Clear navigation path
- **Back Button**: Return to previous state

### Real-time Updates
- **Live Data**: Firebase real-time listeners
- **Progress Bars**: Animated progress updates
- **Notifications**: Achievement notifications
- **Status Updates**: Real-time status changes

## Performance Considerations

### Optimization Strategies
- **Memoization**: Expensive calculations memoized
- **Lazy Loading**: Components loaded on demand
- **Efficient Re-renders**: Selective state subscriptions
- **Bundle Splitting**: Code splitting for performance

### Loading States
- **Initial Load**: Loading spinner with message
- **Error States**: Error message with retry option
- **Empty States**: Helpful empty state messages
- **Skeleton Loading**: Placeholder content during load

## Accessibility Features

### ARIA Support
- **Labels**: Proper ARIA labels for all elements
- **Roles**: Semantic HTML roles
- **Descriptions**: Screen reader descriptions
- **Navigation**: Keyboard navigation support

### Visual Accessibility
- **Color Contrast**: WCAG AA compliant colors
- **Focus Indicators**: Clear focus states
- **Text Size**: Readable text sizes
- **Icon Labels**: Text alternatives for icons

## Testing Requirements

### Unit Tests
- Component rendering tests
- Props validation tests
- State management tests
- Event handler tests

### Integration Tests
- Task completion flow
- Real-time updates
- Navigation between pages
- Data synchronization

### E2E Tests
- Complete user journey
- Cross-browser compatibility
- Mobile responsiveness
- Performance benchmarks

## Future Enhancements

### Planned Features
- **Customizable Dashboard**: User-configurable widgets
- **Advanced Analytics**: Detailed progress charts
- **Social Integration**: Friend activity feeds
- **AI Recommendations**: Personalized suggestions

### Technical Improvements
- **Offline Support**: Offline task completion
- **Push Notifications**: Real-time notifications
- **Progressive Web App**: PWA features
- **Advanced Caching**: Intelligent data caching

## Implementation Notes

### Development Approach
- **Spec-Driven Development**: Following EARS requirements
- **Component-First**: Reusable component architecture
- **Type Safety**: Full TypeScript implementation
- **Testing**: Comprehensive test coverage

### Code Quality
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking
- **Documentation**: Comprehensive code documentation

---

*This documentation is maintained as part of the Diet Game SDD workflow. For the most up-to-date information, always refer to the latest version in the repository.*
