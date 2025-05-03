/**
 * Simple test script to verify basic functionality
 */

console.log('Starting simple tests...');

// Test frontend components
function testFrontendComponents() {
  console.log('\n--- Testing Frontend Components ---');
  
  try {
    // Check if Button component file exists
    const fs = require('fs');
    const buttonPath = './frontend/src/components/common/Button.tsx';
    
    if (fs.existsSync(buttonPath)) {
      console.log('✅ Button component exists');
    } else {
      console.error('❌ Button component not found');
      return false;
    }
    
    // Check if Card component file exists
    const cardPath = './frontend/src/components/common/Card.tsx';
    
    if (fs.existsSync(cardPath)) {
      console.log('✅ Card component exists');
    } else {
      console.error('❌ Card component not found');
      return false;
    }
    
    // Check if TrendingCoins component file exists
    const trendingCoinsPath = './frontend/src/components/TrendingCoins.tsx';
    
    if (fs.existsSync(trendingCoinsPath)) {
      console.log('✅ TrendingCoins component exists');
    } else {
      console.error('❌ TrendingCoins component not found');
      return false;
    }
    
    console.log('✅ All frontend components verified');
    return true;
  } catch (error) {
    console.error('❌ Error testing frontend components:', error);
    return false;
  }
}

// Test backend services
function testBackendServices() {
  console.log('\n--- Testing Backend Services ---');
  
  try {
    // Check if logger utility exists
    const fs = require('fs');
    const loggerPath = './backend/src/utils/logger.ts';
    
    if (fs.existsSync(loggerPath)) {
      console.log('✅ Logger utility exists');
    } else {
      console.error('❌ Logger utility not found');
      return false;
    }
    
    // Check if coinsController exists
    const coinsControllerPath = './backend/src/api/controllers/coinsController.ts';
    
    if (fs.existsSync(coinsControllerPath)) {
      console.log('✅ Coins controller exists');
    } else {
      console.error('❌ Coins controller not found');
      return false;
    }
    
    // Check if trending coins endpoint is implemented
    const coinsRoutesPath = './backend/src/api/routes/coinsRoutes.ts';
    
    if (fs.existsSync(coinsRoutesPath)) {
      const routesContent = fs.readFileSync(coinsRoutesPath, 'utf8');
      if (routesContent.includes('/coins/trending')) {
        console.log('✅ Trending coins endpoint implemented');
      } else {
        console.error('❌ Trending coins endpoint not found');
        return false;
      }
    } else {
      console.error('❌ Coins routes not found');
      return false;
    }
    
    console.log('✅ All backend services verified');
    return true;
  } catch (error) {
    console.error('❌ Error testing backend services:', error);
    return false;
  }
}

// Test smart contracts
function testSmartContracts() {
  console.log('\n--- Testing Smart Contracts ---');
  
  try {
    // Check if meme_coin.move exists
    const fs = require('fs');
    const memeCoinPath = './contracts/sources/meme_coin.move';
    
    if (fs.existsSync(memeCoinPath)) {
      console.log('✅ Meme coin contract exists');
    } else {
      console.error('❌ Meme coin contract not found');
      return false;
    }
    
    // Check if dex_integration.move exists
    const dexIntegrationPath = './contracts/sources/dex_integration.move';
    
    if (fs.existsSync(dexIntegrationPath)) {
      console.log('✅ DEX integration contract exists');
    } else {
      console.error('❌ DEX integration contract not found');
      return false;
    }
    
    console.log('✅ All smart contracts verified');
    return true;
  } catch (error) {
    console.error('❌ Error testing smart contracts:', error);
    return false;
  }
}

// Run all tests
function runAllTests() {
  const frontendResult = testFrontendComponents();
  const backendResult = testBackendServices();
  const contractsResult = testSmartContracts();
  
  console.log('\n--- Test Summary ---');
  console.log(`Frontend Components: ${frontendResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Backend Services: ${backendResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Smart Contracts: ${contractsResult ? '✅ PASS' : '❌ FAIL'}`);
  
  const overallResult = frontendResult && backendResult && contractsResult;
  console.log(`\nOverall Result: ${overallResult ? '✅ PASS' : '❌ FAIL'}`);
  
  return overallResult;
}

// Execute tests
const result = runAllTests();
process.exit(result ? 0 : 1);
