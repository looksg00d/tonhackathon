import React from 'react';
import { Button } from '@telegram-apps/telegram-ui';

interface NextGameButtonProps {
  onNextGame: () => void;
}

const NextGameButton: React.FC<NextGameButtonProps> = ({ onNextGame }) => {
  return (
    <Button onClick={onNextGame}>▶️ Следующий</Button>
  );
};

export default NextGameButton;