import React from 'react';


const ScoreDisplay: React.FC<{ score: number }> = ({ score }) => {
  return (
    <div className="score-display">
      <div className="score-display__label">Score</div>
      <div className="score-display__value">{score}</div>
    </div>
  );
};

export default ScoreDisplay;
