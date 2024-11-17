import React from 'react';
import { Button, Select } from '@telegram-apps/telegram-ui';
import { TradingPair, ChartType } from './types';

interface TradingControlsProps {
  tradingPairs: TradingPair[];
  selectedPair: TradingPair | null;
  onSelectPair: (pair: TradingPair | null) => void;
  chartType: ChartType;
  onChangeChartType: (type: ChartType) => void;
  onStartGame: () => void;
  isGameStarted: boolean;
}

const TradingControls: React.FC<TradingControlsProps> = ({
  tradingPairs,
  selectedPair,
  onSelectPair,
  chartType,
  onChangeChartType,
  onStartGame,
  isGameStarted,
}) => {
  return (
    <div className="trading-controls">
      <Select
        value={selectedPair?.symbol || 'BTCUSDT'}
        onChange={(e) =>
          onSelectPair(
            tradingPairs.find((pair) => pair.symbol === e.target.value) || null
          )
        }
        disabled={isGameStarted}
      >
        {tradingPairs.map((pair) => (
          <option key={pair.symbol} value={pair.symbol}>
            {pair.name} ({pair.symbol.replace('USDT', '')})
          </option>
        ))}
      </Select>

      <div className="trading-controls__buttons">
        <Button
          onClick={() => onChangeChartType('line')}
          disabled={false}
        >
          Линия
        </Button>
        <Button
          onClick={() => onChangeChartType('candle')}
          disabled={false}
        >
          Свечи
        </Button>
      </div>

      {!isGameStarted && (
        <Button onClick={onStartGame}>▶️ Старт</Button>
      )}
    </div>
  );
};

export default TradingControls;