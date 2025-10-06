# Build Command

Builds the Evaia TypeScript backend, compiles code, and prepares for deployment.

## Usage
`/build [type] [target]`

## Examples
- `/build` - Build TypeScript project
- `/build dev` - Build for development
- `/build production` - Build for production deployment
- `/build docker` - Build Docker container
- `/build docs` - Generate API documentation
- `/build types` - Generate TypeScript declarations

## What it does
- Compiles TypeScript to JavaScript in `dist/` directory
- Generates Prisma client and database types
- Validates build integrity and dependencies
- Prepares deployment artifacts
- Runs build-time validations
- Reports build status and compilation errors
- Optimizes code for production

## Integration
- Works with `/test` for build testing
- Connects to `/validate` for build validation
- Links to `/deploy` for deployment preparation
- Works with `/clean` for build cleanup
- Integrates with Docker for containerization
