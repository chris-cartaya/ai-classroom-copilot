import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import './LoginScreen.css';

/**
 * login screen component for temporary authentication
 * allows users to enter username/password or create a new account
 * @param {function} onLogin - callback function passed from app.js to set role and login status
 */
const LoginScreen = ({ onLogin }) => {
  // State to toggle between Login and Create Account modes
  const [isRegistering, setIsRegistering] = useState(false);

  // Login Form State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Common State
  const [error, setError] = useState('');

  /**
   * handles form submission for login
   */
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // temporary hardcoded credentials for student/instructor roles
    if (username === 'student' && password === 'password') {
      onLogin('student');
    } else if (username === 'instructor' && password === 'password') {
      onLogin('instructor');
    } else {
      setError('Incorrect username or password.');
    }
  };

  /**
   * handles form submission for account creation
   */
  const handleCreateAccount = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (regPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    // Simulate account creation success
    // For this demo, we'll just log them in as a student automatically
    console.log(`Creating account for ${firstName} ${lastName} (${regEmail})`);
    onLogin('student');
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError(''); // Clear errors when switching modes
  };

  return (
    <div className="login-screen">
      <Card className="login-card" title={isRegistering ? "Create Account" : "AI Classroom Co-Pilot Login"}>
        {/* error message display */}
        {error && (
          <div className="status-message status-error login-error" role="alert">
            ⚠ {error}
          </div>
        )}
        
        {isRegistering ? (
          /* CREATE ACCOUNT FORM */
          <form onSubmit={handleCreateAccount} className="login-form">
            <div className="name-row">
              <Input
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                required
                name="firstName"
              />
              <Input
                label="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
                name="lastName"
              />
            </div>

            <Input
              type="email"
              label="Email Address"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="jane.doe@university.edu"
              required
              name="regEmail"
            />

            <Input
              type="password"
              label="Password"
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="Create a password"
              required
              name="regPassword"
            />

            <Input
              type="password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              name="confirmPassword"
            />

            <div className="form-actions buttons-row">
              <Button
                type="submit"
                variant="primary"
                size="large"
                className="login-button flex-grow"
              >
                Sign Up
              </Button>
              <Button
                 type="button"
                 variant="primary" /* CHANGED: set to primary to match other buttons */
                 size="large"
                 onClick={toggleMode}
                 className="login-button flex-grow" /* CHANGED: added login-button class */
              >
                 Back to Login
              </Button>
            </div>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="login-form">
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="student or instructor"
              required
              name="username"
              id="username-input"
            />

            <Input
              type="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              required
              name="password"
              id="password-input"
            />

            <div className="form-actions buttons-row">
              <Button
                type="submit"
                variant="primary"
                size="large"
                className="login-button flex-grow"
              >
                Sign In
              </Button>
              
              <Button
                type="button"
                variant="primary"
                size="large"
                onClick={toggleMode}
                className="login-button flex-grow"
              >
                Create Account
              </Button>
            </div>
          </form>
        )}
      </Card>
      
      {!isRegistering && (
        <div className="login-hint">
            <small className="text-secondary">
              (temporary login: "student/password" or "instructor/password")
            </small>
        </div>
      )}
    </div>
  );
};

export default LoginScreen;