<!-- 
  This command has been consolidated and updated as part of the Evaia commands cleanup.
  See .cursor/COMMANDS.md for the complete command reference.
-->

# Specify Command - Evaia Feature Specification

Creates a new feature specification following Evaia's spec-driven development approach.

## Usage

`/specify [feature-name] [type] [options]`

## Evaia Specific Examples

- `/specify user-auth functional` - Create user authentication spec
- `/specify ai-integration technical` - Create AI service integration specification
- `/specify event-aggregator functional` - Create event aggregation specification
- `/specify api-endpoints technical` - Create API endpoint specification
- `/specify database-schema technical` - Create database schema specification
- `/specify workflow-automation functional` - Create workflow automation specification

## Advanced Usage

- `/specify [feature] --with-tests` - Include test specifications
- `/specify [feature] --with-docs` - Include documentation specifications
- `/specify [feature] --with-ai` - Include AI integration specifications
- `/specify [feature] --full-stack` - Create complete full-stack specification

## What it does

### Core Specification Creation

- Creates specification document in `.cursor/workflow/specs/{feature-name}/`
- Defines requirements using EARS notation
- Sets up technical architecture documentation
- Creates implementation task breakdown
- Establishes quality gates and acceptance criteria

### Evaia Integration

- Generates API endpoint specifications
- Creates database schema specifications
- Sets up AI service integration specs
- Defines workflow automation specifications
- Establishes testing and validation criteria

### Backend Enhancement

- Creates TypeScript interface specifications
- Defines Express.js route specifications
- Sets up Prisma database specifications
- Establishes middleware and service specifications
- Creates authentication and security specifications

## Specification Structure Created

```text
.cursor/workflow/specs/{feature-name}/
├── requirements.md    # EARS notation requirements
├── design.md         # Technical architecture
├── tasks.md          # Implementation tasks
├── api-endpoints.md  # API endpoint specs (if applicable)
├── database-schema.md # Database schema specs (if applicable)
├── ai-integration.md # AI service specs (if applicable)
└── testing.md        # Test specifications (if applicable)
```

## Evaia Specific Features

### API Specifications

- RESTful API endpoint structure
- Request/response schemas
- Authentication and authorization
- Error handling and validation

### Database Specifications

- Prisma schema definitions
- Database relationships
- Migration specifications
- Data validation rules

### AI Integration Specifications

- AI service API integration
- Prompt engineering specifications
- Response processing and validation
- Error handling and fallbacks

### Workflow Specifications

- Business logic workflows
- Event processing specifications
- Automation rules and triggers
- Performance and scalability requirements

## Integration

- Works with other Evaia commands in the consolidated structure
- See .cursor/COMMANDS.md for complete command relationships
- Refer to command usage patterns for best practices

## Development Workflow

```bash
# Feature development
/specify [feature] functional
/continue 1.1
/generate api --spec .cursor/workflow/specs/[feature]/
/validate-spec
/test
```

## Quality Gates

- All specifications must use EARS notation
- Technical specifications must include architecture diagrams
- Implementation tasks must be trackable and measurable
- API endpoints must include request/response schemas
- Database schemas must include relationships and constraints
- AI integrations must include error handling and fallbacks
