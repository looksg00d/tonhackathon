import React from 'react';
import { PredictionType } from './types';

interface PredictionButtonsProps {
  onPredict: (direction: PredictionType) => void;
  disabled: boolean;
}

const PredictionButtons: React.FC<PredictionButtonsProps> = ({ onPredict, disabled }) => (
  <div className="prediction-buttons">
    <button 
      onClick={() => onPredict('up')} 
      disabled={disabled}
      className="prediction-btn up"
      aria-label="Predict Up"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polyline 
          points="11.6 5.3 18.7 5.3 18.7 12.4" 
          fill="none" 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2"
        />
        <line 
          fill="none" 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          x1="5.3" 
          y1="18.7" 
          x2="17.1" 
          y2="6.9"
        />
      </svg>
    </button>
    <button 
      onClick={() => onPredict('down')} 
      disabled={disabled}
      className="prediction-btn down"
      aria-label="Predict Down"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <polyline 
          points="11.6 18.7 18.7 18.7 18.7 11.6" 
          fill="none" 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2"
        />
        <line 
          fill="none" 
          stroke="currentColor" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
          x1="5.3" 
          y1="5.3" 
          x2="17.1" 
          y2="17.1"
        />
      </svg>
    </button>
  </div>
);

export default PredictionButtons;
