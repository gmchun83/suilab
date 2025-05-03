/**
 * Setup script for PumpSui development environment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up PumpSui development environment...');

// Create necessary directories
function createDirectories() {
  console.log('\n📁 Creating necessary directories...');
  
  const directories = [
    'frontend/tests/components',
    'frontend/tests/e2e',
    'backend/tests/unit',
    'backend/tests/integration',
    'backend/logs',
    'contracts/tests'
  ];
  
  directories.forEach(dir => {
    const fullPath = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } else {
      console.log(`ℹ️ Directory already exists: ${dir}`);
    }
  });
}

// Create .env files from examples if they don't exist
function createEnvFiles() {
  console.log('\n📄 Creating .env files from examples...');
  
  const envFiles = [
    { example: '.env.example', target: '.env' },
    { example: 'frontend/.env.example', target: 'frontend/.env' },
    { example: 'backend/.env.example', target: 'backend/.env' }
  ];
  
  envFiles.forEach(({ example, target }) => {
    const examplePath = path.join(process.cwd(), example);
    const targetPath = path.join(process.cwd(), target);
    
    if (fs.existsSync(examplePath) && !fs.existsSync(targetPath)) {
      fs.copyFileSync(examplePath, targetPath);
      console.log(`✅ Created ${target} from ${example}`);
    } else if (!fs.existsSync(examplePath)) {
      console.log(`⚠️ Example file not found: ${example}`);
    } else {
      console.log(`ℹ️ File already exists: ${target}`);
    }
  });
}

// Check if required tools are installed
function checkRequiredTools() {
  console.log('\n🔧 Checking required tools...');
  
  const tools = [
    { name: 'Node.js', command: 'node --version' },
    { name: 'npm', command: 'npm --version' }
  ];
  
  tools.forEach(({ name, command }) => {
    try {
      const version = execSync(command).toString().trim();
      console.log(`✅ ${name} is installed: ${version}`);
    } catch (error) {
      console.error(`❌ ${name} is not installed or not in PATH`);
    }
  });
}

// Setup testing environment
function setupTestingEnvironment() {
  console.log('\n🧪 Setting up testing environment...');
  
  // Create Jest config for frontend if it doesn't exist
  const frontendJestConfigPath = path.join(process.cwd(), 'frontend/jest.config.js');
  if (!fs.existsSync(frontendJestConfigPath)) {
    const frontendJestConfig = `export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\\\.tsx?$': ['ts-jest', {
      useESM: true,
    }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
}`;
    
    fs.writeFileSync(frontendJestConfigPath, frontendJestConfig);
    console.log('✅ Created frontend Jest config');
  } else {
    console.log('ℹ️ Frontend Jest config already exists');
  }
  
  // Create Jest config for backend if it doesn't exist
  const backendJestConfigPath = path.join(process.cwd(), 'backend/jest.config.js');
  if (!fs.existsSync(backendJestConfigPath)) {
    const backendJestConfig = `module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\\\.tsx?$': 'ts-jest',
  },
  testRegex: '(/__tests__/.*|(\\\\.|/)(test|spec))\\\\.tsx?$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}`;
    
    fs.writeFileSync(backendJestConfigPath, backendJestConfig);
    console.log('✅ Created backend Jest config');
  } else {
    console.log('ℹ️ Backend Jest config already exists');
  }
  
  // Create Babel config for frontend if it doesn't exist
  const babelConfigPath = path.join(process.cwd(), 'frontend/babel.config.js');
  if (!fs.existsSync(babelConfigPath)) {
    const babelConfig = `module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript',
    '@babel/preset-react'
  ],
};`;
    
    fs.writeFileSync(babelConfigPath, babelConfig);
    console.log('✅ Created frontend Babel config');
  } else {
    console.log('ℹ️ Frontend Babel config already exists');
  }
  
  // Create test setup file for frontend if it doesn't exist
  const testSetupPath = path.join(process.cwd(), 'frontend/src/tests/setup.ts');
  if (!fs.existsSync(testSetupPath)) {
    const setupContent = `import '@testing-library/jest-dom'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback
  }
  
  observe = jest.fn()
  unobserve = jest.fn()
  disconnect = jest.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
})`;
    
    // Ensure the directory exists
    const setupDir = path.dirname(testSetupPath);
    if (!fs.existsSync(setupDir)) {
      fs.mkdirSync(setupDir, { recursive: true });
    }
    
    fs.writeFileSync(testSetupPath, setupContent);
    console.log('✅ Created frontend test setup file');
  } else {
    console.log('ℹ️ Frontend test setup file already exists');
  }
}

// Run all setup functions
function runSetup() {
  checkRequiredTools();
  createDirectories();
  createEnvFiles();
  setupTestingEnvironment();
  
  console.log('\n🎉 Setup complete! You can now start development with:');
  console.log('  npm run dev');
  console.log('\n📋 To run tests:');
  console.log('  npm test          # Run all tests');
  console.log('  npm run test:simple # Run simple verification tests');
}

// Execute setup
runSetup();
