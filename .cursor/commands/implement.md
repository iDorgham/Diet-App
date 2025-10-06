# Implement Command - Evaia Feature Implementation

Implements features based on specifications and manages development tasks.

## Usage
`/implement [feature] [phase] [options]`

## Options
- `--with-tests` - Include test implementation
- `--with-docs` - Include documentation generation
- `--with-ai` - Include AI integration
- `--full-stack` - Implement complete full-stack feature
- `--template [template-name]` - Use specific template
- `--force` - Force reimplementation

## Examples
- `/implement user-auth` - Implement user authentication feature
- `/implement ai-integration phase1 --with-ai` - Implement AI integration phase 1
- `/implement api-endpoints --with-tests --with-docs` - Implement API with tests and docs
- `/implement workflow-automation --full-stack` - Implement complete workflow feature

## What it does

### Feature Implementation
- Implements features based on specifications
- Creates TypeScript controllers, services, and routes
- Generates Prisma database models and migrations
- Implements API endpoints and data validation
- Creates middleware and utility functions

### Template Management
- Uses Evaia-specific code templates
- Generates consistent code structure
- Applies best practices and patterns
- Creates reusable components and utilities
- Manages template inheritance and composition

### Development Workflow
- Manages implementation phases and tasks
- Tracks progress and dependencies
- Generates implementation documentation
- Creates test files and test cases
- Sets up development environment

### AI Integration
- Implements AI service integrations
- Creates AI client code and configurations
- Sets up AI workflow automation
- Implements AI response handling
- Creates AI monitoring and logging

## Implementation Phases
- `phase1` - Core functionality implementation
- `phase2` - Advanced features and optimizations
- `phase3` - Integration and testing
- `complete` - Full feature implementation

## Integration
- Works with `/specify` for specification-based implementation
- Connects to `/test` for implementation testing
- Links to `/validate` for quality validation
- Integrates with `/docs` for documentation generation
- Works with `/deploy` for deployment preparation
