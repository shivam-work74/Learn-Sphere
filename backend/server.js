// backend/server.js
const dotenv = require('dotenv');
dotenv.config();

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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
  process.env.FRONTEND_URL || 'https://learn-sphere-seven-pi.vercel.app/'
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

app.use(cors(corsOptions));
app.use(express.json());

// The incorrect declaration of __dirname was removed.
// This line now correctly uses the built-in __dirname variable to serve the uploads folder.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/admin', adminRoutes);

io.on('connection', (socket) => {
  console.log('✅ A user connected. Socket ID:', socket.id);
  socket.on('joinRoom', (courseId) => {
    socket.join(courseId);
    console.log(`🙋 User ${socket.id} joined room: ${courseId}`);
  });
  socket.on('sendMessage', (data) => {
    io.to(data.courseId).emit('receiveMessage', data);
    console.log(`📩 Message received in room ${data.courseId} from ${data.sender.name}`);
  });
  socket.on('disconnect', () => {
    console.log('❌ User disconnected. Socket ID:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;

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

server.listen(PORT, () => {
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});