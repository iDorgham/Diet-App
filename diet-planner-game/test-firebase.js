#!/usr/bin/env node

/**
 * Firebase Test Script
 * Command-line test runner for Firebase connection and data persistence
 * 
 * Usage: node test-firebase.js [options]
 * Options:
 *   --all, -a     Run all tests
 *   --connection  Test Firebase connection
 *   --auth        Test authentication
 *   --write       Test Firestore write
 *   --read        Test Firestore read
 *   --realtime    Test real-time sync
 *   --profile     Test user profile persistence
 *   --help, -h    Show help
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, onSnapshot, deleteDoc } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSHipn2djImGw4OPNWU06fBq4T_PCAST0",
  authDomain: "diet-planner-game.firebaseapp.com",
  projectId: "diet-planner-game",
  storageBucket: "diet-planner-game.firebasestorage.app",
  messagingSenderId: "803776250779",
  appId: "1:803776250779:web:0c6cda616b5c15d17c973e",
  measurementId: "G-TJ5PXEFCL9"
};

class CLIFirebaseTester {
  constructor() {
    this.app = null;
    this.auth = null;
    this.firestore = null;
    this.user = null;
    this.results = [];
    this.colors = {
      reset: '\x1b[0m',
      bright: '\x1b[1m',
      red: '\x1b[31m',
      green: '\x1b[32m',
      yellow: '\x1b[33m',
      blue: '\x1b[34m',
      magenta: '\x1b[35m',
      cyan: '\x1b[36m'
    };
  }

  log(message, color = 'reset') {
    console.log(`${this.colors[color]}${message}${this.colors.reset}`);
  }

  async initialize() {
    try {
      this.log('🔥 Initializing Firebase...', 'cyan');
      this.app = initializeApp(firebaseConfig);
      this.auth = getAuth(this.app);
      this.firestore = getFirestore(this.app);
      this.log('✅ Firebase initialized successfully', 'green');
      return true;
    } catch (error) {
      this.log(`❌ Firebase initialization failed: ${error.message}`, 'red');
      this.addResult('Firebase Initialization', false, error.message);
      return false;
    }
  }

  async testConnection() {
    try {
      this.log('🔗 Testing Firebase connection...', 'blue');
      
      if (this.auth && this.firestore) {
        this.log('✅ Firebase connection successful', 'green');
        this.addResult('Firebase Connection', true, 'Auth and Firestore connected');
        return true;
      } else {
        throw new Error('Firebase services not properly initialized');
      }
    } catch (error) {
      this.log(`❌ Firebase connection test failed: ${error.message}`, 'red');
      this.addResult('Firebase Connection', false, error.message);
      return false;
    }
  }

  async testAuthentication() {
    try {
      this.log('🔐 Testing anonymous authentication...', 'yellow');
      
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          this.log('❌ Authentication timeout', 'red');
          this.addResult('Authentication', false, 'Authentication timeout');
          resolve(false);
        }, 10000);

        onAuthStateChanged(this.auth, async (user) => {
          if (user) {
            this.user = user;
            clearTimeout(timeout);
            this.log(`✅ Anonymous authentication successful`, 'green');
            this.log(`👤 User ID: ${user.uid}`, 'cyan');
            this.addResult('Authentication', true, `User authenticated: ${user.uid}`);
            resolve(true);
          } else {
            try {
              await signInAnonymously(this.auth);
            } catch (error) {
              clearTimeout(timeout);
              this.log(`❌ Anonymous sign-in failed: ${error.message}`, 'red');
              this.addResult('Authentication', false, error.message);
              resolve(false);
            }
          }
        });
      });
    } catch (error) {
      this.log(`❌ Authentication test failed: ${error.message}`, 'red');
      this.addResult('Authentication', false, error.message);
      return false;
    }
  }

  async testFirestoreWrite() {
    if (!this.user) {
      this.log('⚠️ No authenticated user, skipping Firestore write test', 'yellow');
      return false;
    }

    try {
      this.log('📝 Testing Firestore write operation...', 'magenta');
      
      const testData = {
        testField: 'Hello Firebase!',
        timestamp: new Date().toISOString(),
        randomValue: Math.random(),
        testType: 'CLI'
      };

      const docRef = doc(this.firestore, 'artifacts', 'diet-planner-game', 'users', this.user.uid, 'data', 'cli-test-document');
      await setDoc(docRef, testData);
      
      this.log('✅ Firestore write successful', 'green');
      this.addResult('Firestore Write', true, 'Test document written successfully');
      return true;
    } catch (error) {
      this.log(`❌ Firestore write test failed: ${error.message}`, 'red');
      this.addResult('Firestore Write', false, error.message);
      return false;
    }
  }

  async testFirestoreRead() {
    if (!this.user) {
      this.log('⚠️ No authenticated user, skipping Firestore read test', 'yellow');
      return false;
    }

    try {
      this.log('📖 Testing Firestore read operation...', 'cyan');
      
      const docRef = doc(this.firestore, 'artifacts', 'diet-planner-game', 'users', this.user.uid, 'data', 'cli-test-document');
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        this.log('✅ Firestore read successful', 'green');
        this.log(`📄 Retrieved data: ${JSON.stringify(data, null, 2)}`, 'cyan');
        this.addResult('Firestore Read', true, `Data retrieved successfully`);
        return true;
      } else {
        throw new Error('Document does not exist');
      }
    } catch (error) {
      this.log(`❌ Firestore read test failed: ${error.message}`, 'red');
      this.addResult('Firestore Read', false, error.message);
      return false;
    }
  }

  async testRealtimeSync() {
    if (!this.user) {
      this.log('⚠️ No authenticated user, skipping real-time sync test', 'yellow');
      return false;
    }

    try {
      this.log('🔄 Testing real-time data synchronization...', 'blue');
      
      return new Promise((resolve) => {
        const docRef = doc(this.firestore, 'artifacts', 'diet-planner-game', 'users', this.user.uid, 'data', 'cli-realtime-test');
        
        const unsubscribe = onSnapshot(docRef, (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            this.log('✅ Real-time sync successful', 'green');
            this.log(`📡 Real-time data received: ${JSON.stringify(data, null, 2)}`, 'cyan');
            this.addResult('Real-time Sync', true, `Real-time data received successfully`);
            unsubscribe();
            resolve(true);
          }
        }, (error) => {
          this.log(`❌ Real-time sync test failed: ${error.message}`, 'red');
          this.addResult('Real-time Sync', false, error.message);
          unsubscribe();
          resolve(false);
        });

        setTimeout(async () => {
          try {
            await setDoc(docRef, {
              message: 'CLI Real-time test data',
              timestamp: new Date().toISOString(),
              counter: Math.floor(Math.random() * 1000)
            });
          } catch (error) {
            this.log(`❌ Failed to write test data for real-time sync: ${error.message}`, 'red');
            this.addResult('Real-time Sync', false, error.message);
            unsubscribe();
            resolve(false);
          }
        }, 1000);

        setTimeout(() => {
          this.log('❌ Real-time sync test timeout', 'red');
          this.addResult('Real-time Sync', false, 'Real-time sync timeout');
          unsubscribe();
          resolve(false);
        }, 10000);
      });
    } catch (error) {
      this.log(`❌ Real-time sync test failed: ${error.message}`, 'red');
      this.addResult('Real-time Sync', false, error.message);
      return false;
    }
  }

  async testUserProfilePersistence() {
    if (!this.user) {
      this.log('⚠️ No authenticated user, skipping profile persistence test', 'yellow');
      return false;
    }

    try {
      this.log('👤 Testing user profile data persistence...', 'magenta');
      
      const profileData = {
        name: 'CLI Test User',
        level: 1,
        xp: 100,
        coins: 50,
        score: 0,
        lastLogin: new Date().toISOString(),
        preferences: {
          theme: 'light',
          notifications: true
        },
        testType: 'CLI'
      };

      const docRef = doc(this.firestore, 'artifacts', 'diet-planner-game', 'users', this.user.uid, 'data', 'cli-profile');
      await setDoc(docRef, profileData);
      
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const retrievedData = docSnap.data();
        this.log('✅ User profile persistence successful', 'green');
        this.log(`👤 Profile data: ${JSON.stringify(retrievedData, null, 2)}`, 'cyan');
        this.addResult('User Profile Persistence', true, `Profile data persisted and retrieved successfully`);
        return true;
      } else {
        throw new Error('Profile document not found after write');
      }
    } catch (error) {
      this.log(`❌ User profile persistence test failed: ${error.message}`, 'red');
      this.addResult('User Profile Persistence', false, error.message);
      return false;
    }
  }

  async cleanupTestData() {
    if (!this.user) {
      this.log('⚠️ No authenticated user, skipping cleanup', 'yellow');
      return;
    }

    try {
      this.log('🧹 Cleaning up test data...', 'yellow');
      
      const testDocs = [
        'cli-test-document',
        'cli-realtime-test',
        'cli-profile'
      ];

      for (const docName of testDocs) {
        try {
          const docRef = doc(this.firestore, 'artifacts', 'diet-planner-game', 'users', this.user.uid, 'data', docName);
          await deleteDoc(docRef);
          this.log(`🗑️ Deleted test document: ${docName}`, 'cyan');
        } catch (error) {
          this.log(`⚠️ Could not delete test document ${docName}: ${error.message}`, 'yellow');
        }
      }
      
      this.log('✅ Test data cleanup completed', 'green');
    } catch (error) {
      this.log(`❌ Test data cleanup failed: ${error.message}`, 'red');
    }
  }

  addResult(testName, passed, details) {
    this.results.push({
      test: testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    });
  }

  printResults() {
    const total = this.results.length;
    const passed = this.results.filter(r => r.passed).length;
    const failed = total - passed;
    const successRate = total > 0 ? (passed / total * 100).toFixed(1) : 0;
    
    this.log('\n📊 FIREBASE TEST RESULTS SUMMARY', 'bright');
    this.log('================================', 'bright');
    this.log(`Total Tests: ${total}`, 'cyan');
    this.log(`Passed: ${passed} ✅`, 'green');
    this.log(`Failed: ${failed} ❌`, 'red');
    this.log(`Success Rate: ${successRate}%`, successRate >= 80 ? 'green' : 'red');
    this.log('\n📋 DETAILED RESULTS:', 'bright');
    
    this.results.forEach((result, index) => {
      const status = result.passed ? '✅' : '❌';
      const color = result.passed ? 'green' : 'red';
      this.log(`${index + 1}. ${status} ${result.test}`, color);
      this.log(`   Details: ${result.details}`, 'cyan');
      this.log(`   Time: ${result.timestamp}`, 'yellow');
      this.log('');
    });
    
    return { total, passed, failed, successRate };
  }

  async runAllTests() {
    this.log('🚀 Starting Firebase Test Suite...', 'bright');
    this.log('=====================================', 'bright');
    
    const tests = [
      () => this.testConnection(),
      () => this.testAuthentication(),
      () => this.testFirestoreWrite(),
      () => this.testFirestoreRead(),
      () => this.testRealtimeSync(),
      () => this.testUserProfilePersistence()
    ];

    for (const test of tests) {
      try {
        await test();
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        this.log(`❌ Test execution error: ${error.message}`, 'red');
      }
    }

    await this.cleanupTestData();
    return this.printResults();
  }

  showHelp() {
    this.log('🔥 Firebase Test Suite - Command Line Interface', 'bright');
    this.log('================================================', 'bright');
    this.log('');
    this.log('Usage: node test-firebase.js [options]', 'cyan');
    this.log('');
    this.log('Options:', 'yellow');
    this.log('  --all, -a        Run all tests', 'cyan');
    this.log('  --connection     Test Firebase connection', 'cyan');
    this.log('  --auth           Test authentication', 'cyan');
    this.log('  --write          Test Firestore write', 'cyan');
    this.log('  --read           Test Firestore read', 'cyan');
    this.log('  --realtime       Test real-time sync', 'cyan');
    this.log('  --profile        Test user profile persistence', 'cyan');
    this.log('  --help, -h       Show this help message', 'cyan');
    this.log('');
    this.log('Examples:', 'yellow');
    this.log('  node test-firebase.js --all', 'cyan');
    this.log('  node test-firebase.js --connection --auth', 'cyan');
    this.log('  node test-firebase.js --write --read', 'cyan');
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const tester = new CLIFirebaseTester();
  
  if (args.includes('--help') || args.includes('-h')) {
    tester.showHelp();
    return;
  }
  
  if (args.length === 0) {
    tester.log('No options provided. Use --help for usage information.', 'yellow');
    return;
  }
  
  await tester.initialize();
  
  if (args.includes('--all') || args.includes('-a')) {
    await tester.runAllTests();
  } else {
    const tests = [];
    
    if (args.includes('--connection')) tests.push(() => tester.testConnection());
    if (args.includes('--auth')) tests.push(() => tester.testAuthentication());
    if (args.includes('--write')) tests.push(() => tester.testFirestoreWrite());
    if (args.includes('--read')) tests.push(() => tester.testFirestoreRead());
    if (args.includes('--realtime')) tests.push(() => tester.testRealtimeSync());
    if (args.includes('--profile')) tests.push(() => tester.testUserProfilePersistence());
    
    if (tests.length === 0) {
      tester.log('No valid test options provided. Use --help for usage information.', 'yellow');
      return;
    }
    
    for (const test of tests) {
      try {
        await test();
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        tester.log(`❌ Test execution error: ${error.message}`, 'red');
      }
    }
    
    await tester.cleanupTestData();
    tester.printResults();
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { CLIFirebaseTester };
