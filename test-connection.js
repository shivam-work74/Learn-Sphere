// Script to test connection to your backend
const axios = require('axios');

const BACKEND_URL = 'https://learnsphere-backend-713m.onrender.com';

async function testConnection() {
  try {
    console.log(`Testing connection to: ${BACKEND_URL}`);
    
    // Test the root endpoint
    const rootResponse = await axios.get(`${BACKEND_URL}/`);
    console.log('Root endpoint response:', rootResponse.data);
    
    // Test the courses endpoint
    const coursesResponse = await axios.get(`${BACKEND_URL}/api/courses`);
    console.log('Courses endpoint response:', coursesResponse.data);
    
    console.log('Connection test successful!');
  } catch (error) {
    console.error('Connection test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testConnection();