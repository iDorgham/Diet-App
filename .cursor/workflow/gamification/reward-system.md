# Reward System Specification

## EARS Requirements

**EARS-RWD-001**: The system shall provide multiple reward tiers with increasing value and rarity.

**EARS-RWD-002**: The system shall implement unlockable content that becomes available through progression.

**EARS-RWD-003**: The system shall award premium rewards for exceptional achievements and milestones.

**EARS-RWD-004**: The system shall provide a gift system for sharing rewards between users.

**EARS-RWD-005**: The system shall implement reward expiration and redemption mechanisms.

**EARS-RWD-006**: The system shall track reward usage analytics and user satisfaction.

## Reward Categories

### Experience Rewards
```typescript
const EXPERIENCE_REWARDS = {
  LEVEL_UP: {
    id: 'level_up_reward',
    name: 'Level Up Bonus',
    description: 'Bonus XP and coins for leveling up',
    type: 'experience',
    rarity: 'common',
    value: {
      xp: 100,
      coins: 50
    },
    conditions: {
      trigger: 'level_up',
      minLevel: 1
    },
    stackable: false,
    expiration: null
  },
  
  STREAK_BONUS: {
    id: 'streak_bonus',
    name: 'Streak Bonus',
    description: 'Bonus rewards for maintaining streaks',
    type: 'experience',
    rarity: 'uncommon',
    value: {
      xp: 25,
      coins: 15
    },
    conditions: {
      trigger: 'streak_milestone',
      streakDays: [7, 14, 30, 60, 100]
    },
    stackable: true,
    expiration: null
  },
  
  PERFECT_DAY: {
    id: 'perfect_day',
    name: 'Perfect Day Bonus',
    description: 'Reward for completing all daily goals',
    type: 'experience',
    rarity: 'rare',
    value: {
      xp: 200,
      coins: 100
    },
    conditions: {
      trigger: 'perfect_day',
      goalsCompleted: 'all'
    },
    stackable: false,
    expiration: null
  }
};
```

### Cosmetic Rewards
```typescript
const COSMETIC_REWARDS = {
  AVATAR_FRAME: {
    id: 'avatar_frame_gold',
    name: 'Golden Avatar Frame',
    description: 'Exclusive golden frame for your avatar',
    type: 'cosmetic',
    rarity: 'epic',
    value: {
      coins: 500
    },
    unlockable: {
      category: 'avatar_frame',
      item: 'golden_frame',
      duration: 'permanent'
    },
    conditions: {
      trigger: 'achievement',
      achievementId: 'level_50_master'
    },
    stackable: false,
    expiration: null
  },
  
  THEME_UNLOCK: {
    id: 'ocean_theme',
    name: 'Ocean Theme',
    description: 'Beautiful ocean-themed UI colors',
    type: 'cosmetic',
    rarity: 'rare',
    value: {
      coins: 300
    },
    unlockable: {
      category: 'theme',
      item: 'ocean_theme',
      duration: 'permanent'
    },
    conditions: {
      trigger: 'quest_completion',
      questId: 'ocean_explorer'
    },
    stackable: false,
    expiration: null
  },
  
  TITLE_UNLOCK: {
    id: 'nutrition_expert_title',
    name: 'Nutrition Expert',
    description: 'Display title for nutrition mastery',
    type: 'cosmetic',
    rarity: 'uncommon',
    value: {
      coins: 150
    },
    unlockable: {
      category: 'title',
      item: 'nutrition_expert',
      duration: 'permanent'
    },
    conditions: {
      trigger: 'skill_mastery',
      skill: 'nutrition',
      level: 10
    },
    stackable: false,
    expiration: null
  }
};
```

### Functional Rewards
```typescript
const FUNCTIONAL_REWARDS = {
  PREMIUM_RECIPES: {
    id: 'premium_recipe_pack',
    name: 'Premium Recipe Pack',
    description: 'Access to exclusive premium recipes',
    type: 'functional',
    rarity: 'rare',
    value: {
      coins: 400
    },
    unlockable: {
      category: 'recipe_pack',
      item: 'premium_recipes',
      duration: 'permanent',
      content: ['gourmet_salmon', 'quinoa_bowl', 'chia_pudding']
    },
    conditions: {
      trigger: 'level_milestone',
      level: 25
    },
    stackable: false,
    expiration: null
  },
  
  AI_COACH_UPGRADE: {
    id: 'ai_coach_pro',
    name: 'AI Coach Pro',
    description: 'Enhanced AI coach with advanced features',
    type: 'functional',
    rarity: 'epic',
    value: {
      coins: 800
    },
    unlockable: {
      category: 'ai_upgrade',
      item: 'coach_pro',
      duration: '30_days',
      features: ['advanced_insights', 'personalized_plans', 'priority_support']
    },
    conditions: {
      trigger: 'achievement',
      achievementId: 'ai_enthusiast'
    },
    stackable: false,
    expiration: 30 // days
  },
  
  STORAGE_EXPANSION: {
    id: 'storage_expansion',
    name: 'Storage Expansion',
    description: 'Increase your inventory storage capacity',
    type: 'functional',
    rarity: 'uncommon',
    value: {
      coins: 200
    },
    unlockable: {
      category: 'storage',
      item: 'expansion',
      duration: 'permanent',
      bonus: 50 // additional storage slots
    },
    conditions: {
      trigger: 'level_milestone',
      level: 15
    },
    stackable: true,
    expiration: null
  }
};
```

## Reward Tiers

### Rarity System
```typescript
enum RewardRarity {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
  EPIC = 'epic',
  LEGENDARY = 'legendary',
  MYTHIC = 'mythic'
}

const RARITY_CONFIG = {
  [RewardRarity.COMMON]: {
    color: '#6B7280',      // Gray
    glowColor: '#9CA3AF',
    borderColor: '#D1D5DB',
    dropRate: 0.5,
    multiplier: 1.0,
    description: 'Common reward'
  },
  [RewardRarity.UNCOMMON]: {
    color: '#3B82F6',      // Blue
    glowColor: '#60A5FA',
    borderColor: '#93C5FD',
    dropRate: 0.3,
    multiplier: 1.2,
    description: 'Uncommon reward'
  },
  [RewardRarity.RARE]: {
    color: '#8B5CF6',      // Purple
    glowColor: '#A78BFA',
    borderColor: '#C4B5FD',
    dropRate: 0.15,
    multiplier: 1.5,
    description: 'Rare reward'
  },
  [RewardRarity.EPIC]: {
    color: '#F59E0B',      // Orange
    glowColor: '#FBBF24',
    borderColor: '#FCD34D',
    dropRate: 0.04,
    multiplier: 2.0,
    description: 'Epic reward'
  },
  [RewardRarity.LEGENDARY]: {
    color: '#EF4444',      // Red
    glowColor: '#F87171',
    borderColor: '#FCA5A5',
    dropRate: 0.009,
    multiplier: 3.0,
    description: 'Legendary reward'
  },
  [RewardRarity.MYTHIC]: {
    color: '#10B981',      // Emerald
    glowColor: '#34D399',
    borderColor: '#6EE7B7',
    dropRate: 0.001,
    multiplier: 5.0,
    description: 'Mythic reward'
  }
};
```

### Reward Tiers
```typescript
const REWARD_TIERS = {
  BRONZE: {
    name: 'Bronze Tier',
    minLevel: 1,
    maxLevel: 10,
    rewards: ['common', 'uncommon'],
    bonusMultiplier: 1.0,
    unlockRate: 0.8
  },
  
  SILVER: {
    name: 'Silver Tier',
    minLevel: 11,
    maxLevel: 25,
    rewards: ['common', 'uncommon', 'rare'],
    bonusMultiplier: 1.2,
    unlockRate: 0.6
  },
  
  GOLD: {
    name: 'Gold Tier',
    minLevel: 26,
    maxLevel: 50,
    rewards: ['uncommon', 'rare', 'epic'],
    bonusMultiplier: 1.5,
    unlockRate: 0.4
  },
  
  PLATINUM: {
    name: 'Platinum Tier',
    minLevel: 51,
    maxLevel: 100,
    rewards: ['rare', 'epic', 'legendary'],
    bonusMultiplier: 2.0,
    unlockRate: 0.2
  },
  
  DIAMOND: {
    name: 'Diamond Tier',
    minLevel: 101,
    maxLevel: 999,
    rewards: ['epic', 'legendary', 'mythic'],
    bonusMultiplier: 3.0,
    unlockRate: 0.1
  }
};
```

## Unlockable Content System

### Content Categories
```typescript
const UNLOCKABLE_CATEGORIES = {
  AVATAR_ITEMS: {
    id: 'avatar_items',
    name: 'Avatar Items',
    description: 'Customizable avatar accessories',
    items: {
      frames: ['golden_frame', 'silver_frame', 'bronze_frame'],
      backgrounds: ['ocean_bg', 'forest_bg', 'mountain_bg'],
      accessories: ['crown', 'glasses', 'hat']
    }
  },
  
  THEMES: {
    id: 'themes',
    name: 'UI Themes',
    description: 'Custom application themes',
    items: {
      color_schemes: ['ocean', 'forest', 'sunset', 'midnight'],
      layouts: ['compact', 'spacious', 'minimal'],
      animations: ['smooth', 'bouncy', 'subtle']
    }
  },
  
  RECIPE_PACKS: {
    id: 'recipe_packs',
    name: 'Recipe Packs',
    description: 'Exclusive recipe collections',
    items: {
      cuisines: ['italian', 'asian', 'mediterranean', 'mexican'],
      dietary: ['keto', 'vegan', 'paleo', 'gluten_free'],
      skill_level: ['beginner', 'intermediate', 'advanced']
    }
  },
  
  AI_FEATURES: {
    id: 'ai_features',
    name: 'AI Features',
    description: 'Enhanced AI capabilities',
    items: {
      insights: ['advanced_analytics', 'trend_analysis', 'predictions'],
      personalization: ['custom_plans', 'adaptive_suggestions'],
      support: ['priority_support', '24_7_availability']
    }
  }
};
```

### Unlock Conditions
```typescript
interface UnlockCondition {
  type: 'level' | 'achievement' | 'quest' | 'streak' | 'score' | 'purchase';
  value: number | string;
  operator?: 'gte' | 'lte' | 'eq' | 'in';
  additionalRequirements?: string[];
}

const UNLOCK_CONDITIONS = {
  LEVEL_25: {
    type: 'level',
    value: 25,
    operator: 'gte'
  },
  
  ACHIEVEMENT_MASTER: {
    type: 'achievement',
    value: 'nutrition_master',
    operator: 'eq'
  },
  
  QUEST_COMPLETION: {
    type: 'quest',
    value: 'ocean_explorer',
    operator: 'eq'
  },
  
  STREAK_30_DAYS: {
    type: 'streak',
    value: 30,
    operator: 'gte'
  },
  
  SCORE_10000: {
    type: 'score',
    value: 10000,
    operator: 'gte'
  }
};
```

## Gift System

### Gift Types
```typescript
const GIFT_TYPES = {
  COINS: {
    id: 'coin_gift',
    name: 'Coin Gift',
    description: 'Send coins to friends',
    type: 'currency',
    minAmount: 10,
    maxAmount: 1000,
    cost: 0, // Free to send
    cooldown: 24 // hours
  },
  
  XP_BOOST: {
    id: 'xp_boost',
    name: 'XP Boost',
    description: 'Temporary XP multiplier',
    type: 'boost',
    duration: 60, // minutes
    multiplier: 1.5,
    cost: 100, // coins
    cooldown: 48 // hours
  },
  
  PREMIUM_RECIPE: {
    id: 'premium_recipe',
    name: 'Premium Recipe',
    description: 'Share a premium recipe',
    type: 'content',
    cost: 50, // coins
    cooldown: 72 // hours
  },
  
  ACHIEVEMENT_BADGE: {
    id: 'achievement_badge',
    name: 'Achievement Badge',
    description: 'Share your achievement',
    type: 'social',
    cost: 0, // Free
    cooldown: 12 // hours
  }
};
```

### Gift System Implementation
```typescript
export class GiftService {
  static async sendGift(
    senderId: string,
    recipientId: string,
    giftType: string,
    amount?: number
  ): Promise<GiftResult> {
    // Validate gift sending
    const validation = await this.validateGiftSending(senderId, recipientId, giftType);
    if (!validation.valid) {
      throw new Error(validation.reason);
    }
    
    // Check cooldown
    const cooldown = await this.checkGiftCooldown(senderId, giftType);
    if (cooldown > 0) {
      throw new Error(`Gift cooldown active. Try again in ${cooldown} hours.`);
    }
    
    // Process gift
    const gift = await this.createGift(senderId, recipientId, giftType, amount);
    
    // Apply gift effects
    await this.applyGiftEffects(gift);
    
    // Update cooldown
    await this.updateGiftCooldown(senderId, giftType);
    
    // Send notification
    await this.notifyGiftReceived(recipientId, gift);
    
    return {
      success: true,
      giftId: gift.id,
      message: 'Gift sent successfully!'
    };
  }
  
  static async receiveGift(
    userId: string,
    giftId: string
  ): Promise<GiftResult> {
    const gift = await this.getGift(giftId);
    
    if (gift.recipientId !== userId) {
      throw new Error('Unauthorized gift access');
    }
    
    if (gift.status !== 'pending') {
      throw new Error('Gift already processed');
    }
    
    // Apply gift rewards
    await this.applyGiftRewards(gift);
    
    // Mark gift as received
    await this.markGiftReceived(giftId);
    
    return {
      success: true,
      message: 'Gift received successfully!'
    };
  }
}
```

## Reward Analytics

### Usage Tracking
```typescript
interface RewardAnalytics {
  totalRewardsGiven: number;
  rewardsByType: Record<string, number>;
  rewardsByRarity: Record<RewardRarity, number>;
  userSatisfaction: number;
  redemptionRate: number;
  averageTimeToRedemption: number;
  popularRewards: string[];
  seasonalTrends: Record<string, number>;
}

export class RewardAnalyticsService {
  static async trackRewardUsage(
    userId: string,
    rewardId: string,
    action: 'earned' | 'redeemed' | 'expired'
  ): Promise<void> {
    const event = {
      userId,
      rewardId,
      action,
      timestamp: new Date(),
      metadata: {
        userLevel: await this.getUserLevel(userId),
        rewardRarity: await this.getRewardRarity(rewardId),
        rewardType: await this.getRewardType(rewardId)
      }
    };
    
    await this.logRewardEvent(event);
    await this.updateRewardAnalytics(event);
  }
  
  static async getRewardAnalytics(
    timeRange: 'day' | 'week' | 'month' | 'year'
  ): Promise<RewardAnalytics> {
    const startDate = this.getTimeRangeStart(timeRange);
    const endDate = new Date();
    
    const events = await this.getRewardEvents(startDate, endDate);
    
    return {
      totalRewardsGiven: events.filter(e => e.action === 'earned').length,
      rewardsByType: this.groupByType(events),
      rewardsByRarity: this.groupByRarity(events),
      userSatisfaction: await this.calculateSatisfaction(events),
      redemptionRate: this.calculateRedemptionRate(events),
      averageTimeToRedemption: this.calculateAverageRedemptionTime(events),
      popularRewards: this.getPopularRewards(events),
      seasonalTrends: this.getSeasonalTrends(events)
    };
  }
}
```

## UI Components

### Reward Display
```typescript
interface RewardCardProps {
  reward: Reward;
  onRedeem?: (rewardId: string) => void;
  showRarity?: boolean;
  showExpiration?: boolean;
}

const RewardCard: React.FC<RewardCardProps> = ({
  reward,
  onRedeem,
  showRarity = true,
  showExpiration = true
}) => {
  const rarityConfig = RARITY_CONFIG[reward.rarity];
  
  return (
    <div 
      className={`reward-card ${reward.rarity}`}
      style={{
        borderColor: rarityConfig.borderColor,
        boxShadow: `0 0 20px ${rarityConfig.glowColor}40`
      }}
    >
      <div className="reward-header">
        <h3 className="reward-name">{reward.name}</h3>
        {showRarity && (
          <span 
            className="reward-rarity"
            style={{ color: rarityConfig.color }}
          >
            {reward.rarity.toUpperCase()}
          </span>
        )}
      </div>
      
      <div className="reward-content">
        <p className="reward-description">{reward.description}</p>
        
        <div className="reward-value">
          {reward.value.xp && (
            <span className="xp-value">+{reward.value.xp} XP</span>
          )}
          {reward.value.coins && (
            <span className="coin-value">+{reward.value.coins} 🪙</span>
          )}
        </div>
        
        {showExpiration && reward.expiration && (
          <div className="reward-expiration">
            <Clock className="w-4 h-4" />
            <span>Expires in {reward.expiration} days</span>
          </div>
        )}
      </div>
      
      {onRedeem && (
        <button 
          className="redeem-button"
          onClick={() => onRedeem(reward.id)}
        >
          Redeem
        </button>
      )}
    </div>
  );
};
```

### Reward Notification
```typescript
const RewardNotification: React.FC<{ reward: Reward }> = ({ reward }) => {
  const rarityConfig = RARITY_CONFIG[reward.rarity];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.8 }}
      className="reward-notification"
      style={{
        borderColor: rarityConfig.borderColor,
        boxShadow: `0 0 30px ${rarityConfig.glowColor}60`
      }}
    >
      <div className="notification-header">
        <div className="rarity-indicator" style={{ backgroundColor: rarityConfig.color }} />
        <h3>Reward Unlocked!</h3>
      </div>
      
      <div className="notification-content">
        <h4>{reward.name}</h4>
        <p>{reward.description}</p>
        
        <div className="reward-effects">
          {reward.value.xp && (
            <div className="effect">
              <Star className="w-5 h-5" />
              <span>+{reward.value.xp} XP</span>
            </div>
          )}
          {reward.value.coins && (
            <div className="effect">
              <Coins className="w-5 h-5" />
              <span>+{reward.value.coins} Coins</span>
            </div>
          )}
        </div>
      </div>
      
      <button className="claim-button">
        Claim Reward
      </button>
    </motion.div>
  );
};
```

This comprehensive reward system provides engaging progression mechanics while maintaining balance and preventing exploitation through careful design and analytics tracking.
