// backend/routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const { getQuizById, submitQuiz } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');

router.route('/:quizId').get(protect, getQuizById);
router.route('/:quizId/submit').post(protect, submitQuiz);

module.exports = router;