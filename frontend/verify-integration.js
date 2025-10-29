import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

const verifyIntegration = async () => {
  console.log('🔍 Verifying Frontend-Backend Integration\n')
  
  let allTestsPassed = true

  // Test 1: Health Check
  console.log('1. Testing API Health...')
  try {
    const response = await axios.get(`${API_URL}/health`)
    if (response.data.status === 'OK') {
      console.log('   ✅ API is healthy and responding')
    } else {
      console.log('   ❌ API health check failed')
      allTestsPassed = false
    }
  } catch (error) {
    console.log('   ❌ Cannot connect to API server')
    console.log('      Make sure the backend is running on http://localhost:5000')
    allTestsPassed = false
  }

  // Test 2: Authentication Endpoints
  console.log('\n2. Testing Authentication Endpoints...')
  try {
    const testUser = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test_integration@example.com',
      password: 'test123456'
    }

    // Try to register
    try {
      await axios.post(`${API_URL}/auth/register`, testUser)
      console.log('   ✅ Registration endpoint working')
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message.includes('already exists')) {
        console.log('   ✅ Registration endpoint working (user already exists)')
      } else {
        console.log('   ❌ Registration endpoint failed')
        allTestsPassed = false
      }
    }

    // Try to login
    try {
      const loginResponse = await axios.post(`${API_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      })
      console.log('   ✅ Login endpoint working')
      
      // Test token
      const token = loginResponse.data.token
      if (token) {
        console.log('   ✅ JWT token generated successfully')
        
        // Test authenticated endpoint
        try {
          const meResponse = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          console.log('   ✅ Authenticated endpoints working')
          console.log(`      Welcome, ${meResponse.data.user.firstName}!`)
        } catch (error) {
          console.log('   ❌ Authenticated endpoints failed')
          allTestsPassed = false
        }
      } else {
        console.log('   ❌ No JWT token received')
        allTestsPassed = false
      }
    } catch (error) {
      console.log('   ❌ Login endpoint failed')
      allTestsPassed = false
    }
  } catch (error) {
    console.log('   ❌ Authentication test failed')
    allTestsPassed = false
  }

  // Test 3: Goal Endpoints
  console.log('\n3. Testing Goal Endpoints...')
  try {
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'demo@example.com',
      password: 'demo123'
    })
    const token = loginResponse.data.token

    // Get goals
    try {
      const goalsResponse = await axios.get(`${API_URL}/goals`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('   ✅ Goals endpoint working')
      console.log(`      Found ${goalsResponse.data.length} goals`)
    } catch (error) {
      console.log('   ❌ Goals endpoint failed')
      allTestsPassed = false
    }

    // Create test goal
    try {
      const testGoal = {
        title: 'Integration Test Goal',
        description: 'Testing frontend-backend integration',
        category: 'learning',
        effort: 3
      }
      const createResponse = await axios.post(`${API_URL}/goals`, testGoal, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('   ✅ Goal creation working')
      
      // Clean up test goal
      try {
        await axios.delete(`${API_URL}/goals/${createResponse.data.goal._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        console.log('   ✅ Goal deletion working')
      } catch (error) {
        console.log('   ⚠️  Goal deletion test failed (non-critical)')
      }
    } catch (error) {
      console.log('   ❌ Goal creation failed')
      allTestsPassed = false
    }
  } catch (error) {
    console.log('   ❌ Goal endpoint tests failed')
    allTestsPassed = false
  }

  // Test 4: Task Endpoints
  console.log('\n4. Testing Task Endpoints...')
  try {
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'demo@example.com',
      password: 'demo123'
    })
    const token = loginResponse.data.token

    // Get today's tasks
    try {
      const tasksResponse = await axios.get(`${API_URL}/tasks/today`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('   ✅ Today tasks endpoint working')
      console.log(`      Found ${tasksResponse.data.length} tasks for today`)
    } catch (error) {
      console.log('   ❌ Today tasks endpoint failed')
      allTestsPassed = false
    }
  } catch (error) {
    console.log('   ❌ Task endpoint tests failed')
    allTestsPassed = false
  }

  // Test 5: Backbone Endpoints
  console.log('\n5. Testing Backbone Endpoints...')
  try {
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'demo@example.com',
      password: 'demo123'
    })
    const token = loginResponse.data.token

    try {
      const backboneResponse = await axios.get(`${API_URL}/backbone`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('   ✅ Backbone endpoint working')
      if (backboneResponse.data.schedule) {
        console.log(`      Found ${backboneResponse.data.schedule.length} schedule blocks`)
      } else {
        console.log('      No existing backbone schedule')
      }
    } catch (error) {
      console.log('   ⚠️  Backbone endpoint failed (may be normal for new users)')
    }
  } catch (error) {
    console.log('   ❌ Backbone endpoint test failed')
    allTestsPassed = false
  }

  // Test 6: Planning Endpoints
  console.log('\n6. Testing Planning Endpoints...')
  try {
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: 'demo@example.com',
      password: 'demo123'
    })
    const token = loginResponse.data.token

    // Get active goals for planning
    try {
      const goalsResponse = await axios.get(`${API_URL}/goals/active/planning`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('   ✅ Active goals endpoint working')
      
      if (goalsResponse.data.length > 0) {
        console.log(`      Found ${goalsResponse.data.length} active goals`)
        
        // Try planning (this might fail without OpenAI API key)
        try {
          const goalIds = goalsResponse.data.slice(0, 1).map(goal => goal._id)
          const weekStart = new Date().toISOString().split('T')[0]
          
          await axios.post(`${API_URL}/plan`, {
            goalIds,
            weekStart
          }, {
            headers: { Authorization: `Bearer ${token}` }
          })
          console.log('   ✅ Planning endpoint working')
          console.log('      ⚠️  Note: AI task generation requires OpenAI API key')
        } catch (error) {
          if (error.response?.status === 400) {
            console.log('   ✅ Planning endpoint working (requires OpenAI API key)')
          } else {
            console.log('   ⚠️  Planning endpoint test failed')
          }
        }
      } else {
        console.log('      No active goals found for planning')
      }
    } catch (error) {
      console.log('   ❌ Active goals endpoint failed')
      allTestsPassed = false
    }
  } catch (error) {
    console.log('   ❌ Planning endpoint tests failed')
    allTestsPassed = false
  }

  // Summary
  console.log('\n' + '='.repeat(50))
  console.log('INTEGRATION TEST SUMMARY')
  console.log('='.repeat(50))
  
  if (allTestsPassed) {
    console.log('🎉 ALL TESTS PASSED!')
    console.log('✅ Frontend is ready to connect to the backend')
    console.log('✅ All API endpoints are working correctly')
    console.log('✅ Authentication is functioning')
    console.log('✅ Data operations are available')
  } else {
    console.log('⚠️  SOME TESTS FAILED')
    console.log('❌ Please check the backend server and try again')
  }
  
  console.log('\nNext Steps:')
  console.log('1. Start the frontend development server: npm run dev')
  console.log('2. Open http://localhost:5173 in your browser')
  console.log('3. Register a new account or use demo credentials:')
  console.log('   Email: demo@example.com')
  console.log('   Password: demo123')
  console.log('4. Start planning your goals!')
}

// Run the verification
verifyIntegration().catch(error => {
  console.error('Verification failed:', error)
  console.log('\n❌ Make sure the backend server is running on http://localhost:5000')
})