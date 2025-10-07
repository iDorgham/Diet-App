#!/usr/bin/env node

/**
 * Firebase Test Runner Script
 * Simple script to run Firebase tests and provide results
 */

import { CLIFirebaseTester } from './test-firebase.js';

async function main() {
  console.log('🔥 Firebase Test Runner for Diet Planner Game');
  console.log('==============================================');
  console.log('');
  
  const tester = new CLIFirebaseTester();
  
  try {
    // Initialize Firebase
    const initialized = await tester.initialize();
    if (!initialized) {
      console.log('❌ Failed to initialize Firebase. Please check your configuration.');
      process.exit(1);
    }
    
    // Run all tests
    console.log('🚀 Running comprehensive Firebase tests...');
    console.log('');
    
    const results = await tester.runAllTests();
    
    // Final summary
    console.log('');
    console.log('🎯 FINAL SUMMARY');
    console.log('================');
    
    if (results.failed === 0) {
      console.log('🎉 All Firebase tests passed! Your Firebase setup is working correctly.');
      console.log('✅ Your Diet Planner Game should work with full Firebase functionality.');
      process.exit(0);
    } else {
      console.log(`⚠️  ${results.failed} test(s) failed. Please check the errors above.`);
      console.log('❌ Some Firebase features may not work correctly in your app.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('💥 Test runner failed:', error.message);
    process.exit(1);
  }
}

// Run the tests
main().catch(console.error);
