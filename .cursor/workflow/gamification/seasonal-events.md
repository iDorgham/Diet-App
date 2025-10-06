# Seasonal Events & Limited-Time Content Specification

## EARS Requirements

**EARS-SEV-001**: The system shall provide seasonal events with unique challenges and rewards.

**EARS-SEV-002**: The system shall implement limited-time content with expiration dates.

**EARS-SEV-003**: The system shall provide event-specific themes and visual elements.

**EARS-SEV-004**: The system shall track event participation and provide exclusive rewards.

**EARS-SEV-005**: The system shall implement event leaderboards and competitions.

**EARS-SEV-006**: The system shall provide event analytics and user engagement metrics.

## Seasonal Event Types

### Spring Nutrition Challenge
```typescript
const SPRING_NUTRITION_CHALLENGE = {
  id: 'spring_nutrition_2024',
  name: 'Spring Nutrition Challenge',
  description: 'Fresh start with healthy eating habits',
  theme: 'spring',
  startDate: new Date('2024-03-01'),
  endDate: new Date('2024-05-31'),
  duration: 92, // days
  type: 'seasonal',
  category: 'nutrition',
  
  challenges: [
    {
      id: 'spring_veggie_boost',
      name: 'Spring Veggie Boost',
      description: 'Eat 20 different vegetables this spring',
      xpReward: 500,
      coinReward: 250,
      progressTarget: 20,
      timeLimit: 92,
      requirements: {
        uniqueVegetables: 20,
        timeWindow: 'seasonal'
      }
    },
    {
      id: 'spring_cleanse',
      name: 'Spring Cleanse',
      description: 'Complete 30 days of clean eating',
      xpReward: 800,
      coinReward: 400,
      progressTarget: 30,
      timeLimit: 92,
      requirements: {
        cleanEatingDays: 30,
        processedFoodLimit: 0.1 // 10% max
      }
    },
    {
      id: 'spring_hydration',
      name: 'Spring Hydration',
      description: 'Drink 8 glasses of water daily for 60 days',
      xpReward: 600,
      coinReward: 300,
      progressTarget: 60,
      timeLimit: 92,
      requirements: {
        dailyWaterGlasses: 8,
        consecutiveDays: 60
      }
    }
  ],
  
  rewards: {
    participation: { xp: 100, coins: 50 },
    completion: { xp: 1000, coins: 500, badge: 'spring_champion' },
    top10: { xp: 2000, coins: 1000, badge: 'spring_legend' },
    top100: { xp: 1500, coins: 750, badge: 'spring_warrior' }
  },
  
  specialRules: [
    'Double XP for vegetable logging',
    'Bonus coins for meal prep tasks',
    'Special spring-themed quests',
    'Exclusive spring recipes'
  ],
  
  exclusiveContent: {
    recipes: ['spring_salad', 'asparagus_quiche', 'strawberry_smoothie'],
    themes: ['spring_garden', 'fresh_greens', 'blooming_colors'],
    avatars: ['spring_butterfly', 'garden_gnome', 'flower_crown'],
    badges: ['spring_champion', 'spring_legend', 'spring_warrior']
  }
};
```

### Summer Fitness Blitz
```typescript
const SUMMER_FITNESS_BLITZ = {
  id: 'summer_fitness_2024',
  name: 'Summer Fitness Blitz',
  description: 'Get active and stay healthy this summer',
  theme: 'summer',
  startDate: new Date('2024-06-01'),
  endDate: new Date('2024-08-31'),
  duration: 92,
  type: 'seasonal',
  category: 'fitness',
  
  challenges: [
    {
      id: 'summer_cardio',
      name: 'Summer Cardio',
      description: 'Complete 50 cardio sessions this summer',
      xpReward: 750,
      coinReward: 375,
      progressTarget: 50,
      timeLimit: 92,
      requirements: {
        cardioSessions: 50,
        minDuration: 30 // minutes
      }
    },
    {
      id: 'outdoor_activities',
      name: 'Outdoor Activities',
      description: 'Log 30 outdoor workout sessions',
      xpReward: 600,
      coinReward: 300,
      progressTarget: 30,
      timeLimit: 92,
      requirements: {
        outdoorWorkouts: 30,
        locationTypes: ['park', 'beach', 'trail', 'outdoor_gym']
      }
    },
    {
      id: 'summer_strength',
      name: 'Summer Strength',
      description: 'Complete 40 strength training sessions',
      xpReward: 800,
      coinReward: 400,
      progressTarget: 40,
      timeLimit: 92,
      requirements: {
        strengthSessions: 40,
        minDuration: 45
      }
    }
  ],
  
  rewards: {
    participation: { xp: 150, coins: 75 },
    completion: { xp: 1500, coins: 750, badge: 'summer_athlete' },
    top10: { xp: 3000, coins: 1500, badge: 'summer_legend' },
    top100: { xp: 2250, coins: 1125, badge: 'summer_warrior' }
  },
  
  specialRules: [
    'Triple XP for exercise logging',
    'Bonus coins for outdoor activities',
    'Special summer-themed achievements',
    'Exclusive summer workout plans'
  ],
  
  exclusiveContent: {
    workouts: ['beach_workout', 'park_running', 'summer_yoga'],
    themes: ['summer_sunset', 'ocean_waves', 'tropical_vibes'],
    avatars: ['summer_athlete', 'beach_bum', 'surfer_dude'],
    badges: ['summer_athlete', 'summer_legend', 'summer_warrior']
  }
};
```

### Fall Harvest Challenge
```typescript
const FALL_HARVEST_CHALLENGE = {
  id: 'fall_harvest_2024',
  name: 'Fall Harvest Challenge',
  description: 'Embrace the harvest season with healthy eating',
  theme: 'fall',
  startDate: new Date('2024-09-01'),
  endDate: new Date('2024-11-30'),
  duration: 91,
  type: 'seasonal',
  category: 'nutrition',
  
  challenges: [
    {
      id: 'harvest_vegetables',
      name: 'Harvest Vegetables',
      description: 'Eat 25 different fall vegetables',
      xpReward: 600,
      coinReward: 300,
      progressTarget: 25,
      timeLimit: 91,
      requirements: {
        fallVegetables: 25,
        seasonalVariety: true
      }
    },
    {
      id: 'meal_prep_master',
      name: 'Meal Prep Master',
      description: 'Complete 20 meal prep sessions',
      xpReward: 700,
      coinReward: 350,
      progressTarget: 20,
      timeLimit: 91,
      requirements: {
        mealPrepSessions: 20,
        minMealsPerSession: 3
      }
    },
    {
      id: 'comfort_food_healthy',
      name: 'Healthy Comfort Food',
      description: 'Make 15 healthy versions of comfort foods',
      xpReward: 500,
      coinReward: 250,
      progressTarget: 15,
      timeLimit: 91,
      requirements: {
        healthyComfortFoods: 15,
        nutritionDensity: 0.8
      }
    }
  ],
  
  rewards: {
    participation: { xp: 120, coins: 60 },
    completion: { xp: 1200, coins: 600, badge: 'harvest_master' },
    top10: { xp: 2400, coins: 1200, badge: 'harvest_legend' },
    top100: { xp: 1800, coins: 900, badge: 'harvest_warrior' }
  },
  
  specialRules: [
    'Double XP for meal prep',
    'Bonus coins for seasonal recipes',
    'Special fall-themed quests',
    'Exclusive harvest recipes'
  ],
  
  exclusiveContent: {
    recipes: ['pumpkin_soup', 'roasted_squash', 'apple_crisp'],
    themes: ['autumn_leaves', 'harvest_gold', 'cozy_warmth'],
    avatars: ['harvest_chef', 'autumn_leaf', 'pumpkin_spice'],
    badges: ['harvest_master', 'harvest_legend', 'harvest_warrior']
  }
};
```

### Winter Wellness Challenge
```typescript
const WINTER_WELLNESS_CHALLENGE = {
  id: 'winter_wellness_2024',
  name: 'Winter Wellness Challenge',
  description: 'Stay healthy and active during winter',
  theme: 'winter',
  startDate: new Date('2024-12-01'),
  endDate: new Date('2025-02-28'),
  duration: 90,
  type: 'seasonal',
  category: 'wellness',
  
  challenges: [
    {
      id: 'winter_immunity',
      name: 'Winter Immunity',
      description: 'Eat immunity-boosting foods for 45 days',
      xpReward: 650,
      coinReward: 325,
      progressTarget: 45,
      timeLimit: 90,
      requirements: {
        immunityFoods: ['citrus', 'ginger', 'garlic', 'turmeric'],
        consecutiveDays: 45
      }
    },
    {
      id: 'indoor_fitness',
      name: 'Indoor Fitness',
      description: 'Complete 35 indoor workout sessions',
      xpReward: 700,
      coinReward: 350,
      progressTarget: 35,
      timeLimit: 90,
      requirements: {
        indoorWorkouts: 35,
        workoutTypes: ['home_gym', 'yoga', 'pilates', 'dance']
      }
    },
    {
      id: 'winter_hydration',
      name: 'Winter Hydration',
      description: 'Maintain hydration with warm beverages',
      xpReward: 400,
      coinReward: 200,
      progressTarget: 60,
      timeLimit: 90,
      requirements: {
        warmBeverages: ['tea', 'warm_water', 'broth'],
        dailyIntake: 8 // glasses
      }
    }
  ],
  
  rewards: {
    participation: { xp: 100, coins: 50 },
    completion: { xp: 1000, coins: 500, badge: 'winter_warrior' },
    top10: { xp: 2000, coins: 1000, badge: 'winter_legend' },
    top100: { xp: 1500, coins: 750, badge: 'winter_champion' }
  },
  
  specialRules: [
    'Double XP for wellness activities',
    'Bonus coins for immunity foods',
    'Special winter-themed quests',
    'Exclusive winter wellness tips'
  ],
  
  exclusiveContent: {
    recipes: ['immune_boost_smoothie', 'warm_golden_milk', 'winter_soup'],
    themes: ['winter_wonderland', 'cozy_fireplace', 'snow_flakes'],
    avatars: ['winter_warrior', 'snow_angel', 'cozy_blanket'],
    badges: ['winter_warrior', 'winter_legend', 'winter_champion']
  }
};
```

## Limited-Time Events

### New Year Resolution Event
```typescript
const NEW_YEAR_RESOLUTION_EVENT = {
  id: 'new_year_resolution_2025',
  name: 'New Year Resolution Event',
  description: 'Start the year with healthy resolutions',
  theme: 'new_year',
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-31'),
  duration: 31,
  type: 'limited_time',
  category: 'resolution',
  
  challenges: [
    {
      id: 'resolution_commitment',
      name: 'Resolution Commitment',
      description: 'Set and track 3 health resolutions',
      xpReward: 300,
      coinReward: 150,
      progressTarget: 3,
      timeLimit: 31,
      requirements: {
        resolutionsSet: 3,
        trackingDays: 21
      }
    },
    {
      id: 'habit_formation',
      name: 'Habit Formation',
      description: 'Build 2 new healthy habits',
      xpReward: 400,
      coinReward: 200,
      progressTarget: 2,
      timeLimit: 31,
      requirements: {
        newHabits: 2,
        consistencyRate: 0.8
      }
    }
  ],
  
  rewards: {
    participation: { xp: 50, coins: 25 },
    completion: { xp: 500, coins: 250, badge: 'resolution_keeper' },
    top10: { xp: 1000, coins: 500, badge: 'resolution_legend' }
  },
  
  exclusiveContent: {
    themes: ['new_year_fresh', 'resolution_goals', 'fresh_start'],
    avatars: ['resolution_hero', 'goal_setter', 'fresh_start'],
    badges: ['resolution_keeper', 'resolution_legend']
  }
};
```

### Valentine's Day Love Your Body Event
```typescript
const VALENTINES_LOVE_BODY_EVENT = {
  id: 'valentines_love_body_2025',
  name: 'Love Your Body Event',
  description: 'Celebrate self-love and body positivity',
  theme: 'valentines',
  startDate: new Date('2025-02-10'),
  endDate: new Date('2025-02-17'),
  duration: 8,
  type: 'limited_time',
  category: 'wellness',
  
  challenges: [
    {
      id: 'self_care_week',
      name: 'Self-Care Week',
      description: 'Complete 7 days of self-care activities',
      xpReward: 350,
      coinReward: 175,
      progressTarget: 7,
      timeLimit: 8,
      requirements: {
        selfCareActivities: ['meditation', 'journaling', 'bath', 'walk'],
        dailyCompletion: true
      }
    },
    {
      id: 'body_positive_meals',
      name: 'Body Positive Meals',
      description: 'Enjoy 14 nourishing meals without guilt',
      xpReward: 250,
      coinReward: 125,
      progressTarget: 14,
      timeLimit: 8,
      requirements: {
        nourishingMeals: 14,
        positiveMindset: true
      }
    }
  ],
  
  rewards: {
    participation: { xp: 75, coins: 37 },
    completion: { xp: 400, coins: 200, badge: 'self_love_champion' },
    top10: { xp: 800, coins: 400, badge: 'self_love_legend' }
  },
  
  exclusiveContent: {
    themes: ['love_pink', 'heart_warmth', 'self_care'],
    avatars: ['self_love_queen', 'body_positive', 'heart_warrior'],
    badges: ['self_love_champion', 'self_love_legend']
  }
};
```

## Event Data Models

### Event Interface
```typescript
interface Event {
  id: string;
  name: string;
  description: string;
  theme: string;
  startDate: Date;
  endDate: Date;
  duration: number; // days
  type: 'seasonal' | 'limited_time' | 'special';
  category: string;
  challenges: EventChallenge[];
  rewards: EventRewards;
  specialRules: string[];
  exclusiveContent: ExclusiveContent;
  isActive: boolean;
  maxParticipants?: number;
  registrationRequired: boolean;
}

interface EventChallenge {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  coinReward: number;
  progressTarget: number;
  timeLimit: number;
  requirements: EventRequirements;
  isOptional: boolean;
  prerequisites?: string[];
}

interface EventRequirements {
  [key: string]: any;
  timeWindow?: string;
  minDuration?: number;
  consecutiveDays?: number;
  consistencyRate?: number;
}

interface EventRewards {
  participation: Reward;
  completion: Reward;
  top10?: Reward;
  top100?: Reward;
  top1000?: Reward;
}

interface Reward {
  xp: number;
  coins: number;
  badge?: string;
  item?: string;
  theme?: string;
}

interface ExclusiveContent {
  recipes?: string[];
  themes?: string[];
  avatars?: string[];
  badges?: string[];
  items?: string[];
  workouts?: string[];
}

interface UserEvent {
  event: Event;
  participation: EventParticipation;
  progress: EventProgress;
  rewards: EventReward[];
  isRegistered: boolean;
  registrationDate?: Date;
  completionDate?: Date;
}

interface EventParticipation {
  challengesCompleted: number;
  totalChallenges: number;
  xpEarned: number;
  coinsEarned: number;
  badgesUnlocked: string[];
  itemsUnlocked: string[];
  rank?: number;
  percentile?: number;
}

interface EventProgress {
  overallProgress: number;
  challengeProgress: Record<string, number>;
  timeRemaining: number;
  isCompleted: boolean;
  completionRate: number;
}
```

## Event Management System

### Event Service
```typescript
export class EventService {
  static async getActiveEvents(): Promise<Event[]> {
    const now = new Date();
    return Object.values(EVENTS).filter(event => 
      now >= event.startDate && now <= event.endDate && event.isActive
    );
  }
  
  static async registerForEvent(
    userId: string,
    eventId: string
  ): Promise<EventRegistrationResult> {
    const event = EVENTS[eventId];
    if (!event) {
      throw new Error('Event not found');
    }
    
    if (!event.isActive) {
      throw new Error('Event is not active');
    }
    
    if (event.registrationRequired) {
      const existingRegistration = await this.getUserEventRegistration(userId, eventId);
      if (existingRegistration) {
        throw new Error('Already registered for this event');
      }
      
      if (event.maxParticipants) {
        const currentParticipants = await this.getEventParticipantCount(eventId);
        if (currentParticipants >= event.maxParticipants) {
          throw new Error('Event is full');
        }
      }
    }
    
    const userEvent: UserEvent = {
      event,
      participation: {
        challengesCompleted: 0,
        totalChallenges: event.challenges.length,
        xpEarned: 0,
        coinsEarned: 0,
        badgesUnlocked: [],
        itemsUnlocked: []
      },
      progress: {
        overallProgress: 0,
        challengeProgress: {},
        timeRemaining: event.endDate.getTime() - Date.now(),
        isCompleted: false,
        completionRate: 0
      },
      rewards: [],
      isRegistered: true,
      registrationDate: new Date()
    };
    
    await this.saveUserEvent(userId, userEvent);
    
    // Award participation reward
    await this.awardEventReward(userId, event.rewards.participation);
    
    return {
      success: true,
      eventId,
      registrationDate: userEvent.registrationDate,
      participationReward: event.rewards.participation
    };
  }
  
  static async updateEventProgress(
    userId: string,
    eventId: string,
    challengeId: string,
    progress: number
  ): Promise<EventProgressUpdate> {
    const userEvent = await this.getUserEvent(userId, eventId);
    if (!userEvent) {
      throw new Error('User not registered for this event');
    }
    
    const challenge = userEvent.event.challenges.find(c => c.id === challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    
    // Update challenge progress
    userEvent.progress.challengeProgress[challengeId] = progress;
    
    // Check if challenge is completed
    if (progress >= challenge.progressTarget) {
      await this.completeEventChallenge(userId, userEvent, challenge);
    }
    
    // Update overall progress
    userEvent.progress.overallProgress = this.calculateOverallProgress(userEvent);
    userEvent.progress.completionRate = this.calculateCompletionRate(userEvent);
    
    // Check if event is completed
    if (userEvent.progress.completionRate >= 1.0) {
      await this.completeEvent(userId, userEvent);
    }
    
    await this.saveUserEvent(userId, userEvent);
    
    return {
      success: true,
      challengeProgress: progress,
      overallProgress: userEvent.progress.overallProgress,
      completionRate: userEvent.progress.completionRate,
      isChallengeCompleted: progress >= challenge.progressTarget,
      isEventCompleted: userEvent.progress.completionRate >= 1.0
    };
  }
  
  static async getEventLeaderboard(
    eventId: string,
    limit: number = 100
  ): Promise<EventLeaderboardEntry[]> {
    const event = EVENTS[eventId];
    if (!event) {
      throw new Error('Event not found');
    }
    
    const participants = await this.getEventParticipants(eventId);
    
    // Sort by completion rate and XP earned
    const sortedParticipants = participants.sort((a, b) => {
      if (a.participation.challengesCompleted !== b.participation.challengesCompleted) {
        return b.participation.challengesCompleted - a.participation.challengesCompleted;
      }
      return b.participation.xpEarned - a.participation.xpEarned;
    });
    
    return sortedParticipants.slice(0, limit).map((participant, index) => ({
      rank: index + 1,
      userId: participant.userId,
      username: participant.username,
      avatar: participant.avatar,
      challengesCompleted: participant.participation.challengesCompleted,
      xpEarned: participant.participation.xpEarned,
      completionRate: participant.progress.completionRate,
      badgesUnlocked: participant.participation.badgesUnlocked.length
    }));
  }
  
  private static async completeEventChallenge(
    userId: string,
    userEvent: UserEvent,
    challenge: EventChallenge
  ): Promise<void> {
    // Award challenge rewards
    await this.awardEventReward(userId, {
      xp: challenge.xpReward,
      coins: challenge.coinReward
    });
    
    // Update participation stats
    userEvent.participation.challengesCompleted += 1;
    userEvent.participation.xpEarned += challenge.xpReward;
    userEvent.participation.coinsEarned += challenge.coinReward;
    
    // Check for milestone rewards
    const completionRate = userEvent.participation.challengesCompleted / userEvent.participation.totalChallenges;
    
    if (completionRate >= 1.0 && !userEvent.participation.badgesUnlocked.includes('completion')) {
      await this.awardEventReward(userId, userEvent.event.rewards.completion);
      userEvent.participation.badgesUnlocked.push('completion');
    }
  }
  
  private static async completeEvent(
    userId: string,
    userEvent: UserEvent
  ): Promise<void> {
    userEvent.progress.isCompleted = true;
    userEvent.completionDate = new Date();
    
    // Award completion rewards
    await this.awardEventReward(userId, userEvent.event.rewards.completion);
    
    // Check for ranking rewards
    const leaderboard = await this.getEventLeaderboard(userEvent.event.id, 1000);
    const userRank = leaderboard.findIndex(entry => entry.userId === userId) + 1;
    
    if (userRank <= 10 && userEvent.event.rewards.top10) {
      await this.awardEventReward(userId, userEvent.event.rewards.top10);
    } else if (userRank <= 100 && userEvent.event.rewards.top100) {
      await this.awardEventReward(userId, userEvent.event.rewards.top100);
    }
    
    // Unlock exclusive content
    await this.unlockExclusiveContent(userId, userEvent.event.exclusiveContent);
  }
}
```

## UI Components

### Event Card
```typescript
interface EventCardProps {
  event: Event;
  userEvent?: UserEvent;
  onRegister: (eventId: string) => void;
  onViewDetails: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  userEvent,
  onRegister,
  onViewDetails
}) => {
  const timeRemaining = event.endDate.getTime() - Date.now();
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
  const isActive = timeRemaining > 0;
  
  const getThemeColor = (theme: string): string => {
    switch (theme) {
      case 'spring': return '#10B981';
      case 'summer': return '#F59E0B';
      case 'fall': return '#EF4444';
      case 'winter': return '#3B82F6';
      case 'new_year': return '#8B5CF6';
      case 'valentines': return '#EC4899';
      default: return '#6B7280';
    }
  };
  
  return (
    <div 
      className={`event-card ${event.type} ${isActive ? 'active' : 'inactive'}`}
      style={{
        borderColor: getThemeColor(event.theme),
        boxShadow: `0 0 15px ${getThemeColor(event.theme)}30`
      }}
    >
      <div className="event-header">
        <div className="event-info">
          <h3 className="event-name">{event.name}</h3>
          <p className="event-description">{event.description}</p>
          <div className="event-meta">
            <span className="event-theme">{event.theme}</span>
            <span className="event-category">{event.category}</span>
            <span className="event-type">{event.type}</span>
          </div>
        </div>
        
        <div className="event-status">
          {isActive ? (
            <span className="status-active">Active</span>
          ) : (
            <span className="status-ended">Ended</span>
          )}
        </div>
      </div>
      
      <div className="event-timer">
        <span>⏰ {daysRemaining} days remaining</span>
      </div>
      
      {userEvent && (
        <div className="event-progress">
          <div className="progress-header">
            <span className="progress-text">
              {userEvent.participation.challengesCompleted} / {userEvent.participation.totalChallenges} challenges
            </span>
            <span className="progress-percentage">
              {Math.round(userEvent.progress.completionRate * 100)}%
            </span>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${userEvent.progress.completionRate * 100}%`,
                backgroundColor: getThemeColor(event.theme)
              }}
            />
          </div>
        </div>
      )}
      
      <div className="event-rewards">
        <div className="participation-reward">
          <span>Participation: +{event.rewards.participation.xp} XP, +{event.rewards.participation.coins} 🪙</span>
        </div>
        <div className="completion-reward">
          <span>Completion: +{event.rewards.completion.xp} XP, +{event.rewards.completion.coins} 🪙</span>
        </div>
      </div>
      
      <div className="event-actions">
        {!userEvent && isActive && (
          <button 
            className="register-btn"
            onClick={() => onRegister(event.id)}
          >
            Register for Event
          </button>
        )}
        
        <button 
          className="view-details-btn"
          onClick={() => onViewDetails(event.id)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};
```

### Event Dashboard
```typescript
interface EventDashboardProps {
  events: Event[];
  userEvents: UserEvent[];
  onEventAction: (action: string, eventId: string) => void;
  filter: {
    type?: 'seasonal' | 'limited_time' | 'special';
    status?: 'active' | 'upcoming' | 'ended';
    category?: string;
  };
}

const EventDashboard: React.FC<EventDashboardProps> = ({
  events,
  userEvents,
  onEventAction,
  filter
}) => {
  const filteredEvents = events.filter(event => {
    const now = new Date();
    const isActive = now >= event.startDate && now <= event.endDate;
    const isUpcoming = now < event.startDate;
    const isEnded = now > event.endDate;
    
    if (filter.type && event.type !== filter.type) return false;
    if (filter.status === 'active' && !isActive) return false;
    if (filter.status === 'upcoming' && !isUpcoming) return false;
    if (filter.status === 'ended' && !isEnded) return false;
    if (filter.category && event.category !== filter.category) return false;
    
    return true;
  });
  
  const eventsByType = filteredEvents.reduce((acc, event) => {
    const type = event.type;
    if (!acc[type]) acc[type] = [];
    acc[type].push(event);
    return acc;
  }, {} as Record<string, Event[]>);
  
  return (
    <div className="event-dashboard">
      <div className="dashboard-header">
        <h1>Events & Challenges</h1>
        <div className="event-stats">
          <div className="stat">
            <span className="stat-value">{events.filter(e => e.isActive).length}</span>
            <span className="stat-label">Active Events</span>
          </div>
          <div className="stat">
            <span className="stat-value">{userEvents.length}</span>
            <span className="stat-label">Participating</span>
          </div>
          <div className="stat">
            <span className="stat-value">{userEvents.filter(e => e.progress.isCompleted).length}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>
      
      <div className="event-filters">
        <select 
          value={filter.type || 'all'}
          onChange={(e) => onFilterChange({ ...filter, type: e.target.value })}
        >
          <option value="all">All Types</option>
          <option value="seasonal">Seasonal</option>
          <option value="limited_time">Limited Time</option>
          <option value="special">Special</option>
        </select>
        
        <select 
          value={filter.status || 'all'}
          onChange={(e) => onFilterChange({ ...filter, status: e.target.value })}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="upcoming">Upcoming</option>
          <option value="ended">Ended</option>
        </select>
        
        <select 
          value={filter.category || 'all'}
          onChange={(e) => onFilterChange({ ...filter, category: e.target.value })}
        >
          <option value="all">All Categories</option>
          <option value="nutrition">Nutrition</option>
          <option value="fitness">Fitness</option>
          <option value="wellness">Wellness</option>
          <option value="resolution">Resolution</option>
        </select>
      </div>
      
      {Object.entries(eventsByType).map(([type, typeEvents]) => (
        <div key={type} className="event-section">
          <h2 className="section-title">
            {type.charAt(0).toUpperCase() + type.slice(1)} Events
          </h2>
          <div className="events-grid">
            {typeEvents.map(event => {
              const userEvent = userEvents.find(ue => ue.event.id === event.id);
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  userEvent={userEvent}
                  onRegister={(eventId) => onEventAction('register', eventId)}
                  onViewDetails={(eventId) => onEventAction('view', eventId)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
```

## Integration Points

### Firestore Integration
```typescript
interface EventDocument {
  userId: string;
  events: UserEvent[];
  eventHistory: EventCompletion[];
  lastUpdated: Timestamp;
}

const updateUserEvents = async (
  userId: string,
  events: UserEvent[]
): Promise<void> => {
  const eventDoc: EventDocument = {
    userId,
    events,
    eventHistory: await getEventHistory(userId),
    lastUpdated: serverTimestamp()
  };
  
  await updateDoc(doc(db, 'userEvents', userId), eventDoc);
};
```

### Real-time Updates
```typescript
const subscribeToEvents = (
  userId: string,
  onUpdate: (events: UserEvent[]) => void
): Unsubscribe => {
  return onSnapshot(
    doc(db, 'userEvents', userId),
    (doc) => {
      if (doc.exists()) {
        const data = doc.data() as EventDocument;
        onUpdate(data.events);
      }
    }
  );
};
```

## Analytics and Metrics

### Event Analytics
```typescript
interface EventAnalytics {
  totalEvents: number;
  activeEvents: number;
  completedEvents: number;
  averageParticipationRate: number;
  averageCompletionRate: number;
  eventTypeBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
  seasonalTrends: Record<string, number>;
  userEngagementScore: number;
}

const calculateEventAnalytics = (
  userEvents: UserEvent[]
): EventAnalytics => {
  const completedEvents = userEvents.filter(e => e.progress.isCompleted);
  
  return {
    totalEvents: userEvents.length,
    activeEvents: userEvents.filter(e => e.event.isActive).length,
    completedEvents: completedEvents.length,
    averageParticipationRate: userEvents.length / Object.keys(EVENTS).length,
    averageCompletionRate: completedEvents.length / userEvents.length,
    eventTypeBreakdown: userEvents.reduce((acc, event) => {
      acc[event.event.type] = (acc[event.event.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    categoryBreakdown: userEvents.reduce((acc, event) => {
      acc[event.event.category] = (acc[event.event.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    seasonalTrends: calculateSeasonalTrends(userEvents),
    userEngagementScore: calculateEngagementScore(userEvents)
  };
};
```

## Testing Requirements

### Unit Tests
- Event registration logic
- Progress tracking algorithms
- Reward distribution system
- Leaderboard calculations

### Integration Tests
- Firestore event updates
- Real-time synchronization
- Event notification system
- UI state management

### Performance Tests
- Large event collections
- Real-time update frequency
- Event rendering performance
- Leaderboard query efficiency

## Future Enhancements

### Advanced Features
- Dynamic event generation
- Community-created events
- Event templates and sharing
- Advanced event analytics
- Event prediction algorithms

### Social Features
- Event teams and groups
- Event social sharing
- Event competitions
- Event mentoring
- Event showcases
