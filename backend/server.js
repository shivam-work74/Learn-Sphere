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

const allowedOrigins = [
  'http://localhost:5173',
  'https://learn-sphere-flax.vercel.app'
];

const io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

app.use(cors({ origin: allowedOrigins }));
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
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});