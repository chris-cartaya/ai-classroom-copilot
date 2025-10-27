import React, { useState } from 'react';
import Card from '../components/Card';
import TextArea from '../components/TextArea';
import Button from '../components/Button';
import Input from '../components/Input';
import './ClassroomCopilot.css';

/**
 * classroom copilot page - main chat interface for asking questions
 * this is the primary interface where students and instructors interact with the ai
 * implements fr-1: allow users to enter questions and receive ai-generated answers with citations
 */
const ClassroomCopilot = () => {
  // state for the current question being typed
  const [question, setQuestion] = useState('');

  // state for loading status while waiting for ai response
  const [isLoading, setIsLoading] = useState(false);

  // state for storing conversation history (questions and answers)
  const [conversation, setConversation] = useState([]);

  // state for error messages
  const [error, setError] = useState('');

  // state for file upload
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  /**
   * handle question submission
   * sends question to backend api and displays response with citations
   * implements fr-1.1, fr-1.2, fr-1.3
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate that question is not empty
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    // clear any previous errors
    setError('');

    // set loading state
    setIsLoading(true);

    try {
      // Make real API call to FastAPI backend
      const formData = new FormData();
      formData.append('question', question);

      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.status === 'success') {
        // Format citations from the API response
        const citations = []; // The API doesn't return citations in this format yet

        // add question and answer to conversation history
        setConversation([
          ...conversation,
          {
            type: 'question',
            content: question,
            timestamp: new Date().toISOString()
          },
          {
            type: 'answer',
            content: data.answer,
            citations: citations,
            confidence: 0.85, // Default confidence since API doesn't provide it yet
            timestamp: new Date().toISOString()
          }
        ]);

        // clear the question input
        setQuestion('');

      } else {
        throw new Error(data.detail || 'Unknown error occurred');
      }

    } catch (err) {
      // handle errors gracefully (fr-5)
      setError(`Failed to get response: ${err.message}`);
      console.error('Error submitting question:', err);
    } finally {
      // reset loading state
      setIsLoading(false);
    }
  };

  /**
   * clear conversation history
   */
  const handleClearConversation = () => {
    setConversation([]);
    setQuestion('');
    setError('');
  };

  /**
   * handle file upload
   */
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();

      // Add all files to FormData
      Array.from(files).forEach((file, index) => {
        formData.append(`files`, file);
      });

      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.total_uploaded > 0) {
        // Update uploaded files state
        const newFiles = data.uploaded_files.map(file => ({
          name: file.filename,
          chunks: file.chunks_created,
          status: 'success',
          timestamp: new Date().toISOString()
        }));

        setUploadedFiles(prev => [...prev, ...newFiles]);

        // Show success message or update UI
        console.log(`Successfully uploaded ${data.total_uploaded} files`);
      }

      if (data.total_failed > 0) {
        console.warn(`Failed to upload ${data.total_failed} files:`, data.failed_files);
        setUploadError(`Failed to upload ${data.total_failed} files`);
      }

    } catch (err) {
      setUploadError(`Upload failed: ${err.message}`);
      console.error('Error uploading files:', err);
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * handle drag and drop events
   */
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  /**
   * handle file drop
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  /**
   * handle file input change
   */
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files);
    }
  };

  return (
    <div className="classroom-copilot">
      <div className="container">
        {/* page header with description */}
        <div className="page-header">
          <h2>Ask Your AI Classroom Assistant</h2>
          <p className="page-description">
            Ask questions about your course materials and get instant answers with citations.
          </p>
        </div>

        {/* conversation history display */}
        {conversation.length > 0 && (
          <Card className="conversation-card">
            <div className="conversation-header">
              <h3>Conversation History</h3>
              <Button
                variant="secondary"
                size="small"
                onClick={handleClearConversation}
                ariaLabel="Clear conversation history"
              >
                Clear History
              </Button>
            </div>

            <div className="conversation-list" role="log" aria-live="polite">
              {conversation.map((item, index) => (
                <div
                  key={index}
                  className={`conversation-item ${item.type}`}
                  role="article"
                >
                  {item.type === 'question' ? (
                    <div className="question-bubble">
                      <div className="bubble-header">
                        <span className="bubble-icon">❓</span>
                        <span className="bubble-label">Your Question</span>
                      </div>
                      <p className="bubble-content">{item.content}</p>
                    </div>
                  ) : (
                    <div className="answer-bubble">
                      <div className="bubble-header">
                        <span className="bubble-icon">🤖</span>
                        <span className="bubble-label">AI Assistant</span>
                        {item.confidence && (
                          <span className="confidence-badge">
                            {Math.round(item.confidence * 100)}% confident
                          </span>
                        )}
                      </div>
                      <p className="bubble-content">{item.content}</p>

                      {/* citations display (fr-1.3) */}
                      {item.citations && item.citations.length > 0 && (
                        <div className="citations-section">
                          <h4 className="citations-title">📚 Sources:</h4>
                          <ul className="citations-list">
                            {item.citations.map((citation, citIndex) => (
                              <li key={citIndex} className="citation-item">
                                <strong>{citation.source}</strong>
                                <p className="citation-content">{citation.content}</p>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* file upload section */}
        <Card className="upload-card">
          <div className="upload-header">
            <h3>📁 Upload Course Materials</h3>
            <p>Add your course documents (PDF, TXT, DOCX) to ask questions about them.</p>
          </div>

          {/* drag and drop area */}
          <div
            className={`upload-dropzone ${dragActive ? 'active' : ''} ${isUploading ? 'uploading' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="upload-content">
              {isUploading ? (
                <>
                  <span className="spinner"></span>
                  <p>Uploading files...</p>
                </>
              ) : (
                <>
                  <span className="upload-icon">📄</span>
                  <p>Drag and drop files here, or click to browse</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.txt,.docx,.doc"
                    onChange={handleFileInputChange}
                    className="file-input"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="upload-button">
                    Choose Files
                  </label>
                </>
              )}
            </div>
          </div>

          {/* upload error display */}
          {uploadError && (
            <div className="upload-error">
              <span className="error-icon">⚠️</span>
              {uploadError}
            </div>
          )}

          {/* uploaded files list */}
          {uploadedFiles.length > 0 && (
            <div className="uploaded-files">
              <h4>Uploaded Files ({uploadedFiles.length})</h4>
              <div className="files-list">
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="file-item">
                    <span className="file-icon">📄</span>
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-chunks">{file.chunks} chunks</span>
                    </div>
                    <span className="file-status success">✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* question input form */}
        <Card className="question-card">
          <form onSubmit={handleSubmit}>
            <TextArea
              label="What would you like to know?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Type your question here... (e.g., 'What is the main concept in Module 2?')"
              rows={4}
              required
              error={error}
              maxLength={1000}
              disabled={isLoading}
            />

            <div className="form-actions">
              <Button
                type="submit"
                variant="primary"
                size="large"
                disabled={isLoading || !question.trim()}
                className="submit-button"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-small"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Ask Question
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>

        {/* helpful tips section */}
        <Card className="tips-card">
          <h3>💡 Tips for Better Results</h3>
          <ul className="tips-list">
            <li>Be specific in your questions for more accurate answers</li>
            <li>Reference specific modules or topics when possible</li>
            <li>Ask follow-up questions to dive deeper into topics</li>
            <li>Check the citations to verify information in your course materials</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default ClassroomCopilot;
