import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import './AccountSettings.css';

/**
 * account settings page component
 * allows user to manage preferences (theme, font size) and perform account actions.
 * @param {string} userRole - the current role of the user ('student' or 'instructor')
 * @param {function} onRoleChange - callback function to update the user's role
 * @param {string} theme - the current theme ('light' or 'dark')
 * @param {function} onThemeChange - callback function to update the theme
 * @param {string} fontSize - the current font size ('small', 'medium', or 'large')
 * @param {function} onFontSizeChange - callback function to update the font size
 * @param {function} onLogout - callback function to handle user logout
 */
const AccountSettings = ({ userRole, onRoleChange, theme, onThemeChange, fontSize, onFontSizeChange }) => {
  // state for user profile information
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: userRole,
    institution: 'University Name',
    department: 'Computer Science'
  });

  // state for preferences - now uses props for theme and font size
  const [preferences, setPreferences] = useState({
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
   * handle preference changes (for checkboxes)
   */
  const handleCheckboxChange = (field, value) => {
    setPreferences({
      ...preferences,
      [field]: value
    });
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
      // await fetch('http://localhost:8000/api/profile', {
      //   method: 'PUT',
      //   headers: { 'content-type': 'application/json' },
      //   body: JSON.stringify(profile)
      // });

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
   * save preferences (only notifications for now)
   */
  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    setErrorMessage('');

    try {
      // TODO: replace with actual api call for preferences (theme/font size handled directly)
      // await fetch('http://localhost:8000/api/preferences', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(preferences) // send only notification prefs
      // });

      setSaveMessage('Preferences saved successfully!');

    } catch (err) {
      setErrorMessage('Failed to save preferences. Please try again.');
      console.error('Preferences save error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // mock password change handler
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordChangeStatus('');

    if (newPassword !== confirmPassword) {
      setPasswordChangeStatus('Error: New passwords do not match.');
      return;
    }

    try {
      // TODO: replace with actual api call
      // await fetch('http://localhost:8000/api/change-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword: passwordData.currentPassword,
      //     newPassword: passwordData.newPassword
      //   })
      // });

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

  // NOTE: isActiveAndLight and the className logic is removed from this file.

  return (
    <div className="account-settings">
      {/* profile management card */}
      <Card title="Profile Management" className="settings-card">
        <form onSubmit={handleProfileUpdate} className="settings-form">
          <Input
            label="Full Name"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            id="profile-name"
          />
          <Input
            label="Email Address"
            type="email"
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
            id="profile-email"
            disabled // email is usually non-editable
          />
          <div className="form-actions mt-lg">
            <Button
              type="submit"
              variant="primary"
              disabled={isSavingProfile}
            >
              {isSavingProfile ? 'Saving...' : 'Update Profile'}
            </Button>
            {profileSaveStatus && (
              <span className={`status-message ${profileSaveStatus.startsWith('Error') ? 'status-error' : 'status-success'} ml-md`}>
                {profileSaveStatus}
              </span >
            )}
          </div>
        </form>
      </Card>

      {/* password change card */}
      <Card title="Change Password" className="settings-card">
        <form onSubmit={handleChangePassword} className="settings-form">
          <Input
            label="Old Password"
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            id="old-password"
          />
          <Input
            label="New Password (min 6 chars)"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            id="new-password"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            id="confirm-password"
          />
          <div className="form-actions mt-lg">
            <Button
              type="submit"
              variant="primary" /* CHANGED: from secondary to primary for consistency */
              disabled={isChangingPassword}
            >
              {isChangingPassword ? 'Processing...' : 'Change Password'}
            </Button>
            {passwordChangeStatus && (
              <span className={`status-message ${passwordChangeStatus.startsWith('Error') ? 'status-error' : 'status-success'} ml-md`}>
                {passwordChangeStatus}
              </span >
            )}
          </div>
        </form>
      </Card>

      {/* display/preference settings card (Restructuring markup for CSS style) */}
      <Card title="Display Preferences" className="settings-card">
        <div className="setting-group">
          <label className="setting-label">Theme</label>
          {/* Apply class 'full-width-options' for horizontal full-width layout */}
          <div className="setting-options full-width-options theme-options"> 
            <Button
              variant={theme === 'light' ? 'primary' : 'secondary'}
              onClick={() => onThemeChange('light')}
            >
              Light ☀️
            </Button>
            <Button
              variant={theme === 'dark' ? 'primary' : 'secondary'}
              onClick={() => onThemeChange('dark')}
            >
              Dark 🌙
            </Button>
          </div>
        </div>

        <div className="setting-group mt-lg">
          <label className="setting-label">Font Size</label>
          {/* Apply class 'full-width-options' for horizontal full-width layout */}
          <div className="setting-options full-width-options font-size-options">
            <Button
              variant={fontSize === 'small' ? 'primary' : 'secondary'}
              onClick={() => onFontSizeChange('small')}
            >
              Small A
            </Button>
            <Button
              variant={fontSize === 'medium' ? 'primary' : 'secondary'}
              onClick={() => onFontSizeChange('medium')}
            >
              Medium A
            </Button>
            <Button
              variant={fontSize === 'large' ? 'primary' : 'secondary'}
              onClick={() => onFontSizeChange('large')}
            >
              Large A
            </Button>
          </div>
        </div>
      </Card>

      {/* account actions card (Simplified markup for buttons next to each other) */}
      <Card title="Account Actions" className="settings-card danger-zone">
        
        {/* Logout and Delete Button Group */}
        <div className="setting-group account-actions-group">
          
          <div className="action-buttons-row">
            {/* Logout Button (Red, next to Delete) */}
            <Button
              variant="danger" // Set to danger as requested
              onClick={onLogout} 
            >
              Logout
            </Button>

            {/* Delete Account Button */}
            <Button
              variant="danger"
              onClick={() => console.log('delete account clicked')}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AccountSettings;