# Init Command - Evaia Project Initialization

Initializes a new Evaia backend project with proper structure and configuration.

## Usage
`/init [project-name] [options]`

## Examples
- `/init evaia-backend` - Initialize new Evaia backend project
- `/init evaia-api --with-ai` - Initialize with AI integration
- `/init evaia-full --with-database` - Initialize with complete database setup
- `/init evaia-minimal` - Initialize minimal project structure

## What it does
### Project Structure Creation
- Creates proper Node.js/TypeScript project structure
- Sets up src/ directory with Express.js structure
- Creates config/ directory for configuration files
- Sets up tests/ directory for Jest testing
- Configures TypeScript and build settings

### Backend Setup
- Initializes Express.js application
- Sets up Prisma database configuration
- Configures AI service integrations (OpenAI, Anthropic)
- Sets up authentication and middleware
- Creates API route structure

### Configuration Management
- Creates package.json with Evaia dependencies
- Sets up TypeScript configuration
- Configures Jest testing framework
- Sets up ESLint and Prettier
- Creates environment configuration

## Project Structure Created
```
evaia-backend/
├── src/
│   ├── controllers/    # API controllers
│   ├── routes/        # Express routes
│   ├── services/      # Business logic
│   ├── middleware/    # Express middleware
│   ├── types/         # TypeScript types
│   └── utils/         # Utility functions
├── config/            # Configuration files
├── tests/             # Test files
├── docs/              # Documentation
├── .cursor/           # Cursor IDE configuration
├── package.json       # Node.js dependencies
├── tsconfig.json      # TypeScript configuration
└── README.md          # Project overview
```

## Integration
- Works with `/start` for workflow initialization
- Connects to `/specify` for specification creation
- Links to `/generate` for code generation
- Integrates with `/test` for testing setup
- Works with `/deploy` for deployment preparation
