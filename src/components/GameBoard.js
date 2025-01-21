import React, { useState, useEffect } from 'react';
import Clue from './Clue';

/**
 * Renders the main Jeopardy game board with categories and clues
 * @param {Object} props
 * @param {Object} props.roundData - Data for the current game round
 * @param {Function} props.getBaseValues - Returns array of base dollar values for each row
 * @param {Object} props.selectedClue - Currently selected clue data (if any)
 * @param {Function} props.onClueSelect - Callback when a clue is selected
 * @param {boolean} props.showAnswer - Whether answer mode is active
 */
function GameBoard({ roundData, getBaseValues, selectedClue, onClueSelect, showAnswer }) {
  const [focusedClue, setFocusedClue] = useState({ row: 0, col: 0 });
  const [lastDirection, setLastDirection] = useState(null);

  // Calculate new position based on direction
  const getNewPosition = (currentPos, direction, boardDimensions) => {
    const { row, col } = currentPos;
    const { rows, cols } = boardDimensions;

    switch(direction) {
      case 'w': return { row: (row - 1 + rows) % rows, col };
      case 's': return { row: (row + 1) % rows, col };
      case 'a': return { row, col: (col - 1 + cols) % cols };
      case 'd': return { row, col: (col + 1) % cols };
      default: return currentPos;
    }
  };

  // Find next unanswered clue starting from current position
  const findNextUnansweredClue = (currentPos, direction, roundData, boardDimensions) => {
    const { rows, cols } = boardDimensions;
    const categories = Object.keys(roundData);
    
    // Always move at least one position in the requested direction
    let pos = getNewPosition(currentPos, direction, boardDimensions);
    let attempts = 0;
    
    // Keep moving in the direction until we find an unanswered clue
    while (attempts < rows * cols) {
      const clue = roundData[categories[pos.col]][pos.row];
      if (!clue.answered) {
        return pos;
      }
      pos = getNewPosition(pos, direction, boardDimensions);
      attempts++;
    }
    
    // If all clues are answered, stay at current position
    return currentPos;
  };

  // Get current board dimensions
  const getBoardDimensions = () => ({
    rows: getBaseValues().length,
    cols: roundData ? Object.keys(roundData).length : 6
  });

  // Handle clue becoming answered
  useEffect(() => {
    if (!roundData || !lastDirection) return;
    
    const clue = roundData[Object.keys(roundData)[focusedClue.col]][focusedClue.row];
    if (clue?.isAnswered) {
      const boardDimensions = getBoardDimensions();
      const newPos = findNextUnansweredClue(focusedClue, lastDirection, roundData, boardDimensions);
      setFocusedClue(newPos);
    }
  }, [roundData, focusedClue, lastDirection, getBaseValues]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!roundData || selectedClue) return;

      const key = e.key.toLowerCase();
      
      // Handle Enter key for focused clue
      if (key === 'enter') {
        const categories = Object.keys(roundData);
        const clue = roundData[categories[focusedClue.col]][focusedClue.row];
        if (!clue.answered) {
          onClueSelect({
            category: categories[focusedClue.col],
            index: focusedClue.row,
            clue: clue
          });
        }
        return;
      }
      
      // Handle directional keys
      if (!['w', 'a', 's', 'd'].includes(key)) return;
      
      setLastDirection(key);
      const boardDimensions = getBoardDimensions();
      const newPos = findNextUnansweredClue(focusedClue, key, roundData, boardDimensions);
      setFocusedClue(newPos);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedClue, roundData, selectedClue, getBaseValues]);

  return (
    <div className={`game-board ${selectedClue ? 'dimmed' : ''}`}>
      {roundData ? (
        <>
          {/* Row for category names */}
          <div className="board-row">
            {Object.keys(roundData).map((category, index) => (
              <div className="category-cell" key={index}>
                {category}
              </div>
            ))}
          </div>
          
          {/* Rows for clues */}
          {getBaseValues().map((value, rowIndex) => (
            <div className="board-row" key={rowIndex}>
              {Object.keys(roundData).map((category, colIndex) => (
                <Clue
                  key={colIndex}
                  clueData={roundData[category][rowIndex]}
                  category={category}
                  index={rowIndex}
                  baseValue={value}
                  selectedClue={selectedClue}
                  showAnswer={showAnswer}
                  onClueSelect={onClueSelect}
                  isFocused={focusedClue.row === rowIndex && focusedClue.col === colIndex}
                />
              ))}
            </div>
          ))}
        </>
      ) : (
        <>
          {/* Default empty board */}
          <div className="board-row">
            {[...Array(6)].map((_, index) => (
              <div className="category-cell" key={index}>
                Category {index + 1}
              </div>
            ))}
          </div>
          
          {getBaseValues().map((value, rowIndex) => (
            <div className="board-row" key={rowIndex}>
              {[...Array(6)].map((_, colIndex) => (
                <Clue
                  key={colIndex}
                  clueData={{}}
                  category={`Category ${colIndex + 1}`}
                  index={rowIndex}
                  baseValue={value}
                  selectedClue={selectedClue}
                  showAnswer={showAnswer}
                  onClueSelect={onClueSelect}
                />
              ))}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default GameBoard;
