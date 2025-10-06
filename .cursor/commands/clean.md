# Clean Command

Cleans and organizes Evaia project files, removes temporary files, and maintains project structure.

## Usage
`/clean [scope] [type]`

## Examples
- `/clean` - Clean entire project
- `/clean build` - Clean build artifacts (dist/, node_modules/.cache/)
- `/clean logs` - Clean log files and temporary data
- `/clean imports` - Fix and organize TypeScript imports
- `/clean cache` - Clear npm, TypeScript, and Prisma cache
- `/clean docker` - Clean Docker containers and images
- `/clean db` - Clean database and reset Prisma

## What it does
- Removes temporary files (*.tmp, *.temp, *.log)
- Cleans build artifacts (dist/, node_modules/.cache/, .tsbuildinfo)
- Organizes file structure according to project standards
- Fixes TypeScript import statements and dependencies
- Removes unused files and dead code
- Validates and fixes project structure
- Cleans up documentation and comments
- Resets Prisma database and clears cache
- Removes Docker containers and images

## Integration
- Works with `/start` for project initialization
- Connects to `/validate` for structure validation
- Links to `/test` for cleaning test files
- Works with `/review` for code cleanup

# Clean Command

Cleans and organizes Evaia project files, removes temporary files, and maintains project structure.

## Usage
`/clean [scope] [type]`

## Examples
- `/clean` - Clean entire project
- `/clean build` - Clean build artifacts (dist/, node_modules/.cache/)
- `/clean logs` - Clean log files and temporary data
- `/clean imports` - Fix and organize TypeScript imports
- `/clean cache` - Clear npm, TypeScript, and Prisma cache
- `/clean docker` - Clean Docker containers and images
- `/clean db` - Clean database and reset Prisma

## What it does
- Removes temporary files (*.tmp, *.temp, *.log)
- Cleans build artifacts (dist/, node_modules/.cache/, .tsbuildinfo)
- Organizes file structure according to project standards
- Fixes TypeScript import statements and dependencies
- Removes unused files and dead code
- Validates and fixes project structure
- Cleans up documentation and comments
- Resets Prisma database and clears cache
- Removes Docker containers and images

## Integration
- Works with `/start` for project initialization
- Connects to `/validate` for structure validation
- Links to `/test` for cleaning test files
- Works with `/review` for code cleanup