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

  // Effect to animate data when it's updated
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

  // Function to get a random token
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

  // Function to load data
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
      alert('Error loading data. Please try again.');
      setIsGameStarted(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to load demo data for BTC
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
              value: parseFloat(item[4]), // Closing price
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

  // Effect to load demo data on first render
  useEffect(() => {
    if (!isGameStarted) {
      loadDemoData();
      
      // Update data every minute
      const interval = setInterval(loadDemoData, 60000);
      
      return () => clearInterval(interval);
    }
  }, [isGameStarted, chartType]);

  // Function to start the game
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

  // Function to make a prediction
  const makePredict = async (direction: PredictionType) => {
    if (hasPredicted) return;
    
    // Check Telegram data before processing the prediction
    if (!WebApp.initData || !validateTelegramUser(WebApp.initData)) {
      console.error('Invalid or missing Telegram data');
      alert('Telegram authorization error');
      return;
    }

    setHasPredicted(true);

    const lastVisiblePoint = fullData[fullData.length - HIDDEN_DAYS - 1];
    const lastPoint = fullData[fullData.length - 1];

    if (!lastVisiblePoint || !lastPoint) {
      console.error('Invalid data for prediction');
      return;
    }

    const lastVisibleValue = getPriceFromDataPoint(lastVisiblePoint);
    const lastValue = getPriceFromDataPoint(lastPoint);

    const actualDirection = lastValue > lastVisibleValue ? 'up' : 'down';
    const isCorrect = direction === actualDirection;

    // Animate remaining data
    const remainingData = fullData.slice(-HIDDEN_DAYS);
    let currentIndex = 0;
    let lastTimestamp = 0;

    const animate = async (timestamp: number) => {
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
          setTimeout(() => {
            alert(
              `${isCorrect ? '✅ Correct!' : '❌ Incorrect!'} Token: ${
                currentToken?.name
              } (${currentToken?.symbol.replace('USDT', '')})`
            );
            setShowNextButton(true);
            if (isCorrect) {
              const newScore = score + 1;
              setScore(newScore);

              const user = WebApp.initDataUnsafe.user;
              if (user) {
                updateUserScore(user, newScore);
              }
            }
          }, 100);
          return;
        }
      }
      
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  };

  // Separate function to update score
  const updateUserScore = async (user: any, newScore: number) => {
    try {
      const response = await fetch('/api/updateScore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id.toString(),
          username: `${user.first_name} ${user.last_name || ''}`,
          score: newScore,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update score');
      }
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  // Function to move to the next game
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

  // Helper function to get price from data point
  const getPriceFromDataPoint = (dataPoint: ChartDataPoint): number => {
    if (dataPoint.type === 'line') {
      return dataPoint.value;
    }
    return dataPoint.close;
  };

  const validateTelegramUser = (initData: string): boolean => {
    try {
      const data = new URLSearchParams(initData);
      // Check for necessary parameters
      if (!data.get('user') || !data.get('hash')) {
        return false;
      }
      // Add additional validation here
      return true;
    } catch (error) {
      console.error('Invalid Telegram data:', error);
      return false;
    }
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
