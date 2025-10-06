# Update Command

Updates dependencies, configurations, and Evaia project components.

## Usage
`/update [type] [scope]`

## Examples
- `/update` - Update all components
- `/update deps` - Update npm dependencies
- `/update config` - Update configurations
- `/update docs` - Update documentation
- `/update specs` - Update specifications
- `/update security` - Update security patches
- `/update prisma` - Update Prisma schema and client
- `/update ai` - Update AI service integrations

## What it does
- Updates npm project dependencies
- Refreshes TypeScript and Node.js configurations
- Updates Evaia documentation and specs
- Applies security patches and updates
- Validates updates and compatibility
- Reports update status and changes
- Handles update conflicts and issues
- Updates Prisma schema and database client
- Updates AI service API integrations

## Integration
- Works with `/validate` for update validation
- Connects to `/test` for update testing
- Links to `/fix` for update issue resolution
- Works with `/clean` for update cleanup
