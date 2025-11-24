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
const AccountSettings = ({ userRole, onRoleChange, theme, onThemeChange, fontSize, onFontSizeChange, onLogout }) => {
  // State for user profile information
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@university.edu',
    role: userRole,
  });

  // State for password change form
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // State for UI feedback
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveStatus, setProfileSaveStatus] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordChangeStatus, setPasswordChangeStatus] = useState('');

  /**
   * Handle profile field changes
   */
  const handleProfileInputChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Handle password field changes
   */
  const handlePasswordInputChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Save profile changes
   */
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSaveStatus('');

    try {
      // Fake API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Updating profile:', profile);
      setProfileSaveStatus('Profile updated successfully!');
      if (profile.role !== userRole && onRoleChange) {
        onRoleChange(profile.role);
      }
    } catch (err) {
      setProfileSaveStatus('Error: Failed to update profile.');
      console.error('Profile update error:', err);
    } finally {
      setIsSavingProfile(false);
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
    setIsChangingPassword(true);
    setPasswordChangeStatus('');

    try {
      // Fake API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Changing password...');
      setPasswordChangeStatus('Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordChangeStatus('Error: Failed to change password.');
      console.error('Password change error:', err);
    } finally {
      setIsChangingPassword(false);
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