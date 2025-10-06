# Dashboard Page Specification

## Overview
The Dashboard Page serves as the central hub for users to view their nutrition progress, access key features, and manage their health journey in the Diet Planner Game application.

## EARS Requirements

### Epic Requirements
- **EPIC-DP-001**: The system SHALL provide a comprehensive dashboard for users to view their nutrition progress and key metrics
- **EPIC-DP-002**: The system SHALL implement personalized content and recommendations based on user goals and preferences
- **EPIC-DP-003**: The system SHALL ensure responsive design and accessibility across all devices

### Feature Requirements
- **FEAT-DP-001**: The system SHALL display daily nutrition summary and progress toward goals
- **FEAT-DP-002**: The system SHALL provide quick access to meal logging and food search
- **FEAT-DP-003**: The system SHALL show gamification elements including points, achievements, and challenges
- **FEAT-DP-004**: The system SHALL display recent activity and social interactions

### User Story Requirements
- **US-DP-001**: As a user, I want to see my daily progress at a glance so that I can stay motivated
- **US-DP-002**: As a user, I want quick access to log meals so that I can easily track my nutrition
- **US-DP-003**: As a user, I want to see my achievements and points so that I can feel accomplished

### Acceptance Criteria
- **AC-DP-001**: Given a user opens the dashboard, when the page loads, then they SHALL see their daily nutrition summary and progress
- **AC-DP-002**: Given a user wants to log a meal, when they click the quick log button, then they SHALL be taken to the meal logging interface
- **AC-DP-003**: Given a user has achievements, when they view the dashboard, then they SHALL see their recent achievements and points

## Page Layout

### 1. Header Section
- **Navigation Bar**: Logo, main navigation menu, user profile, notifications
- **Quick Actions**: Quick meal log button, search bar, settings
- **User Status**: Current streak, daily points, level indicator

### 2. Main Content Area
- **Daily Summary**: Today's nutrition intake, goals progress, water intake
- **Progress Charts**: Weekly/monthly progress visualization
- **Quick Log**: Fast meal logging interface
- **Recent Activity**: Latest meals, achievements, social interactions

### 3. Sidebar
- **Gamification**: Points, level, achievements, current challenges
- **Goals**: Nutrition goals, weight goals, fitness goals
- **Social**: Friends' activity, community challenges, leaderboards

### 4. Footer
- **Quick Links**: Help, support, feedback
- **Social Media**: Links to social platforms
- **Legal**: Privacy policy, terms of service

## Component Structure

### 1. Dashboard Container
```typescript
// Dashboard page component
import React, { useState, useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { useNutritionData } from '../hooks/useNutritionData';
import { useGamification } from '../hooks/useGamification';
import DailySummary from '../components/DailySummary';
import ProgressCharts from '../components/ProgressCharts';
import QuickLog from '../components/QuickLog';
import RecentActivity from '../components/RecentActivity';
import GamificationPanel from '../components/GamificationPanel';
import GoalsPanel from '../components/GoalsPanel';
import SocialPanel from '../components/SocialPanel';

const Dashboard: React.FC = () => {
  const { user, loading: userLoading } = useUser();
  const { nutritionData, loading: nutritionLoading } = useNutritionData();
  const { gamificationData, loading: gamificationLoading } = useGamification();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'overview' | 'progress' | 'social'>('overview');

  if (userLoading || nutritionLoading || gamificationLoading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome back, {user.firstName}!</h1>
        <div className="header-actions">
          <button className="btn btn-primary">Quick Log Meal</button>
          <button className="btn btn-outline">View Calendar</button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          <div className="content-tabs">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab ${activeTab === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              Progress
            </button>
            <button 
              className={`tab ${activeTab === 'social' ? 'active' : ''}`}
              onClick={() => setActiveTab('social')}
            >
              Social
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <>
                <DailySummary 
                  date={selectedDate}
                  nutritionData={nutritionData}
                  goals={user.goals}
                />
                <QuickLog onMealLogged={() => {/* Refresh data */}} />
                <RecentActivity />
              </>
            )}

            {activeTab === 'progress' && (
              <ProgressCharts 
                nutritionData={nutritionData}
                goals={user.goals}
                dateRange="week"
              />
            )}

            {activeTab === 'social' && (
              <SocialPanel />
            )}
          </div>
        </div>

        <div className="sidebar">
          <GamificationPanel data={gamificationData} />
          <GoalsPanel goals={user.goals} />
          <SocialPanel />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

### 2. Daily Summary Component
```typescript
// Daily summary component
import React from 'react';
import { NutritionData, NutritionGoals } from '../types';

interface DailySummaryProps {
  date: Date;
  nutritionData: NutritionData;
  goals: NutritionGoals;
}

const DailySummary: React.FC<DailySummaryProps> = ({ date, nutritionData, goals }) => {
  const progress = {
    calories: (nutritionData.calories / goals.calories) * 100,
    protein: (nutritionData.protein / goals.protein) * 100,
    carbohydrates: (nutritionData.carbohydrates / goals.carbohydrates) * 100,
    fat: (nutritionData.fat / goals.fat) * 100
  };

  return (
    <div className="daily-summary">
      <div className="summary-header">
        <h2>Today's Summary</h2>
        <span className="date">{date.toLocaleDateString()}</span>
      </div>

      <div className="nutrition-cards">
        <div className="nutrition-card">
          <div className="card-header">
            <span className="icon">🔥</span>
            <span className="label">Calories</span>
          </div>
          <div className="card-content">
            <div className="value">{nutritionData.calories}</div>
            <div className="target">/ {goals.calories}</div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min(progress.calories, 100)}%` }}
              />
            </div>
            <div className="progress-text">
              {progress.calories.toFixed(0)}% of goal
            </div>
          </div>
        </div>

        <div className="nutrition-card">
          <div className="card-header">
            <span className="icon">🥩</span>
            <span className="label">Protein</span>
          </div>
          <div className="card-content">
            <div className="value">{nutritionData.protein}g</div>
            <div className="target">/ {goals.protein}g</div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min(progress.protein, 100)}%` }}
              />
            </div>
            <div className="progress-text">
              {progress.protein.toFixed(0)}% of goal
            </div>
          </div>
        </div>

        <div className="nutrition-card">
          <div className="card-header">
            <span className="icon">🍞</span>
            <span className="label">Carbs</span>
          </div>
          <div className="card-content">
            <div className="value">{nutritionData.carbohydrates}g</div>
            <div className="target">/ {goals.carbohydrates}g</div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min(progress.carbohydrates, 100)}%` }}
              />
            </div>
            <div className="progress-text">
              {progress.carbohydrates.toFixed(0)}% of goal
            </div>
          </div>
        </div>

        <div className="nutrition-card">
          <div className="card-header">
            <span className="icon">🥑</span>
            <span className="label">Fat</span>
          </div>
          <div className="card-content">
            <div className="value">{nutritionData.fat}g</div>
            <div className="target">/ {goals.fat}g</div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${Math.min(progress.fat, 100)}%` }}
              />
            </div>
            <div className="progress-text">
              {progress.fat.toFixed(0)}% of goal
            </div>
          </div>
        </div>
      </div>

      <div className="water-intake">
        <div className="water-header">
          <span className="icon">💧</span>
          <span className="label">Water Intake</span>
        </div>
        <div className="water-content">
          <div className="water-amount">
            {nutritionData.waterIntake} / {goals.waterIntake} glasses
          </div>
          <div className="water-buttons">
            <button className="btn btn-sm">-</button>
            <button className="btn btn-sm">+</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;
```

### 3. Quick Log Component
```typescript
// Quick log component
import React, { useState } from 'react';
import { useFoodSearch } from '../hooks/useFoodSearch';

const QuickLog: React.FC<{ onMealLogged: () => void }> = ({ onMealLogged }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFoods, setSelectedFoods] = useState<any[]>([]);
  const [mealType, setMealType] = useState('breakfast');
  
  const { searchResults, loading } = useFoodSearch(searchQuery);

  const handleFoodSelect = (food: any) => {
    setSelectedFoods(prev => [...prev, { ...food, quantity: 1, unit: 'serving' }]);
    setSearchQuery('');
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    setSelectedFoods(prev => 
      prev.map((food, i) => 
        i === index ? { ...food, quantity } : food
      )
    );
  };

  const handleLogMeal = async () => {
    try {
      await logMeal({
        date: new Date(),
        mealType,
        foods: selectedFoods
      });
      onMealLogged();
      setSelectedFoods([]);
    } catch (error) {
      console.error('Failed to log meal:', error);
    }
  };

  return (
    <div className="quick-log">
      <div className="quick-log-header">
        <h3>Quick Log Meal</h3>
        <select 
          value={mealType} 
          onChange={(e) => setMealType(e.target.value)}
          className="meal-type-select"
        >
          <option value="breakfast">Breakfast</option>
          <option value="lunch">Lunch</option>
          <option value="dinner">Dinner</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      <div className="food-search">
        <input
          type="text"
          placeholder="Search for food..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        
        {searchQuery && (
          <div className="search-results">
            {loading ? (
              <div className="loading">Searching...</div>
            ) : (
              searchResults.map(food => (
                <div 
                  key={food.id}
                  className="search-result-item"
                  onClick={() => handleFoodSelect(food)}
                >
                  <div className="food-name">{food.name}</div>
                  <div className="food-calories">{food.calories} cal</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {selectedFoods.length > 0 && (
        <div className="selected-foods">
          <h4>Selected Foods</h4>
          {selectedFoods.map((food, index) => (
            <div key={index} className="selected-food">
              <div className="food-info">
                <span className="food-name">{food.name}</span>
                <span className="food-calories">{food.calories} cal</span>
              </div>
              <div className="quantity-controls">
                <button 
                  onClick={() => handleQuantityChange(index, food.quantity - 1)}
                  disabled={food.quantity <= 0}
                >
                  -
                </button>
                <span className="quantity">{food.quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(index, food.quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>
          ))}
          
          <div className="total-calories">
            Total: {selectedFoods.reduce((sum, food) => sum + (food.calories * food.quantity), 0)} calories
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={handleLogMeal}
          >
            Log Meal
          </button>
        </div>
      )}
    </div>
  );
};

export default QuickLog;
```

### 4. Gamification Panel Component
```typescript
// Gamification panel component
import React from 'react';
import { GamificationData } from '../types';

interface GamificationPanelProps {
  data: GamificationData;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ data }) => {
  return (
    <div className="gamification-panel">
      <div className="panel-header">
        <h3>Your Progress</h3>
      </div>

      <div className="level-info">
        <div className="level-badge">
          <span className="level-number">{data.level}</span>
          <span className="level-label">Level</span>
        </div>
        <div className="xp-info">
          <div className="xp-bar">
            <div 
              className="xp-fill"
              style={{ width: `${(data.experience / data.xpToNextLevel) * 100}%` }}
            />
          </div>
          <div className="xp-text">
            {data.experience} / {data.xpToNextLevel} XP
          </div>
        </div>
      </div>

      <div className="points-info">
        <div className="points-total">
          <span className="points-value">{data.totalPoints}</span>
          <span className="points-label">Total Points</span>
        </div>
        <div className="points-today">
          <span className="points-value">{data.pointsToday}</span>
          <span className="points-label">Today</span>
        </div>
      </div>

      <div className="streak-info">
        <div className="streak-current">
          <span className="streak-value">{data.currentStreak}</span>
          <span className="streak-label">Day Streak</span>
        </div>
        <div className="streak-best">
          <span className="streak-value">{data.longestStreak}</span>
          <span className="streak-label">Best Streak</span>
        </div>
      </div>

      <div className="achievements">
        <h4>Recent Achievements</h4>
        {data.recentAchievements.map(achievement => (
          <div key={achievement.id} className="achievement-item">
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-info">
              <div className="achievement-name">{achievement.name}</div>
              <div className="achievement-date">
                {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="challenges">
        <h4>Active Challenges</h4>
        {data.activeChallenges.map(challenge => (
          <div key={challenge.id} className="challenge-item">
            <div className="challenge-title">{challenge.title}</div>
            <div className="challenge-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${challenge.progress}%` }}
                />
              </div>
              <span className="progress-text">{challenge.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamificationPanel;
```

## Data Integration

### 1. Custom Hooks
```typescript
// Custom hooks for dashboard data
import { useState, useEffect } from 'react';
import { useUser } from './useUser';

export const useNutritionData = (date: Date) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNutritionData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/nutrition/daily-summary?date=${date.toISOString()}`);
        const nutritionData = await response.json();
        setData(nutritionData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionData();
  }, [date]);

  return { data, loading, error };
};

export const useGamification = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGamificationData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gamification/progress');
        const gamificationData = await response.json();
        setData(gamificationData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGamificationData();
  }, []);

  return { data, loading, error };
};

export const useRecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/activity/recent');
        const activityData = await response.json();
        setActivities(activityData);
      } catch (error) {
        console.error('Failed to fetch recent activity:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivity();
  }, []);

  return { activities, loading };
};
```

### 2. API Integration
```typescript
// API service for dashboard data
class DashboardService {
  async getDailySummary(date: Date) {
    const response = await fetch(`/api/nutrition/daily-summary?date=${date.toISOString()}`);
    return response.json();
  }

  async getWeeklyProgress(startDate: Date, endDate: Date) {
    const response = await fetch(
      `/api/nutrition/progress?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
    );
    return response.json();
  }

  async getGamificationData() {
    const response = await fetch('/api/gamification/progress');
    return response.json();
  }

  async getRecentActivity(limit: number = 10) {
    const response = await fetch(`/api/activity/recent?limit=${limit}`);
    return response.json();
  }

  async logMeal(mealData: any) {
    const response = await fetch('/api/nutrition/meals', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mealData),
    });
    return response.json();
  }
}

export const dashboardService = new DashboardService();
```

## Styling and Theming

### 1. CSS Styles
```css
/* Dashboard container styles */
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #f8f9fa;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dashboard-header h1 {
  margin: 0;
  color: #333;
  font-size: 28px;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.dashboard-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 20px;
}

.main-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.content-tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
}

.tab {
  padding: 15px 20px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #666;
  transition: all 0.2s ease;
}

.tab.active {
  color: #4CAF50;
  border-bottom: 2px solid #4CAF50;
}

.tab:hover:not(.active) {
  background: #f5f5f5;
}

.tab-content {
  padding: 20px;
}

/* Daily summary styles */
.daily-summary {
  margin-bottom: 30px;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.summary-header h2 {
  margin: 0;
  color: #333;
}

.date {
  color: #666;
  font-size: 14px;
}

.nutrition-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.nutrition-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 15px;
}

.card-header .icon {
  font-size: 24px;
}

.card-header .label {
  font-weight: 600;
  color: #333;
}

.card-content .value {
  font-size: 24px;
  font-weight: 700;
  color: #4CAF50;
}

.card-content .target {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #666;
}

/* Water intake styles */
.water-intake {
  background: #e3f2fd;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.water-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.water-header .icon {
  font-size: 24px;
}

.water-header .label {
  font-weight: 600;
  color: #333;
}

.water-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.water-amount {
  font-size: 18px;
  font-weight: 600;
  color: #1976D2;
}

.water-buttons {
  display: flex;
  gap: 5px;
}

/* Quick log styles */
.quick-log {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
}

.quick-log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.quick-log-header h3 {
  margin: 0;
  color: #333;
}

.meal-type-select {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  background: white;
}

.food-search {
  position: relative;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 16px;
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-top: none;
  border-radius: 0 0 4px 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.search-result-item {
  padding: 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-result-item:hover {
  background: #f5f5f5;
}

.food-name {
  font-weight: 500;
  color: #333;
}

.food-calories {
  color: #666;
  font-size: 14px;
}

.selected-foods {
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
}

.selected-foods h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.selected-food {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.food-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-controls button {
  width: 30px;
  height: 30px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quantity-controls button:hover:not(:disabled) {
  background: #f5f5f5;
}

.quantity-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.quantity {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

.total-calories {
  text-align: center;
  font-weight: 600;
  color: #4CAF50;
  margin: 15px 0;
  font-size: 18px;
}

/* Gamification panel styles */
.gamification-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
}

.panel-header h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.level-info {
  text-align: center;
  margin-bottom: 20px;
}

.level-badge {
  display: inline-block;
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  padding: 20px;
  border-radius: 50%;
  margin-bottom: 15px;
}

.level-number {
  display: block;
  font-size: 24px;
  font-weight: 700;
}

.level-label {
  display: block;
  font-size: 12px;
  opacity: 0.9;
}

.xp-info {
  margin-top: 15px;
}

.xp-bar {
  width: 100%;
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.xp-fill {
  height: 100%;
  background: #4CAF50;
  transition: width 0.3s ease;
}

.xp-text {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.points-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.points-total,
.points-today {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.points-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #4CAF50;
}

.points-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.streak-info {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
}

.streak-current,
.streak-best {
  text-align: center;
  padding: 15px;
  background: #fff3e0;
  border-radius: 8px;
}

.streak-value {
  display: block;
  font-size: 20px;
  font-weight: 700;
  color: #ff9800;
}

.streak-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

.achievements,
.challenges {
  margin-bottom: 20px;
}

.achievements h4,
.challenges h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.achievement-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.achievement-icon {
  font-size: 24px;
}

.achievement-name {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.achievement-date {
  font-size: 12px;
  color: #666;
}

.challenge-item {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.challenge-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.challenge-progress {
  display: flex;
  align-items: center;
  gap: 10px;
}

.challenge-progress .progress-bar {
  flex: 1;
  height: 6px;
}

.challenge-progress .progress-fill {
  background: #2196F3;
}

.progress-text {
  font-size: 12px;
  color: #666;
  min-width: 35px;
}

/* Button styles */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
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

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

/* Loading and error states */
.loading {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error {
  text-align: center;
  padding: 40px;
  color: #f44336;
  background: #ffebee;
  border-radius: 8px;
  margin: 20px 0;
}
```

### 2. Responsive Design
```css
/* Responsive styles */
@media (max-width: 768px) {
  .dashboard-container {
    padding: 10px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .dashboard-content {
    grid-template-columns: 1fr;
  }

  .nutrition-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .water-intake {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .quick-log-header {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }

  .points-info,
  .streak-info {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .nutrition-cards {
    grid-template-columns: 1fr;
  }

  .content-tabs {
    flex-direction: column;
  }

  .tab {
    text-align: center;
  }
}
```

## Testing Strategy

### 1. Unit Testing
```typescript
// Dashboard component tests
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Dashboard from './Dashboard';

// Mock the hooks
jest.mock('../hooks/useUser');
jest.mock('../hooks/useNutritionData');
jest.mock('../hooks/useGamification');

describe('Dashboard Component', () => {
  const mockUser = {
    id: '1',
    firstName: 'John',
    goals: {
      calories: 2000,
      protein: 150,
      carbohydrates: 200,
      fat: 70,
      waterIntake: 8
    }
  };

  const mockNutritionData = {
    calories: 1500,
    protein: 120,
    carbohydrates: 180,
    fat: 60,
    waterIntake: 6
  };

  const mockGamificationData = {
    level: 5,
    experience: 1250,
    xpToNextLevel: 1500,
    totalPoints: 2500,
    pointsToday: 150,
    currentStreak: 7,
    longestStreak: 15,
    recentAchievements: [
      {
        id: '1',
        name: 'First Meal',
        icon: '🍽️',
        unlockedAt: '2024-01-15T10:00:00Z'
      }
    ],
    activeChallenges: [
      {
        id: '1',
        title: 'Eat 5 Vegetables Today',
        progress: 60
      }
    ]
  };

  beforeEach(() => {
    useUser.mockReturnValue({
      user: mockUser,
      loading: false
    });
    useNutritionData.mockReturnValue({
      nutritionData: mockNutritionData,
      loading: false
    });
    useGamification.mockReturnValue({
      gamificationData: mockGamificationData,
      loading: false
    });
  });

  it('renders dashboard with user data', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('Welcome back, John!')).toBeInTheDocument();
    expect(screen.getByText("Today's Summary")).toBeInTheDocument();
    expect(screen.getByText('1500')).toBeInTheDocument(); // calories
    expect(screen.getByText('120g')).toBeInTheDocument(); // protein
  });

  it('displays nutrition progress correctly', () => {
    render(<Dashboard />);
    
    // Check if progress bars are displayed
    const progressBars = screen.getAllByRole('progressbar');
    expect(progressBars).toHaveLength(4); // calories, protein, carbs, fat
  });

  it('switches between tabs correctly', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);
    
    const progressTab = screen.getByText('Progress');
    await user.click(progressTab);
    
    expect(progressTab).toHaveClass('active');
  });

  it('displays gamification data correctly', () => {
    render(<Dashboard />);
    
    expect(screen.getByText('5')).toBeInTheDocument(); // level
    expect(screen.getByText('2500')).toBeInTheDocument(); // total points
    expect(screen.getByText('7')).toBeInTheDocument(); // current streak
  });
});
```

### 2. Integration Testing
```typescript
// Integration tests for dashboard functionality
describe('Dashboard Integration Tests', () => {
  it('integrates with meal logging system', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);
    
    // Click quick log meal button
    const quickLogButton = screen.getByText('Quick Log Meal');
    await user.click(quickLogButton);
    
    // Check if meal logging interface opens
    await waitFor(() => {
      expect(screen.getByText('Quick Log Meal')).toBeInTheDocument();
    });
  });

  it('updates nutrition data after meal logging', async () => {
    const user = userEvent.setup();
    render(<Dashboard />);
    
    // Mock meal logging
    const mockLogMeal = jest.fn().mockResolvedValue({ success: true });
    jest.spyOn(dashboardService, 'logMeal').mockImplementation(mockLogMeal);
    
    // Log a meal
    const searchInput = screen.getByPlaceholderText('Search for food...');
    await user.type(searchInput, 'chicken');
    
    // Select food and log meal
    // ... test implementation
    
    expect(mockLogMeal).toHaveBeenCalled();
  });
});
```

## Accessibility Features

### 1. ARIA Support
```typescript
// Accessibility-enhanced dashboard
const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container" role="main">
      <div className="dashboard-header">
        <h1>Welcome back, {user.firstName}!</h1>
        <div className="header-actions" role="group" aria-label="Quick actions">
          <button 
            className="btn btn-primary"
            aria-label="Quick log a meal"
          >
            Quick Log Meal
          </button>
          <button 
            className="btn btn-outline"
            aria-label="View calendar"
          >
            View Calendar
          </button>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          <div className="content-tabs" role="tablist">
            <button 
              className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === 'overview'}
              aria-controls="overview-panel"
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`tab ${activeTab === 'progress' ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === 'progress'}
              aria-controls="progress-panel"
              onClick={() => setActiveTab('progress')}
            >
              Progress
            </button>
            <button 
              className={`tab ${activeTab === 'social' ? 'active' : ''}`}
              role="tab"
              aria-selected={activeTab === 'social'}
              aria-controls="social-panel"
              onClick={() => setActiveTab('social')}
            >
              Social
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div id="overview-panel" role="tabpanel" aria-labelledby="overview-tab">
                <DailySummary 
                  date={selectedDate}
                  nutritionData={nutritionData}
                  goals={user.goals}
                />
                <QuickLog onMealLogged={() => {/* Refresh data */}} />
                <RecentActivity />
              </div>
            )}
            {/* ... other tab panels */}
          </div>
        </div>

        <div className="sidebar" role="complementary" aria-label="User progress and goals">
          <GamificationPanel data={gamificationData} />
          <GoalsPanel goals={user.goals} />
          <SocialPanel />
        </div>
      </div>
    </div>
  );
};
```

### 2. Keyboard Navigation
```typescript
// Keyboard navigation support
const Dashboard: React.FC = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '1' && event.ctrlKey) {
        setActiveTab('overview');
      } else if (event.key === '2' && event.ctrlKey) {
        setActiveTab('progress');
      } else if (event.key === '3' && event.ctrlKey) {
        setActiveTab('social');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ... rest of component
};
```

## Future Enhancements

### 1. Advanced Features
- **Personalized Recommendations**: AI-driven meal and goal suggestions
- **Real-time Updates**: Live updates for social activities and achievements
- **Customizable Layout**: User-configurable dashboard layout
- **Data Export**: Export nutrition and progress data

### 2. Performance Optimizations
- **Lazy Loading**: Load dashboard components on demand
- **Caching**: Cache dashboard data for faster loading
- **Virtual Scrolling**: For large lists of activities
- **Optimistic Updates**: Update UI before server confirmation

