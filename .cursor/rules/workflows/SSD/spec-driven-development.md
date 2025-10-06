# Spec-Driven Development Rules

## Overview
This project follows a strict spec-driven development approach using the Kiro methodology and GitHub's spec-kit principles. All features, enhancements, and bug fixes MUST be driven by comprehensive specifications before any implementation begins.

## Core Principles

### 1. Specification-First Development
- **NEVER** start coding without a complete specification
- All features must have `requirements.md`, `design.md`, and `tasks.md` files
- Specifications must be reviewed and approved before implementation
- Use EARS (Easy Approach to Requirements Syntax) notation for all requirements

### 2. Three-Phase Workflow
Every feature follows this mandatory progression:
1. **Requirements Phase**: Define user stories and acceptance criteria in EARS notation
2. **Design Phase**: Document technical architecture, sequence diagrams, and implementation considerations
3. **Implementation Phase**: Break down work into discrete, trackable tasks

### 3. Specification Structure
All specifications must be stored in `.cursor/.specify/specs/` following this structure:
```
.cursor/.specify/specs/{feature-name}/
├── requirements.md    # EARS notation requirements
├── design.md         # Technical architecture and diagrams
├── tasks.md          # Implementation task breakdown
└── api-endpoints.md  # API specifications (if applicable)
```

## EARS Notation Requirements

### Format
All requirements MUST follow this structure:
```
WHEN [condition/event]
THE SYSTEM SHALL [expected behavior]
```

### Examples
```
WHEN a user submits a form with invalid data
THE SYSTEM SHALL display validation errors next to the relevant fields

WHEN an AI service request fails
THE SYSTEM SHALL retry the request up to 3 times with exponential backoff

WHEN a workflow execution completes
THE SYSTEM SHALL send a notification to the user and log the results
```

## Specification Creation Rules

### 1. Requirements Documentation
- Use EARS notation for all functional requirements
- Include non-functional requirements (performance, security, scalability)
- Define acceptance criteria for each requirement
- Specify error handling and edge cases
- Include user stories with clear personas

### 2. Design Documentation
- Create sequence diagrams for complex interactions
- Document API endpoints with request/response schemas
- Define database schema changes and relationships
- Specify integration points with external services
- Include security considerations and authentication flows

### 3. Task Breakdown
- Break implementation into discrete, trackable tasks
- Each task must have clear acceptance criteria
- Include testing tasks for each feature
- Specify documentation and deployment tasks
- Estimate effort and identify dependencies

## Implementation Rules

### 1. Task Execution
- Execute tasks in the order specified in `tasks.md`
- Mark tasks as in-progress when starting
- Mark tasks as completed when finished
- Update task status in real-time
- Never skip tasks or change order without updating the spec

### 2. Code Generation
- Generate code based on specifications, not assumptions
- Follow the design patterns specified in `design.md`
- Implement all requirements from `requirements.md`
- Include comprehensive error handling
- Add proper logging and monitoring

### 3. Testing Requirements
- Write tests for all requirements in EARS notation
- Include unit tests, integration tests, and end-to-end tests
- Test error conditions and edge cases
- Validate API endpoints against specifications
- Ensure all acceptance criteria are met

## Quality Gates

### 1. Specification Review
- All specs must be reviewed before implementation
- Requirements must be clear and testable
- Design must be technically sound and feasible
- Tasks must be properly estimated and sequenced

### 2. Implementation Validation
- Code must match the design specifications
- All requirements must be implemented
- Tests must pass and cover all scenarios
- Documentation must be updated

### 3. Deployment Readiness
- All tasks must be completed
- Tests must pass in all environments
- Documentation must be complete
- Performance requirements must be met

## File Organization

### Specification Files
- Store all specs in `.cursor/.specify/specs/`
- Use descriptive folder names (e.g., `user-authentication`, `ai-integration`)
- Keep related specs together in subdirectories
- Version control all specification files

### Code Organization
- Follow the existing project structure
- Place new code in appropriate directories
- Maintain separation of concerns
- Use TypeScript interfaces that match specifications

## Integration with Existing Workflow

### 1. Command Integration
- Use `/specify` to create new specifications
- Use `/continue` to proceed with implementation
- Use `/validate-spec` to check specification compliance
- Use `/generate` to create code from specifications

### 2. Development Process
```bash
# 1. Create specification
/specify [feature-name] [type]

# 2. Review and approve specification
/validate-spec

# 3. Start implementation
/continue 1.1

# 4. Generate code from spec
/generate api --spec .cursor/.specify/specs/[feature]/

# 5. Test implementation
/test

# 6. Validate against spec
/validate-spec
```

## Evaia-Specific Rules

### 1. API Specifications
- All API endpoints must be documented in `api-endpoints.md`
- Include request/response schemas
- Specify authentication and authorization requirements
- Define error responses and status codes

### 2. AI Integration Specifications
- Document AI service integrations in `ai-integration.md`
- Specify prompt engineering requirements
- Define response processing and validation
- Include error handling and fallback strategies

### 3. Database Specifications
- Document schema changes in `database-schema.md`
- Include Prisma model definitions
- Specify relationships and constraints
- Define migration requirements

### 4. Workflow Specifications
- Document business logic workflows
- Specify event processing requirements
- Define automation rules and triggers
- Include performance and scalability requirements

## Best Practices

### 1. Specification Maintenance
- Keep specifications up-to-date with implementation
- Update specs when requirements change
- Version control all specification changes
- Review specs regularly for accuracy

### 2. Collaboration
- Share specs with team members for review
- Use Git for spec version control
- Document decisions and rationale
- Maintain spec history and changes

### 3. Iteration
- Refine specs based on implementation feedback
- Update tasks as work progresses
- Learn from completed implementations
- Improve spec templates and processes

## Enforcement

### 1. Pre-Implementation Checks
- Verify specification exists and is complete
- Ensure all requirements are in EARS notation
- Validate design is technically sound
- Confirm tasks are properly defined

### 2. During Implementation
- Check code against specifications
- Validate requirements are being met
- Ensure tests cover all scenarios
- Monitor task completion status

### 3. Post-Implementation
- Verify all requirements are implemented
- Validate tests pass and cover all cases
- Check documentation is complete
- Confirm deployment readiness

## Tools and Commands

### Required Commands
- `/specify` - Create new specifications
- `/continue` - Continue with implementation
- `/validate-spec` - Validate specification compliance
- `/generate` - Generate code from specifications
- `/test` - Run tests and validate implementation

### Optional Commands
- `/analyze-workflow` - Analyze existing workflows
- `/review` - Review specifications and code
- `/update` - Update specifications based on changes
- `/deploy` - Deploy validated implementations

## Exceptions

### Emergency Fixes
- Critical security issues may bypass spec requirements
- Must create retroactive specification after fix
- Must document the emergency and rationale
- Must update specifications for future similar issues

### Minor Changes
- Small bug fixes may not require full specifications
- Must still follow EARS notation for requirements
- Must update existing specifications if applicable
- Must include proper testing and validation

## Success Metrics

### 1. Specification Quality
- All requirements use EARS notation
- Design documents include necessary diagrams
- Tasks are properly estimated and sequenced
- Specifications are reviewed and approved

### 2. Implementation Quality
- Code matches specifications
- All requirements are implemented
- Tests pass and cover all scenarios
- Documentation is complete and accurate

### 3. Process Efficiency
- Reduced rework and iterations
- Faster development cycles
- Better team collaboration
- Improved code quality and maintainability

---

**Remember**: Spec-driven development is not optional. It's a core requirement for all development work in this project. When in doubt, create a specification first.
