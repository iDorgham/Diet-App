# Unit Test Template

## Overview
This template provides a consistent structure for creating unit tests in the Diet Game application using Vitest and React Testing Library.

## Template Structure

```typescript
// src/test/[category]/[componentName].test.tsx

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Component under test
import { [ComponentName] } from '../../components/[path]/[ComponentName]';

// Dependencies and mocks
import * as [serviceName] from '../../services/[serviceName]';
import * as [hookName] from '../../hooks/[hookName]';

// ============================================================================
// MOCK SETUP
// ============================================================================

// Mock external dependencies
vi.mock('../../services/[serviceName]', () => ({
  [serviceFunction]: vi.fn(),
}));

vi.mock('../../hooks/[hookName]', () => ({
  use[HookName]: vi.fn(),
}));

// Mock React Router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ id: 'test-id' }),
  };
});

// ============================================================================
// TEST DATA
// ============================================================================

const mock[DataType] = {
  id: 'test-id',
  name: 'Test [Data]',
  // Add other properties
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mock[DataType]List = [
  mock[DataType],
  {
    id: 'test-id-2',
    name: 'Test [Data] 2',
    // Add other properties
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
];

// ============================================================================
// TEST UTILITIES
// ============================================================================

/**
 * Creates a test query client
 */
function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Renders component with necessary providers
 */
function renderWithProviders(ui: React.ReactElement, options = {}) {
  const queryClient = createTestQueryClient();
  
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>,
    options
  );
}

/**
 * Waits for async operations to complete
 */
async function waitForAsync() {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
  });
}

// ============================================================================
// TEST SUITE
// ============================================================================

describe('[ComponentName]', () => {
  let queryClient: QueryClient;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    user = userEvent.setup();
    
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mock implementations
    vi.mocked([serviceName].[serviceFunction]).mockResolvedValue(mock[DataType]);
    vi.mocked([hookName].use[HookName]).mockReturnValue({
      data: mock[DataType],
      isLoading: false,
      error: null,
      // Add other hook return values
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ============================================================================
  // RENDERING TESTS
  // ============================================================================

  describe('Rendering', () => {
    it('renders without crashing', () => {
      renderWithProviders(<[ComponentName] />);
      expect(screen.getByTestId('[component-name]')).toBeInTheDocument();
    });

    it('renders with required props', () => {
      renderWithProviders(
        <[ComponentName] 
          prop1="test-value"
          prop2={123}
        />
      );
      
      expect(screen.getByText('test-value')).toBeInTheDocument();
    });

    it('renders loading state', () => {
      vi.mocked([hookName].use[HookName]).mockReturnValue({
        data: null,
        isLoading: true,
        error: null,
      });

      renderWithProviders(<[ComponentName] />);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('renders error state', () => {
      const errorMessage = 'Test error message';
      vi.mocked([hookName].use[HookName]).mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error(errorMessage),
      });

      renderWithProviders(<[ComponentName] />);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('renders empty state when no data', () => {
      vi.mocked([hookName].use[HookName]).mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      });

      renderWithProviders(<[ComponentName] />);
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  // ============================================================================
  // INTERACTION TESTS
  // ============================================================================

  describe('User Interactions', () => {
    it('handles button click', async () => {
      const mockOnClick = vi.fn();
      
      renderWithProviders(
        <[ComponentName] onButtonClick={mockOnClick} />
      );
      
      const button = screen.getByRole('button', { name: /click me/i });
      await user.click(button);
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('handles form submission', async () => {
      const mockOnSubmit = vi.fn();
      
      renderWithProviders(
        <[ComponentName] onSubmit={mockOnSubmit} />
      );
      
      const input = screen.getByLabelText(/name/i);
      const submitButton = screen.getByRole('button', { name: /submit/i });
      
      await user.type(input, 'Test Name');
      await user.click(submitButton);
      
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Test Name',
      });
    });

    it('handles input changes', async () => {
      renderWithProviders(<[ComponentName] />);
      
      const input = screen.getByLabelText(/search/i);
      await user.type(input, 'test query');
      
      expect(input).toHaveValue('test query');
    });

    it('handles keyboard navigation', async () => {
      renderWithProviders(<[ComponentName] />);
      
      const firstButton = screen.getByRole('button', { name: /first/i });
      const secondButton = screen.getByRole('button', { name: /second/i });
      
      firstButton.focus();
      await user.keyboard('{Tab}');
      
      expect(secondButton).toHaveFocus();
    });
  });

  // ============================================================================
  // DATA FETCHING TESTS
  // ============================================================================

  describe('Data Fetching', () => {
    it('fetches data on mount', async () => {
      renderWithProviders(<[ComponentName] />);
      
      await waitFor(() => {
        expect([serviceName].[serviceFunction]).toHaveBeenCalledWith('test-id');
      });
    });

    it('refetches data when dependencies change', async () => {
      const { rerender } = renderWithProviders(
        <[ComponentName] id="test-id-1" />
      );
      
      await waitFor(() => {
        expect([serviceName].[serviceFunction]).toHaveBeenCalledWith('test-id-1');
      });
      
      rerender(<[ComponentName] id="test-id-2" />);
      
      await waitFor(() => {
        expect([serviceName].[serviceFunction]).toHaveBeenCalledWith('test-id-2');
      });
    });

    it('handles fetch errors gracefully', async () => {
      const errorMessage = 'Failed to fetch data';
      vi.mocked([serviceName].[serviceFunction]).mockRejectedValue(
        new Error(errorMessage)
      );
      
      renderWithProviders(<[ComponentName] />);
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // MUTATION TESTS
  // ============================================================================

  describe('Mutations', () => {
    it('creates new item successfully', async () => {
      const mockCreate = vi.fn().mockResolvedValue(mock[DataType]);
      vi.mocked([serviceName].create[DataType]).mockImplementation(mockCreate);
      
      renderWithProviders(<[ComponentName] />);
      
      const createButton = screen.getByRole('button', { name: /create/i });
      await user.click(createButton);
      
      await waitFor(() => {
        expect(mockCreate).toHaveBeenCalledWith({
          name: 'New Item',
        });
      });
    });

    it('updates existing item successfully', async () => {
      const mockUpdate = vi.fn().mockResolvedValue(mock[DataType]);
      vi.mocked([serviceName].update[DataType]).mockImplementation(mockUpdate);
      
      renderWithProviders(<[ComponentName] />);
      
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);
      
      const nameInput = screen.getByLabelText(/name/i);
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Name');
      
      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);
      
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith({
          id: 'test-id',
          name: 'Updated Name',
        });
      });
    });

    it('deletes item successfully', async () => {
      const mockDelete = vi.fn().mockResolvedValue(undefined);
      vi.mocked([serviceName].delete[DataType]).mockImplementation(mockDelete);
      
      renderWithProviders(<[ComponentName] />);
      
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);
      
      // Confirm deletion in modal
      const confirmButton = screen.getByRole('button', { name: /confirm/i });
      await user.click(confirmButton);
      
      await waitFor(() => {
        expect(mockDelete).toHaveBeenCalledWith('test-id');
      });
    });

    it('handles mutation errors', async () => {
      const errorMessage = 'Failed to save';
      vi.mocked([serviceName].create[DataType]).mockRejectedValue(
        new Error(errorMessage)
      );
      
      renderWithProviders(<[ComponentName] />);
      
      const createButton = screen.getByRole('button', { name: /create/i });
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      renderWithProviders(<[ComponentName] />);
      
      expect(screen.getByLabelText(/search/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      renderWithProviders(<[ComponentName] />);
      
      const firstFocusable = screen.getByRole('button', { name: /first/i });
      const secondFocusable = screen.getByRole('button', { name: /second/i });
      
      firstFocusable.focus();
      expect(firstFocusable).toHaveFocus();
      
      await user.keyboard('{Tab}');
      expect(secondFocusable).toHaveFocus();
    });

    it('announces changes to screen readers', async () => {
      renderWithProviders(<[ComponentName] />);
      
      const button = screen.getByRole('button', { name: /toggle/i });
      await user.click(button);
      
      expect(screen.getByRole('status')).toHaveTextContent('Status updated');
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe('Edge Cases', () => {
    it('handles empty data gracefully', () => {
      vi.mocked([hookName].use[HookName]).mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      });
      
      renderWithProviders(<[ComponentName] />);
      expect(screen.getByText('No items found')).toBeInTheDocument();
    });

    it('handles very long text', () => {
      const longText = 'a'.repeat(1000);
      
      renderWithProviders(
        <[ComponentName] text={longText} />
      );
      
      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('handles special characters in input', async () => {
      renderWithProviders(<[ComponentName] />);
      
      const input = screen.getByLabelText(/name/i);
      await user.type(input, 'Test@#$%^&*()');
      
      expect(input).toHaveValue('Test@#$%^&*()');
    });

    it('handles rapid user interactions', async () => {
      renderWithProviders(<[ComponentName] />);
      
      const button = screen.getByRole('button', { name: /click me/i });
      
      // Rapid clicks
      await user.click(button);
      await user.click(button);
      await user.click(button);
      
      // Should handle debouncing or prevent duplicate actions
      await waitFor(() => {
        expect(screen.getByText('Action completed')).toBeInTheDocument();
      });
    });
  });

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  describe('Integration', () => {
    it('works with multiple components', async () => {
      renderWithProviders(
        <div>
          <[ComponentName] />
          <OtherComponent />
        </div>
      );
      
      // Test interaction between components
      const button = screen.getByRole('button', { name: /interact/i });
      await user.click(button);
      
      expect(screen.getByTestId('other-component')).toHaveTextContent('Updated');
    });

    it('maintains state across re-renders', async () => {
      const { rerender } = renderWithProviders(<[ComponentName] />);
      
      const input = screen.getByLabelText(/name/i);
      await user.type(input, 'Test Name');
      
      rerender(<[ComponentName] />);
      
      expect(input).toHaveValue('Test Name');
    });
  });
});
```

## Test Configuration

### Vitest Configuration
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test Setup
```typescript
// src/test/setup.ts
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
```

## Best Practices

1. **Test Structure**: Follow the AAA pattern (Arrange, Act, Assert)
2. **Mocking**: Mock external dependencies and services
3. **Accessibility**: Test keyboard navigation and screen reader support
4. **Edge Cases**: Test error states, empty data, and boundary conditions
5. **User Interactions**: Test real user interactions with userEvent
6. **Async Operations**: Use waitFor for async operations
7. **Cleanup**: Properly clean up mocks and subscriptions
8. **Coverage**: Aim for high test coverage of critical paths

## Dependencies

Make sure to install required dependencies:
```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test [ComponentName].test.tsx
```