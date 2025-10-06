# Pages Design Documentation

## Overview

This document provides comprehensive design specifications for all pages in the Diet Game application. The design system ensures consistency, accessibility, and optimal user experience across all pages while maintaining the oceanic color palette and gamification elements.

## Design System Foundation

### Color Palette
```typescript
const designTokens = {
  colors: {
    primary: '#085492',      // Ocean Blue - Main brand color
    secondary: '#71E6DE',    // Mint Green - Accent color
    success: '#10B981',      // Emerald 500 - Success states
    warning: '#F59E0B',      // Amber 500 - Warning states
    error: '#EF4444',        // Red 500 - Error states
    info: '#3B82F6',         // Blue 500 - Information states
    background: '#FFFFFF',   // White - Primary background
    surface: '#F9FAFB',      // Gray 50 - Card backgrounds
    border: '#E5E7EB',       // Gray 200 - Borders and dividers
    text: {
      primary: '#111827',    // Gray 900 - Primary text
      secondary: '#6B7280',  // Gray 500 - Secondary text
      disabled: '#9CA3AF'    // Gray 400 - Disabled text
    }
  }
};
```

### Typography Scale
```typescript
const typography = {
  title: 'text-3xl font-extrabold text-gray-900',
  heading: 'text-2xl font-bold text-gray-900',
  subheading: 'text-xl font-semibold text-gray-800',
  body: 'text-base font-normal text-gray-700',
  caption: 'text-sm font-medium text-gray-600',
  small: 'text-xs font-normal text-gray-500'
};
```

### Spacing System
```typescript
const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem'     // 64px
};
```

## Page Layout Architecture

### Common Layout Structure
```typescript
interface PageLayout {
  header: HeaderComponent;
  navigation: NavigationComponent;
  main: MainContentArea;
  sidebar?: SidebarComponent;
  footer?: FooterComponent;
}
```

### Responsive Breakpoints
```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large desktop
};
```

## Individual Page Designs

### 1. HomePage Design

#### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│                    Header Component                     │
├─────────────────────────────────────────────────────────┤
│  Navigation  │              Main Content                │
│              │  ┌─────────────────────────────────────┐  │
│              │  │         User Profile Card          │  │
│              │  └─────────────────────────────────────┘  │
│              │  ┌─────────────────────────────────────┐  │
│              │  │         Daily Dashboard            │  │
│              │  └─────────────────────────────────────┘  │
│              │  ┌─────────────────────────────────────┐  │
│              │  │         News Ticker                │  │
│              │  └─────────────────────────────────────┘  │
│              │  ┌─────────────────────────────────────┐  │
│              │  │         Quick Actions              │  │
│              │  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Design Components
- **User Profile Card**
  - Circular profile image with level badge
  - XP progress bar with animated fill
  - Current level and next level indicators
  - Daily streak counter with flame icon
  - Achievement badges carousel

- **Daily Dashboard**
  - Nutrition progress rings (calories, macros)
  - Water intake progress bar
  - Meal planning timeline
  - Goal completion indicators
  - Quick stats grid

- **News Ticker**
  - Horizontal scrolling content
  - Icon-based visual indicators
  - Color-coded message types
  - Smooth animation transitions
  - Click-to-action functionality

- **Quick Actions Panel**
  - Large, accessible buttons
  - Icon + text combinations
  - Hover and focus states
  - Loading state indicators
  - Success feedback animations

#### Visual Hierarchy
1. **Primary**: User profile and current status
2. **Secondary**: Daily progress and goals
3. **Tertiary**: News and quick actions
4. **Supporting**: Navigation and utilities

### 2. NutritionTrackingPage Design

#### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│                    Header Component                     │
├─────────────────────────────────────────────────────────┤
│  Navigation  │              Main Content                │
│              │  ┌─────────────────────────────────────┐  │
│              │  │         Food Search Bar            │  │
│              │  └─────────────────────────────────────┘  │
│              │  ┌─────────────────────────────────────┐  │
│              │  │         Meal Sections              │  │
│              │  │  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │  │
│              │  │  │Break│ │Lunch│ │Dinner│ │Snack│   │  │
│              │  │  └─────┘ └─────┘ └─────┘ └─────┘   │  │
│              │  └─────────────────────────────────────┘  │
│              │  ┌─────────────────────────────────────┐  │
│              │  │         Nutrition Summary          │  │
│              │  └─────────────────────────────────────┘  │
│              │  ┌─────────────────────────────────────┐  │
│              │  │         Progress Charts            │  │
│              │  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Design Components
- **Food Search Interface**
  - Prominent search bar with autocomplete
  - Filter and sort options
  - Recent foods quick access
  - Barcode scanner button
  - Camera capture button

- **Meal Organization**
  - Tabbed interface for meal types
  - Drag-and-drop food items
  - Portion size sliders
  - Nutritional information cards
  - Quick edit and delete actions

- **Nutrition Summary**
  - Circular progress indicators
  - Macro/micro nutrient breakdown
  - Goal vs. actual comparisons
  - Water intake tracking
  - Daily/weekly views

- **Progress Visualization**
  - Interactive charts and graphs
  - Trend analysis displays
  - Achievement progress bars
  - Historical data comparison
  - Export and sharing options

#### Visual Hierarchy
1. **Primary**: Food logging interface
2. **Secondary**: Current meal organization
3. **Tertiary**: Nutrition analysis and progress
4. **Supporting**: Historical data and trends

### 3. GamificationPage Design

#### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│                    Header Component                     │
├─────────────────────────────────────────────────────────┤
│  Navigation  │              Main Content                │
│              │  ┌─────────────────────────────────────┐  │
│              │  │         XP & Level Display         │  │
│              │  └─────────────────────────────────────┘  │
│              │  ┌─────────────────────────────────────┐  │
│              │  │         Achievement Gallery        │  │
│              │  └─────────────────────────────────────┘  │
│              │  ┌─────────────────────────────────────┐  │
│              │  │         Rewards Shop               │  │
│              │  └─────────────────────────────────────┘  │
│              │  ┌─────────────────────────────────────┐  │
│              │  │         Leaderboard                │  │
│              │  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Design Components
- **XP and Level Display**
  - Large level indicator with crown icon
  - Animated XP progress bar
  - Star rating system
  - Next level preview
  - Achievement celebration animations

- **Achievement Gallery**
  - Grid layout with achievement cards
  - Locked/unlocked visual states
  - Progress indicators for in-progress achievements
  - Category filtering options
  - Detailed achievement modals

- **Rewards Shop**
  - Product grid with images
  - Price display in XP/coins
  - Purchase confirmation modals
  - Inventory management
  - Special offer highlights

- **Leaderboard**
  - Top performers list
  - User's current position
  - Category-based rankings
  - Social sharing options
  - Challenge participation

#### Visual Hierarchy
1. **Primary**: Current level and XP status
2. **Secondary**: Available achievements and rewards
3. **Tertiary**: Social elements and leaderboards
4. **Supporting**: Progress tracking and statistics

### 4. AICoachPage Design

#### Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│                    Header Component                     │
├─────────────────────────────────────────────────────────┤
│  Navigation  │              Main Content                │
│              │  ┌─────────────────────────────────────┐  │
│              │  │         Chat Interface             │  │
│              │  │  ┌─────────────────────────────────┐ │  │
│              │  │  │         Message Area           │ │  │
│              │  │  └─────────────────────────────────┘ │  │
│              │  │  ┌─────────────────────────────────┐ │  │
│              │  │  │         Input Area             │ │  │
│              │  │  └─────────────────────────────────┘ │  │
│              │  └─────────────────────────────────────┘  │
│              │  ┌─────────────────────────────────────┐  │
│              │  │         AI Insights Panel         │  │
│              │  └─────────────────────────────────────┘  │
│              │  ┌─────────────────────────────────────┐  │
│              │  │         Goal Management            │  │
│              │  └─────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

#### Design Components
- **Chat Interface**
  - Message bubbles with distinct styling
  - Typing indicators and loading states
  - Quick reply suggestions
  - Message timestamps
  - File and image sharing support

- **AI Insights Panel**
  - Personalized recommendations
  - Progress analysis cards
  - Behavioral insights
  - Goal suggestions
  - Success celebrations

- **Goal Management**
  - SMART goal creation forms
  - Progress tracking visualizations
  - Milestone celebrations
  - Adjustment recommendations
  - Achievement predictions

#### Visual Hierarchy
1. **Primary**: Chat conversation interface
2. **Secondary**: AI insights and recommendations
3. **Tertiary**: Goal management and tracking
4. **Supporting**: Progress analytics and history

## Component Design Patterns

### Card Components
```typescript
const cardStyles = {
  base: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
  hover: 'hover:shadow-md transition-shadow duration-200',
  interactive: 'cursor-pointer hover:border-primary-300',
  elevated: 'shadow-lg border-0',
  outlined: 'border-2 border-primary-200 bg-primary-50'
};
```

### Button Components
```typescript
const buttonStyles = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
  secondary: 'bg-secondary-100 text-secondary-800 hover:bg-secondary-200',
  success: 'bg-success-600 text-white hover:bg-success-700',
  warning: 'bg-warning-600 text-white hover:bg-warning-700',
  error: 'bg-error-600 text-white hover:bg-error-700',
  ghost: 'bg-transparent text-primary-600 hover:bg-primary-50'
};
```

### Form Components
```typescript
const formStyles = {
  input: 'w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500',
  label: 'block text-sm font-medium text-gray-700 mb-1',
  error: 'text-error-600 text-sm mt-1',
  help: 'text-gray-500 text-sm mt-1'
};
```

## Animation and Interaction Design

### Micro-interactions
- **Hover Effects**: Subtle scale and shadow changes
- **Focus States**: Clear outline and color changes
- **Loading States**: Skeleton screens and progress indicators
- **Success Feedback**: Celebration animations and color changes
- **Error States**: Shake animations and error color indicators

### Page Transitions
- **Route Changes**: Smooth fade and slide transitions
- **Modal Openings**: Scale and fade animations
- **Content Loading**: Progressive disclosure with staggered animations
- **State Changes**: Smooth transitions between different states

### Performance Considerations
- **Lazy Loading**: Images and components loaded on demand
- **Virtual Scrolling**: For large lists and data sets
- **Debounced Interactions**: Search and input handling
- **Optimized Animations**: CSS transforms and GPU acceleration

## Accessibility Design

### Visual Accessibility
- **Color Contrast**: WCAG AA compliance (4.5:1 ratio)
- **Focus Indicators**: Clear, visible focus states
- **Text Scaling**: Support for 200% zoom without horizontal scrolling
- **Color Independence**: Information not conveyed by color alone

### Interaction Accessibility
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and roles
- **Touch Targets**: Minimum 44px touch target size
- **Motion Preferences**: Respect reduced motion settings

### Content Accessibility
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Alt Text**: Descriptive alternative text for images
- **Error Messages**: Clear, actionable error descriptions
- **Loading States**: Accessible loading indicators

## Responsive Design Strategy

### Mobile-First Approach
- **Base Styles**: Mobile-optimized layouts and interactions
- **Progressive Enhancement**: Additional features for larger screens
- **Touch Optimization**: Large touch targets and gesture support
- **Performance**: Optimized for mobile network conditions

### Breakpoint Strategy
- **Small (640px+)**: Enhanced mobile experience
- **Medium (768px+)**: Tablet-optimized layouts
- **Large (1024px+)**: Desktop layouts with sidebars
- **Extra Large (1280px+)**: Wide desktop optimizations

### Layout Adaptations
- **Navigation**: Collapsible mobile menu, expanded desktop navigation
- **Content**: Single column mobile, multi-column desktop
- **Modals**: Full-screen mobile, centered desktop
- **Tables**: Horizontal scroll mobile, full table desktop

## Design Quality Assurance

### Design Review Process
- **Visual Consistency**: Brand guidelines and design system compliance
- **User Experience**: Usability and accessibility validation
- **Technical Feasibility**: Implementation complexity assessment
- **Performance Impact**: Design element performance evaluation

### Testing Strategy
- **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge compatibility
- **Device Testing**: Mobile, tablet, desktop device validation
- **Accessibility Testing**: Screen reader and keyboard navigation testing
- **Performance Testing**: Load time and interaction responsiveness

### Maintenance and Updates
- **Design System Evolution**: Regular updates and improvements
- **Component Library**: Centralized component management
- **Documentation**: Up-to-date design specifications
- **Version Control**: Design asset versioning and change tracking
