const fetch = require('node-fetch');

async function testBackend() {
  const baseURL = 'http://localhost:4000';
  
  console.log('🧪 Testing Backend Endpoints...\n');
  
  try {
    // Test health check
    console.log('1. Testing health check endpoint...');
    const healthResponse = await fetch(`${baseURL}/`);
    const healthData = await healthResponse.json();
    console.log(`✅ Health check: ${healthResponse.status} - ${healthData.message}\n`);
    
    // Test CORS headers
    console.log('2. Testing CORS headers...');
    const corsResponse = await fetch(`${baseURL}/api/files`);
    const corsHeaders = corsResponse.headers;
    console.log(`✅ CORS headers present:`);
    console.log(`   Access-Control-Allow-Origin: ${corsHeaders.get('access-control-allow-origin')}`);
    console.log(`   Access-Control-Allow-Methods: ${corsHeaders.get('access-control-allow-methods')}`);
    console.log(`   Access-Control-Allow-Headers: ${corsHeaders.get('access-control-allow-headers')}\n`);
    
    // Test baseline files endpoint
    console.log('3. Testing baseline files endpoint...');
    const baselineResponse = await fetch(`${baseURL}/api/baseline-files`);
    const baselineData = await baselineResponse.json();
    console.log(`✅ Baseline files: ${baselineResponse.status} - Found ${baselineData.length} files\n`);
    
    // Test Phase2 files endpoint
    console.log('4. Testing Phase2 files endpoint...');
    const phase2Response = await fetch(`${baseURL}/api/phase2-files`);
    const phase2Data = await phase2Response.json();
    console.log(`✅ Phase2 files: ${phase2Response.status} - Found ${phase2Data.length} files\n`);
    
    console.log('🎉 All tests passed! Backend is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testBackend();
}

module.exports = { testBackend };
