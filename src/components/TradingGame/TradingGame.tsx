import React, { FC, useState, useEffect } from 'react';
import TradingControls from './TradingControls';
import PredictionButtons from './PredictionButtons';
import NextGameButton from './NextGameButton';
import ScoreDisplay from './ScoreDisplay';
import ChartComponent from './ChartComponent';
import { 
  TradingPair, 
  ChartType, 
  PredictionType, 
  ChartDataPoint 
} from './types';
import './TradingGame.css';

const TRADING_PAIRS: TradingPair[] = [
  { symbol: 'BTCUSDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', name: 'Ethereum' },
  { symbol: 'BNBUSDT', name: 'BNB' },
  { symbol: 'ADAUSDT', name: 'Cardano' },
  { symbol: 'DOGEUSDT', name: 'Dogecoin' },
  { symbol: 'XRPUSDT', name: 'Ripple' },
  { symbol: 'DOTUSDT', name: 'Polkadot' },
  { symbol: 'MATICUSDT', name: 'Polygon' },
  { symbol: 'SOLUSDT', name: 'Solana' },
  { symbol: 'AVAXUSDT', name: 'Avalanche' },
  { symbol: 'LINKUSDT', name: 'Chainlink' },
  { symbol: 'UNIUSDT', name: 'Uniswap' },
  { symbol: 'ATOMUSDT', name: 'Cosmos' },
  { symbol: 'LTCUSDT', name: 'Litecoin' },
  { symbol: 'NEARUSDT', name: 'NEAR Protocol' }
];

const TradingGame: FC = () => {
  const [currentToken, setCurrentToken] = useState<TradingPair | null>(null);
  const [chartType, setChartType] = useState<ChartType>('line');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [fullData, setFullData] = useState<ChartDataPoint[]>([]);
  const [visibleData, setVisibleData] = useState<ChartDataPoint[]>([]);
  const [score, setScore] = useState(0);
  const [hasPredicted, setHasPredicted] = useState(false);

  const HIDDEN_DAYS = 7;
  const ANIMATION_SPEED = 50;

  // Функция для получения случайного токена
  const getRandomToken = (): TradingPair | null => {
    if (TRADING_PAIRS.length === 0) return null;

    let availablePairs = TRADING_PAIRS;
    if (currentToken) {
      availablePairs = TRADING_PAIRS.filter(
        (pair) => pair.symbol !== currentToken.symbol
      );
    }

    if (availablePairs.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * availablePairs.length);
    return availablePairs[randomIndex];
  };

  // Функция для загрузки данных
  const loadData = async (token: TradingPair) => {
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${token.symbol}&interval=1h&limit=100`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const formattedData: ChartDataPoint[] = data.map((d: any) => {
        return {
          time: d[0] / 1000,
          type: chartType === 'line' ? 'line' : 'candle',
          ...(chartType === 'line'
            ? { value: parseFloat(d[4]) }
            : {
                open: parseFloat(d[1]),
                high: parseFloat(d[2]),
                low: parseFloat(d[3]),
                close: parseFloat(d[4]),
              }),
        };
      });

      const startIndex = Math.floor(Math.random() * (formattedData.length - 30));
      const slicedData = formattedData.slice(startIndex, startIndex + 30);

      setFullData(slicedData);
      setVisibleData([]);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Ошибка при загрузке данных. Пожалуйста, попробуйте снова.');
      setIsGameStarted(false);
    }
  };

  // Функция для запуска игры
  const startGame = async () => {
    setIsGameStarted(true);
    setShowPrediction(false);
    setShowNextButton(false);
    setHasPredicted(false);

    const token = getRandomToken();
    if (token) {
      setCurrentToken(token);
      await loadData(token);
    }

    // Анимация загрузки данных
    const animateData = async () => {
      const visible = fullData.slice(0, -HIDDEN_DAYS);
      for (let i = 0; i < visible.length; i += 2) {
        const chunk = visible.slice(0, i + 2);
        setVisibleData(chunk);
        await new Promise(resolve => setTimeout(resolve, ANIMATION_SPEED));
      }
      setShowPrediction(true);
    };

    animateData();
  };

  // Функция для предсказания
  const makePredict = async (direction: PredictionType) => {
    if (hasPredicted) return;
    setHasPredicted(true);

    const lastVisiblePoint = fullData[fullData.length - HIDDEN_DAYS - 1];
    const lastPoint = fullData[fullData.length - 1];

    if (!lastVisiblePoint || !lastPoint) {
      console.error('Invalid data for prediction');
      return;
    }

    const lastVisibleValue =
      lastVisiblePoint.type === 'line'
        ? lastVisiblePoint.value
        : lastVisiblePoint.close;

    const lastValue =
      lastPoint.type === 'line' ? lastPoint.value : lastPoint.close;

    const actualDirection = lastValue > lastVisibleValue ? 'up' : 'down';
    const isCorrect = direction === actualDirection;

    // Анимация оставшихся данных
    const remainingData = fullData.slice(-HIDDEN_DAYS);
    for (let i = 0; i < remainingData.length; i++) {
      const fullVisible = fullData.slice(0, -HIDDEN_DAYS + i + 1);
      setVisibleData(fullVisible);
      await new Promise(resolve => setTimeout(resolve, ANIMATION_SPEED * 2));
    }

    // Обновление данных после анимации
    setVisibleData(fullData);
    setTimeout(() => {
      alert(
        `${isCorrect ? '✅ Верно!' : '❌ Неверно!'} Токен: ${
          currentToken?.name
        } (${currentToken?.symbol.replace('USDT', '')})`
      );
      setShowNextButton(true);
      setScore(prev => prev + (isCorrect ? 1 : 0));
    }, 500);
  };

  // Функция для перехода к следующей игре
  const nextGame = () => {
    setShowNextButton(false);
    setHasPredicted(false);
    setVisibleData([]);
    startGame();
  };

  return (
    <div>
      <div className="trading-game">
        <div className="trading-game__controls">
          <TradingControls
            tradingPairs={TRADING_PAIRS}
            selectedPair={currentToken}
            onSelectPair={setCurrentToken}
            chartType={chartType}
            onChangeChartType={setChartType}
            onStartGame={startGame}
            isGameStarted={isGameStarted}
          />

          {showPrediction && !hasPredicted && (
            <PredictionButtons onPredict={makePredict} disabled={hasPredicted} />
          )}

          {showNextButton && (
            <NextGameButton onNextGame={nextGame} />
          )}

          <ScoreDisplay score={score} />
        </div>

        <ChartComponent
          data={visibleData}
          chartType={chartType}
          width={800}
          height={300}
        />
      </div>
    </div>
  );
};

export default TradingGame;