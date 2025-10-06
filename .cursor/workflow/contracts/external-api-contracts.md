# External API Contracts

## Overview
This document defines the contracts for external API integrations in the Diet Game application, including third-party services, data providers, and external authentication systems.

## Base External API Contract

### Common Headers
```typescript
interface ExternalAPIHeaders {
  'Content-Type': 'application/json';
  'User-Agent': string;
  'Accept': 'application/json';
  'Authorization'?: string;
  'X-API-Key'?: string;
  'X-Request-ID': string;
  'X-Client-Version': string;
}

interface ExternalAPIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    provider: string;
    requestId: string;
    timestamp: string;
    rateLimit?: {
      limit: number;
      remaining: number;
      resetTime: string;
    };
  };
}
```

## Nutrition Data APIs

### USDA Food Database API
```typescript
interface USDAApiContract {
  baseUrl: 'https://api.nal.usda.gov/fdc/v1';
  version: 'v1';
  authentication: {
    type: 'api_key';
    header: 'X-API-Key';
  };
  rateLimit: {
    requests: 1000;
    window: '1h';
  };
}

interface USDASearchRequest {
  query: string;
  pageSize?: number;
  pageNumber?: number;
  dataType?: ('Foundation' | 'SR Legacy' | 'FNDDS' | 'Survey (FNDDS)')[];
  sortBy?: 'dataType.keyword' | 'publishedDate' | 'lowercaseDescription.keyword';
  sortOrder?: 'asc' | 'desc';
}

interface USDASearchResponse {
  foods: USDASearchResult[];
  totalHits: number;
  currentPage: number;
  totalPages: number;
}

interface USDASearchResult {
  fdcId: number;
  description: string;
  dataType: string;
  gtinUpc?: string;
  publishedDate: string;
  brandOwner?: string;
  ingredients?: string;
  marketCountry?: string;
  foodCategory?: {
    id: number;
    code: string;
    description: string;
  };
  allHighlightFields?: string;
  score?: number;
  microbes?: any[];
  foodNutrients?: USDANutrient[];
  foodComponents?: any[];
  foodAttributes?: any[];
  foodAttributeTypes?: any[];
  foodVersionIds?: any[];
}

interface USDANutrient {
  nutrientId: number;
  nutrientName: string;
  nutrientNumber: string;
  unitName: string;
  derivationCode?: string;
  derivationDescription?: string;
  derivationId?: number;
  value: number;
  foodNutrientSource?: {
    id: number;
    code: string;
    description: string;
  };
  foodNutrientDerivation?: {
    id: number;
    code: string;
    description: string;
  };
  indentLevel?: number;
  foodNutrientId?: number;
}

interface USDAFoodDetailsRequest {
  fdcId: number;
  nutrients?: number[];
}

interface USDAFoodDetailsResponse {
  fdcId: number;
  description: string;
  dataType: string;
  gtinUpc?: string;
  publishedDate: string;
  brandOwner?: string;
  brandName?: string;
  ingredients?: string;
  marketCountry?: string;
  foodCategory?: {
    id: number;
    code: string;
    description: string;
  };
  modifiedDate?: string;
  dataSource?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  householdServingFullText?: string;
  foodNutrients: USDANutrient[];
  foodComponents?: any[];
  foodAttributes?: any[];
  foodAttributeTypes?: any[];
  foodVersionIds?: any[];
  labelNutrients?: {
    fat?: { value: number };
    saturatedFat?: { value: number };
    transFat?: { value: number };
    cholesterol?: { value: number };
    sodium?: { value: number };
    carbohydrates?: { value: number };
    fiber?: { value: number };
    sugars?: { value: number };
    protein?: { value: number };
    calcium?: { value: number };
    iron?: { value: number };
    potassium?: { value: number };
    calories?: { value: number };
  };
}
```

### Edamam Nutrition API
```typescript
interface EdamamApiContract {
  baseUrl: 'https://api.edamam.com/api';
  version: 'v2';
  authentication: {
    type: 'app_id_app_key';
    appId: string;
    appKey: string;
  };
  rateLimit: {
    requests: 10;
    window: '1m';
  };
}

interface EdamamNutritionRequest {
  ingr: string[]; // Array of ingredients with quantities
  nutritionType?: 'cooking' | 'logging';
  category?: string;
  categoryLabel?: string;
}

interface EdamamNutritionResponse {
  calories: number;
  totalWeight: number;
  dietLabels: string[];
  healthLabels: string[];
  cautions: string[];
  totalNutrients: Record<string, EdamamNutrient>;
  totalDaily: Record<string, EdamamNutrient>;
  ingredients: EdamamIngredient[];
}

interface EdamamNutrient {
  label: string;
  quantity: number;
  unit: string;
}

interface EdamamIngredient {
  text: string;
  parsed: EdamamParsedIngredient[];
}

interface EdamamParsedIngredient {
  quantity: number;
  measure: string;
  food: string;
  foodId: string;
  weight: number;
  retainedWeight: number;
  measureURI: string;
  status: string;
}
```

### Spoonacular API
```typescript
interface SpoonacularApiContract {
  baseUrl: 'https://api.spoonacular.com';
  version: 'v1';
  authentication: {
    type: 'api_key';
    header: 'X-API-Key';
  };
  rateLimit: {
    requests: 150;
    window: '1d';
  };
}

interface SpoonacularRecipeSearchRequest {
  query: string;
  cuisine?: string;
  diet?: string;
  intolerances?: string;
  type?: string;
  maxReadyTime?: number;
  minCalories?: number;
  maxCalories?: number;
  minProtein?: number;
  maxProtein?: number;
  minCarbs?: number;
  maxCarbs?: number;
  minFat?: number;
  maxFat?: number;
  number?: number;
  offset?: number;
  sort?: 'meta-score' | 'popularity' | 'healthiness' | 'price' | 'time' | 'random';
  sortDirection?: 'asc' | 'desc';
}

interface SpoonacularRecipeSearchResponse {
  results: SpoonacularRecipe[];
  offset: number;
  number: number;
  totalResults: number;
}

interface SpoonacularRecipe {
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  image: string;
  imageType: string;
  summary: string;
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  occasions: string[];
  instructions: string;
  analyzedInstructions: SpoonacularAnalyzedInstruction[];
  spoonacularSourceUrl: string;
  aggregateLikes: number;
  healthScore: number;
  spoonacularScore: number;
  pricePerServing: number;
  cheap: boolean;
  creditsText: string;
  license: string;
  sourceName: string;
  extendedIngredients: SpoonacularIngredient[];
  nutrition: SpoonacularNutrition;
  winePairing?: SpoonacularWinePairing;
}

interface SpoonacularIngredient {
  id: number;
  aisle: string;
  image: string;
  consistency: string;
  name: string;
  nameClean: string;
  original: string;
  originalName: string;
  amount: number;
  unit: string;
  meta: string[];
  measures: {
    us: SpoonacularMeasure;
    metric: SpoonacularMeasure;
  };
}

interface SpoonacularMeasure {
  amount: number;
  unitShort: string;
  unitLong: string;
}

interface SpoonacularNutrition {
  nutrients: SpoonacularNutrient[];
  properties: SpoonacularProperty[];
  flavonoids: SpoonacularFlavonoid[];
  caloricBreakdown: {
    percentProtein: number;
    percentFat: number;
    percentCarbs: number;
  };
  weightPerServing: {
    amount: number;
    unit: string;
  };
}

interface SpoonacularNutrient {
  name: string;
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

interface SpoonacularProperty {
  name: string;
  amount: number;
  unit: string;
}

interface SpoonacularFlavonoid {
  name: string;
  amount: number;
  unit: string;
}
```

## Fitness and Exercise APIs

### ExerciseDB API
```typescript
interface ExerciseDBApiContract {
  baseUrl: 'https://exercisedb.p.rapidapi.com';
  authentication: {
    type: 'rapidapi_key';
    header: 'X-RapidAPI-Key';
  };
  rateLimit: {
    requests: 1000;
    window: '1d';
  };
}

interface ExerciseSearchRequest {
  name?: string;
  type?: string;
  muscle?: string;
  equipment?: string;
  difficulty?: 'beginner' | 'intermediate' | 'expert';
  limit?: number;
  offset?: number;
}

interface ExerciseSearchResponse {
  exercises: Exercise[];
  total: number;
  limit: number;
  offset: number;
}

interface Exercise {
  id: string;
  name: string;
  gifUrl: string;
  target: string;
  bodyPart: string;
  equipment: string;
  secondaryMuscles: string[];
  instructions: string[];
}
```

### Fitbit API
```typescript
interface FitbitApiContract {
  baseUrl: 'https://api.fitbit.com';
  version: 'v1';
  authentication: {
    type: 'oauth2';
    scopes: string[];
  };
  rateLimit: {
    requests: 150;
    window: '1h';
  };
}

interface FitbitActivityRequest {
  date: string; // YYYY-MM-DD format
  period?: '1d' | '7d' | '30d' | '1w' | '1m' | '3m' | '6m' | '1y' | 'max';
  baseDate?: string;
  endDate?: string;
}

interface FitbitActivityResponse {
  activities: FitbitActivity[];
  goals: FitbitActivityGoals;
  summary: FitbitActivitySummary;
}

interface FitbitActivity {
  activityId: number;
  activityParentId: number;
  activityParentName: string;
  calories: number;
  description: string;
  distance: number;
  duration: number;
  hasStartTime: boolean;
  isFavorite: boolean;
  lastModified: string;
  logId: number;
  name: string;
  startTime: string;
  steps: number;
}

interface FitbitActivityGoals {
  activeMinutes: number;
  caloriesOut: number;
  distance: number;
  floors: number;
  steps: number;
}

interface FitbitActivitySummary {
  activeScore: number;
  activityCalories: number;
  caloriesBMR: number;
  caloriesOut: number;
  distances: FitbitDistance[];
  elevation: number;
  fairlyActiveMinutes: number;
  floors: number;
  heartRateZones: FitbitHeartRateZone[];
  lightlyActiveMinutes: number;
  marginalCalories: number;
  restingHeartRate: number;
  sedentaryMinutes: number;
  steps: number;
  veryActiveMinutes: number;
}

interface FitbitDistance {
  activity: string;
  distance: number;
}

interface FitbitHeartRateZone {
  caloriesOut: number;
  max: number;
  min: number;
  minutes: number;
  name: string;
}
```

## Authentication APIs

### Google OAuth API
```typescript
interface GoogleOAuthApiContract {
  baseUrl: 'https://oauth2.googleapis.com';
  version: 'v2';
  authentication: {
    type: 'oauth2';
    scopes: string[];
  };
}

interface GoogleTokenRequest {
  client_id: string;
  client_secret: string;
  code: string;
  grant_type: 'authorization_code';
  redirect_uri: string;
}

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: 'Bearer';
}

interface GoogleUserInfoRequest {
  access_token: string;
}

interface GoogleUserInfoResponse {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}
```

### Apple Sign-In API
```typescript
interface AppleSignInApiContract {
  baseUrl: 'https://appleid.apple.com';
  version: 'v1';
  authentication: {
    type: 'jwt';
    algorithm: 'RS256';
  };
}

interface AppleTokenRequest {
  client_id: string;
  client_secret: string;
  code: string;
  grant_type: 'authorization_code';
  redirect_uri: string;
}

interface AppleTokenResponse {
  access_token: string;
  token_type: 'Bearer';
  expires_in: number;
  refresh_token: string;
  id_token: string;
}

interface AppleUserInfo {
  sub: string; // User ID
  email?: string;
  email_verified?: boolean;
  name?: {
    firstName?: string;
    lastName?: string;
  };
}
```

## Weather API

### OpenWeatherMap API
```typescript
interface OpenWeatherApiContract {
  baseUrl: 'https://api.openweathermap.org/data/2.5';
  version: '2.5';
  authentication: {
    type: 'api_key';
    parameter: 'appid';
  };
  rateLimit: {
    requests: 1000;
    window: '1d';
  };
}

interface WeatherRequest {
  lat: number;
  lon: number;
  appid: string;
  units?: 'metric' | 'imperial' | 'kelvin';
  lang?: string;
}

interface WeatherResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherCondition[];
  base: string;
  main: WeatherMain;
  visibility: number;
  wind: WeatherWind;
  clouds: WeatherClouds;
  dt: number;
  sys: WeatherSys;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface WeatherMain {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
}

interface WeatherWind {
  speed: number;
  deg: number;
  gust?: number;
}

interface WeatherClouds {
  all: number;
}

interface WeatherSys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}
```

## Payment APIs

### Stripe API
```typescript
interface StripeApiContract {
  baseUrl: 'https://api.stripe.com';
  version: 'v1';
  authentication: {
    type: 'bearer_token';
    header: 'Authorization';
  };
  rateLimit: {
    requests: 100;
    window: '1s';
  };
}

interface StripePaymentIntentRequest {
  amount: number;
  currency: string;
  customer?: string;
  payment_method?: string;
  confirmation_method?: 'automatic' | 'manual';
  confirm?: boolean;
  description?: string;
  metadata?: Record<string, string>;
}

interface StripePaymentIntentResponse {
  id: string;
  object: 'payment_intent';
  amount: number;
  amount_capturable: number;
  amount_received: number;
  application: string | null;
  application_fee_amount: number | null;
  automatic_payment_methods: any;
  canceled_at: number | null;
  cancellation_reason: string | null;
  capture_method: 'automatic' | 'manual';
  charges: {
    object: 'list';
    data: StripeCharge[];
    has_more: boolean;
    total_count: number;
    url: string;
  };
  client_secret: string;
  confirmation_method: 'automatic' | 'manual';
  created: number;
  currency: string;
  customer: string | null;
  description: string | null;
  invoice: string | null;
  last_payment_error: any;
  latest_charge: string | null;
  livemode: boolean;
  metadata: Record<string, string>;
  next_action: any;
  on_behalf_of: string | null;
  payment_method: string | null;
  payment_method_options: any;
  payment_method_types: string[];
  processing: any;
  receipt_email: string | null;
  review: string | null;
  setup_future_usage: string | null;
  shipping: any;
  source: string | null;
  statement_descriptor: string | null;
  statement_descriptor_suffix: string | null;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'requires_capture' | 'canceled' | 'succeeded';
  transfer_data: any;
  transfer_group: string | null;
}

interface StripeCharge {
  id: string;
  object: 'charge';
  amount: number;
  amount_captured: number;
  amount_refunded: number;
  application: string | null;
  application_fee: string | null;
  application_fee_amount: number | null;
  balance_transaction: string | null;
  billing_details: StripeBillingDetails;
  calculated_statement_descriptor: string | null;
  captured: boolean;
  created: number;
  currency: string;
  customer: string | null;
  description: string | null;
  destination: string | null;
  dispute: string | null;
  disputed: boolean;
  failure_code: string | null;
  failure_message: string | null;
  fraud_details: any;
  invoice: string | null;
  livemode: boolean;
  metadata: Record<string, string>;
  on_behalf_of: string | null;
  order: string | null;
  outcome: any;
  paid: boolean;
  payment_intent: string | null;
  payment_method: string | null;
  payment_method_details: any;
  receipt_email: string | null;
  receipt_number: string | null;
  receipt_url: string | null;
  refunded: boolean;
  refunds: any;
  review: string | null;
  shipping: any;
  source: any;
  source_transfer: string | null;
  statement_descriptor: string | null;
  statement_descriptor_suffix: string | null;
  status: 'succeeded' | 'pending' | 'failed';
  transfer_data: any;
  transfer_group: string | null;
}

interface StripeBillingDetails {
  address: {
    city: string | null;
    country: string | null;
    line1: string | null;
    line2: string | null;
    postal_code: string | null;
    state: string | null;
  };
  email: string | null;
  name: string | null;
  phone: string | null;
}
```

## Error Handling

### External API Error Response
```typescript
interface ExternalAPIError {
  code: string;
  message: string;
  details?: any;
  provider: string;
  timestamp: string;
  requestId: string;
}

enum ExternalAPIErrorCode {
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  INVALID_REQUEST = 'INVALID_REQUEST',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}
```

### Retry Strategy
```typescript
interface RetryConfig {
  maxAttempts: number;
  baseDelay: number; // milliseconds
  maxDelay: number; // milliseconds
  backoffMultiplier: number;
  retryableErrors: string[];
}

interface RetryableError {
  code: string;
  retryAfter?: number; // seconds
  isRetryable: boolean;
}
```

## Rate Limiting

### Rate Limit Headers
```typescript
interface RateLimitHeaders {
  'X-RateLimit-Limit': string;
  'X-RateLimit-Remaining': string;
  'X-RateLimit-Reset': string;
  'X-RateLimit-Retry-After'?: string;
}

interface RateLimitInfo {
  limit: number;
  remaining: number;
  resetTime: string;
  retryAfter?: number;
}
```

## Caching Strategy

### Cache Configuration
```typescript
interface CacheConfig {
  ttl: number; // seconds
  maxSize: number; // number of items
  strategy: 'lru' | 'fifo' | 'ttl';
  keyPrefix: string;
}

interface CacheEntry<T> {
  key: string;
  value: T;
  expiresAt: number;
  createdAt: number;
  accessCount: number;
  lastAccessed: number;
}
```

## Monitoring and Analytics

### API Usage Metrics
```typescript
interface APIUsageMetrics {
  provider: string;
  endpoint: string;
  requestCount: number;
  successCount: number;
  errorCount: number;
  averageResponseTime: number;
  totalDataTransferred: number;
  lastRequestTime: string;
  rateLimitHits: number;
}

interface APIMonitor {
  getMetrics(provider?: string): Promise<APIUsageMetrics[]>;
  getHealthStatus(): Promise<HealthStatus>;
  getErrorLogs(): Promise<ErrorLog[]>;
}
```

This external API contract specification ensures reliable integration with third-party services while maintaining proper error handling, rate limiting, and monitoring capabilities.
