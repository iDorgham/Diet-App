# Data Flow Architecture

## Overview
This document describes the data flow patterns in the Diet Planner Game application, following SDD principles.

## 1. User Authentication Flow

```mermaid
sequenceDiagram
    participant U as User
    participant A as App
    participant F as Firebase Auth
    participant D as Firestore
    
    U->>A: Open App
    A->>F: Check Auth State
    F-->>A: Auth Status
    alt Not Authenticated
        A->>F: Sign In Anonymously
        F-->>A: User Token
    end
    A->>D: Initialize User Data
    D-->>A: User Profile & Progress
    A->>U: Display Dashboard
```

## 2. Task Completion Flow

```mermaid
sequenceDiagram
    participant U as User
    participant T as Task Component
    participant S as State Manager
    participant D as Firestore
    participant R as Reward System
    
    U->>T: Complete Task
    T->>S: Update Local State
    S->>D: Save Progress
    D-->>S: Confirmation
    S->>R: Calculate Rewards
    R->>S: XP + Coins
    S->>T: Update UI
    T->>U: Show Success Message
```

## 3. AI Coach Interaction Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Coach Page
    participant A as AI Service
    participant D as Firestore
    participant R as Reward System
    
    U->>C: Send Message
    C->>A: POST /ai/plan
    A-->>C: AI Response
    C->>D: Save Chat History
    C->>R: Award XP (+10)
    R->>C: Update Progress
    C->>U: Display Response
```

## 4. Real-time Progress Sync

```mermaid
sequenceDiagram
    participant D as Firestore
    participant L as Local State
    participant C as Components
    participant U as User
    
    D->>L: Progress Update
    L->>C: State Change
    C->>U: UI Update
    
    Note over D,U: Real-time synchronization<br/>using Firestore listeners
```

## Data Models

### User Progress
```typescript
interface UserProgress {
  score: number;           // Total score points
  coins: number;          // Currency for unlocks
  level: number;          // Current level
  currentXP: number;      // XP towards next level
  recipesUnlocked: number; // Premium recipes owned
  hasClaimedGift: boolean; // Onboarding gift status
}
```

### Task Data
```typescript
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

### User Profile
```typescript
interface UserProfile {
  userName: string;
  dietType: string;
  bodyType: string;
  weight: string;
}
```

## State Management Patterns

### 1. Local State (React Hooks)
- Component-specific state
- UI interactions
- Form inputs
- Temporary data

### 2. Global State (Context)
- User progress
- Authentication status
- App-wide settings
- Navigation state

### 3. Persistent State (Firestore)
- User data
- Progress tracking
- Task history
- Chat logs

## Performance Considerations

### 1. Real-time Updates
- Use Firestore listeners efficiently
- Implement proper cleanup
- Batch updates when possible

### 2. State Optimization
- Memoize expensive calculations
- Use React.memo for components
- Implement proper dependency arrays

### 3. Data Fetching
- Implement retry logic
- Use loading states
- Handle offline scenarios

## Error Handling

### 1. Network Errors
- Retry mechanisms
- Offline fallbacks
- User notifications

### 2. Authentication Errors
- Token refresh
- Re-authentication flow
- Graceful degradation

### 3. Data Validation
- Input sanitization
- Type checking
- Error boundaries
