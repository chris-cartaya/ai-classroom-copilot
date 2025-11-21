import React, { useState } from 'react';
import './Input.css';

/**
 * reusable input component for text entry
 * supports various input types and includes label and error message display
 * includes password visibility toggle
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
  
  // state for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // determine actual input type based on visibility state
  const inputType = type === 'password' && showPassword ? 'text' : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className={`input-group ${className}`.trim()}>
      {/* label for the input field */}
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="required-indicator" aria-label="required">*</span>}
        </label>
      )}
      
      {/* input wrapper to position password toggle */}
      <div className="input-wrapper">
        <input
          type={inputType}
          id={inputId}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`input-field ${error ? 'input-error' : ''} ${type === 'password' ? 'input-with-toggle' : ''}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
        
        {/* password visibility toggle */}
        {type === 'password' && (
          <button
            type="button"
            className="password-toggle-btn"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? "Hide password" : "Show password"}
            disabled={disabled}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        )}
      </div>
      
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