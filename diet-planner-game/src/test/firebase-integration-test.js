/**
 * Firebase Integration Test
 * Simple integration test that can be run from the main app
 */

import { FirebaseTestSuite } from './firebase-test-utils.js';

/**
 * Run Firebase integration tests
 * This function can be called from the browser console or from the app
 */
export async function runFirebaseIntegrationTests() {
  console.log('🔥 Starting Firebase Integration Tests...');
  console.log('==========================================');
  
  const testSuite = new FirebaseTestSuite();
  
  try {
    // Run all tests
    const summary = await testSuite.runAllTests();
    
    // Log results to console
    console.log('\n📊 INTEGRATION TEST RESULTS:');
    console.log('============================');
    console.log(`Total Tests: ${summary.total}`);
    console.log(`Passed: ${summary.passed} ✅`);
    console.log(`Failed: ${summary.failed} ❌`);
    console.log(`Success Rate: ${summary.successRate}%`);
    
    // Return results for programmatic use
    return {
      success: summary.failed === 0,
      summary,
      message: summary.failed === 0 
        ? 'All Firebase integration tests passed! 🎉' 
        : `${summary.failed} test(s) failed. Check console for details.`
    };
    
  } catch (error) {
    console.error('❌ Integration test suite failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Firebase integration test suite failed'
    };
  }
}

/**
 * Quick Firebase connection test
 * Lightweight test to verify basic Firebase connectivity
 */
export async function quickFirebaseTest() {
  console.log('⚡ Running quick Firebase test...');
  
  const testSuite = new FirebaseTestSuite();
  
  try {
    // Test connection and authentication only
    const connectionOk = await testSuite.testConnection();
    const authOk = await testSuite.testAuthentication();
    
    const success = connectionOk && authOk;
    
    console.log(success ? '✅ Quick Firebase test passed!' : '❌ Quick Firebase test failed!');
    
    return {
      success,
      connection: connectionOk,
      authentication: authOk,
      message: success 
        ? 'Firebase connection and authentication working' 
        : 'Firebase connection or authentication failed'
    };
    
  } catch (error) {
    console.error('❌ Quick Firebase test failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Quick Firebase test failed'
    };
  }
}

/**
 * Test specific Firebase functionality
 * @param {string} testType - Type of test to run ('connection', 'auth', 'write', 'read', 'realtime', 'profile')
 */
export async function testFirebaseFeature(testType) {
  console.log(`🔧 Testing Firebase feature: ${testType}`);
  
  const testSuite = new FirebaseTestSuite();
  
  try {
    let result = false;
    
    switch (testType) {
      case 'connection':
        result = await testSuite.testConnection();
        break;
      case 'auth':
        result = await testSuite.testAuthentication();
        break;
      case 'write':
        result = await testSuite.testFirestoreWrite();
        break;
      case 'read':
        result = await testSuite.testFirestoreRead();
        break;
      case 'realtime':
        result = await testSuite.testRealtimeSync();
        break;
      case 'profile':
        result = await testSuite.testUserProfilePersistence();
        break;
      default:
        throw new Error(`Unknown test type: ${testType}`);
    }
    
    console.log(result ? `✅ ${testType} test passed!` : `❌ ${testType} test failed!`);
    
    return {
      success: result,
      testType,
      message: result 
        ? `${testType} test passed successfully` 
        : `${testType} test failed`
    };
    
  } catch (error) {
    console.error(`❌ ${testType} test failed:`, error);
    return {
      success: false,
      testType,
      error: error.message,
      message: `${testType} test failed: ${error.message}`
    };
  }
}

/**
 * Make Firebase tests available globally for easy access
 */
if (typeof window !== 'undefined') {
  window.firebaseTests = {
    runAll: runFirebaseIntegrationTests,
    quick: quickFirebaseTest,
    test: testFirebaseFeature
  };
  
  console.log('🔥 Firebase tests available globally:');
  console.log('  window.firebaseTests.runAll() - Run all integration tests');
  console.log('  window.firebaseTests.quick() - Run quick connection test');
  console.log('  window.firebaseTests.test("auth") - Test specific feature');
}
