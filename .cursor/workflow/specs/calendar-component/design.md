# Calendar Component Specification

## Overview
The Calendar Component provides a comprehensive date selection and event display interface for the Diet Planner Game application, enabling users to view their meal logs, track progress, and manage their nutrition schedule across different time periods.

## EARS Requirements

### Epic Requirements
- **EPIC-CC-001**: The system SHALL provide a calendar component for date selection and event display
- **EPIC-CC-002**: The system SHALL implement multiple view modes (month, week, day) for different user needs
- **EPIC-CC-003**: The system SHALL ensure accessibility and responsive design for all devices

### Feature Requirements
- **FEAT-CC-001**: The system SHALL provide month, week, and day view modes
- **FEAT-CC-002**: The system SHALL display meal logs and nutrition events on the calendar
- **FEAT-CC-003**: The system SHALL support date navigation and selection
- **FEAT-CC-004**: The system SHALL provide event creation and editing capabilities

### User Story Requirements
- **US-CC-001**: As a user, I want to view my meal logs on a calendar so that I can see my eating patterns over time
- **US-CC-002**: As a user, I want to navigate between different months so that I can review my historical data
- **US-CC-003**: As a user, I want to click on dates to add or edit meals so that I can manage my nutrition schedule

### Acceptance Criteria
- **AC-CC-001**: Given a calendar view, when a user navigates between months, then the calendar SHALL display the correct dates and events
- **AC-CC-002**: Given a date with meal logs, when the user views the calendar, then the events SHALL be displayed with appropriate indicators
- **AC-CC-003**: Given a user clicks on a date, when they interact with the calendar, then the system SHALL allow meal logging or editing

## Component Architecture

### 1. Calendar Structure
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Calendar      │    │   View          │    │   Event         │
│   Container     │    │   Components    │    │   Components    │
│                 │    │                 │    │                 │
│ - State         │    │ - Month View    │    │ - Meal Event    │
│ - Navigation    │    │ - Week View     │    │ - Goal Event    │
│ - Event Data    │    │ - Day View      │    │ - Achievement   │
│ - User Actions  │    │ - Date Grid     │    │ - Custom Event  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Event Store   │
                    │                 │
                    │ - Meal Logs     │
                    │ - Goals         │
                    │ - Achievements  │
                    │ - Custom Events │
                    └─────────────────┘
```

### 2. Component Hierarchy
```typescript
// Calendar component structure
interface CalendarProps {
  viewMode: 'month' | 'week' | 'day';
  selectedDate: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventCreate: (date: Date, eventType: string) => void;
  onViewModeChange: (mode: 'month' | 'week' | 'day') => void;
  onDateChange: (date: Date) => void;
  showNavigation?: boolean;
  showViewModeSelector?: boolean;
  allowEventCreation?: boolean;
  theme?: 'light' | 'dark';
}

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  startTime?: Date;
  endTime?: Date;
  type: 'meal' | 'goal' | 'achievement' | 'custom';
  category: string;
  color: string;
  data: any;
  isAllDay?: boolean;
}

interface CalendarViewProps {
  date: Date;
  events: CalendarEvent[];
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventCreate: (date: Date, eventType: string) => void;
  selectedDate?: Date;
  allowEventCreation?: boolean;
}
```

## Implementation

### 1. Calendar Container Component
```typescript
// Calendar container component
import React, { useState, useEffect, useCallback } from 'react';
import { CalendarProps, CalendarEvent, CalendarViewProps } from './types';
import MonthView from './views/MonthView';
import WeekView from './views/WeekView';
import DayView from './views/DayView';
import CalendarNavigation from './CalendarNavigation';
import ViewModeSelector from './ViewModeSelector';

const Calendar: React.FC<CalendarProps> = ({
  viewMode: initialViewMode = 'month',
  selectedDate: initialSelectedDate = new Date(),
  events = [],
  onDateSelect,
  onEventClick,
  onEventCreate,
  onViewModeChange,
  onDateChange,
  showNavigation = true,
  showViewModeSelector = true,
  allowEventCreation = true,
  theme = 'light'
}) => {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>(initialViewMode);
  const [selectedDate, setSelectedDate] = useState<Date>(initialSelectedDate);
  const [currentDate, setCurrentDate] = useState<Date>(initialSelectedDate);

  // Update selected date when prop changes
  useEffect(() => {
    setSelectedDate(initialSelectedDate);
    setCurrentDate(initialSelectedDate);
  }, [initialSelectedDate]);

  const handleDateSelect = useCallback((date: Date) => {
    setSelectedDate(date);
    onDateSelect(date);
  }, [onDateSelect]);

  const handleViewModeChange = useCallback((mode: 'month' | 'week' | 'day') => {
    setViewMode(mode);
    onViewModeChange(mode);
  }, [onViewModeChange]);

  const handleDateChange = useCallback((date: Date) => {
    setCurrentDate(date);
    onDateChange(date);
  }, [onDateChange]);

  const handleEventClick = useCallback((event: CalendarEvent) => {
    onEventClick(event);
  }, [onEventClick]);

  const handleEventCreate = useCallback((date: Date, eventType: string) => {
    onEventCreate(date, eventType);
  }, [onEventCreate]);

  const renderView = () => {
    const viewProps: CalendarViewProps = {
      date: currentDate,
      events,
      onDateSelect: handleDateSelect,
      onEventClick: handleEventClick,
      onEventCreate: handleEventCreate,
      selectedDate,
      allowEventCreation
    };

    switch (viewMode) {
      case 'month':
        return <MonthView {...viewProps} />;
      case 'week':
        return <WeekView {...viewProps} />;
      case 'day':
        return <DayView {...viewProps} />;
      default:
        return <MonthView {...viewProps} />;
    }
  };

  return (
    <div className={`calendar-container ${theme}`}>
      {showNavigation && (
        <CalendarNavigation
          currentDate={currentDate}
          viewMode={viewMode}
          onDateChange={handleDateChange}
        />
      )}

      {showViewModeSelector && (
        <ViewModeSelector
          currentMode={viewMode}
          onModeChange={handleViewModeChange}
        />
      )}

      <div className="calendar-content">
        {renderView()}
      </div>
    </div>
  );
};

export default Calendar;
```

### 2. Month View Component
```typescript
// Month view component
import React, { useMemo } from 'react';
import { CalendarViewProps, CalendarEvent } from './types';
import CalendarDay from './CalendarDay';

const MonthView: React.FC<CalendarViewProps> = ({
  date,
  events,
  onDateSelect,
  onEventClick,
  onEventCreate,
  selectedDate,
  allowEventCreation
}) => {
  const monthData = useMemo(() => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get first day of week (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    
    // Create calendar grid
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDay = new Date(year, month, -firstDayOfWeek + i + 1);
      currentWeek.push(prevMonthDay);
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      currentWeek.push(currentDate);
      
      // Start new week if we've reached Sunday
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Add remaining days from next month to complete the last week
    if (currentWeek.length > 0) {
      const remainingDays = 7 - currentWeek.length;
      for (let i = 1; i <= remainingDays; i++) {
        const nextMonthDay = new Date(year, month + 1, i);
        currentWeek.push(nextMonthDay);
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  }, [date]);

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === this.date.getMonth();
  };

  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date): boolean => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  return (
    <div className="month-view">
      <div className="calendar-header">
        <div className="day-header">Sun</div>
        <div className="day-header">Mon</div>
        <div className="day-header">Tue</div>
        <div className="day-header">Wed</div>
        <div className="day-header">Thu</div>
        <div className="day-header">Fri</div>
        <div className="day-header">Sat</div>
      </div>
      
      <div className="calendar-grid">
        {monthData.map((week, weekIndex) => (
          <div key={weekIndex} className="calendar-week">
            {week.map((day, dayIndex) => (
              <CalendarDay
                key={dayIndex}
                date={day}
                events={getEventsForDate(day)}
                isCurrentMonth={isCurrentMonth(day)}
                isToday={isToday(day)}
                isSelected={isSelected(day)}
                onDateSelect={onDateSelect}
                onEventClick={onEventClick}
                onEventCreate={onEventCreate}
                allowEventCreation={allowEventCreation}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthView;
```

### 3. Calendar Day Component
```typescript
// Calendar day component
import React, { useState } from 'react';
import { CalendarEvent } from './types';
import EventIndicator from './EventIndicator';
import EventTooltip from './EventTooltip';

interface CalendarDayProps {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  onDateSelect: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onEventCreate: (date: Date, eventType: string) => void;
  allowEventCreation: boolean;
}

const CalendarDay: React.FC<CalendarDayProps> = ({
  date,
  events,
  isCurrentMonth,
  isToday,
  isSelected,
  onDateSelect,
  onEventClick,
  onEventCreate,
  allowEventCreation
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const handleDateClick = () => {
    onDateSelect(date);
  };

  const handleEventClick = (event: CalendarEvent, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventClick(event);
  };

  const handleEventCreate = (eventType: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onEventCreate(date, eventType);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (events.length > 0) {
      setTooltipPosition({ x: e.clientX, y: e.clientY });
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const dayNumber = date.getDate();
  const hasEvents = events.length > 0;
  const eventCount = events.length;

  return (
    <div
      className={`calendar-day ${isCurrentMonth ? 'current-month' : 'other-month'} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEvents ? 'has-events' : ''}`}
      onClick={handleDateClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="day-number">{dayNumber}</div>
      
      {hasEvents && (
        <div className="event-indicators">
          {events.slice(0, 3).map((event, index) => (
            <EventIndicator
              key={event.id}
              event={event}
              onClick={(e) => handleEventClick(event, e)}
            />
          ))}
          {eventCount > 3 && (
            <div className="more-events">+{eventCount - 3}</div>
          )}
        </div>
      )}

      {allowEventCreation && (
        <div className="add-event-button" onClick={(e) => handleEventCreate('meal', e)}>
          +
        </div>
      )}

      {showTooltip && (
        <EventTooltip
          events={events}
          position={tooltipPosition}
          onEventClick={onEventClick}
        />
      )}
    </div>
  );
};

export default CalendarDay;
```

### 4. Event Components
```typescript
// Event indicator component
import React from 'react';
import { CalendarEvent } from './types';

interface EventIndicatorProps {
  event: CalendarEvent;
  onClick: (e: React.MouseEvent) => void;
}

const EventIndicator: React.FC<EventIndicatorProps> = ({ event, onClick }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meal':
        return '🍽️';
      case 'goal':
        return '🎯';
      case 'achievement':
        return '🏆';
      case 'custom':
        return '📅';
      default:
        return '●';
    }
  };

  return (
    <div
      className={`event-indicator event-${event.type}`}
      style={{ backgroundColor: event.color }}
      onClick={onClick}
      title={event.title}
    >
      <span className="event-icon">{getEventIcon(event.type)}</span>
    </div>
  );
};

export default EventIndicator;

// Event tooltip component
import React from 'react';
import { CalendarEvent } from './types';

interface EventTooltipProps {
  events: CalendarEvent[];
  position: { x: number; y: number };
  onEventClick: (event: CalendarEvent) => void;
}

const EventTooltip: React.FC<EventTooltipProps> = ({ events, position, onEventClick }) => {
  return (
    <div
      className="event-tooltip"
      style={{
        position: 'fixed',
        left: position.x + 10,
        top: position.y - 10,
        zIndex: 1000
      }}
    >
      <div className="tooltip-content">
        {events.map(event => (
          <div
            key={event.id}
            className="tooltip-event"
            onClick={() => onEventClick(event)}
          >
            <div
              className="event-color"
              style={{ backgroundColor: event.color }}
            />
            <div className="event-info">
              <div className="event-title">{event.title}</div>
              {event.startTime && (
                <div className="event-time">
                  {event.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventTooltip;
```

## Usage Examples

### 1. Basic Calendar Implementation
```typescript
// Basic calendar usage
import React, { useState } from 'react';
import Calendar from './Calendar';
import { CalendarEvent } from './types';

const NutritionCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Breakfast',
      date: new Date(),
      type: 'meal',
      category: 'breakfast',
      color: '#4CAF50',
      data: { mealId: 'meal_1', calories: 350 }
    },
    {
      id: '2',
      title: 'Lunch',
      date: new Date(),
      type: 'meal',
      category: 'lunch',
      color: '#2196F3',
      data: { mealId: 'meal_2', calories: 500 }
    }
  ]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    console.log('Event clicked:', event);
    // Open event details modal
  };

  const handleEventCreate = (date: Date, eventType: string) => {
    console.log('Create event:', date, eventType);
    // Open event creation modal
  };

  return (
    <div className="nutrition-calendar">
      <h2>Nutrition Calendar</h2>
      <Calendar
        viewMode="month"
        selectedDate={selectedDate}
        events={events}
        onDateSelect={handleDateSelect}
        onEventClick={handleEventClick}
        onEventCreate={handleEventCreate}
        onViewModeChange={(mode) => console.log('View mode changed:', mode)}
        onDateChange={(date) => console.log('Date changed:', date)}
        showNavigation={true}
        showViewModeSelector={true}
        allowEventCreation={true}
        theme="light"
      />
    </div>
  );
};

export default NutritionCalendar;
```

### 2. Advanced Calendar with Meal Logging
```typescript
// Advanced calendar with meal logging integration
import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { CalendarEvent } from './types';
import MealLogModal from './MealLogModal';
import { useMealLogs } from '../hooks/useMealLogs';

const AdvancedNutritionCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMealDate, setSelectedMealDate] = useState<Date | null>(null);
  
  const { mealLogs, loading, error } = useMealLogs(selectedDate);

  // Convert meal logs to calendar events
  const events: CalendarEvent[] = mealLogs.map(meal => ({
    id: meal.id,
    title: `${meal.mealType}: ${meal.totalCalories} cal`,
    date: new Date(meal.date),
    type: 'meal',
    category: meal.mealType,
    color: getMealTypeColor(meal.mealType),
    data: meal
  }));

  const getMealTypeColor = (mealType: string): string => {
    const colors = {
      breakfast: '#FF9800',
      lunch: '#4CAF50',
      dinner: '#2196F3',
      snack: '#9C27B0'
    };
    return colors[mealType] || '#757575';
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (event.type === 'meal') {
      setSelectedMealDate(new Date(event.date));
      setShowMealModal(true);
    }
  };

  const handleEventCreate = (date: Date, eventType: string) => {
    if (eventType === 'meal') {
      setSelectedMealDate(date);
      setShowMealModal(true);
    }
  };

  const handleMealModalClose = () => {
    setShowMealModal(false);
    setSelectedMealDate(null);
  };

  if (loading) {
    return <div className="loading">Loading calendar...</div>;
  }

  if (error) {
    return <div className="error">Error loading calendar: {error}</div>;
  }

  return (
    <div className="advanced-nutrition-calendar">
      <div className="calendar-header">
        <h2>Nutrition Calendar</h2>
        <div className="calendar-stats">
          <div className="stat">
            <span className="stat-label">Total Meals:</span>
            <span className="stat-value">{mealLogs.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Calories:</span>
            <span className="stat-value">
              {mealLogs.reduce((sum, meal) => sum + meal.totalCalories, 0)}
            </span>
          </div>
        </div>
      </div>

      <Calendar
        viewMode={viewMode}
        selectedDate={selectedDate}
        events={events}
        onDateSelect={handleDateSelect}
        onEventClick={handleEventClick}
        onEventCreate={handleEventCreate}
        onViewModeChange={setViewMode}
        onDateChange={setSelectedDate}
        showNavigation={true}
        showViewModeSelector={true}
        allowEventCreation={true}
        theme="light"
      />

      {showMealModal && selectedMealDate && (
        <MealLogModal
          date={selectedMealDate}
          onClose={handleMealModalClose}
          onSave={(mealData) => {
            console.log('Meal saved:', mealData);
            handleMealModalClose();
          }}
        />
      )}
    </div>
  );
};

export default AdvancedNutritionCalendar;
```

## Styling and Theming

### 1. CSS Styles
```css
/* Calendar container styles */
.calendar-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.calendar-container.dark {
  background: #2d2d2d;
  color: #fff;
}

.calendar-content {
  padding: 20px;
}

/* Month view styles */
.month-view {
  width: 100%;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #e0e0e0;
  border-radius: 4px 4px 0 0;
}

.day-header {
  background: #f5f5f5;
  padding: 12px;
  text-align: center;
  font-weight: 600;
  color: #666;
  font-size: 14px;
}

.calendar-grid {
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  gap: 1px;
  background: #e0e0e0;
  border-radius: 0 0 4px 4px;
}

.calendar-week {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
}

.calendar-day {
  background: #fff;
  min-height: 120px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  flex-direction: column;
}

.calendar-day:hover {
  background: #f8f9fa;
}

.calendar-day.other-month {
  background: #f8f9fa;
  color: #999;
}

.calendar-day.today {
  background: #e3f2fd;
  border: 2px solid #2196F3;
}

.calendar-day.selected {
  background: #bbdefb;
  border: 2px solid #1976D2;
}

.calendar-day.has-events {
  background: #f3e5f5;
}

.day-number {
  font-weight: 600;
  font-size: 16px;
  margin-bottom: 4px;
}

.event-indicators {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  margin-top: auto;
}

.event-indicator {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.event-indicator:hover {
  transform: scale(1.1);
}

.event-icon {
  font-size: 12px;
}

.more-events {
  font-size: 12px;
  color: #666;
  font-weight: 600;
}

.add-event-button {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4CAF50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.calendar-day:hover .add-event-button {
  opacity: 1;
}

/* Event tooltip styles */
.event-tooltip {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
  max-width: 250px;
}

.tooltip-event {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.2s ease;
}

.tooltip-event:hover {
  background: #f5f5f5;
}

.event-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.event-info {
  flex: 1;
}

.event-title {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.event-time {
  font-size: 12px;
  color: #666;
}

/* Navigation styles */
.calendar-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.nav-button {
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s ease;
}

.nav-button:hover {
  background: #45a049;
}

.nav-button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.current-date {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

/* View mode selector styles */
.view-mode-selector {
  display: flex;
  gap: 4px;
  margin-left: auto;
}

.view-mode-button {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.view-mode-button.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.view-mode-button:hover:not(.active) {
  background: #f5f5f5;
}
```

### 2. Responsive Design
```css
/* Responsive styles */
@media (max-width: 768px) {
  .calendar-container {
    margin: 10px;
    border-radius: 4px;
  }

  .calendar-content {
    padding: 10px;
  }

  .calendar-day {
    min-height: 80px;
    padding: 4px;
  }

  .day-number {
    font-size: 14px;
  }

  .event-indicator {
    width: 16px;
    height: 16px;
  }

  .event-icon {
    font-size: 10px;
  }

  .calendar-navigation {
    padding: 15px;
    flex-direction: column;
    gap: 15px;
  }

  .view-mode-selector {
    margin-left: 0;
  }

  .current-date {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .calendar-day {
    min-height: 60px;
    padding: 2px;
  }

  .day-number {
    font-size: 12px;
  }

  .event-indicator {
    width: 12px;
    height: 12px;
  }

  .event-icon {
    font-size: 8px;
  }

  .calendar-header {
    gap: 0;
  }

  .day-header {
    padding: 8px 4px;
    font-size: 12px;
  }
}
```

## Testing Strategy

### 1. Unit Testing
```typescript
// Calendar component tests
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calendar from './Calendar';

describe('Calendar Component', () => {
  const mockEvents = [
    {
      id: '1',
      title: 'Breakfast',
      date: new Date('2024-01-15'),
      type: 'meal' as const,
      category: 'breakfast',
      color: '#4CAF50',
      data: { mealId: 'meal_1' }
    }
  ];

  it('renders month view by default', () => {
    render(
      <Calendar
        events={mockEvents}
        onDateSelect={jest.fn()}
        onEventClick={jest.fn()}
        onEventCreate={jest.fn()}
        onViewModeChange={jest.fn()}
        onDateChange={jest.fn()}
      />
    );

    expect(screen.getByText('Sun')).toBeInTheDocument();
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
  });

  it('displays events on correct dates', () => {
    render(
      <Calendar
        events={mockEvents}
        onDateSelect={jest.fn()}
        onEventClick={jest.fn()}
        onEventCreate={jest.fn()}
        onViewModeChange={jest.fn()}
        onDateChange={jest.fn()}
      />
    );

    // Check if event is displayed (implementation depends on date calculation)
    expect(screen.getByText('🍽️')).toBeInTheDocument();
  });

  it('calls onDateSelect when date is clicked', async () => {
    const user = userEvent.setup();
    const onDateSelect = jest.fn();
    
    render(
      <Calendar
        events={mockEvents}
        onDateSelect={onDateSelect}
        onEventClick={jest.fn()}
        onEventCreate={jest.fn()}
        onViewModeChange={jest.fn()}
        onDateChange={jest.fn()}
      />
    );

    const dateCell = screen.getByText('15');
    await user.click(dateCell);

    expect(onDateSelect).toHaveBeenCalled();
  });

  it('calls onEventClick when event is clicked', async () => {
    const user = userEvent.setup();
    const onEventClick = jest.fn();
    
    render(
      <Calendar
        events={mockEvents}
        onDateSelect={jest.fn()}
        onEventClick={onEventClick}
        onEventCreate={jest.fn()}
        onViewModeChange={jest.fn()}
        onDateChange={jest.fn()}
      />
    );

    const eventIndicator = screen.getByText('🍽️');
    await user.click(eventIndicator);

    expect(onEventClick).toHaveBeenCalledWith(mockEvents[0]);
  });
});
```

### 2. Integration Testing
```typescript
// Integration tests for calendar with meal logging
describe('Calendar Integration Tests', () => {
  it('integrates with meal logging system', async () => {
    const user = userEvent.setup();
    
    render(<AdvancedNutritionCalendar />);
    
    // Wait for calendar to load
    await waitFor(() => {
      expect(screen.getByText('Nutrition Calendar')).toBeInTheDocument();
    });
    
    // Click on a date to create a meal
    const dateCell = screen.getByText('15');
    await user.click(dateCell);
    
    // Check if meal modal opens
    await waitFor(() => {
      expect(screen.getByText('Log Meal')).toBeInTheDocument();
    });
  });
});
```

## Accessibility Features

### 1. ARIA Support
```typescript
// Accessibility-enhanced calendar
const CalendarDay: React.FC<CalendarDayProps> = ({ ... }) => {
  return (
    <div
      className={`calendar-day ${...}`}
      role="gridcell"
      aria-label={`${date.toLocaleDateString()}, ${events.length} events`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleDateClick();
        }
      }}
    >
      <div className="day-number" aria-hidden="true">
        {dayNumber}
      </div>
      
      {hasEvents && (
        <div className="event-indicators" aria-label={`${eventCount} events`}>
          {events.slice(0, 3).map((event, index) => (
            <EventIndicator
              key={event.id}
              event={event}
              onClick={(e) => handleEventClick(event, e)}
              aria-label={`${event.title}, click to view details`}
            />
          ))}
          {eventCount > 3 && (
            <div className="more-events" aria-label={`${eventCount - 3} more events`}>
              +{eventCount - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
```

### 2. Keyboard Navigation
```typescript
// Keyboard navigation support
const Calendar: React.FC<CalendarProps> = ({ ... }) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          // Navigate to previous day/week/month
          break;
        case 'ArrowRight':
          // Navigate to next day/week/month
          break;
        case 'ArrowUp':
          // Navigate to previous week
          break;
        case 'ArrowDown':
          // Navigate to next week
          break;
        case 'Home':
          // Go to beginning of month
          break;
        case 'End':
          // Go to end of month
          break;
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
- **Drag and Drop**: Drag events between dates
- **Recurring Events**: Support for recurring meal schedules
- **Event Categories**: Color-coded event categories
- **Export/Import**: Calendar data export and import

### 2. Performance Optimizations
- **Virtual Scrolling**: For calendars with many events
- **Lazy Loading**: Load events on demand
- **Caching**: Cache calendar data and calculations
- **Optimistic Updates**: Update UI before server confirmation

