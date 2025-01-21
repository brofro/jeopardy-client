import React from 'react';

/**
 * Represents a single clue cell on the game board
 * @param {Object} props
 * @param {Object} props.clueData - The clue data for this cell
 * @param {string} props.category - The category this clue belongs to
 * @param {number} props.index - The index position of this clue in its category
 * @param {number} props.baseValue - The default dollar value for this position
 * @param {Object} props.selectedClue - Currently selected clue data (if any)
 * @param {boolean} props.showAnswer - Whether answer mode is active
 * @param {Function} props.onClueSelect - Callback when clue is selected
 */
function Clue({ 
  clueData, 
  category, 
  index, 
  baseValue, 
  selectedClue, 
  showAnswer, 
  onClueSelect 
}) {
  // Determine if this clue is currently selected
  const isSelected = selectedClue?.category === category && selectedClue?.index === index;

  // Handle click on clue cell
  const handleClick = () => {
    if (!showAnswer && !clueData.answered) {
      onClueSelect({
        category,
        index,
        clue: clueData
      });
    }
  };

  // Render answered clue content
  if (clueData?.answered) {
    return (
      <div className={`clue-cell ${isSelected ? 'selected' : ''}`}>
        <div className="answered-clue">
          <div className="user-answer">{clueData.userAnswer}</div>
          {!clueData.correct && (
            <div className="correct-answer">{clueData?.correct_answer}</div>
          )}
        </div>
      </div>
    );
  }

  // Render selected clue content
  if (isSelected) {
    return (
      <div className={`clue-cell selected`} onClick={handleClick}>
        {clueData?.clue_text || 'No clue available'}
      </div>
    );
  }

  // Render default clue value
  return (
    <div className="clue-cell" onClick={handleClick}>
      ${clueData?.clue_value || baseValue}
    </div>
  );
}

export default Clue;
