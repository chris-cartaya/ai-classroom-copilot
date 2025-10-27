import React, { useState, useRef } from 'react';
import Button from './Button';
import Card from './Card';
import './WeekCard.css'; // New CSS file for WeekCard

const WeekCard = ({
  week,
  userRole,
  onDeleteWeek,
  onAddMaterial, // new prop for adding material (or updating status)
  onDeleteMaterial, // new prop for deleting material
  formatFileSize, // utility function from parent
  getStatusBadgeClass // utility function from parent
}) => {
  const [showUploadForm, setShowUploadForm] = useState(false); // State to toggle file upload form visibility
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const fileInputRef = useRef(null);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    await processFiles(files);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  // Function to handle viewing a file (placeholder)
  const handleViewMaterial = (materialName) => {
    alert(`Simulating view for: ${materialName}\n(Full functionality requires backend integration)`);
    // In a real app, this might open a modal, link to a file URL, etc.
  };

  const processFiles = async (files) => {
    setErrorMessage('');
    setStatusMessage('');

    if (!files || files.length === 0) {
      return;
    }

    // validate file types (fr-2)
    const allowedTypes = ['.pptx', '.pdf', '.docx'];
    const invalidFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return !allowedTypes.includes(extension);
    });

    if (invalidFiles.length > 0) {
      setErrorMessage(`Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}. Only PPTX, PDF, and DOCX files are allowed.`);
      return;
    }

    // validate file size (max 10mb per nfr-2)
    const maxSize = 10 * 1024 * 1024; // 10mb in bytes
    const oversizedFiles = files.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setErrorMessage(`File(s) too large: ${oversizedFiles.map(f => f.name).join(', ')}. Maximum size is 10 MB per file.`);
      return;
    }

    let processingSuccessful = true; // Flag to track overall success

    // process each file
    for (const file of files) {
      const tempId = Date.now() + Math.random();
      // define initialMaterial outside the try block so it's accessible in catch
      const initialMaterial = {
        id: tempId,
        name: file.name,
        size: formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'uploading'
      };

      try {
        setUploadProgress({ fileName: file.name, progress: 0 }); // Show progress immediately

        // add file immediately with 'uploading' status
        onAddMaterial(week.id, initialMaterial); // add to parent's state

        // TODO: replace with actual api call to backend

        // simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 50)); // faster simulation
          setUploadProgress({ fileName: file.name, progress: i });
        }

        setStatusMessage(`Successfully uploaded ${file.name}. Processing...`);

        // update status to 'processing' - pass true for isUpdate
        onAddMaterial(week.id, { ...initialMaterial, status: 'processing' }, true);

        // simulate processing time
        await new Promise(resolve => setTimeout(resolve, 1500));
        // update status to 'processed' - pass true for isUpdate
        onAddMaterial(week.id, { ...initialMaterial, status: 'processed' }, true);
        setStatusMessage(`${file.name} processed successfully.`);

      } catch (err) {
        setErrorMessage(`Failed to upload or process ${file.name}. Please try again.`);
        console.error('Upload error:', err);
        // update status to 'error' - initialMaterial is now accessible here
        onAddMaterial(week.id, { ...initialMaterial, status: 'error' }, true);
        processingSuccessful = false; // Mark as failed
      } finally {
         // Clear progress bar only when done with *this* file
         setUploadProgress(null);
      }
    } // End of loop

    // Only hide form if all processing was successful
    if (processingSuccessful && !errorMessage) {
       setTimeout(() => {
          setShowUploadForm(false);
          setStatusMessage(''); // Clear success message when form hides
       }, 2000); // Hide after 2 seconds
    }
  };

  return (
    <Card className="week-card">
      <div className="week-card-header">
        <h3 className="week-title">{week.title}</h3>
        {userRole === 'instructor' && (
          <div className="week-actions">
            <Button
              variant="secondary"
              size="small"
              onClick={() => {
                 setShowUploadForm(!showUploadForm);
                 setErrorMessage('');
                 setStatusMessage('');
                 setUploadProgress(null);
               }}
              ariaLabel={showUploadForm ? "Hide upload form" : "Add material to this week"}
              title={showUploadForm ? "Hide upload form" : "Add material"}
            >
              {showUploadForm ? 'Cancel' : 'Add Material'}
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={() => onDeleteWeek(week.id)}
              ariaLabel={`Delete week ${week.title}`}
              title="Delete Week"
            >
              Delete Week
            </Button>
          </div>
        )}
      </div>

      {userRole === 'instructor' && showUploadForm && (
        <div className="week-upload-form">
           {statusMessage && !errorMessage && (
            <div className="status-message status-success" role="status">
              ✓ {statusMessage}
            </div>
           )}
           {errorMessage && (
            <div className="status-message status-error" role="alert">
              ⚠ {errorMessage}
            </div>
           )}

          <div
            className={`dropzone ${isDragging ? 'dropzone-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBrowseClick(); }}
            aria-label={`Drag and drop files here or click to browse for ${week.title}`}
          >
            <div className="dropzone-content">
              <span className="dropzone-icon">📁</span>
              <p className="dropzone-text">
                Drag and drop, or click to browse
              </p>
              <input
                type="file"
                id={`file-input-${week.id}`}
                ref={fileInputRef}
                className="file-input"
                accept=".pptx,.pdf,.docx"
                multiple
                onChange={handleFileSelect}
                aria-hidden="true"
              />
            </div>
          </div>
          {uploadProgress && (
            <div className="upload-progress">
              <p className="progress-text">
                Uploading {uploadProgress.fileName}...
              </p>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress.progress}%` }}
                  role="progressbar"
                  aria-valuenow={uploadProgress.progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  aria-label={`Upload progress for ${uploadProgress.fileName}`}
                />
              </div>
              <p className="progress-percentage">{uploadProgress.progress}%</p>
            </div>
          )}
        </div>
      )}

      <div className="week-materials">
        {week.materials.length === 0 ? (
          <p className="no-materials">
            {userRole === 'instructor' ? 'No material posted. Click "Add Material" above to upload.' : 'No material posted for this week.'}
          </p>
        ) : (
          <div className="materials-list">
            {week.materials.map(material => (
              <div key={material.id} className="material-item">
                <div className="material-icon">📄</div>
                <div className="material-info">
                  <h4 className="material-name" title={material.name}>{material.name}</h4>
                  <div className="material-meta">
                    <span className="material-size">{material.size}</span>
                    <span className="material-separator">•</span>
                    <span className="material-date">Uploaded {material.uploadDate}</span>
                  </div>
                </div>
                <div className="material-status">
                  <span className={`status-badge ${getStatusBadgeClass(material.status)}`}>
                    {material.status}
                  </span>
                </div>
                <div className="material-actions"> {/* Container for all actions */}
                  {/* View button - visible to both roles if processed */}
                  {material.status === 'processed' && (
                     <Button
                       variant="secondary"
                       size="small"
                       onClick={() => handleViewMaterial(material.name)} // Added onClick handler
                       ariaLabel={`View ${material.name}`}
                     >
                       👀 View
                     </Button>
                   )}
                  {/* Delete button - only for instructor */}
                  {userRole === 'instructor' && (
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => onDeleteMaterial(week.id, material.id)}
                      ariaLabel={`Delete ${material.name} from week ${week.title}`}
                      title="Delete Material"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default WeekCard;