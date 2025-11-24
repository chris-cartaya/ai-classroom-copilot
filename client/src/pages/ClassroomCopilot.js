import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import TextArea from '../components/TextArea';
import Button from '../components/Button';
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

  const location = useLocation();
  const navigate = useNavigate();

  /**
   * Reusable function to send a message to the backend
   * Allows calling from both the form submit and auto-prompts
   */
  const sendMessage = async (messageText) => {
    if (!messageText.trim()) {
      setError('Please enter a question');
      return;
    }
    
    // clear any previous errors
    setError('');
    
    // set loading state
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: messageText })
      });
      const data = await response.json();
      
      // add question and answer to conversation history
      // Use functional update to ensure we have the latest conversation state
      setConversation(prevConversation => [
        ...prevConversation,
        {
          type: 'question',
          content: messageText,
          timestamp: new Date().toISOString()
        },
        {
          type: 'answer',
          content: data.answer,
          // Check if documents exist before mapping to avoid errors
          citations: data.documents ? data.documents.map(doc => ({ 
              source: doc[0].metadata.source, 
              content: doc[0].page_content 
          })) : [],
          timestamp: new Date().toISOString()
        }
      ]);
      
    } catch (err) {
      // handle errors gracefully (fr-5)
      setError('Failed to get response. Please try again.');
      console.error('Error submitting question:', err);
    } finally {
      // reset loading state
      setIsLoading(false);
    }
  };

  /**
   * Effect to handle auto-sent prompts from navigation state
   * Checks if an autoSendPrompt was passed (e.g., from Module Quiz generation)
   */
  useEffect(() => {
    if (location.state && location.state.autoSendPrompt) {
      const prompt = location.state.autoSendPrompt;
      
      // Send the prompt
      sendMessage(prompt);
      
      // Clear the state so it doesn't re-send on refresh or navigation
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, navigate]);

  /**
   * handle question submission form
   * sends question to backend api and displays response with citations
   * implements fr-1.1, fr-1.2, fr-1.3
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage(question);
    // clear the question input after sending
    setQuestion('');
  };

  /**
   * clear conversation history
   */
  const handleClearConversation = () => {
    setConversation([]);
    setQuestion('');
    setError('');
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