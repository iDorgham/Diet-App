# Test Command

Generates and runs tests for the Evaia backend implementation.

## Usage
`/test [scope] [type]`

## Examples
- `/test` - Run all Jest tests
- `/test unit` - Run unit tests
- `/test integration` - Run integration tests
- `/test coverage` - Check test coverage
- `/test new` - Test recently added code
- `/test api` - Test API endpoints
- `/test ai` - Test AI integration features
- `/test database` - Test database operations

## What it does
- Generates Jest test cases from Evaia specifications
- Runs comprehensive test suites for TypeScript code
- Validates test coverage (80% requirement)
- Reports test results and failures
- Identifies missing test scenarios
- Suggests test improvements
- Tests API endpoints and routes
- Tests AI service integrations
- Tests Prisma database operations

## Integration
- Works with `/continue` for implementation testing
- Connects to `/validate` for quality validation
- Links to `/deploy` for deployment readiness
- Works with `/review` for code quality
