import React, { useEffect, useRef } from 'react';
import './ClueDisplay.css';

function ClueDisplay({ selectedClue, userAnswer, onAnswerChange, onSubmit, showAnswer, answerResponse, onClose, loading }) {
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus the input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleKeyDown = (e) => {
      // Only handle Enter for closing if not in input and answer exists
      if (e.key === 'Enter' && answerResponse && e.target !== inputRef.current) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [answerResponse, onClose]);

  return (
    <div className="clue-display">
      <button className="close-btn" onClick={onClose}>&times;</button>
      <div className="clue-header">
        <div className="clue-value">
          ${selectedClue.clue?.clue_value}
        </div>
        <div className="clue-category">
          {selectedClue.category}
        </div>
      </div>
      <div className="clue-text">
        {selectedClue.clue?.clue_text}
      </div>
      {!showAnswer ? (
        <div className="answer-input-section">
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={(e) => !loading && onAnswerChange(e.target.value)}
            placeholder="Your answer..."
            disabled={loading}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !loading && userAnswer?.trim()) {
                onSubmit();
              }
            }}
          />
          <button 
            className="submit-answer-btn"
            onClick={onSubmit}
            disabled={loading || !userAnswer?.trim()}
          >
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              'Submit Answer'
            )}
          </button>
        </div>
      ) : (
        <div className="correct-answer">
          <div className="correct-answer-text">
            Correct Answer: <span className="correct-answer">{selectedClue.clue?.correct_answer}</span>
          </div>
          {answerResponse && (
            <div 
              className="answer-feedback"
              style={{ 
                backgroundColor: answerResponse?.correct ? 'rgb(0, 255, 0)' : 'rgb(255, 0, 0)'
              }}
            >
              {!answerResponse?.correct && (
                <div className="correct-answer">
                  Correct Answer: {answerResponse?.correct_answer}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ClueDisplay;
