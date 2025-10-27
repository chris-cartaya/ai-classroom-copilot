import React from 'react';
import './Input.css';

/**
 * reusable input component for text entry
 * supports various input types and includes label and error message display
 * 
 * @param {string} type - input type: 'text', 'email', 'password', 'number', etc.
 * @param {string} label - label text to display above input
 * @param {string} value - current input value
 * @param {function} onChange - callback function when input value changes
 * @param {string} placeholder - placeholder text
 * @param {boolean} required - whether the input is required
 * @param {boolean} disabled - whether the input is disabled
 * @param {string} error - error message to display below input
 * @param {string} id - unique identifier for the input
 * @param {string} name - name attribute for the input
 * @param {string} className - additional css classes
 */
const Input = ({
  type = 'text',
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  id,
  name,
  className = ''
}) => {
  // generate unique id if not provided
  const inputId = id || `input-${name || Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`input-group ${className}`.trim()}>
      {/* label for the input field */}
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="required-indicator" aria-label="required">*</span>}
        </label>
      )}
      
      {/* input field */}
      <input
        type={type}
        id={inputId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`input-field ${error ? 'input-error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
      />
      
      {/* error message display */}
      {error && (
        <span id={`${inputId}-error`} className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;