import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import GameBoard from './components/GameBoard';
import GameControls from './components/GameControls';
import ClueDisplay from './components/ClueDisplay';

function App() {
  const [roundData, setRoundData] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedClue, setSelectedClue] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [answerResponse, setAnswerResponse] = useState(null);

  // Get base values based on round (Double Jeopardy doubles the values)
  const getBaseValues = () => {
    const baseValues = [200, 400, 600, 800, 1000];
    return currentRound === 2 ? baseValues.map(v => v * 2) : baseValues;
  };

  const fetchNewRound = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:8000/round/${currentRound}`);
      if (Object.keys(response.data).length !== 6) {
        throw new Error('Invalid round data: Expected 6 categories');
      }
      setRoundData(response.data);
    } catch (error) {
      console.error('Error fetching round data:', error);
      setError(error.response?.data?.detail || error.message || 'Failed to fetch round data');
      setRoundData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClueSelect = (clue) => {
    setSelectedClue(clue);
    setUserAnswer('');
    setShowAnswer(false);
    setAnswerResponse(null);
  };

  const submitAnswer = async () => {
    try {
      const response = await axios.post('http://localhost:8000/answer', {
        clue_id: selectedClue.clue.id,
        user_answer: userAnswer
      });
      setAnswerResponse({
        ...response.data,
        distance: response.data.similarity
      });
      setShowAnswer(true);
      
      // Update the clue to mark it as answered
      setRoundData(prevData => {
        const newData = { ...prevData };
        const clue = newData[selectedClue.category][selectedClue.index];
        clue.answered = true;
        clue.userAnswer = userAnswer;
        return newData;
      });
    } catch (error) {
      console.error('Error submitting answer:', error);
      setError(error.response?.data?.detail || error.message || 'Failed to submit answer');
    }
  };

  return (
    <div className="App">
      <GameControls 
        currentRound={currentRound}
        onRoundChange={setCurrentRound}
        onNewRound={fetchNewRound}
        loading={loading}
        error={error}
      />
      
      {selectedClue && (
        <ClueDisplay 
          selectedClue={selectedClue}
          userAnswer={userAnswer}
          onAnswerChange={setUserAnswer}
          onSubmit={submitAnswer}
          showAnswer={showAnswer}
          answerResponse={{
            ...answerResponse,
            style: { '--distance': answerResponse?.distance || 0 }
          }}
          onClose={() => {
            setSelectedClue(null);
            setShowAnswer(false);
          }}
        />
      )}
      <GameBoard 
        roundData={roundData}
        getBaseValues={getBaseValues}
        selectedClue={selectedClue}
        onClueSelect={handleClueSelect}
        showAnswer={showAnswer}
      />
    </div>
  );
}

export default App;
