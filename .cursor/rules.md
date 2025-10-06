# Cursor SDD Rules for Diet Planner Game

## Spec-Driven Development (SDD) Principles

### 1. Always Start with Specs
- Read the relevant spec file from `docs/` before generating code
- Use EARS notation requirements as the foundation
- Reference Mermaid diagrams for architecture understanding

### 2. Context-Aware Generation
- Always include full context: "Using docs/architecture/high-level-diagram.mmd, generate..."
- Reference specific spec files in prompts
- Include color palette and design system references

### 3. Code Generation Workflow
```
Spec → Cursor AI → Test → Refactor → Deploy
```

### 4. File Organization
- Components in `src/components/`
- Pages in `src/pages/`
- Utilities in `src/utils/`
- Types in `src/types/`

## Color Palette (Always Use)
- Primary: #085492 (Ocean Blue)
- Secondary: #71E6DE (Mint Green)  
- Accent: #998B73 (Warm Brown)
- Background: #EDF0F2 (Light Gray)
- Text: #374151 (Dark Gray)

## Component Standards

### React Components
- Use TypeScript interfaces for props
- Implement proper error boundaries
- Include accessibility attributes
- Use Tailwind CSS for styling

### State Management
- React Context for global state
- Local state for component-specific data
- Firestore for persistent data

### Performance
- Use React.memo for expensive components
- Implement proper dependency arrays
- Memoize expensive calculations

## Testing Requirements
- Unit tests for all components
- Integration tests for data flow
- E2E tests for user interactions
- Accessibility tests for compliance

## Firebase Integration
- Use Firestore for real-time data
- Implement proper error handling
- Include offline fallbacks
- Use retry mechanisms

## Gamification Elements
- XP system with level progression
- Star milestone system
- Coin reward system
- Quest completion tracking

## Code Quality
- ESLint configuration
- Prettier formatting
- TypeScript strict mode
- Proper error handling

## Documentation
- JSDoc comments for functions
- README updates for new features
- Spec updates for changes
- Architecture diagram updates
