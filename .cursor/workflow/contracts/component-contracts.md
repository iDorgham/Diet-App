# Component Integration Contracts

## Overview

This document defines the contracts for component integration in the Diet Game application, including UI components, form components, navigation components, and their integration patterns.

## Component Architecture

### Component Base Contract
```typescript
interface BaseComponent {
  id: string;
  name: string;
  version: string;
  type: 'ui' | 'form' | 'navigation' | 'layout' | 'feature';
  category: string;
  description: string;
  props: ComponentProps;
  events: ComponentEvents;
  slots?: ComponentSlots;
  dependencies: ComponentDependencies;
  accessibility: AccessibilityProps;
  responsive: ResponsiveProps;
  theme: ThemeProps;
}

interface ComponentProps {
  [key: string]: {
    type: string;
    required: boolean;
    default?: any;
    description: string;
    validation?: ValidationRule[];
  };
}

interface ComponentEvents {
  [key: string]: {
    payload: any;
    description: string;
    bubbles?: boolean;
  };
}

interface ComponentSlots {
  [key: string]: {
    description: string;
    fallback?: string;
  };
}

interface ComponentDependencies {
  internal: string[];
  external: Array<{
    name: string;
    version: string;
    type: 'npm' | 'cdn' | 'local';
  }>;
}

interface AccessibilityProps {
  ariaLabel?: string;
  ariaDescribedBy?: string;
  role?: string;
  tabIndex?: number;
  keyboardNavigation: boolean;
  screenReaderSupport: boolean;
}

interface ResponsiveProps {
  breakpoints: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
  mobileFirst: boolean;
  fluid: boolean;
}

interface ThemeProps {
  variants: string[];
  sizes: string[];
  colors: string[];
  darkMode: boolean;
  customProperties: string[];
}
```

## UI Components Contracts

### Button Component
```typescript
interface ButtonComponent extends BaseComponent {
  type: 'ui';
  category: 'interaction';
  props: {
    variant: {
      type: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
      required: true;
      default: 'primary';
    };
    size: {
      type: 'sm' | 'md' | 'lg' | 'xl';
      required: false;
      default: 'md';
    };
    disabled: {
      type: boolean;
      required: false;
      default: false;
    };
    loading: {
      type: boolean;
      required: false;
      default: false;
    };
    icon: {
      type: string;
      required: false;
    };
    iconPosition: {
      type: 'left' | 'right';
      required: false;
      default: 'left';
    };
    fullWidth: {
      type: boolean;
      required: false;
      default: false;
    };
    href: {
      type: string;
      required: false;
    };
    target: {
      type: '_blank' | '_self' | '_parent' | '_top';
      required: false;
      default: '_self';
    };
  };
  events: {
    click: {
      payload: {
        event: MouseEvent;
        button: ButtonComponent;
      };
      description: 'Fired when button is clicked';
    };
    focus: {
      payload: {
        event: FocusEvent;
        button: ButtonComponent;
      };
      description: 'Fired when button receives focus';
    };
    blur: {
      payload: {
        event: FocusEvent;
        button: ButtonComponent;
      };
      description: 'Fired when button loses focus';
    };
  };
  slots: {
    default: {
      description: 'Button content';
      fallback: 'Button';
    };
    icon: {
      description: 'Custom icon content';
    };
  };
}

// Button Usage Example
const buttonUsage: ComponentUsage<ButtonComponent> = {
  component: 'Button',
  props: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    loading: false,
    icon: 'plus',
    iconPosition: 'left',
    fullWidth: false
  },
  slots: {
    default: 'Add Task'
  },
  events: {
    click: (payload) => {
      console.log('Button clicked:', payload);
    }
  }
};
```

### Card Component
```typescript
interface CardComponent extends BaseComponent {
  type: 'ui';
  category: 'layout';
  props: {
    variant: {
      type: 'default' | 'elevated' | 'outlined' | 'filled';
      required: false;
      default: 'default';
    };
    padding: {
      type: 'none' | 'sm' | 'md' | 'lg' | 'xl';
      required: false;
      default: 'md';
    };
    shadow: {
      type: 'none' | 'sm' | 'md' | 'lg' | 'xl';
      required: false;
      default: 'md';
    };
    rounded: {
      type: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
      required: false;
      default: 'md';
    };
    interactive: {
      type: boolean;
      required: false;
      default: false;
    };
    loading: {
      type: boolean;
      required: false;
      default: false;
    };
  };
  events: {
    click: {
      payload: {
        event: MouseEvent;
        card: CardComponent;
      };
      description: 'Fired when card is clicked (if interactive)';
    };
    hover: {
      payload: {
        event: MouseEvent;
        card: CardComponent;
      };
      description: 'Fired when mouse enters card';
    };
    leave: {
      payload: {
        event: MouseEvent;
        card: CardComponent;
      };
      description: 'Fired when mouse leaves card';
    };
  };
  slots: {
    header: {
      description: 'Card header content';
    };
    body: {
      description: 'Card body content';
    };
    footer: {
      description: 'Card footer content';
    };
    default: {
      description: 'Card main content';
    };
  };
}
```

### Modal Component
```typescript
interface ModalComponent extends BaseComponent {
  type: 'ui';
  category: 'overlay';
  props: {
    open: {
      type: boolean;
      required: true;
    };
    size: {
      type: 'sm' | 'md' | 'lg' | 'xl' | 'full';
      required: false;
      default: 'md';
    };
    closable: {
      type: boolean;
      required: false;
      default: true;
    };
    closeOnOverlay: {
      type: boolean;
      required: false;
      default: true;
    };
    closeOnEscape: {
      type: boolean;
      required: false;
      default: true;
    };
    persistent: {
      type: boolean;
      required: false;
      default: false;
    };
    centered: {
      type: boolean;
      required: false;
      default: true;
    };
    scrollable: {
      type: boolean;
      required: false;
      default: true;
    };
    animation: {
      type: 'fade' | 'slide' | 'zoom' | 'none';
      required: false;
      default: 'fade';
    };
  };
  events: {
    open: {
      payload: {
        modal: ModalComponent;
      };
      description: 'Fired when modal opens';
    };
    close: {
      payload: {
        modal: ModalComponent;
        reason: 'overlay' | 'escape' | 'close-button' | 'programmatic';
      };
      description: 'Fired when modal closes';
    };
    beforeClose: {
      payload: {
        modal: ModalComponent;
        reason: string;
      };
      description: 'Fired before modal closes (can be prevented)';
    };
  };
  slots: {
    header: {
      description: 'Modal header content';
    };
    body: {
      description: 'Modal body content';
    };
    footer: {
      description: 'Modal footer content';
    };
    default: {
      description: 'Modal main content';
    };
  };
}
```

## Form Components Contracts

### Input Component
```typescript
interface InputComponent extends BaseComponent {
  type: 'form';
  category: 'input';
  props: {
    type: {
      type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
      required: false;
      default: 'text';
    };
    value: {
      type: string | number;
      required: false;
    };
    placeholder: {
      type: string;
      required: false;
    };
    label: {
      type: string;
      required: false;
    };
    helperText: {
      type: string;
      required: false;
    };
    error: {
      type: string;
      required: false;
    };
    disabled: {
      type: boolean;
      required: false;
      default: false;
    };
    readonly: {
      type: boolean;
      required: false;
      default: false;
    };
    required: {
      type: boolean;
      required: false;
      default: false;
    };
    size: {
      type: 'sm' | 'md' | 'lg';
      required: false;
      default: 'md';
    };
    variant: {
      type: 'default' | 'filled' | 'outlined';
      required: false;
      default: 'default';
    };
    icon: {
      type: string;
      required: false;
    };
    iconPosition: {
      type: 'left' | 'right';
      required: false;
      default: 'left';
    };
    clearable: {
      type: boolean;
      required: false;
      default: false;
    };
    maxLength: {
      type: number;
      required: false;
    };
    minLength: {
      type: number;
      required: false;
    };
    pattern: {
      type: string;
      required: false;
    };
    autocomplete: {
      type: string;
      required: false;
    };
  };
  events: {
    input: {
      payload: {
        value: string | number;
        event: InputEvent;
        input: InputComponent;
      };
      description: 'Fired on input value change';
    };
    change: {
      payload: {
        value: string | number;
        event: Event;
        input: InputComponent;
      };
      description: 'Fired on input value change (on blur)';
    };
    focus: {
      payload: {
        event: FocusEvent;
        input: InputComponent;
      };
      description: 'Fired when input receives focus';
    };
    blur: {
      payload: {
        event: FocusEvent;
        input: InputComponent;
      };
      description: 'Fired when input loses focus';
    };
    clear: {
      payload: {
        input: InputComponent;
      };
      description: 'Fired when clear button is clicked';
    };
  };
  slots: {
    prepend: {
      description: 'Content before input';
    };
    append: {
      description: 'Content after input';
    };
    label: {
      description: 'Custom label content';
    };
    helper: {
      description: 'Custom helper text content';
    };
    error: {
      description: 'Custom error content';
    };
  };
}
```

### Select Component
```typescript
interface SelectComponent extends BaseComponent {
  type: 'form';
  category: 'select';
  props: {
    value: {
      type: string | number | string[] | number[];
      required: false;
    };
    options: {
      type: SelectOption[];
      required: true;
    };
    multiple: {
      type: boolean;
      required: false;
      default: false;
    };
    placeholder: {
      type: string;
      required: false;
    };
    label: {
      type: string;
      required: false;
    };
    helperText: {
      type: string;
      required: false;
    };
    error: {
      type: string;
      required: false;
    };
    disabled: {
      type: boolean;
      required: false;
      default: false;
    };
    required: {
      type: boolean;
      required: false;
      default: false;
    };
    size: {
      type: 'sm' | 'md' | 'lg';
      required: false;
      default: 'md';
    };
    variant: {
      type: 'default' | 'filled' | 'outlined';
      required: false;
      default: 'default';
    };
    clearable: {
      type: boolean;
      required: false;
      default: false;
    };
    searchable: {
      type: boolean;
      required: false;
      default: false;
    };
    filterable: {
      type: boolean;
      required: false;
      default: false;
    };
    maxHeight: {
      type: number;
      required: false;
      default: 200;
    };
  };
  events: {
    change: {
      payload: {
        value: string | number | string[] | number[];
        option: SelectOption | SelectOption[];
        event: Event;
        select: SelectComponent;
      };
      description: 'Fired when selection changes';
    };
    open: {
      payload: {
        select: SelectComponent;
      };
      description: 'Fired when dropdown opens';
    };
    close: {
      payload: {
        select: SelectComponent;
      };
      description: 'Fired when dropdown closes';
    };
    search: {
      payload: {
        query: string;
        select: SelectComponent;
      };
      description: 'Fired when search query changes';
    };
    clear: {
      payload: {
        select: SelectComponent;
      };
      description: 'Fired when selection is cleared';
    };
  };
  slots: {
    option: {
      description: 'Custom option content';
    };
    empty: {
      description: 'Content when no options available';
    };
    loading: {
      description: 'Content when loading options';
    };
  };
}

interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
  icon?: string;
  description?: string;
}
```

### Form Component
```typescript
interface FormComponent extends BaseComponent {
  type: 'form';
  category: 'container';
  props: {
    model: {
      type: Record<string, any>;
      required: true;
    };
    rules: {
      type: ValidationRules;
      required: false;
    };
    validateOnChange: {
      type: boolean;
      required: false;
      default: true;
    };
    validateOnBlur: {
      type: boolean;
      required: false;
      default: true;
    };
    showValidationMessages: {
      type: boolean;
      required: false;
      default: true;
    };
    disabled: {
      type: boolean;
      required: false;
      default: false;
    };
    loading: {
      type: boolean;
      required: false;
      default: false;
    };
    size: {
      type: 'sm' | 'md' | 'lg';
      required: false;
      default: 'md';
    };
    layout: {
      type: 'vertical' | 'horizontal' | 'inline';
      required: false;
      default: 'vertical';
    };
    labelWidth: {
      type: string | number;
      required: false;
    };
    labelPosition: {
      type: 'left' | 'right' | 'top';
      required: false;
      default: 'right';
    };
  };
  events: {
    submit: {
      payload: {
        model: Record<string, any>;
        valid: boolean;
        errors: ValidationErrors;
        form: FormComponent;
      };
      description: 'Fired when form is submitted';
    };
    validate: {
      payload: {
        field: string;
        value: any;
        valid: boolean;
        error: string;
        form: FormComponent;
      };
      description: 'Fired when field is validated';
    };
    reset: {
      payload: {
        form: FormComponent;
      };
      description: 'Fired when form is reset';
    };
    change: {
      payload: {
        field: string;
        value: any;
        model: Record<string, any>;
        form: FormComponent;
      };
      description: 'Fired when form data changes';
    };
  };
  slots: {
    default: {
      description: 'Form fields content';
    };
    actions: {
      description: 'Form action buttons';
    };
  };
}
```

## Navigation Components Contracts

### Navigation Component
```typescript
interface NavigationComponent extends BaseComponent {
  type: 'navigation';
  category: 'menu';
  props: {
    items: {
      type: NavigationItem[];
      required: true;
    };
    orientation: {
      type: 'horizontal' | 'vertical';
      required: false;
      default: 'horizontal';
    };
    variant: {
      type: 'default' | 'tabs' | 'pills' | 'underline';
      required: false;
      default: 'default';
    };
    size: {
      type: 'sm' | 'md' | 'lg';
      required: false;
      default: 'md';
    };
    activeItem: {
      type: string;
      required: false;
    };
    disabled: {
      type: boolean;
      required: false;
      default: false;
    };
    collapsible: {
      type: boolean;
      required: false;
      default: false;
    };
    collapsed: {
      type: boolean;
      required: false;
      default: false;
    };
    showIcons: {
      type: boolean;
      required: false;
      default: true;
    };
    showLabels: {
      type: boolean;
      required: false;
      default: true;
    };
  };
  events: {
    select: {
      payload: {
        item: NavigationItem;
        index: number;
        navigation: NavigationComponent;
      };
      description: 'Fired when navigation item is selected';
    };
    toggle: {
      payload: {
        collapsed: boolean;
        navigation: NavigationComponent;
      };
      description: 'Fired when navigation is toggled';
    };
  };
  slots: {
    item: {
      description: 'Custom navigation item content';
    };
    toggle: {
      description: 'Custom toggle button content';
    };
  };
}

interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  route?: string;
  disabled?: boolean;
  badge?: {
    text: string;
    variant: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  };
  children?: NavigationItem[];
  meta?: Record<string, any>;
}
```

### Breadcrumb Component
```typescript
interface BreadcrumbComponent extends BaseComponent {
  type: 'navigation';
  category: 'breadcrumb';
  props: {
    items: {
      type: BreadcrumbItem[];
      required: true;
    };
    separator: {
      type: string;
      required: false;
      default: '/';
    };
    maxItems: {
      type: number;
      required: false;
    };
    showHome: {
      type: boolean;
      required: false;
      default: true;
    };
    homeIcon: {
      type: string;
      required: false;
      default: 'home';
    };
    homeLabel: {
      type: string;
      required: false;
      default: 'Home';
    };
    homeHref: {
      type: string;
      required: false;
      default: '/';
    };
    size: {
      type: 'sm' | 'md' | 'lg';
      required: false;
      default: 'md';
    };
  };
  events: {
    click: {
      payload: {
        item: BreadcrumbItem;
        index: number;
        breadcrumb: BreadcrumbComponent;
      };
      description: 'Fired when breadcrumb item is clicked';
    };
  };
  slots: {
    item: {
      description: 'Custom breadcrumb item content';
    };
    separator: {
      description: 'Custom separator content';
    };
  };
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  route?: string;
  icon?: string;
  disabled?: boolean;
  current?: boolean;
}
```

## Feature Components Contracts

### TaskCard Component
```typescript
interface TaskCardComponent extends BaseComponent {
  type: 'feature';
  category: 'task';
  props: {
    task: {
      type: Task;
      required: true;
    };
    showProgress: {
      type: boolean;
      required: false;
      default: true;
    };
    showActions: {
      type: boolean;
      required: false;
      default: true;
    };
    showRewards: {
      type: boolean;
      required: false;
      default: true;
    };
    showDueDate: {
      type: boolean;
      required: false;
      default: true;
    };
    showTags: {
      type: boolean;
      required: false;
      default: true;
    };
    compact: {
      type: boolean;
      required: false;
      default: false;
    };
    interactive: {
      type: boolean;
      required: false;
      default: true;
    };
    status: {
      type: 'pending' | 'in_progress' | 'completed' | 'cancelled';
      required: false;
    };
  };
  events: {
    complete: {
      payload: {
        task: Task;
        taskCard: TaskCardComponent;
      };
      description: 'Fired when task is completed';
    };
    start: {
      payload: {
        task: Task;
        taskCard: TaskCardComponent;
      };
      description: 'Fired when task is started';
    };
    cancel: {
      payload: {
        task: Task;
        taskCard: TaskCardComponent;
      };
      description: 'Fired when task is cancelled';
    };
    edit: {
      payload: {
        task: Task;
        taskCard: TaskCardComponent;
      };
      description: 'Fired when task edit is requested';
    };
    delete: {
      payload: {
        task: Task;
        taskCard: TaskCardComponent;
      };
      description: 'Fired when task deletion is requested';
    };
  };
  slots: {
    header: {
      description: 'Custom task header content';
    };
    body: {
      description: 'Custom task body content';
    };
    footer: {
      description: 'Custom task footer content';
    };
    actions: {
      description: 'Custom task action buttons';
    };
  };
}
```

### MealCard Component
```typescript
interface MealCardComponent extends BaseComponent {
  type: 'feature';
  category: 'meal';
  props: {
    meal: {
      type: Meal;
      required: true;
    };
    showNutrition: {
      type: boolean;
      required: false;
      default: true;
    };
    showIngredients: {
      type: boolean;
      required: false;
      default: true;
    };
    showActions: {
      type: boolean;
      required: false;
      default: true;
    };
    showRating: {
      type: boolean;
      required: false;
      default: true;
    };
    showImage: {
      type: boolean;
      required: false;
      default: true;
    };
    compact: {
      type: boolean;
      required: false;
      default: false;
    };
    interactive: {
      type: boolean;
      required: false;
      default: true;
    };
  };
  events: {
    edit: {
      payload: {
        meal: Meal;
        mealCard: MealCardComponent;
      };
      description: 'Fired when meal edit is requested';
    };
    delete: {
      payload: {
        meal: Meal;
        mealCard: MealCardComponent;
      };
      description: 'Fired when meal deletion is requested';
    };
    favorite: {
      payload: {
        meal: Meal;
        favorited: boolean;
        mealCard: MealCardComponent;
      };
      description: 'Fired when meal favorite status changes';
    };
    rate: {
      payload: {
        meal: Meal;
        rating: number;
        mealCard: MealCardComponent;
      };
      description: 'Fired when meal is rated';
    };
  };
  slots: {
    header: {
      description: 'Custom meal header content';
    };
    body: {
      description: 'Custom meal body content';
    };
    footer: {
      description: 'Custom meal footer content';
    };
    image: {
      description: 'Custom meal image content';
    };
    nutrition: {
      description: 'Custom nutrition display content';
    };
  };
}
```

## Component Integration Patterns

### Component Composition
```typescript
interface ComponentComposition {
  // Higher-order component pattern
  withLoading<T extends BaseComponent>(Component: T): T & {
    props: T['props'] & {
      loading: {
        type: boolean;
        required: false;
        default: false;
      };
    };
  };
  
  // Component wrapper pattern
  withValidation<T extends BaseComponent>(Component: T): T & {
    props: T['props'] & {
      rules: {
        type: ValidationRules;
        required: false;
      };
      error: {
        type: string;
        required: false;
      };
    };
  };
  
  // Feature enhancement pattern
  withAnalytics<T extends BaseComponent>(Component: T): T & {
    events: T['events'] & {
      track: {
        payload: {
          event: string;
          data: any;
        };
        description: 'Fired for analytics tracking';
      };
    };
  };
}
```

### Component State Management
```typescript
interface ComponentState {
  // Local state management
  useState<T>(initialValue: T): [T, (value: T) => void];
  
  // Computed properties
  useComputed<T>(computeFn: () => T, deps: any[]): T;
  
  // Side effects
  useEffect(effect: () => void | (() => void), deps: any[]): void;
  
  // Context sharing
  useContext<T>(context: ComponentContext<T>): T;
  
  // Event handling
  useEventHandler<T>(
    event: string,
    handler: (payload: T) => void,
    deps: any[]
  ): void;
}

interface ComponentContext<T> {
  name: string;
  defaultValue: T;
  provider: React.ComponentType<{ value: T; children: React.ReactNode }>;
}
```

### Component Testing Contracts
```typescript
interface ComponentTestSuite {
  // Unit tests
  unit: {
    props: {
      validProps: any[];
      invalidProps: any[];
      edgeCases: any[];
    };
    events: {
      [eventName: string]: {
        triggers: any[];
        expectedPayloads: any[];
      };
    };
    slots: {
      [slotName: string]: {
        content: any[];
        fallbacks: any[];
      };
    };
  };
  
  // Integration tests
  integration: {
    parentComponents: string[];
    childComponents: string[];
    dataFlow: Array<{
      from: string;
      to: string;
      data: any;
    }>;
  };
  
  // Accessibility tests
  accessibility: {
    keyboardNavigation: boolean;
    screenReader: boolean;
    colorContrast: boolean;
    focusManagement: boolean;
  };
  
  // Visual tests
  visual: {
    variants: string[];
    states: string[];
    responsive: boolean;
    darkMode: boolean;
  };
}
```

## Component Documentation Standards

### Component Documentation Template
```typescript
interface ComponentDocumentation {
  // Basic information
  name: string;
  version: string;
  description: string;
  category: string;
  tags: string[];
  
  // Usage examples
  examples: Array<{
    title: string;
    description: string;
    code: string;
    preview: string;
  }>;
  
  // API reference
  api: {
    props: ComponentProps;
    events: ComponentEvents;
    slots: ComponentSlots;
    methods: ComponentMethods;
  };
  
  // Design guidelines
  design: {
    principles: string[];
    do: string[];
    dont: string[];
    accessibility: string[];
    responsive: string[];
  };
  
  // Implementation notes
  implementation: {
    dependencies: ComponentDependencies;
    performance: string[];
    browserSupport: string[];
    knownIssues: string[];
  };
}
```

---

*Last updated: January 15, 2024*  
*Component Library Version: v1.2.0*
