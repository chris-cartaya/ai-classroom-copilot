import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import './AccountSettings.css';

/**
 * Account settings page component
 * Allows user to manage preferences and perform account actions.
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
   * Handle password change submission
   */
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
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

  return (
    <div className="account-settings">
      {/* Profile Management Card */}
      <Card title="Profile Management" className="settings-card">
        <form onSubmit={handleProfileUpdate} className="settings-form">
          <Input
            label="Full Name"
            value={profile.name}
            onChange={(e) => handleProfileInputChange('name', e.target.value)}
            id="profile-name"
          />
          <Input
            label="Email Address"
            type="email"
            value={profile.email}
            onChange={(e) => handleProfileInputChange('email', e.target.value)}
            id="profile-email"
            disabled // Email is usually non-editable
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
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* Password Change Card */}
      <Card title="Change Password" className="settings-card">
        <form onSubmit={handleChangePassword} className="settings-form">
          <Input
            label="Old Password"
            type="password"
            value={passwordData.oldPassword}
            onChange={(e) => handlePasswordInputChange('oldPassword', e.target.value)}
            required
            id="old-password"
          />
          <Input
            label="New Password (min 6 chars)"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) => handlePasswordInputChange('newPassword', e.target.value)}
            required
            id="new-password"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) => handlePasswordInputChange('confirmPassword', e.target.value)}
            required
            id="confirm-password"
          />
          <div className="form-actions mt-lg">
            <Button
              type="submit"
              variant="primary"
              disabled={isChangingPassword}
            >
              {isChangingPassword ? 'Processing...' : 'Change Password'}
            </Button>
            {passwordChangeStatus && (
              <span className={`status-message ${passwordChangeStatus.startsWith('Error') ? 'status-error' : 'status-success'} ml-md`}>
                {passwordChangeStatus}
              </span>
            )}
          </div>
        </form>
      </Card>

      {/* Display Preferences Card */}
      <Card title="Display Preferences" className="settings-card">
        <div className="setting-group">
          <label className="setting-label">Theme</label>
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

      {/* Account Actions Card */}
      <Card title="Account Actions" className="settings-card danger-zone">
        <div className="setting-group account-actions-group">
          <div className="action-buttons-row">
            <Button
              variant="danger"
              onClick={onLogout}
            >
              Logout
            </Button>
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