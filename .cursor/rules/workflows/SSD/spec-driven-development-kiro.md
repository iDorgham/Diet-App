# Kiro Methodology: A Spec-Driven Development Workflow

## 1. Overview

This document outlines the Kiro Methodology, a Spec-Driven Development (SDD) workflow adopted for the Diet Game project. This approach ensures that all development is directly tied to clear, pre-defined specifications, leading to higher quality, better consistency, and increased efficiency. The core of this methodology is the structured use of specification files located in the `/` directory.

## 2. Core Principles

- **Specs-First Development**: Every feature, bug fix, or enhancement begins with a specification. Code should not be written until the `requirements.md` and `design.md` are clear.
- **Clear Separation of Concerns**: The `requirements.md` (the "what"), `design.md` (the "how"), and `tasks.md` (the "plan") provide distinct guides for different stages and roles in the development process.
- **Role-Based Workflow**: Each team member (Product Manager, Developer, QA Engineer) has a primary set of documents to guide their work, ensuring clarity and focus.
- **AI-Assisted Implementation**: Use Gemini with the full context of the relevant specification files (`@.cursor/workflow/specs/...`) to generate code that is accurate, consistent, and aligned with the project architecture.

## 3. The Specification Structure

All work revolves around the specifications located under `.cursor/workflow/specs/`. Each major component has its own directory containing three key files:

-   **`requirements.md`**: **What to Build.** Defines the business needs, user stories, EARS requirements, and acceptance criteria. This is the source of truth for functionality.
-   **`design.md`**: **How to Build It.** Outlines the technical architecture, data models, API specifications, and implementation patterns. This is the blueprint for the code.
-   **`tasks.md`**: **The Implementation Plan.** Provides a step-by-step breakdown of the development work, including tasks, subtasks, and testing strategies.

## 4. The Development Workflow

Follow these steps to implement any new feature or task.

### Step 1: Understand the Goal (Read `requirements.md`)

Before writing any code, thoroughly understand the feature's purpose.

-   **Action**: Use `.cursor/workflow/specs/{component_name}/requirements.md` in your prompt.
-   **Example Prompt**: `".cursor/workflow/specs/homepage/requirements.md Explain the EARS requirements for the dashboard metrics display."`

### Step 2: Analyze the Solution (Read `design.md`)

Once you understand what to build, review the technical plan for how to build it.

-   **Action**: Use `.cursor/workflow/specs/{component_name}/design.md` to understand the architecture and data models.
-   **Example Prompt**: `".cursor/workflow/specs/homepage/design.md Based on the component hierarchy, what props does the DashboardMetrics component expect?"`

### Step 3: Implement the Feature (Use `tasks.md`)

With a clear understanding of the what and the how, begin implementation by following the task breakdown. When generating code, provide the AI with all relevant context.

-   **Action**: Use `.cursor/workflow/specs/{component_name}/design.md` and `.cursor/workflow/specs/{component_name}/tasks.md` to generate code.
-   **Example Prompt**: `".cursor/workflow/specs/homepage/design.md .cursor/workflow/specs/homepage/tasks.md Generate the React component for the LevelCardWithXP as described in the design, following the implementation notes in task 1.3."`

### Step 4: Test and Validate

After implementation, verify that the code meets the acceptance criteria defined in the `requirements.md` file.

-   **Action**: Use `.cursor/workflow/specs/{component_name}/requirements.md` to create test cases or validate behavior.
-   **Example Prompt**: `".cursor/workflow/specs/homepage/requirements.md Write Vitest unit tests for the DaysCardWithStars component to ensure it correctly calculates and displays the star milestones based on the acceptance criteria for FR-HP-001."`

### Step 5: Refine and Iterate

Use feedback from testing and code reviews to refine the implementation. If changes to requirements or design are needed, update the corresponding specification documents first.

## 5. Best Practices for Prompts

-   **Always Provide Full Context**: The most effective way to use this methodology is to include the relevant spec files in your prompt using the `@` notation. This gives Gemini the necessary context to generate accurate and consistent code.
-   **Be Specific**: Reference specific EARS requirements, functional requirements (FR), or task numbers from the documents to focus the AI's attention.
-   **Chain Prompts for Complexity**: For complex features, break down the implementation into smaller steps, chaining prompts and feeding the output of one step as context for the next.

By adhering to this Spec-Driven Development workflow, the team can ensure that every piece of code is purposeful, well-designed, and directly traceable to a specific requirement, ultimately leading to a more robust and maintainable application.