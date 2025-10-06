<!-- 
  This command has been consolidated and updated as part of the Evaia commands cleanup.
  See .cursor/COMMANDS.md for the complete command reference.
-->

# Generate Command - Evaia Code Generation

Generates code, documentation, and configurations for the Evaia backend.

## Usage

`/generate [type] [options]`

## Examples

- `/generate api` - Generate API endpoints from specifications
- `/generate types` - Generate TypeScript types from Prisma schema
- `/generate docs` - Generate API documentation
- `/generate tests` - Generate test files from specifications
- `/generate migrations` - Generate Prisma database migrations
- `/generate ai-client` - Generate AI service client code

## What it does

### Code Generation

- Generates TypeScript API endpoints from PRD specifications
- Creates Prisma client types and database models
- Generates test files with Jest test cases
- Creates AI service integration code
- Generates middleware and utility functions

### Documentation Generation

- Generates API documentation from OpenAPI specs
- Creates TypeScript declaration files
- Generates README and setup documentation
- Creates deployment and configuration guides
- Generates code comments and JSDoc

### Configuration Generation

- Generates environment configuration files
- Creates Docker and deployment configurations
- Generates CI/CD pipeline configurations
- Creates database migration files
- Generates AI service configuration

## Generation Workflow

```bash
# Generate API endpoints
/generate api --spec docs/PRD.md

# Generate types from Prisma
/generate types --schema prisma/schema.prisma

# Generate tests
/generate tests --coverage
```

## Integration

- Works with other Evaia commands in the consolidated structure
- See .cursor/COMMANDS.md for complete command relationships
- Refer to command usage patterns for best practices
