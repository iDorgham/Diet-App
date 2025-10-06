import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { Heart, Star, Lock, CheckCircle, RefreshCw, XCircle, Loader, Dumbbell, Droplet, Gift, BookOpen, Home, ListChecks, ShoppingCart, Users, ClipboardList, TrendingUp, Wallet, Scale, Activity, MapPin, BatteryCharging, Coffee, Sun, Utensils, Eye, User, Zap, ChevronDown, MessageSquare, Globe, Clock, Filter, ChevronLeft, ChevronRight, Archive, LineChart, Phone, Link, Minus, Plus } from 'lucide-react';

// --- Global Variables (Provided by Canvas Environment) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// --- UTILITIES ---
const withRetry = async (fn, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            console.warn(`Attempt ${i + 1} failed. Retrying...`, error.message);
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
};

// --- XP & LEVELING LOGIC ---
const calculateXPForNextLevel = (level) => level * 100;

const checkAndApplyLevelUp = (currentProgress, xpGained, setMessage) => {
    let { level, currentXP, coins } = currentProgress;
    let leveledUp = false;
    let bonusCoins = 0;

    // Must define newXP before the loop starts
    let newXP = currentXP + xpGained;

    while (newXP >= calculateXPForNextLevel(level)) {
        const xpRequired = calculateXPForNextLevel(level);
        newXP -= xpRequired;
        level += 1;
        leveledUp = true;
        bonusCoins += 50;
        setMessage(`✨ Congratulations! You reached Level ${level}! (+${bonusCoins} Bonus Coins!)`);
    }

    return {
        level,
        currentXP: newXP,
        bonusCoins,
        leveledUp
    };
};

// --- CORE DATA & CONFIG ---
const CURRENCY_SYMBOL = 'LE'; // NEW GLOBAL CURRENCY
const RECIPE_COST = 20;
const REWARD_CYCLE_HOURS = 12; // 12 hours for the daily check-in
const RECIPES_PER_PAGE = 6;

// NEW utility function for hardness color
const getHardnessColor = (hardness) => {
    switch (hardness) {
        case 'Easy': return 'bg-green-500';
        case 'Medium': return 'bg-yellow-500';
        case 'Hard': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
};

// --- DUMMY PREFS OPTIONS (USED IN SETTINGS MANAGER) ---
const DUMMY_PREFS_OPTIONS = {
    BODY_TYPES: ['Ectomorph', 'Mesomorph', 'Endomorph'],
    DIET_OPTIONS: ['Keto Diet', 'Paleo Diet', 'Mediterranean', 'Vegan'],
    BLOOD_TYPES: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
    MARKET_LOCATIONS: ['Hurghada, Egypt', 'Cairo, Egypt', 'Alexandria, Egypt'],
    EXERCISE_GOALS: ['Muscle Gain', 'Fat Loss', 'Endurance']
};

const DUMMY_FOOD_PREFS = {
    PREFERRED_INGREDIENTS: ['Salmon', 'Avocado', 'Spinach', 'Almonds', 'Eggs'],
    IGNORED_INGREDIENTS: ['Pork', 'Shellfish', 'Dairy', 'Gluten', 'Sugar']
};


const ALL_RECIPES_DATA = [
    { id: 101, name: "Coconut Curry Chickpeas", mealType: "Dinner", prepTime: 20, rating: 4.7, image: "https://placehold.co/150x100/374151/E5E7EB?text=Curry", hardness: 'Easy', isInventoryAvailable: true },
    { id: 102, name: "High-Protein Oatmeal Jars", mealType: "Breakfast", prepTime: 10, rating: 4.9, image: "https://placehold.co/150x100/374151/E5E7EB?text=Oats", hardness: 'Easy', isInventoryAvailable: true },
    { id: 103, name: "Grilled Steak & Asparagus", mealType: "Dinner", prepTime: 25, rating: 4.5, image: "https://placehold.co/150x100/374151/E5E7EB?text=Steak", hardness: 'Medium', isInventoryAvailable: false },
    { id: 104, name: "Vegan Lentil Soup", mealType: "Lunch", prepTime: 40, rating: 4.2, image: "https://placehold.co/150x100/374151/E5E7EB?text=Soup", hardness: 'Medium', isInventoryAvailable: false },
    { id: 105, name: "Keto Fat Bombs (10x)", mealType: "Snack", prepTime: 15, rating: 4.8, image: "https://placehold.co/150x100/374151/E5E7EB?text=Fats", hardness: 'Easy', isInventoryAvailable: true },
    { id: 106, name: "Mediterranean Salmon & Veg", mealType: "Dinner", prepTime: 30, rating: 4.6, image: "https://placehold.co/150x100/374150/E5E7EB?text=Salmon", hardness: 'Medium', isInventoryAvailable: true },
    { id: 107, name: "Smoothie Bowl (Berry)", mealType: "Breakfast", prepTime: 5, rating: 4.9, image: "https://placehold.co/150x100/374151/E5E7EB?text=Berry", hardness: 'Easy', isInventoryAvailable: true },
    { id: 108, name: "Quick Chicken Wraps", mealType: "Lunch", prepTime: 15, rating: 4.4, image: "https://placehold.co/150x100/374151/E5E7EB?text=Wrap", hardness: 'Easy', isInventoryAvailable: false },
    { id: 109, name: "Overnight Chocolate Chia", mealType: "Breakfast", prepTime: 10, rating: 4.7, image: "https://placehold.co/150x100/374151/E5E7EB?text=Chia", hardness: 'Easy', isInventoryAvailable: true },
    { id: 110, name: "Spicy Shrimp Stir-fry", mealType: "Dinner", prepTime: 25, rating: 4.3, image: "https://placehold.co/150x100/374151/E5E7EB?text=Shrimp", hardness: 'Medium', isInventoryAvailable: true },
    { id: 111, name: "Tuna Salad Lettuce Cups", mealType: "Lunch", prepTime: 10, rating: 4.6, image: "https://placehold.co/150x100/374151/E5E7EB?text=Tuna", hardness: 'Easy', isInventoryAvailable: true },
    { id: 112, name: "Energy Bites (No-Bake)", mealType: "Snack", prepTime: 20, rating: 4.5, image: "https://placehold.co/150x100/374151/E5E7EB?text=Energy", hardness: 'Medium', isInventoryAvailable: false },
    { id: 113, name: "Baked Tofu with Peanut Sauce", mealType: "Dinner", prepTime: 35, rating: 4.8, image: "https://placehold.co/150x100/374151/E5E7EB?text=Tofu", hardness: 'Hard', isInventoryAvailable: false },
    { id: 114, name: "Egg Muffins (Batch Prep)", mealType: "Breakfast", prepTime: 30, rating: 4.4, image: "https://placehold.co/150x100/374151/E5E7EB?text=Muffin", hardness: 'Medium', isInventoryAvailable: true },
    { id: 115, name: "Chicken & Veggie Skewers", mealType: "Dinner", prepTime: 45, rating: 4.1, image: "https://placehold.co/150x100/374151/E5E7EB?text=Skewers", hardness: 'Hard', isInventoryAvailable: false },
    { id: 116, name: "Avocado Toast Upgrade", mealType: "Breakfast", prepTime: 10, rating: 4.0, image: "https://placehold.co/150x100/374151/E5E7EB?text=Toast", hardness: 'Easy', isInventoryAvailable: true },
    { id: 117, name: "Cauliflower Pizza Crust", mealType: "Dinner", prepTime: 50, rating: 4.5, image: "https://placehold.co/150x100/374151/E5E7EB?text=Pizza", hardness: 'Hard', isInventoryAvailable: false },
    { id: 118, name: "Simple Side Salad", mealType: "Lunch", prepTime: 5, rating: 3.9, image: "https://placehold.co/150x100/374151/E5E7EB?text=Salad", hardness: 'Easy', isInventoryAvailable: true },
];

const MEAL_TYPES = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'];
const PREP_TIME_FILTERS = ['All', 'Quick (<30 min)', 'Standard (>30 min)'];

const NAV_PAGES = [
    { id: 'Home', title: 'Home', icon: Home, position: 'left', iconOnly: true },
    { id: 'Coach', title: 'Coach', icon: MessageSquare, position: 'left' },
    { id: 'Tasks', title: 'Tasks', icon: ListChecks, position: 'left' },
    { id: 'Nutrition', title: 'Nutrition', icon: Utensils, position: 'left' }, 
    { id: 'Workouts', title: 'Workouts', icon: Dumbbell, position: 'left' }, 
    { id: 'Finance', title: 'Finance', icon: Wallet, position: 'left' },
    { id: 'Rewards', title: 'Rewards', icon: Star, position: 'right' },
    { id: 'Recipes', title: 'Recipes', icon: BookOpen, position: 'hidden' },
    { id: 'Shopping', title: 'Shopping List', icon: ShoppingCart, position: 'hidden' }, // TITLE CHANGED TO SHOPPING LIST
    { id: 'Inventory', title: 'Inventory', icon: Archive, position: 'hidden' }, 
];

const USER_MENU_ITEMS = [
    { id: 'Profile', title: 'Profile', icon: User, section: 'Account' },
    { id: 'AccountUpgrade', title: 'Account Upgrade', icon: Zap, section: 'Account' },
    { id: 'Privacy', title: 'Privacy', icon: Lock, section: 'Account' },
    { id: 'SignOut', title: 'Sign Out (Placeholder)', icon: XCircle, section: 'Account' },
    { id: 'DietType', title: 'Diet Type', icon: Droplet, section: 'Diet & Preferences' },
    { id: 'FoodPrefs', title: 'Food Preferences', icon: Heart, section: 'Diet & Preferences' },
    { id: 'Budget', title: 'Budget', icon: Wallet, section: 'Financial' },
    { id: 'Health', title: 'Health Metrics', icon: Activity, section: 'Health Data' },
    { id: 'ExerciseSettings', title: 'Workout Plan', icon: Dumbbell, section: 'Health Data' }, 
    { id: 'Reports', title: 'Progress Reports', icon: TrendingUp, section: 'Health Data' },
    { id: 'Media', title: 'Media (Body & Food Photos)', icon: Eye, section: 'Health Data' },
    { id: 'Goals', title: 'Goals & Targets', icon: ClipboardList, section: 'Game' },
    { id: 'ScoreBoard', title: 'Score Board', icon: TrendingUp, section: 'Game' },
];

const LEGAL_LINKS = [
    { name: "Terms of Service", id: "Terms" },
    { name: "Privacy Policy", id: "Privacy" },
];
const SUPPORT_LINKS = [
    { name: "Help & FAQ", id: "FAQ" },
    { name: "Contact Support", id: "Support" },
];
const LANGUAGES = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
];

// --- CORE TASK DATA ---
const getDailyTasks = () => ([
    { id: 1, name: "Meal: High-Protein Scramble", icon: Coffee, time: '7:30 AM', completed: true, type: 'Meal', scoreReward: 2, coinReward: 0, xpReward: 15 }, 
    { id: 2, name: "Meal: Lemon Herb Chicken Salad", icon: Sun, time: '1:00 PM', completed: false, type: 'Meal', scoreReward: 2, coinReward: 0, xpReward: 15 },
    { id: 3, name: "Complete Dinner Prep Shopping", icon: ShoppingCart, time: '3:00 PM', completed: false, type: 'Shopping', scoreReward: 3, coinReward: 0, xpReward: 20 },
    { id: 4, name: "Meal: Mediterranean Salmon Dinner", icon: Utensils, time: '7:00 PM', completed: false, type: 'Meal', scoreReward: 2, coinReward: 0, xpReward: 15 },
    { id: 5, name: "Cook: Overnight Oats Prep", icon: BookOpen, time: '8:30 PM', completed: false, type: 'Cooking', scoreReward: 5, coinReward: 1, xpReward: 30 }, 
]);

// --- Trello Style Task Data (Used for WEEKLY GOALS) ---
const DUMMY_PLANNING_TASKS = {
    'todo': [
        { id: 1, title: 'Finalize Next Week\'s Macros', details: 'Review performance report and adjust protein targets.', tag: 'Planning', icon: ClipboardList, xpReward: 5 },
        { id: 2, title: 'Batch Prep High-Fiber Snacks', details: 'Cook 2 dozen energy bites for quick snacks.', tag: 'Cooking', icon: Utensils, xpReward: 10 },
        { id: 3, title: 'Verify Gym Class Schedule', details: 'Check for morning HIIT classes on Tuesday and Thursday.', tag: 'Workouts', icon: Dumbbell, xpReward: 5 },
    ],
    'in-progress': [
        { id: 4, title: 'Complete Dinner Prep Shopping', details: 'Buy salmon, avocado, and spices from Market.', tag: 'Shopping', icon: ShoppingCart, xpReward: 15 },
    ],
    'done': [
        { id: 5, title: 'Set Up Monthly Budget', details: 'Allocate LE450 to food budget in settings.', tag: 'Financial', icon: Wallet, xpReward: 5 },
        { id: 6, title: 'Claim Onboarding Gift', details: 'Received 2000 Coins and 1000 XP.', tag: 'Rewards', icon: Gift, xpReward: 0 },
    ],
};

const DUMMY_MONTHLY_MILESTONES = [
    { id: 10, title: 'Hit Level 5 Milestone', icon: Zap, status: '85% Progress', color: 'text-indigo-600' },
    { id: 11, title: 'Reduce Eating Out', icon: Wallet, status: 'Completed', color: 'text-green-600' },
    { id: 12, title: 'Learn 5 New Keto Recipes', icon: BookOpen, status: '2/5 Completed', color: 'text-yellow-600' },
];

const COLUMN_TITLES = {
    'todo': { title: 'To Do', icon: ListChecks, color: 'border-red-400 bg-red-50/50' },
    'in-progress': { title: 'In Progress', icon: Loader, color: 'border-yellow-400 bg-yellow-50/50' },
    'done': { title: 'Completed', icon: CheckCircle, color: 'border-green-400 bg-green-50/50' },
};
// --- END Trello Style Task Data ---

// --- CUSTOM COMPONENTS (DEFINED BEFORE APP) ---

// SETTINGS MANAGER COMPONENT (NEW IMPLEMENTATION)
const SettingsManagerPage = ({ activePage, userProfile, updateProfileInDb, setMessage }) => {
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Initialize form data with current user profile when page changes
    useEffect(() => {
        setFormData(userProfile);
    }, [activePage, userProfile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleTagToggle = (key, value) => {
        const currentArray = formData[key] || [];
        const newArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value];
        
        setFormData(prev => ({ ...prev, [key]: newArray }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Structure data for saving: ensure numerical inputs are numbers if necessary (simplification for demo)
        const profileUpdates = {
            ...formData,
            age: parseInt(formData.age) || null,
            weight: parseFloat(formData.weight) || null,
            height: parseFloat(formData.height) || null,
        };

        // Call the DB function defined in App component
        await updateProfileInDb(profileUpdates, 'Profile updated successfully!', 'Error saving profile.');
        setIsLoading(false);
    };

    const renderForm = (page) => {
        const inputClasses = "w-full p-3 border border-indigo-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 text-gray-800";
        const labelClasses = "block text-sm font-medium text-gray-700 mb-1";
        
        switch (page) {
            case 'Profile':
                return (
                    <form onSubmit={handleSave} className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><User className='w-6 h-6 mr-3 text-indigo-600'/> Personal Details</h3>
                        
                        <div>
                            <label className={labelClasses} htmlFor="userName">Name</label>
                            <input type="text" id="userName" name="userName" value={formData.userName || ''} onChange={handleInputChange} className={inputClasses} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses} htmlFor="age">Age</label>
                                <input type="number" id="age" name="age" value={formData.age || ''} onChange={handleInputChange} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses} htmlFor="bodyType">Body Type</label>
                                <select id="bodyType" name="bodyType" value={formData.bodyType || DUMMY_PREFS_OPTIONS.BODY_TYPES[0]} onChange={handleInputChange} className={inputClasses}>
                                    {DUMMY_PREFS_OPTIONS.BODY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses} htmlFor="weight">Weight (lbs)</label>
                                <input type="number" id="weight" name="weight" value={formData.weight || ''} onChange={handleInputChange} className={inputClasses} />
                            </div>
                            <div>
                                <label className={labelClasses} htmlFor="height">Height (cm)</label>
                                <input type="number" id="height" name="height" value={formData.height || ''} onChange={handleInputChange} className={inputClasses} />
                            </div>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full px-4 py-3 bg-[#085492] text-white font-semibold rounded-lg hover:bg-[#1a64a3] transition duration-150">
                            {isLoading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                );
            case 'DietType':
                return (
                    <form onSubmit={handleSave} className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><Droplet className='w-6 h-6 mr-3 text-indigo-600'/> Diet & Location</h3>
                        
                        <div>
                            <label className={labelClasses} htmlFor="dietType">Diet Preference</label>
                            <select id="dietType" name="dietType" value={formData.dietType || DUMMY_PREFS_OPTIONS.DIET_OPTIONS[0]} onChange={handleInputChange} className={inputClasses}>
                                {DUMMY_PREFS_OPTIONS.DIET_OPTIONS.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClasses} htmlFor="bloodType">Blood Type</label>
                                <select id="bloodType" name="bloodType" value={formData.bloodType || DUMMY_PREFS_OPTIONS.BLOOD_TYPES[0]} onChange={handleInputChange} className={inputClasses}>
                                    {DUMMY_PREFS_OPTIONS.BLOOD_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelClasses} htmlFor="marketLocation">Market Location</label>
                                <select id="marketLocation" name="marketLocation" value={formData.marketLocation || DUMMY_PREFS_OPTIONS.MARKET_LOCATIONS[0]} onChange={handleInputChange} className={inputClasses}>
                                    {DUMMY_PREFS_OPTIONS.MARKET_LOCATIONS.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                            </div>
                        </div>
                        <button type="submit" disabled={isLoading} className="w-full px-4 py-3 bg-[#085492] text-white font-semibold rounded-lg hover:bg-[#1a64a3] transition duration-150">
                            {isLoading ? 'Saving...' : 'Save Diet Configuration'}
                        </button>
                    </form>
                );
            case 'FoodPrefs':
                const preferred = formData.preferredIngredients || [];
                const ignored = formData.ignoredIngredients || [];
                
                return (
                    <form onSubmit={handleSave} className="space-y-6">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center"><Heart className='w-6 h-6 mr-3 text-indigo-600'/> Food Preferences</h3>
                        
                        <div>
                            <label className={labelClasses} htmlFor="allergies">Known Allergies / Intolerances (Text Area)</label>
                            <textarea id="allergies" name="allergies" rows="3" value={formData.allergies || ''} onChange={handleInputChange} className={inputClasses} placeholder="e.g., Peanuts, Lactose, Gluten..." />
                        </div>
                        
                        <div className="border border-indigo-200 p-4 rounded-lg">
                            <label className={labelClasses}>Preferred Ingredients (Select Tags)</label>
                            <div className="flex flex-wrap gap-2">
                                {DUMMY_FOOD_PREFS.PREFERRED_INGREDIENTS.map(item => (
                                    <button 
                                        type="button"
                                        key={item} 
                                        onClick={() => handleTagToggle('preferredIngredients', item)}
                                        className={`px-3 py-1 text-sm font-semibold rounded-full transition ${preferred.includes(item) ? 'bg-[#71E6DE] text-gray-900 shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                    >
                                        {preferred.includes(item) ? <CheckCircle className='w-4 h-4 mr-1 inline'/> : <Plus className='w-4 h-4 mr-1 inline'/>}{item}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        <div className="border border-indigo-200 p-4 rounded-lg">
                            <label className={labelClasses}>Ingredients to Ignore (Select Tags)</label>
                            <div className="flex flex-wrap gap-2">
                                {DUMMY_FOOD_PREFS.IGNORED_INGREDIENTS.map(item => (
                                    <button 
                                        type="button"
                                        key={item} 
                                        onClick={() => handleTagToggle('ignoredIngredients', item)}
                                        className={`px-3 py-1 text-sm font-semibold rounded-full transition ${ignored.includes(item) ? 'bg-red-200 text-red-800 shadow-md' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                                    >
                                        {ignored.includes(item) ? <Minus className='w-4 h-4 mr-1 inline'/> : <XCircle className='w-4 h-4 mr-1 inline'/>}{item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button type="submit" disabled={isLoading} className="w-full px-4 py-3 bg-[#085492] text-white font-semibold rounded-lg hover:bg-[#1a64a3] transition duration-150">
                            {isLoading ? 'Saving...' : 'Save Preferences'}
                        </button>
                    </form>
                );
            default:
                return null;
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-2xl mx-auto">
            <div className="bg-white p-6 rounded-xl shadow-2xl border border-indigo-100">
                {renderForm(activePage)}
            </div>
        </div>
    );
};

// FOOTER COMPONENT
const Footer = ({ currentLanguage, setCurrentLanguage, setMessage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageChange = (lang) => {
        setCurrentLanguage(lang.code);
        setMessage(`🌍 Language switched to: ${lang.name}. (Placeholder)`);
        setIsOpen(false);
    };

    const handleLinkClick = (name) => {
        setMessage(`🔗 Navigating to: ${name}. (Placeholder link in demo)`);
    };
    
    return (
        <footer className="mt-12 border-t border-gray-200 py-4 text-sm text-gray-500">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-center md:justify-between items-center space-y-3 md:space-y-0">
                
                <p className="text-center md:text-left">
                    © {new Date().getFullYear()} Diet Planner Game. All rights reserved.
                </p>

                <div className="flex flex-wrap justify-center items-center space-x-4">
                    
                    {LEGAL_LINKS.map(link => (
                        <button key={link.id} onClick={() => handleLinkClick(link.name)} className="hover:text-indigo-600 transition">
                            {link.name}
                        </button>
                    ))}
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    
                    {SUPPORT_LINKS.map(link => (
                        <button key={link.id} onClick={() => handleLinkClick(link.name)} className="hover:text-indigo-600 transition">
                            {link.name}
                        </button>
                    ))}
                    <span className="text-gray-300 hidden sm:inline">|</span>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center space-x-1 hover:text-indigo-600 transition p-1 rounded-md"
                        >
                            <Globe className="w-4 h-4" strokeWidth={2} />
                            <span className="font-medium text-gray-700 hover:text-indigo-600 transition">{LANGUAGES.find(l => l.code === currentLanguage)?.name}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                        </button>
                        
                        {isOpen && (
                            <div className="absolute bottom-full mb-2 right-0 w-40 bg-white rounded-lg shadow-xl py-1 z-30 border border-gray-200">
                                {LANGUAGES.map(lang => (
                                    <button
                                        key={lang.code}
                                        onClick={() => handleLanguageChange(lang)}
                                        className={`w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 flex items-center ${currentLanguage === lang.code ? 'font-bold bg-indigo-50 text-indigo-600' : ''}`}
                                    >
                                        {lang.name}
                                        {currentLanguage === lang.code && <CheckCircle className="w-4 h-4 ml-auto text-indigo-500" strokeWidth={2} />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};


// USER DROPDOWN MENU COMPONENT
const UserDropdownMenu = ({ userName, handleMenuClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        // Use 'click' event to handle closing when clicking outside
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleMenu = (event) => {
        event.stopPropagation(); // Stop click event from bubbling up and closing immediately
        setIsOpen(!isOpen);
    };

    const groupedItems = USER_MENU_ITEMS.reduce((acc, item) => {
        if (!acc[item.section]) {
            acc[item.section] = [];
        }
        acc[item.section].push(item);
        return acc;
    }, {});

    return (
        <div className="relative z-20" ref={menuRef}>
            <button
                onClick={toggleMenu}
                // py-3 ensures vertical alignment with the HeaderStatusPanel padding
                className="flex items-center space-x-2 px-4 py-3 rounded-lg transition duration-150 hover:bg-indigo-700/50 text-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
                <div className="w-8 h-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-sm border-2 border-white">
                    {userName[0]}
                </div>
                {/* Display only the single name Yasser */}
                <span className="hidden sm:inline font-semibold text-sm">{userName.split(' ')[0]}</span> 
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-2 border border-gray-100 divide-y divide-gray-100" onClick={(e) => e.stopPropagation()}>
                    {Object.keys(groupedItems).map(section => (
                        <div key={section} className="py-2">
                            <p className="text-xs font-semibold text-gray-500 uppercase px-4 pt-1 pb-1">{section}</p>
                            {groupedItems[section].map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            handleMenuClick(item.id, item.title);
                                            setIsOpen(false);
                                        }}
                                        className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-150"
                                    >
                                        <Icon className="w-4 h-4 mr-3" strokeWidth={2} />
                                        {item.title}
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// HEADER STATUS PANEL COMPONENT
const HeaderStatusPanel = ({ currentDayTime, daysUntilNextPlan, dietType, nextCookingTime, nextWorkoutTime }) => {
    
    // Simplification for Header Text: Removing 'Diet Type' and trimming diet type
    const trimmedDietType = dietType.split(' ')[0];
    const timeColor = nextCookingTime.isPending ? (nextCookingTime.minutesRemaining < 30 ? 'text-yellow-400' : 'text-teal-400') : 'text-gray-400';
    
    // Status text simplification: removes 'remaining'
    const cookingTimeText = nextCookingTime.isPending 
        ? nextCookingTime.timeString
        : (nextCookingTime.isPast ? 'Now/Overdue' : 'All Done');

    // Workout time text
    const workoutTimeColor = nextWorkoutTime.isPending ? 'text-teal-400' : 'text-gray-400';
    const workoutTimeText = nextWorkoutTime.isPending ? nextWorkoutTime.timeString : 'Completed';

    return (
        // Adjusted padding for better fit and used flex-row for alignment
        <div className="hidden lg:flex items-start space-x-4 text-xs bg-indigo-900/50 p-2.5 rounded-lg border border-indigo-700/50">
            
            <div className="flex items-start text-indigo-200">
                <Clock className="w-4 h-4 mr-1.5 mt-[1px]" strokeWidth={1.5} />
                <div className="flex flex-col">
                    <p className="font-semibold">{currentDayTime.day}</p>
                    <p className="text-xs text-indigo-300/80">{currentDayTime.time}</p>
                </div>
            </div>

            <div className="flex items-start text-indigo-200 border-l border-indigo-500/50 pl-4">
                <Utensils className="w-4 h-4 mr-1.5 mt-[1px]" strokeWidth={1.5} />
                <div className="flex flex-col">
                    <p className="font-semibold">Diet Type:</p>
                    {/* UPDATED: Simplified Diet Type */}
                    <p className="text-xs text-indigo-300/80">{trimmedDietType}</p>
                </div>
            </div>

            {/* UPDATED: Simplified Cooking Alarm */}
            <div className="flex items-start border-l border-indigo-500/50 pl-4">
                <Coffee className={`w-4 h-4 mr-1.5 mt-[1px] ${timeColor}`} strokeWidth={1.5} />
                <div className="flex flex-col">
                    {/* UPDATED: Simplified Next Meal Title */}
                    <p className="font-semibold text-indigo-200">Next Meal:</p> 
                    {/* UPDATED: Simplified Time Format */}
                    <p className={`text-xs font-medium ${timeColor}`}>
                        {cookingTimeText}
                    </p>
                </div>
            </div>
            
            {/* UPDATED: Next Workout */}
             <div className="flex items-start border-l border-indigo-500/50 pl-4">
                <Dumbbell className={`w-4 h-4 mr-1.5 mt-[1px] ${workoutTimeColor}`} strokeWidth={1.5} />
                <div className="flex flex-col">
                    {/* RENAMED TO WORKOUT: */}
                    <p className="font-semibold text-indigo-200">Workout:</p>
                    <p className={`text-xs font-medium ${workoutTimeColor}`}>
                        {workoutTimeText}
                    </p>
                </div>
            </div>
            
            <div className="flex items-start text-indigo-200 border-l border-indigo-500/50 pl-4">
                <MessageSquare className="w-4 h-4 mr-1.5 mt-[1px]" strokeWidth={1.5} />
                <div className="flex flex-col">
                    <p className="font-semibold">Next Plan:</p>
                    <p className="text-xs text-indigo-300/80">in {daysUntilNextPlan} days</p>
                </div>
            </div>

        </div>
    );
};

// NEWS TICKER COMPONENT
const NEWS_TICKER_CSS = `
    @keyframes crawl {
      0% { transform: translateX(100%); }
      100% { transform: translateX(-100%); }
    }
    .ticker-wrap {
        overflow: hidden;
        white-space: nowrap;
        position: relative;
    }
    .ticker-content {
        display: inline-block;
        animation: crawl 240s linear infinite; /* Increased to 240s for very slow, readable crawl */
    }
    .news-item {
        font-size: 0.875rem; /* Reduced font size */
        font-weight: 700;
        vertical-align: middle; /* Ensure vertical alignment */
    }
`;

const NEWS_ITEMS = [
    { text: "🌟 REWARD ALERT: Daily Check-in Coins (+5) are now available on the Rewards tab!", icon: Star, color: "text-yellow-400" },
    { text: "🏋️ LEVEL UP: Your consistency has moved you to Mesomorph Level 2!", icon: Dumbbell, color: "text-teal-400" },
    { text: "📚 NEW PACK: The 'Power Breakfast' Recipe Pack is unlocked!", icon: BookOpen, color: "text-indigo-200" },
    { text: "🔥 EXERCISE PACK: New 'HIIT Master' Routine is available now!", icon: Zap, color: "text-red-400" },
    { text: "💧 STREAK BONUS: Hydration Goal reached 7 days in a row! Claim +7 Score Streak Bonus.", icon: Droplet, color: "text-sky-400" },
    { text: "🏆 TOP PERFORMER: Your Days Score is in the top 10% this month!", icon: TrendingUp, color: "text-yellow-400" },
    { text: `💰 BUDGET UPDATE: Weekly spending is ${CURRENCY_SYMBOL}15 under budget. Great saving!`, icon: Wallet, color: "text-teal-400" },
];

const NewsTicker = ({ items }) => {
    const tickerContent = useMemo(() => {
        const repeatedContent = [];
        for (let i = 0; i < 4; i++) {
            items.forEach((item, index) => {
                const Icon = item.icon;
                repeatedContent.push(
                    <span key={`${item.text}-${index}-${i}`} className="mx-10 news-item flex-shrink-0 inline-flex items-center">
                        <Icon className={`w-4 h-4 mr-3 ${item.color}`} strokeWidth={2} />
                        <span className={item.color}>{item.text}</span>
                    </span>
                );
            });
        }
        return repeatedContent;
    }, [items]);

    return (
        <div className="bg-[#085492] text-white rounded-xl shadow-xl mb-8 overflow-hidden">
            <style dangerouslySetInnerHTML={{ __html: NEWS_TICKER_CSS }} />
            {/* Reduced height to h-10 and ensured vertical centering with flex items-center */}
            <div className="ticker-wrap h-10 flex items-center p-0"> 
                <div className="ticker-content flex items-center h-full w-fit">
                    {tickerContent}
                </div>
            </div>
        </div>
    );
};

// XP LEVEL DASHBOARD COMPONENT
const LevelCardWithXP = ({ level, currentXP, bodyType }) => {
    const nextLevelXP = calculateXPForNextLevel(level);
    const xpPercent = (currentXP / nextLevelXP) * 100;
    
    return (
        <div className="bg-white p-5 rounded-xl shadow-lg border border-indigo-100 flex flex-col justify-between">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center">
                    <TrendingUp className="text-indigo-600 w-8 h-8 mr-4 flex-shrink-0" strokeWidth={1.5} />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Level</p>
                        <p className="text-2xl font-bold text-gray-900">{level}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-xs font-medium text-gray-500">Body Type</p>
                    <p className="text-base font-semibold text-gray-900">{bodyType}</p>
                </div>
            </div>
            
            <div className="mt-3">
                <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-700">XP: {currentXP}</span>
                    <span className="text-indigo-600">Next: {nextLevelXP} XP</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                        className="bg-[#39C4E3] h-2.5 rounded-full transition-all duration-500" // Sky Blue Accent
                        style={{ width: `${xpPercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

// DAYS CARD WITH STAR MILESTONES (NEW COMPONENT)
const DaysCardWithStars = ({ score }) => {
    const STAR_THRESHOLDS = [50, 250, 750, 2000, 5000]; 
    
    let stars = 0;
    if (score >= STAR_THRESHOLDS[0]) stars++;
    if (score >= STAR_THRESHOLDS[1]) stars++;
    if (score >= STAR_THRESHOLDS[2]) stars++;
    if (score >= STAR_THRESHOLDS[3]) stars++; 
    if (score >= STAR_THRESHOLDS[4]) stars++; 
    
    const isMaxLevel = stars >= STAR_THRESHOLDS.length;
    let nextStarThreshold = isMaxLevel ? null : STAR_THRESHOLDS[stars];
    let scoreRemaining = nextStarThreshold ? nextStarThreshold - score : 0;
    
    const starIcons = Array(STAR_THRESHOLDS.length).fill(null).map((_, index) => (
        <Star 
            key={index} 
            className={`w-5 h-5 transition-colors duration-300 ${
                index < stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`} 
            strokeWidth={1.5}
        />
    ));
    
    return (
        <div className="flex items-center bg-white p-5 rounded-xl shadow-lg border border-indigo-100">
            <Clock className="text-indigo-600 w-8 h-8 mr-4 flex-shrink-0" strokeWidth={1.5} />
            <div>
                <p className="text-sm font-medium text-gray-500">Days</p> 
                <p className="text-2xl font-bold text-gray-900">{score}</p>
                
                <div className="mt-2">
                    <div className="flex items-center space-x-1">
                        {starIcons}
                    </div>
                    {isMaxLevel ? (
                        <p className="text-xs text-green-600 font-semibold mt-1">
                            All Star Milestones Reached!
                        </p>
                    ) : (
                        <p className="text-xs text-gray-500 font-semibold mt-1">
                            {scoreRemaining} Score until next star!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

// HOME PAGE COMPONENT
const HomePage = ({ progress, userProfile, handleTaskCompletion, setMessage, isAnyTaskLoading, localCompletedTasks, setLocalCompletedTasks }) => {
    
    // Note: localCompletedTasks and setLocalCompletedTasks are now passed as props from AppContent.
    
    const dummyTodayPlan = useMemo(() => {
        // Apply local completions to the static data for rendering
        const tasks = getDailyTasks().map(task => ({
            ...task,
            completed: task.completed || localCompletedTasks.includes(task.id)
        }));
        
        return {
            summary: "Today's plan is built around your high-protein goals: start strong with a lean breakfast and stay fueled with Mediterranean-inspired meals and scheduled prep tasks.",
            tasks: tasks,
        };
    }, [localCompletedTasks]);

    const calculateCountdown = (taskTime) => {
        const now = new Date();
        const timeParts = taskTime.match(/(\d+):(\d+) (AM|PM)/);
        if (!timeParts) return 'Time Error';
        
        let hours = parseInt(timeParts[1], 10);
        const minutes = parseInt(timeParts[2], 10);
        const ampm = timeParts[3];

        if (ampm === 'PM' && hours !== 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;

        const nextTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

        if (nextTime < now) {
            return 'Completed/Overdue';
        }

        const diffMs = nextTime - now;
        const diffMins = Math.round(diffMs / (1000 * 60));

        if (diffMins > 60) {
            const h = Math.floor(diffMins / 60);
            const m = diffMins % 60;
            return `${h}h ${m}m remaining`;
        } else if (diffMins > 0) {
            return `${diffMins} min`;
        } else {
            return 'Starting Now';
        }
    };

    const handleTaskDone = (task) => {
        if (localCompletedTasks.includes(task.id)) {
            setMessage(`❌ Task "${task.name}" is already marked as done for the day.`);
            return;
        }

        setLocalCompletedTasks(prev => [...prev, task.id]);
        handleTaskCompletion(task.scoreReward, task.coinReward, task.xpReward, task.name);
    };

    const handleViewTask = (taskName) => {
        setMessage(`🔍 Viewing details for: "${taskName}". This would open the full plan/recipe.`);
    }

    // --- Dummy Data for Home Dashboard ---
    const dummyShoppingList = [
        "1 lb Boneless Chicken Breast",
        "2 Avocados",
        "1 bag Spinach",
        "1 dozen Eggs",
        "1 container Greek Yogurt (Plain)",
    ];
    
    const dummyShoppingMetrics = {
        itemsNo: 35,
        totalWeight: '12.5 kg',
        totalPrice: `1,250.00 ${CURRENCY_SYMBOL}`, // UPDATED CURRENCY
        protein: '450g',
        fats: '300g',
        calories: '12,500 Cal',
        carbs: '800g'
    };

    // UPDATED RECOMMENDED MARKETS (Hurghada, Egypt specific)
    const recommendedMarkets = [
        { name: "A10 Market", location: "El Kawthar Area", call: "065 345 xxxx", website: "a10market.com", reason: "Known for international imported goods and high-quality proteins." },
        { name: "Metro Market", location: "Hadaba Road, Near Senzo Mall", call: "065 350 xxxx", website: "metromarket.com", reason: "Good selection of fresh produce and budget-friendly household staples." },
        { name: "Spinneys Market", location: "El Mamsha Promenade", call: "065 366 xxxx", website: "spinneys.com", reason: "Premium options for organic and specialty diet products." },
    ];

    // Reusable component for displaying a single metric tile (used in Shopping Info)
    const MetricCard = ({ icon: Icon, label, value, unitColor = 'text-gray-900', bgColor = 'bg-indigo-50' }) => (
        <div className={`p-3 rounded-lg flex items-center space-x-3 ${bgColor} border border-indigo-200/50`}>
            <Icon className="w-6 h-6 text-indigo-600 flex-shrink-0" strokeWidth={1.5} />
            <div>
                <p className="text-xs font-medium text-gray-500">{label}</p>
                <p className={`text-lg font-bold ${unitColor}`}>{value}</p>
            </div>
        </div>
    );
    
    // Reusable component for the main Dashboard Cards (COMPACT UPDATE)
    const DashboardCard = ({ icon: Icon, label, value }) => (
        <div className="flex items-center bg-white p-5 rounded-xl shadow-lg border border-indigo-100">
            <Icon className="text-indigo-600 w-8 h-8 mr-4 flex-shrink-0" strokeWidth={1.5} />
            <div>
                <p className="text-sm font-medium text-gray-500">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );

    return (
        <div className="p-4 sm:p-6">
            {/* Dashboard Metrics (4-column grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                
                <DaysCardWithStars 
                    score={progress.score} 
                />
                
                <LevelCardWithXP
                    level={progress.level}
                    currentXP={progress.currentXP}
                    bodyType={userProfile.bodyType}
                    nextLevelXP={calculateXPForNextLevel(progress.level)}
                />
                
                <DashboardCard 
                    icon={Heart} 
                    label="Fitness Score" 
                    value={userProfile.weight} 
                />
                <DashboardCard 
                    icon={Star} 
                    label="Diet Coins" 
                    value={progress.coins} 
                />
            </div>

            <NewsTicker items={NEWS_ITEMS} />

            <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <ClipboardList className="w-6 h-6 mr-2 text-indigo-600" strokeWidth={1.5} /> Weekly Focus
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* 1. Today's Plan Tasks (Left Position, Title: "Today") */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                    <h4 className="font-semibold text-xl text-indigo-800 mb-4 flex items-center">
                        <ListChecks className="w-5 h-5 mr-2" strokeWidth={1.5} /> Today 
                    </h4>
                    
                    <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 mb-4">
                        <h5 className="font-semibold text-sm text-indigo-800 mb-1 flex items-center">
                             <Heart className="w-4 h-4 mr-1.5" strokeWidth={2} /> Daily Focus:
                        </h5>
                        <p className="text-gray-700 text-sm">{dummyTodayPlan.summary}</p>
                    </div>

                    <h5 className="font-semibold text-base text-gray-700 mb-2 flex items-center">
                        <ClipboardList className="w-5 h-5 mr-1.5 text-indigo-600" strokeWidth={1.5} /> Action Items
                    </h5>

                    <ul className="space-y-3">
                        {dummyTodayPlan.tasks.map((task, index) => {
                            const TaskIcon = task.icon;
                            const isDone = task.completed || localCompletedTasks.includes(task.id);
                            
                            const isNextTask = !isDone && index === dummyTodayPlan.tasks.findIndex(t => !(t.completed || localCompletedTasks.includes(t.id)));
                            const statusText = isDone ? 'Done' : calculateCountdown(task.time);

                            return (
                                <li key={task.id} className={`text-gray-700 text-sm p-3 rounded-lg transition duration-150 flex flex-col sm:flex-row justify-between items-start sm:items-center ${isDone ? 'bg-green-50/70 border border-green-200' : 'bg-indigo-50/50 border border-indigo-100 hover:bg-indigo-100'}`}>
                                    <div className="flex items-start space-x-3 w-full sm:w-1/2 mb-3 sm:mb-0">
                                        <TaskIcon className={`w-5 h-5 flex-shrink-0 mt-1 ${isDone ? 'text-green-600' : 'text-indigo-600'}`} strokeWidth={1.5} />
                                        <div>
                                            <p className={`font-semibold ${isDone ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{task.name}</p>
                                            <p className="text-xs text-gray-500">Scheduled: {task.time}</p>
                                            
                                            <div className="flex items-center space-x-2 mt-1">
                                                <span className={`flex items-center text-xs font-semibold ${isDone ? 'text-gray-400' : 'text-indigo-600'}`}>
                                                    <Heart className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
                                                    +{task.scoreReward} Score
                                                </span>
                                                {task.coinReward > 0 && (
                                                    <span className={`flex items-center text-xs font-semibold ${isDone ? 'text-gray-400' : 'text-yellow-600'}`}>
                                                        <Star className="w-3.5 h-3.5 mr-1 fill-yellow-500/80" strokeWidth={1.5} />
                                                        +{task.coinReward} Coin
                                                    </span>
                                                )}
                                                <span className={`flex items-center text-xs font-semibold ${isDone ? 'text-gray-400' : 'text-purple-600'}`}>
                                                    <TrendingUp className="w-3.5 h-3.5 mr-1" strokeWidth={2} />
                                                    +{task.xpReward} XP
                                                </span>
                                            </div>

                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 flex-wrap">
                                        
                                        {!isDone && isNextTask && statusText !== 'Completed/Overdue' && statusText !== 'Starting Now' && (
                                            <div className="flex items-center text-indigo-700 bg-indigo-200/50 px-2 py-0.5 rounded-full mr-2 shadow-sm text-xs font-medium">
                                                <Activity className="w-3.5 h-3.5 mr-1" strokeWidth={2.5} /> 
                                                <span>{statusText}</span>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => handleViewTask(task.name)}
                                            className="px-3 py-1 text-xs font-semibold rounded-md bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50 transition duration-150 flex items-center"
                                        >
                                            <Eye className='w-4 h-4 mr-1' strokeWidth={2} /> View
                                        </button>
                                        
                                        {isDone ? (
                                            <button
                                                disabled
                                                className="px-3 py-1 text-xs font-semibold rounded-md bg-green-500 text-white cursor-default flex items-center"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-1" strokeWidth={2} /> Completed
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleTaskDone(task)}
                                                disabled={isAnyTaskLoading}
                                                className="px-3 py-1 text-xs font-semibold rounded-md bg-[#085492] text-white hover:bg-[#1a64a3] transition duration-150 flex items-center shadow-md"
                                            >
                                                {isAnyTaskLoading ? <Loader className="animate-spin w-4 h-4" strokeWidth={2} /> : 'Done'}
                                            </button>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <p className="text-sm text-indigo-600 font-medium pt-4 border-t border-indigo-100 mt-4 cursor-pointer hover:underline text-center">
                        View Full Daily Plan and Task Manager
                    </p>
                </div>


                {/* 2. Shopping List Summary (Right Position, Title: "Shopping List") */}
                <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                    <h4 className="font-semibold text-xl text-indigo-800 mb-4 flex items-center">
                        <ShoppingCart className="w-5 h-5 mr-2" strokeWidth={1.5} /> Shopping List 
                    </h4>

                    <div className="grid grid-cols-2 gap-3 mb-6 border-b pb-4 border-indigo-100">
                        {/* Items No */}
                        <MetricCard icon={ListChecks} label="Items No" value={dummyShoppingMetrics.itemsNo} />
                        
                        {/* Total Price */}
                        <MetricCard icon={Wallet} label="Total Price" value={dummyShoppingMetrics.totalPrice} unitColor="text-green-600" bgColor="bg-green-50" />

                        {/* Total Weight */}
                        <MetricCard icon={Scale} label="Total Weight" value={dummyShoppingMetrics.totalWeight} />

                        {/* Total Calories (Nutrition Info) */}
                        <MetricCard icon={Activity} label="Total Calories" value={dummyShoppingMetrics.calories} />

                        {/* Total Protein */}
                        <MetricCard icon={Dumbbell} label="Total Protein" value={dummyShoppingMetrics.protein} />

                        {/* Total Fats */}
                        <MetricCard icon={BatteryCharging} label="Total Fats" value={dummyShoppingMetrics.fats} />
                        
                        {/* Total Carbs (More Nutrition Details) */}
                        <MetricCard icon={Heart} label="Total Carbs" value={dummyShoppingMetrics.carbs} />
                        
                        {/* Placeholder for expansion */}
                        <div className="col-span-1 p-3 rounded-lg flex items-center space-x-3 bg-gray-50 border border-gray-200">
                            <TrendingUp className="w-6 h-6 text-gray-400 flex-shrink-0" strokeWidth={1.5} />
                            <div>
                                <p className="text-xs font-medium text-gray-500">More Details</p>
                                <p className="text-sm font-medium text-indigo-600 cursor-pointer hover:underline">Full Nutrition Report</p>
                            </div>
                        </div>
                    </div>

                    <h5 className="font-semibold text-base text-gray-700 mb-2 flex items-center">
                        <MapPin className="w-5 h-5 mr-1.5 text-indigo-600" strokeWidth={1.5} /> Recommended Markets (Hurghada, Egypt)
                    </h5>
                    <ul className="space-y-3 mb-4">
                        {recommendedMarkets.map((market, index) => (
                            <li key={index} className="text-gray-600 text-sm flex flex-col p-3 rounded-md bg-gray-50 border border-gray-200">
                                <p className="font-bold text-gray-800 text-base mb-1 flex items-center">
                                    <CheckCircle className="w-4 h-4 mr-2 text-indigo-400 flex-shrink-0" strokeWidth={2} />
                                    {market.name}
                                </p>
                                <p className="text-sm text-gray-700 mb-2">{market.reason}</p>

                                <div className="flex flex-wrap space-x-4 text-xs font-medium text-gray-600 border-t pt-2 mt-2">
                                    <span className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-1 text-indigo-500" strokeWidth={2} /> 
                                        {market.location}
                                    </span>
                                    <span className="flex items-center">
                                        <Phone className="w-4 h-4 mr-1 text-indigo-500" strokeWidth={2} />
                                        {market.call}
                                    </span>
                                    <span className="flex items-center hover:text-indigo-600 cursor-pointer">
                                        <Link className="w-4 h-4 mr-1 text-indigo-500" strokeWidth={2} />
                                        {market.website}
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    
                    <h5 className="font-semibold text-base text-gray-700 mb-2 flex items-center border-t pt-4 border-indigo-100">
                        <ListChecks className="w-5 h-5 mr-1.5 text-indigo-600" strokeWidth={1.5} /> Key Items Summary
                    </h5>
                    <ul className="space-y-1">
                        {dummyShoppingList.map((item, index) => (
                            <li key={index} className="text-gray-700 text-sm flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-gray-300 flex-shrink-0" strokeWidth={2} /> 
                                {item}
                            </li>
                        ))}
                        <li className="text-sm text-indigo-600 font-medium pt-2 border-t border-indigo-100 mt-2 cursor-pointer hover:underline">
                            + 12 more items. Tap to view the full Shopping List page.
                        </li>
                    </ul>
                </div>
                
            </div>
        </div>
    );
};

// TRELLO STYLE TASKS PAGE
const TasksPage = ({ userId, setMessage, handleTaskCompletion, isAnyTaskLoading }) => {
    const [weeklyColumns, setWeeklyColumns] = useState(DUMMY_PLANNING_TASKS);
    
    // Daily Task data is static for this demo
    const dailyTasks = getDailyTasks();
    const completedDailyCount = dailyTasks.filter(t => t.completed).length;
    const totalDailyCount = dailyTasks.length;
    
    // Monthly Task data is static for this demo
    const monthlyTasks = DUMMY_MONTHLY_MILESTONES;
    const completedMonthlyCount = monthlyTasks.filter(t => t.status === 'Completed').length;
    const totalMonthlyCount = monthlyTasks.length;

    const moveTask = (task, fromColumn, toColumn) => {
        if(isAnyTaskLoading) {
             setMessage(`⚠️ Please wait for current operation to finish.`);
             return;
        }

        setWeeklyColumns(prevColumns => {
            const newColumns = { ...prevColumns };
            const taskIndex = newColumns[fromColumn].findIndex(t => t.id === task.id);
            
            if (taskIndex > -1) {
                const [taskToMove] = newColumns[fromColumn].splice(taskIndex, 1);
                
                // --- Reward Simulation ---
                if (toColumn === 'done') {
                    // Simulating a reward for completing a planning task
                    handleTaskCompletion(0, 0, taskToMove.xpReward || 5, `Planning Task: ${taskToMove.title}`); 
                } else {
                    setMessage(`➡️ Moved "${taskToMove.title}" to ${COLUMN_TITLES[toColumn].title}.`);
                }

                newColumns[toColumn] = [...newColumns[toColumn], taskToMove];
                return newColumns;
            }
            return prevColumns;
        });
    };

    const getNextColumn = (current) => {
        if (current === 'todo') return 'in-progress';
        if (current === 'in-progress') return 'done';
        return null; // Already done
    };
    
    const getPrevColumn = (current) => {
        if (current === 'done') return 'in-progress';
        if (current === 'in-progress') return 'todo';
        return null; 
    };

    // Helper for analysis summary
    const totalWeeklyTasks = Object.values(weeklyColumns).flat().length;
    const completedWeeklyTasks = weeklyColumns['done'].length;
    const weeklyAdherence = totalWeeklyTasks > 0 ? ((completedWeeklyTasks / totalWeeklyTasks) * 100).toFixed(0) : 0;
    
    return (
        <div className="p-4 sm:p-6">
            {/* REMOVED: Goal and Habit Tracker Title and Icon */}
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* --- LEFT COLUMN: Progress and Analysis Board --- */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#085492] text-white p-6 rounded-xl shadow-lg"> {/* Deep Indigo BG */}
                        <h3 className="text-xl font-bold mb-3 flex items-center">
                            <LineChart className="w-5 h-5 mr-2 text-indigo-200" strokeWidth={2} /> Progress Analysis
                        </h3>
                        
                        <div className="space-y-4">
                            <div className="bg-indigo-800/70 p-3 rounded-lg">
                                <p className="text-sm font-semibold mb-1 flex justify-between items-center">
                                    <span>Daily Habit Score</span>
                                    <span className={`text-base font-bold ${completedDailyCount === totalDailyCount ? 'text-green-300' : 'text-yellow-300'}`}>
                                        {completedDailyCount}/{totalDailyCount}
                                    </span>
                                </p>
                                <p className="text-xs text-indigo-300">Tracks meals, water, and quick logs.</p>
                            </div>
                            
                            <div className="bg-indigo-800/70 p-3 rounded-lg">
                                <p className="text-sm font-semibold mb-1 flex justify-between items-center">
                                    <span>Weekly Planning Adherence</span>
                                    <span className={`text-base font-bold ${weeklyAdherence > 80 ? 'text-green-300' : 'text-yellow-300'}`}>
                                        {weeklyAdherence}%
                                    </span>
                                </p>
                                <p className="text-xs text-indigo-300">Kanban task completion rate.</p>
                            </div>
                            
                            <div className="bg-indigo-800/70 p-3 rounded-lg">
                                <p className="text-sm font-semibold mb-1 flex justify-between items-center">
                                    <span>Monthly Milestones</span>
                                    <span className="text-base font-bold text-indigo-300">
                                        {completedMonthlyCount}/{totalMonthlyCount}
                                    </span>
                                </p>
                                <p className="text-xs text-indigo-300">Long-term goal achievement.</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Monthly Milestones */}
                    <div className="bg-white p-5 rounded-xl shadow-lg border border-indigo-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                            <Clock className="w-5 h-5 mr-2 text-indigo-600" strokeWidth={2} /> Monthly Milestones
                        </h3>
                        <ul className="space-y-3">
                            {monthlyTasks.map(task => {
                                const Icon = task.icon;
                                const isCompleted = task.status === 'Completed';
                                return (
                                    <li key={task.id} className="text-sm flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <Icon className={`w-4 h-4 ${task.color}`} strokeWidth={2} />
                                            <span className={`font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                {task.title}
                                            </span>
                                        </div>
                                        <span className={`text-xs font-semibold ${task.color}`}>{task.status}</span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* --- RIGHT COLUMNS: Weekly Kanban Tracker --- */}
                <div className="lg:col-span-3">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                        <ListChecks className="w-6 h-6 mr-2 text-indigo-600" strokeWidth={1.5} /> Diet Tasks (Kanban)
                    </h3>
                    <p className="text-gray-600 mb-6">These are your weekly preparation and administrative goals. Drag and drop style management.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Object.keys(weeklyColumns).map(columnKey => {
                            const columnInfo = COLUMN_TITLES[columnKey];
                            const tasks = weeklyColumns[columnKey];
                            const nextColumnKey = getNextColumn(columnKey);
                            const prevColumnKey = getPrevColumn(columnKey);
                            const ColumnIcon = columnInfo.icon;
                            
                            return (
                                <div key={columnKey} className={`p-4 rounded-xl shadow-xl border-t-4 ${columnInfo.color} min-h-[300px]`}>
                                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                                        <ColumnIcon className={`w-5 h-5 text-indigo-600`} strokeWidth={2} />
                                        <span>{columnInfo.title} ({tasks.length})</span>
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        {tasks.map(task => {
                                            const TagIcon = task.icon;
                                            return (
                                                <div key={task.id} className="bg-white p-4 rounded-lg shadow border border-gray-100 hover:shadow-md transition duration-150">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <p className="text-sm font-bold text-gray-900">{task.title}</p>
                                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 flex items-center">
                                                            <TagIcon className="w-3 h-3 mr-1" strokeWidth={2} /> {task.tag}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 mb-3">{task.details}</p>
                                                    
                                                    <div className="flex space-x-2">
                                                        {nextColumnKey && (
                                                            <button
                                                                onClick={() => moveTask(task, columnKey, nextColumnKey)}
                                                                disabled={isAnyTaskLoading}
                                                                className="px-3 py-1 text-xs font-semibold rounded-md bg-[#085492] text-white hover:bg-[#1a64a3] transition duration-150 flex items-center disabled:bg-gray-400"
                                                            >
                                                                {isAnyTaskLoading ? 'Loading...' : (nextColumnKey === 'done' ? 'Complete' : 'Next Step')}
                                                            </button>
                                                        )}
                                                        {prevColumnKey && (
                                                             <button
                                                                onClick={() => moveTask(task, columnKey, prevColumnKey)}
                                                                disabled={isAnyTaskLoading}
                                                                className="px-3 py-1 text-xs font-semibold rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-150 disabled:bg-gray-100"
                                                            >
                                                                Back
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {tasks.length === 0 && (
                                        <div className="text-center p-6 text-gray-400 text-sm">
                                            No tasks here! Time to start a new project.
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};


// CLAIMABLE REWARDS DROPDOWN COMPONENT
const ClaimableRewardsDropdown = ({ rewards, isAnyTaskLoading, handleClaimAction, setMessage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleMenu = (event) => {
        event.stopPropagation();
        setIsOpen(!isOpen);
    };

    const handleClaim = (reward) => {
        handleClaimAction(reward);
        if (rewards.length === 1) {
             setIsOpen(false);
        }
    };

    if (rewards.length === 0) {
        return (
            <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-center">
                <CheckCircle className="w-5 h-5 inline mr-2" strokeWidth={1.5} /> All daily rewards claimed!
            </div>
        );
    }
    
    return (
        <div className="relative z-10" ref={menuRef}>
            <button
                onClick={toggleMenu}
                disabled={isAnyTaskLoading}
                className="w-full px-6 py-3 font-semibold rounded-lg transition duration-150 ease-in-out shadow-lg 
                    bg-[#39C4E3] text-gray-900 hover:bg-[#59d4f3] transform hover:scale-[1.01] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center" // Sky Blue Button
            >
                {isAnyTaskLoading ? (
                    <Loader className="animate-spin inline mr-2 w-5 h-5" strokeWidth={1.5} />
                ) : (
                    <>
                        <Star className="w-5 h-5 mr-3 fill-current" strokeWidth={1.5} /> 
                        Claim {rewards.length} Pending Reward{rewards.length > 1 ? 's' : ''}
                    </>
                )}
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl py-2 border border-gray-200" onClick={(e) => e.stopPropagation()}>
                    <p className="text-xs font-semibold text-gray-500 uppercase px-4 pt-1 pb-1 border-b">Click to Claim Instantly</p>
                    {rewards.map((reward) => {
                        const Icon = reward.icon;
                        return (
                            <button
                                key={reward.id}
                                onClick={() => handleClaim(reward)}
                                disabled={isAnyTaskLoading}
                                className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition duration-150 disabled:opacity-70 disabled:cursor-wait"
                            >
                                <Icon className="w-4 h-4 mr-3 text-indigo-600" strokeWidth={2} />
                                <span>{reward.name}</span>
                                <span className="ml-auto text-xs font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                                    +{reward.coins}C / +{reward.score}S / +{reward.xp}XP
                                </span>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};


// REWARDS PAGE COMPONENT
const RewardsPage = ({ progress, isAnyTaskLoading, showAdminButton, handleOnboardingGift, handleUnlockRecipe, RECIPE_COST, setMessage, claimableRewards, handleClaimRewardFromBacklog }) => {
    
    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <Star className="w-7 h-7 mr-3 text-indigo-600" strokeWidth={1.5} /> Rewards & Progress
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                    <Heart className="text-indigo-600 w-10 h-10 mr-4" strokeWidth={1.5} />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Diet Score</p>
                        <p className="text-3xl font-bold text-gray-900">{progress.score}</p>
                        <p className="text-xs text-gray-400 mt-1">Adherence and progress metric.</p>
                    </div>
                </div>
                <div className="flex items-center bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                    <Star className="text-indigo-600 w-10 h-10 mr-4" strokeWidth={1.5} />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Diet Coins</p>
                        <p className="text-3xl font-bold text-gray-900">{progress.coins}</p>
                        <p className="text-xs text-gray-400 mt-1">Spend these to unlock content!</p>
                    </div>
                </div>
                <div className="flex items-center bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                    <BookOpen className="text-indigo-600 w-10 h-10 mr-4" strokeWidth={1.5} />
                    <div>
                        <p className="text-sm font-medium text-gray-500">Recipes Unlocked</p>
                        <p className="text-3xl font-bold text-gray-900">{progress.recipesUnlocked}</p>
                        <p className="text-xs text-gray-400 mt-1">Your premium cooking experience.</p>
                    </div>
                </div>
            </div>

            {showAdminButton && (
                <div className="p-4 mb-8 rounded-xl shadow-md bg-indigo-50 border border-indigo-300">
                    <h3 className="text-lg font-bold text-indigo-800 mb-2 flex items-center">
                        <Gift className="w-5 h-5 mr-2" strokeWidth={1.5} />
                        Onboarding Gift - Complete Your Profile
                    </h3>
                    <p className="text-indigo-700 mb-3 text-sm">
                        Thank you for completing your detailed profile! Claim your one-time reward to kickstart your progress.
                    </p>
                    <button
                        onClick={handleOnboardingGift}
                        disabled={isAnyTaskLoading}
                        className={`px-4 py-2 font-semibold rounded-lg transition duration-150 ease-in-out shadow-md 
                            ${!isAnyTaskLoading
                                ? 'bg-[#085492] text-white hover:bg-[#1a64a3]' // Deep Indigo Button
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {isAnyTaskLoading ? 'Claiming...' : `Claim Onboarding Gift (+2000 Coins, +200 Score, +1000 XP)`}
                    </button>
                </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow-2xl mb-8 border border-indigo-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Daily Rewards
                </h2>
                <p className="text-gray-600 mb-4">
                    Log your daily habits to earn XP, Score, and Coins. Rewards are listed below when available.
                </p>

                <ClaimableRewardsDropdown 
                    rewards={claimableRewards}
                    isAnyTaskLoading={isAnyTaskLoading}
                    handleClaimAction={handleClaimRewardFromBacklog}
                    setMessage={setMessage}
                />
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-2xl">
                <h3 className="text-xl font-semibold mb-2 flex items-center text-gray-700">
                    <Lock className="w-5 h-5 mr-2 text-indigo-600" strokeWidth={1.5} />
                    Premium Recipe Unlock (The Coin Shop)
                </h3>
                <p className="text-gray-600 mb-3">
                    Spend your hard-earned Diet Coins to unlock a highly-rated, exclusive recipe for advanced cooking experience.
                </p>
                <button
                    onClick={handleUnlockRecipe}
                    disabled={progress.coins < RECIPE_COST || isAnyTaskLoading}
                    className={`w-full sm:w-auto px-6 py-3 font-semibold rounded-lg transition duration-150 ease-in-out shadow-md 
                        ${progress.coins >= RECIPE_COST && !isAnyTaskLoading
                            ? 'bg-[#39C4E3] text-gray-900 hover:bg-[#59d4f3] transform hover:scale-[1.01]' // Sky Blue Button
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {isAnyTaskLoading ? (
                        <Loader className="animate-spin inline mr-2 w-5 h-5" strokeWidth={1.5} />
                    ) : (
                        `Unlock Recipe for ${RECIPE_COST} Coins`
                    )}
                </button>
                <p className="text-sm text-gray-500 mt-2">
                    Current Balance: {progress.coins} Coins | Recipes Owned: {progress.recipesUnlocked}
                </p>
            </div>
        </div>
    );
};

// RECIPES PAGE COMPONENT
const RecipesPage = ({ userId, progress }) => {
    
    const [currentPage, setCurrentPage] = useState(1);
    const [filterMealType, setFilterMealType] = useState('All');
    const [filterPrepTime, setFilterPrepTime] = useState('All');

    const filteredRecipes = useMemo(() => {
        return ALL_RECIPES_DATA.filter(recipe => {
            const mealMatch = filterMealType === 'All' || recipe.mealType === filterMealType;

            let timeMatch = true;
            if (filterPrepTime === 'Quick (<30 min)') {
                timeMatch = recipe.prepTime < 30;
            } else if (filterPrepTime === 'Standard (>30 min)') {
                timeMatch = recipe.prepTime >= 30;
            }

            return mealMatch && timeMatch;
        });
    }, [filterMealType, filterPrepTime]);

    const totalPages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);

    const paginatedRecipes = useMemo(() => {
        const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
        const endIndex = startIndex + RECIPES_PER_PAGE;
        return filteredRecipes.slice(startIndex, endIndex);
    }, [filteredRecipes, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterMealType, filterPrepTime]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 shadow-md">
                <h3 className="text-xl font-bold text-indigo-800 mb-2 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" strokeWidth={2} /> Your Recipe Collection ({ALL_RECIPES_DATA.length} Total)
                </h3>
                <p className="text-sm text-gray-700">Explore and filter your recipe collection. You currently own **{progress.recipesUnlocked}** premium recipes!</p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center my-6">
                <h4 className="text-base font-semibold text-indigo-800 flex items-center">
                    <Filter className="w-4 h-4 mr-2" strokeWidth={2} /> Filter Recipes
                </h4>
                
                <select
                    value={filterMealType}
                    onChange={(e) => setFilterMealType(e.target.value)}
                    className="w-full sm:w-auto p-2 border border-indigo-300 rounded-lg text-sm text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                >
                    {MEAL_TYPES.map(type => (
                        <option key={type} value={type}>{type} Meal</option> 
                    ))}
                </select>

                <select
                    value={filterPrepTime}
                    onChange={(e) => setFilterPrepTime(e.target.value)}
                    className="w-full sm:w-auto p-2 border border-indigo-300 rounded-lg text-sm text-gray-700 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                >
                    {PREP_TIME_FILTERS.map(time => (
                        <option key={time} value={time}>{time}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedRecipes.length > 0 ? (
                    paginatedRecipes.map(recipe => (
                        <div key={recipe.id} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transform hover:scale-[1.02] transition duration-200 cursor-pointer">
                            <img 
                                src={recipe.image} 
                                alt={recipe.name} 
                                className="w-full h-32 object-cover"
                                onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/150x100/A5B4FC/374151?text=${recipe.name.substring(0, 5)}` }} 
                            />
                            <div className="p-4">
                                
                                {/* Row 1: Meal Type & Hardness */}
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-medium text-white bg-indigo-500 px-2 py-0.5 rounded-full inline-block">
                                        {recipe.mealType}
                                    </span>
                                    <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${getHardnessColor(recipe.hardness)}`}>
                                        {recipe.hardness}
                                    </span>
                                </div>

                                <h4 className="text-lg font-bold text-gray-900 mb-2">{recipe.name}</h4>
                                
                                {/* Row 2: Prep Time & Rating */}
                                <div className="flex justify-between text-sm text-gray-500 border-t border-gray-100 pt-2">
                                    <span className="flex items-center font-medium">
                                        <Clock className="w-4 h-4 mr-1 text-indigo-500" /> {recipe.prepTime} min Prep
                                    </span>
                                    <span className="flex items-center">
                                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-500" /> {recipe.rating}
                                    </span>
                                </div>

                                {/* Row 3: Inventory Status (New) */}
                                <div className="mt-3 pt-2 border-t border-gray-100">
                                    {recipe.isInventoryAvailable ? (
                                        <span className="flex items-center text-sm font-semibold text-green-700">
                                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" strokeWidth={2} />
                                            Inventory Ready
                                        </span>
                                    ) : (
                                        <span className="flex items-center text-sm font-semibold text-red-700">
                                            <Archive className="w-4 h-4 mr-2 text-red-500" strokeWidth={2} />
                                            Needs Shopping
                                        </span>
                                    )}
                                </div>

                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center p-8 bg-gray-100 rounded-xl">
                        <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                        <p className="font-semibold text-gray-700">No recipes match your current filters.</p>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6 border-t pt-4 border-indigo-100">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className='w-4 h-4 mr-1' strokeWidth={2}/> Previous
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-full transition duration-150 
                                ${currentPage === page
                                    ? 'bg-[#085492] text-white shadow-md' // Deep Indigo Button
                                    : 'bg-white text-indigo-700 hover:bg-indigo-100'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                    
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-white border border-indigo-300 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                         Next <ChevronRight className='w-4 h-4 ml-1' strokeWidth={2}/>
                    </button>
                </div>
            )}
        </div>
    );
}

// INVENTORY PAGE (NEW COMPONENT)
const InventoryPage = ({ userId }) => {
    
    // Dummy Inventory Data
    const dummyInventory = [
        { name: 'Boneless Chicken Breast', quantity: '2 lbs', status: 'High', icon: Dumbbell, color: 'text-green-600' },
        { name: 'Greek Yogurt (Plain)', quantity: '1 container', status: 'Medium', icon: Heart, color: 'text-yellow-600' },
        { name: 'Fresh Spinach', quantity: '1/2 bag', status: 'Low', icon: Droplet, color: 'text-red-600' },
        { name: 'Canned Beans', quantity: '5 cans', status: 'High', icon: Utensils, color: 'text-green-600' },
        { name: 'Protein Powder (Vanilla)', quantity: 'Low', status: 'Low', icon: Zap, color: 'text-red-600' },
    ];

    const getStatusClasses = (status) => {
        switch (status) {
            case 'Low': return 'bg-red-100 text-red-800';
            case 'Medium': return 'bg-yellow-100 text-yellow-800';
            case 'High': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <Archive className="w-7 h-7 mr-3 text-indigo-600" strokeWidth={1.5} /> Kitchen Inventory
            </h2>
            <p className="text-gray-600 mb-6">Track the food items you currently have in stock. The AI coach uses this data to minimize waste and optimize your weekly shopping list.</p>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                <h3 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center border-b pb-3">
                    <ListChecks className="w-5 h-5 mr-2" strokeWidth={2} /> Current Stock Levels
                </h3>
                
                <ul className="space-y-4">
                    {dummyInventory.map((item, index) => {
                        const ItemIcon = item.icon;
                        return (
                            <li key={index} className="flex justify-between items-center p-3 rounded-lg border border-gray-100 bg-gray-50">
                                <div className="flex items-center space-x-3">
                                    <ItemIcon className={`w-6 h-6 ${item.color}`} strokeWidth={1.5} />
                                    <div>
                                        <p className="font-semibold text-gray-800">{item.name}</p>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${getStatusClasses(item.status)}`}>
                                    {item.status} Stock
                                </span>
                            </li>
                        );
                    })}
                </ul>

                <button className="mt-6 w-full px-4 py-2 bg-[#085492] text-white font-semibold rounded-lg hover:bg-[#1a64a3] transition duration-150 flex items-center justify-center">
                    <RefreshCw className="w-4 h-4 mr-2" strokeWidth={2} /> Update Inventory Stock
                </button>
            </div>
        </div>
    );
};


// NUTRITION PAGE HUB (UPDATED)
const NutritionPage = ({ userId, setActivePage }) => {
    return (
        <div className="space-y-6 p-4 sm:p-6">
            <div className="bg-[#085492] text-white p-6 rounded-xl shadow-xl"> {/* Deep Indigo BG */}
                <h3 className="text-3xl font-extrabold mb-2 flex items-center">
                    <Utensils className="w-7 h-7 mr-3 text-indigo-200" strokeWidth={1.5} /> Nutrition Hub
                </h3>
                <p className="text-indigo-200 text-lg">Manage your meal planning, recipe discovery, and weekly grocery procurement here.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 hover:shadow-2xl transition duration-200 cursor-pointer"
                    onClick={() => setActivePage('Recipes')}>
                    <BookOpen className="w-10 h-10 text-indigo-600 mb-3" strokeWidth={1.5} />
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Recipe Library</h4>
                    <p className="text-gray-600">Browse your unlocked recipes, filter by meal type, prep time, and find new meal inspiration.</p>
                    <button className="mt-4 text-indigo-600 font-semibold flex items-center">
                        Explore Recipes <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 hover:shadow-2xl transition duration-200 cursor-pointer"
                    onClick={() => setActivePage('Shopping')}>
                    <ShoppingCart className="w-10 h-10 text-indigo-600 mb-3" strokeWidth={1.5} />
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Shopping List</h4>
                    <p className="text-gray-600">View your auto-generated shopping list, check nutrition totals, and track your budget.</p>
                    <button className="mt-4 text-indigo-600 font-semibold flex items-center">
                        Go to Shopping List <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 hover:shadow-2xl transition duration-200 cursor-pointer"
                    onClick={() => setActivePage('Inventory')}>
                    <Archive className="w-10 h-10 text-indigo-600 mb-3" strokeWidth={1.5} />
                    <h4 className="text-xl font-bold text-gray-900 mb-1">Inventory Tracker</h4>
                    <p className="text-gray-600">Keep track of what's currently in your kitchen to reduce waste and optimize purchases.</p>
                    <button className="mt-4 text-indigo-600 font-semibold flex items-center">
                        Manage Inventory <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                </div>

            </div>

            <div className="p-4 bg-gray-100 rounded-xl text-center text-sm text-gray-600">
                <Heart className="w-4 h-4 inline mr-1 text-red-500" /> Remember to check your **Food Preferences** in the Avatar menu before planning!
            </div>
        </div>
    );
}

// DUMMY EXPENSE DATA FOR FINANCE PAGE
const DUMMY_EXPENSES = [
    { category: 'Groceries (In-App Plan)', spent: 2500, target: 3000, icon: ShoppingCart, color: 'text-indigo-600' },
    { category: 'Eating Out (Cheat Meals)', spent: 650, target: 500, icon: Coffee, color: 'text-red-600' },
    { category: 'Supplements/Vitamins', spent: 400, target: 500, icon: Zap, color: 'text-green-600' },
    { category: 'Meal Prep Containers', spent: 150, target: 150, icon: Utensils, color: 'text-gray-600' },
];

// FINANCE PAGE (NEW COMPONENT)
const FinancePage = ({ userId }) => {
    
    // Dummy Financial Data
    const currentMonthBudget = 4500; // Updated to be in LE range
    const currentMonthSpent = 3700; // Updated to be in LE range
    const remainingBudget = currentMonthBudget - currentMonthSpent;
    const weeklyAverage = currentMonthSpent / 3; // Assuming 3 weeks into the month

    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
                <Wallet className="w-7 h-7 mr-3 text-indigo-600" strokeWidth={1.5} /> Financial Dashboard
            </h2>
            <p className="text-gray-600 mb-6">Manage your food expenses, track your budget adherence, and see spending insights generated by the AI Coach.</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 text-center">
                    <p className="text-sm font-medium text-gray-500">Monthly Budget</p>
                    {/* UPDATED CURRENCY */}
                    <h4 className="text-3xl font-bold text-green-600 mt-1">{currentMonthBudget} {CURRENCY_SYMBOL}</h4>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 text-center">
                    <p className="text-sm font-medium text-gray-500">Spent YTD</p>
                    {/* UPDATED CURRENCY */}
                    <h4 className="text-3xl font-bold text-gray-900 mt-1">{currentMonthSpent} {CURRENCY_SYMBOL}</h4>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 text-center">
                    <p className="text-sm font-medium text-gray-500">Remaining Budget</p>
                    {/* UPDATED CURRENCY */}
                    <h4 className="text-3xl font-bold text-indigo-600 mt-1">{remainingBudget} {CURRENCY_SYMBOL}</h4>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                <h3 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center border-b pb-3">
                    <LineChart className="w-5 h-5 mr-2" strokeWidth={2} /> Spending Trends
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <p className="text-lg font-bold text-gray-800">Weekly Average</p>
                        {/* UPDATED CURRENCY */}
                        <p className="text-3xl font-bold text-gray-900">{weeklyAverage.toFixed(2)} {CURRENCY_SYMBOL}</p>
                        <p className={`text-sm ${weeklyAverage > 1500 ? 'text-red-500' : 'text-green-600'}`}>
                            {weeklyAverage > 1500 ? '📈 Above target average of 1500 LE' : '🎯 On track with budget target'}
                        </p>
                    </div>
                    <div>
                        <p className="text-lg font-bold text-gray-800">Top Expense Category</p>
                        <p className="text-3xl font-bold text-gray-900">Proteins</p>
                        <p className="text-sm text-gray-500">35% of total spend.</p>
                    </div>
                </div>
                
                <button className="mt-6 px-4 py-2 bg-[#085492] text-white font-semibold rounded-lg hover:bg-[#1a64a3] transition duration-150">
                    View Full Expense Report
                </button>
            </div>

            {/* --- NEW: MONTHLY SPENDING BREAKDOWN --- */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 mt-6">
                <h3 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center border-b pb-3">
                    <ClipboardList className="w-5 h-5 mr-2" strokeWidth={2} /> Monthly Spending Breakdown
                </h3>
                
                <ul className="space-y-4">
                    {DUMMY_EXPENSES.map((expense) => {
                        const ExpenseIcon = expense.icon;
                        const adherenceColor = expense.spent > expense.target ? 'text-red-600' : 'text-green-600';
                        const adherenceLabel = expense.spent > expense.target ? 'OVER BUDGET' : 'ON TRACK';
                        
                        // Calculate percentage of target spent
                        const spentPercent = Math.min(100, (expense.spent / expense.target) * 100);

                        return (
                            <li key={expense.category} className="p-3 rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center space-x-2">
                                        <ExpenseIcon className={`w-5 h-5 ${expense.color}`} strokeWidth={1.5} />
                                        <p className="font-semibold text-gray-800">{expense.category}</p>
                                    </div>
                                    <p className={`text-xs font-bold px-2 py-0.5 rounded-full ${expense.spent > expense.target ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {adherenceLabel}
                                    </p>
                                </div>
                                
                                <div className="flex justify-between text-sm text-gray-600 mb-2">
                                    <span className={adherenceColor}>{expense.spent} {CURRENCY_SYMBOL} Spent</span>
                                    <span>Target: {expense.target} {CURRENCY_SYMBOL}</span>
                                </div>
                                
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full transition-all duration-500 ${expense.spent > expense.target ? 'bg-red-500' : 'bg-indigo-500'}`} 
                                        style={{ width: `${spentPercent}%` }}
                                    />
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
            {/* --- END MONTHLY SPENDING BREAKDOWN --- */}
        </div>
    );
};


// GENERIC PLACEHOLDER PAGE
const PlaceholderPage = ({ title, icon: Icon, userId, progress }) => {
    
    const coachData = {
        summary: "Your weekly planning session with the AI Coach ensures your diet and fitness align perfectly with your progress, preferences, and goals.",
        nextMeeting: "Monday, 9:00 AM (Upcoming)",
        status: "Reviewing last week's adherence (87%) and generating customized plan.",
    };

    const taskData = {
        weeklyGoal: "Achieve 85%+ meal completion and cook three new unlocked recipes.",
        progress: "4/7 days fully logged",
        upcomingTasks: [
            { id: 1, name: "Plan all Sunday Meals", details: "Select recipes and finalize macros.", status: "Pending" },
            { id: 2, name: "Check Supplement Inventory", details: "Ensure Vitamin D and Omega-3 stock is sufficient.", status: "Pending" },
            { id: 3, name: "Schedule Meal Prep Time (Sunday)", details: "Block out 2 hours for cooking.", status: "Completed" },
        ]
    };

    const exerciseData = {
        focus: "Lower Body Strength & Active Recovery",
        progress: "2/4 scheduled workouts completed.",
        workouts: [
            { id: 1, name: "Leg Day (Heavy)", duration: "60 mins", status: "Completed", icon: Dumbbell },
            { id: 2, name: "Full Body HIIT", duration: "30 mins", status: "Pending", icon: Zap },
            { id: 3, name: "Yoga & Stretching", duration: "45 mins", status: "Completed", icon: Heart },
            { id: 4, name: "Upper Body Endurance", duration: "50 mins", status: "Pending", icon: Dumbbell },
        ]
    };

    const shoppingListData = [
        { item: "Spinach (Fresh)", category: "Produce", qty: "1 large bag", checked: false, icon: Heart },
        { item: "Salmon Fillets", category: "Meats/Fish", qty: "4 portions (6oz each)", checked: false, icon: Zap },
        { item: "Coconut Milk (Canned)", category: "Pantry", qty: "2 cans", checked: true, icon: Utensils },
        { item: "Protein Powder (Vanilla)", category: "Supplements", qty: "1 tub", checked: false, icon: Droplet },
        { item: "Canned Chickpeas", category: "Pantry", qty: "3 cans", checked: true, icon: Utensils },
        { item: "Greek Yogurt (Plain)", category: "Dairy", qty: "1 container", checked: false, icon: Heart },
    ];
    
    const renderContent = () => {
        switch (title) {
            case 'Coach':
                return (
                    <div className="space-y-6">
                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 shadow-md">
                            <h3 className="text-xl font-bold text-indigo-800 mb-2 flex items-center">
                                <MessageSquare className="w-5 h-5 mr-2" strokeWidth={2} /> Next AI Coaching Session
                            </h3>
                            <p className="text-gray-700 mb-3">{coachData.summary}</p>
                            <p className="text-lg font-semibold text-gray-900 flex items-center">
                                <Loader className="w-4 h-4 mr-2 animate-spin text-indigo-500" strokeWidth={2} />
                                Status: <span className="text-indigo-600 ml-1 font-bold">{coachData.status}</span>
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Upcoming Meeting: <span className="font-medium text-gray-800">{coachData.nextMeeting}</span>
                            </p>
                            <button className="mt-4 px-4 py-2 bg-[#085492] text-white font-semibold rounded-lg hover:bg-[#1a64a3] transition duration-150">
                                Start Planning Chat Now
                            </button>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
                             <h4 className="text-lg font-semibold text-gray-800 mb-2">Key Topics for Discussion</h4>
                             <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                                <li>Reviewing last week's goal adherence and identifying pain points.</li>
                                <li>Adjusting macro targets based on fitness score trends.</li>
                                <li>Incorporating new, unlocked recipes into the next plan.</li>
                             </ul>
                        </div>
                    </div>
                );
            case 'Workouts': 
                return (
                    <div className="space-y-6">
                         <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 shadow-md">
                            <h3 className="text-xl font-bold text-indigo-800 mb-2 flex items-center">
                                <Dumbbell className="w-5 h-5 mr-2" strokeWidth={2} /> Current Weekly Focus
                            </h3>
                            <p className="text-lg font-semibold text-gray-900 mb-3">{exerciseData.focus}</p>
                            <p className="text-sm text-gray-600">
                                <span className="font-bold text-indigo-700">{exerciseData.progress}</span> of 4 key sessions completed. Keep pushing!
                            </p>
                        </div>
                         <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
                             <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><ClipboardList className='w-5 h-5 mr-2'/> Scheduled Workouts</h4>
                             <ul className="space-y-3">
                                {exerciseData.workouts.map(workout => {
                                    const WorkoutIcon = workout.icon;
                                    return (
                                        <li key={workout.id} className={`p-3 rounded-lg flex justify-between items-center ${workout.status === 'Completed' ? 'bg-green-50' : 'bg-gray-50'}`}>
                                            <div className="flex items-center space-x-3">
                                                <WorkoutIcon className={`w-5 h-5 ${workout.status === 'Completed' ? 'text-green-600' : 'text-indigo-600'}`} strokeWidth={2} />
                                                <div>
                                                    <p className={`font-semibold ${workout.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>{workout.name}</p>
                                                    <p className="text-xs text-gray-500">{workout.duration}</p>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${workout.status === 'Completed' ? 'bg-green-200 text-green-800' : 'bg-indigo-200 text-indigo-800'}`}>
                                                {workout.status}
                                            </span>
                                        </li>
                                    );
                                })}
                             </ul>
                        </div>
                    </div>
                );
            case 'Shopping List': 
                return (
                    <div className="space-y-6">
                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 shadow-md">
                            <h3 className="text-xl font-bold text-indigo-800 mb-2 flex items-center">
                                <ShoppingCart className="w-5 h-5 mr-2" strokeWidth={2} /> Weekly Grocery List 
                            </h3>
                            <p className="text-sm text-gray-700">The full list generated by your AI Coach, optimized for minimal waste and cost-efficiency at **Metro Market**.</p>
                            
                            <div className="flex items-center mt-3 p-2 bg-indigo-200 rounded-lg text-indigo-800 font-semibold text-sm">
                                <MapPin className='w-4 h-4 mr-2' strokeWidth={2} />
                                Shopping Vendor Target: **Metro Market** (Hurghada, Egypt)
                            </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><ListChecks className='w-5 h-5 mr-2'/> Items to Purchase</h4>
                             <ul className="space-y-3">
                                {shoppingListData.map(item => (
                                    <li key={item.item} className={`p-3 rounded-lg flex justify-between items-center ${item.checked ? 'bg-green-50 line-through' : 'bg-gray-50'}`}>
                                            <div className="flex items-center space-x-3">
                                                <Heart className={`w-5 h-5 ${item.checked ? 'text-green-600' : 'text-indigo-600'}`} strokeWidth={2} />
                                                <div>
                                                    <p className={`font-semibold ${item.checked ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{item.item}</p>
                                                    <p className="text-xs text-gray-500">{item.category} | Qty: {item.qty}</p>
                                                </div>
                                            </div>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.checked ? 'bg-green-200 text-green-800' : 'bg-indigo-200 text-indigo-800'}`}>
                                                {item.checked ? 'In Cart' : 'To Buy'}
                                            </span>
                                        </li>
                                ))}
                             </ul>
                             <p className="text-sm text-indigo-600 font-medium pt-4 border-t border-indigo-100 mt-4 cursor-pointer hover:underline text-center">
                                Sync with Market Price Data
                            </p>
                        </div>
                    </div>
                );
            case 'Inventory':
                return <InventoryPage userId={userId} />;
            case 'Finance':
                return <FinancePage userId={userId} />;
            // --- NEW SETTINGS MANAGER PAGES RENDER HERE ---
            case 'Profile':
            case 'DietType':
            case 'FoodPrefs':
                // Handled by SettingsManagerPage, needs props passed from AppContent
                return null;
            // --- END NEW SETTINGS MANAGER PAGES ---
            case 'Budget':
                return (
                    <div className="space-y-6">
                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 shadow-md">
                            <h3 className="text-xl font-bold text-indigo-800 mb-2 flex items-center">
                                <Wallet className="w-5 h-5 mr-2" strokeWidth={2} /> Meal Plan Budgeting (Avatar Menu Access)
                            </h3>
                            <p className="text-sm text-gray-700">This configuration screen sets your monthly and weekly budget limits, accessible from the Avatar menu for financial management.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow border border-gray-100 text-center">
                                <p className="text-sm text-gray-500">Monthly Target</p>
                                <h4 className="text-2xl font-bold text-green-600">4,500 {CURRENCY_SYMBOL}</h4> 
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow border border-gray-100 text-center">
                                <p className="text-sm text-gray-500">Weekly Spent</p>
                                <h4 className="text-2xl font-bold text-gray-900">1,150 {CURRENCY_SYMBOL}</h4> 
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow border border-gray-100 text-center">
                                <p className="text-sm text-gray-500">Remaining Buffer</p>
                                <h4 className="text-2xl font-bold text-indigo-600">3,350 {CURRENCY_SYMBOL}</h4> 
                            </div>
                        </div>
                        <p className="text-sm text-indigo-600 font-medium pt-2 cursor-pointer hover:underline text-center">
                            Go to **Finance** page in the main navigation for the full dashboard.
                        </p>
                    </div>
                );
            case 'ExerciseSettings':
                return (
                    <div className="space-y-6">
                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 shadow-md">
                            <h3 className="text-xl font-bold text-indigo-800 mb-2 flex items-center">
                                <Dumbbell className="w-5 h-5 mr-2" strokeWidth={2} /> Workout Goal Configuration
                            </h3>
                            <p className="text-sm text-gray-700">Define your primary fitness goals, preferred exercise types, and weekly frequency to generate optimized workout routines.</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
                             <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Activity className='w-5 h-5 mr-2'/> Current Settings</h4>
                             <ul className="space-y-2 text-gray-700 text-sm">
                                <li>**Primary Goal:** Muscle Gain / Strength</li>
                                <li>**Frequency:** 4 days per week</li>
                                <li>**Preferred Types:** Weightlifting, HIIT, Yoga</li>
                                <li>**Integration:** Sync with External Fitness Tracker (ON)</li>
                             </ul>
                             <button className="mt-4 px-4 py-2 bg-[#085492] text-white font-semibold rounded-lg hover:bg-[#1a64a3] transition duration-150">
                                Update Exercise Profile
                            </button>
                        </div>
                    </div>
                );
            case 'Goals':
                return (
                    <div className="space-y-6">
                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 shadow-md">
                            <h3 className="text-xl font-bold text-indigo-800 mb-2 flex items-center">
                                <ClipboardList className="w-5 h-5 mr-2" strokeWidth={2} /> Long-Term Goals and Targets
                            </h3>
                            <p className="text-sm text-gray-700">Set clear, measurable goals for your Score, Weight, and Fitness Level. Track your progress against your milestones.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">Score Goal</h4>
                                <p className="text-3xl font-bold text-indigo-600">5,000</p>
                                <p className="text-sm text-gray-500">Current Progress: 3,500</p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
                                <h4 className="text-lg font-semibold text-gray-800 mb-2">Weight Goal</h4>
                                <p className="text-3xl font-bold text-indigo-600">165 lbs</p>
                                <p className="text-sm text-gray-500">Current: 175 lbs (Target loss: 10 lbs)</p>
                            </div>
                        </div>
                        <p className="text-sm text-indigo-600 font-medium pt-2 cursor-pointer hover:underline text-center">
                            Define New Goals & Milestones
                        </p>
                    </div>
                );
            case 'Reports':
                return (
                    <div className="space-y-6">
                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 shadow-md">
                            <h3 className="text-xl font-bold text-indigo-800 mb-2 flex items-center">
                                <TrendingUp className="w-5 h-5 mr-2" strokeWidth={2} /> Progress Reports and Analytics
                            </h3>
                            <p className="text-sm text-gray-700">View detailed analytics on your diet adherence, nutrient trends, and fitness score over time.</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
                             <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center"><Users className='w-5 h-5 mr-2'/> Key Weekly Insights</h4>
                             <ul className="space-y-2 text-gray-700 text-sm">
                                <li>**Diet Adherence:** 92% (Excellent)</li>
                                <li>**Protein Intake:** Consistently exceeded target by 15g/day.</li>
                                <li>**Top Earning Day:** Tuesday (+105 Score)</li>
                                <li>**Recommendation:** Increase carbohydrate intake slightly on workout days.</li>
                             </ul>
                        </div>
                    </div>
                );
            default:
                // Fallback for all other pages
                return (
                    <div className="p-8 text-center min-h-[400px] flex flex-col items-center justify-center bg-white rounded-xl shadow-lg m-4">
                        <Icon className="w-16 h-16 text-indigo-400 mb-4" strokeWidth={1.5} />
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">{title}</h2>
                        <p className="text-gray-600 mb-6">This is where the detailed content for **{title}** will go.</p>
                        <button className="px-6 py-3 bg-[#085492] text-white font-semibold rounded-lg hover:bg-[#1a64a3] transition duration-150">
                            Go Back Home
                        </button>
                    </div>
                );
        }
    };
    
    return renderContent();
};


// MAIN APPLICATION CONTENT WRAPPER
// This component now handles all rendering logic, using state passed from App.
const AppContent = ({ auth, db, userId, progress, setProgress, userProfile, setUserProfile, setActivePage, activePage, setMessage, message, handleTaskCompletion, updateProgressInDb, updateProfileInDb }) => {
    
    // FIX: Lifted localCompletedTasks state here to be accessible by the headerStatus useEffect
    const [localCompletedTasks, setLocalCompletedTasks] = useState([1, 5]); // Initial dummy tasks
    // FIX: ADDED MISSING HEADER STATUS STATE DEFINITION
    const [headerStatus, setHeaderStatus] = useState({
        currentDayTime: { day: 'Sat', time: '12:01 AM' },
        daysUntilNextPlan: 2,
        tasksInProgress: { count: 3 },
        nextCookingTime: { isPending: false, timeString: 'N/A', minutesRemaining: 999 }, // NEW
        nextWorkoutTime: { isPending: false, timeString: 'N/A' }, // NEW WORKOUT STATUS
    });
    
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isAnyTaskLoading, setIsAnyTaskLoading] = useState(false);
    const [currentLanguage, setCurrentLanguage] = useState('en');

    // --- Daily Reward Tracking State (pulled from Firestore) ---
    const [dailyCheckInTime, setDailyCheckInTime] = useState(0);
    const [lastExerciseLog, setLastExerciseLog] = useState(0);
    const [lastWaterLog, setLastWaterLog] = useState(0);
    
    // Flag to control one-time onboarding gift visibility
    const [showAdminButton, setShowAdminButton] = useState(false);


    // --- Firestore Initialization and Listener ---
    useEffect(() => {
        if (!auth || !db) return;

        const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/data`, 'progress');
        const profileDocRef = doc(db, `artifacts/${appId}/users/${userId}/data`, 'profile');

        const initializeUser = async () => {
            const progressSnap = await getDoc(userDocRef);
            const profileSnap = await getDoc(profileDocRef);

            const defaultProgress = {
                score: 10, coins: 2000, recipesUnlocked: 10, hasClaimedGift: false,
                level: 1, currentXP: 0,
                dailyCheckInTime: 0, lastExerciseLog: 0, lastWaterLog: 0
            };
            // UPDATED: Default user name to Yasser, added new profile fields
            const defaultProfile = {
                userName: 'Yasser', dietType: 'Keto Diet', bodyType: DUMMY_PREFS_OPTIONS.BODY_TYPES[1], weight: '175 lbs',
                age: 30, height: 180, bloodType: DUMMY_PREFS_OPTIONS.BLOOD_TYPES[0], 
                marketLocation: DUMMY_PREFS_OPTIONS.MARKET_LOCATIONS[0],
                allergies: 'None', preferredIngredients: DUMMY_FOOD_PREFS.PREFERRED_INGREDIENTS, 
                ignoredIngredients: DUMMY_FOOD_PREFS.IGNORED_INGREDIENTS,
            };

            // 1. Progress State Listener
            const unsubProgress = onSnapshot(userDocRef, (doc) => {
                const data = doc.data() || defaultProgress;
                
                setProgress({
                    score: data.score,
                    coins: data.coins,
                    recipesUnlocked: data.recipesUnlocked,
                    level: data.level,
                    currentXP: data.currentXP,
                });
                
                // Update local reward tracking state
                setDailyCheckInTime(data.dailyCheckInTime);
                setLastExerciseLog(data.lastExerciseLog);
                setLastWaterLog(data.lastWaterLog);
                setShowAdminButton(!data.hasClaimedGift); // Show if not claimed

                console.log("Firestore Progress Sync Success:", data);
            }, (error) => {
                console.error("Error listening to progress:", error);
                setMessage('❌ Error syncing real-time data from Firestore.');
            });

            // 2. Profile State Listener
            const unsubProfile = onSnapshot(profileDocRef, (doc) => {
                const data = doc.data() || defaultProfile;
                setUserProfile(data);
                console.log("Firestore Profile Sync Success:", data);
            }, (error) => {
                console.error("Error listening to profile:", error);
            });
            
            // Set initial state for new users if docs don't exist
            if (!progressSnap.exists()) {
                await setDoc(userDocRef, defaultProgress);
                setMessage('🥳 Welcome! Your initial progress has been set.');
            }
            if (!profileSnap.exists()) {
                // Set initial profile with all fields
                await setDoc(profileDocRef, defaultProfile);
            }
            
            setIsAuthReady(true);
            return () => {
                unsubProgress();
                unsubProfile();
            };

        };
        
        // This should only run once auth is confirmed
        initializeUser();

    }, [auth, db, userId, setProgress, setUserProfile]);

    // --- Time Tracking & Header Status (UPDATED FOR COOKING ALARM & WORKOUT) ---
    useEffect(() => {
        const updateTimeAndStatus = () => {
            const now = new Date();
            const dayOptions = { weekday: 'short' };
            const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

            const day = now.toLocaleDateString('en-US', dayOptions);
            const time = now.toLocaleTimeString('en-US', timeOptions);

            const allTasks = getDailyTasks();
            const completedTaskIds = allTasks.filter(t => t.completed || localCompletedTasks.includes(t.id)).map(t => t.id);

            // 1. Calculate Tasks Pending (used for task badge)
            const tasksPending = allTasks.length - completedTaskIds.length;

            // --- Cooking Alarm Logic ---
            let nextCookingTask = null;
            let minCookingDiffMs = Infinity;

            allTasks.forEach(task => {
                if ((task.type === 'Meal' || task.type === 'Cooking') && !completedTaskIds.includes(task.id)) {
                    const timeParts = task.time.match(/(\d+):(\d+) (AM|PM)/);
                    if (!timeParts) return;

                    let hours = parseInt(timeParts[1], 10);
                    const minutes = parseInt(timeParts[2], 10);
                    const ampm = timeParts[3];

                    if (ampm === 'PM' && hours !== 12) hours += 12;
                    if (ampm === 'AM' && hours === 12) hours = 0;

                    const taskTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
                    const diffMs = taskTime.getTime() - now.getTime();

                    if (diffMs > 0 && diffMs < minCookingDiffMs) {
                        minCookingDiffMs = diffMs;
                        nextCookingTask = taskTime;
                    }
                }
            });

            let cookingStatus = { isPending: false, timeString: 'N/A', minutesRemaining: 999, isPast: false };

            if (nextCookingTask) {
                const diffMins = Math.round(minCookingDiffMs / (1000 * 60));
                
                let timeString = '';
                if (diffMins > 60) {
                    const h = Math.floor(diffMins / 60);
                    const m = diffMins % 60;
                    timeString = `${h}h ${m}m`;
                } else if (diffMins > 0) {
                    // UPDATED: Removed "remaining" text from here
                    timeString = `${diffMins}m`; 
                } else {
                    cookingStatus.isPast = true;
                    timeString = 'Starting Now';
                }

                cookingStatus = {
                    isPending: true,
                    timeString: timeString,
                    minutesRemaining: diffMins,
                    isPast: cookingStatus.isPast
                };
            } else if (tasksPending === 0) {
                 cookingStatus = { isPending: false, timeString: 'All Done', minutesRemaining: 0 };
            } else {
                cookingStatus = { isPending: false, timeString: 'N/A', minutesRemaining: 999 };
            }

            // --- Next Workout Logic (DUMMY DATA) ---
            // Simulating next workout at 5:00 PM today if it's before that time
            const nextWorkoutTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 17, 0, 0); // 5:00 PM
            const diffWorkoutMs = nextWorkoutTime.getTime() - now.getTime();
            let workoutStatus = { isPending: false, timeString: 'N/A' };

            if (diffWorkoutMs > 0) {
                const diffMins = Math.round(diffWorkoutMs / (1000 * 60));
                let timeString = '';
                if (diffMins > 60) {
                    const h = Math.floor(diffMins / 60);
                    const m = diffMins % 60;
                    timeString = `in ${h}h ${m}m`;
                } else if (diffMins > 0) {
                    timeString = `${diffMins}m`; // UPDATED: Simplified time format
                } else {
                    timeString = 'Starting Now';
                }
                workoutStatus = { isPending: true, timeString: timeString };
            } else {
                workoutStatus = { isPending: false, timeString: 'Completed' };
            }


            // 3. Calculate days until next Monday (Planning Day)
            const today = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
            const targetDay = 1; // Monday
            let daysUntil = (targetDay - today + 7) % 7;
            if (daysUntil === 0) daysUntil = 7;

            // setHeaderStatus is now defined via useState
            setHeaderStatus(prev => ({
                ...prev,
                currentDayTime: { day, time },
                daysUntilNextPlan: daysUntil,
                tasksInProgress: { count: tasksPending },
                nextCookingTime: cookingStatus, // UPDATED
                nextWorkoutTime: workoutStatus, // NEW
            }));
        };

        updateTimeAndStatus();
        const intervalId = setInterval(updateTimeAndStatus, 5000); // Check every 5 seconds for precision
        return () => clearInterval(intervalId);
    }, [localCompletedTasks]); 
    // --- End Time Tracking & Header Status ---


    // --- REWARD LOGIC ---
    const calculateClaimableRewards = useCallback(() => {
        const rewards = [];
        const now = Date.now();
        const twelveHoursInMs = REWARD_CYCLE_HOURS * 60 * 60 * 1000;
        const oneDayInMs = 24 * 60 * 60 * 1000;
        
        const isNewDay = (lastTime) => (now - lastTime) >= oneDayInMs;
        const isTwelveHoursPassed = (lastTime) => (now - lastTime) >= twelveHoursInMs;

        // 1. Daily Check-in (12 hour cycle)
        if (isTwelveHoursPassed(dailyCheckInTime)) {
            rewards.push({
                id: 'dailyCheckIn',
                name: 'Daily Progress Check-in',
                icon: RefreshCw,
                coins: 5, score: 5, xp: 20
            });
        }
        
        // 2. Log Exercise (24 hour cycle)
        if (isNewDay(lastExerciseLog)) {
            rewards.push({
                id: 'logExercise',
                name: 'Log Workout Session',
                icon: Dumbbell,
                coins: 10, score: 10, xp: 40
            });
        }

        // 3. Log Water Intake (24 hour cycle)
        if (isNewDay(lastWaterLog)) {
            rewards.push({
                id: 'logWater',
                name: 'Meet Hydration Goal',
                icon: Droplet,
                coins: 5, score: 5, xp: 15
            });
        }
        
        return rewards;
    }, [dailyCheckInTime, lastExerciseLog, lastWaterLog]);
    
    const claimableRewards = useMemo(() => calculateClaimableRewards(), [calculateClaimableRewards]);
    const rewardCount = claimableRewards.length;

    // --- REWARD HANDLERS (Passed down from App, but defined here to access state/context) ---
    
    const handleClaimRewardFromBacklog = async (reward) => {
        let timestampUpdates = {};
        
        switch (reward.id) {
            case 'dailyCheckIn':
                timestampUpdates = { dailyCheckInTime: Date.now() };
                break;
            case 'logExercise':
                timestampUpdates = { lastExerciseLog: Date.now() };
                break;
            case 'logWater':
                timestampUpdates = { lastWaterLog: Date.now() };
                break;
            default:
                return;
        }

        const successMsg = `🎁 Claimed ${reward.name}! (+${reward.coins} Coins, +${reward.score} Score, +${reward.xp} XP)`;
        const errorMsg = `Error claiming ${reward.name} reward.`;
        
        // Use the function passed from App
        await updateProgressInDb({ 
            coinGain: reward.coins, 
            scoreGain: reward.score, 
            xpGain: reward.xp,
            timestampUpdates
        }, successMsg, errorMsg);
    };

    const handleOnboardingGift = async () => {
        if (!db || !userId) return setMessage('❌ Authentication not ready.');
        setIsAnyTaskLoading(true);
        const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/data`, 'progress');

        try {
            await withRetry(async () => {
                const snap = await getDoc(userDocRef);
                const currentData = snap.data() || {};
                
                if (currentData.hasClaimedGift) {
                    setMessage('❌ Onboarding Gift already claimed!');
                    return;
                }

                const xpGained = 1000;
                const scoreGain = 200;
                const coinGain = 2000;
                
                const { level, currentXP, bonusCoins } = checkAndApplyLevelUp({
                    level: currentData.level || 1,
                    currentXP: currentData.currentXP || 0,
                    coins: currentData.coins || 0
                }, xpGained, setMessage);

                const newUpdates = {
                    hasClaimedGift: true,
                    score: (currentData.score || 0) + scoreGain,
                    coins: (currentData.coins || 0) + coinGain + bonusCoins,
                    level: level,
                    currentXP: currentXP,
                };
                
                await setDoc(userDocRef, newUpdates, { merge: true });
                setShowAdminButton(false);
                setMessage('⭐ ONBOARDING COMPLETE! You received 2000 Coins, 200 Score, and 1000 XP!');
            });
        } catch (error) {
            console.error("Error claiming onboarding gift:", error);
            setMessage('❌ Error claiming onboarding gift.');
        } finally {
            setIsAnyTaskLoading(false);
        }
    };

    const handleUnlockRecipe = async () => {
        if (progress.coins < RECIPE_COST) return setMessage('❌ Not enough coins to unlock a recipe.');
        
        const successMsg = `✅ Recipe unlocked! (-${RECIPE_COST} Coins). Enjoy cooking!`;
        const errorMsg = 'Error unlocking recipe.';
        
        await updateProgressInDb({
            coinGain: -RECIPE_COST,
            recipeGain: 1
        }, successMsg, errorMsg);
    };
    // --- END REWARD HANDLERS ---
    
    // --- PAGE RENDERING LOGIC ---
    const renderPage = () => {
        // We find page info here in AppContent where activePage is defined
        const pageId = NAV_PAGES.find(p => p.id === activePage);
        const PageIcon = pageId ? pageId.icon : Home;

        // Configuration pages are now rendered via SettingsManagerPage
        const settingsPages = ['Profile', 'DietType', 'FoodPrefs'];

        if (settingsPages.includes(activePage)) {
             return <SettingsManagerPage 
                activePage={activePage}
                userProfile={userProfile}
                updateProfileInDb={updateProfileInDb}
                setMessage={setMessage}
            />;
        }

        switch (activePage) {
            case 'Home':
                return <HomePage 
                    progress={progress} 
                    userProfile={userProfile} 
                    handleTaskCompletion={handleTaskCompletion} 
                    setMessage={setMessage}
                    isAnyTaskLoading={isAnyTaskLoading}
                    headerStatus={headerStatus}
                    localCompletedTasks={localCompletedTasks} // NEW PROP
                    setLocalCompletedTasks={setLocalCompletedTasks} // NEW PROP
                />;
            case 'Rewards':
                return <RewardsPage 
                    progress={progress} 
                    isAnyTaskLoading={isAnyTaskLoading}
                    showAdminButton={showAdminButton} 
                    handleOnboardingGift={handleOnboardingGift}
                    handleUnlockRecipe={handleUnlockRecipe}
                    RECIPE_COST={RECIPE_COST}
                    setMessage={setMessage}
                    claimableRewards={claimableRewards}
                    handleClaimRewardFromBacklog={handleClaimRewardFromBacklog}
                />;
            case 'Tasks':
                 return <TasksPage 
                    userId={userId} 
                    setMessage={setMessage} 
                    handleTaskCompletion={handleTaskCompletion}
                    isAnyTaskLoading={isAnyTaskLoading}
                />;
            case 'Nutrition':
                return <NutritionPage setActivePage={setActivePage} />;
            case 'Workouts': 
                return <PlaceholderPage title={'Workouts'} icon={Dumbbell} />;
            case 'Recipes':
                return <RecipesPage userId={userId} progress={progress} />;
            case 'Shopping':
                return <PlaceholderPage title={'Shopping List'} icon={ShoppingCart} />;
            case 'Inventory': // NEW: Inventory Page rendering
                return <InventoryPage userId={userId} />;
            case 'Finance': // NEW: Finance Page rendering
                return <FinancePage userId={userId} />;
            default:
                // Handles all Placeholder pages (Coach, and Avatar menu pages not handled by SettingsManagerPage)
                const pageInfo = NAV_PAGES.find(p => p.id === activePage) || USER_MENU_ITEMS.find(p => p.id === activePage);
                const pageTitle = pageInfo ? pageInfo.title : activePage; // Use activePage as fallback title
                const PageIcon = pageInfo ? pageInfo.icon : Home;

                return <PlaceholderPage 
                    title={pageTitle} 
                    icon={PageIcon} 
                    userId={userId}
                    progress={progress}
                />;
        }
    };
    // --- END PAGE RENDERING LOGIC ---


    // --- RENDERING THE APP WRAPPER (USED TO PASS HEADER STATUS) ---
    const leftNavPages = NAV_PAGES.filter(p => p.position === 'left');
    const rightNavPages = NAV_PAGES.filter(p => p.position === 'right');
    const pageData = NAV_PAGES.find(p => p.id === activePage) || NAV_PAGES[0];
    
    if (!isAuthReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader className="animate-spin w-8 h-8 text-indigo-600 mr-3" />
                <p className="text-gray-600 font-semibold">Connecting to Firebase...</p>
            </div>
        );
    }
    
    // Handler for all user menu clicks
    const handleUserMenuClick = (pageId, title) => {
        const page = NAV_PAGES.find(p => p.id === pageId);
        if (page) {
            setActivePage(page.id);
        } else {
            // Treat as a generic placeholder page for settings/profile items
            setActivePage(pageId); 
            setMessage(`⚙️ Navigated to: ${title}. (Configuration screen placeholder)`);
        }
    };


    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            <style>
                {NEWS_TICKER_CSS}
            </style>
            <div className="max-w-6xl mx-auto">
                <header className="bg-[#085492] shadow-md sticky top-0 z-10"> {/* Deep Indigo BG */}
                    <div className="p-4 flex items-center justify-between">
                        <h1 className="text-3xl font-extrabold text-white flex items-center">
                            <Users className="w-8 h-8 mr-2 text-indigo-200" strokeWidth={1.5}/>
                            Diet Planner Game
                        </h1>
                        
                        {/* Status Panel and Avatar Drop Menu (now grouped together on the right) */}
                        <div className="flex items-center space-x-2">
                            <HeaderStatusPanel 
                                currentDayTime={headerStatus.currentDayTime}
                                daysUntilNextPlan={headerStatus.daysUntilNextPlan}
                                dietType={userProfile.dietType}
                                nextCookingTime={headerStatus.nextCookingTime} 
                                nextWorkoutTime={headerStatus.nextWorkoutTime}
                            />
                            
                            {/* Avatar Drop Menu is now here, next to the status panel */}
                            <UserDropdownMenu 
                                userName={userProfile.userName} 
                                handleMenuClick={handleUserMenuClick} 
                            />
                        </div>
                    </div>

                    <nav className="bg-indigo-800 shadow-lg">
                        <div className="flex justify-between overflow-x-auto whitespace-nowrap"> 
                            
                            <div className="flex">
                                {leftNavPages.map((page) => {
                                    const Icon = page.icon;
                                    const isIconOnly = page.iconOnly;
                                    const customPadding = page.id === 'Home' ? 'px-[30px]' : 'px-4';
                                    
                                    const isTasksPage = page.id === 'Tasks';
                                    const tasksPending = headerStatus.tasksInProgress.count;
                                    const allTasksDone = tasksPending === 0;

                                    return (
                                        <button
                                            key={page.id}
                                            onClick={() => {
                                                setActivePage(page.id);
                                                setMessage('');
                                            }}
                                            className={`relative flex items-center py-3 text-sm font-semibold transition duration-200 ${customPadding}
                                                ${activePage === page.id
                                                    ? 'bg-indigo-900 text-white border-b-4 border-[#39C4E3]' // Sky Blue Border
                                                    : 'text-indigo-200 hover:bg-indigo-700 hover:text-white'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 ${isIconOnly ? '' : 'mr-2'}`} strokeWidth={1.5} />
                                            {!isIconOnly && page.title}
                                            
                                            {isTasksPage && (
                                                <span className={`ml-2 inline-flex items-center justify-center h-5 w-5 text-xs rounded-full font-bold text-white transition-colors duration-200
                                                    ${allTasksDone
                                                        ? 'bg-green-500 w-5 h-5'
                                                        : 'bg-red-500 w-5 h-5'
                                                    }`}
                                                >
                                                    {allTasksDone ? (
                                                        <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
                                                    ) : (
                                                        tasksPending
                                                    )}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="flex flex-shrink-0 items-center">
                                {rightNavPages.map((page) => {
                                    const Icon = page.icon;
                                    
                                    const isRewardReady = page.id === 'Rewards' && rewardCount > 0; 
                                    
                                    let buttonClasses = 'text-indigo-200 hover:bg-indigo-700 hover:text-white';
                                    
                                    if (activePage === page.id) {
                                        buttonClasses = 'bg-indigo-900 text-white border-b-4 border-[#39C4E3]'; // Sky Blue Border
                                    } 
                                    else if (isRewardReady) {
                                        buttonClasses = 'text-yellow-400 hover:bg-indigo-700/70 hover:text-yellow-300 animate-pulse'; 
                                    }
                                    
                                    return (
                                        <button
                                            key={page.id}
                                            onClick={() => {
                                                setActivePage(page.id);
                                                setMessage('');
                                            }}
                                            className={`relative flex items-center px-4 py-3 text-sm font-semibold transition duration-200 ${buttonClasses}`}
                                        >
                                            <Icon className="w-5 h-5 mr-2" strokeWidth={1.5} />
                                            {page.title}
                                            {isRewardReady && (
                                                <span className="ml-2 inline-flex items-center justify-center h-5 w-5 text-xs rounded-full bg-red-500 font-bold text-white">
                                                    {rewardCount}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}

                                {/* Removed UserDropdownMenu from here */}
                            </div>
                        </div>
                    </nav>
                </header>
                
                <main className="p-4">
                    {message && (
                        <div className={`p-4 mb-4 rounded-lg shadow-md ${message.startsWith('✅') || message.startsWith('🥳') || message.startsWith('🎁') || message.startsWith('⭐') || message.startsWith('⚙️') || message.startsWith('🏆') || message.startsWith('✨') ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : 'bg-red-100 border-l-4 border-red-500 text-red-700'}`}>
                            {message.startsWith('❌') ? <XCircle className="inline w-4 h-4 mr-2 text-red-500" strokeWidth={1.5} /> : <CheckCircle className="inline w-4 h-4 mr-2 text-green-500" strokeWidth={1.5} />}
                            <span className="font-semibold">{message}</span>
                        </div>
                    )}
                    {renderPage()}
                </main>

                <Footer 
                    currentLanguage={currentLanguage} 
                    setCurrentLanguage={setCurrentLanguage} 
                    setMessage={setMessage} 
                />
                
            </div>
        </div>
    );
};


// MAIN APP COMPONENT (MUST BE THE DEFAULT EXPORT)
const App = () => {
    // Firebase state
    const [db, setDb] = useState(null);
    const [auth, setAuth] = useState(null);
    const [userId, setUserId] = useState(null);
    
    // App state
    const [activePage, setActivePage] = useState('Home');
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState({ score: 0, coins: 0, recipesUnlocked: 0, level: 1, currentXP: 0 });
    // Initialize profile with ALL fields now expected by SettingsManager
    const [userProfile, setUserProfile] = useState({ 
        userName: 'Yasser', dietType: 'Keto Diet', bodyType: DUMMY_PREFS_OPTIONS.BODY_TYPES[1], weight: 175,
        age: 30, height: 180, bloodType: DUMMY_PREFS_OPTIONS.BLOOD_TYPES[0], 
        marketLocation: DUMMY_PREFS_OPTIONS.MARKET_LOCATIONS[0],
        allergies: 'None', preferredIngredients: DUMMY_FOOD_PREFS.PREFERRED_INGREDIENTS, 
        ignoredIngredients: DUMMY_FOOD_PREFS.IGNORED_INGREDIENTS,
    });

    // --- Transactional Update Functions ---
    
    // 1. Update Progress (Score, Coins, XP)
    const updateProgressInDb = useCallback(async (updates, successMsg, errorMsg) => {
        if (!db || !userId) return setMessage('❌ Authentication not ready.');
        
        const userDocRef = doc(db, `artifacts/${appId}/users/${userId}/data`, 'progress');
        
        try {
            await withRetry(async () => {
                const snap = await getDoc(userDocRef);
                const currentData = snap.data() || progress;
                
                const xpGained = updates.xpGain || 0;
                
                let newProgress = { ...currentData };
                
                // 1. XP and Level Logic
                let { level, currentXP, bonusCoins } = checkAndApplyLevelUp({
                    level: newProgress.level || 1,
                    currentXP: newProgress.currentXP || 0,
                    coins: newProgress.coins || 0
                }, xpGained, setMessage);
                
                newProgress.level = level;
                newProgress.currentXP = currentXP;
                
                // 2. Apply other updates
                const finalUpdates = {
                    score: (newProgress.score || 0) + (updates.scoreGain || 0),
                    coins: (newProgress.coins || 0) + (updates.coinGain || 0) + bonusCoins,
                    recipesUnlocked: (newProgress.recipesUnlocked || 0) + (updates.recipeGain || 0),
                    level: newProgress.level,
                    currentXP: newProgress.currentXP,
                    ...updates.timestampUpdates,
                };
                
                await setDoc(userDocRef, finalUpdates, { merge: true });
                setMessage(successMsg);
            });
        } catch (error) {
            console.error(errorMsg, error);
            setMessage(`❌ ${errorMsg}`);
        }
    }, [db, userId, progress]);
    
    // 2. Update Profile (Name, Diet Type, Prefs) - NEW
    const updateProfileInDb = useCallback(async (newProfileData, successMsg, errorMsg) => {
        if (!db || !userId) return setMessage('❌ Authentication not ready.');

        const profileDocRef = doc(db, `artifacts/${appId}/users/${userId}/data`, 'profile');
        
        try {
            await withRetry(async () => {
                // Update local state first to immediately refresh UI
                setUserProfile(newProfileData);
                
                // Persist to Firestore
                await setDoc(profileDocRef, newProfileData, { merge: true });
                setMessage(successMsg);
            });
        } catch (error) {
            console.error(errorMsg, error);
            setMessage(`❌ ${errorMsg}`);
        }
    }, [db, userId, setUserProfile]);


    // Pass a simplified wrapper to AppContent that triggers the DB update
    const handleTaskCompletion = useCallback((score, coins, xp, name) => {
        const successMsg = `✅ Task "${name}" completed! (+${score} Score, +${coins} Coin, +${xp} XP)`;
        const errorMsg = `Error claiming task reward for ${name}.`;
        // Use the centralized DB update function
        updateProgressInDb({ scoreGain: score, coinGain: coins, xpGain: xp }, successMsg, errorMsg);
    }, [updateProgressInDb]);

    // 1. Initialize Firebase and Authenticate
    useEffect(() => {
        const initializeFirebase = async () => {
            try {
                const app = initializeApp(firebaseConfig);
                const firestore = getFirestore(app);
                const firebaseAuth = getAuth(app);

                setDb(firestore);
                setAuth(firebaseAuth);

                // Sign in using the custom token provided by the environment
                if (initialAuthToken) {
                    await signInWithCustomToken(firebaseAuth, initialAuthToken);
                } else {
                    await signInAnonymously(firebaseAuth);
                }
            } catch (error) {
                console.error("Firebase initialization or sign-in failed:", error);
                setMessage(`❌ Failed to initialize application: ${error.message}`);
            }
        };

        initializeFirebase();
    }, []);

    // 2. Auth State Listener (Get User ID)
    useEffect(() => {
        if (!auth) return;

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                setUserId(null);
            }
        });

        return () => unsubscribe();
    }, [auth]);

    // Only render content when Firebase Auth and Firestore instances are ready
    if (!auth || !db || !userId) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader className="animate-spin w-8 h-8 text-indigo-600 mr-3" />
                <p className="text-gray-600 font-semibold">Connecting to Firebase...</p>
            </div>
        );
    }

    return (
        <AppContent 
            auth={auth} 
            db={db} 
            userId={userId} 
            activePage={activePage} 
            setActivePage={setActivePage}
            message={message}
            setMessage={setMessage}
            progress={progress}
            setProgress={setProgress}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            handleTaskCompletion={handleTaskCompletion}
            updateProgressInDb={updateProgressInDb} // Passed for use in reward claim handlers
            updateProfileInDb={updateProfileInDb} // NEW: Passed for settings manager
        />
    );
};

export default App;
