// backend/routes/courseRoutes.js
const express = require('express');
const router = express.Router();
const { 
  getCourses, getCourseById, createCourse, getMyCourses, updateCourse, 
  addLesson, updateLesson, deleteLesson, getQuizzesForCourse 
} = require('../controllers/courseController');
const { createQuiz } = require('../controllers/quizController');
const { protect, isInstructor, isCourseOwner } = require('../middleware/authMiddleware');

router.route('/').get(getCourses).post(protect, isInstructor, createCourse);
router.route('/my-courses').get(protect, isInstructor, getMyCourses);
router.route('/:id').get(getCourseById).put(protect, isInstructor, isCourseOwner, updateCourse);
router.route('/:courseId/lessons').post(protect, isInstructor, isCourseOwner, addLesson);
router.route('/:courseId/lessons/:lessonId').put(protect, isInstructor, isCourseOwner, updateLesson).delete(protect, isInstructor, isCourseOwner, deleteLesson);

// Routes for quizzes related to a course
router.route('/:courseId/quizzes').get(protect, getQuizzesForCourse);
router.route('/:courseId/quizzes').post(protect, isInstructor, isCourseOwner, createQuiz);

module.exports = router;