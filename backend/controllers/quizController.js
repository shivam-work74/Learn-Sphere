// backend/controllers/quizController.js
const Quiz = require('../models/Quiz');
const Course = require('../models/Course');

const createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;
    const course = await Course.findById(req.params.courseId);
    if (course) {
      const quiz = new Quiz({ title, questions, course: req.params.courseId });
      const createdQuiz = await quiz.save();
      res.status(201).json(createdQuiz);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId).select('-questions.correctAnswer');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const userAnswers = req.body.answers;
    let score = 0;
    
    quiz.questions.forEach(question => {
      if (userAnswers[question._id] === question.correctAnswer) {
        score++;
      }
    });

    const totalQuestions = quiz.questions.length;
    res.json({ score, totalQuestions });
  } catch (error) {
    res.status(500).json({ message: `Server Error: ${error.message}` });
  }
};

module.exports = { createQuiz, getQuizById, submitQuiz };