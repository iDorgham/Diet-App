# Utility Function Contracts

## Overview
This document defines the interface contracts for utility functions in the Diet Game application, including validation, formatting, calculations, and helper functions.

## Base Utility Contract

### Utility Function Structure
```typescript
interface UtilityFunction<TInput, TOutput> {
  (input: TInput): TOutput;
  readonly name: string;
  readonly description: string;
  readonly version: string;
  readonly parameters: ParameterDefinition[];
  readonly returnType: string;
  readonly examples: Example[];
}

interface ParameterDefinition {
  name: string;
  type: string;
  required: boolean;
  description: string;
  defaultValue?: any;
  validation?: ValidationRule[];
}

interface Example {
  input: any;
  output: any;
  description: string;
}

interface ValidationRule {
  type: 'required' | 'type' | 'range' | 'pattern' | 'custom';
  value?: any;
  message: string;
}
```

## Validation Utilities

### Validation Function Contracts
```typescript
interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  field: string;
  code: string;
  message: string;
  value: any;
  path: string[];
}

interface ValidationWarning {
  field: string;
  code: string;
  message: string;
  value: any;
  path: string[];
}

// Email Validation
interface EmailValidationFunction extends UtilityFunction<string, ValidationResult> {
  name: 'validateEmail';
  description: 'Validates email address format and domain';
  parameters: [
    {
      name: 'email';
      type: 'string';
      required: true;
      description: 'Email address to validate';
      validation: [
        { type: 'required', message: 'Email is required' },
        { type: 'pattern', value: 'email', message: 'Invalid email format' }
      ];
    }
  ];
  returnType: 'ValidationResult';
}

// Password Validation
interface PasswordValidationFunction extends UtilityFunction<string, ValidationResult> {
  name: 'validatePassword';
  description: 'Validates password strength and requirements';
  parameters: [
    {
      name: 'password';
      type: 'string';
      required: true;
      description: 'Password to validate';
      validation: [
        { type: 'required', message: 'Password is required' },
        { type: 'range', value: { min: 8, max: 128 }, message: 'Password must be 8-128 characters' }
      ];
    },
    {
      name: 'requirements';
      type: 'PasswordRequirements';
      required: false;
      description: 'Password strength requirements';
      defaultValue: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxLength: 128
      };
    }
  ];
  returnType: 'ValidationResult';
}

interface PasswordRequirements {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  forbiddenWords?: string[];
}

// Username Validation
interface UsernameValidationFunction extends UtilityFunction<string, ValidationResult> {
  name: 'validateUsername';
  description: 'Validates username format and availability';
  parameters: [
    {
      name: 'username';
      type: 'string';
      required: true;
      description: 'Username to validate';
      validation: [
        { type: 'required', message: 'Username is required' },
        { type: 'range', value: { min: 3, max: 30 }, message: 'Username must be 3-30 characters' },
        { type: 'pattern', value: 'alphanumeric', message: 'Username can only contain letters and numbers' }
      ];
    }
  ];
  returnType: 'ValidationResult';
}

// Phone Number Validation
interface PhoneValidationFunction extends UtilityFunction<string, ValidationResult> {
  name: 'validatePhone';
  description: 'Validates phone number format';
  parameters: [
    {
      name: 'phone';
      type: 'string';
      required: true;
      description: 'Phone number to validate';
      validation: [
        { type: 'required', message: 'Phone number is required' },
        { type: 'pattern', value: 'phone', message: 'Invalid phone number format' }
      ];
    },
    {
      name: 'country';
      type: 'string';
      required: false;
      description: 'Country code for validation';
      defaultValue: 'US';
    }
  ];
  returnType: 'ValidationResult';
}

// URL Validation
interface URLValidationFunction extends UtilityFunction<string, ValidationResult> {
  name: 'validateURL';
  description: 'Validates URL format and accessibility';
  parameters: [
    {
      name: 'url';
      type: 'string';
      required: true;
      description: 'URL to validate';
      validation: [
        { type: 'required', message: 'URL is required' },
        { type: 'pattern', value: 'url', message: 'Invalid URL format' }
      ];
    },
    {
      name: 'checkAccessibility';
      type: 'boolean';
      required: false;
      description: 'Whether to check if URL is accessible';
      defaultValue: false;
    }
  ];
  returnType: 'ValidationResult';
}

// Date Validation
interface DateValidationFunction extends UtilityFunction<string | Date, ValidationResult> {
  name: 'validateDate';
  description: 'Validates date format and range';
  parameters: [
    {
      name: 'date';
      type: 'string | Date';
      required: true;
      description: 'Date to validate';
      validation: [
        { type: 'required', message: 'Date is required' },
        { type: 'type', value: 'date', message: 'Invalid date format' }
      ];
    },
    {
      name: 'minDate';
      type: 'string | Date';
      required: false;
      description: 'Minimum allowed date';
    },
    {
      name: 'maxDate';
      type: 'string | Date';
      required: false;
      description: 'Maximum allowed date';
    }
  ];
  returnType: 'ValidationResult';
}
```

## Formatting Utilities

### Formatting Function Contracts
```typescript
// Number Formatting
interface NumberFormatFunction extends UtilityFunction<number, string> {
  name: 'formatNumber';
  description: 'Formats number with locale-specific formatting';
  parameters: [
    {
      name: 'number';
      type: 'number';
      required: true;
      description: 'Number to format';
    },
    {
      name: 'options';
      type: 'NumberFormatOptions';
      required: false;
      description: 'Formatting options';
      defaultValue: {
        locale: 'en-US',
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
      };
    }
  ];
  returnType: 'string';
}

interface NumberFormatOptions {
  locale: string;
  style?: 'decimal' | 'currency' | 'percent';
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
}

// Currency Formatting
interface CurrencyFormatFunction extends UtilityFunction<number, string> {
  name: 'formatCurrency';
  description: 'Formats number as currency';
  parameters: [
    {
      name: 'amount';
      type: 'number';
      required: true;
      description: 'Amount to format';
    },
    {
      name: 'currency';
      type: 'string';
      required: false;
      description: 'Currency code';
      defaultValue: 'USD';
    },
    {
      name: 'locale';
      type: 'string';
      required: false;
      description: 'Locale for formatting';
      defaultValue: 'en-US';
    }
  ];
  returnType: 'string';
}

// Date Formatting
interface DateFormatFunction extends UtilityFunction<Date | string, string> {
  name: 'formatDate';
  description: 'Formats date with specified format';
  parameters: [
    {
      name: 'date';
      type: 'Date | string';
      required: true;
      description: 'Date to format';
    },
    {
      name: 'format';
      type: 'string';
      required: false;
      description: 'Date format pattern';
      defaultValue: 'MM/dd/yyyy';
    },
    {
      name: 'locale';
      type: 'string';
      required: false;
      description: 'Locale for formatting';
      defaultValue: 'en-US';
    }
  ];
  returnType: 'string';
}

// Time Formatting
interface TimeFormatFunction extends UtilityFunction<number, string> {
  name: 'formatTime';
  description: 'Formats duration in seconds to human-readable format';
  parameters: [
    {
      name: 'seconds';
      type: 'number';
      required: true;
      description: 'Duration in seconds';
    },
    {
      name: 'format';
      type: 'TimeFormat';
      required: false;
      description: 'Time format type';
      defaultValue: 'short';
    }
  ];
  returnType: 'string';
}

type TimeFormat = 'short' | 'long' | 'compact' | 'detailed';

// File Size Formatting
interface FileSizeFormatFunction extends UtilityFunction<number, string> {
  name: 'formatFileSize';
  description: 'Formats file size in bytes to human-readable format';
  parameters: [
    {
      name: 'bytes';
      type: 'number';
      required: true;
      description: 'File size in bytes';
    },
    {
      name: 'precision';
      type: 'number';
      required: false;
      description: 'Number of decimal places';
      defaultValue: 2;
    }
  ];
  returnType: 'string';
}

// Percentage Formatting
interface PercentageFormatFunction extends UtilityFunction<number, string> {
  name: 'formatPercentage';
  description: 'Formats number as percentage';
  parameters: [
    {
      name: 'value';
      type: 'number';
      required: true;
      description: 'Value to format (0-1 or 0-100)';
    },
    {
      name: 'precision';
      type: 'number';
      required: false;
      description: 'Number of decimal places';
      defaultValue: 1;
    },
    {
      name: 'isDecimal';
      type: 'boolean';
      required: false;
      description: 'Whether value is in decimal format (0-1)';
      defaultValue: true;
    }
  ];
  returnType: 'string';
}
```

## Calculation Utilities

### Calculation Function Contracts
```typescript
// BMI Calculation
interface BMICalculationFunction extends UtilityFunction<BMICalculationInput, BMICalculationResult> {
  name: 'calculateBMI';
  description: 'Calculates Body Mass Index';
  parameters: [
    {
      name: 'weight';
      type: 'number';
      required: true;
      description: 'Weight in kg';
    },
    {
      name: 'height';
      type: 'number';
      required: true;
      description: 'Height in meters';
    }
  ];
  returnType: 'BMICalculationResult';
}

interface BMICalculationInput {
  weight: number; // kg
  height: number; // meters
}

interface BMICalculationResult {
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese';
  range: {
    min: number;
    max: number;
  };
  healthRisk: 'low' | 'moderate' | 'high' | 'very_high';
}

// Calorie Calculation
interface CalorieCalculationFunction extends UtilityFunction<CalorieCalculationInput, CalorieCalculationResult> {
  name: 'calculateCalories';
  description: 'Calculates daily calorie needs';
  parameters: [
    {
      name: 'weight';
      type: 'number';
      required: true;
      description: 'Weight in kg';
    },
    {
      name: 'height';
      type: 'number';
      required: true;
      description: 'Height in cm';
    },
    {
      name: 'age';
      type: 'number';
      required: true;
      description: 'Age in years';
    },
    {
      name: 'gender';
      type: 'string';
      required: true;
      description: 'Gender (male/female)';
    },
    {
      name: 'activityLevel';
      type: 'ActivityLevel';
      required: true;
      description: 'Activity level';
    },
    {
      name: 'goal';
      type: 'CalorieGoal';
      required: false;
      description: 'Calorie goal';
      defaultValue: 'maintain';
    }
  ];
  returnType: 'CalorieCalculationResult';
}

interface CalorieCalculationInput {
  weight: number; // kg
  height: number; // cm
  age: number; // years
  gender: 'male' | 'female';
  activityLevel: ActivityLevel;
  goal: CalorieGoal;
}

interface CalorieCalculationResult {
  bmr: number; // Basal Metabolic Rate
  tdee: number; // Total Daily Energy Expenditure
  targetCalories: number;
  goal: CalorieGoal;
  deficit: number; // Calorie deficit for weight loss
  surplus: number; // Calorie surplus for weight gain
}

type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
type CalorieGoal = 'lose_weight' | 'maintain' | 'gain_weight';

// Macro Calculation
interface MacroCalculationFunction extends UtilityFunction<MacroCalculationInput, MacroCalculationResult> {
  name: 'calculateMacros';
  description: 'Calculates macronutrient distribution';
  parameters: [
    {
      name: 'calories';
      type: 'number';
      required: true;
      description: 'Total daily calories';
    },
    {
      name: 'goal';
      type: 'MacroGoal';
      required: true;
      description: 'Macro distribution goal';
    },
    {
      name: 'bodyWeight';
      type: 'number';
      required: false;
      description: 'Body weight in kg for protein calculation';
    }
  ];
  returnType: 'MacroCalculationResult';
}

interface MacroCalculationInput {
  calories: number;
  goal: MacroGoal;
  bodyWeight?: number; // kg
}

interface MacroCalculationResult {
  protein: {
    grams: number;
    calories: number;
    percentage: number;
  };
  carbohydrates: {
    grams: number;
    calories: number;
    percentage: number;
  };
  fat: {
    grams: number;
    calories: number;
    percentage: number;
  };
  fiber: {
    grams: number;
    calories: number;
  };
}

type MacroGoal = 'balanced' | 'high_protein' | 'low_carb' | 'keto' | 'high_carb';

// XP Calculation
interface XPCalculationFunction extends UtilityFunction<XPCalculationInput, XPCalculationResult> {
  name: 'calculateXP';
  description: 'Calculates XP reward for task completion';
  parameters: [
    {
      name: 'baseXP';
      type: 'number';
      required: true;
      description: 'Base XP for the task';
    },
    {
      name: 'difficulty';
      type: 'TaskDifficulty';
      required: true;
      description: 'Task difficulty level';
    },
    {
      name: 'quality';
      type: 'number';
      required: false;
      description: 'Completion quality (1-5)';
      defaultValue: 3;
    },
    {
      name: 'multipliers';
      type: 'XPMultipliers';
      required: false;
      description: 'XP multipliers';
      defaultValue: {};
    }
  ];
  returnType: 'XPCalculationResult';
}

interface XPCalculationInput {
  baseXP: number;
  difficulty: TaskDifficulty;
  quality: number; // 1-5
  multipliers: XPMultipliers;
}

interface XPCalculationResult {
  baseXP: number;
  difficultyMultiplier: number;
  qualityMultiplier: number;
  bonusMultiplier: number;
  totalXP: number;
  breakdown: {
    base: number;
    difficulty: number;
    quality: number;
    bonus: number;
  };
}

interface XPMultipliers {
  streak?: number;
  firstTime?: number;
  weekend?: number;
  special?: number;
}

// Distance Calculation
interface DistanceCalculationFunction extends UtilityFunction<DistanceCalculationInput, number> {
  name: 'calculateDistance';
  description: 'Calculates distance between two points';
  parameters: [
    {
      name: 'point1';
      type: 'GeoPoint';
      required: true;
      description: 'First geographical point';
    },
    {
      name: 'point2';
      type: 'GeoPoint';
      required: true;
      description: 'Second geographical point';
    },
    {
      name: 'unit';
      type: 'DistanceUnit';
      required: false;
      description: 'Distance unit';
      defaultValue: 'km';
    }
  ];
  returnType: 'number';
}

interface DistanceCalculationInput {
  point1: GeoPoint;
  point2: GeoPoint;
  unit: DistanceUnit;
}

interface GeoPoint {
  latitude: number;
  longitude: number;
}

type DistanceUnit = 'km' | 'miles' | 'meters' | 'feet';
```

## Helper Utilities

### Helper Function Contracts
```typescript
// String Utilities
interface StringUtilityFunctions {
  slugify: UtilityFunction<string, string>;
  truncate: UtilityFunction<TruncateInput, string>;
  capitalize: UtilityFunction<string, string>;
  camelCase: UtilityFunction<string, string>;
  kebabCase: UtilityFunction<string, string>;
  snakeCase: UtilityFunction<string, string>;
  pascalCase: UtilityFunction<string, string>;
  removeAccents: UtilityFunction<string, string>;
  generateRandomString: UtilityFunction<RandomStringInput, string>;
}

interface TruncateInput {
  text: string;
  length: number;
  suffix?: string;
  preserveWords?: boolean;
}

interface RandomStringInput {
  length: number;
  charset?: string;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  excludeSimilar?: boolean;
}

// Array Utilities
interface ArrayUtilityFunctions {
  chunk: UtilityFunction<ChunkInput, any[][]>;
  unique: UtilityFunction<any[], any[]>;
  groupBy: UtilityFunction<GroupByInput, Record<string, any[]>>;
  sortBy: UtilityFunction<SortByInput, any[]>;
  shuffle: UtilityFunction<any[], any[]>;
  sample: UtilityFunction<SampleInput, any>;
  flatten: UtilityFunction<any[], any[]>;
  intersection: UtilityFunction<IntersectionInput, any[]>;
  difference: UtilityFunction<DifferenceInput, any[]>;
  union: UtilityFunction<UnionInput, any[]>;
}

interface ChunkInput {
  array: any[];
  size: number;
}

interface GroupByInput {
  array: any[];
  key: string | ((item: any) => string);
}

interface SortByInput {
  array: any[];
  key: string | ((item: any) => any);
  order?: 'asc' | 'desc';
}

interface SampleInput {
  array: any[];
  count?: number;
}

interface IntersectionInput {
  arrays: any[][];
}

interface DifferenceInput {
  array1: any[];
  array2: any[];
}

interface UnionInput {
  arrays: any[][];
}

// Object Utilities
interface ObjectUtilityFunctions {
  deepClone: UtilityFunction<any, any>;
  deepMerge: UtilityFunction<DeepMergeInput, any>;
  pick: UtilityFunction<PickInput, any>;
  omit: UtilityFunction<OmitInput, any>;
  isEmpty: UtilityFunction<any, boolean>;
  isEqual: UtilityFunction<IsEqualInput, boolean>;
  flatten: UtilityFunction<FlattenInput, Record<string, any>>;
  unflatten: UtilityFunction<Record<string, any>, any>;
}

interface DeepMergeInput {
  target: any;
  source: any;
  options?: {
    arrayMerge?: 'replace' | 'concat' | 'merge';
    customMerge?: (key: string, target: any, source: any) => any;
  };
}

interface PickInput {
  object: any;
  keys: string[];
}

interface OmitInput {
  object: any;
  keys: string[];
}

interface IsEqualInput {
  value1: any;
  value2: any;
}

interface FlattenInput {
  object: any;
  separator?: string;
  maxDepth?: number;
}

// Date Utilities
interface DateUtilityFunctions {
  addDays: UtilityFunction<AddDaysInput, Date>;
  addMonths: UtilityFunction<AddMonthsInput, Date>;
  addYears: UtilityFunction<AddYearsInput, Date>;
  differenceInDays: UtilityFunction<DateDifferenceInput, number>;
  differenceInHours: UtilityFunction<DateDifferenceInput, number>;
  differenceInMinutes: UtilityFunction<DateDifferenceInput, number>;
  startOfDay: UtilityFunction<Date, Date>;
  endOfDay: UtilityFunction<Date, Date>;
  startOfWeek: UtilityFunction<StartOfWeekInput, Date>;
  endOfWeek: UtilityFunction<StartOfWeekInput, Date>;
  startOfMonth: UtilityFunction<Date, Date>;
  endOfMonth: UtilityFunction<Date, Date>;
  isSameDay: UtilityFunction<DateComparisonInput, boolean>;
  isSameWeek: UtilityFunction<DateComparisonInput, boolean>;
  isSameMonth: UtilityFunction<DateComparisonInput, boolean>;
  isToday: UtilityFunction<Date, boolean>;
  isYesterday: UtilityFunction<Date, boolean>;
  isTomorrow: UtilityFunction<Date, boolean>;
  isWeekend: UtilityFunction<Date, boolean>;
  isWeekday: UtilityFunction<Date, boolean>;
  getDayOfWeek: UtilityFunction<Date, number>;
  getWeekOfYear: UtilityFunction<Date, number>;
  getMonthOfYear: UtilityFunction<Date, number>;
  getQuarterOfYear: UtilityFunction<Date, number>;
}

interface AddDaysInput {
  date: Date;
  days: number;
}

interface AddMonthsInput {
  date: Date;
  months: number;
}

interface AddYearsInput {
  date: Date;
  years: number;
}

interface DateDifferenceInput {
  date1: Date;
  date2: Date;
}

interface StartOfWeekInput {
  date: Date;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
}

interface DateComparisonInput {
  date1: Date;
  date2: Date;
}

// Color Utilities
interface ColorUtilityFunctions {
  hexToRgb: UtilityFunction<string, RGBColor>;
  rgbToHex: UtilityFunction<RGBColor, string>;
  hslToRgb: UtilityFunction<HSLColor, RGBColor>;
  rgbToHsl: UtilityFunction<RGBColor, HSLColor>;
  lighten: UtilityFunction<ColorLightenInput, string>;
  darken: UtilityFunction<ColorDarkenInput, string>;
  getContrast: UtilityFunction<ContrastInput, number>;
  getLuminance: UtilityFunction<string, number>;
  isLight: UtilityFunction<string, boolean>;
  isDark: UtilityFunction<string, boolean>;
  generatePalette: UtilityFunction<PaletteInput, string[]>;
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

interface HSLColor {
  h: number;
  s: number;
  l: number;
}

interface ColorLightenInput {
  color: string;
  amount: number; // 0-1
}

interface ColorDarkenInput {
  color: string;
  amount: number; // 0-1
}

interface ContrastInput {
  color1: string;
  color2: string;
}

interface PaletteInput {
  baseColor: string;
  count: number;
  type: 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'tetradic';
}

// URL Utilities
interface URLUtilityFunctions {
  parseUrl: UtilityFunction<string, ParsedURL>;
  buildUrl: UtilityFunction<BuildUrlInput, string>;
  addQueryParams: UtilityFunction<AddQueryParamsInput, string>;
  removeQueryParams: UtilityFunction<RemoveQueryParamsInput, string>;
  isValidUrl: UtilityFunction<string, boolean>;
  getDomain: UtilityFunction<string, string>;
  getPath: UtilityFunction<string, string>;
  getQueryParams: UtilityFunction<string, Record<string, string>>;
}

interface ParsedURL {
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  query: Record<string, string>;
}

interface BuildUrlInput {
  protocol?: string;
  hostname: string;
  port?: string;
  pathname?: string;
  query?: Record<string, string>;
  hash?: string;
}

interface AddQueryParamsInput {
  url: string;
  params: Record<string, string>;
}

interface RemoveQueryParamsInput {
  url: string;
  params: string[];
}

// File Utilities
interface FileUtilityFunctions {
  getFileExtension: UtilityFunction<string, string>;
  getFileName: UtilityFunction<string, string>;
  getFileSize: UtilityFunction<File, number>;
  isValidImageType: UtilityFunction<string, boolean>;
  isValidVideoType: UtilityFunction<string, boolean>;
  isValidAudioType: UtilityFunction<string, boolean>;
  isValidDocumentType: UtilityFunction<string, boolean>;
  getMimeType: UtilityFunction<string, string>;
  formatFileSize: UtilityFunction<number, string>;
  generateFileName: UtilityFunction<GenerateFileNameInput, string>;
}

interface GenerateFileNameInput {
  originalName: string;
  prefix?: string;
  suffix?: string;
  timestamp?: boolean;
  random?: boolean;
  length?: number;
}

// Crypto Utilities
interface CryptoUtilityFunctions {
  hash: UtilityFunction<HashInput, string>;
  encrypt: UtilityFunction<EncryptInput, string>;
  decrypt: UtilityFunction<DecryptInput, string>;
  generateToken: UtilityFunction<GenerateTokenInput, string>;
  generateUUID: UtilityFunction<void, string>;
  generateRandomBytes: UtilityFunction<number, string>;
  verifyHash: UtilityFunction<VerifyHashInput, boolean>;
}

interface HashInput {
  data: string;
  algorithm: 'md5' | 'sha1' | 'sha256' | 'sha512';
  salt?: string;
}

interface EncryptInput {
  data: string;
  key: string;
  algorithm: 'aes-256-gcm' | 'aes-256-cbc';
}

interface DecryptInput {
  encryptedData: string;
  key: string;
  algorithm: 'aes-256-gcm' | 'aes-256-cbc';
}

interface GenerateTokenInput {
  length: number;
  charset?: string;
  prefix?: string;
  suffix?: string;
}

interface VerifyHashInput {
  data: string;
  hash: string;
  algorithm: 'md5' | 'sha1' | 'sha256' | 'sha512';
  salt?: string;
}
```

## Utility Registry

### Utility Registry Contract
```typescript
interface UtilityRegistry {
  register<TInput, TOutput>(utility: UtilityFunction<TInput, TOutput>): void;
  unregister(name: string): void;
  get<TInput, TOutput>(name: string): UtilityFunction<TInput, TOutput> | null;
  list(): UtilityFunction<any, any>[];
  validate(name: string, input: any): ValidationResult;
  execute<TInput, TOutput>(name: string, input: TInput): TOutput;
}

interface UtilityManager {
  registry: UtilityRegistry;
  cache: UtilityCache;
  logger: UtilityLogger;
  metrics: UtilityMetrics;
}

interface UtilityCache {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T, ttl?: number): void;
  delete(key: string): void;
  clear(): void;
}

interface UtilityLogger {
  debug(message: string, data?: any): void;
  info(message: string, data?: any): void;
  warn(message: string, data?: any): void;
  error(message: string, error?: Error): void;
}

interface UtilityMetrics {
  recordExecution(name: string, duration: number, success: boolean): void;
  getMetrics(name?: string): UtilityMetricsData;
}

interface UtilityMetricsData {
  totalExecutions: number;
  averageExecutionTime: number;
  successRate: number;
  errorRate: number;
  lastExecution: string;
}
```

## Testing Utilities

### Utility Testing Contracts
```typescript
interface UtilityTestHelper {
  createMockInput<T>(utility: UtilityFunction<any, T>): any;
  assertUtilityOutput<T>(utility: UtilityFunction<any, T>, input: any, expectedOutput: T): void;
  assertUtilityError(utility: UtilityFunction<any, any>, input: any, expectedError: string): void;
  benchmarkUtility<TInput, TOutput>(utility: UtilityFunction<TInput, TOutput>, inputs: TInput[]): BenchmarkResult;
}

interface BenchmarkResult {
  utility: string;
  iterations: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  memoryUsage: number;
}

interface UtilityTestSuite {
  testUtilityValidation(): Promise<void>;
  testUtilityExecution(): Promise<void>;
  testUtilityErrorHandling(): Promise<void>;
  testUtilityPerformance(): Promise<void>;
  testUtilityEdgeCases(): Promise<void>;
}
```

This utility function contract specification ensures consistent and type-safe utility implementations across the Diet Game application with proper validation, error handling, testing, and performance monitoring capabilities.
