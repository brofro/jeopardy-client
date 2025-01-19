import React from 'react';

function GameControls({ currentRound, onRoundChange, onNewRound, loading, error }) {
  return (
    <div>
      <h1>Jeopardy Game</h1>
      <div className="controls">
        <select 
          value={currentRound}
          onChange={(e) => onRoundChange(Number(e.target.value))}
        >
          <option value={1}>Round 1</option>
          <option value={2}>Round 2</option>
        </select>
        <button 
          className="new-round-btn"
          onClick={onNewRound}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'New Round'}
        </button>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
    </div>
  );
}

export default GameControls;
