import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import ClassroomCopilot from './pages/ClassroomCopilot';
import CourseMaterials from './pages/CourseMaterials';
import AccountSettings from './pages/AccountSettings';
import LoginScreen from './pages/LoginScreen';
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
  // set initial state to null/'' so login screen shows first
  const [userRole, setUserRole] = useState(''); 
  
  // global state for login status
  const [isLoggedIn, setIsLoggedIn] = useState(false); // <-- new state

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
    // clear previous classes
    document.body.className = ''; 
    document.body.classList.add(`theme-${theme}`);
    document.body.classList.add(`font-size-${fontSize}`);
  }, [theme, fontSize]);

  /**
   * handle successful login
   * @param {string} role - the authenticated role ('student' or 'instructor')
   */
  const handleLoginSuccess = (role) => { 
    setUserRole(role);
    setIsLoggedIn(true);
  };
  
  /**
   * handle logout
   * resets login state and user role
   */
  const handleLogout = () => { 
    setIsLoggedIn(false);
    setUserRole('');
  };


  // render login screen if not logged in
  if (!isLoggedIn) {
    return (
      <Router>
         <div className="app">
           <LoginScreen onLogin={handleLoginSuccess} />
         </div>
      </Router>
    );
  }
  
  // render main app content if logged in
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
          courseWeeks={courseWeeks}
          setCourseWeeks={setCourseWeeks}
          onLogout={handleLogout} 
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
  courseWeeks, setCourseWeeks,
  onLogout 
}) {
  const navigate = useNavigate();
  const location = useLocation(); 

  /**
   * helper function to determine page title based on path
   * @param {string} path - current location path
   * @returns {string} corresponding page title
   */
  const getTitleFromPath = (path) => {
      if (path.startsWith('/materials')) return 'Course Materials';
      if (path.startsWith('/settings')) return 'Account Settings';
      return 'Classroom Copilot';
  };

  // set initial page title based on current URL path
  const [pageTitle, setPageTitle] = useState(getTitleFromPath(location.pathname));
  
  /**
   * FIX: Redirect to the root path immediately upon component mount if the path is not '/'
   * This ensures the user lands on the default page after logging in.
   */
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Check if the current URL is not the root path
    if (currentPath !== '/') {
        // Force navigation to the root path
        navigate('/', { replace: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on initial mount (which happens after login)


  /**
   * effect to ensure page title is updated whenever the location changes
   */
  useEffect(() => {
    setPageTitle(getTitleFromPath(location.pathname));
  }, [location.pathname]);
  
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

  // Define navigation links JSX to pass to Header
  const navigationLinks = (
    <>
      <Link
        to="/"
        className={`header-nav-link ${pageTitle === 'Classroom Copilot' ? 'active' : ''}`}
      >
        💬 Classroom Copilot
      </Link>
      <Link
        to="/materials"
        className={`header-nav-link ${pageTitle === 'Course Materials' ? 'active' : ''}`}
      >
        📚 Course Materials
      </Link>
      <Link
        to="/settings"
        className={`header-nav-link ${pageTitle === 'Account Settings' ? 'active' : ''}`}
      >
        ⚙️ Account Settings
      </Link>
    </>
  );

  return (
    <>
      {/* header component with navigation passed as prop */}
      <Header
        title={pageTitle}
        onBack={handleBack}
        onUserClick={handleUserClick}
        navigation={navigationLinks} /* Pass navigation links here */
      />

      {/* Removed the separate <nav> block */}

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
                onLogout={onLogout} 
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