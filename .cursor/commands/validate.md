# Validate Command - Evaia Quality Validation

Validates implementation against specifications and ensures quality standards.

## Usage

`/validate [scope] [type] [options]`

## Scopes

- `spec` - Validate against specifications
- `quality` - Validate quality standards
- `performance` - Validate performance requirements
- `security` - Validate security standards
- `api` - Validate API endpoints
- `ai` - Validate AI integration
- `all` - Validate everything

## Types

- `compliance` - Specification compliance
- `structure` - Code structure and organization
- `completeness` - Implementation completeness
- `traceability` - Requirement traceability
- `standards` - Coding standards compliance

## Options

- `--strict` - Use strict validation rules
- `--report` - Generate detailed validation report
- `--fix` - Attempt to fix validation issues
- `--ignore [pattern]` - Ignore specific validation rules

## Examples

- `/validate` - Validate entire Evaia project
- `/validate spec compliance` - Validate specification compliance
- `/validate api structure --strict` - Strict API structure validation
- `/validate ai performance --report` - AI performance validation with report
- `/validate quality standards --fix` - Quality validation with auto-fix

## What it does

### Specification Validation

- Validates implementation against PRD specifications
- Checks EARS notation compliance
- Verifies requirement traceability
- Ensures acceptance criteria are met
- Validates API endpoint specifications

### Quality Validation

- Validates code quality and standards
- Checks TypeScript type safety
- Validates ESLint and Prettier compliance
- Ensures proper error handling
- Validates security best practices

### Performance Validation

- Validates performance requirements
- Checks response time compliance
- Validates resource usage
- Ensures scalability requirements
- Validates caching strategies

### Security Validation

- Validates security standards
- Checks authentication and authorization
- Validates input sanitization
- Ensures secure data handling
- Validates API security

### AI Integration Validation

- Validates AI service integrations
- Checks AI response handling
- Validates AI workflow automation
- Ensures AI monitoring and logging
- Validates AI performance metrics

## Validation Reports

- **Summary Report**: High-level validation results
- **Detailed Report**: Comprehensive analysis with specific findings
- **Recommendations**: Actionable improvement suggestions
- **Compliance Matrix**: Requirement-to-implementation mapping
- **Quality Dashboard**: Visual quality metrics and trends

## Integration

- Works with `/implement` for implementation validation
- Connects to `/test` for comprehensive testing
- Links to `/review` for quality review
- Integrates with `/docs` for documentation validation
- Works with `/deploy` for deployment validation
