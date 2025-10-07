/**
 * Firebase Test Utilities
 * Comprehensive testing utilities for Firebase connection and data persistence
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot, collection, addDoc, deleteDoc } from 'firebase/firestore';

// Test configuration - using the same config as the main app
const firebaseConfig = {
  apiKey: "AIzaSyBSHipn2djImGw4OPNWU06fBq4T_PCAST0",
  authDomain: "diet-planner-game.firebaseapp.com",
  projectId: "diet-planner-game",
  storageBucket: "diet-planner-game.firebasestorage.app",
  messagingSenderId: "803776250779",
  appId: "1:803776250779:web:0c6cda616b5c15d17c973e",
  measurementId: "G-TJ5PXEFCL9"
};

class FirebaseTestSuite {
  constructor() {
    this.app = null;
    this.auth = null;
    this.firestore = null;
    this.user = null;
    this.testResults = [];
    this.isInitialized = false;
  }

  /**
   * Initialize Firebase for testing
   */
  async initialize() {
    try {
      console.log('🔥 Initializing Firebase for testing...');
      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      this.firestore = getFirestore(this.app);
      this.isInitialized = true;
      console.log('✅ Firebase initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Firebase initialization failed:', error);
      this.addTestResult('Firebase Initialization', false, error.message);
      return false;
    }
  }

  /**
   * Test Firebase connection
   */
  async testConnection() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('🔗 Testing Firebase connection...');
      
      // Test if we can access Firebase services
      const authConnected = this.auth !== null;
      const firestoreConnected = this.firestore !== null;
      
      if (authConnected && firestoreConnected) {
        console.log('✅ Firebase connection successful');
        this.addTestResult('Firebase Connection', true, 'Auth and Firestore connected');
        return true;
      } else {
        throw new Error('Firebase services not properly initialized');
      }
    } catch (error) {
      console.error('❌ Firebase connection test failed:', error);
      this.addTestResult('Firebase Connection', false, error.message);
      return false;
    }
  }

  /**
   * Test anonymous authentication
   */
  async testAuthentication() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('🔐 Testing anonymous authentication...');
      
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          this.addTestResult('Authentication', false, 'Authentication timeout');
          resolve(false);
        }, 10000);

        onAuthStateChanged(this.auth, async (user) => {
          if (user) {
            this.user = user;
            clearTimeout(timeout);
            console.log('✅ Anonymous authentication successful');
            console.log('👤 User ID:', user.uid);
            this.addTestResult('Authentication', true, `User authenticated: ${user.uid}`);
            resolve(true);
          } else {
            // Try to sign in anonymously
            try {
              await signInAnonymously(this.auth);
            } catch (error) {
              clearTimeout(timeout);
              console.error('❌ Anonymous sign-in failed:', error);
              this.addTestResult('Authentication', false, error.message);
              resolve(false);
            }
          }
        });
      });
    } catch (error) {
      console.error('❌ Authentication test failed:', error);
      this.addTestResult('Authentication', false, error.message);
      return false;
    }
  }

  /**
   * Test Firestore write operation
   */
  async testFirestoreWrite() {
    if (!this.user) {
      console.log('⚠️ No authenticated user, skipping Firestore write test');
      return false;
    }

    try {
      console.log('📝 Testing Firestore write operation...');
      
      const testData = {
        testField: 'Hello Firebase!',
        timestamp: new Date().toISOString(),
        randomValue: Math.random(),
        userAgent: navigator.userAgent
      };

      const docRef = doc(this.firestore, 'artifacts', 'diet-planner-game', 'users', this.user.uid, 'data', 'test-document');
      await setDoc(docRef, testData);
      
      console.log('✅ Firestore write successful');
      this.addTestResult('Firestore Write', true, 'Test document written successfully');
      return true;
    } catch (error) {
      console.error('❌ Firestore write test failed:', error);
      this.addTestResult('Firestore Write', false, error.message);
      return false;
    }
  }

  /**
   * Test Firestore read operation
   */
  async testFirestoreRead() {
    if (!this.user) {
      console.log('⚠️ No authenticated user, skipping Firestore read test');
      return false;
    }

    try {
      console.log('📖 Testing Firestore read operation...');
      
      const docRef = doc(this.firestore, 'artifacts', 'diet-planner-game', 'users', this.user.uid, 'data', 'test-document');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log('✅ Firestore read successful');
        console.log('📄 Retrieved data:', data);
        this.addTestResult('Firestore Read', true, `Data retrieved: ${JSON.stringify(data)}`);
        return true;
      } else {
        throw new Error('Document does not exist');
      }
    } catch (error) {
      console.error('❌ Firestore read test failed:', error);
      this.addTestResult('Firestore Read', false, error.message);
      return false;
    }
  }

  /**
   * Test real-time data synchronization
   */
  async testRealtimeSync() {
    if (!this.user) {
      console.log('⚠️ No authenticated user, skipping real-time sync test');
      return false;
    }

    try {
      console.log('🔄 Testing real-time data synchronization...');
      
      return new Promise((resolve) => {
        const docRef = doc(this.firestore, 'artifacts', 'diet-planner-game', 'users', this.user.uid, 'data', 'realtime-test');
        
        // Set up real-time listener
        const unsubscribe = onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            console.log('✅ Real-time sync successful');
            console.log('📡 Real-time data received:', data);
            this.addTestResult('Real-time Sync', true, `Real-time data received: ${JSON.stringify(data)}`);
            unsubscribe();
            resolve(true);
          }
        }, (error) => {
          console.error('❌ Real-time sync test failed:', error);
          this.addTestResult('Real-time Sync', false, error.message);
          unsubscribe();
          resolve(false);
        });

        // Write test data to trigger the listener
        setTimeout(async () => {
          try {
            await setDoc(docRef, {
              message: 'Real-time test data',
              timestamp: new Date().toISOString(),
              counter: Math.floor(Math.random() * 1000)
            });
          } catch (error) {
            console.error('❌ Failed to write test data for real-time sync:', error);
            this.addTestResult('Real-time Sync', false, error.message);
            unsubscribe();
            resolve(false);
          }
        }, 1000);

        // Timeout after 10 seconds
        setTimeout(() => {
          console.error('❌ Real-time sync test timeout');
          this.addTestResult('Real-time Sync', false, 'Real-time sync timeout');
          unsubscribe();
          resolve(false);
        }, 10000);
      });
    } catch (error) {
      console.error('❌ Real-time sync test failed:', error);
      this.addTestResult('Real-time Sync', false, error.message);
      return false;
    }
  }

  /**
   * Test user profile data persistence
   */
  async testUserProfilePersistence() {
    if (!this.user) {
      console.log('⚠️ No authenticated user, skipping profile persistence test');
      return false;
    }

    try {
      console.log('👤 Testing user profile data persistence...');
      
      const profileData = {
        name: 'Test User',
        level: 1,
        xp: 100,
        coins: 50,
        score: 0,
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true
        }
      };

      const docRef = doc(this.firestore, 'artifacts', 'diet-planner-game', 'users', this.user.uid, 'data', 'profile');
      await setDoc(docRef, profileData);
      
      // Read it back to verify
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const retrievedData = docSnap.data();
        console.log('✅ User profile persistence successful');
        console.log('👤 Profile data:', retrievedData);
        this.addTestResult('User Profile Persistence', true, `Profile data persisted and retrieved successfully`);
        return true;
      } else {
        throw new Error('Profile document not found after write');
      }
    } catch (error) {
      console.error('❌ User profile persistence test failed:', error);
      this.addTestResult('User Profile Persistence', false, error.message);
      return false;
    }
  }

  /**
   * Test game progress data persistence
   */
  async testGameProgressPersistence() {
    if (!this.user) {
      console.log('⚠️ No authenticated user, skipping game progress test');
      return false;
    }

    try {
      console.log('🎮 Testing game progress data persistence...');
      
      const progressData = {
        currentLevel: 1,
        totalXP: 150,
        coins: 75,
        score: 250,
        unlockedRecipes: ['recipe1', 'recipe2'],
        completedChallenges: ['challenge1'],
        dailyRewards: {
          lastClaimed: new Date().toISOString(),
          streak: 3
        },
        achievements: ['first_recipe', 'level_up']
      };

      const docRef = doc(this.firestore, 'artifacts', 'diet-planner-game', 'users', this.user.uid, 'data', 'progress');
      await setDoc(docRef, progressData);
      
      // Read it back to verify
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const retrievedData = docSnap.data();
        console.log('✅ Game progress persistence successful');
        console.log('🎮 Progress data:', retrievedData);
        this.addTestResult('Game Progress Persistence', true, `Game progress data persisted and retrieved successfully`);
        return true;
      } else {
        throw new Error('Progress document not found after write');
      }
    } catch (error) {
      console.error('❌ Game progress persistence test failed:', error);
      this.addTestResult('Game Progress Persistence', false, error.message);
      return false;
    }
  }

  /**
   * Clean up test data
   */
  async cleanupTestData() {
    if (!this.user) {
      console.log('⚠️ No authenticated user, skipping cleanup');
      return;
    }

    try {
      console.log('🧹 Cleaning up test data...');
      
      const testDocs = [
        'test-document',
        'realtime-test',
        'profile',
        'progress'
      ];

      for (const docName of testDocs) {
        try {
          const docRef = doc(this.firestore, 'artifacts', 'diet-planner-game', 'users', this.user.uid, 'data', docName);
          await deleteDoc(docRef);
          console.log(`🗑️ Deleted test document: ${docName}`);
        } catch (error) {
          console.log(`⚠️ Could not delete test document ${docName}:`, error.message);
        }
      }
      
      console.log('✅ Test data cleanup completed');
    } catch (error) {
      console.error('❌ Test data cleanup failed:', error);
    }
  }

  /**
   * Add test result
   */
  addTestResult(testName, passed, details) {
    this.testResults.push({
      test: testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get test results summary
   */
  getTestSummary() {
    const total = this.testResults.length;
    const passed = this.testResults.filter(r => r.passed).length;
    const failed = total - passed;
    
    return {
      total,
      passed,
      failed,
      successRate: total > 0 ? (passed / total * 100).toFixed(1) : 0,
      results: this.testResults
    };
  }

  /**
   * Print test results
   */
  printTestResults() {
    const summary = this.getTestSummary();
    
    console.log('\n📊 FIREBASE TEST RESULTS SUMMARY');
    console.log('================================');
    console.log(`Total Tests: ${summary.total}`);
    console.log(`Passed: ${summary.passed} ✅`);
    console.log(`Failed: ${summary.failed} ❌`);
    console.log(`Success Rate: ${summary.successRate}%`);
    console.log('\n📋 DETAILED RESULTS:');
    
    summary.results.forEach((result, index) => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${index + 1}. ${status} ${result.test}`);
      console.log(`   Details: ${result.details}`);
      console.log(`   Time: ${result.timestamp}`);
      console.log('');
    });
    
    return summary;
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    console.log('🚀 Starting Firebase Test Suite...');
    console.log('=====================================');
    
    const tests = [
      () => this.testConnection(),
      () => this.testAuthentication(),
      () => this.testFirestoreWrite(),
      () => this.testFirestoreRead(),
      () => this.testRealtimeSync(),
      () => this.testUserProfilePersistence(),
      () => this.testGameProgressPersistence()
    ];

    for (const test of tests) {
      try {
        await test();
        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('❌ Test execution error:', error);
      }
    }

    // Clean up test data
    await this.cleanupTestData();
    
    // Print results
    const summary = this.printTestResults();
    
    return summary;
  }
}

// Export for use in other files
export { FirebaseTestSuite };

// Auto-run tests if this file is executed directly
if (typeof window !== 'undefined') {
  window.FirebaseTestSuite = FirebaseTestSuite;
}
