# Performance Architecture

## Overview
This document outlines the performance architecture and optimization strategies for the Diet Planner Game application, covering frontend performance, backend optimization, caching strategies, and monitoring.

## Performance Principles

### 1. Core Web Vitals
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1

### 2. Performance Budget
- **Initial Bundle Size**: < 250KB gzipped
- **Time to Interactive**: < 3 seconds
- **First Contentful Paint**: < 1.5 seconds
- **API Response Time**: < 200ms (95th percentile)

### 3. Progressive Enhancement
- Core functionality works without JavaScript
- Enhanced features load progressively
- Graceful degradation for older browsers

## Frontend Performance

### 1. Bundle Optimization

#### Code Splitting Strategy
```typescript
// Route-based code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const TasksPage = lazy(() => import('./pages/TasksPage'));
const CoachPage = lazy(() => import('./pages/CoachPage'));
const NutritionPage = lazy(() => import('./pages/NutritionPage'));
const GamificationPage = lazy(() => import('./pages/GamificationPage'));

// Component-based code splitting
const AdvancedTaskManager = lazy(() => import('./components/tasks/AdvancedTaskManager'));
const UserProfileForm = lazy(() => import('./components/forms/UserProfileForm'));

// App routing with Suspense
const App: React.FC = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/coach" element={<CoachPage />} />
          <Route path="/nutrition" element={<NutritionPage />} />
          <Route path="/gamification" element={<GamificationPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};
```

#### Tree Shaking Configuration
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          ui: ['lucide-react', 'framer-motion'],
          utils: ['zustand', '@tanstack/react-query']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
```

### 2. Asset Optimization

#### Image Optimization
```typescript
// Image optimization component
interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  priority = false,
  className
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <span className="text-gray-400">Image failed to load</span>
        </div>
      )}
    </div>
  );
};
```

#### Font Optimization
```css
/* font-optimization.css */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-regular.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url('/fonts/inter-semibold.woff2') format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

### 3. State Management Optimization

#### Zustand Store Optimization
```typescript
// Optimized store with selectors
export const useNutriStore = create<NutriState>()(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        // ... store implementation
      })),
      {
        name: 'nutriquest-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          progress: state.progress,
          userProfile: state.userProfile,
          headerStatus: state.headerStatus,
          lastSyncTime: state.lastSyncTime,
        }),
        // Only persist essential data
        skipHydration: false,
        onRehydrateStorage: () => (state) => {
          // Optimize rehydration
          if (state) {
            state.pendingUpdates = [];
            state.error = null;
          }
        }
      }
    )
  )
);

// Optimized selectors to prevent unnecessary re-renders
export const useProgress = () => useNutriStore((state) => state.progress);
export const useUserProfile = () => useNutriStore((state) => state.userProfile);
export const useHeaderStatus = () => useNutriStore((state) => state.headerStatus);

// Computed selectors with memoization
export const useXPProgress = () => useNutriStore(
  useCallback((state) => state.getXPProgress(), [])
);

export const useStars = () => useNutriStore(
  useCallback((state) => state.getStars(), [])
);
```

#### React Query Optimization
```typescript
// Optimized React Query configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error.status === 404) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Optimized query hooks
export const useUserProgress = (userId: string) => {
  return useQuery({
    queryKey: ['userProgress', userId],
    queryFn: () => FirestoreService.getUserProgress(userId),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes for user progress
  });
};

export const useRecipes = (filters: RecipeFilters) => {
  return useQuery({
    queryKey: ['recipes', filters],
    queryFn: () => RecipeService.getRecipes(filters),
    staleTime: 10 * 60 * 1000, // 10 minutes for recipes
    select: (data) => data.filter(recipe => recipe.isInventoryAvailable),
  });
};
```

### 4. Component Optimization

#### Memoization Strategies
```typescript
// Memoized components
const TaskCard = React.memo<TaskCardProps>(({ task, onComplete, onEdit }) => {
  const handleComplete = useCallback(() => {
    onComplete(task.id);
  }, [task.id, onComplete]);
  
  const handleEdit = useCallback(() => {
    onEdit?.(task.id);
  }, [task.id, onEdit]);
  
  return (
    <div className="task-card">
      <h3>{task.name}</h3>
      <p>Reward: {task.xpReward} XP</p>
      <div className="task-actions">
        <button onClick={handleComplete}>Complete</button>
        {onEdit && <button onClick={handleEdit}>Edit</button>}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.completed === nextProps.task.completed &&
    prevProps.task.name === nextProps.task.name
  );
});

// Memoized expensive calculations
const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskComplete }) => {
  const sortedTasks = useMemo(() => 
    tasks.sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return a.priority - b.priority;
    }),
    [tasks]
  );
  
  const completedCount = useMemo(() => 
    tasks.filter(task => task.completed).length,
    [tasks]
  );
  
  return (
    <div className="task-list">
      <div className="task-stats">
        Completed: {completedCount}/{tasks.length}
      </div>
      {sortedTasks.map(task => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={onTaskComplete}
        />
      ))}
    </div>
  );
};
```

#### Virtual Scrolling for Large Lists
```typescript
// Virtual scrolling for large task lists
import { FixedSizeList as List } from 'react-window';

interface VirtualizedTaskListProps {
  tasks: Task[];
  onTaskComplete: (taskId: number) => void;
}

const VirtualizedTaskList: React.FC<VirtualizedTaskListProps> = ({
  tasks,
  onTaskComplete
}) => {
  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <TaskCard
        task={tasks[index]}
        onComplete={onTaskComplete}
      />
    </div>
  ), [tasks, onTaskComplete]);
  
  return (
    <List
      height={600}
      itemCount={tasks.length}
      itemSize={80}
      itemData={tasks}
    >
      {Row}
    </List>
  );
};
```

## Backend Performance

### 1. Database Optimization

#### Firestore Query Optimization
```typescript
// Optimized Firestore queries
export class OptimizedFirestoreService {
  // Batch operations for better performance
  static async batchUpdateUserData(
    userId: string,
    updates: { progress?: Partial<UserProgress>; profile?: Partial<UserProfile> }
  ) {
    const batch = writeBatch(db);
    
    if (updates.progress) {
      const progressRef = doc(db, this.getUserDocPath(userId, 'progress'));
      batch.update(progressRef, updates.progress);
    }
    
    if (updates.profile) {
      const profileRef = doc(db, this.getUserDocPath(userId, 'profile'));
      batch.update(profileRef, updates.profile);
    }
    
    await batch.commit();
  }
  
  // Optimized queries with proper indexing
  static async getUserTasks(
    userId: string,
    filters: TaskFilters = {}
  ): Promise<Task[]> {
    let query = collection(db, this.getUserDocPath(userId, 'tasks'));
    
    // Apply filters with proper indexing
    if (filters.completed !== undefined) {
      query = query.where('completed', '==', filters.completed);
    }
    
    if (filters.type) {
      query = query.where('type', '==', filters.type);
    }
    
    if (filters.dateRange) {
      query = query
        .where('createdAt', '>=', filters.dateRange.start)
        .where('createdAt', '<=', filters.dateRange.end);
    }
    
    // Limit results for performance
    query = query.limit(filters.limit || 50);
    
    const snapshot = await getDocs(query);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
  }
  
  // Pagination for large datasets
  static async getPaginatedTasks(
    userId: string,
    pageSize: number = 20,
    lastDoc?: DocumentSnapshot
  ): Promise<{ tasks: Task[]; lastDoc: DocumentSnapshot | null }> {
    let query = collection(db, this.getUserDocPath(userId, 'tasks'))
      .orderBy('createdAt', 'desc')
      .limit(pageSize);
    
    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }
    
    const snapshot = await getDocs(query);
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
    
    return {
      tasks,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
    };
  }
}
```

#### Caching Strategy
```typescript
// Multi-level caching system
export class CacheService {
  private static memoryCache = new Map<string, { data: any; expiry: number }>();
  private static readonly MEMORY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  // Memory cache
  static setMemoryCache(key: string, data: any, ttl: number = this.MEMORY_CACHE_TTL) {
    this.memoryCache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }
  
  static getMemoryCache(key: string): any | null {
    const cached = this.memoryCache.get(key);
    if (cached && cached.expiry > Date.now()) {
      return cached.data;
    }
    this.memoryCache.delete(key);
    return null;
  }
  
  // Local storage cache
  static setLocalCache(key: string, data: any, ttl: number = 60 * 60 * 1000) {
    const cacheData = {
      data,
      expiry: Date.now() + ttl
    };
    localStorage.setItem(`cache_${key}`, JSON.stringify(cacheData));
  }
  
  static getLocalCache(key: string): any | null {
    try {
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        const { data, expiry } = JSON.parse(cached);
        if (expiry > Date.now()) {
          return data;
        }
        localStorage.removeItem(`cache_${key}`);
      }
    } catch (error) {
      console.error('Cache read error:', error);
    }
    return null;
  }
  
  // Cache with fallback
  static async getWithCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttl: number = this.MEMORY_CACHE_TTL
  ): Promise<T> {
    // Try memory cache first
    let data = this.getMemoryCache(key);
    if (data) return data;
    
    // Try local storage cache
    data = this.getLocalCache(key);
    if (data) {
      this.setMemoryCache(key, data, ttl);
      return data;
    }
    
    // Fetch from source
    data = await fetchFn();
    
    // Cache the result
    this.setMemoryCache(key, data, ttl);
    this.setLocalCache(key, data, ttl * 12); // Longer TTL for local storage
    
    return data;
  }
}
```

### 2. API Optimization

#### Request Batching
```typescript
// Request batching service
export class BatchRequestService {
  private static batchQueue: Array<{
    id: string;
    request: () => Promise<any>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];
  
  private static batchTimer: NodeJS.Timeout | null = null;
  private static readonly BATCH_DELAY = 50; // 50ms
  
  static async batchRequest<T>(id: string, request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.batchQueue.push({ id, request, resolve, reject });
      
      if (!this.batchTimer) {
        this.batchTimer = setTimeout(() => {
          this.processBatch();
        }, this.BATCH_DELAY);
      }
    });
  }
  
  private static async processBatch() {
    const batch = [...this.batchQueue];
    this.batchQueue = [];
    this.batchTimer = null;
    
    // Group requests by type
    const groupedRequests = batch.reduce((groups, item) => {
      if (!groups[item.id]) {
        groups[item.id] = [];
      }
      groups[item.id].push(item);
      return groups;
    }, {} as Record<string, typeof batch>);
    
    // Process each group
    for (const [id, requests] of Object.entries(groupedRequests)) {
      try {
        const result = await requests[0].request();
        requests.forEach(req => req.resolve(result));
      } catch (error) {
        requests.forEach(req => req.reject(error));
      }
    }
  }
}
```

#### Response Compression
```typescript
// Response compression middleware
import compression from 'compression';

const compressionMiddleware = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6, // Compression level (1-9)
  threshold: 1024, // Only compress responses > 1KB
  memLevel: 8, // Memory level for compression
  chunkSize: 16 * 1024, // 16KB chunks
});

export default compressionMiddleware;
```

## Monitoring & Analytics

### 1. Performance Monitoring

#### Web Vitals Tracking
```typescript
// Web Vitals monitoring
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export class PerformanceMonitor {
  static init() {
    // Track Core Web Vitals
    getCLS(this.sendToAnalytics);
    getFID(this.sendToAnalytics);
    getFCP(this.sendToAnalytics);
    getLCP(this.sendToAnalytics);
    getTTFB(this.sendToAnalytics);
    
    // Track custom metrics
    this.trackCustomMetrics();
  }
  
  private static sendToAnalytics(metric: any) {
    // Send to analytics service
    if (typeof gtag !== 'undefined') {
      gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }
    
    // Send to custom analytics
    this.sendToCustomAnalytics(metric);
  }
  
  private static trackCustomMetrics() {
    // Track bundle size
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      this.trackMetric('bundle_size', {
        value: navigation.transferSize,
        label: 'initial_bundle'
      });
    }
    
    // Track API response times
    this.trackAPIMetrics();
  }
  
  private static trackAPIMetrics() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const start = performance.now();
      
      try {
        const response = await originalFetch(...args);
        const duration = performance.now() - start;
        
        this.trackMetric('api_response_time', {
          value: duration,
          label: args[0]?.toString() || 'unknown'
        });
        
        return response;
      } catch (error) {
        const duration = performance.now() - start;
        
        this.trackMetric('api_error', {
          value: duration,
          label: args[0]?.toString() || 'unknown'
        });
        
        throw error;
      }
    };
  }
  
  private static trackMetric(name: string, data: { value: number; label: string }) {
    // Send to monitoring service
    console.log(`Metric: ${name}`, data);
  }
  
  private static sendToCustomAnalytics(metric: any) {
    // Implementation for custom analytics service
  }
}
```

#### Real User Monitoring (RUM)
```typescript
// Real User Monitoring
export class RUMService {
  static init() {
    // Track page load performance
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.collectPageMetrics();
      }, 0);
    });
    
    // Track user interactions
    this.trackUserInteractions();
    
    // Track errors
    this.trackErrors();
  }
  
  private static collectPageMetrics() {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    const metrics = {
      dns: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcp: navigation.connectEnd - navigation.connectStart,
      ssl: navigation.secureConnectionStart > 0 ? navigation.connectEnd - navigation.secureConnectionStart : 0,
      ttfb: navigation.responseStart - navigation.requestStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
      loadComplete: navigation.loadEventEnd - navigation.navigationStart,
      firstPaint: this.getFirstPaint(),
      firstContentfulPaint: this.getFirstContentfulPaint()
    };
    
    this.sendMetrics('page_load', metrics);
  }
  
  private static getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }
  
  private static getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstContentfulPaint = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return firstContentfulPaint ? firstContentfulPaint.startTime : 0;
  }
  
  private static trackUserInteractions() {
    // Track button clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        this.sendMetrics('user_interaction', {
          type: 'click',
          element: target.textContent || target.className,
          timestamp: Date.now()
        });
      }
    });
    
    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.sendMetrics('user_interaction', {
        type: 'form_submit',
        form: form.id || form.className,
        timestamp: Date.now()
      });
    });
  }
  
  private static trackErrors() {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.sendMetrics('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: Date.now()
      });
    });
    
    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.sendMetrics('promise_rejection', {
        reason: event.reason?.toString() || 'Unknown',
        timestamp: Date.now()
      });
    });
  }
  
  private static sendMetrics(type: string, data: any) {
    // Send to monitoring service
    console.log(`RUM Metric: ${type}`, data);
  }
}
```

### 2. Performance Budget Monitoring

#### Bundle Size Monitoring
```javascript
// bundle-size-monitor.js
const fs = require('fs');
const path = require('path');
const gzipSize = require('gzip-size');

const BUDGETS = {
  'index.js': 250 * 1024, // 250KB
  'index.css': 50 * 1024,  // 50KB
  'vendor.js': 500 * 1024, // 500KB
};

function checkBundleSizes() {
  const distPath = path.join(__dirname, 'dist');
  const assetsPath = path.join(distPath, 'assets');
  
  if (!fs.existsSync(assetsPath)) {
    console.error('Assets directory not found');
    process.exit(1);
  }
  
  const files = fs.readdirSync(assetsPath);
  let totalSize = 0;
  let budgetExceeded = false;
  
  files.forEach(file => {
    const filePath = path.join(assetsPath, file);
    const stats = fs.statSync(filePath);
    const gzippedSize = gzipSize.fileSync(filePath);
    
    totalSize += gzippedSize;
    
    // Check individual file budgets
    const budget = BUDGETS[file] || BUDGETS[file.split('.')[0] + '.js'] || BUDGETS[file.split('.')[0] + '.css'];
    
    if (budget && gzippedSize > budget) {
      console.error(`❌ ${file} exceeds budget: ${(gzippedSize / 1024).toFixed(2)}KB > ${(budget / 1024).toFixed(2)}KB`);
      budgetExceeded = true;
    } else {
      console.log(`✅ ${file}: ${(gzippedSize / 1024).toFixed(2)}KB`);
    }
  });
  
  // Check total budget
  const totalBudget = 1000 * 1024; // 1MB
  if (totalSize > totalBudget) {
    console.error(`❌ Total bundle size exceeds budget: ${(totalSize / 1024).toFixed(2)}KB > ${(totalBudget / 1024).toFixed(2)}KB`);
    budgetExceeded = true;
  } else {
    console.log(`✅ Total bundle size: ${(totalSize / 1024).toFixed(2)}KB`);
  }
  
  if (budgetExceeded) {
    process.exit(1);
  }
}

checkBundleSizes();
```

#### Performance Regression Testing
```typescript
// performance-regression.test.ts
import { chromium, Browser, Page } from 'playwright';

describe('Performance Regression Tests', () => {
  let browser: Browser;
  let page: Page;
  
  beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
  });
  
  afterAll(async () => {
    await browser.close();
  });
  
  test('Homepage loads within performance budget', async () => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Check load time budget
    expect(loadTime).toBeLessThan(3000); // 3 seconds
    
    // Check Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const metrics: any = {};
          
          entries.forEach((entry) => {
            if (entry.entryType === 'largest-contentful-paint') {
              metrics.lcp = entry.startTime;
            }
            if (entry.entryType === 'first-input') {
              metrics.fid = entry.processingStart - entry.startTime;
            }
            if (entry.entryType === 'layout-shift') {
              metrics.cls = (metrics.cls || 0) + (entry as any).value;
            }
          });
          
          resolve(metrics);
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
        
        // Resolve after 5 seconds
        setTimeout(() => resolve({}), 5000);
      });
    });
    
    expect(metrics.lcp).toBeLessThan(2500); // 2.5 seconds
    expect(metrics.fid).toBeLessThan(100); // 100ms
    expect(metrics.cls).toBeLessThan(0.1); // 0.1
  });
  
  test('API responses are within budget', async () => {
    const response = await page.request.get('http://localhost:3000/api/user/progress');
    const responseTime = response.headers()['x-response-time'];
    
    expect(parseInt(responseTime)).toBeLessThan(200); // 200ms
  });
});
```

This performance architecture ensures the Diet Planner Game application delivers optimal user experience while maintaining scalability and monitoring capabilities for continuous improvement.
