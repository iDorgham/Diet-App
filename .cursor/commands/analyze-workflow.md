# Analyze Workflow Command - Evaia Spec-Driven Development Analysis

Analyzes Evaia's spec-driven development workflow, progress, and quality metrics.

## Usage
`/analyze-workflow [scope] [options]`

## Examples
- `/analyze-workflow` - Analyze complete development workflow
- `/analyze-workflow progress` - Analyze development progress and status
- `/analyze-workflow quality` - Analyze specification and code quality
- `/analyze-workflow compliance` - Analyze spec-driven development compliance
- `/analyze-workflow metrics` - Generate development metrics and KPIs
- `/analyze-workflow bottlenecks` - Identify workflow bottlenecks and issues
- `/analyze-workflow recommendations` - Generate improvement recommendations
- `/analyze-workflow trends` - Analyze development trends and patterns

## What it does

### Workflow Analysis
- Analyzes spec-driven development workflow efficiency
- Identifies workflow bottlenecks and optimization opportunities
- Tracks development progress and milestone completion
- Analyzes team productivity and resource utilization
- Evaluates workflow compliance and adherence to standards
- Generates workflow optimization recommendations

### Progress Tracking
- Tracks specification completion and approval status
- Monitors implementation progress against specifications
- Analyzes task completion rates and timelines
- Tracks testing and quality assurance progress
- Monitors documentation generation and maintenance
- Analyzes deployment and release progress

### Quality Analysis
- Analyzes specification quality and completeness
- Evaluates code quality against specifications
- Tracks testing coverage and quality metrics
- Analyzes documentation quality and accuracy
- Evaluates compliance with development standards
- Tracks quality improvement trends over time

### Compliance Assessment
- Assesses adherence to spec-driven development methodology
- Evaluates specification-to-implementation traceability
- Analyzes requirement coverage and completeness
- Tracks testing strategy implementation
- Evaluates documentation maintenance and updates
- Assesses deployment and monitoring compliance

### Metrics and KPIs
- Generates development velocity and throughput metrics
- Tracks specification quality scores and trends
- Analyzes implementation efficiency and accuracy
- Tracks testing coverage and quality metrics
- Monitors documentation completeness and accuracy
- Generates stakeholder satisfaction metrics

## Analysis Categories

### Workflow Efficiency Analysis
- **Process Flow**: Analyzes development process flow and efficiency
- **Bottleneck Identification**: Identifies workflow bottlenecks and delays
- **Resource Utilization**: Analyzes team and resource utilization
- **Timeline Analysis**: Tracks project timelines and milestone achievement
- **Optimization Opportunities**: Identifies workflow optimization opportunities

### Progress Analysis
- **Specification Progress**: Tracks specification development and approval
- **Implementation Progress**: Monitors code implementation against specs
- **Testing Progress**: Tracks testing and quality assurance progress
- **Documentation Progress**: Monitors documentation generation and updates
- **Deployment Progress**: Tracks deployment and release progress

### Quality Analysis
- **Specification Quality**: Analyzes specification completeness and quality
- **Code Quality**: Evaluates code quality against specifications
- **Testing Quality**: Analyzes testing coverage and effectiveness
- **Documentation Quality**: Evaluates documentation accuracy and completeness
- **Overall Quality**: Tracks overall project quality metrics

### Compliance Analysis
- **Methodology Compliance**: Assesses adherence to spec-driven development
- **Standard Compliance**: Evaluates compliance with development standards
- **Process Compliance**: Analyzes adherence to defined processes
- **Quality Compliance**: Tracks compliance with quality standards
- **Documentation Compliance**: Evaluates documentation standards compliance

## Reporting and Visualization

### Progress Reports
- **Status Dashboards**: Visual progress tracking and status reporting
- **Milestone Reports**: Milestone achievement and timeline analysis
- **Sprint Reports**: Sprint progress and velocity analysis
- **Release Reports**: Release progress and quality metrics
- **Stakeholder Reports**: Executive and stakeholder progress summaries

### Quality Reports
- **Quality Dashboards**: Visual quality metrics and trends
- **Specification Quality**: Specification completeness and quality scores
- **Code Quality**: Code quality metrics and improvement trends
- **Testing Quality**: Testing coverage and effectiveness metrics
- **Documentation Quality**: Documentation accuracy and completeness scores

### Compliance Reports
- **Compliance Dashboards**: Visual compliance tracking and reporting
- **Methodology Compliance**: Spec-driven development compliance metrics
- **Standard Compliance**: Development standard compliance tracking
- **Process Compliance**: Process adherence and improvement tracking
- **Quality Compliance**: Quality standard compliance monitoring

### Trend Analysis
- **Historical Trends**: Long-term development trend analysis
- **Quality Trends**: Quality improvement trend tracking
- **Productivity Trends**: Team productivity and efficiency trends
- **Compliance Trends**: Compliance improvement trend analysis
- **Performance Trends**: Overall performance trend monitoring

## Metrics and KPIs

### Development Velocity
- **Specification Velocity**: Specifications completed per time period
- **Implementation Velocity**: Features implemented per time period
- **Testing Velocity**: Tests written and executed per time period
- **Documentation Velocity**: Documentation generated per time period
- **Overall Velocity**: Overall development progress per time period

### Quality Metrics
- **Specification Quality Score**: Overall specification quality rating
- **Code Quality Score**: Code quality against specifications
- **Testing Coverage**: Test coverage percentage and quality
- **Documentation Completeness**: Documentation completeness percentage
- **Overall Quality Score**: Combined quality metric

### Compliance Metrics
- **Methodology Compliance**: Spec-driven development compliance percentage
- **Standard Compliance**: Development standard compliance percentage
- **Process Compliance**: Process adherence percentage
- **Quality Compliance**: Quality standard compliance percentage
- **Overall Compliance**: Combined compliance metric

### Efficiency Metrics
- **Time to Specification**: Average time to complete specifications
- **Time to Implementation**: Average time to implement features
- **Time to Testing**: Average time to complete testing
- **Time to Documentation**: Average time to generate documentation
- **Overall Cycle Time**: End-to-end development cycle time

## Recommendations and Insights

### Workflow Optimization
- **Process Improvements**: Recommendations for workflow optimization
- **Tool Recommendations**: Suggestions for development tools and automation
- **Training Recommendations**: Team training and skill development suggestions
- **Resource Optimization**: Resource allocation and utilization recommendations
- **Timeline Optimization**: Project timeline and milestone optimization

### Quality Improvements
- **Specification Improvements**: Recommendations for specification quality
- **Code Quality Improvements**: Suggestions for code quality enhancement
- **Testing Improvements**: Recommendations for testing strategy and coverage
- **Documentation Improvements**: Suggestions for documentation quality
- **Overall Quality**: Comprehensive quality improvement recommendations

### Compliance Enhancements
- **Methodology Compliance**: Recommendations for spec-driven development compliance
- **Standard Compliance**: Suggestions for development standard compliance
- **Process Compliance**: Recommendations for process adherence
- **Quality Compliance**: Suggestions for quality standard compliance
- **Overall Compliance**: Comprehensive compliance improvement recommendations

## Integration
- Works with `/check-specs` for specification analysis
- Connects to `/validate-specs` for quality assessment
- Links to `/generate-docs` for documentation analysis
- Integrates with `/review` for quality review analysis
- Works with `/status` for project status analysis

## Automation Features
- **Automated Analysis**: Continuous workflow analysis and monitoring
- **Real-time Reporting**: Real-time progress and quality reporting
- **Alert System**: Automated alerts for issues and bottlenecks
- **Trend Monitoring**: Continuous trend analysis and reporting
- **Performance Tracking**: Automated performance metric tracking
- **Compliance Monitoring**: Continuous compliance monitoring and reporting

## Implementation

- CLI script: `.cursor/scripts/analyze-workflow.js`
- Run locally: `node .cursor/scripts/analyze-workflow.js [scope]`
- Integrated shorthand: `/analyze-workflow [scope]`

Scopes supported:
- `progress`, `quality`, `compliance`, `metrics`, `bottlenecks`, `recommendations`, `trends`, or no scope for all.

Data sources:
- Summary: `TASK_STATUS_UPDATE_SUMMARY.md`
- Specs: `.cursor/.specify/specs/`
- Templates: `.cursor/.specify/templates/`
- Docs: `docs/`
- Rules: `.cursor/rules/spec-driven-development.md`