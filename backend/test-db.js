// Test database connection and data
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const mongoose = require('mongoose');
const Course = require('./models/Course');
const User = require('./models/User');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const testData = async () => {
  try {
    // Check users
    const users = await User.find({});
    console.log(`Found ${users.length} users in the database`);
    
    if (users.length > 0) {
      console.log('Sample users:');
      users.slice(0, 3).forEach(user => {
        console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
      });
    }
    
    // Check courses
    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses in the database`);
    
    if (courses.length > 0) {
      console.log('Sample courses:');
      courses.slice(0, 3).forEach(course => {
        console.log(`- ${course.title} - Instructor ID: ${course.instructor}`);
      });
    }
  } catch (error) {
    console.error('Error testing data:', error);
  }
};

const run = async () => {
  const connection = await connectDB();
  await testData();
  mongoose.connection.close();
};

run();