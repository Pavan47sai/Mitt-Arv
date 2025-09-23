// Simple test script to verify authentication endpoints
const API_BASE = 'http://localhost:4000/api/auth';

async function testAuth() {
  console.log('🧪 Testing Authentication Flow...\n');
  
  try {
    // Test 1: Health check
    console.log('1. Testing server health...');
    const healthRes = await fetch('http://localhost:4000/api/health');
    if (healthRes.ok) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server is not responding');
      return;
    }
    
    // Test 2: Test signup
    console.log('\n2. Testing user signup...');
    const signupData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };
    
    const signupRes = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(signupData)
    });
    
    if (signupRes.ok) {
      console.log('✅ Signup successful');
    } else {
      const error = await signupRes.json();
      console.log('❌ Signup failed:', error.error);
    }
    
    // Test 3: Test login
    console.log('\n3. Testing user login...');
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const loginRes = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(loginData)
    });
    
    if (loginRes.ok) {
      console.log('✅ Login successful');
    } else {
      const error = await loginRes.json();
      console.log('❌ Login failed:', error.error);
    }
    
    // Test 4: Test invalid login
    console.log('\n4. Testing invalid login...');
    const invalidLoginData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };
    
    const invalidLoginRes = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(invalidLoginData)
    });
    
    if (!invalidLoginRes.ok) {
      console.log('✅ Invalid login correctly rejected');
    } else {
      console.log('❌ Invalid login should have been rejected');
    }
    
    console.log('\n🎉 Authentication tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure both servers are running:');
    console.log('   - Backend: npm run server (in server directory)');
    console.log('   - Frontend: npm start (in root directory)');
  }
}

// Run the test
testAuth();
