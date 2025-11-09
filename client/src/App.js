import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import ClassroomCopilot from './pages/ClassroomCopilot';
import CourseMaterials from './pages/CourseMaterials';
import AccountSettings from './pages/AccountSettings';
import './App.css';

/**
 * main application component
 * handles routing between pages and manages global state
 * implements the overall application structure and navigation
 */
function App() {
  // global state for user role (student or instructor)
  const [userRole, setUserRole] = useState('student');
  
  // global state for theme (light or dark)
  const [theme, setTheme] = useState('light');

  return (
    <Router>
      <div className={`app theme-${theme}`}>
        <AppContent 
          userRole={userRole} 
          setUserRole={setUserRole}
          theme={theme}
          setTheme={setTheme}
        />
      </div>
    </Router>
  );
}

/**
 * app content component with routing
 * separated to allow use of react-router hooks
 */
function AppContent({ userRole, setUserRole, theme, setTheme }) {
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
    // apply theme to document root
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <>
      {/* header component with navigation */}
      <Header
        title={pageTitle}
        onBack={handleBack}
        onUserClick={handleUserClick}
        theme={theme}
        onThemeChange={handleThemeChange}
      />

      {/* main navigation menu */}
      <nav className="nav-menu" role="navigation" aria-label="Main navigation">
        <Link 
          to="/" 
          className="nav-button"
          onClick={() => setPageTitle('Classroom Copilot')}
        >
          💬 Classroom Copilot
        </Link>
        <Link 
          to="/materials" 
          className="nav-button"
          onClick={() => setPageTitle('Course Materials')}
        >
          📚 Course Materials
        </Link>
        <Link 
          to="/settings" 
          className="nav-button"
          onClick={() => setPageTitle('Account Settings')}
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
            element={<CourseMaterials userRole={userRole} />} 
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
