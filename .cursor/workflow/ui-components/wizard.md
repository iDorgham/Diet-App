# Wizard Component Specification

## EARS Requirements

**EARS-WIZ-001**: The system shall provide a multi-step wizard component for complex form flows and guided processes.

**EARS-WIZ-002**: The system shall support step validation and conditional step progression.

**EARS-WIZ-003**: The system shall provide progress indicators and step navigation controls.

**EARS-WIZ-004**: The system shall support step branching and dynamic step generation.

**EARS-WIZ-005**: The system shall provide step persistence and resume functionality.

**EARS-WIZ-006**: The system shall support accessibility features and keyboard navigation.

## Wizard Types

### Form Wizard
```typescript
interface FormWizard {
  id: 'form_wizard';
  name: 'Form Wizard';
  description: 'Multi-step form with validation and progress tracking';
  features: [
    'step_validation',
    'conditional_steps',
    'progress_tracking',
    'data_persistence',
    'step_branching',
    'form_validation'
  ];
  props: {
    steps: WizardStep[];
    initialData?: any;
    onComplete: (data: any) => void;
    onStepChange?: (step: number, data: any) => void;
    onCancel?: () => void;
    showProgress?: boolean;
    showStepNumbers?: boolean;
    allowStepSkipping?: boolean;
    validateOnStepChange?: boolean;
  };
}
```

### Onboarding Wizard
```typescript
interface OnboardingWizard {
  id: 'onboarding_wizard';
  name: 'Onboarding Wizard';
  description: 'Guided user onboarding with interactive tutorials';
  features: [
    'interactive_tutorials',
    'feature_introduction',
    'user_preference_collection',
    'progress_saving',
    'skip_optional_steps',
    'contextual_help'
  ];
  props: {
    steps: OnboardingStep[];
    userData: UserData;
    onComplete: (userData: UserData) => void;
    onStepComplete?: (step: number, data: any) => void;
    onSkip?: (step: number, reason?: string) => void;
    showTutorials?: boolean;
    showHelp?: boolean;
    autoSave?: boolean;
  };
}
```

### Configuration Wizard
```typescript
interface ConfigurationWizard {
  id: 'configuration_wizard';
  name: 'Configuration Wizard';
  description: 'System configuration and setup wizard';
  features: [
    'configuration_validation',
    'dependency_checking',
    'rollback_support',
    'configuration_preview',
    'batch_operations',
    'error_recovery'
  ];
  props: {
    steps: ConfigurationStep[];
    configuration: any;
    onComplete: (config: any) => void;
    onValidate?: (step: number, config: any) => Promise<boolean>;
    onRollback?: (step: number) => void;
    showPreview?: boolean;
    allowRollback?: boolean;
    validateDependencies?: boolean;
  };
}
```

## Wizard Step Structure

### Step Definition
```typescript
interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: React.ComponentType<WizardStepProps>;
  validation?: StepValidation;
  conditional?: StepCondition;
  navigation?: StepNavigation;
  persistence?: StepPersistence;
  accessibility?: StepAccessibility;
  metadata?: Record<string, any>;
}

interface StepValidation {
  required: boolean;
  validate: (data: any) => Promise<ValidationResult>;
  errorMessage?: string;
  warningMessage?: string;
  asyncValidation?: boolean;
  debounceMs?: number;
}

interface StepCondition {
  show: (data: any) => boolean;
  hide: (data: any) => boolean;
  skip: (data: any) => boolean;
  dependencies?: string[];
}

interface StepNavigation {
  canGoBack: boolean;
  canGoForward: boolean;
  canSkip: boolean;
  nextStep?: string | ((data: any) => string);
  previousStep?: string | ((data: any) => string);
  skipTo?: string | ((data: any) => string);
}

interface StepPersistence {
  save: boolean;
  key: string;
  encrypt?: boolean;
  compress?: boolean;
  ttl?: number; // time to live in seconds
}

interface StepAccessibility {
  ariaLabel: string;
  ariaDescription?: string;
  focusManagement: 'auto' | 'manual' | 'none';
  keyboardNavigation: boolean;
  screenReaderAnnouncements: boolean;
}
```

### Step Components
```typescript
interface WizardStepProps {
  data: any;
  onChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSkip: () => void;
  onComplete: () => void;
  isValid: boolean;
  isSubmitting: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  step: WizardStep;
  stepIndex: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
  canSkip: boolean;
}

interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error' | 'warning' | 'info';
}

interface ValidationWarning {
  field: string;
  message: string;
  code: string;
  severity: 'warning' | 'info';
}
```

## Wizard State Management

### State Structure
```typescript
interface WizardState {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  skippedSteps: number[];
  data: Record<string, any>;
  validation: {
    [stepId: string]: {
      isValid: boolean;
      errors: ValidationError[];
      warnings: ValidationWarning[];
      isSubmitting: boolean;
    };
  };
  navigation: {
    canGoBack: boolean;
    canGoForward: boolean;
    canSkip: boolean;
    nextStep?: string;
    previousStep?: string;
    skipTo?: string;
  };
  progress: {
    percentage: number;
    completedPercentage: number;
    estimatedTimeRemaining: number;
    startTime: Date;
    lastStepTime: Date;
  };
  settings: {
    autoSave: boolean;
    validateOnStepChange: boolean;
    showProgress: boolean;
    showStepNumbers: boolean;
    allowStepSkipping: boolean;
    persistData: boolean;
  };
}
```

### Wizard Service
```typescript
export class WizardService {
  private state: WizardState;
  private steps: WizardStep[];
  private listeners: Set<(state: WizardState) => void>;
  
  constructor(steps: WizardStep[], initialState?: Partial<WizardState>) {
    this.steps = steps;
    this.state = this.initializeState(initialState);
    this.listeners = new Set();
  }
  
  private initializeState(initialState?: Partial<WizardState>): WizardState {
    return {
      currentStep: 0,
      totalSteps: this.steps.length,
      completedSteps: [],
      skippedSteps: [],
      data: {},
      validation: {},
      navigation: {
        canGoBack: false,
        canGoForward: true,
        canSkip: false
      },
      progress: {
        percentage: 0,
        completedPercentage: 0,
        estimatedTimeRemaining: 0,
        startTime: new Date(),
        lastStepTime: new Date()
      },
      settings: {
        autoSave: true,
        validateOnStepChange: true,
        showProgress: true,
        showStepNumbers: true,
        allowStepSkipping: true,
        persistData: true
      },
      ...initialState
    };
  }
  
  async nextStep(): Promise<void> {
    const currentStep = this.getCurrentStep();
    
    // Validate current step if required
    if (this.state.settings.validateOnStepChange) {
      const validation = await this.validateStep(currentStep);
      if (!validation.isValid) {
        throw new Error('Current step validation failed');
      }
    }
    
    // Mark current step as completed
    this.state.completedSteps.push(this.state.currentStep);
    
    // Determine next step
    const nextStepIndex = this.determineNextStep();
    this.state.currentStep = nextStepIndex;
    
    // Update navigation state
    this.updateNavigationState();
    
    // Update progress
    this.updateProgress();
    
    // Auto-save if enabled
    if (this.state.settings.autoSave) {
      await this.saveProgress();
    }
    
    this.notifyListeners();
  }
  
  async previousStep(): Promise<void> {
    if (!this.state.navigation.canGoBack) {
      throw new Error('Cannot go back from current step');
    }
    
    const previousStepIndex = this.determinePreviousStep();
    this.state.currentStep = previousStepIndex;
    
    // Update navigation state
    this.updateNavigationState();
    
    // Update progress
    this.updateProgress();
    
    this.notifyListeners();
  }
  
  async skipStep(): Promise<void> {
    const currentStep = this.getCurrentStep();
    
    if (!currentStep.navigation?.canSkip) {
      throw new Error('Current step cannot be skipped');
    }
    
    // Mark current step as skipped
    this.state.skippedSteps.push(this.state.currentStep);
    
    // Determine skip target
    const skipToIndex = this.determineSkipTarget();
    this.state.currentStep = skipToIndex;
    
    // Update navigation state
    this.updateNavigationState();
    
    // Update progress
    this.updateProgress();
    
    // Auto-save if enabled
    if (this.state.settings.autoSave) {
      await this.saveProgress();
    }
    
    this.notifyListeners();
  }
  
  async updateStepData(stepId: string, data: any): Promise<void> {
    this.state.data[stepId] = { ...this.state.data[stepId], ...data };
    
    // Validate step if required
    if (this.state.settings.validateOnStepChange) {
      await this.validateStep(this.getCurrentStep());
    }
    
    // Auto-save if enabled
    if (this.state.settings.autoSave) {
      await this.saveProgress();
    }
    
    this.notifyListeners();
  }
  
  async validateStep(step: WizardStep): Promise<ValidationResult> {
    if (!step.validation) {
      return { isValid: true, errors: [], warnings: [] };
    }
    
    const stepData = this.state.data[step.id] || {};
    const result = await step.validation.validate(stepData);
    
    // Update validation state
    this.state.validation[step.id] = {
      isValid: result.isValid,
      errors: result.errors || [],
      warnings: result.warnings || [],
      isSubmitting: false
    };
    
    this.notifyListeners();
    return result;
  }
  
  async completeWizard(): Promise<any> {
    // Validate all steps
    for (const step of this.steps) {
      const validation = await this.validateStep(step);
      if (!validation.isValid && step.validation?.required) {
        throw new Error(`Step ${step.id} validation failed`);
      }
    }
    
    // Mark wizard as completed
    this.state.completedSteps.push(this.state.currentStep);
    
    // Update progress
    this.updateProgress();
    
    // Clear persisted data if configured
    if (!this.state.settings.persistData) {
      await this.clearPersistedData();
    }
    
    this.notifyListeners();
    return this.state.data;
  }
  
  private determineNextStep(): number {
    const currentStep = this.getCurrentStep();
    const nextStep = currentStep.navigation?.nextStep;
    
    if (typeof nextStep === 'function') {
      const stepId = nextStep(this.state.data);
      return this.steps.findIndex(step => step.id === stepId);
    } else if (typeof nextStep === 'string') {
      return this.steps.findIndex(step => step.id === nextStep);
    } else {
      return Math.min(this.state.currentStep + 1, this.steps.length - 1);
    }
  }
  
  private determinePreviousStep(): number {
    const currentStep = this.getCurrentStep();
    const previousStep = currentStep.navigation?.previousStep;
    
    if (typeof previousStep === 'function') {
      const stepId = previousStep(this.state.data);
      return this.steps.findIndex(step => step.id === stepId);
    } else if (typeof previousStep === 'string') {
      return this.steps.findIndex(step => step.id === previousStep);
    } else {
      return Math.max(this.state.currentStep - 1, 0);
    }
  }
  
  private determineSkipTarget(): number {
    const currentStep = this.getCurrentStep();
    const skipTo = currentStep.navigation?.skipTo;
    
    if (typeof skipTo === 'function') {
      const stepId = skipTo(this.state.data);
      return this.steps.findIndex(step => step.id === stepId);
    } else if (typeof skipTo === 'string') {
      return this.steps.findIndex(step => step.id === skipTo);
    } else {
      return Math.min(this.state.currentStep + 1, this.steps.length - 1);
    }
  }
  
  private updateNavigationState(): void {
    const currentStep = this.getCurrentStep();
    
    this.state.navigation = {
      canGoBack: this.state.currentStep > 0 && (currentStep.navigation?.canGoBack ?? true),
      canGoForward: this.state.currentStep < this.steps.length - 1 && (currentStep.navigation?.canGoForward ?? true),
      canSkip: currentStep.navigation?.canSkip ?? false,
      nextStep: currentStep.navigation?.nextStep,
      previousStep: currentStep.navigation?.previousStep,
      skipTo: currentStep.navigation?.skipTo
    };
  }
  
  private updateProgress(): void {
    const completedSteps = this.state.completedSteps.length;
    const totalSteps = this.steps.length;
    
    this.state.progress.percentage = (completedSteps / totalSteps) * 100;
    this.state.progress.completedPercentage = (completedSteps / totalSteps) * 100;
    
    // Estimate time remaining based on average step time
    const elapsedTime = Date.now() - this.state.progress.startTime.getTime();
    const averageStepTime = elapsedTime / (completedSteps + 1);
    const remainingSteps = totalSteps - completedSteps;
    
    this.state.progress.estimatedTimeRemaining = remainingSteps * averageStepTime;
    this.state.progress.lastStepTime = new Date();
  }
  
  private async saveProgress(): Promise<void> {
    if (!this.state.settings.persistData) return;
    
    const progressData = {
      currentStep: this.state.currentStep,
      completedSteps: this.state.completedSteps,
      skippedSteps: this.state.skippedSteps,
      data: this.state.data,
      timestamp: new Date().toISOString()
    };
    
    await this.persistProgress(progressData);
  }
  
  private async clearPersistedData(): Promise<void> {
    await this.clearProgress();
  }
  
  private getCurrentStep(): WizardStep {
    return this.steps[this.state.currentStep];
  }
  
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.state));
  }
  
  // Public methods for external access
  getState(): WizardState {
    return { ...this.state };
  }
  
  subscribe(listener: (state: WizardState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  
  async loadProgress(progressData: any): Promise<void> {
    this.state.currentStep = progressData.currentStep || 0;
    this.state.completedSteps = progressData.completedSteps || [];
    this.state.skippedSteps = progressData.skippedSteps || [];
    this.state.data = progressData.data || {};
    
    this.updateNavigationState();
    this.updateProgress();
    
    this.notifyListeners();
  }
}
```

## Progress Indicators

### Progress Bar
```typescript
interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  skippedSteps: number[];
  showStepNumbers?: boolean;
  showStepNames?: boolean;
  showProgressPercentage?: boolean;
  variant?: 'linear' | 'circular' | 'stepper';
  size?: 'small' | 'medium' | 'large';
  color?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
  completedSteps,
  skippedSteps,
  showStepNumbers = true,
  showStepNames = false,
  showProgressPercentage = true,
  variant = 'linear',
  size = 'medium',
  color = 'primary',
  className = ''
}) => {
  const progress = (completedSteps.length / totalSteps) * 100;
  
  if (variant === 'linear') {
    return (
      <div className={`progress-bar linear ${size} ${color} ${className}`}>
        <div className="progress-track">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {showProgressPercentage && (
          <div className="progress-percentage">
            {Math.round(progress)}%
          </div>
        )}
        
        {showStepNumbers && (
          <div className="step-indicators">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`step-indicator ${
                  index < currentStep ? 'completed' :
                  index === currentStep ? 'current' :
                  'upcoming'
                } ${skippedSteps.includes(index) ? 'skipped' : ''}`}
              >
                {index < currentStep && !skippedSteps.includes(index) && (
                  <Check className="w-4 h-4" />
                )}
                {skippedSteps.includes(index) && (
                  <SkipForward className="w-4 h-4" />
                )}
                {index >= currentStep && !skippedSteps.includes(index) && (
                  <span>{index + 1}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  if (variant === 'stepper') {
    return (
      <div className={`progress-bar stepper ${size} ${color} ${className}`}>
        <div className="stepper-container">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div key={index} className="stepper-step">
              <div className="stepper-line" />
              
              <div
                className={`stepper-circle ${
                  index < currentStep ? 'completed' :
                  index === currentStep ? 'current' :
                  'upcoming'
                } ${skippedSteps.includes(index) ? 'skipped' : ''}`}
              >
                {index < currentStep && !skippedSteps.includes(index) && (
                  <Check className="w-4 h-4" />
                )}
                {skippedSteps.includes(index) && (
                  <SkipForward className="w-4 h-4" />
                )}
                {index >= currentStep && !skippedSteps.includes(index) && (
                  <span>{index + 1}</span>
                )}
              </div>
              
              {showStepNames && (
                <div className="stepper-label">
                  Step {index + 1}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return null;
};
```

## UI Components

### Wizard Container
```typescript
const Wizard: React.FC<WizardProps> = ({
  steps,
  initialData = {},
  onComplete,
  onStepChange,
  onCancel,
  showProgress = true,
  showStepNumbers = true,
  allowStepSkipping = true,
  validateOnStepChange = true,
  className = '',
  ...props
}) => {
  const [wizardService] = useState(() => new WizardService(steps, {
    data: initialData,
    settings: {
      validateOnStepChange,
      showProgress,
      showStepNumbers,
      allowStepSkipping
    }
  }));
  
  const [state, setState] = useState<WizardState>(wizardService.getState());
  
  useEffect(() => {
    const unsubscribe = wizardService.subscribe(setState);
    return unsubscribe;
  }, [wizardService]);
  
  const handleNext = async () => {
    try {
      await wizardService.nextStep();
      onStepChange?.(state.currentStep, state.data);
    } catch (error) {
      console.error('Failed to proceed to next step:', error);
    }
  };
  
  const handlePrevious = async () => {
    try {
      await wizardService.previousStep();
      onStepChange?.(state.currentStep, state.data);
    } catch (error) {
      console.error('Failed to go to previous step:', error);
    }
  };
  
  const handleSkip = async () => {
    try {
      await wizardService.skipStep();
      onStepChange?.(state.currentStep, state.data);
    } catch (error) {
      console.error('Failed to skip step:', error);
    }
  };
  
  const handleComplete = async () => {
    try {
      const result = await wizardService.completeWizard();
      onComplete(result);
    } catch (error) {
      console.error('Failed to complete wizard:', error);
    }
  };
  
  const handleStepDataChange = async (stepId: string, data: any) => {
    try {
      await wizardService.updateStepData(stepId, data);
    } catch (error) {
      console.error('Failed to update step data:', error);
    }
  };
  
  const currentStep = steps[state.currentStep];
  const isLastStep = state.currentStep === steps.length - 1;
  
  return (
    <div className={`wizard ${className}`} {...props}>
      {showProgress && (
        <ProgressBar
          currentStep={state.currentStep}
          totalSteps={state.totalSteps}
          completedSteps={state.completedSteps}
          skippedSteps={state.skippedSteps}
          showStepNumbers={showStepNumbers}
          variant="stepper"
        />
      )}
      
      <div className="wizard-content">
        <div className="wizard-header">
          <h2 className="wizard-title">{currentStep.title}</h2>
          {currentStep.description && (
            <p className="wizard-description">{currentStep.description}</p>
          )}
        </div>
        
        <div className="wizard-step">
          <currentStep.component
            data={state.data[currentStep.id] || {}}
            onChange={(data) => handleStepDataChange(currentStep.id, data)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onSkip={handleSkip}
            onComplete={handleComplete}
            isValid={state.validation[currentStep.id]?.isValid ?? true}
            isSubmitting={state.validation[currentStep.id]?.isSubmitting ?? false}
            errors={state.validation[currentStep.id]?.errors ?? []}
            warnings={state.validation[currentStep.id]?.warnings ?? []}
            step={currentStep}
            stepIndex={state.currentStep}
            totalSteps={state.totalSteps}
            isFirstStep={state.currentStep === 0}
            isLastStep={isLastStep}
            canGoBack={state.navigation.canGoBack}
            canGoForward={state.navigation.canGoForward}
            canSkip={state.navigation.canSkip}
          />
        </div>
      </div>
      
      <div className="wizard-navigation">
        <div className="wizard-actions">
          {state.navigation.canGoBack && (
            <button
              className="wizard-button secondary"
              onClick={handlePrevious}
              disabled={state.validation[currentStep.id]?.isSubmitting}
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
          )}
          
          <div className="wizard-spacer" />
          
          {state.navigation.canSkip && (
            <button
              className="wizard-button outline"
              onClick={handleSkip}
              disabled={state.validation[currentStep.id]?.isSubmitting}
            >
              Skip
            </button>
          )}
          
          {isLastStep ? (
            <button
              className="wizard-button primary"
              onClick={handleComplete}
              disabled={!state.validation[currentStep.id]?.isValid || state.validation[currentStep.id]?.isSubmitting}
            >
              Complete
            </button>
          ) : (
            <button
              className="wizard-button primary"
              onClick={handleNext}
              disabled={!state.validation[currentStep.id]?.isValid || state.validation[currentStep.id]?.isSubmitting}
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
        
        {onCancel && (
          <button
            className="wizard-button text"
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};
```

### Step Form Component
```typescript
const StepForm: React.FC<WizardStepProps> = ({
  data,
  onChange,
  onNext,
  onPrevious,
  onSkip,
  onComplete,
  isValid,
  isSubmitting,
  errors,
  warnings,
  step,
  stepIndex,
  totalSteps,
  isFirstStep,
  isLastStep,
  canGoBack,
  canGoForward,
  canSkip
}) => {
  const [formData, setFormData] = useState(data);
  const [isDirty, setIsDirty] = useState(false);
  
  const handleFieldChange = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    setIsDirty(true);
    onChange(newData);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isValid) {
      if (isLastStep) {
        onComplete();
      } else {
        onNext();
      }
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="step-form">
      <div className="form-fields">
        {/* Form fields will be rendered here based on step configuration */}
        <div className="form-field">
          <label htmlFor="example-field">Example Field</label>
          <input
            id="example-field"
            type="text"
            value={formData.exampleField || ''}
            onChange={(e) => handleFieldChange('exampleField', e.target.value)}
            className={errors.some(e => e.field === 'exampleField') ? 'error' : ''}
          />
          {errors
            .filter(e => e.field === 'exampleField')
            .map((error, index) => (
              <div key={index} className="error-message">
                {error.message}
              </div>
            ))}
        </div>
      </div>
      
      {warnings.length > 0 && (
        <div className="warnings">
          {warnings.map((warning, index) => (
            <div key={index} className="warning-message">
              <AlertTriangle className="w-4 h-4" />
              {warning.message}
            </div>
          ))}
        </div>
      )}
      
      {errors.length > 0 && (
        <div className="errors">
          {errors.map((error, index) => (
            <div key={index} className="error-message">
              <AlertCircle className="w-4 h-4" />
              {error.message}
            </div>
          ))}
        </div>
      )}
    </form>
  );
};
```

This comprehensive wizard component provides flexible multi-step flows with validation, progress tracking, and accessibility features while maintaining a clean and intuitive user experience.
