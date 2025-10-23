import React from 'react';
import './Card.css';

/**
 * reusable card component for displaying content in a contained box
 * provides consistent styling for content sections throughout the application
 * 
 * @param {node} children - content to display inside the card
 * @param {string} className - additional css classes
 * @param {string} title - optional title to display at top of card
 * @param {node} footer - optional footer content
 */
const Card = ({ children, className = '', title, footer }) => {
  return (
    <div className={`card ${className}`.trim()}>
      {/* optional card title */}
      {title && (
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
        </div>
      )}
      
      {/* main card content */}
      <div className="card-body">
        {children}
      </div>
      
      {/* optional card footer */}
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;