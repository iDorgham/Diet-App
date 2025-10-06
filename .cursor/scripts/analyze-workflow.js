#!/usr/bin/env node

/**
 * Diet Game Workflow Analysis Script
 * Analyzes spec-driven development workflow, progress, and quality metrics
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Configuration
const CONFIG = {
  specsDir: path.join(projectRoot, '.cursor/workflow/specs'),
  uiComponentsDir: path.join(projectRoot, 'docs/ui-components'),
  architectureDir: path.join(projectRoot, 'docs/architecture'),
  srcDir: path.join(projectRoot, 'src'),
  docsDir: path.join(projectRoot, 'docs'),
  packageJson: path.join(projectRoot, 'package.json'),
  levels: {
    101: 'Basic Setup & Page Generation',
    202: 'Integrations & Testing', 
    303: 'Advanced Features',
    404: 'Production & Scaling'
  }
};

// Analysis Results
let analysisResults = {
  timestamp: new Date().toISOString(),
  project: 'Diet Planner Game',
  methodology: 'Spec-Driven Development (SDD)',
  overallScore: 0,
  categories: {}
};

/**
 * Utility Functions
 */
function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    return null;
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function getFileStats(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return {
      exists: true,
      size: stats.size,
      modified: stats.mtime,
      created: stats.birthtime
    };
  } catch (error) {
    return { exists: false };
  }
}

function countFiles(dirPath, extension = null) {
  try {
    const files = fs.readdirSync(dirPath);
    if (extension) {
      return files.filter(file => file.endsWith(extension)).length;
    }
    return files.length;
  } catch (error) {
    return 0;
  }
}

function analyzeSpecCompleteness() {
  const specs = [
    'homepage.md',
    'ai-coach-system.md', 
    'diet-game-overview.md',
    'gamification-engine.md'
  ];
  
  const uiComponents = [
    'header.md'
  ];
  
  const architecture = [
    'data-flow.md',
    'high-level-diagram.mmd'
  ];
  
  let completedSpecs = 0;
  let totalSpecs = specs.length + uiComponents.length + architecture.length;
  
  // Check specs
  specs.forEach(spec => {
    if (fileExists(path.join(CONFIG.specsDir, spec))) {
      completedSpecs++;
    }
  });
  
  // Check UI components
  uiComponents.forEach(component => {
    if (fileExists(path.join(CONFIG.uiComponentsDir, component))) {
      completedSpecs++;
    }
  });
  
  // Check architecture
  architecture.forEach(arch => {
    if (fileExists(path.join(CONFIG.architectureDir, arch))) {
      completedSpecs++;
    }
  });
  
  return {
    completed: completedSpecs,
    total: totalSpecs,
    percentage: Math.round((completedSpecs / totalSpecs) * 100),
    missing: totalSpecs - completedSpecs
  };
}

function analyzeImplementationProgress() {
  const keyComponents = [
    'App.jsx',
    'pages/HomePage.tsx',
    'components/animations/AnimatedProgressBar.tsx',
    'components/forms/UserProfileForm.tsx',
    'components/tasks/AdvancedTaskManager.tsx',
    'services/firebase.ts',
    'services/api.ts',
    'services/monitoring.ts',
    'services/offlineManager.ts',
    'services/security.ts',
    'store/nutriStore.ts',
    'hooks/useNutriQueries.ts',
    'utils/xp-system.ts',
    'types/index.ts'
  ];
  
  let implemented = 0;
  let totalSize = 0;
  const componentDetails = [];
  
  keyComponents.forEach(component => {
    const filePath = path.join(CONFIG.srcDir, component);
    const stats = getFileStats(filePath);
    
    if (stats.exists) {
      implemented++;
      totalSize += stats.size;
      componentDetails.push({
        name: component,
        size: stats.size,
        modified: stats.modified,
        status: 'implemented'
      });
    } else {
      componentDetails.push({
        name: component,
        size: 0,
        modified: null,
        status: 'missing'
      });
    }
  });
  
  return {
    implemented,
    total: keyComponents.length,
    percentage: Math.round((implemented / keyComponents.length) * 100),
    totalSize,
    components: componentDetails
  };
}

function analyzeTestingCoverage() {
  const testFiles = [
    'test/firebase.test.ts',
    'test/HomePage.test.tsx',
    'test/setup.test.ts',
    'test/xp-system.test.ts'
  ];
  
  let implemented = 0;
  let totalSize = 0;
  
  testFiles.forEach(testFile => {
    const filePath = path.join(CONFIG.srcDir, testFile);
    const stats = getFileStats(filePath);
    
    if (stats.exists) {
      implemented++;
      totalSize += stats.size;
    }
  });
  
  return {
    implemented,
    total: testFiles.length,
    percentage: Math.round((implemented / testFiles.length) * 100),
    totalSize
  };
}

function analyzeProductionReadiness() {
  const productionFiles = [
    'Dockerfile',
    'nginx.conf',
    'nginx-default.conf',
    'public/sw.js',
    'public/manifest.json',
    'vite.config.prod.js'
  ];
  
  let implemented = 0;
  let totalSize = 0;
  
  productionFiles.forEach(file => {
    const filePath = path.join(projectRoot, file);
    const stats = getFileStats(filePath);
    
    if (stats.exists) {
      implemented++;
      totalSize += stats.size;
    }
  });
  
  return {
    implemented,
    total: productionFiles.length,
    percentage: Math.round((implemented / productionFiles.length) * 100),
    totalSize
  };
}

function analyzeDependencies() {
  const packageJsonContent = readFile(CONFIG.packageJson);
  if (!packageJsonContent) {
    return { error: 'package.json not found' };
  }
  
  try {
    const packageJson = JSON.parse(packageJsonContent);
    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});
    
    // Check for key SDD dependencies
    const keyDependencies = [
      'react', 'firebase', 'lucide-react', 'tailwindcss',
      '@tanstack/react-query', 'zustand', 'framer-motion',
      '@sentry/react', 'vitest', 'typescript'
    ];
    
    let foundDependencies = 0;
    keyDependencies.forEach(dep => {
      if (dependencies.includes(dep) || devDependencies.includes(dep)) {
        foundDependencies++;
      }
    });
    
    return {
      totalDependencies: dependencies.length,
      totalDevDependencies: devDependencies.length,
      keyDependenciesFound: foundDependencies,
      keyDependenciesTotal: keyDependencies.length,
      keyDependenciesPercentage: Math.round((foundDependencies / keyDependencies.length) * 100)
    };
  } catch (error) {
    return { error: 'Failed to parse package.json' };
  }
}

function analyzeLevelProgress() {
  const levelChecks = {
    101: {
      name: 'Basic Setup & Page Generation',
      checks: [
        { name: 'Project Structure', file: 'package.json', weight: 20 },
        { name: 'HomePage Component', file: 'src/pages/HomePage.tsx', weight: 30 },
        { name: 'Header Component', file: 'src/components/header.tsx', weight: 20 },
        { name: 'XP System', file: 'src/utils/xp-system.ts', weight: 30 }
      ],
      score: 0
    },
    202: {
      name: 'Integrations & Testing',
      checks: [
        { name: 'Firebase Integration', file: 'src/services/firebase.ts', weight: 40 },
        { name: 'Testing Framework', file: 'src/test/setup.test.ts', weight: 30 },
        { name: 'Error Handling', file: 'src/services/security.ts', weight: 30 }
      ],
      score: 0
    },
    303: {
      name: 'Advanced Features',
      checks: [
        { name: 'Real-time Features', file: 'src/hooks/useNutriQueries.ts', weight: 35 },
        { name: 'Advanced Gamification', file: 'src/components/tasks/AdvancedTaskManager.tsx', weight: 35 },
        { name: 'Performance Optimization', file: 'src/store/nutriStore.ts', weight: 30 }
      ],
      score: 0
    },
    404: {
      name: 'Production & Scaling',
      checks: [
        { name: 'Production Monitoring', file: 'src/services/monitoring.ts', weight: 25 },
        { name: 'Offline Support', file: 'src/services/offlineManager.ts', weight: 25 },
        { name: 'Security Framework', file: 'src/services/security.ts', weight: 25 },
        { name: 'Deployment Pipeline', file: 'Dockerfile', weight: 25 }
      ],
      score: 0
    }
  };
  
  // Calculate scores for each level
  Object.keys(levelChecks).forEach(level => {
    const levelData = levelChecks[level];
    let totalScore = 0;
    let totalWeight = 0;
    
    levelData.checks.forEach(check => {
      const filePath = path.join(projectRoot, check.file);
      if (fileExists(filePath)) {
        totalScore += check.weight;
      }
      totalWeight += check.weight;
    });
    
    levelData.score = Math.round((totalScore / totalWeight) * 100);
  });
  
  return levelChecks;
}

function generateRecommendations(analysis) {
  const recommendations = [];
  
  // Spec completeness recommendations
  if (analysis.specs.percentage < 80) {
    recommendations.push({
      category: 'Specifications',
      priority: 'High',
      recommendation: 'Complete missing specifications to improve development guidance',
      details: `Only ${analysis.specs.percentage}% of specifications are complete. Focus on missing specs.`
    });
  }
  
  // Implementation recommendations
  if (analysis.implementation.percentage < 70) {
    recommendations.push({
      category: 'Implementation',
      priority: 'High', 
      recommendation: 'Implement missing core components',
      details: `${analysis.implementation.total - analysis.implementation.implemented} components still need implementation.`
    });
  }
  
  // Testing recommendations
  if (analysis.testing.percentage < 50) {
    recommendations.push({
      category: 'Testing',
      priority: 'Medium',
      recommendation: 'Increase test coverage',
      details: `Only ${analysis.testing.percentage}% of test files are implemented.`
    });
  }
  
  // Production readiness recommendations
  if (analysis.production.percentage < 80) {
    recommendations.push({
      category: 'Production',
      priority: 'Medium',
      recommendation: 'Complete production deployment setup',
      details: `Production readiness is at ${analysis.production.percentage}%.`
    });
  }
  
  // Level-specific recommendations
  Object.keys(analysis.levels).forEach(level => {
    const levelData = analysis.levels[level];
    if (levelData.score < 80) {
      recommendations.push({
        category: `Level ${level}`,
        priority: level <= 202 ? 'High' : 'Medium',
        recommendation: `Complete Level ${level}: ${levelData.name}`,
        details: `Current progress: ${levelData.score}%`
      });
    }
  });
  
  return recommendations;
}

function calculateOverallScore(analysis) {
  const weights = {
    specs: 0.25,
    implementation: 0.35,
    testing: 0.20,
    production: 0.20
  };
  
  const weightedScore = 
    (analysis.specs.percentage * weights.specs) +
    (analysis.implementation.percentage * weights.implementation) +
    (analysis.testing.percentage * weights.testing) +
    (analysis.production.percentage * weights.production);
  
  return Math.round(weightedScore);
}

/**
 * Main Analysis Function
 */
function runWorkflowAnalysis(scope = 'all') {
  console.log('🔍 Analyzing Diet Game Workflow...\n');
  
  // Run all analyses
  const specs = analyzeSpecCompleteness();
  const implementation = analyzeImplementationProgress();
  const testing = analyzeTestingCoverage();
  const production = analyzeProductionReadiness();
  const dependencies = analyzeDependencies();
  const levels = analyzeLevelProgress();
  
  // Compile analysis results
  const analysis = {
    specs,
    implementation,
    testing,
    production,
    dependencies,
    levels
  };
  
  // Calculate overall score
  const overallScore = calculateOverallScore(analysis);
  
  // Generate recommendations
  const recommendations = generateRecommendations(analysis);
  
  // Compile final results
  analysisResults.overallScore = overallScore;
  analysisResults.categories = analysis;
  analysisResults.recommendations = recommendations;
  
  // Display results based on scope
  if (scope === 'all' || scope === 'progress') {
    displayProgressAnalysis(analysis, overallScore);
  }
  
  if (scope === 'all' || scope === 'quality') {
    displayQualityAnalysis(analysis);
  }
  
  if (scope === 'all' || scope === 'compliance') {
    displayComplianceAnalysis(analysis);
  }
  
  if (scope === 'all' || scope === 'metrics') {
    displayMetricsAnalysis(analysis, overallScore);
  }
  
  if (scope === 'all' || scope === 'recommendations') {
    displayRecommendations(recommendations);
  }
  
  if (scope === 'all' || scope === 'bottlenecks') {
    displayBottlenecksAnalysis(analysis);
  }
  
  if (scope === 'all' || scope === 'trends') {
    displayTrendsAnalysis(analysis);
  }
  
  return analysisResults;
}

/**
 * Display Functions
 */
function displayProgressAnalysis(analysis, overallScore) {
  console.log('📊 PROGRESS ANALYSIS');
  console.log('==================\n');
  
  console.log(`Overall Progress Score: ${overallScore}%\n`);
  
  console.log('📋 Specifications Progress:');
  console.log(`  ✅ Completed: ${analysis.specs.completed}/${analysis.specs.total} (${analysis.specs.percentage}%)`);
  console.log(`  ❌ Missing: ${analysis.specs.missing} specifications\n`);
  
  console.log('💻 Implementation Progress:');
  console.log(`  ✅ Implemented: ${analysis.implementation.implemented}/${analysis.implementation.total} components (${analysis.implementation.percentage}%)`);
  console.log(`  📦 Total Size: ${Math.round(analysis.implementation.totalSize / 1024)}KB\n`);
  
  console.log('🧪 Testing Progress:');
  console.log(`  ✅ Test Files: ${analysis.testing.implemented}/${analysis.testing.total} (${analysis.testing.percentage}%)`);
  console.log(`  📦 Test Size: ${Math.round(analysis.testing.totalSize / 1024)}KB\n`);
  
  console.log('🚀 Production Readiness:');
  console.log(`  ✅ Production Files: ${analysis.production.implemented}/${analysis.production.total} (${analysis.production.percentage}%)`);
  console.log(`  📦 Production Size: ${Math.round(analysis.production.totalSize / 1024)}KB\n`);
}

function displayQualityAnalysis(analysis) {
  console.log('🎯 QUALITY ANALYSIS');
  console.log('==================\n');
  
  console.log('📚 Specification Quality:');
  console.log(`  📄 Specs Directory: ${countFiles(CONFIG.specsDir)} files`);
  console.log(`  🎨 UI Components: ${countFiles(CONFIG.uiComponentsDir)} files`);
  console.log(`  🏗️ Architecture: ${countFiles(CONFIG.architectureDir)} files\n`);
  
  console.log('💻 Code Quality:');
  console.log(`  📁 Source Files: ${countFiles(CONFIG.srcDir)} files`);
  console.log(`  📦 Total Source Size: ${Math.round(analysis.implementation.totalSize / 1024)}KB`);
  console.log(`  🧪 Test Coverage: ${analysis.testing.percentage}%\n`);
  
  console.log('🔧 Dependencies:');
  if (analysis.dependencies.error) {
    console.log(`  ❌ Error: ${analysis.dependencies.error}\n`);
  } else {
    console.log(`  📦 Dependencies: ${analysis.dependencies.totalDependencies}`);
    console.log(`  🛠️ Dev Dependencies: ${analysis.dependencies.totalDevDependencies}`);
    console.log(`  ✅ Key Dependencies: ${analysis.dependencies.keyDependenciesFound}/${analysis.dependencies.keyDependenciesTotal} (${analysis.dependencies.keyDependenciesPercentage}%)\n`);
  }
}

function displayComplianceAnalysis(analysis) {
  console.log('✅ COMPLIANCE ANALYSIS');
  console.log('=====================\n');
  
  console.log('📋 SDD Methodology Compliance:');
  console.log(`  📄 Specs First: ${analysis.specs.percentage >= 80 ? '✅' : '❌'} (${analysis.specs.percentage}%)`);
  console.log(`  💻 Implementation: ${analysis.implementation.percentage >= 70 ? '✅' : '❌'} (${analysis.implementation.percentage}%)`);
  console.log(`  🧪 Testing: ${analysis.testing.percentage >= 50 ? '✅' : '❌'} (${analysis.testing.percentage}%)`);
  console.log(`  🚀 Production: ${analysis.production.percentage >= 80 ? '✅' : '❌'} (${analysis.production.percentage}%)\n`);
  
  console.log('📊 Level Compliance:');
  Object.keys(analysis.levels).forEach(level => {
    const levelData = analysis.levels[level];
    const status = levelData.score >= 80 ? '✅' : levelData.score >= 60 ? '⚠️' : '❌';
    console.log(`  Level ${level}: ${status} ${levelData.score}% - ${levelData.name}`);
  });
  console.log('');
}

function displayMetricsAnalysis(analysis, overallScore) {
  console.log('📈 METRICS & KPIs');
  console.log('=================\n');
  
  console.log('🎯 Development Velocity:');
  console.log(`  📊 Overall Score: ${overallScore}%`);
  console.log(`  📋 Spec Velocity: ${analysis.specs.percentage}%`);
  console.log(`  💻 Implementation Velocity: ${analysis.implementation.percentage}%`);
  console.log(`  🧪 Testing Velocity: ${analysis.testing.percentage}%`);
  console.log(`  🚀 Production Velocity: ${analysis.production.percentage}%\n`);
  
  console.log('📊 Quality Metrics:');
  console.log(`  📄 Specification Quality: ${analysis.specs.percentage}%`);
  console.log(`  💻 Code Quality: ${analysis.implementation.percentage}%`);
  console.log(`  🧪 Testing Quality: ${analysis.testing.percentage}%`);
  console.log(`  🚀 Production Quality: ${analysis.production.percentage}%\n`);
  
  console.log('⚡ Efficiency Metrics:');
  console.log(`  📦 Total Codebase Size: ${Math.round((analysis.implementation.totalSize + analysis.testing.totalSize + analysis.production.totalSize) / 1024)}KB`);
  console.log(`  📁 Total Files: ${analysis.implementation.total + analysis.testing.total + analysis.production.total}`);
  console.log(`  🎯 Completion Rate: ${Math.round((analysis.implementation.implemented + analysis.testing.implemented + analysis.production.implemented) / (analysis.implementation.total + analysis.testing.total + analysis.production.total) * 100)}%\n`);
}

function displayRecommendations(recommendations) {
  console.log('💡 RECOMMENDATIONS');
  console.log('==================\n');
  
  if (recommendations.length === 0) {
    console.log('🎉 No specific recommendations - project is on track!\n');
    return;
  }
  
  recommendations.forEach((rec, index) => {
    const priorityIcon = rec.priority === 'High' ? '🔴' : rec.priority === 'Medium' ? '🟡' : '🟢';
    console.log(`${index + 1}. ${priorityIcon} ${rec.category}: ${rec.recommendation}`);
    console.log(`   ${rec.details}\n`);
  });
}

function displayBottlenecksAnalysis(analysis) {
  console.log('🚧 BOTTLENECKS & ISSUES');
  console.log('=======================\n');
  
  const bottlenecks = [];
  
  if (analysis.specs.percentage < 70) {
    bottlenecks.push({
      type: 'Specification Gap',
      impact: 'High',
      description: 'Missing specifications are blocking development progress'
    });
  }
  
  if (analysis.implementation.percentage < 60) {
    bottlenecks.push({
      type: 'Implementation Lag',
      impact: 'High', 
      description: 'Core components not implemented are blocking feature development'
    });
  }
  
  if (analysis.testing.percentage < 40) {
    bottlenecks.push({
      type: 'Testing Debt',
      impact: 'Medium',
      description: 'Low test coverage increases risk of bugs in production'
    });
  }
  
  if (analysis.production.percentage < 70) {
    bottlenecks.push({
      type: 'Production Readiness',
      impact: 'Medium',
      description: 'Missing production files block deployment'
    });
  }
  
  if (bottlenecks.length === 0) {
    console.log('✅ No major bottlenecks identified!\n');
  } else {
    bottlenecks.forEach((bottleneck, index) => {
      const impactIcon = bottleneck.impact === 'High' ? '🔴' : '🟡';
      console.log(`${index + 1}. ${impactIcon} ${bottleneck.type}`);
      console.log(`   Impact: ${bottleneck.impact}`);
      console.log(`   Description: ${bottleneck.description}\n`);
    });
  }
}

function displayTrendsAnalysis(analysis) {
  console.log('📈 TRENDS & PATTERNS');
  console.log('====================\n');
  
  console.log('📊 Development Trends:');
  console.log(`  📋 Spec-Driven Development: ${analysis.specs.percentage >= 80 ? 'Strong' : 'Needs Improvement'}`);
  console.log(`  💻 Component Implementation: ${analysis.implementation.percentage >= 70 ? 'On Track' : 'Behind Schedule'}`);
  console.log(`  🧪 Test-Driven Development: ${analysis.testing.percentage >= 50 ? 'Good' : 'Needs Focus'}`);
  console.log(`  🚀 Production Readiness: ${analysis.production.percentage >= 80 ? 'Ready' : 'In Progress'}\n`);
  
  console.log('🎯 Quality Trends:');
  const avgQuality = Math.round((analysis.specs.percentage + analysis.implementation.percentage + analysis.testing.percentage + analysis.production.percentage) / 4);
  console.log(`  📊 Average Quality Score: ${avgQuality}%`);
  console.log(`  📈 Quality Trend: ${avgQuality >= 80 ? 'Excellent' : avgQuality >= 60 ? 'Good' : 'Needs Improvement'}\n`);
  
  console.log('⚡ Performance Trends:');
  console.log(`  📦 Codebase Growth: ${Math.round((analysis.implementation.totalSize + analysis.testing.totalSize + analysis.production.totalSize) / 1024)}KB`);
  console.log(`  📁 File Organization: ${analysis.implementation.implemented > 0 ? 'Well Structured' : 'Needs Organization'}\n`);
}

/**
 * CLI Interface
 */
function main() {
  const args = process.argv.slice(2);
  const scope = args[0] || 'all';
  
  const validScopes = ['all', 'progress', 'quality', 'compliance', 'metrics', 'bottlenecks', 'recommendations', 'trends'];
  
  if (!validScopes.includes(scope)) {
    console.log('❌ Invalid scope. Valid scopes are:');
    validScopes.forEach(s => console.log(`  - ${s}`));
    process.exit(1);
  }
  
  try {
    const results = runWorkflowAnalysis(scope);
    
    // Save results to file
    const outputFile = path.join(projectRoot, 'TASK_STATUS_UPDATE_SUMMARY.md');
    const summary = generateMarkdownSummary(results);
    fs.writeFileSync(outputFile, summary);
    
    console.log(`\n📄 Analysis saved to: ${outputFile}`);
    console.log(`🎯 Overall Score: ${results.overallScore}%`);
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    process.exit(1);
  }
}

function generateMarkdownSummary(results) {
  const timestamp = new Date().toLocaleString();
  
  return `# Diet Game Workflow Analysis Summary

**Generated:** ${timestamp}  
**Overall Score:** ${results.overallScore}%  
**Methodology:** ${results.methodology}

## 📊 Progress Overview

### Specifications
- **Completed:** ${results.categories.specs.completed}/${results.categories.specs.total} (${results.categories.specs.percentage}%)
- **Missing:** ${results.categories.specs.missing} specifications

### Implementation  
- **Implemented:** ${results.categories.implementation.implemented}/${results.categories.implementation.total} components (${results.categories.implementation.percentage}%)
- **Total Size:** ${Math.round(results.categories.implementation.totalSize / 1024)}KB

### Testing
- **Test Files:** ${results.categories.testing.implemented}/${results.categories.testing.total} (${results.categories.testing.percentage}%)
- **Test Size:** ${Math.round(results.categories.testing.totalSize / 1024)}KB

### Production Readiness
- **Production Files:** ${results.categories.production.implemented}/${results.categories.production.total} (${results.categories.production.percentage}%)
- **Production Size:** ${Math.round(results.categories.production.totalSize / 1024)}KB

## 🎯 Level Progress

${Object.keys(results.categories.levels).map(level => {
  const levelData = results.categories.levels[level];
  return `### Level ${level}: ${levelData.name}
- **Score:** ${levelData.score}%
- **Status:** ${levelData.score >= 80 ? '✅ Complete' : levelData.score >= 60 ? '⚠️ In Progress' : '❌ Needs Work'}`
}).join('\n\n')}

## 💡 Key Recommendations

${results.recommendations.map((rec, index) => {
  const priorityIcon = rec.priority === 'High' ? '🔴' : rec.priority === 'Medium' ? '🟡' : '🟢';
  return `${index + 1}. ${priorityIcon} **${rec.category}:** ${rec.recommendation}`
}).join('\n')}

## 📈 Quality Metrics

- **Specification Quality:** ${results.categories.specs.percentage}%
- **Code Quality:** ${results.categories.implementation.percentage}%
- **Testing Quality:** ${results.categories.testing.percentage}%
- **Production Quality:** ${results.categories.production.percentage}%

## 🚀 Next Steps

1. Focus on completing missing specifications
2. Implement core components following SDD methodology
3. Increase test coverage for better quality assurance
4. Complete production deployment setup

---
*Analysis generated by Diet Game Workflow Analysis Tool*
`;
}

// Run the analysis
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runWorkflowAnalysis, analyzeSpecCompleteness, analyzeImplementationProgress };
