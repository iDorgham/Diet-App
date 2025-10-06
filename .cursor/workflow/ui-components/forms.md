# Form Components Specification

## EARS Requirements

**EARS-UI-016**: The system shall provide form components with real-time validation and error handling.

**EARS-UI-017**: The system shall display input fields with floating labels and validation feedback.

**EARS-UI-018**: The system shall show form submission states with loading indicators and success/error messages.

**EARS-UI-019**: The system shall provide date/time pickers with calendar integration and timezone support.

**EARS-UI-020**: The system shall display file upload components with drag-and-drop functionality and progress tracking.

## Component Structure

### Form Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Form Title                                                  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Floating Label Input Field]                           │ │
│ │ [Validation Message]                                   │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Select Dropdown with Search]                          │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [Date/Time Picker]                                     │ │
│ └─────────────────────────────────────────────────────────┘ │
│ [Submit Button] [Cancel Button]                           │
└─────────────────────────────────────────────────────────────┘
```

### File Upload Layout
```
┌─────────────────────────────────────────────────────────────┐
│ File Upload Area                                            │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │     [📁] Drag & Drop Files Here                        │ │
│ │     or click to browse                                 │ │
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [File 1] [Progress Bar] [❌]                          │ │
│ │ [File 2] [Progress Bar] [❌]                          │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Technical Specifications

### Props Interfaces

#### FormProps
```typescript
interface FormProps {
  onSubmit: (data: any) => void | Promise<void>;
  onCancel?: () => void;
  initialValues?: Record<string, any>;
  validationSchema?: z.ZodSchema;
  isLoading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  showCancel?: boolean;
  className?: string;
  children: React.ReactNode;
}
```

#### InputFieldProps
```typescript
interface InputFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  autoComplete?: string;
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | undefined;
  };
  icon?: React.ComponentType;
  helperText?: string;
  className?: string;
}
```

#### SelectFieldProps
```typescript
interface SelectFieldProps {
  name: string;
  label: string;
  options: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
    group?: string;
  }>;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  validation?: {
    required?: boolean;
    custom?: (value: any) => string | undefined;
  };
  className?: string;
}
```

#### DatePickerProps
```typescript
interface DatePickerProps {
  name: string;
  label: string;
  value?: Date;
  onChange: (date: Date | null) => void;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  required?: boolean;
  showTime?: boolean;
  timezone?: string;
  format?: string;
  placeholder?: string;
  className?: string;
}
```

#### FileUploadProps
```typescript
interface FileUploadProps {
  name: string;
  label: string;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  onUpload: (files: File[]) => Promise<void>;
  onRemove?: (file: File) => void;
  disabled?: boolean;
  className?: string;
}
```

## Form Components

### Input Field Variants
```typescript
const inputVariants = {
  default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
  error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
  success: 'border-green-500 focus:border-green-500 focus:ring-green-500',
  disabled: 'border-gray-200 bg-gray-50 text-gray-500'
};
```

### Button Variants
```typescript
const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
  success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
  danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500'
};
```

### Validation States
```typescript
const validationStates = {
  default: 'text-gray-500',
  error: 'text-red-600',
  success: 'text-green-600',
  warning: 'text-yellow-600'
};
```

## Styling Requirements

### Color Scheme
- **Primary**: #3B82F6 (Blue 500)
- **Success**: #10B981 (Emerald 500)
- **Warning**: #F59E0B (Amber 500)
- **Error**: #EF4444 (Red 500)
- **Background**: #FFFFFF (White)
- **Border**: #D1D5DB (Gray 300)
- **Text**: #111827 (Gray 900)
- **Placeholder**: #9CA3AF (Gray 400)

### Responsive Design
- **Desktop**: Full form layout with side-by-side fields
- **Tablet**: Stacked layout with appropriate spacing
- **Mobile**: Single column layout with touch-friendly inputs

### Typography
- **Form Title**: 2xl font-bold
- **Field Labels**: sm font-medium
- **Input Text**: base font-normal
- **Helper Text**: xs font-normal
- **Button Text**: sm font-semibold

## Interactive Elements

### Input Interactions
- Floating label animations
- Focus state highlighting
- Real-time validation feedback
- Auto-complete suggestions

### Button Interactions
- Loading spinner on submission
- Disabled state management
- Hover and focus effects
- Click ripple animations

### File Upload Interactions
- Drag and drop visual feedback
- Progress bar animations
- File preview thumbnails
- Upload cancellation

## Validation System

### Real-time Validation
```typescript
const validationRules = {
  required: (value: any) => !value ? 'This field is required' : undefined,
  email: (value: string) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email format' : undefined,
  minLength: (min: number) => (value: string) => value.length < min ? `Minimum ${min} characters required` : undefined,
  maxLength: (max: number) => (value: string) => value.length > max ? `Maximum ${max} characters allowed` : undefined,
  pattern: (regex: RegExp, message: string) => (value: string) => !regex.test(value) ? message : undefined
};
```

### Form State Management
```typescript
interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}
```

## Data Sources

### Form Data
- User input values
- Validation rules
- Default values
- Submission handlers

### External Data
- API responses for async validation
- File upload progress
- Date/time picker data
- Select option data

## Accessibility Requirements

### ARIA Labels
- Proper form landmarks
- Field descriptions and error messages
- Required field indicators
- Validation state announcements

### Keyboard Navigation
- Tab order through form fields
- Enter to submit forms
- Escape to cancel/reset
- Arrow keys for select options

### Visual Indicators
- High contrast mode support
- Focus indicators for all interactive elements
- Color-blind friendly validation states
- Touch target size compliance

## Performance Considerations

### Optimization
- Debounce validation input
- Memoize form field rendering
- Lazy load file upload components
- Optimize re-renders with React.memo

### File Upload Performance
- Chunked file uploads for large files
- Progress tracking with WebSocket updates
- Client-side file validation
- Compression for image uploads

## Testing Requirements

### Unit Tests
- Form field rendering
- Validation rule execution
- Form submission handling
- File upload functionality

### Integration Tests
- Complete form submission flow
- Validation error handling
- File upload progress tracking
- Date picker interactions

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation flow
- Focus management
- Color contrast validation

## Implementation Notes

### Dependencies
- React Hook Form for form management
- Zod for validation schemas
- Framer Motion for animations
- React Dropzone for file uploads
- React DatePicker for date selection

### Error Handling
- Graceful validation error display
- Network error handling for submissions
- File upload error recovery
- Form state persistence

### Future Enhancements
- Multi-step form wizard
- Auto-save functionality
- Form field dependencies
- Advanced file upload features
- Form analytics and tracking
