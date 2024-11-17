import React from 'react';

interface NextGameButtonProps {
  onNextGame: () => void;
}

const NextGameButton: React.FC<NextGameButtonProps> = ({ onNextGame }) => {
  return (
    <button onClick={onNextGame} className="next-game-btn">
      <span className="next-game-btn__text">Next Game</span>
      <span className="next-game-btn__shine"></span>
    </button>
  );
};

export default NextGameButton;