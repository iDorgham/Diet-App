# System Architecture

## Overview
This document provides a comprehensive overview of the Diet Planner Game system architecture, following Spec-Driven Development (SDD) principles.

## Architecture Principles

### 1. Spec-Driven Development (SDD)
- All components are generated from specifications in `.cursor/workflow/specs/`
- Requirements drive implementation, not the reverse
- Documentation-first approach with clear separation of concerns

### 2. Component-Based Architecture
- React-based frontend with modular components
- Separation of concerns between UI, business logic, and data layers
- Reusable components following atomic design principles

### 3. State Management Strategy
- **Local State**: React hooks for component-specific state
- **Global State**: Zustand store for app-wide state management
- **Persistent State**: Firebase Firestore for data persistence
- **Real-time Sync**: Firestore listeners for live updates

## System Layers

### Frontend Layer
```
┌─────────────────────────────────────┐
│           React Application         │
├─────────────────────────────────────┤
│  Pages (Home, Tasks, Coach, etc.)  │
├─────────────────────────────────────┤
│  Components (UI, Forms, Animations)│
├─────────────────────────────────────┤
│  Hooks (Custom, React Query)       │
├─────────────────────────────────────┤
│  Services (API, Firebase, Utils)   │
└─────────────────────────────────────┘
```

### Backend Services
```
┌─────────────────────────────────────┐
│         Firebase Services          │
├─────────────────────────────────────┤
│  Authentication (Anonymous Auth)   │
├─────────────────────────────────────┤
│  Firestore (User Data & Progress)  │
├─────────────────────────────────────┤
│  Real-time Listeners               │
└─────────────────────────────────────┘
```

### External Integrations
```
┌─────────────────────────────────────┐
│        External APIs               │
├─────────────────────────────────────┤
│  Grok AI API (AI Coach)           │
├─────────────────────────────────────┤
│  Recipe APIs (Nutrition Data)     │
├─────────────────────────────────────┤
│  Market APIs (Shopping Data)      │
└─────────────────────────────────────┘
```

## Technology Stack

### Frontend Technologies
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type safety and better developer experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library for consistent UI

### State Management
- **Zustand**: Lightweight state management with persistence
- **React Query**: Server state management and caching
- **React Hook Form**: Form state management with validation

### Backend & Services
- **Firebase Auth**: Anonymous authentication
- **Firestore**: NoSQL database with real-time capabilities
- **Firebase SDK**: Complete Firebase integration

### Development Tools
- **Vitest**: Testing framework
- **ESLint**: Code linting and formatting
- **Docker**: Containerization for deployment
- **Nginx**: Web server and reverse proxy

## Data Flow Architecture

### 1. User Authentication Flow
```
User → App → Firebase Auth → Firestore → User Data
```

### 2. Task Completion Flow
```
User Action → Component → State Manager → Firestore → Real-time Update
```

### 3. AI Coach Interaction
```
User Message → Coach Component → AI API → Response → Firestore → UI Update
```

## Component Architecture

### Page Components
- **HomePage**: Dashboard with metrics and task overview
- **TasksPage**: Task management with Kanban board
- **CoachPage**: AI coach chat interface
- **NutritionPage**: Nutrition tracking and meal planning
- **GamificationPage**: Rewards, levels, and achievements

### UI Components
- **Header**: Navigation and user status
- **MetricCards**: Progress indicators and statistics
- **TaskCards**: Individual task components
- **AnimatedProgressBar**: XP and score progress visualization
- **Forms**: User profile and settings forms

### Service Layer
- **FirebaseService**: Authentication and data operations
- **TaskService**: Task completion and progress tracking
- **APIService**: External API integrations
- **ErrorHandler**: Centralized error management

## State Management Architecture

### Zustand Store Structure
```typescript
interface NutriState {
  // User Data
  progress: UserProgress;
  userProfile: UserProfile;
  headerStatus: HeaderStatus;
  
  // App State
  isOnline: boolean;
  lastSyncTime: number;
  pendingUpdates: Update[];
  
  // UI State
  activePage: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  updateProgress: (updates: Partial<UserProgress>) => void;
  completeTask: (taskId: number, taskType: string, streak: number) => Promise<void>;
  // ... other actions
}
```

### Data Models
```typescript
interface UserProgress {
  score: number;
  coins: number;
  level: number;
  currentXP: number;
  recipesUnlocked: number;
  hasClaimedGift: boolean;
}

interface UserProfile {
  userName: string;
  dietType: string;
  bodyType: string;
  weight: string;
}

interface Task {
  id: number;
  name: string;
  icon: IconType;
  time: string;
  completed: boolean;
  type: 'Meal' | 'Shopping' | 'Cooking';
  scoreReward: number;
  coinReward: number;
  xpReward: number;
}
```

## Performance Considerations

### 1. Code Splitting
- Lazy loading of page components
- Dynamic imports for heavy dependencies
- Route-based code splitting

### 2. State Optimization
- Memoized selectors with Zustand
- React.memo for expensive components
- Proper dependency arrays in useEffect

### 3. Real-time Updates
- Efficient Firestore listeners
- Proper cleanup of subscriptions
- Batch updates when possible

### 4. Caching Strategy
- React Query for API responses
- Local storage for user preferences
- Service worker for offline capabilities

## Security Architecture

### 1. Authentication
- Anonymous Firebase authentication
- Secure token management
- Session persistence

### 2. Data Security
- Firestore security rules
- Input validation and sanitization
- Error handling without data exposure

### 3. API Security
- API key management
- Rate limiting
- Request validation

## Deployment Architecture

### Development Environment
```
Local Machine → Vite Dev Server → Firebase Emulators
```

### Production Environment
```
Docker Container → Nginx → Firebase Production
```

### Container Structure
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## Monitoring and Observability

### 1. Error Tracking
- Sentry integration for error monitoring
- Custom error boundaries
- Firebase error logging

### 2. Performance Monitoring
- Web Vitals tracking
- Custom performance metrics
- Real-time user analytics

### 3. Health Checks
- Application health endpoints
- Database connectivity checks
- External service status monitoring

## Scalability Considerations

### 1. Horizontal Scaling
- Stateless application design
- Load balancer ready
- Container orchestration support

### 2. Database Scaling
- Firestore automatic scaling
- Efficient query patterns
- Data partitioning strategies

### 3. Caching Strategy
- Multi-level caching
- CDN integration
- Service worker caching

## Development Workflow

### 1. Spec-Driven Development
1. Write specifications in `.cursor/workflow/specs/`
2. Generate components using Cursor Composer
3. Implement business logic
4. Test and validate against specs

### 2. Testing Strategy
- Unit tests with Vitest
- Component tests with React Testing Library
- Integration tests for critical flows
- E2E tests for user journeys

### 3. Code Quality
- ESLint for code standards
- TypeScript for type safety
- Prettier for code formatting
- Husky for pre-commit hooks

## Future Architecture Considerations

### 1. Microservices Migration
- Service decomposition strategy
- API gateway implementation
- Event-driven architecture

### 2. Advanced Features
- Real-time collaboration
- Advanced AI integration
- Mobile app development
- Offline-first architecture

### 3. Performance Optimization
- Server-side rendering (SSR)
- Progressive Web App (PWA) features
- Advanced caching strategies
- CDN optimization
