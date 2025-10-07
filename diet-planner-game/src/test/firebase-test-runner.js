/**
 * Firebase Test Runner
 * Interactive test runner for Firebase connection and data persistence
 */

import { FirebaseTestSuite } from './firebase-test-utils.js';

class FirebaseTestRunner {
  constructor() {
    this.testSuite = new FirebaseTestSuite();
    this.isRunning = false;
  }

  /**
   * Create test UI elements
   */
  createTestUI() {
    // Remove existing test UI if it exists
    const existingUI = document.getElementById('firebase-test-ui');
    if (existingUI) {
      existingUI.remove();
    }

    // Create test UI container
    const testUI = document.createElement('div');
    testUI.id = 'firebase-test-ui';
    testUI.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 400px;
      max-height: 80vh;
      background: white;
      border: 2px solid #4CAF50;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      z-index: 10000;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      overflow: hidden;
    `;

    // Create header
    const header = document.createElement('div');
    header.style.cssText = `
      background: #4CAF50;
      color: white;
      padding: 15px;
      font-weight: bold;
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    header.innerHTML = `
      <span>🔥 Firebase Test Suite</span>
      <button id="close-test-ui" style="background: none; border: none; color: white; font-size: 18px; cursor: pointer;">×</button>
    `;

    // Create content area
    const content = document.createElement('div');
    content.style.cssText = `
      padding: 20px;
      max-height: 60vh;
      overflow-y: auto;
    `;

    // Create test controls
    const controls = document.createElement('div');
    controls.style.cssText = `
      margin-bottom: 20px;
    `;
    controls.innerHTML = `
      <button id="run-all-tests" style="
        background: #4CAF50;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 14px;
        font-weight: bold;
        margin-right: 10px;
        width: 100%;
        margin-bottom: 10px;
      ">🚀 Run All Tests</button>
      
      <div style="display: flex; gap: 5px; flex-wrap: wrap;">
        <button class="test-btn" data-test="connection" style="
          background: #2196F3;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          flex: 1;
        ">🔗 Connection</button>
        
        <button class="test-btn" data-test="auth" style="
          background: #FF9800;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          flex: 1;
        ">🔐 Auth</button>
        
        <button class="test-btn" data-test="write" style="
          background: #9C27B0;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          flex: 1;
        ">📝 Write</button>
        
        <button class="test-btn" data-test="read" style="
          background: #607D8B;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          flex: 1;
        ">📖 Read</button>
        
        <button class="test-btn" data-test="realtime" style="
          background: #E91E63;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          flex: 1;
        ">🔄 Realtime</button>
        
        <button class="test-btn" data-test="profile" style="
          background: #795548;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 12px;
          flex: 1;
        ">👤 Profile</button>
      </div>
    `;

    // Create results area
    const results = document.createElement('div');
    results.id = 'test-results';
    results.style.cssText = `
      background: #f5f5f5;
      border-radius: 5px;
      padding: 15px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.4;
      max-height: 300px;
      overflow-y: auto;
      white-space: pre-wrap;
    `;
    results.textContent = 'Click "Run All Tests" or individual test buttons to start testing...';

    // Create status indicator
    const status = document.createElement('div');
    status.id = 'test-status';
    status.style.cssText = `
      margin-top: 15px;
      padding: 10px;
      border-radius: 5px;
      font-weight: bold;
      text-align: center;
      background: #e3f2fd;
      color: #1976d2;
    `;
    status.textContent = 'Ready to test Firebase connection';

    // Assemble UI
    content.appendChild(controls);
    content.appendChild(results);
    content.appendChild(status);
    testUI.appendChild(header);
    testUI.appendChild(content);

    // Add to page
    document.body.appendChild(testUI);

    // Add event listeners
    this.addEventListeners();

    return testUI;
  }

  /**
   * Add event listeners to test UI
   */
  addEventListeners() {
    // Close button
    const closeBtn = document.getElementById('close-test-ui');
    closeBtn.addEventListener('click', () => {
      document.getElementById('firebase-test-ui').remove();
    });

    // Run all tests button
    const runAllBtn = document.getElementById('run-all-tests');
    runAllBtn.addEventListener('click', () => {
      this.runAllTests();
    });

    // Individual test buttons
    const testBtns = document.querySelectorAll('.test-btn');
    testBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const testType = e.target.dataset.test;
        this.runIndividualTest(testType);
      });
    });
  }

  /**
   * Update test results display
   */
  updateResults(message, isError = false) {
    const results = document.getElementById('test-results');
    const timestamp = new Date().toLocaleTimeString();
    const prefix = isError ? '❌' : '✅';
    const newMessage = `[${timestamp}] ${prefix} ${message}\n`;
    
    results.textContent += newMessage;
    results.scrollTop = results.scrollHeight;
  }

  /**
   * Update status display
   */
  updateStatus(message, type = 'info') {
    const status = document.getElementById('test-status');
    const colors = {
      info: { bg: '#e3f2fd', color: '#1976d2' },
      success: { bg: '#e8f5e8', color: '#2e7d32' },
      error: { bg: '#ffebee', color: '#c62828' },
      warning: { bg: '#fff3e0', color: '#ef6c00' }
    };
    
    const style = colors[type] || colors.info;
    status.style.background = style.bg;
    status.style.color = style.color;
    status.textContent = message;
  }

  /**
   * Run all tests
   */
  async runAllTests() {
    if (this.isRunning) {
      this.updateResults('Tests already running, please wait...', true);
      return;
    }

    this.isRunning = true;
    this.updateStatus('Running all Firebase tests...', 'info');
    
    const results = document.getElementById('test-results');
    results.textContent = '🚀 Starting Firebase Test Suite...\n=====================================\n\n';

    try {
      const summary = await this.testSuite.runAllTests();
      
      // Display summary
      this.updateResults(`\n📊 TEST SUMMARY:`);
      this.updateResults(`Total Tests: ${summary.total}`);
      this.updateResults(`Passed: ${summary.passed} ✅`);
      this.updateResults(`Failed: ${summary.failed} ❌`);
      this.updateResults(`Success Rate: ${summary.successRate}%`);
      
      if (summary.failed === 0) {
        this.updateStatus('All tests passed! 🎉', 'success');
      } else {
        this.updateStatus(`${summary.failed} test(s) failed. Check results above.`, 'error');
      }
      
    } catch (error) {
      this.updateResults(`Test suite error: ${error.message}`, true);
      this.updateStatus('Test suite failed', 'error');
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Run individual test
   */
  async runIndividualTest(testType) {
    if (this.isRunning) {
      this.updateResults('Tests already running, please wait...', true);
      return;
    }

    this.isRunning = true;
    this.updateStatus(`Running ${testType} test...`, 'info');

    try {
      let result = false;
      
      switch (testType) {
        case 'connection':
          result = await this.testSuite.testConnection();
          break;
        case 'auth':
          result = await this.testSuite.testAuthentication();
          break;
        case 'write':
          result = await this.testSuite.testFirestoreWrite();
          break;
        case 'read':
          result = await this.testSuite.testFirestoreRead();
          break;
        case 'realtime':
          result = await this.testSuite.testRealtimeSync();
          break;
        case 'profile':
          result = await this.testSuite.testUserProfilePersistence();
          break;
        default:
          this.updateResults(`Unknown test type: ${testType}`, true);
          return;
      }
      
      if (result) {
        this.updateStatus(`${testType} test passed! ✅`, 'success');
      } else {
        this.updateStatus(`${testType} test failed ❌`, 'error');
      }
      
    } catch (error) {
      this.updateResults(`${testType} test error: ${error.message}`, true);
      this.updateStatus(`${testType} test failed`, 'error');
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Initialize test runner
   */
  init() {
    console.log('🔥 Firebase Test Runner initialized');
    console.log('💡 Use window.firebaseTestRunner.createTestUI() to open the test interface');
    
    // Make it globally available
    window.firebaseTestRunner = this;
    
    return this;
  }
}

// Auto-initialize if in browser
if (typeof window !== 'undefined') {
  const runner = new FirebaseTestRunner();
  runner.init();
}

export { FirebaseTestRunner };
