import React from 'react';
import './Header.css';

/**
 * header component that displays the navigation bar at the top of the application
 * matches the purple header design from the reference image
 * 
 * @param {string} title - the page title to display in the center
 * @param {function} onBack - callback function when back button is clicked
 * @param {function} onUserClick - callback function when user profile button is clicked
 */
const Header = ({ title, onBack, onUserClick }) => {
  return (
    <header className="app-header" role="banner">
      <div className="header-content">
        {/* back button - only shown if onBack callback is provided */}
        {onBack && (
          <button 
            className="back-button" 
            onClick={onBack}
            aria-label="Go back to previous page"
          >
            ←
          </button>
        )}
        
        {/* page title displayed in center of header */}
        <h1 className="page-title">{title}</h1>
        
        {/* user profile button - only shown if onUserClick callback is provided */}
        {onUserClick && (
          <button 
            className="user-button" 
            onClick={onUserClick}
            aria-label="Open user profile menu"
          >
            👤
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;