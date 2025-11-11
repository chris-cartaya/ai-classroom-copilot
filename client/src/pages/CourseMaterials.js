import React, { useState, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import WeekCard from '../components/WeekCard'; // Import the WeekCard component
import './CourseMaterials.css'; // Keep this for overall layout
import '../components/WeekCard.css'; // Also import WeekCard styles for global access

/**
 * course materials page - file upload interface for instructors
 * allows instructors to organize materials by week, add/delete weeks, and upload files.
 * implements fr-2: allow instructors to upload supported file types
 * receives courseWeeks state and setter function from parent (App.js)
 */
const CourseMaterials = ({ userRole, courseWeeks, setCourseWeeks }) => {
<<<<<<< Updated upstream
=======
  const [studentMetrics, setStudentMetrics] = useState([]);

  useEffect(() => {
    // Fetch course materials from the backend when the component mounts
    const fetchMaterials = async () => {
      try {
        const res = await fetch('http://localhost:8000/materials');
        if (!res.ok) return; // keep current state on error
        const weeks = await res.json();
        // Map size_bytes -> human readable size
        const mapped = (weeks || []).map((week) => ({
          id: week.id,
          title: week.title,
          materials: (week.materials || []).map((m) => ({
            id: m.id,
            name: m.name,
            size: typeof m.size_bytes === 'number' ? formatFileSize(m.size_bytes) : (m.size || '0 Bytes'),
            uploadDate: m.uploadDate || '',
            status: m.status || 'processed'
          }))
        }));
        setCourseWeeks(renumberWeeks(mapped));
      } catch (e) {
        // ignore fetch errors for now
      }
    };
    fetchMaterials();
  }, [setCourseWeeks]);
>>>>>>> Stashed changes

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
      title: `Week ${index + 1}` // Update title based on index
    }));
  };

  /**
   * handle adding a new week, optionally at a specific index.
   * index: the position *before* which to insert the new week.
   * if index is null or undefined, adds to the end.
   */
  const handleAddWeek = (index = null) => {
    const newWeek = {
      id: `week-${Date.now()}`,
      title: `Week ${index !== null ? index + 1 : courseWeeks.length + 1}`, // Temporary title
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

    // Renumber all weeks after adding/inserting
    setCourseWeeks(renumberWeeks(updatedWeeks));
  };

  /**
   * handle deleting a week and renumber subsequent weeks.
   */
  const handleDeleteWeek = (weekId) => {
    if (window.confirm('Are you sure you want to delete this week and all its materials? This action cannot be undone.')) {
      const updatedWeeks = courseWeeks.filter(week => week.id !== weekId);
      // Renumber remaining weeks
      setCourseWeeks(renumberWeeks(updatedWeeks));
    }
  };

  /**
   * handle adding or updating material within a specific week
   * isUpdate flag indicates if it's an update to an existing material or a new one
   */
  const handleAddOrUpdateMaterial = (weekId, newMaterial, isUpdate = false) => {
    setCourseWeeks(prevWeeks => {
      return prevWeeks.map(week => {
        if (week.id === weekId) {
          let updatedMaterials;
          if (isUpdate) {
            // update existing material
            updatedMaterials = week.materials.map(mat =>
              mat.id === newMaterial.id ? newMaterial : mat
            );
          } else {
            // add new material - make sure it doesn't already exist by name (simple check)
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


  return (
    <div className="course-materials-page">
      <div className="container">
        {/* page header */}
        <div className="page-header">
          <h2>Course Materials Management</h2>
          <p className="page-description">
            {userRole === 'instructor'
              ? 'Organize your course content into weeks. Upload PPTX, PDF, and DOCX files for each week.'
              : 'Explore the course materials organized by your instructor.'
            }
          </p>
        </div>

        {/* List of Week Cards */}
        <div className="weeks-list">
          {courseWeeks.length === 0 ? (
            <div className="empty-state">
              <p>No weeks have been added yet.</p>
              {userRole === 'instructor' && (
                <p>Click "Add Week" below to start organizing your materials.</p>
              )}
            </div>
          ) : (
            courseWeeks.map((week, index) => (
              <React.Fragment key={week.id}>
                {/* "Add Week Here" button for instructors, appears *before* each week */}
                {userRole === 'instructor' && (
                   <div className="add-week-divider">
                     <Button
                       variant="outline" /* New variant needed */
                       size="small"
                       onClick={() => handleAddWeek(index)} // Pass the index to insert before
                       ariaLabel={`Add a new week before ${week.title}`}
                       title={`Add week before ${week.title}`}
                     >
                       ＋ Add Week Here
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

        {/* Add Week Button (at the end) - only for instructors */}
        {userRole === 'instructor' && (
          <div className="add-week-section">
            <Button
              variant="success"
              size="large"
              onClick={() => handleAddWeek(courseWeeks.length)} // Pass length to add at the end
              ariaLabel="Add a new week to the end of the course materials"
            >
              ➕ Add Week at End
            </Button>
          </div>
        )}

        {/* Removed the Information Card ("How It Works") section */}

      </div>
    </div>
  );
};

export default CourseMaterials;