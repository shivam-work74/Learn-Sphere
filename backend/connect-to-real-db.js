// Script to connect to the database with your actual data
const mongoose = require('mongoose');

// This is the MongoDB URI from your .env file that seems to have your actual data
const MONGO_URI = 'mongodb+srv://shivam:shivam74@cluster0.4aaqibr.mongodb.net/?appName=Cluster0';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const Course = require('./models/Course');
const User = require('./models/User');

const checkRealData = async () => {
  try {
    // Check users
    const users = await User.find({});
    console.log(`Found ${users.length} users in the database`);
    
    // Find the instructor
    const instructor = await User.findOne({ name: 'Shivam' });
    if (instructor) {
      console.log(`Found instructor: ${instructor.name} with ID: ${instructor._id}`);
    }
    
    // Check courses
    const courses = await Course.find({});
    console.log(`Found ${courses.length} courses in the database`);
    
    if (courses.length > 0) {
      console.log('Sample courses:');
      courses.slice(0, 3).forEach(course => {
        console.log(`- ${course.title} - Instructor ID: ${course.instructor}`);
      });
      
      // Fix instructor IDs if needed
      const incorrectInstructorId = '68c2b18cfb9ee5a44b9b2e08';
      if (instructor) {
        const result = await Course.updateMany(
          { instructor: incorrectInstructorId },
          { $set: { instructor: instructor._id } }
        );
        console.log(`Updated ${result.modifiedCount} courses with correct instructor ID`);
      }
    }
  } catch (error) {
    console.error('Error checking real data:', error);
  }
};

const run = async () => {
  const connection = await connectDB();
  await checkRealData();
  mongoose.connection.close();
};

run();