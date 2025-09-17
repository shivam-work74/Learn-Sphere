// backend/controllers/courseController.js
const Course = require('../models/Course');
const Quiz = require('../models/Quiz'); // 1. Import the Quiz model

const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({}).populate('instructor', 'name');
    res.json(courses);
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('instructor', 'name');
    if (course) { res.json(course); } 
    else { res.status(404).json({ message: 'Course not found' }); }
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const course = new Course({ title, description, imageUrl, instructor: req.user._id });
    const createdCourse = await course.save();
    res.status(201).json(createdCourse);
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user._id });
    res.json(courses);
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const updateCourse = async (req, res) => {
  try {
    const { title, description, imageUrl } = req.body;
    const course = await Course.findById(req.params.id);
    if (course) {
      course.title = title || course.title;
      course.description = description || course.description;
      course.imageUrl = imageUrl || course.imageUrl;
      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else { res.status(404).json({ message: 'Course not found' }); }
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const addLesson = async (req, res) => {
  try {
    const { title, videoUrl, content } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (course) {
      const newLesson = { title, videoUrl, content };
      course.lessons.push(newLesson);
      await course.save();
      res.status(201).json(course);
    } else { res.status(404).json({ message: 'Course not found' }); }
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const updateLesson = async (req, res) => {
  try {
    const { title, videoUrl, content } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (course) {
      const lesson = course.lessons.id(req.params.lessonId);
      if (lesson) {
        lesson.title = title || lesson.title;
        lesson.videoUrl = videoUrl || lesson.videoUrl;
        lesson.content = content || lesson.content;
        await course.save();
        res.json(course);
      } else { res.status(404).json({ message: 'Lesson not found' }); }
    } else { res.status(404).json({ message: 'Course not found' }); }
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

const deleteLesson = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (course) {
      const lesson = course.lessons.id(req.params.lessonId);
      if (lesson) {
        lesson.deleteOne();
        await course.save();
        res.json({ message: 'Lesson removed' });
      } else { res.status(404).json({ message: 'Lesson not found' }); }
    } else { res.status(404).json({ message: 'Course not found' }); }
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};

// --- NEW FUNCTION MERGED IN ---
const getQuizzesForCourse = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ course: req.params.courseId }).select('title');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
}

// --- EXPORTS UPDATED ---
module.exports = { 
  getCourses, 
  getCourseById, 
  createCourse, 
  getMyCourses, 
  updateCourse, 
  addLesson, 
  updateLesson, 
  deleteLesson, 
  getQuizzesForCourse 
};