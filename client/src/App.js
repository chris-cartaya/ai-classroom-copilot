import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/Header';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AccountSettings from './pages/AccountSettings';
import './App.css';

/**
 * main application component
 * handles routing between dashboards and manages global state
 * implements the overall application structure and navigation
 */
function App() {
  // global state for theme (light or dark)
  const [theme, setTheme] = useState('light');

  return (
    <Router>
      <div className={`app theme-${theme}`}>
        <AppContent
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
function AppContent({ theme, setTheme }) {
  const navigate = useNavigate();

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
        title="AI Classroom Assistant"
        onBack={handleBack}
        onUserClick={handleUserClick}
        theme={theme}
        onThemeChange={handleThemeChange}
      />

      {/* main content area with routing */}
      <main className="main-content" role="main">
        <Routes>
          {/* default redirect to student dashboard */}
          <Route path="/" element={<Navigate to="/student" replace />} />

          {/* student dashboard - chat-focused interface */}
          <Route
            path="/student"
            element={<StudentDashboard />}
          />

          {/* instructor dashboard - admin-focused interface */}
          <Route
            path="/instructor"
            element={<InstructorDashboard />}
          />

          {/* account settings page - accessible from both dashboards */}
          <Route
            path="/settings"
            element={
              <AccountSettings
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
