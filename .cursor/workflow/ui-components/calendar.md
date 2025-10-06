# Calendar Component Specification

## EARS Requirements

**EARS-CAL-001**: The system shall provide a calendar component for date selection and event display.

**EARS-CAL-002**: The system shall support multiple view modes including month, week, and day views.

**EARS-CAL-003**: The system shall display events, tasks, and milestones on the calendar.

**EARS-CAL-004**: The system shall provide date range selection for filtering and reporting.

**EARS-CAL-005**: The system shall support keyboard navigation and accessibility features.

**EARS-CAL-006**: The system shall provide customizable styling and theming options.

## Calendar Types

### Date Picker Calendar
```typescript
interface DatePickerCalendar {
  id: 'date_picker';
  name: 'Date Picker';
  description: 'Simple date selection for forms and inputs';
  features: [
    'single_date_selection',
    'date_range_selection',
    'min_max_date_validation',
    'disabled_dates',
    'custom_date_formats',
    'keyboard_navigation'
  ];
  props: {
    value: Date | Date[];
    onChange: (date: Date | Date[]) => void;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: Date[];
    format?: string;
    placeholder?: string;
    size?: 'small' | 'medium' | 'large';
    variant?: 'default' | 'compact' | 'minimal';
  };
}
```

### Event Calendar
```typescript
interface EventCalendar {
  id: 'event_calendar';
  name: 'Event Calendar';
  description: 'Full-featured calendar for displaying and managing events';
  features: [
    'multiple_view_modes',
    'event_display',
    'event_creation',
    'event_editing',
    'event_categories',
    'recurring_events',
    'drag_and_drop',
    'event_filtering'
  ];
  props: {
    events: CalendarEvent[];
    onEventClick: (event: CalendarEvent) => void;
    onEventCreate: (date: Date) => void;
    onEventUpdate: (event: CalendarEvent) => void;
    onEventDelete: (eventId: string) => void;
    viewMode: 'month' | 'week' | 'day' | 'agenda';
    startDate: Date;
    onDateChange: (date: Date) => void;
    categories?: EventCategory[];
    filters?: EventFilter[];
  };
}
```

### Nutrition Calendar
```typescript
interface NutritionCalendar {
  id: 'nutrition_calendar';
  name: 'Nutrition Calendar';
  description: 'Specialized calendar for nutrition tracking and meal planning';
  features: [
    'meal_logging',
    'nutrition_goals',
    'progress_tracking',
    'meal_planning',
    'recipe_scheduling',
    'nutrition_analytics',
    'goal_visualization'
  ];
  props: {
    meals: Meal[];
    nutritionGoals: NutritionGoal[];
    onMealLog: (date: Date, meal: Meal) => void;
    onMealPlan: (date: Date, meal: Meal) => void;
    onGoalUpdate: (goal: NutritionGoal) => void;
    showProgress: boolean;
    showGoals: boolean;
    showAnalytics: boolean;
  };
}
```

## Calendar Views

### Month View
```typescript
interface MonthView {
  id: 'month_view';
  name: 'Month View';
  description: 'Traditional monthly calendar grid';
  layout: {
    type: 'grid';
    rows: 6;
    columns: 7;
    cellSize: 'medium';
    showWeekNumbers: boolean;
    showTodayHighlight: boolean;
  };
  features: [
    'month_navigation',
    'week_start_configuration',
    'event_dots',
    'event_count_indicators',
    'today_highlight',
    'weekend_styling'
  ];
  interactions: [
    'date_click',
    'date_hover',
    'event_click',
    'event_hover',
    'drag_and_drop',
    'context_menu'
  ];
}
```

### Week View
```typescript
interface WeekView {
  id: 'week_view';
  name: 'Week View';
  description: 'Detailed weekly calendar with time slots';
  layout: {
    type: 'timeline';
    timeSlots: 'hourly' | 'half_hourly' | 'quarterly';
    startTime: number; // 0-23
    endTime: number; // 0-23
    showWeekends: boolean;
    showTimeLabels: boolean;
  };
  features: [
    'time_slot_display',
    'event_duration_visualization',
    'overlapping_event_handling',
    'time_zone_support',
    'all_day_events',
    'event_resizing'
  ];
  interactions: [
    'time_slot_click',
    'event_drag',
    'event_resize',
    'event_creation',
    'event_editing'
  ];
}
```

### Day View
```typescript
interface DayView {
  id: 'day_view';
  name: 'Day View';
  description: 'Detailed single-day calendar view';
  layout: {
    type: 'timeline';
    timeSlots: 'hourly' | 'half_hourly' | 'quarterly';
    startTime: number;
    endTime: number;
    showTimeLabels: boolean;
    showCurrentTime: boolean;
  };
  features: [
    'detailed_event_display',
    'event_descriptions',
    'event_attachments',
    'event_reminders',
    'time_blocking',
    'productivity_tracking'
  ];
  interactions: [
    'time_slot_click',
    'event_drag',
    'event_resize',
    'event_creation',
    'event_editing',
    'event_deletion'
  ];
}
```

### Agenda View
```typescript
interface AgendaView {
  id: 'agenda_view';
  name: 'Agenda View';
  description: 'List-based view of upcoming events';
  layout: {
    type: 'list';
    groupBy: 'day' | 'week' | 'month';
    sortBy: 'date' | 'time' | 'title' | 'priority';
    showDates: boolean;
    showTimes: boolean;
    showDescriptions: boolean;
  };
  features: [
    'event_listing',
    'date_grouping',
    'event_sorting',
    'event_filtering',
    'event_search',
    'event_categories'
  ];
  interactions: [
    'event_click',
    'event_edit',
    'event_delete',
    'event_complete',
    'event_priority_change'
  ];
}
```

## Event System

### Event Types
```typescript
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  category: EventCategory;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  recurring?: RecurringRule;
  attendees?: Attendee[];
  location?: string;
  reminders?: Reminder[];
  attachments?: Attachment[];
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

interface EventCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description?: string;
  defaultDuration?: number; // minutes
  defaultReminders?: Reminder[];
}

interface RecurringRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number;
  endDate?: Date;
  occurrences?: number;
  exceptions?: Date[];
}
```

### Event Interactions
```typescript
interface EventInteraction {
  type: 'click' | 'double_click' | 'hover' | 'drag' | 'resize' | 'context_menu';
  event: CalendarEvent;
  position: {
    x: number;
    y: number;
  };
  target: 'event' | 'time_slot' | 'date_cell';
  modifiers: {
    ctrl: boolean;
    shift: boolean;
    alt: boolean;
  };
}

export class CalendarEventService {
  static async createEvent(event: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const newEvent: CalendarEvent = {
      id: generateId(),
      title: event.title || 'New Event',
      description: event.description,
      startDate: event.startDate || new Date(),
      endDate: event.endDate || new Date(Date.now() + 60 * 60 * 1000), // 1 hour default
      allDay: event.allDay || false,
      category: event.category || this.getDefaultCategory(),
      priority: event.priority || 'medium',
      status: 'scheduled',
      recurring: event.recurring,
      attendees: event.attendees || [],
      location: event.location,
      reminders: event.reminders || [],
      attachments: event.attachments || [],
      metadata: event.metadata || {},
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await this.saveEvent(newEvent);
    return newEvent;
  }
  
  static async updateEvent(eventId: string, updates: Partial<CalendarEvent>): Promise<CalendarEvent> {
    const event = await this.getEvent(eventId);
    if (!event) throw new Error('Event not found');
    
    const updatedEvent = {
      ...event,
      ...updates,
      updatedAt: new Date()
    };
    
    await this.saveEvent(updatedEvent);
    return updatedEvent;
  }
  
  static async deleteEvent(eventId: string): Promise<void> {
    await this.removeEvent(eventId);
  }
  
  static async getEventsForDateRange(
    startDate: Date,
    endDate: Date,
    filters?: EventFilter[]
  ): Promise<CalendarEvent[]> {
    const events = await this.getEvents();
    
    return events.filter(event => {
      // Date range filter
      if (event.startDate > endDate || event.endDate < startDate) {
        return false;
      }
      
      // Apply additional filters
      if (filters) {
        return filters.every(filter => this.applyFilter(event, filter));
      }
      
      return true;
    });
  }
}
```

## Nutrition-Specific Features

### Meal Logging
```typescript
interface MealEvent extends CalendarEvent {
  type: 'meal';
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  ingredients: Ingredient[];
  recipe?: Recipe;
  portion: {
    size: number;
    unit: string;
  };
  photos?: string[];
  notes?: string;
}

interface NutritionGoal {
  id: string;
  name: string;
  target: number;
  unit: string;
  period: 'daily' | 'weekly' | 'monthly';
  category: 'calories' | 'protein' | 'carbs' | 'fat' | 'fiber' | 'sugar' | 'sodium';
  startDate: Date;
  endDate?: Date;
  progress: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
}
```

### Progress Tracking
```typescript
interface NutritionProgress {
  date: Date;
  goals: {
    [goalId: string]: {
      target: number;
      actual: number;
      percentage: number;
      status: 'met' | 'exceeded' | 'under';
    };
  };
  meals: MealEvent[];
  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  waterIntake: {
    target: number;
    actual: number;
    percentage: number;
  };
  exercise: {
    duration: number; // minutes
    caloriesBurned: number;
    type: string;
  };
}
```

## Accessibility Features

### Keyboard Navigation
```typescript
interface KeyboardNavigation {
  keys: {
    arrowUp: 'previous_week';
    arrowDown: 'next_week';
    arrowLeft: 'previous_day';
    arrowRight: 'next_day';
    home: 'start_of_week';
    end: 'end_of_week';
    pageUp: 'previous_month';
    pageDown: 'next_month';
    enter: 'select_date';
    escape: 'close_calendar';
    tab: 'next_focusable';
    shiftTab: 'previous_focusable';
  };
  focusManagement: {
    trapFocus: boolean;
    restoreFocus: boolean;
    focusIndicator: 'ring' | 'outline' | 'background';
    focusOrder: 'logical' | 'visual';
  };
  screenReader: {
    announceDateChanges: boolean;
    announceEventChanges: boolean;
    announceNavigation: boolean;
    liveRegions: boolean;
  };
}
```

### ARIA Support
```typescript
interface ARIAFeatures {
  roles: {
    calendar: 'grid';
    dateCell: 'gridcell';
    event: 'button';
    navigation: 'navigation';
    monthYear: 'heading';
  };
  properties: {
    dateCell: {
      'aria-label': string;
      'aria-selected': boolean;
      'aria-current': 'date' | 'page';
      'aria-disabled': boolean;
    };
    event: {
      'aria-label': string;
      'aria-describedby': string;
      'aria-expanded': boolean;
    };
    navigation: {
      'aria-label': string;
      'aria-controls': string;
    };
  };
  liveRegions: {
    announcements: 'polite';
    statusUpdates: 'assertive';
    errorMessages: 'assertive';
  };
}
```

## UI Components

### Calendar Container
```typescript
const Calendar: React.FC<CalendarProps> = ({
  events = [],
  viewMode = 'month',
  startDate = new Date(),
  onDateChange,
  onEventClick,
  onEventCreate,
  onEventUpdate,
  onEventDelete,
  categories = [],
  filters = [],
  showNavigation = true,
  showTodayButton = true,
  showViewToggle = true,
  className = '',
  ...props
}) => {
  const [currentDate, setCurrentDate] = useState(startDate);
  const [currentView, setCurrentView] = useState(viewMode);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  
  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    onDateChange?.(date);
  };
  
  const handleViewChange = (view: CalendarViewMode) => {
    setCurrentView(view);
  };
  
  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    onEventClick?.(event);
  };
  
  const handleEventCreate = (date: Date) => {
    onEventCreate?.(date);
  };
  
  return (
    <div className={`calendar ${className}`} {...props}>
      {showNavigation && (
        <CalendarNavigation
          currentDate={currentDate}
          viewMode={currentView}
          onDateChange={handleDateChange}
          onViewChange={handleViewChange}
          showTodayButton={showTodayButton}
          showViewToggle={showViewToggle}
        />
      )}
      
      <div className="calendar-content">
        {currentView === 'month' && (
          <MonthView
            date={currentDate}
            events={events}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onEventClick={handleEventClick}
            onEventCreate={handleEventCreate}
            categories={categories}
            filters={filters}
          />
        )}
        
        {currentView === 'week' && (
          <WeekView
            date={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onEventCreate={handleEventCreate}
            onEventUpdate={onEventUpdate}
            onEventDelete={onEventDelete}
            categories={categories}
            filters={filters}
          />
        )}
        
        {currentView === 'day' && (
          <DayView
            date={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onEventCreate={handleEventCreate}
            onEventUpdate={onEventUpdate}
            onEventDelete={onEventDelete}
            categories={categories}
            filters={filters}
          />
        )}
        
        {currentView === 'agenda' && (
          <AgendaView
            date={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onEventCreate={handleEventCreate}
            onEventUpdate={onEventUpdate}
            onEventDelete={onEventDelete}
            categories={categories}
            filters={filters}
          />
        )}
      </div>
      
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdate={onEventUpdate}
          onDelete={onEventDelete}
        />
      )}
    </div>
  );
};
```

### Month View Component
```typescript
const MonthView: React.FC<MonthViewProps> = ({
  date,
  events,
  selectedDate,
  onDateSelect,
  onEventClick,
  onEventCreate,
  categories,
  filters
}) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      isSameDay(event.startDate, date) || 
      (event.allDay && isWithinInterval(date, { start: event.startDate, end: event.endDate }))
    );
  };
  
  const isToday = (date: Date) => isSameDay(date, new Date());
  const isCurrentMonth = (date: Date) => isSameMonth(date, monthStart);
  const isSelected = (date: Date) => selectedDate && isSameDay(date, selectedDate);
  
  return (
    <div className="month-view">
      <div className="month-header">
        {weekDays.map(day => (
          <div key={day} className="week-day">
            {day}
          </div>
        ))}
      </div>
      
      <div className="month-grid">
        {days.map(day => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonthDay = isCurrentMonth(day);
          const isTodayDay = isToday(day);
          const isSelectedDay = isSelected(day);
          
          return (
            <div
              key={day.toISOString()}
              className={`month-day ${
                !isCurrentMonthDay ? 'other-month' : ''
              } ${isTodayDay ? 'today' : ''} ${
                isSelectedDay ? 'selected' : ''
              }`}
              onClick={() => onDateSelect(day)}
              onDoubleClick={() => onEventCreate(day)}
              role="gridcell"
              tabIndex={0}
              aria-label={format(day, 'MMMM d, yyyy')}
              aria-selected={isSelectedDay}
            >
              <div className="day-number">
                {format(day, 'd')}
              </div>
              
              <div className="day-events">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    className={`event-dot ${event.category.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    style={{ backgroundColor: event.category.color }}
                    title={event.title}
                  />
                ))}
                
                {dayEvents.length > 3 && (
                  <div className="more-events">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

### Event Modal Component
```typescript
const EventModal: React.FC<EventModalProps> = ({
  event,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState(event);
  
  const handleSave = async () => {
    try {
      await onUpdate(editedEvent);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update event:', error);
    }
  };
  
  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await onDelete(event.id);
        onClose();
      } catch (error) {
        console.error('Failed to delete event:', error);
      }
    }
  };
  
  return (
    <Modal isOpen onClose={onClose}>
      <div className="event-modal">
        <div className="event-header">
          <h2>{event.title}</h2>
          <div className="event-actions">
            <button onClick={() => setIsEditing(!isEditing)}>
              <Edit className="w-4 h-4" />
            </button>
            <button onClick={handleDelete}>
              <Trash className="w-4 h-4" />
            </button>
            <button onClick={onClose}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="event-content">
          {isEditing ? (
            <EventForm
              event={editedEvent}
              onChange={setEditedEvent}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <EventDetails event={event} />
          )}
        </div>
      </div>
    </Modal>
  );
};
```

This comprehensive calendar component provides flexible date selection, event management, and nutrition-specific features while maintaining accessibility and usability standards.
