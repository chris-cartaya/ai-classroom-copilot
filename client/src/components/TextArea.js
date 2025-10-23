import React from 'react';
import './TextArea.css';

/**
 * reusable textarea component for multi-line text entry
 * used for question input and longer text fields
 * 
 * @param {string} label - label text to display above textarea
 * @param {string} value - current textarea value
 * @param {function} onChange - callback function when textarea value changes
 * @param {string} placeholder - placeholder text
 * @param {number} rows - number of visible text rows
 * @param {boolean} required - whether the textarea is required
 * @param {boolean} disabled - whether the textarea is disabled
 * @param {string} error - error message to display below textarea
 * @param {string} id - unique identifier for the textarea
 * @param {string} name - name attribute for the textarea
 * @param {string} className - additional css classes
 * @param {number} maxLength - maximum character length
 */
const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
  required = false,
  disabled = false,
  error,
  id,
  name,
  className = '',
  maxLength
}) => {
  // generate unique id if not provided
  const textareaId = id || `textarea-${name || Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`textarea-group ${className}`.trim()}>
      {/* label for the textarea field */}
      {label && (
        <label htmlFor={textareaId} className="textarea-label">
          {label}
          {required && <span className="required-indicator" aria-label="required">*</span>}
        </label>
      )}
      
      {/* textarea field */}
      <textarea
        id={textareaId}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        className={`textarea-field ${error ? 'textarea-error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${textareaId}-error` : undefined}
      />
      
      {/* character count display if maxLength is set */}
      {maxLength && (
        <div className="character-count">
          {value?.length || 0} / {maxLength}
        </div>
      )}
      
      {/* error message display */}
      {error && (
        <span id={`${textareaId}-error`} className="error-message" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};

export default TextArea;