import React from 'react';

const NextGameButton: React.FC<{ onNextGame: () => void }> = ({ onNextGame }) => (
  <button className="next-game-btn" onClick={onNextGame}>
    <span className="next-game-btn__text">Next Game</span>
    <div className="next-game-btn__shine"></div>
  </button>
);

export default NextGameButton;