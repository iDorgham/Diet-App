# Diet Planner Game

A comprehensive diet planning and tracking application built with React and Firebase. This app helps users manage their nutrition goals, track progress, and gamify their healthy eating journey.

## Features

- 🏠 **Dashboard**: Overview of daily tasks, progress metrics, and shopping lists
- 📋 **Task Management**: Kanban-style task tracking with rewards system
- 🍽️ **Recipe Library**: Browse and filter recipes by meal type and difficulty
- 🛒 **Shopping Lists**: Auto-generated grocery lists with nutrition tracking
- 📊 **Progress Tracking**: XP, levels, coins, and achievement system
- 🎁 **Rewards System**: Daily check-ins, exercise logging, and hydration tracking
- 💰 **Finance Dashboard**: Budget tracking and spending analysis
- 📦 **Inventory Management**: Track kitchen stock levels
- ⚙️ **Settings**: Comprehensive profile and preference management

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Firebase (Firestore, Authentication)
- **State Management**: React Hooks

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))

### Installation

1. **Clone and install dependencies:**
```bash
cd diet-planner-game
npm install
```

2. **Set up Firebase:**
   - Follow the detailed instructions in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Update the Firebase configuration in `src/App.jsx`

3. **Start the development server:**
```bash
npm run dev
```

4. **Open your browser:**
   - Navigate to `http://localhost:5173`
   - The app will connect to Firebase and initialize your user profile

## Project Structure

```
src/
├── App.jsx              # Main application component
├── App.css              # Global styles
├── main.jsx             # Application entry point
└── assets/              # Static assets
```

## Key Components

- **HomePage**: Dashboard with daily tasks and progress metrics
- **TasksPage**: Kanban-style task management
- **RecipesPage**: Recipe browsing and filtering
- **RewardsPage**: Daily rewards and progress tracking
- **SettingsManagerPage**: User profile and preferences
- **FinancePage**: Budget and spending analytics
- **InventoryPage**: Kitchen stock management

## Firebase Integration

The app uses Firebase for:
- **Authentication**: Anonymous user authentication
- **Firestore**: Real-time data persistence
- **User Data**: Progress tracking, profile management, and preferences

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

For production deployment, you can use environment variables:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.