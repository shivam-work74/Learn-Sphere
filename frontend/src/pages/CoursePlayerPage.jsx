// src/pages/CoursePlayerPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FaArrowLeft, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import QuizPlayer from '../components/QuizPlayer';
import ChatBox from '../components/ChatBox'; // 1. Import the new ChatBox component

// Helper function to convert any YouTube URL into a proper embeddable URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return '';
  let videoId = '';
  if (url.includes('watch?v=')) {
    videoId = url.split('v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
};

function CoursePlayerPage() {
  const { id: courseId } = useParams();
  const { user, updateUser } = useAuth();
  const [course, setCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentItem, setCurrentItem] = useState({ type: null, data: null });

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const [courseRes, quizRes] = await Promise.all([
            API.get(`/api/courses/${courseId}`, config),
            API.get(`/api/courses/${courseId}/quizzes`, config)
          ]);
          setCourse(courseRes.data);
          setQuizzes(quizRes.data);
          if (courseRes.data.lessons && courseRes.data.lessons.length > 0) {
            setCurrentItem({ type: 'lesson', data: courseRes.data.lessons[0] });
          } else if (quizRes.data && quizRes.data.length > 0) {
            setCurrentItem({ type: 'quiz', data: quizRes.data[0] });
          }
        } catch (err) {
          setError('Failed to load course content. You may not be enrolled.');
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [courseId, user]);

  const handleLessonComplete = async (lessonId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await API.post('/api/users/progress', { courseId, lessonId }, config);
      updateUser(data);
    } catch (error) {
      console.error("Failed to mark lesson as complete", error);
    }
  };

  const courseProgress = user?.progress?.find(p => p.courseId === courseId);
  const completedLessons = courseProgress?.completedLessons || [];

  if (loading) return <div className="text-center p-10 dark:text-white">Loading Player...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!course) return <div className="text-center p-10 dark:text-white">Course not found.</div>;

  return (
    // 2. Updated layout to be 3 columns on large screens
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Column 1: Sidebar Curriculum */}
      <aside className="w-full lg:w-80 bg-white dark:bg-gray-800 shadow-lg lg:h-screen lg:sticky top-0 flex-shrink-0 flex flex-col">
        <div className="p-4 border-b dark:border-gray-700">
          <Link to="/dashboard" className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-2">
            <FaArrowLeft className="mr-2" /> Back to Dashboard
          </Link>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{course.title}</h2>
        </div>
        <nav className="flex-grow overflow-y-auto">
          <ul>
            {course.lessons.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson._id);
              return (
                <li key={lesson._id} className="border-b dark:border-gray-700">
                  <button
                    onClick={() => setCurrentItem({ type: 'lesson', data: lesson })}
                    className={`w-full text-left p-4 text-sm transition-colors duration-200 ${
                      currentItem.type === 'lesson' && currentItem.data?._id === lesson._id
                        ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{index + 1}. {lesson.title}</span>
                      {isCompleted && <FaCheckCircle className="text-green-500" />}
                    </div>
                  </button>
                </li>
              );
            })}
            {quizzes.map((quiz) => (
              <li key={quiz._id} className="border-b dark:border-gray-700">
                <button
                  onClick={() => setCurrentItem({ type: 'quiz', data: quiz })}
                  className={`w-full text-left p-4 text-sm transition-colors duration-200 ${
                    currentItem.type === 'quiz' && currentItem.data?._id === quiz._id
                      ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <FaFileAlt className="inline mr-2" /> Quiz: {quiz.title}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Column 2: Main Content (Player/Quiz) */}
      <main className="flex-1 p-4 md:p-8">
        {currentItem.type === 'lesson' && currentItem.data && (
          <div>
            <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-xl mb-6">
              <iframe
                className="w-full h-full"
                src={getYouTubeEmbedUrl(currentItem.data.videoUrl)}
                title={currentItem.data.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold mb-2 dark:text-white">{currentItem.data.title}</h1>
                {!completedLessons.includes(currentItem.data._id) && (
                  <button 
                    onClick={() => handleLessonComplete(currentItem.data._id)}
                    className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
                  >
                    Mark as Complete
                  </button>
                )}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mt-2">{currentItem.data.content}</p>
            </div>
          </div>
        )}
        {currentItem.type === 'quiz' && currentItem.data && (
          <QuizPlayer quizId={currentItem.data._id} />
        )}
        {!currentItem.type && (
          <div className="flex items-center justify-center h-full text-center text-gray-500 dark:text-gray-400">
            Select a lesson or quiz to begin.
          </div>
        )}
      </main>

      {/* 3. Column 3: Live Chat */}
      <aside className="w-full lg:w-96 bg-gray-50 dark:bg-gray-800/50 p-4 lg:h-screen lg:sticky top-0 flex-shrink-0">
        <ChatBox courseId={courseId} />
      </aside>
    </div>
  );
}

export default CoursePlayerPage;