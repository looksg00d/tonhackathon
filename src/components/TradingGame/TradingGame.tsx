import { FC, useState, useEffect } from 'react';
import TradingControls from './TradingControls';
import PredictionButtons from './PredictionButtons';
import NextGameButton from './NextGameButton';
import ChartComponent from './ChartComponent';
import { 
  TradingPair, 
  ChartType, 
  PredictionType, 
  ChartDataPoint 
} from './types';
import './TradingGame.css';
import BottomNavigation from './BottomNavigation';
import WebApp from '@twa-dev/sdk';
import { ScoreService } from '@/services/scoreService';

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
  const [isLoading, setIsLoading] = useState(false);
  const [demoData, setDemoData] = useState<ChartDataPoint[]>([]);
  const [isDemoLoading, setIsDemoLoading] = useState(true);

  const HIDDEN_DAYS = 7;
  const ANIMATION_SPEED = 50;

  // Эффект для анимации данных при их обновлении
  useEffect(() => {
    if (fullData.length > 0 && !isLoading) {
      const visible = fullData.slice(0, -HIDDEN_DAYS);
      let currentIndex = 0;
      let lastTimestamp = 0;
      
      const animate = (timestamp: number) => {
        if (!lastTimestamp) lastTimestamp = timestamp;
        
        const elapsed = timestamp - lastTimestamp;
        
        if (elapsed >= ANIMATION_SPEED) {
          if (currentIndex < visible.length) {
            const chunk = visible.slice(0, currentIndex + 2);
            setVisibleData(chunk);
            currentIndex += 2;
            lastTimestamp = timestamp;
          } else {
            setShowPrediction(true);
            return;
          }
        }
        
        requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }
  }, [fullData, isLoading]);

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
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${token.symbol}&interval=1h&limit=200`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const formattedData: ChartDataPoint[] = data.map((d: any) => ({
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
      }));

      const startIndex = Math.floor(Math.random() * (formattedData.length - 30));
      const slicedData = formattedData.slice(startIndex, startIndex + 30);

      setFullData(slicedData);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Ошибка при загрузке данных. Пожалуйста, попробуйте снова.');
      setIsGameStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для загрузки демо-данных BTC
  const loadDemoData = async () => {
    try {
      const response = await fetch(
        'https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=100'
      );
      const data = await response.json();
      
      const formattedData: ChartDataPoint[] = data.map((item: any) => ({
        type: chartType,
        time: item[0] / 1000,
        ...(chartType === 'line'
          ? {
              value: parseFloat(item[4]), // Цена закрытия
            }
          : {
              open: parseFloat(item[1]),
              high: parseFloat(item[2]),
              low: parseFloat(item[3]),
              close: parseFloat(item[4]),
            }),
      }));

      setDemoData(formattedData);
      setIsDemoLoading(false);
    } catch (error) {
      console.error('Error loading demo data:', error);
      setIsDemoLoading(false);
    }
  };

  // Эффект для загрузки демо-данных при первом рендере
  useEffect(() => {
    if (!isGameStarted) {
      loadDemoData();
      
      // Обновляем данные каждую минуту
      const interval = setInterval(loadDemoData, 60000);
      
      return () => clearInterval(interval);
    }
  }, [isGameStarted, chartType]);

  // Функция для запуска игры
  const startGame = async () => {
    setIsGameStarted(true);
    setShowPrediction(false);
    setShowNextButton(false);
    setHasPredicted(false);
    setVisibleData([]);

    const token = getRandomToken();
    if (!token) {
      console.error('No available tokens');
      return;
    }

    setCurrentToken(token);
    await loadData(token);
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
    let currentIndex = 0;
    let lastTimestamp = 0;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      
      const elapsed = timestamp - lastTimestamp;
      
      if (elapsed >= ANIMATION_SPEED * 2) {
        if (currentIndex < remainingData.length) {
          const fullVisible = fullData.slice(0, -HIDDEN_DAYS + currentIndex + 1);
          setVisibleData(fullVisible);
          currentIndex++;
          lastTimestamp = timestamp;
        } else {
          setVisibleData(fullData);
          setTimeout(async () => {
            alert(
              `${isCorrect ? '✅ Верно!' : '❌ Неверно!'} Токен: ${
                currentToken?.name
              } (${currentToken?.symbol.replace('USDT', '')})`
            );
            setShowNextButton(true);
            if (isCorrect) {
              const newScore = score + 1;
              setScore(newScore);
              
              const user = WebApp.initDataUnsafe.user;
              if (user) {
                try {
                  await ScoreService.updateScore({
                    user_id: user.id.toString(),
                    username: `${user.first_name} ${user.last_name || ''}`,
                    score: newScore
                  });
                } catch (error) {
                  console.error('Error updating score:', error);
                }
              }
            }
          }, 500);
          return;
        }
      }
      
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  // Функция для перехода к следующей игре
  const nextGame = async () => {
    setShowNextButton(false);
    setHasPredicted(false);
    setVisibleData([]);
    setShowPrediction(false);
    
    const token = getRandomToken();
    if (!token) {
      console.error('No available tokens');
      return;
    }

    setCurrentToken(token);
    await loadData(token);
  };

  // Вспомогательная функция для получения цены из точки данных
  const getPriceFromDataPoint = (dataPoint: ChartDataPoint): number => {
    if (dataPoint.type === 'line') {
      return dataPoint.value;
    }
    return dataPoint.close;
  };

  return (
    <div className="trading-game">
      <div className="trading-game__header">
        <div className="trading-game__score">
          <span className="trading-game__score-icon">🎯</span>
          {score}
        </div>
      </div>
      
      <TradingControls
        chartType={chartType}
        onChangeChartType={setChartType}
        onStartGame={startGame}
        isGameStarted={isGameStarted}
      />
      
      <div className="chart-container">
        {!isGameStarted ? (
          isDemoLoading ? (
            <div className="demo-loading">Loading BTC/USDT...</div>
          ) : (
            <ChartComponent
              data={demoData}
              chartType={chartType}
              height={300}
            />
          )
        ) : (
          <ChartComponent
            data={visibleData}
            chartType={chartType}
            height={300}
          />
        )}
        {!isGameStarted && !isDemoLoading && (
          <div className="demo-pair-info">
            <span className="demo-pair-name">BTC/USDT Live Demo</span>
            <span className="demo-pair-price">
              {demoData.length > 0 && 
                `$${getPriceFromDataPoint(demoData[demoData.length - 1]).toLocaleString()}`
              }
            </span>
          </div>
        )}
      </div>
      
      {showPrediction && !hasPredicted && (
        <PredictionButtons onPredict={makePredict} disabled={hasPredicted} />
      )}

      {showNextButton && (
        <NextGameButton onNextGame={nextGame} />
      )}

      <BottomNavigation />
    </div>
  );
};

export default TradingGame;
