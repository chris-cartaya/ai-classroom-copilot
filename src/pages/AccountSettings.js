import React, { useState } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import './AccountSettings.css';

/**
 * account settings page - user profile and preferences management
 * allows users to update their profile information and application settings
 * implements nfr-18: customization options for font size and theme
 */
const AccountSettings = ({ userRole, onRoleChange, theme, onThemeChange }) => {
  // state for user profile information
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: userRole,
    institution: 'University Name',
    department: 'Computer Science'
  });
  
  // state for preferences
  const [preferences, setPreferences] = useState({
    theme: theme || 'light',
    fontSize: 'medium',
    notifications: true,
    emailUpdates: false
  });
  
  // state for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // state for form submission
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * handle profile field changes
   */
  const handleProfileChange = (field, value) => {
    setProfile({
      ...profile,
      [field]: value
    });
  };

  /**
   * handle preference changes
   */
  const handlePreferenceChange = (field, value) => {
    setPreferences({
      ...preferences,
      [field]: value
    });
    
    // apply theme change immediately
    if (field === 'theme' && onThemeChange) {
      onThemeChange(value);
    }
  };

  /**
   * handle password field changes
   */
  const handlePasswordChange = (field, value) => {
    setPasswordData({
      ...passwordData,
      [field]: value
    });
  };

  /**
   * save profile changes
   */
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    setErrorMessage('');
    
    try {
      // TODO: replace with actual api call
      // await fetch('/api/profile', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(profile)
      // });
      
      // simulate api call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage('Profile updated successfully!');
      
      // update role if changed
      if (profile.role !== userRole && onRoleChange) {
        onRoleChange(profile.role);
      }
      
    } catch (err) {
      setErrorMessage('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * save preferences
   */
  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    setErrorMessage('');
    
    try {
      // TODO: replace with actual api call
      // await fetch('/api/preferences', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(preferences)
      // });
      
      // simulate api call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage('Preferences saved successfully!');
      
    } catch (err) {
      setErrorMessage('Failed to save preferences. Please try again.');
      console.error('Preferences save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * change password
   */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    setErrorMessage('');
    
    // validate password fields
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage('New passwords do not match.');
      setIsSaving(false);
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long.');
      setIsSaving(false);
      return;
    }
    
    try {
      // TODO: replace with actual api call
      // await fetch('/api/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword
      //   })
      // });
      
      // simulate api call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
    } catch (err) {
      setErrorMessage('Failed to change password. Please check your current password.');
      console.error('Password change error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="account-settings">
      <div className="container">
        {/* page header */}
        <div className="page-header">
          <h2>Account Settings</h2>
          <p className="page-description">
            Manage your profile information and application preferences
          </p>
        </div>

        {/* status messages */}
        {saveMessage && (
          <div className="status-message status-success" role="status">
            ✓ {saveMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="status-message status-error" role="alert">
            ⚠ {errorMessage}
          </div>
        )}

        {/* profile information card */}
        <Card className="settings-card" title="👤 Profile Information">
          <form onSubmit={handleSaveProfile}>
            <div className="form-grid">
              <Input
                label="Full Name"
                value={profile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
              
              <Input
                type="email"
                label="Email Address"
                value={profile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                placeholder="your.email@university.edu"
                required
              />
              
              <Input
                label="Institution"
                value={profile.institution}
                onChange={(e) => handleProfileChange('institution', e.target.value)}
                placeholder="Your university or institution"
              />
              
              <Input
                label="Department"
                value={profile.department}
                onChange={(e) => handleProfileChange('department', e.target.value)}
                placeholder="Your department"
              />
            </div>

            {/* role selector */}
            <div className="form-section">
              <label className="section-label">User Role</label>
              <div className="role-selector-inline">
                <label className="radio-option">
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={profile.role === 'student'}
                    onChange={(e) => handleProfileChange('role', e.target.value)}
                  />
                  <span>Student</span>
                </label>
                <label className="radio-option">
                  <input
                    type="radio"
                    name="role"
                    value="instructor"
                    checked={profile.role === 'instructor'}
                    onChange={(e) => handleProfileChange('role', e.target.value)}
                  />
                  <span>Instructor</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </Card>

        {/* preferences card (nfr-18) */}
        <Card className="settings-card" title="⚙️ Preferences">
          <form onSubmit={handleSavePreferences}>
            {/* theme selector */}
            <div className="form-section">
              <label className="section-label">Theme</label>
              <div className="theme-selector">
                <button
                  type="button"
                  className={`theme-option ${preferences.theme === 'light' ? 'active' : ''}`}
                  onClick={() => handlePreferenceChange('theme', 'light')}
                >
                  ☀️ Light
                </button>
                <button
                  type="button"
                  className={`theme-option ${preferences.theme === 'dark' ? 'active' : ''}`}
                  onClick={() => handlePreferenceChange('theme', 'dark')}
                >
                  🌙 Dark
                </button>
              </div>
            </div>

            {/* font size selector */}
            <div className="form-section">
              <label className="section-label">Font Size</label>
              <div className="font-size-selector">
                <button
                  type="button"
                  className={`size-option ${preferences.fontSize === 'small' ? 'active' : ''}`}
                  onClick={() => handlePreferenceChange('fontSize', 'small')}
                >
                  A
                </button>
                <button
                  type="button"
                  className={`size-option ${preferences.fontSize === 'medium' ? 'active' : ''}`}
                  onClick={() => handlePreferenceChange('fontSize', 'medium')}
                >
                  A
                </button>
                <button
                  type="button"
                  className={`size-option ${preferences.fontSize === 'large' ? 'active' : ''}`}
                  onClick={() => handlePreferenceChange('fontSize', 'large')}
                >
                  A
                </button>
              </div>
            </div>

            {/* notification preferences */}
            <div className="form-section">
              <label className="section-label">Notifications</label>
              <div className="checkbox-group">
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                  />
                  <span>Enable in-app notifications</span>
                </label>
                <label className="checkbox-option">
                  <input
                    type="checkbox"
                    checked={preferences.emailUpdates}
                    onChange={(e) => handlePreferenceChange('emailUpdates', e.target.checked)}
                  />
                  <span>Receive email updates</span>
                </label>
              </div>
            </div>

            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </div>
          </form>
        </Card>

        {/* password change card */}
        <Card className="settings-card" title="🔒 Change Password">
          <form onSubmit={handleChangePassword}>
            <Input
              type="password"
              label="Current Password"
              value={passwordData.currentPassword}
              onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
              placeholder="Enter your current password"
              required
            />
            
            <Input
              type="password"
              label="New Password"
              value={passwordData.newPassword}
              onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
              placeholder="Enter new password (min 8 characters)"
              required
            />
            
            <Input
              type="password"
              label="Confirm New Password"
              value={passwordData.confirmPassword}
              onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
              placeholder="Re-enter new password"
              required
            />

            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving}
              >
                {isSaving ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </form>
        </Card>

        {/* account actions card */}
        <Card className="settings-card danger-card" title="⚠️ Account Actions">
          <p className="danger-text">
            These actions are permanent and cannot be undone.
          </p>
          <div className="danger-actions">
            <Button variant="secondary">
              Export My Data
            </Button>
            <Button variant="secondary">
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AccountSettings;