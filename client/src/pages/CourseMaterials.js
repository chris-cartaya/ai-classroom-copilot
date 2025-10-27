import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import WeekCard from '../components/WeekCard';
import StudentMetrics from '../components/StudentMetrics';
import './CourseMaterials.css';
import '../components/WeekCard.css';

const CourseMaterials = ({ userRole, courseWeeks, setCourseWeeks }) => {
  const [studentMetrics, setStudentMetrics] = useState([]);

  useEffect(() => {
    // TODO: Fetch course materials from the backend when the component mounts
    // fetch('http://localhost:8000/api/materials')
    //   .then(response => response.json())
    //   .then(data => setCourseWeeks(data));
  }, [setCourseWeeks]);

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
    // TODO: Make an API call to the backend to add a new week
    // fetch('http://localhost:8000/api/materials/weeks', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ index })
    // }).then(response => response.json()).then(newWeek => {
    //   let updatedWeeks;
    //   if (index !== null && index >= 0 && index <= courseWeeks.length) {
    //     updatedWeeks = [
    //       ...courseWeeks.slice(0, index),
    //       newWeek,
    //       ...courseWeeks.slice(index)
    //     ];
    //   } else {
    //     updatedWeeks = [...courseWeeks, newWeek];
    //   }
    //   setCourseWeeks(renumberWeeks(updatedWeeks));
    // });

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
      // TODO: Make an API call to the backend to delete a week
      // fetch(`http://localhost:8000/api/materials/weeks/${weekId}`, { method: 'DELETE' })
      //   .then(() => {
      //     const updatedWeeks = courseWeeks.filter(week => week.id !== weekId);
      //     setCourseWeeks(renumberWeeks(updatedWeeks));
      //   });

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
    // TODO: Make an API call to the backend to add or update a material
    // const url = isUpdate
    //   ? `http://localhost:8000/api/materials/weeks/${weekId}/materials/${newMaterial.id}`
    //   : `http://localhost:8000/api/materials/weeks/${weekId}/materials`;
    // const method = isUpdate ? 'PUT' : 'POST';
    //
    // fetch(url, {
    //   method,
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(newMaterial)
    // }).then(response => response.json()).then(updatedMaterial => {
    //   setCourseWeeks(prevWeeks => {
    //     return prevWeeks.map(week => {
    //       if (week.id === weekId) {
    //         let updatedMaterials;
    //         if (isUpdate) {
    //           updatedMaterials = week.materials.map(mat =>
    //             mat.id === updatedMaterial.id ? updatedMaterial : mat
    //           );
    //         } else {
    //           const exists = week.materials.some(mat => mat.name === updatedMaterial.name);
    //           updatedMaterials = exists ? week.materials : [...week.materials, updatedMaterial];
    //         }
    //         return { ...week, materials: updatedMaterials };
    //       }
    //       return week;
    //     });
    //   });
    // });

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
      // TODO: Make an API call to the backend to delete a material
      // fetch(`http://localhost:8000/api/materials/weeks/${weekId}/materials/${materialId}`, { method: 'DELETE' })
      //   .then(() => {
      //     setCourseWeeks(prevWeeks => {
      //       return prevWeeks.map(week => {
      //         if (week.id === weekId) {
      //           return {
      //             ...week,
      //             materials: week.materials.filter(material => material.id !== materialId)
      //           };
      //         }
      //         return week;
      //       });
      //     });
      //   });

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
      // TODO: Fetch student metrics from the backend
      // fetch('http://localhost:8000/api/metrics/weekly')
      //   .then(response => response.json())
      //   .then(data => setStudentMetrics(data));
    }
  }, [userRole]);

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

        {userRole === 'instructor' && <StudentMetrics metrics={studentMetrics} />}

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