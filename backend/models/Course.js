// backend/models/Course.js
const mongoose = require('mongoose');

// --- Define a simple schema for lessons ---
const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  content: { type: String },
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  // --- ADDED THIS FIELD ---
  lessons: [lessonSchema],
}, {
  timestamps: true,
});

const Course = mongoose.model('Course', courseSchema);
module.exports = Course;