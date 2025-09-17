// src/components/QuizPlayer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function QuizPlayer({ quizId }) {
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await axios.get(`/api/quizzes/${quizId}`, config);
        setQuiz(data);
      } catch (error) { console.error("Failed to fetch quiz"); } 
      finally { setLoading(false); }
    };
    fetchQuiz();
  }, [quizId, user.token]);

  const handleAnswerChange = (questionId, answerIndex) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleSubmit = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post(`/api/quizzes/${quizId}/submit`, { answers }, config);
      setResult(data);
    } catch (error) { alert("Failed to submit quiz."); }
  };

  if (loading) return <div>Loading Quiz...</div>;
  if (!quiz) return <div>Quiz not found.</div>;

  if (result) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-5xl font-extrabold text-indigo-600 mb-2">{result.score} / {result.totalQuestions}</p>
        <p className="text-gray-600">You answered {result.score} questions correctly.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
      <div className="space-y-8">
        {quiz.questions.map((q, qIndex) => (
          <div key={q._id}>
            <p className="font-semibold text-lg mb-2">{qIndex + 1}. {q.questionText}</p>
            <div className="space-y-2">
              {q.options.map((option, oIndex) => (
                <label key={oIndex} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="radio" name={q._id} className="h-4 w-4 text-indigo-600" onChange={() => handleAnswerChange(q._id, oIndex)} />
                  <span className="ml-3 text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit} className="w-full mt-8 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700">Submit Quiz</button>
    </div>
  );
}

export default QuizPlayer;