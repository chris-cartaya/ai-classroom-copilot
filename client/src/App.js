import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import ClassroomCopilot from './pages/ClassroomCopilot';
import CourseMaterials from './pages/CourseMaterials';
import AccountSettings from './pages/AccountSettings';
import './App.css';

/**
 * main application component
 * handles routing between pages and manages global state like theme, font size,
 * user role, and the list of uploaded course materials.
 * applies theme and font size classes to the root element
 * implements the overall application structure and navigation
 */
function App() {
  // global state for user role (student or instructor)
  const [userRole, setUserRole] = useState('student');

  // global state for theme (light or dark)
  const [theme, setTheme] = useState('light');

  // global state for font size (small, medium, large)
  const [fontSize, setFontSize] = useState('medium');

  // global state for uploaded course materials, now structured by weeks
  const [courseWeeks, setCourseWeeks] = useState([
    {
      id: 'week-1',
      title: 'Week 1',
      materials: [
        // Example material, you can remove these or leave for initial testing
        { id: 'mat-1', name: 'Introduction to AI.pptx', size: '2.5 MB', uploadDate: '2023-01-15', status: 'processed' },
        { id: 'mat-2', name: 'Machine Learning Basics.pdf', size: '1.2 MB', uploadDate: '2023-01-18', status: 'processed' },
      ],
    },
    {
      id: 'week-2',
      title: 'Week 2',
      materials: [
        { id: 'mat-3', name: 'Advanced AI Concepts.docx', size: '3.1 MB', uploadDate: '2023-01-22', status: 'processed' },
      ],
    },
  ]);


  // effect to apply theme and font size classes to the body element
  useEffect(() => {
    document.body.className = ''; // clear previous classes
    document.body.classList.add(`theme-${theme}`);
    document.body.classList.add(`font-size-${fontSize}`);
  }, [theme, fontSize]);

  return (
    <Router>
      <div className="app">
        <AppContent
          userRole={userRole}
          setUserRole={setUserRole}
          theme={theme}
          setTheme={setTheme}
          fontSize={fontSize}
          setFontSize={setFontSize}
          courseWeeks={courseWeeks} // Pass new state down
          setCourseWeeks={setCourseWeeks} // Pass setter down
        />
      </div>
    </Router>
  );
}

/**
 * app content component with routing
 * separated to allow use of react-router hooks
 */
function AppContent({
  userRole, setUserRole,
  theme, setTheme,
  fontSize, setFontSize,
  courseWeeks, setCourseWeeks // Receive new props
}) {
  const navigate = useNavigate();

  // current page title for header
  const [pageTitle, setPageTitle] = useState('Classroom Copilot');

  /**
   * handle back navigation
   */
  const handleBack = () => {
    navigate(-1);
  };

  /**
   * handle user profile click
   */
  const handleUserClick = () => {
    navigate('/settings');
  };

  /**
   * handle role change
   */
  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
  };

  /**
   * handle theme change
   */
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  /**
   * handle font size change
   */
  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
  };


  return (
    <>
      {/* header component with navigation */}
      <Header
        title={pageTitle}
        onBack={handleBack}
        onUserClick={handleUserClick}
      />

      {/* main navigation menu */}
      <nav className="nav-menu" role="navigation" aria-label="Main navigation">
        <Link
          to="/"
          className={`nav-button ${pageTitle === 'Classroom Copilot' ? 'active' : ''}`}
          onClick={() => setPageTitle('Classroom Copilot')}
          aria-current={pageTitle === 'Classroom Copilot' ? 'page' : undefined}
        >
          💬 Classroom Copilot
        </Link>
        <Link
          to="/materials"
          className={`nav-button ${pageTitle === 'Course Materials' ? 'active' : ''}`}
          onClick={() => setPageTitle('Course Materials')}
          aria-current={pageTitle === 'Course Materials' ? 'page' : undefined}
        >
          📚 Course Materials
        </Link>
        <Link
          to="/settings"
          className={`nav-button ${pageTitle === 'Account Settings' ? 'active' : ''}`}
          onClick={() => setPageTitle('Account Settings')}
          aria-current={pageTitle === 'Account Settings' ? 'page' : undefined}
        >
          ⚙️ Account Settings
        </Link>
      </nav>

      {/* role selector - allows switching between student and instructor views */}
      <div className="role-selector">
        <h3>Current Role</h3>
        <div className="role-buttons">
          <button
            className={`role-button ${userRole === 'student' ? 'active' : ''}`}
            onClick={() => handleRoleChange('student')}
            aria-pressed={userRole === 'student'}
          >
            👨‍🎓 Student
          </button>
          <button
            className={`role-button ${userRole === 'instructor' ? 'active' : ''}`}
            onClick={() => handleRoleChange('instructor')}
            aria-pressed={userRole === 'instructor'}
          >
            👨‍🏫 Instructor
          </button>
        </div>
      </div>

      {/* main content area with routing */}
      <main className="main-content" role="main">
        <Routes>
          {/* classroom copilot page - main chat interface */}
          <Route
            path="/"
            element={<ClassroomCopilot />}
          />

          {/* course materials page - file upload and management */}
          <Route
            path="/materials"
            // pass courseWeeks state and setter down to CourseMaterials
            element={<CourseMaterials
                       userRole={userRole}
                       courseWeeks={courseWeeks}
                       setCourseWeeks={setCourseWeeks}
                     />}
          />

          {/* account settings page - profile and preferences */}
          <Route
            path="/settings"
            element={
              <AccountSettings
                userRole={userRole}
                onRoleChange={handleRoleChange}
                theme={theme}
                onThemeChange={handleThemeChange}
                fontSize={fontSize}
                onFontSizeChange={handleFontSizeChange}
              />
            }
          />
        </Routes>
      </main>

      {/* footer */}
      <footer className="app-footer" role="contentinfo">
        <div className="container">
          <p>&copy; 2025 AI Classroom Co-Pilot. Built with React and FastAPI.</p>
          <p className="footer-links">
            <a href="#privacy">Privacy Policy</a> |
            <a href="#terms">Terms of Service</a> |
            <a href="#help">Help & Support</a>
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;