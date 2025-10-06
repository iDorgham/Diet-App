# Onboarding Page Specification

## Overview
The Onboarding Page provides a guided introduction for new users to set up their profile, nutrition goals, and preferences in the Diet Planner Game application.

## EARS Requirements

### Epic Requirements
- **EPIC-OP-001**: The system SHALL provide a guided onboarding experience for new users
- **EPIC-OP-002**: The system SHALL collect essential user information and preferences
- **EPIC-OP-003**: The system SHALL ensure a smooth transition to the main application

### Feature Requirements
- **FEAT-OP-001**: The system SHALL implement a multi-step wizard for user setup
- **FEAT-OP-002**: The system SHALL collect personal information, health goals, and dietary preferences
- **FEAT-OP-003**: The system SHALL provide progress tracking and validation
- **FEAT-OP-004**: The system SHALL offer skip options for optional steps

### User Story Requirements
- **US-OP-001**: As a new user, I want to set up my profile quickly so that I can start using the app
- **US-OP-002**: As a new user, I want to understand the app features so that I can use them effectively
- **US-OP-003**: As a new user, I want to set my nutrition goals so that the app can provide personalized recommendations

### Acceptance Criteria
- **AC-OP-001**: Given a new user, when they complete onboarding, then their profile SHALL be created with all provided information
- **AC-OP-002**: Given incomplete required information, when the user tries to proceed, then validation errors SHALL be displayed
- **AC-OP-003**: Given a user skips optional steps, when they complete onboarding, then the app SHALL work with default values

## Onboarding Flow

### 1. Welcome Step
- **Welcome Message**: Introduction to the app and its benefits
- **Feature Overview**: Key features and how they help users
- **Get Started Button**: Begin the onboarding process

### 2. Personal Information
- **Basic Details**: Name, email, date of birth, gender
- **Physical Information**: Height, weight, activity level
- **Validation**: Required fields and format validation

### 3. Health Goals
- **Goal Type**: Weight loss, weight gain, maintenance, muscle gain
- **Target Weight**: Desired weight and timeline
- **Nutrition Goals**: Calorie and macro targets
- **Validation**: Realistic goal validation

### 4. Dietary Preferences
- **Restrictions**: Vegetarian, vegan, gluten-free, allergies
- **Preferences**: Food preferences and dislikes
- **Cooking Level**: Beginner, intermediate, advanced
- **Optional**: Can be skipped or completed later

### 5. App Introduction
- **Feature Tour**: Key features and how to use them
- **Gamification**: Points, achievements, and challenges
- **Social Features**: Community and sharing options
- **Interactive Demo**: Hands-on feature exploration

### 6. Completion
- **Summary**: Review of entered information
- **Confirmation**: Final confirmation and account creation
- **Welcome**: Welcome message and next steps

## Implementation

### 1. Onboarding Container
```typescript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Wizard from '../components/Wizard';
import { useOnboarding } from '../hooks/useOnboarding';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Diet Planner Game',
      component: WelcomeStep,
      required: true
    },
    {
      id: 'personal',
      title: 'Personal Information',
      component: PersonalInfoStep,
      required: true
    },
    {
      id: 'goals',
      title: 'Health Goals',
      component: HealthGoalsStep,
      required: true
    },
    {
      id: 'preferences',
      title: 'Dietary Preferences',
      component: DietaryPreferencesStep,
      required: false
    },
    {
      id: 'features',
      title: 'App Features',
      component: FeaturesStep,
      required: false
    },
    {
      id: 'complete',
      title: 'Complete Setup',
      component: CompletionStep,
      required: true
    }
  ];

  const handleComplete = async (data: any) => {
    try {
      await completeOnboarding(data);
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding failed:', error);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <Wizard
          steps={steps}
          onComplete={handleComplete}
          allowBackNavigation={true}
          showProgress={true}
          autoSave={true}
        />
      </div>
    </div>
  );
};

export default OnboardingPage;
```

### 2. Step Components
```typescript
// Welcome step component
const WelcomeStep: React.FC<StepProps> = ({ data, updateData }) => {
  return (
    <div className="welcome-step">
      <div className="welcome-content">
        <h2>Welcome to Diet Planner Game!</h2>
        <p>Transform your health journey with gamified nutrition tracking.</p>
        
        <div className="features-preview">
          <div className="feature-item">
            <span className="icon">🎮</span>
            <h3>Gamified Experience</h3>
            <p>Earn points, unlock achievements, and complete challenges</p>
          </div>
          <div className="feature-item">
            <span className="icon">🤖</span>
            <h3>AI Coach</h3>
            <p>Get personalized recommendations and guidance</p>
          </div>
          <div className="feature-item">
            <span className="icon">👥</span>
            <h3>Community</h3>
            <p>Connect with others and share your journey</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Personal info step component
const PersonalInfoStep: React.FC<StepProps> = ({ data, updateData, errors }) => {
  return (
    <div className="personal-info-step">
      <div className="form-group">
        <label htmlFor="firstName">First Name *</label>
        <input
          id="firstName"
          type="text"
          value={data.firstName || ''}
          onChange={(e) => updateData({ firstName: e.target.value })}
          className={errors.firstName ? 'error' : ''}
        />
        {errors.firstName && <div className="error-message">{errors.firstName[0]}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="lastName">Last Name *</label>
        <input
          id="lastName"
          type="text"
          value={data.lastName || ''}
          onChange={(e) => updateData({ lastName: e.target.value })}
          className={errors.lastName ? 'error' : ''}
        />
        {errors.lastName && <div className="error-message">{errors.lastName[0]}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="dateOfBirth">Date of Birth *</label>
        <input
          id="dateOfBirth"
          type="date"
          value={data.dateOfBirth || ''}
          onChange={(e) => updateData({ dateOfBirth: e.target.value })}
          className={errors.dateOfBirth ? 'error' : ''}
        />
        {errors.dateOfBirth && <div className="error-message">{errors.dateOfBirth[0]}</div>}
      </div>

      <div className="form-group">
        <label htmlFor="gender">Gender *</label>
        <select
          id="gender"
          value={data.gender || ''}
          onChange={(e) => updateData({ gender: e.target.value })}
          className={errors.gender ? 'error' : ''}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <div className="error-message">{errors.gender[0]}</div>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="height">Height (cm) *</label>
          <input
            id="height"
            type="number"
            value={data.height || ''}
            onChange={(e) => updateData({ height: parseInt(e.target.value) })}
            className={errors.height ? 'error' : ''}
          />
          {errors.height && <div className="error-message">{errors.height[0]}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight (kg) *</label>
          <input
            id="weight"
            type="number"
            value={data.weight || ''}
            onChange={(e) => updateData({ weight: parseFloat(e.target.value) })}
            className={errors.weight ? 'error' : ''}
          />
          {errors.weight && <div className="error-message">{errors.weight[0]}</div>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="activityLevel">Activity Level *</label>
        <select
          id="activityLevel"
          value={data.activityLevel || ''}
          onChange={(e) => updateData({ activityLevel: e.target.value })}
          className={errors.activityLevel ? 'error' : ''}
        >
          <option value="">Select Activity Level</option>
          <option value="sedentary">Sedentary</option>
          <option value="light">Lightly Active</option>
          <option value="moderate">Moderately Active</option>
          <option value="active">Very Active</option>
        </select>
        {errors.activityLevel && <div className="error-message">{errors.activityLevel[0]}</div>}
      </div>
    </div>
  );
};
```

### 3. Validation Schemas
```typescript
export const personalInfoValidation = {
  firstName: { required: true, minLength: 2, maxLength: 50 },
  lastName: { required: true, minLength: 2, maxLength: 50 },
  dateOfBirth: { required: true, custom: validateAge },
  gender: { required: true },
  height: { required: true, min: 100, max: 250 },
  weight: { required: true, min: 30, max: 300 },
  activityLevel: { required: true }
};

export const healthGoalsValidation = {
  goalType: { required: true },
  targetWeight: { required: true, min: 30, max: 300 },
  targetDate: { required: true, custom: validateTargetDate }
};

function validateAge(value: string): string | null {
  if (!value) return 'Date of birth is required';
  const age = new Date().getFullYear() - new Date(value).getFullYear();
  if (age < 13) return 'You must be at least 13 years old';
  if (age > 120) return 'Please enter a valid date of birth';
  return null;
}

function validateTargetDate(value: string): string | null {
  if (!value) return 'Target date is required';
  const targetDate = new Date(value);
  const today = new Date();
  if (targetDate <= today) return 'Target date must be in the future';
  return null;
}
```

## Styling

### 1. CSS Styles
```css
.onboarding-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.onboarding-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  width: 100%;
  overflow: hidden;
}

.welcome-step {
  text-align: center;
  padding: 40px;
}

.welcome-content h2 {
  color: #333;
  margin-bottom: 20px;
  font-size: 28px;
}

.welcome-content p {
  color: #666;
  margin-bottom: 40px;
  font-size: 16px;
}

.features-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
  margin-top: 40px;
}

.feature-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.feature-item .icon {
  font-size: 32px;
  display: block;
  margin-bottom: 10px;
}

.feature-item h3 {
  color: #333;
  margin-bottom: 10px;
  font-size: 16px;
}

.feature-item p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.personal-info-step {
  padding: 40px;
}

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
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4CAF50;
}

.form-group input.error,
.form-group select.error {
  border-color: #f44336;
}

.error-message {
  color: #f44336;
  font-size: 14px;
  margin-top: 5px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .onboarding-page {
    padding: 10px;
  }
  
  .onboarding-container {
    border-radius: 8px;
  }
  
  .welcome-step,
  .personal-info-step {
    padding: 20px;
  }
  
  .features-preview {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
```

## Testing Strategy

### 1. Unit Testing
```typescript
describe('OnboardingPage', () => {
  it('renders welcome step by default', () => {
    render(<OnboardingPage />);
    expect(screen.getByText('Welcome to Diet Planner Game!')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<OnboardingPage />);
    
    const nextButton = screen.getByText('Next');
    await user.click(nextButton);
    
    expect(screen.getByText('First Name')).toBeInTheDocument();
    
    const firstNameInput = screen.getByLabelText('First Name *');
    await user.type(firstNameInput, 'a');
    
    await user.click(screen.getByText('Next'));
    
    expect(screen.getByText('First Name must be at least 2 characters')).toBeInTheDocument();
  });

  it('completes onboarding successfully', async () => {
    const user = userEvent.setup();
    const mockCompleteOnboarding = jest.fn().mockResolvedValue({});
    
    render(<OnboardingPage />);
    
    // Complete all steps
    // ... test implementation
    
    expect(mockCompleteOnboarding).toHaveBeenCalled();
  });
});
```

## Future Enhancements

### 1. Advanced Features
- **Personalized Onboarding**: Customize flow based on user type
- **Progress Persistence**: Save progress and resume later
- **A/B Testing**: Test different onboarding flows
- **Analytics**: Track onboarding completion rates

### 2. Performance Optimizations
- **Lazy Loading**: Load step components on demand
- **Caching**: Cache user input during onboarding
- **Optimistic Updates**: Update UI before server confirmation
- **Error Recovery**: Handle network errors gracefully

