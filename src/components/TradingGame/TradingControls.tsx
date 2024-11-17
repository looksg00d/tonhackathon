import React from 'react';
import { ChartType } from './types';

interface TradingControlsProps {
  chartType: ChartType;
  onChangeChartType: (type: ChartType) => void;
  onStartGame: () => void;
  isGameStarted: boolean;
}

const TradingControls: React.FC<TradingControlsProps> = ({
  chartType,
  onChangeChartType,
  onStartGame,
  isGameStarted,
}) => {
  return (
    <div className="trading-controls">
      <div className="trading-controls__buttons">
        <button
          className="chart-type-btn"
          onClick={() => onChangeChartType(chartType === 'line' ? 'candle' : 'line')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3.5 18.5L9.5 12.5L14.5 17.5L22 6.5" fill="none" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        <button
          onClick={() => onChangeChartType('candle')}
          className={`chart-type-btn ${chartType === 'candle' ? 'active' : ''}`}
          aria-label="Candle Chart"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="8" width="2" height="8" />
            <rect x="11" y="4" width="2" height="16" />
            <rect x="16" y="10" width="2" height="6" />
          </svg>
        </button>
      </div>

      {!isGameStarted && (
        <button className="start-game-btn" onClick={onStartGame}>
          <span className="start-game-btn__text">Start Game</span>
          <div className="start-game-btn__shine"></div>
        </button>
      )}
    </div>
  );
};

export default TradingControls;
