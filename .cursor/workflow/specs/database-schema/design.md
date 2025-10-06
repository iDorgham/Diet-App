# Database Schema - Design

## Database Architecture

### Technology Stack
- **Primary Database**: PostgreSQL 14+ (ACID compliance, JSON support, full-text search)
- **Cache Layer**: Redis 7+ (session storage, real-time data, rate limiting)
- **Search Engine**: Elasticsearch 8+ (food search, user search, analytics)
- **File Storage**: AWS S3 (images, documents, backups)
- **Message Queue**: RabbitMQ (async processing, notifications)

### Database Design Principles
```sql
-- Naming Conventions
-- Tables: snake_case, plural
-- Columns: snake_case
-- Indexes: idx_table_column
-- Foreign Keys: fk_table_column
-- Primary Keys: id (UUID)
-- Timestamps: created_at, updated_at, deleted_at

-- Example Table Structure
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);
```

## Core Entity Schema

### User Management
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL
);

-- User profiles
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE,
    gender VARCHAR(20),
    height_cm INTEGER,
    weight_kg DECIMAL(5,2),
    activity_level VARCHAR(20),
    bio TEXT,
    location VARCHAR(100),
    timezone VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en',
    avatar_url VARCHAR(500),
    preferences JSONB DEFAULT '{}',
    privacy_settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User authentication tokens
CREATE TABLE user_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_type VARCHAR(20) NOT NULL, -- 'access', 'refresh', 'reset'
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Nutrition Tracking
```sql
-- Food items database
CREATE TABLE food_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    barcode VARCHAR(50) UNIQUE,
    category VARCHAR(100),
    subcategory VARCHAR(100),
    nutritional_info JSONB NOT NULL,
    serving_size JSONB NOT NULL,
    ingredients TEXT[],
    allergens TEXT[],
    certifications TEXT[],
    verified BOOLEAN DEFAULT FALSE,
    source VARCHAR(50), -- 'USDA', 'EDAMAM', 'SPOONACULAR', 'USER'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User nutrition goals
CREATE TABLE user_nutrition_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    daily_calories INTEGER,
    macronutrient_ratios JSONB, -- {protein: 25, carbs: 45, fat: 30}
    micronutrient_targets JSONB,
    dietary_restrictions TEXT[],
    health_goals TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Nutrition logs
CREATE TABLE nutrition_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    food_item_id UUID REFERENCES food_items(id),
    portion_size DECIMAL(8,2) NOT NULL,
    unit VARCHAR(20) NOT NULL, -- 'grams', 'cups', 'pieces', 'servings'
    meal_type VARCHAR(20), -- 'breakfast', 'lunch', 'dinner', 'snack'
    logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    nutritional_data JSONB, -- Calculated nutritional values
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily nutrition summaries
CREATE TABLE daily_nutrition_summaries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    total_calories INTEGER,
    macronutrient_breakdown JSONB,
    micronutrient_summary JSONB,
    goal_progress JSONB,
    nutrition_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);
```

### Gamification System
```sql
-- User progress tracking
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 1,
    current_xp INTEGER DEFAULT 0,
    total_xp INTEGER DEFAULT 0,
    coins INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    streak_type VARCHAR(50),
    last_activity TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Achievements
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50), -- 'MILESTONE', 'STREAK', 'PERFECTION', 'SOCIAL'
    requirements JSONB NOT NULL,
    rewards JSONB,
    rarity VARCHAR(20) DEFAULT 'COMMON', -- 'COMMON', 'RARE', 'EPIC', 'LEGENDARY'
    icon VARCHAR(100),
    category VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User achievements
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES achievements(id),
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress_data JSONB,
    UNIQUE(user_id, achievement_id)
);

-- Badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    rarity VARCHAR(20) DEFAULT 'COMMON',
    category VARCHAR(50),
    requirements JSONB,
    effects JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User badges
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID REFERENCES badges(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_equipped BOOLEAN DEFAULT FALSE,
    UNIQUE(user_id, badge_id)
);

-- Streaks
CREATE TABLE user_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    streak_type VARCHAR(50) NOT NULL,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity TIMESTAMP WITH TIME ZONE,
    bonus_multiplier DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, streak_type)
);
```

### Social Features
```sql
-- Friendships
CREATE TABLE friendships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'ACCEPTED', 'BLOCKED'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    accepted_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user1_id, user2_id),
    CHECK (user1_id != user2_id)
);

-- Friend requests
CREATE TABLE friend_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    from_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    to_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(20) DEFAULT 'PENDING',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    responded_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(from_user_id, to_user_id),
    CHECK (from_user_id != to_user_id)
);

-- Social posts
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type VARCHAR(50), -- 'achievement', 'progress', 'meal', 'general'
    media JSONB, -- Array of media attachments
    tags TEXT[],
    privacy VARCHAR(20) DEFAULT 'public', -- 'public', 'friends', 'private'
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Post likes
CREATE TABLE post_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Post comments
CREATE TABLE post_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES post_comments(id),
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Leaderboards
CREATE TABLE leaderboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL, -- 'daily_streak', 'weekly_xp', 'monthly_achievements'
    score DECIMAL(10,2) NOT NULL,
    rank INTEGER,
    time_range VARCHAR(20), -- 'daily', 'weekly', 'monthly', 'all_time'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category, time_range)
);
```

### Team Challenges
```sql
-- Team challenges
CREATE TABLE team_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    type VARCHAR(50), -- 'NUTRITION', 'EXERCISE', 'STREAK', 'SOCIAL'
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_team_size INTEGER DEFAULT 5,
    rewards JSONB,
    rules JSONB,
    status VARCHAR(20) DEFAULT 'UPCOMING', -- 'UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED'
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    challenge_id UUID REFERENCES team_challenges(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    leader_id UUID REFERENCES users(id),
    max_members INTEGER DEFAULT 5,
    current_members INTEGER DEFAULT 0,
    progress JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team memberships
CREATE TABLE team_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'MEMBER', -- 'LEADER', 'MEMBER'
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress JSONB DEFAULT '{}',
    UNIQUE(team_id, user_id)
);
```

### AI Coach System
```sql
-- AI chat conversations
CREATE TABLE ai_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200),
    context JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI chat messages
CREATE TABLE ai_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
    role VARCHAR(20) NOT NULL, -- 'user', 'assistant'
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI recommendations
CREATE TABLE ai_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50), -- 'meal', 'exercise', 'motivation', 'goal'
    content JSONB NOT NULL,
    context JSONB DEFAULT '{}',
    confidence_score DECIMAL(3,2),
    user_feedback JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User AI profiles
CREATE TABLE user_ai_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    behavior_patterns JSONB DEFAULT '{}',
    preference_weights JSONB DEFAULT '{}',
    learning_data JSONB DEFAULT '{}',
    adaptation_history JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Virtual Economy
```sql
-- Shop items
CREATE TABLE shop_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL, -- Price in coins
    category VARCHAR(100),
    rarity VARCHAR(20) DEFAULT 'COMMON',
    requirements JSONB, -- Level, achievements, etc.
    effects JSONB, -- What the item does
    is_active BOOLEAN DEFAULT TRUE,
    stock_limit INTEGER, -- NULL for unlimited
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User purchases
CREATE TABLE user_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES shop_items(id),
    purchase_price INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User inventory
CREATE TABLE user_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    item_id UUID REFERENCES shop_items(id),
    quantity INTEGER DEFAULT 1,
    is_equipped BOOLEAN DEFAULT FALSE,
    acquired_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_id)
);
```

## Indexes and Performance

### Primary Indexes
```sql
-- User indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);
CREATE INDEX idx_users_deleted_at ON users(deleted_at) WHERE deleted_at IS NULL;

-- Nutrition indexes
CREATE INDEX idx_nutrition_logs_user_date ON nutrition_logs(user_id, logged_at);
CREATE INDEX idx_nutrition_logs_meal_type ON nutrition_logs(meal_type);
CREATE INDEX idx_food_items_name ON food_items USING gin(to_tsvector('english', name));
CREATE INDEX idx_food_items_barcode ON food_items(barcode);
CREATE INDEX idx_food_items_category ON food_items(category);

-- Gamification indexes
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_leaderboards_category_rank ON leaderboards(category, rank);
CREATE INDEX idx_leaderboards_user_category ON leaderboards(user_id, category);

-- Social indexes
CREATE INDEX idx_friendships_user1 ON friendships(user1_id);
CREATE INDEX idx_friendships_user2 ON friendships(user2_id);
CREATE INDEX idx_posts_user_created ON posts(user_id, created_at);
CREATE INDEX idx_posts_created_at ON posts(created_at);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);

-- Team challenge indexes
CREATE INDEX idx_team_challenges_status ON team_challenges(status);
CREATE INDEX idx_team_challenges_dates ON team_challenges(start_date, end_date);
CREATE INDEX idx_team_memberships_user_id ON team_memberships(user_id);
CREATE INDEX idx_team_memberships_team_id ON team_memberships(team_id);
```

### Composite Indexes
```sql
-- Multi-column indexes for common queries
CREATE INDEX idx_nutrition_logs_user_meal_date ON nutrition_logs(user_id, meal_type, logged_at);
CREATE INDEX idx_user_achievements_user_unlocked ON user_achievements(user_id, unlocked_at);
CREATE INDEX idx_posts_privacy_created ON posts(privacy, created_at);
CREATE INDEX idx_leaderboards_category_time_rank ON leaderboards(category, time_range, rank);
```

## Data Partitioning

### Time-based Partitioning
```sql
-- Partition nutrition logs by month
CREATE TABLE nutrition_logs_y2024m01 PARTITION OF nutrition_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE nutrition_logs_y2024m02 PARTITION OF nutrition_logs
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Partition daily summaries by year
CREATE TABLE daily_nutrition_summaries_y2024 PARTITION OF daily_nutrition_summaries
    FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
```

### Hash Partitioning
```sql
-- Partition posts by user_id hash for better distribution
CREATE TABLE posts_partitioned (
    LIKE posts INCLUDING ALL
) PARTITION BY HASH (user_id);

CREATE TABLE posts_partition_0 PARTITION OF posts_partitioned
    FOR VALUES WITH (modulus 4, remainder 0);
```

## Data Backup and Recovery

### Backup Strategy
```sql
-- Automated backup script
-- Daily full backup
pg_dump -h localhost -U postgres -d dietgame --format=custom --compress=9 --file=/backups/dietgame_$(date +%Y%m%d).dump

-- Weekly incremental backup
pg_basebackup -h localhost -U postgres -D /backups/incremental_$(date +%Y%m%d) -Ft -z -P

-- Point-in-time recovery setup
-- Enable WAL archiving
archive_mode = on
archive_command = 'cp %p /backups/wal_archive/%f'
```

### Data Retention Policies
```sql
-- Soft delete old data
UPDATE nutrition_logs 
SET deleted_at = NOW() 
WHERE logged_at < NOW() - INTERVAL '2 years' 
AND deleted_at IS NULL;

-- Hard delete very old data
DELETE FROM nutrition_logs 
WHERE logged_at < NOW() - INTERVAL '5 years';

-- Archive old leaderboard data
INSERT INTO leaderboards_archive 
SELECT * FROM leaderboards 
WHERE updated_at < NOW() - INTERVAL '1 year';
```

## GDPR Compliance

### Data Anonymization
```sql
-- Anonymize user data for analytics
CREATE OR REPLACE FUNCTION anonymize_user_data(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE users 
    SET email = 'anonymized_' || user_uuid,
        username = 'user_' || substr(user_uuid::text, 1, 8)
    WHERE id = user_uuid;
    
    UPDATE user_profiles 
    SET first_name = 'Anonymous',
        last_name = 'User',
        bio = NULL,
        location = NULL
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Data export function
CREATE OR REPLACE FUNCTION export_user_data(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'user', (SELECT row_to_json(u) FROM users u WHERE id = user_uuid),
        'profile', (SELECT row_to_json(p) FROM user_profiles p WHERE user_id = user_uuid),
        'nutrition_logs', (SELECT jsonb_agg(row_to_json(nl)) FROM nutrition_logs nl WHERE user_id = user_uuid),
        'achievements', (SELECT jsonb_agg(row_to_json(ua)) FROM user_achievements ua WHERE user_id = user_uuid),
        'posts', (SELECT jsonb_agg(row_to_json(p)) FROM posts p WHERE user_id = user_uuid)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;
```

## Monitoring and Maintenance

### Database Monitoring
```sql
-- Query performance monitoring
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Monitor slow queries
SELECT query, calls, total_time, mean_time, rows
FROM pg_stat_statements 
WHERE mean_time > 1000 
ORDER BY mean_time DESC;

-- Monitor table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Monitor index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
ORDER BY idx_tup_read DESC;
```

### Maintenance Tasks
```sql
-- Regular maintenance script
-- Update statistics
ANALYZE;

-- Reindex large tables
REINDEX TABLE nutrition_logs;
REINDEX TABLE posts;

-- Vacuum and analyze
VACUUM ANALYZE;

-- Check for unused indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE idx_tup_read = 0 AND idx_tup_fetch = 0;
```

## Security Considerations

### Row Level Security
```sql
-- Enable RLS on sensitive tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY user_profile_policy ON user_profiles
    FOR ALL TO authenticated_users
    USING (user_id = current_user_id());

CREATE POLICY nutrition_logs_policy ON nutrition_logs
    FOR ALL TO authenticated_users
    USING (user_id = current_user_id());
```

### Data Encryption
```sql
-- Encrypt sensitive data
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt user email addresses
UPDATE users 
SET email = pgp_sym_encrypt(email, 'encryption_key');

-- Decrypt when needed
SELECT pgp_sym_decrypt(email, 'encryption_key') as email 
FROM users WHERE id = $1;
```
