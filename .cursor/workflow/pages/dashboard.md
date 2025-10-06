# Dashboard Page Specification

## EARS Requirements

**EARS-DSH-001**: The system shall provide a comprehensive dashboard displaying user progress, achievements, and key metrics.

**EARS-DSH-002**: The system shall show real-time nutrition tracking data and daily goal progress.

**EARS-DSH-003**: The system shall display personalized recommendations and AI coach insights.

**EARS-DSH-004**: The system shall provide quick access to frequently used features and actions.

**EARS-DSH-005**: The system shall support customizable widgets and layout preferences.

**EARS-DSH-006**: The system shall display social activity and community updates.

## Dashboard Layout Structure

### Header Section
```typescript
interface DashboardHeader {
  user: {
    name: string;
    level: number;
    xp: number;
    avatar: string;
    streak: number;
  };
  date: {
    current: Date;
    timezone: string;
    greeting: string;
  };
  quickActions: [
    {
      id: 'log_meal';
      label: 'Log Meal';
      icon: 'plus';
      action: 'open_meal_logger';
      priority: 'high';
    },
    {
      id: 'ai_chat';
      label: 'Ask AI';
      icon: 'message-circle';
      action: 'open_ai_chat';
      priority: 'high';
    },
    {
      id: 'view_quests';
      label: 'Quests';
      icon: 'target';
      action: 'open_quests';
      priority: 'medium';
    }
  ];
  notifications: {
    count: number;
    unread: boolean;
    latest: Notification[];
  };
}
```

### Main Content Areas

#### 1. Progress Overview Widget
```typescript
interface ProgressOverviewWidget {
  id: 'progress_overview';
  title: 'Today\'s Progress';
  size: 'large';
  position: { row: 1; col: 1; span: 2 };
  data: {
    dailyGoals: {
      calories: {
        target: number;
        consumed: number;
        remaining: number;
        percentage: number;
      };
      protein: {
        target: number;
        consumed: number;
        remaining: number;
        percentage: number;
      };
      carbs: {
        target: number;
        consumed: number;
        remaining: number;
        percentage: number;
      };
      fat: {
        target: number;
        consumed: number;
        remaining: number;
        percentage: number;
      };
    };
    water: {
      target: number;
      consumed: number;
      percentage: number;
    };
    exercise: {
      target: number;
      completed: number;
      percentage: number;
    };
  };
  visualizations: [
    {
      type: 'circular_progress';
      data: 'calories';
      size: 'large';
      showPercentage: true;
    },
    {
      type: 'bar_chart';
      data: 'macros';
      size: 'medium';
      showValues: true;
    },
    {
      type: 'water_drop';
      data: 'water';
      size: 'small';
      animated: true;
    }
  ];
}
```

#### 2. Level & XP Widget
```typescript
interface LevelXPWidget {
  id: 'level_xp';
  title: 'Level Progress';
  size: 'medium';
  position: { row: 1; col: 3; span: 1 };
  data: {
    currentLevel: number;
    currentXP: number;
    nextLevelXP: number;
    progressPercentage: number;
    xpToNextLevel: number;
    recentGains: [
      {
        source: string;
        amount: number;
        timestamp: Date;
        icon: string;
      }
    ];
  };
  visualizations: [
    {
      type: 'xp_bar';
      animated: true;
      showMilestones: true;
    },
    {
      type: 'recent_activities';
      maxItems: 5;
      showIcons: true;
    }
  ];
}
```

#### 3. Streak & Achievements Widget
```typescript
interface StreakAchievementsWidget {
  id: 'streak_achievements';
  title: 'Streaks & Achievements';
  size: 'medium';
  position: { row: 2; col: 1; span: 1 };
  data: {
    currentStreak: {
      days: number;
      type: 'nutrition' | 'exercise' | 'overall';
      bestStreak: number;
      startDate: Date;
    };
    recentAchievements: [
      {
        id: string;
        name: string;
        description: string;
        icon: string;
        rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
        unlockedAt: Date;
        xpReward: number;
      }
    ];
    upcomingMilestones: [
      {
        id: string;
        name: string;
        progress: number;
        target: number;
        reward: string;
        estimatedCompletion: Date;
      }
    ];
  };
  visualizations: [
    {
      type: 'streak_counter';
      animated: true;
      showBest: true;
    },
    {
      type: 'achievement_grid';
      maxItems: 6;
      showRarity: true;
    },
    {
      type: 'milestone_progress';
      maxItems: 3;
      showETA: true;
    }
  ];
}
```

#### 4. AI Coach Insights Widget
```typescript
interface AICoachWidget {
  id: 'ai_coach_insights';
  title: 'AI Coach Insights';
  size: 'large';
  position: { row: 2; col: 2; span: 2 };
  data: {
    dailyInsight: {
      title: string;
      message: string;
      type: 'tip' | 'warning' | 'celebration' | 'suggestion';
      confidence: number;
      actionable: boolean;
    };
    recommendations: [
      {
        id: string;
        type: 'meal' | 'exercise' | 'habit' | 'goal';
        title: string;
        description: string;
        priority: 'low' | 'medium' | 'high';
        estimatedImpact: number;
        timeRequired: number;
      }
    ];
    moodAnalysis: {
      current: 'positive' | 'neutral' | 'negative';
      trend: 'improving' | 'stable' | 'declining';
      factors: string[];
      suggestions: string[];
    };
  };
  visualizations: [
    {
      type: 'insight_card';
      showType: true;
      showConfidence: true;
    },
    {
      type: 'recommendation_list';
      maxItems: 3;
      showPriority: true;
    },
    {
      type: 'mood_indicator';
      animated: true;
      showTrend: true;
    }
  ];
}
```

#### 5. Recent Activity Widget
```typescript
interface RecentActivityWidget {
  id: 'recent_activity';
  title: 'Recent Activity';
  size: 'medium';
  position: { row: 3; col: 1; span: 1 };
  data: {
    activities: [
      {
        id: string;
        type: 'meal_logged' | 'quest_completed' | 'achievement_unlocked' | 'level_up' | 'streak_milestone';
        title: string;
        description: string;
        timestamp: Date;
        icon: string;
        xpGained?: number;
        metadata?: any;
      }
    ];
    summary: {
      mealsLoggedToday: number;
      questsCompletedToday: number;
      xpGainedToday: number;
      achievementsUnlockedToday: number;
    };
  };
  visualizations: [
    {
      type: 'activity_timeline';
      maxItems: 10;
      showTimestamps: true;
    },
    {
      type: 'daily_summary';
      showIcons: true;
      showValues: true;
    }
  ];
}
```

#### 6. Social Activity Widget
```typescript
interface SocialActivityWidget {
  id: 'social_activity';
  title: 'Community Updates';
  size: 'medium';
  position: { row: 3; col: 2; span: 1 };
  data: {
    friendActivity: [
      {
        userId: string;
        name: string;
        avatar: string;
        activity: string;
        timestamp: Date;
        xpGained?: number;
        achievement?: string;
      }
    ];
    communityHighlights: [
      {
        id: string;
        type: 'challenge' | 'tip' | 'achievement' | 'recipe';
        title: string;
        author: string;
        likes: number;
        comments: number;
        timestamp: Date;
      }
    ];
    leaderboard: {
      position: number;
      totalParticipants: number;
      topPerformers: [
        {
          position: number;
          name: string;
          score: number;
          isCurrentUser: boolean;
        }
      ];
    };
  };
  visualizations: [
    {
      type: 'friend_activity_feed';
      maxItems: 5;
      showAvatars: true;
    },
    {
      type: 'community_highlights';
      maxItems: 3;
      showEngagement: true;
    },
    {
      type: 'mini_leaderboard';
      showPosition: true;
      showTop3: true;
    }
  ];
}
```

#### 7. Quick Actions Widget
```typescript
interface QuickActionsWidget {
  id: 'quick_actions';
  title: 'Quick Actions';
  size: 'medium';
  position: { row: 3; col: 3; span: 1 };
  data: {
    actions: [
      {
        id: 'log_breakfast';
        label: 'Log Breakfast';
        icon: 'sunrise';
        action: 'log_meal';
        mealType: 'breakfast';
        priority: 'high';
        shortcut: 'B';
      },
      {
        id: 'log_lunch';
        label: 'Log Lunch';
        icon: 'sun';
        action: 'log_meal';
        mealType: 'lunch';
        priority: 'high';
        shortcut: 'L';
      },
      {
        id: 'log_dinner';
        label: 'Log Dinner';
        icon: 'moon';
        action: 'log_meal';
        mealType: 'dinner';
        priority: 'high';
        shortcut: 'D';
      },
      {
        id: 'log_snack';
        label: 'Log Snack';
        icon: 'coffee';
        action: 'log_meal';
        mealType: 'snack';
        priority: 'medium';
        shortcut: 'S';
      },
      {
        id: 'add_water';
        label: 'Add Water';
        icon: 'droplet';
        action: 'log_water';
        amount: 250;
        priority: 'medium';
        shortcut: 'W';
      },
      {
        id: 'start_quest';
        label: 'Start Quest';
        icon: 'target';
        action: 'open_quests';
        priority: 'medium';
        shortcut: 'Q';
      },
      {
        id: 'ai_chat';
        label: 'Ask AI Coach';
        icon: 'message-circle';
        action: 'open_ai_chat';
        priority: 'low';
        shortcut: 'A';
      },
      {
        id: 'view_progress';
        label: 'View Progress';
        icon: 'trending-up';
        action: 'open_progress';
        priority: 'low';
        shortcut: 'P';
      }
    ];
  };
  visualizations: [
    {
      type: 'action_grid';
      columns: 2;
      showShortcuts: true;
      showPriority: true;
    }
  ];
}
```

## Dashboard Customization

### Widget Management
```typescript
interface DashboardCustomization {
  layout: {
    columns: number;
    rows: number;
    gap: number;
    padding: number;
  };
  widgets: {
    [widgetId: string]: {
      enabled: boolean;
      position: { row: number; col: number; span: number };
      size: 'small' | 'medium' | 'large';
      settings: any;
    };
  };
  themes: {
    current: string;
    available: string[];
    custom: {
      colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
      };
      fonts: {
        primary: string;
        secondary: string;
        sizes: {
          small: number;
          medium: number;
          large: number;
        };
      };
    };
  };
  preferences: {
    autoRefresh: boolean;
    refreshInterval: number;
    showAnimations: boolean;
    compactMode: boolean;
    showTooltips: boolean;
  };
}
```

### Widget Configuration
```typescript
export class DashboardService {
  static async getDashboardConfig(userId: string): Promise<DashboardCustomization> {
    const config = await this.getUserDashboardConfig(userId);
    
    if (!config) {
      return this.getDefaultDashboardConfig();
    }
    
    return config;
  }
  
  static async updateWidgetPosition(
    userId: string,
    widgetId: string,
    position: { row: number; col: number; span: number }
  ): Promise<void> {
    const config = await this.getDashboardConfig(userId);
    
    config.widgets[widgetId].position = position;
    
    await this.saveDashboardConfig(userId, config);
  }
  
  static async toggleWidget(
    userId: string,
    widgetId: string,
    enabled: boolean
  ): Promise<void> {
    const config = await this.getDashboardConfig(userId);
    
    config.widgets[widgetId].enabled = enabled;
    
    await this.saveDashboardConfig(userId, config);
  }
  
  static async resetToDefault(userId: string): Promise<void> {
    const defaultConfig = this.getDefaultDashboardConfig();
    
    await this.saveDashboardConfig(userId, defaultConfig);
  }
}
```

## Real-time Updates

### WebSocket Integration
```typescript
export class DashboardWebSocket {
  private static ws: WebSocket;
  private static reconnectAttempts = 0;
  private static maxReconnectAttempts = 5;
  
  static connect(userId: string) {
    this.ws = new WebSocket(`ws://localhost:8080/dashboard?userId=${userId}`);
    
    this.ws.onopen = () => {
      console.log('Dashboard WebSocket connected');
      this.reconnectAttempts = 0;
    };
    
    this.ws.onmessage = (event) => {
      const update = JSON.parse(event.data);
      this.handleDashboardUpdate(update);
    };
    
    this.ws.onclose = () => {
      console.log('Dashboard WebSocket disconnected');
      this.attemptReconnect(userId);
    };
    
    this.ws.onerror = (error) => {
      console.error('Dashboard WebSocket error:', error);
    };
  }
  
  private static handleDashboardUpdate(update: DashboardUpdate) {
    switch (update.type) {
      case 'progress_update':
        this.updateProgressWidget(update.data);
        break;
      case 'xp_gain':
        this.updateXPWidget(update.data);
        break;
      case 'achievement_unlocked':
        this.updateAchievementsWidget(update.data);
        break;
      case 'social_activity':
        this.updateSocialWidget(update.data);
        break;
      case 'ai_insight':
        this.updateAICoachWidget(update.data);
        break;
    }
  }
  
  private static attemptReconnect(userId: string) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000; // Exponential backoff
      
      setTimeout(() => {
        this.connect(userId);
      }, delay);
    }
  }
}
```

## Performance Optimization

### Data Loading Strategy
```typescript
export class DashboardDataService {
  static async loadDashboardData(userId: string): Promise<DashboardData> {
    // Load critical data first
    const criticalData = await Promise.all([
      this.loadProgressData(userId),
      this.loadUserProfile(userId),
      this.loadQuickActions(userId)
    ]);
    
    // Load secondary data in background
    const secondaryData = Promise.all([
      this.loadSocialActivity(userId),
      this.loadAIInsights(userId),
      this.loadRecentActivity(userId)
    ]);
    
    // Load optional data with lower priority
    const optionalData = Promise.all([
      this.loadLeaderboardData(userId),
      this.loadCommunityHighlights(userId)
    ]);
    
    return {
      progress: criticalData[0],
      user: criticalData[1],
      quickActions: criticalData[2],
      social: await secondaryData.then(data => data[0]),
      aiInsights: await secondaryData.then(data => data[1]),
      recentActivity: await secondaryData.then(data => data[2]),
      leaderboard: await optionalData.then(data => data[0]),
      community: await optionalData.then(data => data[1])
    };
  }
  
  static async refreshWidgetData(
    userId: string,
    widgetId: string
  ): Promise<any> {
    switch (widgetId) {
      case 'progress_overview':
        return this.loadProgressData(userId);
      case 'level_xp':
        return this.loadXPData(userId);
      case 'streak_achievements':
        return this.loadStreakAchievementsData(userId);
      case 'ai_coach_insights':
        return this.loadAIInsights(userId);
      case 'recent_activity':
        return this.loadRecentActivity(userId);
      case 'social_activity':
        return this.loadSocialActivity(userId);
      default:
        throw new Error(`Unknown widget: ${widgetId}`);
    }
  }
}
```

## UI Components

### Dashboard Container
```typescript
const Dashboard: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => DashboardDataService.loadDashboardData(userId),
    refetchInterval: 30000, // 30 seconds
    staleTime: 15000 // 15 seconds
  });
  
  const [customization, setCustomization] = useState<DashboardCustomization>();
  
  if (isLoading) return <DashboardSkeleton />;
  if (error) return <DashboardError error={error} />;
  
  return (
    <div className="dashboard">
      <DashboardHeader 
        user={dashboardData.user}
        quickActions={dashboardData.quickActions}
        notifications={dashboardData.notifications}
      />
      
      <div className="dashboard-content">
        <div className="dashboard-grid">
          {Object.entries(customization.widgets)
            .filter(([_, config]) => config.enabled)
            .map(([widgetId, config]) => (
              <DashboardWidget
                key={widgetId}
                id={widgetId}
                data={dashboardData[widgetId]}
                position={config.position}
                size={config.size}
                settings={config.settings}
                onRefresh={() => DashboardDataService.refreshWidgetData(userId, widgetId)}
              />
            ))}
        </div>
      </div>
      
      <DashboardCustomizationPanel
        customization={customization}
        onUpdate={setCustomization}
      />
    </div>
  );
};
```

### Widget Component
```typescript
const DashboardWidget: React.FC<{
  id: string;
  data: any;
  position: { row: number; col: number; span: number };
  size: 'small' | 'medium' | 'large';
  settings: any;
  onRefresh: () => void;
}> = ({ id, data, position, size, settings, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <div 
      className={`dashboard-widget ${size}`}
      style={{
        gridRow: position.row,
        gridColumn: `${position.col} / span ${position.span}`
      }}
    >
      <div className="widget-header">
        <h3 className="widget-title">{data.title}</h3>
        <div className="widget-actions">
          <button 
            className="refresh-button"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
          <button className="settings-button">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="widget-content">
        {React.createElement(getWidgetComponent(id), {
          data,
          settings,
          onRefresh: handleRefresh
        })}
      </div>
    </div>
  );
};
```

This comprehensive dashboard provides users with a centralized view of their nutrition journey, combining progress tracking, social features, AI insights, and quick actions in a customizable, real-time interface.
