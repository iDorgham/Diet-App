# Wizard Component Specification

## Overview
The Wizard Component provides a multi-step form interface for complex user workflows, enabling guided user experiences with progress tracking, validation, and navigation controls for the Diet Planner Game application.

## EARS Requirements

### Epic Requirements
- **EPIC-WC-001**: The system SHALL provide a wizard component for multi-step user workflows
- **EPIC-WC-002**: The system SHALL implement progress tracking and navigation controls
- **EPIC-WC-003**: The system SHALL ensure data validation and error handling across all steps

### Feature Requirements
- **FEAT-WC-001**: The system SHALL provide step-by-step navigation with progress indicators
- **FEAT-WC-002**: The system SHALL implement form validation for each step
- **FEAT-WC-003**: The system SHALL support conditional step display based on user input
- **FEAT-WC-004**: The system SHALL provide data persistence across wizard steps

### User Story Requirements
- **US-WC-001**: As a user, I want to complete complex forms step by step so that I don't feel overwhelmed
- **US-WC-002**: As a user, I want to see my progress so that I know how much is left to complete
- **US-WC-003**: As a user, I want to go back and edit previous steps so that I can correct mistakes

### Acceptance Criteria
- **AC-WC-001**: Given a wizard with multiple steps, when a user navigates through steps, then progress SHALL be displayed accurately
- **AC-WC-002**: Given invalid data in a step, when the user tries to proceed, then validation errors SHALL be displayed
- **AC-WC-003**: Given a user completes all steps, when they submit the wizard, then all data SHALL be validated and saved

## Component Architecture

### 1. Wizard Structure
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Wizard        │    │   Step          │    │   Navigation    │
│   Container     │    │   Components    │    │   Controls      │
│                 │    │                 │    │                 │
│ - State         │    │ - Form Fields   │    │ - Previous      │
│ - Validation    │    │ - Validation    │    │ - Next          │
│ - Navigation    │    │ - Error Display │    │ - Submit        │
│ - Data          │    │ - Conditional   │    │ - Progress      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Data Store    │
                    │                 │
                    │ - Step Data     │
                    │ - Validation    │
                    │ - Progress      │
                    │ - Persistence   │
                    └─────────────────┘
```

### 2. Component Hierarchy
```typescript
// Wizard component structure
interface WizardProps {
  steps: WizardStep[];
  onComplete: (data: WizardData) => void;
  onCancel?: () => void;
  initialData?: Partial<WizardData>;
  allowBackNavigation?: boolean;
  showProgress?: boolean;
  autoSave?: boolean;
}

interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<StepProps>;
  validation?: ValidationSchema;
  conditional?: (data: WizardData) => boolean;
  required?: boolean;
}

interface StepProps {
  data: WizardData;
  updateData: (updates: Partial<WizardData>) => void;
  errors: ValidationErrors;
  isActive: boolean;
  isCompleted: boolean;
}

interface WizardData {
  [key: string]: any;
}

interface ValidationErrors {
  [key: string]: string[];
}
```

## Implementation

### 1. Wizard Container Component
```typescript
// Wizard container component
import React, { useState, useEffect, useCallback } from 'react';
import { WizardProps, WizardStep, WizardData, ValidationErrors } from './types';

const Wizard: React.FC<WizardProps> = ({
  steps,
  onComplete,
  onCancel,
  initialData = {},
  allowBackNavigation = true,
  showProgress = true,
  autoSave = false
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [data, setData] = useState<WizardData>(initialData);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Auto-save functionality
  useEffect(() => {
    if (autoSave) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('wizard-data', JSON.stringify(data));
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [data, autoSave]);

  // Load saved data on mount
  useEffect(() => {
    if (autoSave) {
      const savedData = localStorage.getItem('wizard-data');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setData(prevData => ({ ...prevData, ...parsedData }));
        } catch (error) {
          console.error('Failed to load saved wizard data:', error);
        }
      }
    }
  }, [autoSave]);

  const updateData = useCallback((updates: Partial<WizardData>) => {
    setData(prevData => ({ ...prevData, ...updates }));
    // Clear errors for updated fields
    setErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      Object.keys(updates).forEach(key => {
        delete newErrors[key];
      });
      return newErrors;
    });
  }, []);

  const validateStep = useCallback((step: WizardStep, stepData: WizardData): ValidationErrors => {
    if (!step.validation) return {};

    const stepErrors: ValidationErrors = {};
    
    // Validate required fields
    if (step.required) {
      Object.keys(step.validation).forEach(field => {
        const value = stepData[field];
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          stepErrors[field] = [`${field} is required`];
        }
      });
    }

    // Validate field rules
    Object.entries(step.validation).forEach(([field, rules]) => {
      const value = stepData[field];
      const fieldErrors: string[] = [];

      if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        fieldErrors.push(`${field} is required`);
      }

      if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
        fieldErrors.push(`${field} must be at least ${rules.minLength} characters`);
      }

      if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
        fieldErrors.push(`${field} must be no more than ${rules.maxLength} characters`);
      }

      if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
        fieldErrors.push(`${field} format is invalid`);
      }

      if (rules.custom && typeof rules.custom === 'function') {
        const customError = rules.custom(value, stepData);
        if (customError) {
          fieldErrors.push(customError);
        }
      }

      if (fieldErrors.length > 0) {
        stepErrors[field] = fieldErrors;
      }
    });

    return stepErrors;
  }, []);

  const goToNextStep = useCallback(() => {
    const stepErrors = validateStep(currentStep, data);
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }

    // Mark current step as completed
    setCompletedSteps(prev => new Set([...prev, currentStepIndex]));
    setErrors({});

    if (isLastStep) {
      onComplete(data);
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [currentStep, data, validateStep, isLastStep, onComplete, currentStepIndex]);

  const goToPreviousStep = useCallback(() => {
    if (allowBackNavigation && !isFirstStep) {
      setCurrentStepIndex(prev => prev - 1);
      setErrors({});
    }
  }, [allowBackNavigation, isFirstStep]);

  const goToStep = useCallback((stepIndex: number) => {
    if (stepIndex >= 0 && stepIndex < steps.length) {
      setCurrentStepIndex(stepIndex);
      setErrors({});
    }
  }, [steps.length]);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  // Filter steps based on conditions
  const visibleSteps = steps.filter((step, index) => {
    if (step.conditional) {
      return step.conditional(data);
    }
    return true;
  });

  const currentVisibleStepIndex = visibleSteps.findIndex(step => step.id === currentStep.id);

  return (
    <div className="wizard-container">
      {showProgress && (
        <div className="wizard-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-text">
            Step {currentVisibleStepIndex + 1} of {visibleSteps.length}
          </div>
        </div>
      )}

      <div className="wizard-content">
        <div className="wizard-header">
          <h2 className="step-title">{currentStep.title}</h2>
          {currentStep.description && (
            <p className="step-description">{currentStep.description}</p>
          )}
        </div>

        <div className="wizard-body">
          <currentStep.component
            data={data}
            updateData={updateData}
            errors={errors}
            isActive={true}
            isCompleted={completedSteps.has(currentStepIndex)}
          />
        </div>

        <div className="wizard-footer">
          <div className="wizard-actions">
            {onCancel && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            )}

            {allowBackNavigation && !isFirstStep && (
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={goToPreviousStep}
              >
                Previous
              </button>
            )}

            <button 
              type="button" 
              className="btn btn-primary"
              onClick={goToNextStep}
            >
              {isLastStep ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wizard;
```

### 2. Step Component Example
```typescript
// Example step component for user profile setup
import React from 'react';
import { StepProps } from './types';

const UserProfileStep: React.FC<StepProps> = ({ data, updateData, errors }) => {
  const handleInputChange = (field: string, value: any) => {
    updateData({ [field]: value });
  };

  return (
    <div className="step-content">
      <div className="form-group">
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          value={data.firstName || ''}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          className={errors.firstName ? 'error' : ''}
        />
        {errors.firstName && (
          <div className="error-message">
            {errors.firstName.map((error, index) => (
              <span key={index}>{error}</span>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          value={data.lastName || ''}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          className={errors.lastName ? 'error' : ''}
        />
        {errors.lastName && (
          <div className="error-message">
            {errors.lastName.map((error, index) => (
              <span key={index}>{error}</span>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="dateOfBirth">Date of Birth</label>
        <input
          id="dateOfBirth"
          type="date"
          value={data.dateOfBirth || ''}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          className={errors.dateOfBirth ? 'error' : ''}
        />
        {errors.dateOfBirth && (
          <div className="error-message">
            {errors.dateOfBirth.map((error, index) => (
              <span key={index}>{error}</span>
            ))}
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="gender">Gender</label>
        <select
          id="gender"
          value={data.gender || ''}
          onChange={(e) => handleInputChange('gender', e.target.value)}
          className={errors.gender ? 'error' : ''}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
        {errors.gender && (
          <div className="error-message">
            {errors.gender.map((error, index) => (
              <span key={index}>{error}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileStep;
```

### 3. Validation Schema
```typescript
// Validation schema definition
interface ValidationSchema {
  [field: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any, data: any) => string | null;
  };
}

// Example validation schemas
export const userProfileValidation: ValidationSchema = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s]+$/
  },
  dateOfBirth: {
    required: true,
    custom: (value: string) => {
      if (!value) return 'Date of birth is required';
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 13) return 'You must be at least 13 years old';
      if (age > 120) return 'Please enter a valid date of birth';
      return null;
    }
  },
  gender: {
    required: true
  }
};

export const nutritionGoalsValidation: ValidationSchema = {
  goalType: {
    required: true
  },
  targetWeight: {
    required: true,
    custom: (value: number) => {
      if (!value) return 'Target weight is required';
      if (value < 30 || value > 300) return 'Please enter a valid weight (30-300 kg)';
      return null;
    }
  },
  targetCalories: {
    required: true,
    custom: (value: number) => {
      if (!value) return 'Target calories is required';
      if (value < 800 || value > 5000) return 'Please enter a valid calorie target (800-5000)';
      return null;
    }
  }
};
```

## Usage Examples

### 1. User Onboarding Wizard
```typescript
// User onboarding wizard implementation
import React from 'react';
import Wizard from './Wizard';
import UserProfileStep from './steps/UserProfileStep';
import NutritionGoalsStep from './steps/NutritionGoalsStep';
import DietaryPreferencesStep from './steps/DietaryPreferencesStep';
import HealthInfoStep from './steps/HealthInfoStep';

const OnboardingWizard: React.FC = () => {
  const steps = [
    {
      id: 'profile',
      title: 'Personal Information',
      description: 'Tell us about yourself to get started',
      component: UserProfileStep,
      validation: userProfileValidation,
      required: true
    },
    {
      id: 'goals',
      title: 'Nutrition Goals',
      description: 'What are your health and nutrition goals?',
      component: NutritionGoalsStep,
      validation: nutritionGoalsValidation,
      required: true
    },
    {
      id: 'preferences',
      title: 'Dietary Preferences',
      description: 'Any dietary restrictions or preferences?',
      component: DietaryPreferencesStep,
      validation: dietaryPreferencesValidation,
      required: false
    },
    {
      id: 'health',
      title: 'Health Information',
      description: 'Help us understand your current health status',
      component: HealthInfoStep,
      validation: healthInfoValidation,
      required: true,
      conditional: (data) => data.goalType === 'weight_loss' || data.goalType === 'muscle_gain'
    }
  ];

  const handleComplete = (data: any) => {
    console.log('Onboarding completed:', data);
    // Save user data and redirect to dashboard
  };

  const handleCancel = () => {
    console.log('Onboarding cancelled');
    // Redirect to home page
  };

  return (
    <Wizard
      steps={steps}
      onComplete={handleComplete}
      onCancel={handleCancel}
      allowBackNavigation={true}
      showProgress={true}
      autoSave={true}
    />
  );
};

export default OnboardingWizard;
```

### 2. Meal Planning Wizard
```typescript
// Meal planning wizard implementation
import React from 'react';
import Wizard from './Wizard';
import MealTypeStep from './steps/MealTypeStep';
import FoodSelectionStep from './steps/FoodSelectionStep';
import PortionSizeStep from './steps/PortionSizeStep';
import ReviewStep from './steps/ReviewStep';

const MealPlanningWizard: React.FC = () => {
  const steps = [
    {
      id: 'mealType',
      title: 'Meal Type',
      description: 'What type of meal are you planning?',
      component: MealTypeStep,
      validation: mealTypeValidation,
      required: true
    },
    {
      id: 'foodSelection',
      title: 'Food Selection',
      description: 'Choose the foods for your meal',
      component: FoodSelectionStep,
      validation: foodSelectionValidation,
      required: true
    },
    {
      id: 'portionSize',
      title: 'Portion Sizes',
      description: 'Adjust the portion sizes for each food',
      component: PortionSizeStep,
      validation: portionSizeValidation,
      required: true
    },
    {
      id: 'review',
      title: 'Review & Save',
      description: 'Review your meal plan and save it',
      component: ReviewStep,
      validation: reviewValidation,
      required: true
    }
  ];

  const handleComplete = (data: any) => {
    console.log('Meal plan created:', data);
    // Save meal plan and redirect to meal log
  };

  return (
    <Wizard
      steps={steps}
      onComplete={handleComplete}
      allowBackNavigation={true}
      showProgress={true}
      autoSave={true}
    />
  );
};

export default MealPlanningWizard;
```

## Styling and Theming

### 1. CSS Styles
```css
/* Wizard container styles */
.wizard-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.wizard-progress {
  margin-bottom: 30px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4CAF50, #45a049);
  transition: width 0.3s ease;
}

.progress-text {
  text-align: center;
  margin-top: 10px;
  color: #666;
  font-size: 14px;
}

.wizard-header {
  text-align: center;
  margin-bottom: 30px;
}

.step-title {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.step-description {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.wizard-body {
  margin-bottom: 30px;
}

.wizard-footer {
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
}

.wizard-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
}

.btn-secondary {
  background: #f44336;
  color: white;
}

.btn-secondary:hover {
  background: #da190b;
}

.btn-outline {
  background: transparent;
  color: #4CAF50;
  border: 2px solid #4CAF50;
}

.btn-outline:hover {
  background: #4CAF50;
  color: white;
}

/* Form styles */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #f44336;
}

.error-message {
  color: #f44336;
  font-size: 14px;
  margin-top: 5px;
}

.error-message span {
  display: block;
}
```

### 2. Responsive Design
```css
/* Responsive styles */
@media (max-width: 768px) {
  .wizard-container {
    margin: 10px;
    padding: 15px;
  }

  .step-title {
    font-size: 24px;
  }

  .wizard-actions {
    flex-direction: column;
    gap: 10px;
  }

  .btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .wizard-container {
    margin: 5px;
    padding: 10px;
  }

  .step-title {
    font-size: 20px;
  }

  .step-description {
    font-size: 14px;
  }
}
```

## Testing Strategy

### 1. Unit Testing
```typescript
// Wizard component tests
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Wizard from './Wizard';

describe('Wizard Component', () => {
  const mockSteps = [
    {
      id: 'step1',
      title: 'Step 1',
      component: ({ data, updateData }: any) => (
        <input
          data-testid="step1-input"
          value={data.value || ''}
          onChange={(e) => updateData({ value: e.target.value })}
        />
      ),
      validation: {
        value: { required: true, minLength: 3 }
      }
    },
    {
      id: 'step2',
      title: 'Step 2',
      component: ({ data, updateData }: any) => (
        <input
          data-testid="step2-input"
          value={data.value2 || ''}
          onChange={(e) => updateData({ value2: e.target.value })}
        />
      )
    }
  ];

  it('renders first step by default', () => {
    render(<Wizard steps={mockSteps} onComplete={jest.fn()} />);
    
    expect(screen.getByText('Step 1')).toBeInTheDocument();
    expect(screen.getByTestId('step1-input')).toBeInTheDocument();
  });

  it('navigates to next step when valid data is entered', async () => {
    const user = userEvent.setup();
    render(<Wizard steps={mockSteps} onComplete={jest.fn()} />);
    
    const input = screen.getByTestId('step1-input');
    await user.type(input, 'test');
    
    const nextButton = screen.getByText('Next');
    await user.click(nextButton);
    
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByTestId('step2-input')).toBeInTheDocument();
  });

  it('shows validation errors for invalid data', async () => {
    const user = userEvent.setup();
    render(<Wizard steps={mockSteps} onComplete={jest.fn()} />);
    
    const input = screen.getByTestId('step1-input');
    await user.type(input, 'ab');
    
    const nextButton = screen.getByText('Next');
    await user.click(nextButton);
    
    expect(screen.getByText('value must be at least 3 characters')).toBeInTheDocument();
  });

  it('calls onComplete when all steps are completed', async () => {
    const user = userEvent.setup();
    const onComplete = jest.fn();
    render(<Wizard steps={mockSteps} onComplete={onComplete} />);
    
    // Complete step 1
    const input1 = screen.getByTestId('step1-input');
    await user.type(input1, 'test');
    await user.click(screen.getByText('Next'));
    
    // Complete step 2
    const input2 = screen.getByTestId('step2-input');
    await user.type(input2, 'test2');
    await user.click(screen.getByText('Complete'));
    
    expect(onComplete).toHaveBeenCalledWith({
      value: 'test',
      value2: 'test2'
    });
  });
});
```

### 2. Integration Testing
```typescript
// Integration tests for wizard workflows
describe('Wizard Integration Tests', () => {
  it('completes user onboarding workflow', async () => {
    const user = userEvent.setup();
    const onComplete = jest.fn();
    
    render(<OnboardingWizard />);
    
    // Fill out user profile
    await user.type(screen.getByLabelText('First Name'), 'John');
    await user.type(screen.getByLabelText('Last Name'), 'Doe');
    await user.type(screen.getByLabelText('Date of Birth'), '1990-01-15');
    await user.selectOptions(screen.getByLabelText('Gender'), 'male');
    
    await user.click(screen.getByText('Next'));
    
    // Fill out nutrition goals
    await user.selectOptions(screen.getByLabelText('Goal Type'), 'weight_loss');
    await user.type(screen.getByLabelText('Target Weight'), '70');
    await user.type(screen.getByLabelText('Target Calories'), '1800');
    
    await user.click(screen.getByText('Next'));
    
    // Complete wizard
    await user.click(screen.getByText('Complete'));
    
    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-15',
        gender: 'male',
        goalType: 'weight_loss',
        targetWeight: 70,
        targetCalories: 1800
      })
    );
  });
});
```

## Accessibility Features

### 1. ARIA Support
```typescript
// Accessibility-enhanced wizard
const Wizard: React.FC<WizardProps> = ({ ... }) => {
  return (
    <div 
      className="wizard-container"
      role="application"
      aria-label="Multi-step form"
    >
      {showProgress && (
        <div 
          className="wizard-progress"
          role="progressbar"
          aria-valuenow={currentStepIndex + 1}
          aria-valuemin={1}
          aria-valuemax={steps.length}
          aria-label={`Step ${currentStepIndex + 1} of ${steps.length}`}
        >
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="progress-text">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
        </div>
      )}

      <div className="wizard-content">
        <div className="wizard-header">
          <h2 
            className="step-title"
            id="step-title"
            aria-live="polite"
          >
            {currentStep.title}
          </h2>
          {currentStep.description && (
            <p 
              className="step-description"
              id="step-description"
            >
              {currentStep.description}
            </p>
          )}
        </div>

        <div 
          className="wizard-body"
          role="region"
          aria-labelledby="step-title"
          aria-describedby="step-description"
        >
          <currentStep.component
            data={data}
            updateData={updateData}
            errors={errors}
            isActive={true}
            isCompleted={completedSteps.has(currentStepIndex)}
          />
        </div>

        <div className="wizard-footer">
          <div className="wizard-actions">
            {onCancel && (
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={handleCancel}
                aria-label="Cancel and exit wizard"
              >
                Cancel
              </button>
            )}

            {allowBackNavigation && !isFirstStep && (
              <button 
                type="button" 
                className="btn btn-outline"
                onClick={goToPreviousStep}
                aria-label="Go to previous step"
              >
                Previous
              </button>
            )}

            <button 
              type="button" 
              className="btn btn-primary"
              onClick={goToNextStep}
              aria-label={isLastStep ? 'Complete wizard' : 'Go to next step'}
            >
              {isLastStep ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 2. Keyboard Navigation
```typescript
// Keyboard navigation support
const Wizard: React.FC<WizardProps> = ({ ... }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onCancel) {
        handleCancel();
      } else if (event.key === 'Enter' && event.ctrlKey) {
        goToNextStep();
      } else if (event.key === 'ArrowLeft' && allowBackNavigation && !isFirstStep) {
        goToPreviousStep();
      } else if (event.key === 'ArrowRight' && !isLastStep) {
        goToNextStep();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onCancel, allowBackNavigation, isFirstStep, isLastStep, goToNextStep, goToPreviousStep, handleCancel]);

  // ... rest of component
};
```

## Future Enhancements

### 1. Advanced Features
- **Step Dependencies**: Steps that depend on other steps
- **Dynamic Steps**: Steps that are added/removed based on user input
- **Step Templates**: Reusable step templates
- **Multi-Path Wizards**: Wizards with branching logic

### 2. Performance Optimizations
- **Lazy Loading**: Load step components on demand
- **Virtual Scrolling**: For wizards with many steps
- **Caching**: Cache step data and validation results
- **Optimistic Updates**: Update UI before validation completes

