# GitHub Spec-Kit Integration Rules

## Overview
This project integrates with GitHub's spec-kit toolkit for spec-driven development. The spec-kit provides templates, automation, and best practices for creating and managing specifications in a GitHub-native workflow.

## Spec-Kit Core Principles

### 1. Specification Templates
- Use standardized templates for consistent specification structure
- Leverage spec-kit templates for common feature types
- Customize templates for Evaia-specific requirements
- Maintain template version control and updates

### 2. GitHub-Native Workflow
- Store specifications in the repository alongside code
- Use GitHub Issues for specification tracking
- Leverage GitHub Projects for task management
- Integrate with GitHub Actions for automation

### 3. AI-Assisted Development
- Use GitHub Copilot for specification generation
- Leverage AI for code generation from specifications
- Implement AI-powered specification validation
- Use AI for test case generation from requirements

## Spec-Kit File Structure

### Standard Spec-Kit Structure
```
.spec-kit/
├── templates/
│   ├── feature-spec.md
│   ├── api-spec.md
│   ├── database-spec.md
│   └── ai-integration-spec.md
├── workflows/
│   ├── spec-validation.yml
│   ├── code-generation.yml
│   └── deployment.yml
└── config/
    ├── spec-kit.yml
    └── templates.yml
```

### Evaia Integration Structure
```
.cursor/.specify/specs/
├── templates/
│   ├── evaia-feature-spec.md
│   ├── evaia-api-spec.md
│   ├── evaia-ai-spec.md
│   └── evaia-workflow-spec.md
├── generated/
│   ├── api-docs/
│   ├── test-cases/
│   └── deployment-configs/
└── validation/
    ├── spec-validator.js
    └── compliance-checker.js
```

## Spec-Kit Templates

### Feature Specification Template
```markdown
# {Feature Name} Specification

## Overview
Brief description of the feature and its purpose.

## Requirements (EARS Notation)
### Functional Requirements
- WHEN [condition] THE SYSTEM SHALL [behavior]
- WHEN [condition] THE SYSTEM SHALL [behavior]

### Non-Functional Requirements
- Performance: [specific metrics]
- Security: [security requirements]
- Scalability: [scalability requirements]

## Design
### Architecture
[Architecture description and diagrams]

### API Endpoints
[API endpoint specifications]

### Database Schema
[Database schema definitions]

## Implementation Tasks
### Phase 1: Core Implementation
- [ ] Task 1.1: [Description]
- [ ] Task 1.2: [Description]

### Phase 2: Integration
- [ ] Task 2.1: [Description]
- [ ] Task 2.2: [Description]

### Phase 3: Testing & Deployment
- [ ] Task 3.1: [Description]
- [ ] Task 3.2: [Description]

## Acceptance Criteria
- [ ] All functional requirements implemented
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Performance requirements met
```

### API Specification Template
```markdown
# {API Name} Specification

## Base Information
- **Base URL**: `{base_url}`
- **Version**: `{version}`
- **Authentication**: `{auth_method}`

## Endpoints
### {Endpoint Name}
- **Method**: `{HTTP_METHOD}`
- **Path**: `{path}`
- **Description**: `{description}`

#### Request
```json
{
  "field1": "type",
  "field2": "type"
}
```

#### Response
```json
{
  "success": "boolean",
  "data": "object",
  "message": "string"
}
```

#### Error Responses
- `400`: Bad Request
- `401`: Unauthorized
- `404`: Not Found
- `500`: Internal Server Error
```

## Spec-Kit Automation

### GitHub Actions Workflows

#### Specification Validation
```yaml
name: Validate Specifications
on:
  pull_request:
    paths:
      - '.cursor/workflow/specs/**'

jobs:
  validate-specs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Validate EARS Notation
        run: |
          npx spec-kit validate-ears .cursor/.specify/specs/
      - name: Check Specification Completeness
        run: |
          npx spec-kit check-completeness .cursor/.specify/specs/
      - name: Generate API Documentation
        run: |
          npx spec-kit generate-api-docs .cursor/.specify/specs/
```

#### Code Generation
```yaml
name: Generate Code from Specs
on:
  workflow_dispatch:
    inputs:
      spec_path:
        description: 'Path to specification'
        required: true

jobs:
  generate-code:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Generate Code
        run: |
          npx spec-kit generate-code ${{ github.event.inputs.spec_path }}
      - name: Create Pull Request
        uses: peter-evans/create-pull-request@v5
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          commit-message: 'Generated code from specification'
          title: 'Generated: ${{ github.event.inputs.spec_path }}'
```

### Spec-Kit CLI Commands

#### Specification Management
```bash
# Initialize spec-kit in project
npx spec-kit init

# Create new specification from template
npx spec-kit create [template] [name]

# Validate all specifications
npx spec-kit validate

# Generate code from specification
npx spec-kit generate [spec-path]

# Check specification compliance
npx spec-kit check-compliance [spec-path]
```

#### Template Management
```bash
# List available templates
npx spec-kit templates list

# Create custom template
npx spec-kit templates create [name]

# Update template
npx spec-kit templates update [name]

# Use template for new spec
npx spec-kit create [template] [name]
```

## Spec-Kit Integration with Evaia

### Evaia-Specific Templates

#### AI Integration Specification
```markdown
# {AI Feature} Specification

## AI Service Integration
### Provider
- **Service**: `{OpenAI/Anthropic/etc}`
- **Model**: `{model_name}`
- **API Version**: `{version}`

### Prompt Engineering
```yaml
system_prompt: |
  {system prompt}
user_prompt_template: |
  {user prompt template}
parameters:
  temperature: {value}
  max_tokens: {value}
  top_p: {value}
```

### Response Processing
- **Validation**: `{validation rules}`
- **Error Handling**: `{error handling strategy}`
- **Fallback**: `{fallback behavior}`

### Performance Requirements
- **Response Time**: `{max response time}`
- **Throughput**: `{requests per second}`
- **Cost Limits**: `{cost per request}`
```

#### Workflow Automation Specification
```markdown
# {Workflow Name} Specification

## Workflow Definition
### Triggers
- **Event-based**: `{event conditions}`
- **Schedule-based**: `{cron expression}`
- **Manual**: `{user action}`

### Steps
1. **Step 1**: `{description}`
   - Input: `{input schema}`
   - Output: `{output schema}`
   - Error Handling: `{error strategy}`

2. **Step 2**: `{description}`
   - Input: `{input schema}`
   - Output: `{output schema}`
   - Error Handling: `{error strategy}`

### State Management
- **State Storage**: `{database/redis/etc}`
- **State Schema**: `{state structure}`
- **Persistence**: `{persistence strategy}`

### Monitoring
- **Metrics**: `{key metrics}`
- **Alerts**: `{alert conditions}`
- **Logging**: `{log levels and content}`
```

### Evaia Command Integration

#### Enhanced Specify Command
```bash
# Create Evaia-specific specification
/specify [feature] [type] --evaia --template [template]

# Examples
/specify user-auth functional --evaia --template api
/specify ai-chat functional --evaia --template ai-integration
/specify workflow-automation functional --evaia --template workflow
```

#### Spec-Kit Enhanced Commands
```bash
# Generate from spec-kit template
/generate-from-template [template] [name]

# Validate with spec-kit
/validate-with-spec-kit [spec-path]

# Generate API docs from specs
/generate-api-docs --spec-kit [spec-path]

# Create GitHub issue from spec
/create-issue-from-spec [spec-path]
```

## Spec-Kit Best Practices

### 1. Template Usage
- Use appropriate templates for different feature types
- Customize templates for Evaia-specific requirements
- Maintain template consistency across the project
- Version control template changes

### 2. Automation Integration
- Use GitHub Actions for specification validation
- Automate code generation from specifications
- Implement continuous specification compliance checking
- Generate documentation automatically

### 3. Collaboration
- Use GitHub Issues for specification tracking
- Implement specification review process
- Use GitHub Projects for task management
- Maintain specification change history

### 4. Quality Assurance
- Validate EARS notation compliance
- Check specification completeness
- Ensure code matches specifications
- Monitor specification maintenance

## Spec-Kit Configuration

### spec-kit.yml Configuration
```yaml
project:
  name: "Evaia"
  type: "full-stack"
  language: "typescript"
  framework: "express"

templates:
  default: "evaia-feature-spec"
  api: "evaia-api-spec"
  ai: "evaia-ai-spec"
  workflow: "evaia-workflow-spec"

validation:
  ears_notation: true
  completeness_check: true
  api_schema_validation: true
  test_coverage: true

generation:
  code_generation: true
  api_docs: true
  test_cases: true
  deployment_configs: true

github:
  issues: true
  projects: true
  actions: true
  pull_requests: true
```

### templates.yml Configuration
```yaml
templates:
  evaia-feature-spec:
    path: ".cursor/.specify/specs/templates/evaia-feature-spec.md"
    variables:
      - name: "feature_name"
        required: true
      - name: "feature_type"
        required: true
        options: ["functional", "technical", "integration"]

  evaia-api-spec:
    path: ".cursor/.specify/specs/templates/evaia-api-spec.md"
    variables:
      - name: "api_name"
        required: true
      - name: "base_url"
        required: true
      - name: "auth_method"
        required: true
```

## Spec-Kit Monitoring

### Metrics and KPIs
- Specification creation rate
- Template usage statistics
- Validation pass/fail rates
- Code generation success rate
- Time from spec to implementation

### Quality Metrics
- EARS notation compliance rate
- Specification completeness score
- Code-to-spec alignment percentage
- Test coverage from specifications
- Documentation generation rate

### Process Metrics
- Average time per specification phase
- Rework rate and causes
- Team adoption rate
- Automation effectiveness
- GitHub integration usage

## Spec-Kit Troubleshooting

### Common Issues
1. **Template Not Found**: Check template path and configuration
2. **Validation Failures**: Review EARS notation and completeness
3. **Code Generation Errors**: Verify specification structure
4. **GitHub Integration Issues**: Check token permissions and workflows

### Debug Commands
```bash
# Debug template loading
npx spec-kit debug templates

# Debug validation issues
npx spec-kit debug validate [spec-path]

# Debug code generation
npx spec-kit debug generate [spec-path]

# Debug GitHub integration
npx spec-kit debug github
```

---

**Remember**: Spec-kit is about leveraging GitHub's ecosystem for specification management. Use templates, automation, and GitHub-native features to streamline the spec-driven development process.
