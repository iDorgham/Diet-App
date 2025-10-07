# Firebase Testing Guide

This guide explains how to test Firebase connection and data persistence for the Diet Planner Game.

## 🚀 Quick Start

### Option 1: Browser Test Interface
1. Open `firebase-test.html` in your browser
2. Click "Run All Tests" to test everything
3. Or use individual test buttons for specific features

### Option 2: Command Line Testing
```bash
# Run all tests
node test-firebase.js --all

# Run specific tests
node test-firebase.js --connection --auth
node test-firebase.js --write --read
```

### Option 3: From the App
1. Start the app with `npm run dev`
2. If Firebase connection fails, you'll see a "Test Firebase Connection" button
3. Click it to run a quick connection test

### Option 4: Browser Console
Open browser console and run:
```javascript
// Run all integration tests
window.firebaseTests.runAll()

// Run quick connection test
window.firebaseTests.quick()

// Test specific feature
window.firebaseTests.test('auth')
```

## 📋 What Gets Tested

### 🔗 Connection Test
- Verifies Firebase app initialization
- Checks Auth and Firestore service connectivity
- Validates configuration

### 🔐 Authentication Test
- Tests anonymous user authentication
- Verifies user ID generation
- Checks authentication state management

### 📝 Write Test
- Tests writing data to Firestore
- Creates test documents
- Validates data structure

### 📖 Read Test
- Tests reading data from Firestore
- Retrieves previously written test data
- Validates data integrity

### 🔄 Real-time Sync Test
- Tests real-time data synchronization
- Sets up Firestore listeners
- Validates real-time updates

### 👤 Profile Persistence Test
- Tests user profile data persistence
- Writes and reads profile information
- Validates complex data structures

### 🎮 Game Progress Test
- Tests game progress data persistence
- Validates score, XP, and achievement storage
- Tests nested data structures

## 🛠️ Test Files Structure

```
diet-planner-game/
├── src/test/
│   ├── firebase-test-utils.js      # Core test utilities
│   ├── firebase-test-runner.js     # Interactive test runner
│   └── firebase-integration-test.js # Integration test functions
├── firebase-test.html              # Browser test interface
├── test-firebase.js                # Command line test script
└── FIREBASE_TESTING.md             # This guide
```

## 🔧 Test Configuration

The tests use the same Firebase configuration as the main app:
- **Project ID**: `diet-planner-game`
- **Database**: Firestore in test mode
- **Authentication**: Anonymous authentication
- **Data Path**: `artifacts/diet-planner-game/users/{userId}/data/`

## 📊 Understanding Test Results

### Success Indicators
- ✅ Green checkmarks indicate successful tests
- All tests should pass for proper Firebase functionality
- Success rate should be 100% for full functionality

### Common Issues and Solutions

#### ❌ "Firebase initialization failed"
- **Cause**: Invalid Firebase configuration
- **Solution**: Check `firebaseConfig` in test files matches your project

#### ❌ "Authentication timeout"
- **Cause**: Network issues or Firebase project not accessible
- **Solution**: Check internet connection and Firebase project status

#### ❌ "Permission denied"
- **Cause**: Firestore security rules blocking access
- **Solution**: Ensure Firestore is in test mode or update security rules

#### ❌ "Document does not exist"
- **Cause**: Write test failed or data was cleaned up
- **Solution**: Run write test before read test

## 🧹 Test Data Cleanup

All tests automatically clean up their test data:
- Test documents are deleted after each test run
- No permanent test data is left in your database
- Each test uses unique document names to avoid conflicts

## 🔒 Security Considerations

### Test Mode
- Tests run against Firestore in test mode
- Allows read/write access for testing
- **Do not use test mode in production**

### Production Security Rules
When deploying to production, update Firestore security rules:
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

## 🚨 Troubleshooting

### Firebase Console Access
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `diet-planner-game`
3. Check Firestore Database and Authentication sections

### Network Issues
- Ensure you have internet connectivity
- Check if Firebase services are accessible
- Verify no firewall is blocking Firebase requests

### Configuration Issues
- Verify Firebase project ID is correct
- Check API keys are valid
- Ensure Firestore is enabled in your project

### Browser Console Errors
- Open browser developer tools (F12)
- Check Console tab for error messages
- Look for Firebase-specific error codes

## 📈 Performance Testing

The test suite also provides performance insights:
- Connection establishment time
- Read/write operation latency
- Real-time sync responsiveness
- Authentication speed

## 🔄 Continuous Testing

### Automated Testing
You can integrate these tests into your CI/CD pipeline:
```bash
# Add to package.json scripts
"test:firebase": "node test-firebase.js --all"
```

### Development Workflow
1. Run tests before committing changes
2. Test Firebase functionality after configuration changes
3. Verify data persistence after code updates
4. Test real-time features during development

## 📞 Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify Firebase project configuration
3. Ensure Firestore is properly set up
4. Check network connectivity
5. Review Firebase service status

## 🎯 Best Practices

1. **Run tests regularly** during development
2. **Test after configuration changes** to Firebase
3. **Verify data persistence** after code updates
4. **Clean up test data** (handled automatically)
5. **Monitor test results** for performance insights
6. **Use appropriate test mode** for development vs production

---

**Remember**: These tests are designed to verify Firebase functionality. If tests fail, your app's Firebase features may not work correctly. Always ensure all tests pass before deploying to production.
