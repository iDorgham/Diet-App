# Firebase Setup Instructions

## Prerequisites
1. A Firebase project (create one at https://console.firebase.google.com/)
2. Firebase project with Firestore database enabled

## Setup Steps

### 1. Get Your Firebase Configuration
1. Go to your Firebase project console
2. Click on the gear icon (⚙️) next to "Project Overview"
3. Select "Project settings"
4. Scroll down to "Your apps" section
5. If you don't have a web app, click "Add app" and select the web icon (</>)
6. Register your app with a nickname (e.g., "diet-planner-game")
7. Copy the Firebase configuration object

### 2. Update the Configuration in App.jsx
Open `src/App.jsx` and find this section around line 10:

```javascript
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
    // Replace these with your actual Firebase project configuration
  apiKey: "AIzaSyBSHipn2djImGw4OPNWU06fBq4T_PCAST0",
  authDomain: "diet-planner-game.firebaseapp.com",
  projectId: "diet-planner-game",
  storageBucket: "diet-planner-game.firebasestorage.app",
  messagingSenderId: "803776250779",
  appId: "1:803776250779:web:0c6cda616b5c15d17c973e",
  measurementId: "G-TJ5PXEFCL9"
};
```

Replace the placeholder values with your actual Firebase configuration:

```javascript
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
    apiKey: "AIzaSyBSHipn2djImGw4OPNWU06fBq4T_PCAST0",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "diet-planner-game",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### 3. Enable Firestore Database
1. In your Firebase console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

### 4. Configure Authentication (Optional)
The app uses anonymous authentication by default, but you can enable other methods:
1. Go to "Authentication" in your Firebase console
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Anonymous" (already enabled by default)

### 5. Run the Application
```bash
npm run dev
```

The app should now connect to your Firebase project and work with real-time data persistence.

## Troubleshooting

### Common Issues:
1. **"Firebase: Error (auth/invalid-api-key)"**: Check that your API key is correct
2. **"Firebase: Error (auth/project-not-found)"**: Verify your project ID is correct
3. **"Firestore permission denied"**: Make sure Firestore is enabled and in test mode
4. **"Firebase: Error (auth/network-request-failed)"**: Check your internet connection

### Security Rules (For Production)
When you're ready to deploy, update your Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /artifacts/{appId}/users/{userId}/data/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Features That Require Firebase
- User progress tracking (score, coins, XP, level)
- User profile management
- Recipe unlocking system
- Daily rewards and check-ins
- Real-time data synchronization

Without Firebase, the app will show a loading screen indefinitely.
