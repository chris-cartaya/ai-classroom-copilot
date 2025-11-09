import React, { useState, useRef } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import './CourseMaterials.css';

/**
 * course materials page - file upload interface for instructors
 * allows instructors to upload course content (pptx, pdf, docx)
 * implements fr-2: allow instructors to upload supported file types
 */
const CourseMaterials = ({ userRole }) => {
  // ref for file input
  const fileInputRef = useRef(null);

  // state for uploaded files list
  const [uploadedFiles, setUploadedFiles] = useState([
    // mock data for demonstration
    { id: 1, name: 'Module 1 - Introduction.pptx', size: '2.4 MB', uploadDate: '2025-10-15', status: 'processed' },
    { id: 2, name: 'Module 2 - Core Concepts.pdf', size: '1.8 MB', uploadDate: '2025-10-16', status: 'processed' },
    { id: 3, name: 'Module 3 - Advanced Topics.docx', size: '856 KB', uploadDate: '2025-10-18', status: 'processing' }
  ]);

  // state for drag and drop
  const [isDragging, setIsDragging] = useState(false);

  // state for upload progress
  const [uploadProgress, setUploadProgress] = useState(null);

  // state for status messages
  const [statusMessage, setStatusMessage] = useState('');

  // state for error messages
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * handle file selection from input
   * implements fr-2.1: extract text, chunk, and create embeddings
   */
  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files);
    await processFiles(files);
  };

  /**
   * handle drag over event
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  /**
   * handle drag leave event
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  /**
   * handle file drop
   */
  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    await processFiles(files);
  };

  /**
   * process uploaded files
   * validates file types and uploads to backend
   */
  const processFiles = async (files) => {
    // clear previous messages
    setErrorMessage('');
    setStatusMessage('');
    
    // validate file types (fr-2)
    const allowedTypes = ['.pptx', '.pdf', '.docx'];
    const invalidFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return !allowedTypes.includes(extension);
    });
    
    if (invalidFiles.length > 0) {
      setErrorMessage(`Invalid file type(s). Only PPTX, PDF, and DOCX files are allowed.`);
      return;
    }
    
    // validate file size (max 10mb per nfr-2)
    const maxSize = 10 * 1024 * 1024; // 10mb in bytes
    const oversizedFiles = files.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      setErrorMessage(`File(s) too large. Maximum size is 10 MB per file.`);
      return;
    }
    
    // process each file
    for (const file of files) {
      try {
        setUploadProgress({ fileName: file.name, progress: 0 });
        
        // TODO: replace with actual api call to backend
        // const formData = new FormData();
        // formData.append('file', file);
        // const response = await fetch('/api/upload', {
        //   method: 'POST',
        //   body: formData,
        //   onUploadProgress: (progressEvent) => {
        //     const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        //     setUploadProgress({ fileName: file.name, progress });
        //   }
        // });
        
        // simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress({ fileName: file.name, progress: i });
        }
        
        // add file to uploaded files list
        const newFile = {
          id: Date.now(),
          name: file.name,
          size: formatFileSize(file.size),
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'processing'
        };
        
        setUploadedFiles([newFile, ...uploadedFiles]);
        setStatusMessage(`Successfully uploaded ${file.name}`);
        
      } catch (err) {
        setErrorMessage(`Failed to upload ${file.name}. Please try again.`);
        console.error('Upload error:', err);
      }
    }
    
    setUploadProgress(null);
  };

  /**
   * format file size for display
   */
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  /**
   * handle file deletion
   */
  const handleDeleteFile = (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setUploadedFiles(uploadedFiles.filter(file => file.id !== fileId));
      setStatusMessage('File deleted successfully');
    }
  };

  /**
   * get status badge color
   */
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'processed':
        return 'status-badge-success';
      case 'processing':
        return 'status-badge-warning';
      case 'error':
        return 'status-badge-error';
      default:
        return 'status-badge-default';
    }
  };

  return (
    <div className="course-materials">
      <div className="container">
        {/* page header */}
        <div className="page-header">
          <h2>Course Materials Management</h2>
          <p className="page-description">
            {userRole === 'instructor' 
              ? 'Upload and manage your course materials. Supported formats: PPTX, PDF, DOCX'
              : 'View available course materials uploaded by your instructor'
            }
          </p>
        </div>

        {/* upload section - only visible to instructors (fr-2, nfr-5) */}
        {userRole === 'instructor' && (
          <Card className="upload-card">
            <h3>📤 Upload New Materials</h3>
            
            {/* drag and drop zone */}
            <div
              className={`dropzone ${isDragging ? 'dropzone-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="dropzone-content">
                <span className="dropzone-icon">📁</span>
                <p className="dropzone-text">
                  Drag and drop files here, or click to browse
                </p>
                <p className="dropzone-subtext">
                  Supported formats: PPTX, PDF, DOCX (Max 10 MB per file)
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="file-input"
                  accept=".pptx,.pdf,.docx"
                  multiple
                  onChange={handleFileSelect}
                  aria-label="Upload course materials"
                />
                <Button
                  variant="success"
                  size="large"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Browse Files
                </Button>
              </div>
            </div>

            {/* upload progress indicator */}
            {uploadProgress && (
              <div className="upload-progress">
                <p className="progress-text">
                  Uploading {uploadProgress.fileName}...
                </p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress.progress}%` }}
                  />
                </div>
                <p className="progress-percentage">{uploadProgress.progress}%</p>
              </div>
            )}

            {/* status messages */}
            {statusMessage && (
              <div className="status-message status-success" role="status">
                ✓ {statusMessage}
              </div>
            )}

            {/* error messages (fr-5) */}
            {errorMessage && (
              <div className="status-message status-error" role="alert">
                ⚠ {errorMessage}
              </div>
            )}
          </Card>
        )}

        {/* uploaded files list */}
        <Card className="files-card">
          <h3>📚 Uploaded Course Materials</h3>
          
          {uploadedFiles.length === 0 ? (
            <div className="empty-state">
              <p>No course materials uploaded yet.</p>
              {userRole === 'instructor' && (
                <p>Upload your first file to get started!</p>
              )}
            </div>
          ) : (
            <div className="files-list">
              {uploadedFiles.map(file => (
                <div key={file.id} className="file-item">
                  <div className="file-icon">📄</div>
                  <div className="file-info">
                    <h4 className="file-name">{file.name}</h4>
                    <div className="file-meta">
                      <span className="file-size">{file.size}</span>
                      <span className="file-separator">•</span>
                      <span className="file-date">Uploaded {file.uploadDate}</span>
                    </div>
                  </div>
                  <div className="file-status">
                    <span className={`status-badge ${getStatusBadgeClass(file.status)}`}>
                      {file.status}
                    </span>
                  </div>
                  {userRole === 'instructor' && (
                    <div className="file-actions">
                      <Button
                        variant="secondary"
                        size="small"
                        onClick={() => handleDeleteFile(file.id)}
                        ariaLabel={`Delete ${file.name}`}
                      >
                        🗑️ Delete
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* information card */}
        <Card className="info-card">
          <h3>ℹ️ How It Works</h3>
          <ol className="info-list">
            <li>Upload your course materials in supported formats (PPTX, PDF, DOCX)</li>
            <li>The system automatically extracts text and creates searchable content</li>
            <li>Content is divided into chunks and stored with metadata (module, slide, page numbers)</li>
            <li>Students can ask questions and receive answers with citations from your materials</li>
            <li>Processing typically completes within 30 seconds for files up to 10 MB</li>
          </ol>
        </Card>
      </div>
    </div>
  );
};

export default CourseMaterials;
