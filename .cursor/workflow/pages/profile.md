# ProfilePage Documentation

## Overview

The ProfilePage provides users with comprehensive account management, settings configuration, and personal information management. It serves as the central hub for user preferences, privacy settings, and account customization within the Diet Game application.

## EARS Requirements

**EARS-PROF-001**: The system shall display user profile information with editable fields.

**EARS-PROF-002**: The system shall provide account settings and privacy controls.

**EARS-PROF-003**: The system shall show progress statistics and achievement history.

**EARS-PROF-004**: The system shall offer data export and account management options.

**EARS-PROF-005**: The system shall provide notification preferences and app customization.

## Page Structure

### Header Section
- **Page Title**: "Profile & Settings"
- **User Avatar**: Profile picture with edit option
- **Quick Stats**: Level, XP, and achievement summary
- **Edit Mode Toggle**: Switch between view and edit modes

### Main Content (3-Column Layout)

#### Left Column: Profile Information
- **Personal Details**: Name, email, phone, date of birth
- **Health Information**: Body measurements, health goals
- **Dietary Preferences**: Diet type, allergies, restrictions
- **Fitness Information**: Activity level, exercise preferences
- **Profile Picture**: Avatar with upload/edit functionality

#### Center Column: Settings and Preferences
- **Account Settings**: Password, email, phone updates
- **Privacy Settings**: Data sharing, visibility controls
- **Notification Preferences**: Push, email, SMS settings
- **App Customization**: Theme, language, display options
- **Data Management**: Export, import, delete options

#### Right Column: Progress and Statistics
- **Progress Overview**: Level, XP, achievements summary
- **Statistics**: Detailed progress analytics
- **Achievement History**: Completed achievements timeline
- **Goal Tracking**: Current and historical goals
- **Performance Metrics**: Success rates and trends

### Detailed Sections

#### Profile Information
- **Personal Details**:
  - **Name**: First and last name
  - **Email**: Primary email address
  - **Phone**: Contact phone number
  - **Date of Birth**: Birth date for age calculations
  - **Gender**: Gender identity
  - **Location**: General location (optional)

- **Health Information**:
  - **Height**: Current height measurement
  - **Weight**: Current weight measurement
  - **Body Type**: Ectomorph, mesomorph, endomorph
  - **Health Conditions**: Medical conditions (optional)
  - **Medications**: Current medications (optional)
  - **Health Goals**: Primary health objectives

- **Dietary Preferences**:
  - **Diet Type**: Vegetarian, vegan, keto, paleo, etc.
  - **Allergies**: Food allergies and intolerances
  - **Restrictions**: Dietary restrictions and preferences
  - **Favorite Foods**: Preferred food items
  - **Disliked Foods**: Foods to avoid
  - **Cooking Skill**: Cooking experience level

#### Settings and Preferences
- **Account Settings**:
  - **Password Change**: Secure password update
  - **Email Verification**: Email confirmation status
  - **Phone Verification**: Phone number confirmation
  - **Two-Factor Authentication**: Security enhancement
  - **Account Deletion**: Account removal option

- **Privacy Settings**:
  - **Profile Visibility**: Public/private profile settings
  - **Data Sharing**: Analytics and research participation
  - **Social Features**: Community interaction preferences
  - **Location Sharing**: Location-based features
  - **Data Retention**: Data storage preferences

- **Notification Preferences**:
  - **Push Notifications**: Mobile push notification settings
  - **Email Notifications**: Email notification preferences
  - **SMS Notifications**: Text message notifications
  - **Reminder Settings**: Meal and activity reminders
  - **Achievement Notifications**: Progress celebration alerts

- **App Customization**:
  - **Theme Selection**: Light/dark theme options
  - **Language**: Multi-language support
  - **Display Units**: Metric/imperial units
  - **Date Format**: Date display preferences
  - **Accessibility**: Accessibility feature toggles

#### Progress and Statistics
- **Progress Overview**:
  - **Current Level**: User's current level
  - **XP Progress**: Experience points and progress
  - **Star Rating**: Achievement star rating
  - **Streak Counter**: Current streak length
  - **Total Achievements**: Completed achievements count

- **Statistics Dashboard**:
  - **Daily Averages**: Average daily metrics
  - **Weekly Trends**: Weekly progress trends
  - **Monthly Goals**: Monthly objective tracking
  - **Success Rates**: Goal achievement rates
  - **Improvement Areas**: Areas for optimization

- **Achievement History**:
  - **Timeline View**: Chronological achievement display
  - **Category Breakdown**: Achievement categories
  - **Rarity Distribution**: Achievement rarity analysis
  - **Recent Achievements**: Latest unlocked achievements
  - **Upcoming Milestones**: Next achievable goals

## Component Architecture

### Main Components

#### ProfileInformation
```typescript
interface ProfileInformationProps {
  userProfile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  isEditing: boolean;
  onEditToggle: () => void;
}
```
- Profile information display and editing
- Form validation and submission
- Image upload functionality
- Real-time updates

#### SettingsPanel
```typescript
interface SettingsPanelProps {
  settings: UserSettings;
  onUpdate: (updates: Partial<UserSettings>) => void;
  onExport: () => void;
  onDelete: () => void;
}
```
- Settings configuration interface
- Data export functionality
- Account management options
- Privacy controls

#### ProgressStatistics
```typescript
interface ProgressStatisticsProps {
  progress: UserProgress;
  statistics: UserStatistics;
  achievements: Achievement[];
  goals: Goal[];
}
```
- Progress visualization
- Statistics display
- Achievement timeline
- Goal tracking

### Data Models

#### UserProfile
```typescript
interface UserProfile {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    location?: string;
  };
  healthInfo: {
    height?: number;
    weight?: number;
    bodyType?: string;
    healthConditions?: string[];
    medications?: string[];
    healthGoals?: string[];
  };
  dietaryPreferences: {
    dietType: string;
    allergies?: string[];
    restrictions?: string[];
    favoriteFoods?: string[];
    dislikedFoods?: string[];
    cookingSkill?: string;
  };
  fitnessInfo: {
    activityLevel?: string;
    exercisePreferences?: string[];
    fitnessGoals?: string[];
  };
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### UserSettings
```typescript
interface UserSettings {
  account: {
    emailVerified: boolean;
    phoneVerified: boolean;
    twoFactorEnabled: boolean;
  };
  privacy: {
    profileVisibility: 'public' | 'private';
    dataSharing: boolean;
    socialFeatures: boolean;
    locationSharing: boolean;
  };
  notifications: {
    pushNotifications: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    reminders: boolean;
    achievements: boolean;
  };
  customization: {
    theme: 'light' | 'dark';
    language: string;
    units: 'metric' | 'imperial';
    dateFormat: string;
    accessibility: AccessibilitySettings;
  };
}
```

#### UserStatistics
```typescript
interface UserStatistics {
  dailyAverages: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    water: number;
    steps: number;
  };
  weeklyTrends: {
    calories: TrendData[];
    protein: TrendData[];
    carbs: TrendData[];
    fat: TrendData[];
    water: TrendData[];
  };
  monthlyGoals: {
    calories: GoalProgress;
    protein: GoalProgress;
    carbs: GoalProgress;
    fat: GoalProgress;
    water: GoalProgress;
  };
  successRates: {
    dailyGoals: number;
    weeklyGoals: number;
    monthlyGoals: number;
    overall: number;
  };
}
```

## Data Flow

### State Management
- **Zustand Store**: Global user state
- **Local State**: Component-specific state
- **Real-time Updates**: Firebase synchronization
- **Optimistic Updates**: Immediate UI feedback

### Data Sources
- **User Profile**: Firebase user documents
- **Settings**: Firebase settings collection
- **Progress Data**: Firebase progress collection
- **Statistics**: Firebase analytics data
- **Achievements**: Firebase achievements collection

### Update Triggers
- **Profile Updates**: Updates user information
- **Settings Changes**: Updates application settings
- **Progress Updates**: Updates statistics and progress
- **Achievement Unlocks**: Updates achievement history
- **Goal Changes**: Updates goal tracking

## Interactive Features

### Profile Management
- **Edit Mode**: Toggle between view and edit modes
- **Form Validation**: Real-time form validation
- **Image Upload**: Profile picture upload functionality
- **Auto-save**: Automatic saving of changes
- **Undo/Redo**: Change history management

### Settings Configuration
- **Toggle Switches**: Easy setting toggles
- **Dropdown Menus**: Selection-based settings
- **Slider Controls**: Range-based settings
- **Color Pickers**: Theme customization
- **File Uploads**: Data import functionality

### Data Management
- **Export Options**: Multiple export formats
- **Import Functionality**: Data import capabilities
- **Backup Creation**: Automatic data backups
- **Data Deletion**: Secure data removal
- **Account Deletion**: Complete account removal

### Progress Visualization
- **Interactive Charts**: Clickable data visualizations
- **Drill-down Analysis**: Detailed breakdowns
- **Trend Analysis**: Historical trend visualization
- **Comparison Tools**: Period comparisons
- **Export Charts**: Chart export functionality

## Styling and Theming

### Profile Section
- **Avatar Display**: Large profile picture display
- **Information Cards**: Clean information cards
- **Edit Indicators**: Visual edit mode indicators
- **Form Styling**: Consistent form styling
- **Validation Feedback**: Clear validation messages

### Settings Section
- **Toggle Switches**: Modern toggle switch design
- **Section Headers**: Clear section organization
- **Setting Groups**: Logical setting grouping
- **Action Buttons**: Prominent action buttons
- **Confirmation Dialogs**: Clear confirmation modals

### Statistics Section
- **Chart Styling**: Consistent chart design
- **Data Cards**: Information-dense cards
- **Progress Indicators**: Visual progress displays
- **Trend Lines**: Clear trend visualization
- **Achievement Badges**: Distinctive achievement display

## Performance Considerations

### Optimization Strategies
- **Lazy Loading**: Load statistics on demand
- **Image Optimization**: Compress profile pictures
- **Caching**: Cache user settings and preferences
- **Debouncing**: Debounce form inputs
- **Virtual Scrolling**: Efficient large list rendering

### Data Management
- **Incremental Updates**: Update only changed data
- **Data Compression**: Compress large datasets
- **Cleanup**: Remove old unused data
- **Indexing**: Database indexing for fast queries
- **Pagination**: Paginate large data sets

## Accessibility Features

### Screen Reader Support
- **ARIA Labels**: Comprehensive ARIA labeling
- **Semantic HTML**: Proper HTML structure
- **Alt Text**: Descriptive image alternatives
- **Focus Management**: Logical focus order
- **Keyboard Navigation**: Full keyboard support

### Visual Accessibility
- **Color Contrast**: WCAG AA compliant colors
- **Text Size**: Adjustable text sizes
- **High Contrast**: High contrast mode support
- **Focus Indicators**: Clear focus states
- **Motion Reduction**: Respect motion preferences

## Testing Requirements

### Unit Tests
- **Component Rendering**: Test component display
- **Props Validation**: Test prop handling
- **State Management**: Test state updates
- **Event Handlers**: Test user interactions
- **Form Validation**: Test form validation logic

### Integration Tests
- **Profile Updates**: Test profile update flow
- **Settings Changes**: Test settings configuration
- **Data Export**: Test data export functionality
- **Account Management**: Test account operations
- **Data Synchronization**: Test real-time updates

### E2E Tests
- **Complete Workflow**: Test full user journey
- **Cross-browser**: Test browser compatibility
- **Mobile Testing**: Test mobile functionality
- **Performance**: Test loading and response times
- **Accessibility**: Test accessibility compliance

## Future Enhancements

### Planned Features
- **Social Integration**: Social media integration
- **Wearable Sync**: Fitness tracker synchronization
- **Health App Integration**: Health app data import
- **Advanced Analytics**: Machine learning insights
- **Multi-language**: Enhanced multi-language support

### Technical Improvements
- **Offline Support**: Offline profile management
- **Advanced Security**: Enhanced security features
- **Data Portability**: Improved data export options
- **API Integration**: Third-party service integration
- **Real-time Sync**: Enhanced real-time synchronization

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

### Performance Monitoring
- **Bundle Size**: Monitor bundle size impact
- **Load Times**: Track page load performance
- **User Interactions**: Monitor user engagement
- **Error Tracking**: Track and resolve errors
- **Analytics**: User behavior analytics

---

*This documentation is maintained as part of the Diet Game SDD workflow. For the most up-to-date information, always refer to the latest version in the repository.*
