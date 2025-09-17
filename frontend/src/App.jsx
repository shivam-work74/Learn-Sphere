// src/App.js
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CreateCoursePage from './pages/CreateCoursePage';
import DashboardPage from './pages/DashboardPage';
import CoursePlayerPage from './pages/CoursePlayerPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import MyCoursesPage from './pages/instructor/MyCoursesPage';
import EditCoursePage from './pages/instructor/EditCoursePage';
import InstructorDashboardPage from './pages/instructor/InstructorDashboardPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage'; // 1. Import AdminDashboardPage
import InstructorRoute from './components/routing/InstructorRoute';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute'; // 2. Import AdminRoute
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/course/:id" element={<CourseDetailPage />} />

        {/* Instructor Only Routes */}
        <Route path="/instructor/dashboard" element={<InstructorRoute />}>
          <Route path="" element={<InstructorDashboardPage />} />
        </Route>
        <Route path="/create-course" element={<InstructorRoute />}>
          <Route path="" element={<CreateCoursePage />} />
        </Route>
        <Route path="/instructor/courses" element={<InstructorRoute />}>
          <Route path="" element={<MyCoursesPage />} />
        </Route>
        <Route path="/instructor/course/:id/edit" element={<InstructorRoute />}>
          <Route path="" element={<EditCoursePage />} />
        </Route>

        {/* Private User Routes */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="" element={<DashboardPage />} />
        </Route>
        <Route path="/learn/:id" element={<PrivateRoute />}>
          <Route path="" element={<CoursePlayerPage />} />
        </Route>
        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="" element={<ProfilePage />} />
        </Route>
        <Route path="/settings" element={<PrivateRoute />}>
          <Route path="" element={<SettingsPage />} />
        </Route>
        
        {/* 3. Add the new protected admin route */}
        <Route path="/admin/dashboard" element={<AdminRoute />}>
          <Route path="" element={<AdminDashboardPage />} />
        </Route>
      </Routes>
    </Layout>
  );
}

export default App;