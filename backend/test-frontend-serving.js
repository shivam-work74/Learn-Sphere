// Test if backend is correctly serving frontend files
const dotenv = require('dotenv');
dotenv.config({ path: '.env.production' });

const path = require('path');
const express = require('express');
const mongoose = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const quizRoutes = require('./routes/quizRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Configure CORS for development and production environments
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://learnsphere-dusky.vercel.app',
  // Add your production frontend URL here
  process.env.FRONTEND_PROD_URL || 'https://learn-sphere-seven-pi.vercel.app/'
];

// Add your Vercel production URL to allowed origins
if (process.env.FRONTEND_PROD_URL) {
  allowedOrigins.push(process.env.FRONTEND_PROD_URL);
}

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if the origin is in our allowed origins list
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

const io = new Server(server, { 
  cors: { 
    origin: allowedOrigins,
    methods: ["GET", "POST"] 
  } 
});

app.use(require('cors')(corsOptions));
app.use(express.json());

// Serve frontend build files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// Add a root route for health checks
app.get('/', (req, res) => {
  res.json({ message: 'LearnSphere API is running' });
});

// Test route to check if we can access courses
app.get('/api/test-courses', async (req, res) => {
  try {
    // Try to connect to database
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Try to fetch courses
    const Course = require('./models/Course');
    const courses = await Course.find({}).populate('instructor', 'name');
    res.json({
      message: 'Successfully fetched courses',
      count: courses.length,
      courses: courses.map(c => ({
        id: c._id,
        title: c.title,
        instructor: c.instructor?.name
      }))
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching courses',
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Test server is running on port ${PORT}`);
  console.log(`Frontend should be served from: ${path.join(__dirname, '../frontend/dist')}`);
  console.log(`Allowed origins: ${allowedOrigins.join(', ')}`);
});