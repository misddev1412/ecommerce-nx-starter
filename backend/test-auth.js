const axios = require('axios');

// Test script for Firebase Authentication endpoints
const BASE_URL = 'http://localhost:3000';

async function testAuthEndpoints() {
  console.log('🔥 Testing Firebase Authentication Setup...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing auth health endpoint...');
    const healthResponse = await axios.get(`${BASE_URL}/auth/health`);
    console.log('✅ Health check:', healthResponse.data);
    console.log();

    // Test 2: Try protected route without token (should fail)
    console.log('2. Testing protected route without token...');
    try {
      await axios.get(`${BASE_URL}/auth/profile`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Protected route correctly requires authentication');
        console.log('   Response:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log();

    // Test 3: Try login without token (should fail)
    console.log('3. Testing Google login without Firebase token...');
    try {
      await axios.post(`${BASE_URL}/auth/google`, {
        firebaseToken: 'invalid-token'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Google login correctly validates Firebase token');
        console.log('   Response:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log();

    // Test 4: Try Facebook login without token (should fail)
    console.log('4. Testing Facebook login without Firebase token...');
    try {
      await axios.post(`${BASE_URL}/auth/facebook`, {
        firebaseToken: 'invalid-token'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Facebook login correctly validates Firebase token');
        console.log('   Response:', error.response.data.message);
      } else {
        console.log('❌ Unexpected error:', error.message);
      }
    }
    console.log();

    console.log('🎉 All Firebase Authentication tests completed!');
    console.log('\n📝 Next steps:');
    console.log('1. Create a Firebase project at https://console.firebase.google.com/');
    console.log('2. Enable Google and Facebook authentication');
    console.log('3. Generate service account credentials');
    console.log('4. Update .env file with actual Firebase credentials');
    console.log('5. Test with real Firebase tokens from frontend');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure the backend server is running:');
      console.log('   yarn nx serve backend');
    }
  }
}

// Run tests
testAuthEndpoints(); 