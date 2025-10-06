# Docs Command - Evaia Documentation Management

Manages and generates comprehensive documentation for the Evaia project.

## Usage
`/docs [action] [type] [options]`

## Actions
- `generate` - Generate documentation from specifications
- `update` - Update existing documentation
- `validate` - Validate documentation quality
- `review` - Review documentation completeness

## Types
- `api` - API documentation and references
- `user` - User guides and tutorials
- `developer` - Developer documentation and guides
- `specs` - Specification documentation
- `all` - All documentation types

## Options
- `--format [markdown|html|pdf]` - Output format
- `--language [en|ar]` - Documentation language
- `--version [version]` - Target version
- `--force` - Force regeneration

## Examples
- `/docs generate api` - Generate API documentation
- `/docs generate user --language ar` - Generate Arabic user guides
- `/docs update developer` - Update developer documentation
- `/docs validate all` - Validate all documentation
- `/docs review specs` - Review specification documentation

## What it does

### Documentation Generation
- Generates comprehensive API documentation from specifications
- Creates user guides and tutorials from feature specs
- Generates developer documentation and implementation guides
- Creates specification summaries and overviews
- Generates project documentation and README files

### Documentation Management
- Updates existing documentation with latest changes
- Validates documentation quality and completeness
- Reviews documentation for accuracy and consistency
- Manages documentation versions and releases
- Ensures documentation stays current with development

### Multi-format Support
- Generates Markdown documentation for development
- Creates HTML documentation for web viewing
- Generates PDF documentation for offline use
- Supports multiple languages (English, Arabic)
- Provides customizable templates and styling

## Integration
- Works with `/specify` for specification-based documentation
- Connects to `/validate` for quality assurance
- Links to `/review` for documentation review
- Integrates with `/deploy` for deployment documentation
- Works with `/generate` for code generation documentation
