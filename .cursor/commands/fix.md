# Fix Command

Fixes test errors, code issues, and common problems in the Evaia backend automatically.

## Usage
`/fix [type] [scope]`

## Examples
- `/fix` - Fix all common issues
- `/fix tests` - Fix Jest test errors and failures
- `/fix imports` - Fix TypeScript import errors and dependencies
- `/fix lint` - Fix ESLint and Prettier issues
- `/fix types` - Fix TypeScript type checking errors
- `/fix security` - Fix security vulnerabilities
- `/fix performance` - Fix performance issues
- `/fix prisma` - Fix Prisma schema and database issues

## What it does
- Analyzes Jest test failures and suggests fixes
- Fixes TypeScript import errors and missing dependencies
- Resolves ESLint and Prettier formatting issues
- Fixes TypeScript type checking errors
- Addresses security vulnerabilities in dependencies
- Optimizes performance bottlenecks
- Fixes Prisma schema and database connection issues
- Provides detailed fix explanations
- Validates fixes with automated testing

## Integration
- Works with `/test` for test error fixing
- Connects to `/validate` for issue validation
- Links to `/clean` for cleanup after fixes
- Works with `/review` for fix review
