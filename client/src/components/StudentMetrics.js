import React from 'react';
import Card from './Card';
import './StudentMetrics.css';

const StudentMetrics = ({ metrics }) => {
  return (
    <Card className="student-metrics-card" title="Weekly Student Metrics">
      <div className="metrics-section">
        <h4>Most Frequently Asked Questions</h4>
        {metrics && metrics.length > 0 ? (
          <ul className="metrics-list">
            {metrics.map((metric, index) => (
              <li key={index} className="metric-item">
                <span className="metric-question">{metric.question}</span>
                <span className="metric-count">{metric.count} times</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-metrics">No questions have been asked this week.</p>
        )}
      </div>
    </Card>
  );
};

export default StudentMetrics;
