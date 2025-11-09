import React from 'react';
import { Link } from 'react-router-dom';
import ChatInterface from '../components/ChatInterface';
import './StudentDashboard.css';

/**
 * student dashboard - clean chat-focused interface
 * provides ChatGPT-like experience for students
 * focuses solely on conversation with AI assistant
 */
const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
      <div className="dashboard-container">
        {/* dashboard header */}
        <div className="dashboard-header">
          <h1>🤖 AI Classroom Assistant</h1>
          <p className="dashboard-subtitle">
            Ask questions about your course materials
          </p>
        </div>

        {/* main chat interface - pure chat, no uploads */}
        <ChatInterface />

        {/* navigation to instructor view */}
        <div className="dashboard-footer">
          <Link to="/instructor" className="nav-link">
            👨‍🏫 Switch to Instructor Admin →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
