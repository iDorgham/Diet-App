# Component Template

## Overview
This template provides a standardized structure for creating React components in the Diet Game application.

## Template Usage
Replace the following placeholders:
- `{{COMPONENT_NAME}}` - Name of the component (e.g., `UserProfile`, `TaskCard`)
- `{{DESCRIPTION}}` - Brief description of the component's purpose
- `{{PROPS_INTERFACE}}` - TypeScript interface for component props
- `{{COMPONENT_IMPLEMENTATION}}` - Component implementation details

## Component Structure

```typescript
import React from 'react';
import { motion } from 'framer-motion';
import { {{COMPONENT_NAME}}Props } from './types';

/**
 * {{DESCRIPTION}}
 * 
 * @param props - Component props
 * @returns JSX element
 */
export const {{COMPONENT_NAME}}: React.FC<{{COMPONENT_NAME}}Props> = ({
  // Destructure props here
  ...props
}) => {
  // Component state and hooks
  const [state, setState] = React.useState();
  
  // Event handlers
  const handleEvent = React.useCallback(() => {
    // Event handling logic
  }, []);
  
  // Render component
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="component-container"
    >
      {/* Component content */}
    </motion.div>
  );
};

export default {{COMPONENT_NAME}};
```

## Props Interface

```typescript
export interface {{COMPONENT_NAME}}Props {
  // Define props here
  className?: string;
  children?: React.ReactNode;
  // Add specific props for your component
}
```

## Styling

```css
/* Component styles */
.component-container {
  /* Base styles */
}

.component-container:hover {
  /* Hover styles */
}

.component-container:focus {
  /* Focus styles */
}

/* Responsive styles */
@media (max-width: 768px) {
  .component-container {
    /* Mobile styles */
  }
}
```

## Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { {{COMPONENT_NAME}} } from './{{COMPONENT_NAME}}';

describe('{{COMPONENT_NAME}}', () => {
  const defaultProps = {
    // Default props for testing
  };

  it('renders correctly', () => {
    render(<{{COMPONENT_NAME}} {...defaultProps} />);
    // Add assertions
  });

  it('handles user interactions', () => {
    render(<{{COMPONENT_NAME}} {...defaultProps} />);
    // Test user interactions
  });

  it('applies custom className', () => {
    const customClass = 'custom-class';
    render(<{{COMPONENT_NAME}} {...defaultProps} className={customClass} />);
    // Test className application
  });
});
```

## Storybook Story

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { {{COMPONENT_NAME}} } from './{{COMPONENT_NAME}}';

const meta: Meta<typeof {{COMPONENT_NAME}}> = {
  title: 'Components/{{COMPONENT_NAME}}',
  component: {{COMPONENT_NAME}},
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    // Define argTypes for Storybook controls
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Default story args
  },
};

export const WithCustomProps: Story = {
  args: {
    // Custom story args
  },
};
```

## Accessibility

```typescript
// Accessibility considerations
export const {{COMPONENT_NAME}}: React.FC<{{COMPONENT_NAME}}Props> = (props) => {
  return (
    <div
      role="region"
      aria-label="Component description"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {/* Accessible content */}
    </div>
  );
};
```

## Performance Optimization

```typescript
// Memoization for performance
export const {{COMPONENT_NAME}} = React.memo<{{COMPONENT_NAME}}Props>((props) => {
  // Component implementation
});

// Lazy loading for large components
export const {{COMPONENT_NAME}} = React.lazy(() => import('./{{COMPONENT_NAME}}'));
```

## Documentation

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `prop1` | `string` | `''` | Description of prop1 |
| `prop2` | `number` | `0` | Description of prop2 |

### Events
| Event | Description | Payload |
|-------|-------------|---------|
| `onClick` | Fired when component is clicked | `MouseEvent` |
| `onChange` | Fired when value changes | `string` |

### Examples

```typescript
// Basic usage
<{{COMPONENT_NAME}} prop1="value" prop2={42} />

// With event handlers
<{{COMPONENT_NAME}} 
  prop1="value" 
  onClick={handleClick}
  onChange={handleChange}
/>
```

## Best Practices

1. **Type Safety**: Always define TypeScript interfaces for props
2. **Accessibility**: Include proper ARIA labels and keyboard navigation
3. **Performance**: Use React.memo for expensive components
4. **Testing**: Write comprehensive unit tests
5. **Documentation**: Document all props and events
6. **Styling**: Use consistent CSS classes and responsive design
7. **Error Handling**: Implement proper error boundaries
8. **Animation**: Use Framer Motion for smooth animations

## Related Components

- `RelatedComponent1` - Description of relationship
- `RelatedComponent2` - Description of relationship

## Changelog

### v1.0.0
- Initial implementation
- Basic functionality
- TypeScript support

### v1.1.0
- Added new feature
- Performance improvements
- Bug fixes
