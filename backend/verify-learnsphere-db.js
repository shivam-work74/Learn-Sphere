// Script to verify data in your learnsphere MongoDB database
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

const verifyData = async () => {
  try {
    // Check current database name
    const dbName = mongoose.connection.db.databaseName;
    console.log(`\n=== CURRENT DATABASE ===`);
    console.log(`Using database: ${dbName}`);
    
    // Check all collections in the current database
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\n=== COLLECTIONS IN CURRENT DATABASE ===`);
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Check raw data in users collection
    const rawUsers = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log(`\n=== RAW USERS DATA ===`);
    console.log(`Found ${rawUsers.length} raw user documents`);
    
    rawUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - ID: ${user._id}`);
    });
    
    // Check raw data in courses collection
    const rawCourses = await mongoose.connection.db.collection('courses').find({}).toArray();
    console.log(`\n=== RAW COURSES DATA ===`);
    console.log(`Found ${rawCourses.length} raw course documents`);
    
    rawCourses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title} - Instructor ID: ${course.instructor}`);
    });
    
    // Check users through Mongoose model
    const users = await User.find({});
    console.log(`\n=== MONGOOSE USERS ===`);
    console.log(`Found ${users.length} users through Mongoose`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role} - ID: ${user._id}`);
    });
    
    // Check courses through Mongoose model
    const courses = await Course.find({});
    console.log(`\n=== MONGOOSE COURSES ===`);
    console.log(`Found ${courses.length} courses through Mongoose`);
    
    courses.forEach((course, index) => {
      console.log(`${index + 1}. ${course.title} - Instructor ID: ${course.instructor}`);
    });
    
    // Look for users with instructor role
    const instructors = await User.find({ role: 'instructor' });
    console.log(`\n=== INSTRUCTORS ===`);
    console.log(`Found ${instructors.length} users with instructor role`);
    
    instructors.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ID: ${user._id}`);
    });
    
    // Look for users with admin role
    const admins = await User.find({ role: 'admin' });
    console.log(`\n=== ADMINS ===`);
    console.log(`Found ${admins.length} users with admin role`);
    
    admins.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - ID: ${user._id}`);
    });
  } catch (error) {
    console.error('Error verifying data:', error);
  }
};

const run = async () => {
  await connectDB();
  await verifyData();
  mongoose.connection.close();
};

run();