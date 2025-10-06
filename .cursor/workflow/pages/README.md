# Diet Game - Generated Pages Documentation

This document provides an overview of all the pages generated for the Diet Game application based on the specifications in the `.cursor/workflow/specs/` directory.

## Generated Pages

### 1. HomePage (`src/pages/HomePage.tsx`)
**Specification**: `.cursor/workflow/specs/homepage/requirements.md`  
**EARS Requirements**: EARS-001 through EARS-005

**Features**:
- Dashboard with 4 key metric cards (Days Score, Level, Fitness Score, Diet Coins)
- Star milestone system for Days Score
- XP progress bar for level progression
- News ticker with rotating tips and announcements
- Today's tasks with completion status and countdown timers
- Shopping list summary with nutrition metrics
- Recommended markets with contact information
- Real-time updates from Firestore
- Responsive design for mobile, tablet, and desktop

**Key Components**:
- `MetricCard` - Displays key statistics with animations
- `TaskCard` - Shows individual tasks with progress
- `ShoppingListSummary` - Displays shopping list overview
- `NewsTicker` - Rotating news and tips
- `XPProgressBar` - Animated progress indicator

### 2. NutritionTrackingPage (`src/pages/NutritionTrackingPage.tsx`)
**Specification**: `.cursor/workflow/specs/nutrition-tracking/requirements.md`  
**EARS Requirements**: EARS-006 through EARS-010

**Features**:
- Food logging with barcode scanning
- Macro and micronutrient tracking
- Meal planning and scheduling
- Nutrition goal setting and progress tracking
- Food database integration
- Photo-based food recognition
- Real-time nutrition calculations
- Offline support for food logging

**Key Components**:
- `FoodLogger` - Main food logging interface
- `NutritionChart` - Visual nutrition breakdown
- `MealPlanner` - Weekly meal planning
- `GoalTracker` - Nutrition goal progress
- `FoodDatabase` - Search and browse foods

### 3. AICoachPage (`src/pages/AICoachPage.tsx`)
**Specification**: `.cursor/workflow/specs/ai-coach-system/requirements.md`  
**EARS Requirements**: EARS-011 through EARS-015

**Features**:
- AI-powered meal recommendations
- Personalized coaching messages
- Goal-based advice and tips
- Progress analysis and insights
- Chat interface with AI coach
- Voice interaction support
- Contextual recommendations
- Learning from user behavior

**Key Components**:
- `AIChat` - Chat interface with AI coach
- `RecommendationEngine` - AI-powered suggestions
- `ProgressAnalyzer` - Data analysis and insights
- `VoiceInterface` - Voice interaction component
- `CoachingDashboard` - Overview of AI recommendations

### 4. GamificationPage (`src/pages/GamificationPage.tsx`)
**Specification**: `.cursor/workflow/specs/gamification-engine/requirements.md`  
**EARS Requirements**: EARS-016 through EARS-020

**Features**:
- XP system with level progression
- Achievement badges and rewards
- Quest system with daily/weekly challenges
- Leaderboards and social competition
- Reward shop with unlockable items
- Streak tracking and milestones
- Social sharing of achievements
- Customizable avatar and profile

**Key Components**:
- `XPProgressBar` - Level and XP display
- `AchievementGrid` - Badge collection
- `QuestList` - Available challenges
- `Leaderboard` - Social competition
- `RewardShop` - Unlockable items
- `AvatarCustomizer` - Profile customization

### 5. SocialCommunityPage (`src/pages/SocialCommunityPage.tsx`)
**Specification**: `.cursor/workflow/specs/social-community/requirements.md`  
**EARS Requirements**: EARS-021 through EARS-025

**Features**:
- Friend system with social connections
- Community feed with posts and updates
- Group challenges and team competitions
- Social sharing of progress and achievements
- Community forums and discussions
- Mentorship program
- Social accountability features
- Privacy controls and settings

**Key Components**:
- `SocialFeed` - Community posts and updates
- `FriendList` - Social connections
- `GroupChallenges` - Team competitions
- `CommunityForums` - Discussion boards
- `MentorshipProgram` - Mentor/mentee matching
- `PrivacySettings` - Social privacy controls

### 6. ProfilePage (`src/pages/ProfilePage.tsx`)
**Specification**: `.cursor/workflow/specs/profile/requirements.md`  
**EARS Requirements**: EARS-026 through EARS-030

**Features**:
- User profile management
- Settings and preferences
- Account information and security
- Data export and privacy controls
- Subscription and premium features
- Notification preferences
- Theme and appearance settings
- Help and support resources

**Key Components**:
- `ProfileEditor` - User information management
- `SettingsPanel` - Application preferences
- `SecuritySettings` - Account security
- `PrivacyControls` - Data privacy settings
- `SubscriptionManager` - Premium features
- `HelpCenter` - Support resources

## Page Integration

### Navigation Structure
All pages are integrated through the main navigation system:

```typescript
// Main navigation items
const navigationItems = [
  { id: 'home', label: 'Home', path: '/', component: HomePage },
  { id: 'nutrition', label: 'Nutrition', path: '/nutrition', component: NutritionTrackingPage },
  { id: 'ai-coach', label: 'AI Coach', path: '/ai-coach', component: AICoachPage },
  { id: 'gamification', label: 'Gamification', path: '/gamification', component: GamificationPage },
  { id: 'community', label: 'Community', path: '/community', component: SocialCommunityPage },
  { id: 'profile', label: 'Profile', path: '/profile', component: ProfilePage }
];
```

### State Management
All pages share common state through the Zustand store:

```typescript
// Shared state across all pages
interface AppState {
  user: UserProfile;
  progress: ProgressData;
  tasks: Task[];
  nutrition: NutritionData;
  gamification: GamificationData;
  social: SocialData;
}
```

### Common Features
All pages include:
- Responsive design for mobile, tablet, and desktop
- Real-time data synchronization with Firebase
- Offline support and data persistence
- Accessibility features (WCAG 2.1 AA compliance)
- Performance optimization and lazy loading
- Error handling and loading states
- Consistent styling with Tailwind CSS

## Development Guidelines

### Adding New Pages
1. Create page component in `src/pages/`
2. Add to navigation in `MainNavigation.tsx`
3. Add route in `AppWithPages.tsx`
4. Update store types if needed
5. Add page documentation to this file

### Modifying Existing Pages
1. Edit the specific page component
2. Update mock data as needed
3. Test changes thoroughly
4. Update documentation
5. Ensure responsive design works

### Page Testing
Each page should have:
- Unit tests for component logic
- Integration tests for data flow
- Accessibility tests for WCAG compliance
- Visual tests for responsive design
- Performance tests for loading times

## Performance Considerations

### Code Splitting
Pages are lazy-loaded to improve initial bundle size:

```typescript
const HomePage = lazy(() => import('./pages/HomePage'));
const NutritionPage = lazy(() => import('./pages/NutritionTrackingPage'));
```

### Data Loading
- Implement skeleton loading states
- Use React Query for server state management
- Cache frequently accessed data
- Implement optimistic updates

### Bundle Optimization
- Tree-shake unused code
- Use dynamic imports for heavy components
- Optimize images and assets
- Monitor bundle size with each change

## Accessibility Features

### WCAG 2.1 AA Compliance
- Proper heading hierarchy
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance
- Focus management

### Mobile Optimization
- Touch-friendly interface elements
- Responsive design patterns
- Mobile-specific interactions
- Performance optimization for mobile devices

## Future Enhancements

### Planned Features
- Advanced analytics dashboard
- AR recipe visualization
- Voice-controlled navigation
- Advanced personalization
- Multi-language support
- Advanced social features

### Performance Improvements
- Service worker implementation
- Advanced caching strategies
- Image optimization
- Bundle size reduction
- Loading performance optimization

---

*This documentation is maintained as part of the Diet Game SDD workflow. For the most up-to-date information, always refer to the latest version in the repository.*