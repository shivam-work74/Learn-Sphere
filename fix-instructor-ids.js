// Script to fix instructor ID mismatches in courses
const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const Course = require('./backend/models/Course');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const fixInstructorIds = async () => {
  try {
    // First, let's see what courses we have
    const allCourses = await Course.find({});
    console.log(`Found ${allCourses.length} courses in the database`);
    
    // Update all courses with the incorrect instructor ID
    const result = await Course.updateMany(
      { instructor: '68c2b18cfb9ee5a44b9b2e08' }, // Old incorrect ID
      { $set: { instructor: '68c2bf17e0b67f0ece5f5bf6' } } // Correct ID
    );
    
    console.log(`Updated ${result.modifiedCount} courses with correct instructor ID`);
    
    // Let's also check if there are any courses with the correct ID already
    const correctCourses = await Course.find({ instructor: '68c2bf17e0b67f0ece5f5bf6' });
    console.log(`Found ${correctCourses.length} courses with correct instructor ID`);
  } catch (error) {
    console.error('Error updating courses:', error);
  }
};

const run = async () => {
  await connectDB();
  await fixInstructorIds();
  mongoose.connection.close();
};

run();