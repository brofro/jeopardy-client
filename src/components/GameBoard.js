import React from 'react';
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
