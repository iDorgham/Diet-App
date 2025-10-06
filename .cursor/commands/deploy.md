# Deploy Command

Generates deployment scripts and prepares the Evaia backend for release.

## Usage
`/deploy [target] [type]`

## Examples
- `/deploy` - Generate deployment scripts
- `/deploy docker` - Deploy using Docker containers
- `/deploy heroku` - Deploy to Heroku platform
- `/deploy aws` - Deploy to AWS infrastructure
- `/deploy testing` - Deploy to testing environment
- `/deploy production` - Deploy to production

## What it does
- Generates Docker deployment configurations
- Validates deployment readiness and dependencies
- Prepares release artifacts and builds
- Creates deployment checklist and scripts
- Tests deployment process and health checks
- Provides deployment guidance and documentation
- Configures environment variables and secrets
- Sets up database migrations and seeding

## Integration
- Works with `/test` for deployment testing
- Connects to `/validate` for deployment validation
- Links to `/review` for deployment review
- Works with `/start` for deployment initialization
