import React from 'react';
import { Link } from 'react-router-dom';
import CourseMaterials from './CourseMaterials';
import './InstructorDashboard.css';

/**
 * instructor dashboard - admin-focused interface
 * provides administrative tools for instructors
 * focuses on course management, file uploads, and settings
 */
const InstructorDashboard = () => {
  return (
    <div className="instructor-dashboard">
      <div className="dashboard-container">
        {/* dashboard header */}
        <div className="dashboard-header">
          <h1>👨‍🏫 Instructor Admin Panel</h1>
          <p className="dashboard-subtitle">
            Manage course materials and administrative settings
          </p>
        </div>

        {/* admin tools grid */}
        <div className="admin-tools">
          {/* course materials management */}
          <div className="admin-section">
            <div className="section-header">
              <h2>📚 Course Materials</h2>
              <p>Upload and manage course documents for AI processing</p>
            </div>
            <div className="section-content">
              <CourseMaterials userRole="instructor" />
            </div>
          </div>

          {/* quick actions */}
          <div className="admin-section">
            <div className="section-header">
              <h2>⚡ Quick Actions</h2>
              <p>Common administrative tasks</p>
            </div>
            <div className="quick-actions">
              <Link to="/settings" className="action-button">
                ⚙️ Account Settings
              </Link>
              <button className="action-button secondary">
                📊 View Analytics
              </button>
              <button className="action-button secondary">
                👥 Manage Students
              </button>
            </div>
          </div>
        </div>

        {/* navigation to student view */}
        <div className="dashboard-footer">
          <Link to="/student" className="nav-link">
            💬 Switch to Student Chat ←
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
