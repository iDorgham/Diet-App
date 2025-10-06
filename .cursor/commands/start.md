# Start Command

Initializes the Evaia development workflow and sets up the development environment.

## Usage
`/start [context]`

## Examples
- `/start` - Initialize complete Evaia workflow
- `/start backend` - Start backend development workflow
- `/start ai-features` - Start AI integration development
- `/start new-feature` - Start new feature development
- `/start after-break` - Resume after interruption

## What it does
- Sets up Evaia development environment
- Initializes TypeScript/Node.js project structure
- Loads Evaia PRD and specifications
- Creates task tracking for backend features
- Validates prerequisites (Node.js, npm, Prisma)
- Provides workflow overview for Evaia development
- Sets up database connection and AI service configuration

## Integration
- Works with `/specify` to create new specs
- Connects to `/continue` for task implementation
- Links to `/validate` for quality checks
