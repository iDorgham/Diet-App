# Codebase Organization & Module Architecture

## Project Structure Overview

**Diet Game** follows a well-organized, scalable codebase structure that supports Spec-Driven Development (SDD) principles, component reusability, and maintainable architecture. The structure is designed to accommodate growth while maintaining clarity and developer productivity.

## Root Directory Structure

```
diet-game/
├── 📁 src/                    # Source code
├── 📁 docs/                   # Comprehensive documentation
├── 📁 public/                 # Static assets
├── 📁 scripts/                # Build and utility scripts
├── 📁 backend/                # Backend services (Node.js)
├── 📁 dataconnect/            # Firebase Data Connect
├── 📁 steering documents/     # Project steering documents
├── 📄 package.json            # Dependencies and scripts
├── 📄 vite.config.js          # Build configuration
├── 📄 tailwind.config.js      # Styling configuration
├── 📄 tsconfig.json           # TypeScript configuration
├── 📄 Dockerfile              # Container configuration
└── 📄 README.md               # Project overview
```

## Source Code Organization (`src/`)

### Core Application Structure
```
src/
├── 📁 components/             # Reusable UI components
│   ├── 📁 ui/                # Basic UI elements
│   ├── 📁 forms/             # Form components
│   ├── 📁 gamification/      # Game-specific components
│   ├── 📁 layout/            # Layout components
│   └── 📁 common/            # Shared components
├── 📁 pages/                 # Page-level components
├── 📁 hooks/                 # Custom React hooks
├── 📁 services/              # API and external services
├── 📁 store/                 # State management
├── 📁 utils/                 # Utility functions
├── 📁 types/                 # TypeScript definitions
├── 📁 styles/                # CSS and styling
├── 📁 test/                  # Test utilities and mocks
├── 📄 App.tsx                # Main application component
├── 📄 main.tsx               # Application entry point
└── 📄 index.css              # Global styles
```

### Component Architecture

#### UI Components (`components/ui/`)
```
components/ui/
├── 📄 Button.tsx             # Reusable button component
├── 📄 Input.tsx              # Form input component
├── 📄 Card.tsx               # Card container component
├── 📄 Modal.tsx              # Modal dialog component
├── 📄 Badge.tsx              # Status badge component
├── 📄 ProgressBar.tsx        # Progress indicator
├── 📄 LoadingSpinner.tsx     # Loading state component
└── 📄 index.ts               # Component exports
```

#### Gamification Components (`components/gamification/`)
```
components/gamification/
├── 📄 XPDisplay.tsx          # Experience points display
├── 📄 LevelProgress.tsx      # Level progression component
├── 📄 AchievementCard.tsx    # Achievement display
├── 📄 QuestList.tsx          # Quest management
├── 📄 RewardSystem.tsx       # Reward distribution
├── 📄 Leaderboard.tsx        # Community rankings
├── 📄 StreakCounter.tsx      # Consistency tracking
└── 📄 OptimizedGamificationDashboard.tsx
```

#### Form Components (`components/forms/`)
```
components/forms/
├── 📄 UserProfileForm.tsx    # User profile editing
├── 📄 MealLoggingForm.tsx    # Food logging interface
├── 📄 GoalSettingForm.tsx    # Goal configuration
├── 📄 PreferencesForm.tsx    # User preferences
└── 📄 ValidationSchemas.ts   # Form validation rules
```

#### Layout Components (`components/layout/`)
```
components/layout/
├── 📄 Header.tsx             # Application header
├── 📄 Navigation.tsx         # Main navigation
├── 📄 Sidebar.tsx            # Side navigation
├── 📄 Footer.tsx             # Application footer
├── 📄 PageLayout.tsx         # Standard page wrapper
└── 📄 MainNavigation.tsx     # Primary navigation component
```

### Page Components (`pages/`)
```
pages/
├── 📄 HomePage.tsx           # Dashboard and overview
├── 📄 NutritionTrackingPage.tsx # Food logging and analysis
├── 📄 AICoachPage.tsx        # AI coaching interface
├── 📄 GamificationPage.tsx   # Rewards and achievements
├── 📄 SocialCommunityPage.tsx # Community features
├── 📄 ProfilePage.tsx        # User profile management
├── 📄 OnboardingPage.tsx     # New user setup
└── 📄 ARRecipesPage.tsx      # Augmented reality features
```

### Custom Hooks (`hooks/`)
```
hooks/
├── 📄 useAuth.ts             # Authentication state
├── 📄 useFirestore.ts        # Database operations
├── 📄 useGamification.ts     # Game state management
├── 📄 useNutrition.ts        # Nutrition data handling
├── 📄 useLocalStorage.ts     # Local storage utilities
├── 📄 useDebounce.ts         # Input debouncing
├── 📄 useOnlineStatus.ts     # Network connectivity
└── 📄 useAnalytics.ts        # User behavior tracking
```

### Services Layer (`services/`)
```
services/
├── 📄 firebaseService.ts     # Firebase configuration
├── 📄 authService.ts         # Authentication logic
├── 📄 nutritionService.ts    # Nutrition data API
├── 📄 aiService.ts           # AI coaching integration
├── 📄 storageService.ts      # File upload handling
├── 📄 analyticsService.ts    # Analytics tracking
├── 📄 errorService.ts        # Error handling
└── 📄 demoData.ts            # Mock data for development
```

### State Management (`store/`)
```
store/
├── 📄 nutriStore.ts          # Main application state
├── 📄 authStore.ts           # Authentication state
├── 📄 gamificationStore.ts   # Game state management
├── 📄 nutritionStore.ts      # Nutrition data state
├── 📄 uiStore.ts             # UI state management
└── 📄 types.ts               # Store type definitions
```

### Utility Functions (`utils/`)
```
utils/
├── 📄 constants.ts           # Application constants
├── 📄 helpers.ts             # General helper functions
├── 📄 formatters.ts          # Data formatting utilities
├── 📄 validators.ts          # Input validation functions
├── 📄 calculations.ts        # Nutrition calculations
├── 📄 dateUtils.ts           # Date manipulation
├── 📄 storageUtils.ts        # Local storage helpers
└── 📄 errorUtils.ts          # Error handling utilities
```

### Type Definitions (`types/`)
```
types/
├── 📄 index.ts               # Main type exports
├── 📄 user.ts                # User-related types
├── 📄 nutrition.ts           # Nutrition data types
├── 📄 gamification.ts        # Game mechanics types
├── 📄 api.ts                 # API response types
└── 📄 common.ts              # Shared type definitions
```

## Documentation Structure (`docs/`)

### Architecture Documentation
```
docs/architecture/
├── 📄 system-architecture.md     # Overall system design
├── 📄 component-architecture.md  # Component organization
├── 📄 data-flow.md              # Data flow patterns
├── 📄 api-architecture.md       # API design principles
├── 📄 security-architecture.md  # Security implementation
├── 📄 performance-architecture.md # Performance optimization
├── 📄 deployment-architecture.md # Deployment strategies
├── 📄 monitoring-architecture.md # Observability setup
├── 📄 caching-architecture.md   # Caching strategies
├── 📄 event-driven-architecture.md # Event handling
└── 📄 high-level-diagram.mmd    # System visualization
```

### Specifications (`.cursor/workflow/specs/`)
```
.cursor/workflow/specs/
├── 📄 diet-game-overview.md     # Core application specs
├── 📄 homepage/                 # Homepage specifications
├── 📄 gamification-engine/      # Gamification system specs
├── 📄 ai-coach-system/          # AI coaching specifications
├── 📄 nutrition-tracking/       # Nutrition features specs
├── 📄 social-community/         # Community features specs
├── 📄 database-schema/          # Data model specifications
├── 📄 api-endpoints/            # API specifications
├── 📄 testing-strategy.md       # Testing approach
└── 📄 master/                   # Master specifications
```

### Gamification Documentation
```
docs/gamification/
├── 📄 xp-system.md              # Experience point system
├── 📄 achievement-system.md     # Achievement mechanics
├── 📄 quest-system.md           # Quest and challenge system
├── 📄 reward-system.md          # Reward distribution
├── 📄 leaderboard-system.md     # Community rankings
├── 📄 streak-system.md          # Consistency tracking
├── 📄 badge-system.md           # Badge and milestone system
├── 📄 challenge-system.md       # Challenge mechanics
├── 📄 social-gaming.md          # Social features
└── 📄 analytics-dashboard.md    # Gamification analytics
```

### UI Component Documentation
```
docs/ui-components/
├── 📄 overview.md               # Component system overview
├── 📄 buttons.md                # Button components
├── 📄 forms.md                  # Form components
├── 📄 cards.md                  # Card components
├── 📄 navigation.md             # Navigation components
├── 📄 modals.md                 # Modal components
├── 📄 charts.md                 # Data visualization
├── 📄 badges.md                 # Badge components
├── 📄 loaders.md                # Loading states
└── 📄 wizard.md                 # Multi-step forms
```

## Backend Structure (`backend/`)

### Node.js Backend Organization
```
backend/
├── 📁 src/                     # Backend source code
│   ├── 📁 config/              # Configuration files
│   ├── 📁 database/            # Database setup and models
│   ├── 📁 middleware/          # Express middleware
│   ├── 📁 routes/              # API route handlers
│   ├── 📁 services/            # Business logic services
│   ├── 📁 utils/               # Backend utilities
│   └── 📄 server.ts            # Main server file
├── 📁 migrations/              # Database migrations
├── 📁 scripts/                 # Setup and utility scripts
├── 📁 logs/                    # Application logs
├── 📁 uploads/                 # File upload storage
├── 📄 package.json             # Backend dependencies
├── 📄 tsconfig.json            # TypeScript configuration
└── 📄 README.md                # Backend documentation
```

## Static Assets (`public/`)

### Asset Organization
```
public/
├── 📁 icons/                   # Application icons
│   ├── 📄 favicon.ico          # Browser favicon
│   ├── 📄 apple-touch-icon.png # iOS app icon
│   ├── 📄 pwa-192x192.png      # PWA icon (192px)
│   ├── 📄 pwa-512x512.png      # PWA icon (512px)
│   └── 📄 maskable-icon.svg    # Adaptive icon
├── 📁 images/                  # Application images
│   ├── 📄 logo.svg             # Application logo
│   ├── 📄 hero-image.svg       # Homepage hero image
│   └── 📄 placeholder.svg      # Default placeholder
├── 📁 screenshots/             # App screenshots
├── 📄 manifest.json            # PWA manifest
├── 📄 sw.js                    # Service worker
└── 📄 robots.txt               # SEO configuration
```

## Build & Scripts (`scripts/`)

### Development Scripts
```
scripts/
├── 📄 setup-env.js             # Environment setup
├── 📄 validate-env.js          # Environment validation
├── 📄 generate-assets.js       # Asset generation
├── 📄 generate-icons.js        # Icon generation
├── 📄 generate-images.js       # Image generation
├── 📄 create-placeholder-icons.js # Placeholder creation
├── 📄 serve-icons.js           # Icon serving utility
├── 📄 install-ar-deps.sh       # AR dependencies
└── 📄 README.md                # Scripts documentation
```

## Module Dependencies & Relationships

### Core Dependencies
```
React Application
├── React 18 (Core Framework)
├── TypeScript (Type Safety)
├── Vite (Build System)
├── Tailwind CSS (Styling)
├── Zustand (State Management)
├── React Query (Server State)
├── React Hook Form (Forms)
├── Framer Motion (Animations)
├── Firebase (Backend Services)
└── Grok AI API (AI Features)
```

### Development Dependencies
```
Development Tools
├── Vitest (Testing)
├── Testing Library (Component Testing)
├── ESLint (Code Linting)
├── Prettier (Code Formatting)
├── TypeScript (Type Checking)
├── Vite Plugins (Build Optimization)
└── Docker (Containerization)
```

## Code Organization Principles

### 1. Feature-Based Organization
- **Co-location**: Related files grouped together
- **Self-Contained**: Each feature has its own directory
- **Clear Boundaries**: Well-defined interfaces between modules
- **Scalability**: Easy to add new features without restructuring

### 2. Separation of Concerns
- **UI Layer**: Pure presentation components
- **Business Logic**: Service layer for complex operations
- **Data Layer**: API calls and data transformation
- **State Management**: Centralized state with clear responsibilities

### 3. Reusability & Composition
- **Atomic Components**: Small, reusable UI elements
- **Composition**: Complex components built from simple ones
- **Shared Utilities**: Common functions and helpers
- **Type Safety**: Shared type definitions across modules

### 4. Testing Strategy
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Complete user journey testing
- **Mock Data**: Consistent test data and utilities

## Import/Export Patterns

### Component Exports
```typescript
// components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
export { Modal } from './Modal';

// Usage
import { Button, Input, Card } from '@/components/ui';
```

### Service Exports
```typescript
// services/index.ts
export { authService } from './authService';
export { nutritionService } from './nutritionService';
export { aiService } from './aiService';

// Usage
import { authService, nutritionService } from '@/services';
```

### Type Exports
```typescript
// types/index.ts
export type { User, UserProfile } from './user';
export type { NutritionData, Meal } from './nutrition';
export type { GameState, Achievement } from './gamification';

// Usage
import type { User, NutritionData, GameState } from '@/types';
```

## File Naming Conventions

### Component Files
- **PascalCase**: `UserProfile.tsx`, `AchievementCard.tsx`
- **Descriptive**: Clear indication of component purpose
- **Consistent**: Same pattern across all components

### Service Files
- **camelCase**: `authService.ts`, `nutritionService.ts`
- **Suffix**: Always end with `Service.ts`
- **Descriptive**: Clear indication of service purpose

### Utility Files
- **camelCase**: `dateUtils.ts`, `formatters.ts`
- **Suffix**: Always end with `Utils.ts` or descriptive name
- **Grouped**: Related utilities in same file

### Type Files
- **camelCase**: `user.ts`, `nutrition.ts`
- **Descriptive**: Clear indication of type domain
- **Grouped**: Related types in same file

## Configuration Files

### Build Configuration
```
├── 📄 vite.config.js          # Vite build configuration
├── 📄 vite.config.prod.js     # Production build config
├── 📄 tailwind.config.js      # Tailwind CSS configuration
├── 📄 postcss.config.js       # PostCSS configuration
├── 📄 tsconfig.json           # TypeScript configuration
├── 📄 vitest.config.js        # Testing configuration
└── 📄 .eslintrc.js            # ESLint configuration
```

### Environment Configuration
```
├── 📄 .env.example            # Environment variables template
├── 📄 .env.local              # Local development variables
├── 📄 .env.production         # Production variables
└── 📄 .gitignore              # Git ignore rules
```

## Scalability Considerations

### Horizontal Scaling
- **Modular Architecture**: Easy to split into microservices
- **Stateless Design**: No server-side session dependencies
- **API-First**: Clear separation between frontend and backend
- **Container Ready**: Docker configuration for easy deployment

### Vertical Scaling
- **Performance Optimization**: Code splitting and lazy loading
- **Caching Strategy**: Multi-level caching for data and assets
- **Database Optimization**: Efficient queries and indexing
- **CDN Integration**: Global content delivery

### Team Scaling
- **Clear Boundaries**: Well-defined module responsibilities
- **Documentation**: Comprehensive specs and architecture docs
- **Standards**: Consistent coding and naming conventions
- **Testing**: Automated testing for quality assurance

## Maintenance & Evolution

### Code Maintenance
- **Regular Refactoring**: Continuous improvement of code quality
- **Dependency Updates**: Regular updates of third-party libraries
- **Performance Monitoring**: Continuous performance optimization
- **Security Updates**: Regular security patches and updates

### Architecture Evolution
- **Modular Growth**: Easy addition of new features
- **Technology Updates**: Gradual adoption of new technologies
- **Pattern Evolution**: Continuous improvement of architectural patterns
- **Documentation Updates**: Regular updates to reflect current state

## Conclusion

The codebase structure of Diet Game is designed for long-term maintainability, scalability, and developer productivity. By following established patterns and principles, we create a foundation that supports rapid development while maintaining code quality and system reliability.

The modular architecture allows for independent development of features while maintaining clear interfaces and dependencies. The comprehensive documentation ensures that new team members can quickly understand and contribute to the project.

Regular review and evolution of the structure ensures that it continues to meet the needs of the growing application and development team.
