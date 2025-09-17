// src/pages/instructor/EditCoursePage.js
import React, { useState, useEffect, useCallback } from 'react';
import API from '../../api/axios'; // 1. FIX: Import our new API client instead of axios
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaTrash, FaPencilAlt, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

function EditCoursePage() {
  const { id: courseId } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('lessons');

  // State for lessons
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [currentLessonId, setCurrentLessonId] = useState(null);
  
  // State for Quizzes
  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);

  const fetchCourseData = useCallback(async () => {
    if (user) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data } = await API.get(`/api/courses/${courseId}`, config); // 2. FIX: Use API
        setCourse(data);
      } catch (error) { console.error("Failed to fetch course data"); } 
      finally { setLoading(false); }
    }
  }, [courseId, user]);

  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);

  const handleLessonSubmit = async (e) => {
    e.preventDefault();
    const lessonData = { title: lessonTitle, videoUrl: lessonVideoUrl };
    const config = { headers: { Authorization: `Bearer ${user.token}` } };
    try {
      if (isEditingLesson) {
        await API.put(`/api/courses/${courseId}/lessons/${currentLessonId}`, lessonData, config); // 2. FIX: Use API
        toast.success('Lesson updated successfully!');
      } else {
        await API.post(`/api/courses/${courseId}/lessons`, lessonData, config); // 2. FIX: Use API
        toast.success('Lesson added successfully!');
      }
      fetchCourseData();
      resetLessonForm();
    } catch (error) { toast.error('Operation failed.'); }
  };

  const handleEditLessonClick = (lesson) => {
    setIsEditingLesson(true);
    setCurrentLessonId(lesson._id);
    setLessonTitle(lesson.title);
    setLessonVideoUrl(lesson.videoUrl);
    setActiveTab('lessons'); // Switch to lesson tab if editing from another tab
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await API.delete(`/api/courses/${courseId}/lessons/${lessonId}`, config); // 2. FIX: Use API
        toast.success('Lesson deleted.');
        fetchCourseData();
      } catch (error) { toast.error('Failed to delete lesson.'); }
    }
  };

  const resetLessonForm = () => {
    setIsEditingLesson(false);
    setCurrentLessonId(null);
    setLessonTitle('');
    setLessonVideoUrl('');
  };

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index][event.target.name] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = event.target.value;
    setQuestions(newQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = oIndex;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };
  
  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await API.post(`/api/courses/${courseId}/quizzes`, { title: quizTitle, questions }, config); // 2. FIX: Use API
        toast.success('Quiz created successfully!');
        setQuizTitle('');
        setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    } catch (error) {
        toast.error('Failed to create quiz.');
    }
  };

  if (loading) return <div className="text-center p-10 dark:text-white">Loading...</div>;
  if (!course) return <div className="text-center p-10 dark:text-white">Course not found.</div>;

  return (
    <div className="container mx-auto p-6 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-4 dark:text-white">Manage Course</h1>
      <h2 className="text-xl text-gray-600 dark:text-gray-400 mb-8">{course.title}</h2>

      {/* 3. Added dark mode styles to tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-6">
          <button onClick={() => setActiveTab('lessons')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'lessons' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
            Manage Lessons
          </button>
          <button onClick={() => setActiveTab('quizzes')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'quizzes' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:hover:border-gray-600'}`}>
            Manage Quizzes
          </button>
        </nav>
      </div>

      {activeTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Curriculum ({course.lessons.length} lessons)</h2>
            <div className="space-y-3">
              {course.lessons.length > 0 ? ( course.lessons.map((lesson, index) => (
                <div key={lesson._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-800 dark:text-gray-200">{index + 1}. {lesson.title}</span>
                  <div className="flex space-x-3">
                    <button onClick={() => handleEditLessonClick(lesson)} className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"><FaPencilAlt /></button>
                    <button onClick={() => handleDeleteLesson(lesson._id)} className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"><FaTrash /></button>
                  </div>
                </div>
              ))) : (<p className="text-gray-500 dark:text-gray-400">No lessons added yet.</p>)}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">{isEditingLesson ? 'Edit Lesson' : 'Add New Lesson'}</h2>
            <form onSubmit={handleLessonSubmit} className="space-y-4">
              <div>
                <label htmlFor="lessonTitle" className="block font-semibold dark:text-gray-300">Lesson Title</label>
                <input id="lessonTitle" type="text" value={lessonTitle} onChange={(e) => setLessonTitle(e.target.value)} required className="w-full mt-1 p-2 border rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
              </div>
              <div>
                <label htmlFor="lessonVideoUrl" className="block font-semibold dark:text-gray-300">Video URL</label>
                <input id="lessonVideoUrl" type="text" value={lessonVideoUrl} onChange={(e) => setLessonVideoUrl(e.target.value)} required className="w-full mt-1 p-2 border rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
              </div>
              <div className="flex space-x-3">
                <button type="submit" className="flex-1 bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700">{isEditingLesson ? 'Update Lesson' : 'Add Lesson'}</button>
                {isEditingLesson && (<button type="button" onClick={resetLessonForm} className="flex-1 bg-gray-500 text-white font-semibold py-2 rounded-lg hover:bg-gray-600">Cancel Edit</button>)}
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'quizzes' && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Create New Quiz</h2>
          <form onSubmit={handleQuizSubmit} className="space-y-6">
            <div>
              <label htmlFor="quizTitle" className="block text-lg font-semibold mb-2 dark:text-gray-300">Quiz Title</label>
              <input id="quizTitle" type="text" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} required placeholder="e.g., React Basics Quiz" className="w-full mt-1 p-2 border rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
            </div>
            
            {questions.map((q, qIndex) => (
              <div key={qIndex} className="p-4 border-t dark:border-gray-700 space-y-3">
                <label className="block font-semibold dark:text-gray-300">Question {qIndex + 1}</label>
                <input name="questionText" type="text" placeholder="What is a React component?" value={q.questionText} onChange={(e) => handleQuestionChange(qIndex, e)} required className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                <div className="pl-4">
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">Options (select the correct one)</label>
                  {q.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center mt-2">
                      <input type="radio" name={`correctAnswer-${qIndex}`} checked={q.correctAnswer === oIndex} onChange={() => handleCorrectAnswerChange(qIndex, oIndex)} className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"/>
                      <input type="text" placeholder={`Option ${oIndex + 1}`} value={option} onChange={(e) => handleOptionChange(qIndex, oIndex, e)} required className="w-full p-2 border rounded-lg ml-3 dark:bg-gray-700 dark:border-gray-600 dark:text-white"/>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="flex space-x-3">
              <button type="button" onClick={addQuestion} className="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                <FaPlus className="inline mr-2" /> Add Another Question
              </button>
              <button type="submit" className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700">
                Save Quiz
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default EditCoursePage;