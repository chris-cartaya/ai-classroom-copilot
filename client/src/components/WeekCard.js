import React, { useState, useRef } from 'react';
import Button from './Button';
import Card from './Card';
import './WeekCard.css'; 

const WeekCard = ({
  week,
  userRole,
  onDeleteWeek,
  onAddMaterial, 
  onDeleteMaterial, 
  formatFileSize, 
  getStatusBadgeClass 
}) => {
  const [showUploadForm, setShowUploadForm] = useState(false); 
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

  const handleViewMaterial = (materialName) => {
    window.open(`http://localhost:8000/uploads/${materialName}`, '_blank');
  };

  const processFiles = async (files) => {
    setErrorMessage('');
    setStatusMessage('');

    if (!files || files.length === 0) {
      return;
    }

    // validate file types
    const allowedTypes = ['.pptx', '.pdf', '.docx'];
    const invalidFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return !allowedTypes.includes(extension);
    });

    if (invalidFiles.length > 0) {
      setErrorMessage(`Invalid file type(s): ${invalidFiles.map(f => f.name).join(', ')}. Only PPTX, PDF, and DOCX files are allowed.`);
      return;
    }

    // validate file size (max 25mb to match backend)
    const maxSize = 25 * 1024 * 1024; 
    const oversizedFiles = files.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setErrorMessage(`File(s) too large: ${oversizedFiles.map(f => f.name).join(', ')}. Maximum size is 25 MB per file.`);
      return;
    }

    let processingSuccessful = true; 

    // process each file
    for (const file of files) {
      // Use the ORIGINAL name for the optimistic UI update
      const tempId = Date.now() + Math.random();
      
      const initialMaterial = {
        id: tempId,
        name: file.name, 
        size: formatFileSize(file.size),
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'uploading'
      };

      try {
        setUploadProgress({ fileName: file.name, progress: 0 }); 

        // add file immediately to UI
        onAddMaterial(week.id, initialMaterial); 

        // Upload to backend
        const formData = new FormData();
        formData.append('file', file); // Send the ORIGINAL file
        formData.append('week_title', week.title); // Week title is sent separately

        // This endpoint sends the file to the backend, which saves it to PPData
        const response = await fetch('http://localhost:8000/upload', {
          method: 'POST',
          body: formData
        });

        // naive progress animation
        for (let i = 0; i <= 100; i += 20) {
          await new Promise(resolve => setTimeout(resolve, 40));
          setUploadProgress({ fileName: file.name, progress: i });
        }

        if (!response.ok) {
          let msg = `Upload failed with status ${response.status}`;
          try {
            const errData = await response.json();
            if (errData && errData.error) msg = errData.error;
          } catch (_) {}
          throw new Error(msg);
        }
        
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setStatusMessage(`${file.name} uploaded & ingested successfully.`);
        
        // Update status to processed using the real ID from backend
        // We still use the file name as the matching key in case the temp ID changed
        onAddMaterial(week.id, { ...initialMaterial, id: data.id || initialMaterial.id, status: 'processed' }, true);

      } catch (err) {
        setErrorMessage(`Failed to upload ${file.name}. ${err.message}`);
        console.error('Upload error:', err);
        onAddMaterial(week.id, { ...initialMaterial, status: 'error' }, true);
        processingSuccessful = false; 
      } finally {
         setUploadProgress(null);
      }
    } 

    if (processingSuccessful && !errorMessage) {
       setTimeout(() => {
          setShowUploadForm(false);
          setStatusMessage(''); 
       }, 2000); 
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
              ariaLabel={showUploadForm ? "Hide upload form" : "Add material to this module"}
              title={showUploadForm ? "Hide upload form" : "Add material"}
            >
              {showUploadForm ? 'Cancel' : 'Add Material'}
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={() => onDeleteWeek(week.id)}
              ariaLabel={`Delete module ${week.title}`}
              title="Delete Module"
            >
              Delete Module
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
            {userRole === 'instructor' ? 'No material posted. Click "Add Material" above to upload.' : 'No material posted for this module.'}
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
                <div className="material-actions"> 
                  {material.status === 'processed' && (
                     <Button
                       variant="secondary"
                       size="small"
                       onClick={() => handleViewMaterial(material.name)} 
                       ariaLabel={`View ${material.name}`}
                     >
                       👀 View
                     </Button>
                   )}
                  {userRole === 'instructor' && (
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => onDeleteMaterial(week.id, material.id)}
                      ariaLabel={`Delete ${material.name} from module ${week.title}`}
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