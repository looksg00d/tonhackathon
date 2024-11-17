import React from 'react';
import { Button } from '@telegram-apps/telegram-ui';
import { PredictionType } from './types';

interface PredictionButtonsProps {
  onPredict: (direction: PredictionType) => void;
  disabled: boolean;
}

const PredictionButtons: React.FC<PredictionButtonsProps> = ({
  onPredict,
  disabled,
}) => {
  return (
    <div className="prediction-buttons">
      <Button onClick={() => onPredict('up')} disabled={disabled}>
        ⬆️ Вверх
      </Button>
      <Button onClick={() => onPredict('down')} disabled={disabled}>
        ⬇️ Вниз
      </Button>
    </div>
  );
};

export default PredictionButtons;