import React from 'react';
import './Button.css';

/**
 * reusable button component with multiple style variants
 * supports primary (purple), secondary (white with purple border), and success (green) styles
 * 
 * @param {string} variant - button style variant: 'primary', 'secondary', or 'success'
 * @param {string} size - button size: 'small', 'medium', or 'large'
 * @param {boolean} disabled - whether the button is disabled
 * @param {function} onClick - callback function when button is clicked
 * @param {string} type - html button type: 'button', 'submit', or 'reset'
 * @param {node} children - button content (text or elements)
 * @param {string} className - additional css classes
 * @param {string} ariaLabel - accessibility label for screen readers
 */
const Button = ({ 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  children,
  className = '',
  ariaLabel
}) => {
  // combine base class with variant, size, and custom classes
  const buttonClass = `btn btn-${variant} btn-${size} ${className}`.trim();
  
  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
};

export default Button;