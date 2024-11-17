import { FC, useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, LineData, CandlestickData } from 'lightweight-charts';
import { 
  Button,
  Select,
  Section
} from '@telegram-apps/telegram-ui';
import './TradingGame.css';

type ChartType = 'line' | 'candle';
type PredictionType = 'up' | 'down';

interface TradingGameProps {
  className?: string;
}

export const TradingGame: FC<TradingGameProps> = () => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | ISeriesApi<'Candlestick'> | null>(null);

  const [selectedToken, setSelectedToken] = useState('BTCUSDT');
  const [chartType, setChartType] = useState<ChartType>('line');
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [showPrediction, setShowPrediction] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [gameData, setGameData] = useState<(LineData | CandlestickData)[]>([]);
  const [score, setScore] = useState(0);

  // Инициализация графика
  useEffect(() => {
    if (chartContainerRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 300,
        layout: {
          background: { color: '#ffffff' },
          textColor: '#333',
        },
        grid: {
          vertLines: { color: '#f0f0f0' },
          horzLines: { color: '#f0f0f0' },
        },
      });

      // Добавляем серию при инициализации
      if (chartType === 'line') {
        seriesRef.current = chartRef.current.addLineSeries();
      } else {
        seriesRef.current = chartRef.current.addCandlestickSeries();
      }

      // Генерация начальных данных
      const initialData = generateRandomData(30);
      seriesRef.current.setData(initialData);
      setGameData(initialData);

      // Responsive chart
      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth
          });
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        if (chartRef.current) {
          chartRef.current.remove();
        }
      };
    }
  }, []);

  // Генерация случайных данных
  const generateRandomData = (count: number): (LineData | CandlestickData)[] => {
    const data: (LineData | CandlestickData)[] = [];
    let lastClose = Math.random() * 10000 + 20000;

    for (let i = 0; i < count; i++) {
      const time = new Date(Math.floor((Date.now() - (count - i) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0];

      if (chartType === 'line') {
        data.push({
          time: time,
          value: lastClose,
        });
      } else {
        const open = lastClose;
        const close = open + (Math.random() - 0.5) * 500;
        const high = Math.max(open, close) + Math.random() * 200;
        const low = Math.min(open, close) - Math.random() * 200;

        data.push({
          time: time,
          open,
          high,
          low,
          close,
        });

        lastClose = close;
      }
    }

    return data;
  };

  // Обновление типа графика
  const updateChartType = (type: ChartType) => {
    setChartType(type);
    if (chartRef.current) {
      if (seriesRef.current) {
        chartRef.current.removeSeries(seriesRef.current);
      }

      if (type === 'line') {
        seriesRef.current = chartRef.current.addLineSeries();
      } else {
        seriesRef.current = chartRef.current.addCandlestickSeries();
      }

      const newData = generateRandomData(30);
      seriesRef.current.setData(newData);
      setGameData(newData);
    }
  };

  // Начало игры
  const startGame = () => {
    setIsGameStarted(true);
    setShowPrediction(true);
    setShowNextButton(false);
    updateChartType(chartType);
  };

  // Предсказание
  const makePredict = (prediction: PredictionType) => {
    setShowPrediction(false);
    setShowNextButton(true);

    // Генерируем продолжение графика
    const lastPrice = (gameData[gameData.length - 1] as any).close || (gameData[gameData.length - 1] as any).value;
    const movement = (Math.random() - 0.5) * 1000;
    const newPrice = lastPrice + movement;

    const newData = {
      time: Math.floor(Date.now() / 1000), // UNIX timestamp
      ...(chartType === 'line' 
        ? { value: newPrice }
        : {
            open: lastPrice,
            close: newPrice,
            high: Math.max(lastPrice, newPrice) + Math.random() * 100,
            low: Math.min(lastPrice, newPrice) - Math.random() * 100,
          }
      )
    };

    if (seriesRef.current) {
      seriesRef.current.update(newData as LineData | CandlestickData);
    }

    // Проверяем предсказание
    const isCorrect = (prediction === 'up' && newPrice > lastPrice) ||
                       (prediction === 'down' && newPrice < lastPrice);

    setScore(prev => prev + (isCorrect ? 1 : 0));
  };

  // Следующая игра
  const nextGame = () => {
    setShowPrediction(true);
    setShowNextButton(false);
    updateChartType(chartType);
  };

  return (
    <Section>
      <div className="trading-game">
        <div className="trading-game__controls">
          <Select
            value={selectedToken}
            onChange={(e) => setSelectedToken(e.target.value)}
            disabled={isGameStarted}
          >
            <option value="BTCUSDT">BTC/USDT</option>
            <option value="ETHUSDT">ETH/USDT</option>
            <option value="BNBUSDT">BNB/USDT</option>
          </Select>

          <div className="trading-game__buttons">
            <Button
              onClick={() => updateChartType('line')}
              disabled={isGameStarted}
            >
              Линия
            </Button>
            <Button
              onClick={() => updateChartType('candle')}
              disabled={isGameStarted}
            >
              Свечи
            </Button>
          </div>

          {!isGameStarted && (
            <Button onClick={startGame}>▶️ Ст��рт</Button>
          )}

          {showPrediction && (
            <div className="trading-game__prediction">
              <Button onClick={() => makePredict('up')}>⬆️ Вверх</Button>
              <Button onClick={() => makePredict('down')}>⬇️ Вниз</Button>
            </div>
          )}

          {showNextButton && (
            <Button onClick={nextGame}>▶️ Следующий</Button>
          )}

          <div className="trading-game__score">
            Счет: {score}
          </div>
        </div>

        <div 
          ref={chartContainerRef} 
          className="trading-game__chart"
        />
      </div>
    </Section>
  );
};