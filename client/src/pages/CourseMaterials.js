import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import WeekCard from '../components/WeekCard';
import StudentMetrics from '../components/StudentMetrics';
import './CourseMaterials.css';
import '../components/WeekCard.css';

const CourseMaterials = ({ userRole, courseWeeks, setCourseWeeks }) => {
  const [studentMetrics, setStudentMetrics] = useState([]);

  // Utility function to format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const precision = i === 0 ? 0 : 1;
    return parseFloat((bytes / Math.pow(k, i)).toFixed(precision)) + ' ' + sizes[i];
  };

  // Utility function to get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'processed':
        return 'status-badge-success';
      case 'processing':
      case 'uploading':
        return 'status-badge-warning';
      case 'error':
        return 'status-badge-error';
      default:
        return 'status-badge-default';
    }
  };

  /**
   * renumbers week titles sequentially based on their position in the array.
   * returns a new array with updated titles.
   */
  const renumberWeeks = (weeks) => {
    return weeks.map((week, index) => ({
      ...week,
      title: `Module ${index + 1}` // Update title to use "Module"
    }));
  };

  useEffect(() => {
    // Fetch course materials from the backend when the component mounts
    fetch('http://localhost:8000/materials')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch materials');
        }
        return response.json();
      })
      // Apply renumbering to ensure "Module" terminology is used even if server sends "Week"
      .then(data => setCourseWeeks(renumberWeeks(data)))
      .catch(err => console.error("Error fetching course materials:", err));
  }, [setCourseWeeks]);

  /**
   * handle adding a new week, optionally at a specific index.
   * index: the position *before* which to insert the new week.
   * if index is null or undefined, adds to the end.
   */
  const handleAddWeek = (index = null) => {
    const newWeek = {
      id: `week-${Date.now()}`,
      title: `Module ${index !== null ? index + 1 : courseWeeks.length + 1}`, // Updated to Module
      materials: [],
    };

    let updatedWeeks;
    if (index !== null && index >= 0 && index <= courseWeeks.length) {
      updatedWeeks = [
        ...courseWeeks.slice(0, index),
        newWeek,
        ...courseWeeks.slice(index)
      ];
    } else {
      updatedWeeks = [...courseWeeks, newWeek];
    }

    setCourseWeeks(renumberWeeks(updatedWeeks));
  };

  /**
   * handle deleting a week and renumber subsequent weeks.
   */
  const handleDeleteWeek = (weekId) => {
    if (window.confirm('Are you sure you want to delete this module and all its materials? This action cannot be undone.')) {
      // Local delete only (prototype behavior)
      const updatedWeeks = courseWeeks.filter(week => week.id !== weekId);
      setCourseWeeks(renumberWeeks(updatedWeeks));
    }
  };

  /**
   * handle adding or updating material within a specific week
   */
  const handleAddOrUpdateMaterial = (weekId, newMaterial, isUpdate = false) => {
    setCourseWeeks(prevWeeks => {
      return prevWeeks.map(week => {
        if (week.id === weekId) {
          let updatedMaterials;
          if (isUpdate) {
            // FIX: Match by ID OR Name to allow swapping temp IDs with real IDs after upload
            updatedMaterials = week.materials.map(mat =>
              (mat.id === newMaterial.id || mat.name === newMaterial.name) ? newMaterial : mat
            );
          } else {
            const exists = week.materials.some(mat => mat.name === newMaterial.name);
            updatedMaterials = exists ? week.materials : [...week.materials, newMaterial];
          }
          return { ...week, materials: updatedMaterials };
        }
        return week;
      });
    });
  };

  /**
   * handle deleting material from a specific week
   */
  const handleDeleteMaterial = (weekId, materialId) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      // Local delete only (prototype behavior)
      setCourseWeeks(prevWeeks => {
        return prevWeeks.map(week => {
          if (week.id === weekId) {
            return {
              ...week,
              materials: week.materials.filter(material => material.id !== materialId)
            };
          }
          return week;
        });
      });
    }
  };

  useEffect(() => {
    if (userRole === 'instructor') {
      // Placeholder for student metrics
    }
  }, [userRole]);

  return (
    <div className="course-materials-page">
      <div className="container">
        <div className="page-header">
          <h2>Course Materials Management</h2>
          <p className="page-description">
            {userRole === 'instructor'
              ? 'Organize your course content into modules. Upload PPTX files for each module.'
              : 'Explore the course materials organized by your instructor.'
            }
          </p>
        </div>

        {userRole === 'instructor' && <StudentMetrics metrics={studentMetrics} />}

        <div className="weeks-list">
          {courseWeeks.length === 0 ? (
            <div className="empty-state">
              <p>No modules have been added yet.</p>
              {userRole === 'instructor' && (
                <p>Click "Add Module" below to start organizing your materials.</p>
              )}
            </div>
          ) : (
            courseWeeks.map((week, index) => (
              <React.Fragment key={week.id}>
                {userRole === 'instructor' && (
                   <div className="add-week-divider">
                     <Button
                       variant="outline" 
                       size="small"
                       onClick={() => handleAddWeek(index)}
                       ariaLabel={`Add a new module before ${week.title}`}
                       title={`Add module before ${week.title}`}
                     >
                       ＋ Add Module Here
                     </Button>
                   </div>
                )}
                <WeekCard
                  week={week}
                  userRole={userRole}
                  onDeleteWeek={handleDeleteWeek}
                  onAddMaterial={handleAddOrUpdateMaterial}
                  onDeleteMaterial={handleDeleteMaterial}
                  formatFileSize={formatFileSize}
                  getStatusBadgeClass={getStatusBadgeClass}
                />
              </React.Fragment>
            ))
          )}
        </div>

        {userRole === 'instructor' && (
          <div className="add-week-section">
            <Button
              variant="success"
              size="large"
              onClick={() => handleAddWeek(courseWeeks.length)} 
              ariaLabel="Add a new module to the end of the course materials"
            >
              ➕ Add Module at End
            </Button>
          </div>
        )}

      </div>
    </div>
  );
};

export default CourseMaterials;