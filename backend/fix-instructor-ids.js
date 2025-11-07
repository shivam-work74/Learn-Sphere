// Script to fix instructor ID mismatches in courses
const dotenv = require('dotenv');
dotenv.config({ path: '.env' });

const mongoose = require('mongoose');
const Course = require('./models/Course');

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

const fixInstructorIds = async () => {
  try {
    // First, let's see what courses we have
    const allCourses = await Course.find({});
    console.log(`Found ${allCourses.length} courses in the database`);
    
    if (allCourses.length > 0) {
      console.log('Courses before fix:');
      allCourses.forEach(course => {
        console.log(`- ${course.title} - Instructor ID: ${course.instructor}`);
      });
    }
    
    // Update courses with the incorrect instructor ID
    const incorrectInstructorId = '68c2b18cfb9ee5a44b9b2e08'; // Old incorrect ID
    const correctInstructorId = '68c2bf17e0b67f0ece5f5bf6'; // Correct ID
    
    const result1 = await Course.updateMany(
      { instructor: incorrectInstructorId },
      { $set: { instructor: correctInstructorId } }
    );
    
    console.log(`\nUpdated ${result1.modifiedCount} courses with correct instructor ID`);
    
    // Also check for the other instructor ID you mentioned
    const otherIncorrectId = '68c2b22ab47c65fe45091994';
    const result2 = await Course.updateMany(
      { instructor: otherIncorrectId },
      { $set: { instructor: correctInstructorId } }
    );
    
    console.log(`Updated ${result2.modifiedCount} courses with correct instructor ID (other ID)`);
    
    // Let's also check if there are any courses with the correct ID already
    const correctCourses = await Course.find({ instructor: correctInstructorId });
    console.log(`\nFound ${correctCourses.length} courses with correct instructor ID after fix`);
    
    if (correctCourses.length > 0) {
      console.log('Courses after fix:');
      correctCourses.forEach(course => {
        console.log(`- ${course.title} - Instructor ID: ${course.instructor}`);
      });
    }
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