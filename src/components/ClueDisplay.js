import React, { useEffect, useRef } from 'react';

function ClueDisplay({ selectedClue, userAnswer, onAnswerChange, onSubmit, showAnswer, answerResponse, onClose }) {
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
      <div className="clue-value">
        ${selectedClue.clue?.clue_value}
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
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Your answer..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onSubmit();
                }
              }}
            />
          <button 
            className="submit-answer-btn"
            onClick={onSubmit}
          >
            Submit Answer
          </button>
        </div>
      ) : (
        <div className="correct-answer">
          <div className="correct-answer-text">
            Correct Answer: <span className="correct-answer">{selectedClue.clue?.correct_answer}</span>
          </div>
          {answerResponse && (
            <div 
              className="levenshtein-distance"
              style={{ 
                backgroundColor: answerResponse?.distance <= 33 ? 'rgb(255, 0, 0)' : 
                                answerResponse?.distance <= 66 ? 'rgb(255, 255, 0)' :
                                'rgb(0, 255, 0)'
              }}
            >
              Your answer was {answerResponse?.distance || 0}% similar to the correct answer
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ClueDisplay;
