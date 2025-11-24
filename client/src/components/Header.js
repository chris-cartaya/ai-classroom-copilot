import React from 'react';
import './Header.css';

/**
 * header component that displays the navigation bar at the top of the application
 *
 * @param {string} title - the page title (used as fallback or for mobile)
 * @param {function} onBack - callback function when back button is clicked
 * @param {node} navigation - navigation links to display in the center
 */
const Header = ({ title, onBack, navigation }) => {
  return (
    <header className="app-header" role="banner">
      <div className="header-content">
        {/* back button - only shown if onBack callback is provided */}
        {onBack ? (
          <button
            className="back-button"
            onClick={onBack}
            aria-label="Go back to previous page"
          >
            ←
          </button>
        ) : (
            /* spacer to keep center alignment if back button is missing */
            <div className="header-spacer"></div>
        )}

        {/* navigation section - replaces title on desktop if provided */}
        <div className="header-center">
            {navigation ? (
                <nav className="header-nav">
                    {navigation}
                </nav>
            ) : (
                <h1 className="page-title">{title}</h1>
            )}
        </div>

        {/* Spacer to balance the layout (replaces the user icon) */}
        <div className="header-spacer"></div>
      </div>
    </header>
  );
};

export default Header;