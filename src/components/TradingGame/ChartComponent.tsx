import React, { useEffect, useRef } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  LineData,
  CandlestickData,
  ChartOptions,
  DeepPartial,
  ColorType,
} from 'lightweight-charts';
import { ChartType, ChartDataPoint } from './types';

interface ChartComponentProps {
  data: ChartDataPoint[];
  chartType: ChartType;
  width: number;
  height: number;
}

const chartOptions: DeepPartial<ChartOptions> = {
  layout: {
    textColor: '#333',
    background: {
      type: ColorType.Solid,
      color: '#ffffff',
    },
  },
  grid: {
    vertLines: { color: '#f0f3fa' },
    horzLines: { color: '#f0f3fa' },
  },
  crosshair: {
    mode: 0,
    vertLine: {
      width: 1,
      color: '#2962FF',
      style: 2, // LineStyle.Dashed
    },
    horzLine: {
      width: 1,
      color: '#2962FF',
      style: 2,
    },
  },
  rightPriceScale: {
    visible: true,
    borderVisible: false,
    scaleMargins: {
      top: 0.1,
      bottom: 0.1,
    },
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
    borderVisible: false,
  },
};

const ChartComponent: React.FC<ChartComponentProps> = ({ data, chartType, width, height }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const predictionLineRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      chartRef.current = createChart(chartContainerRef.current, { ...chartOptions, width, height });

      predictionLineRef.current = chartRef.current.addLineSeries({
        color: '#808080',
        lineWidth: 1,
        lineStyle: 2,
        visible: false,
      });


      lineSeriesRef.current = chartRef.current.addLineSeries({
        color: '#2962FF', // Ensure 'color' is specified for LineSeries
        lineWidth: 2,
        visible: chartType === 'line',
      });

      candleSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
        visible: chartType === 'candle',
      });
      chartRef.current.subscribeCrosshairMove((param) => {
        if (param.point) {
          // Можно добавить тултип или другие эффекты при наведении
        }
      });

      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
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
  }, [chartType, width, height]);

  useEffect(() => {
    if (chartType === 'line' && lineSeriesRef.current) {
      const lineData: LineData[] = data.map((d) => ({
        time: d.time,
        value: d.type === 'line' ? d.value : d.close,
      }));
      lineSeriesRef.current.setData(lineData);
    } else if (chartType === 'candle' && candleSeriesRef.current) {
      const candleData: CandlestickData[] = data.map((d) => {
        if (d.type === 'candle') {
          return {
            time: d.time,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
          };
        }
        // Обработка данных для типа 'line', возможно, преобразование их в 'candle'
        return {
          time: d.time,
          open: d.value,
          high: d.value,
          low: d.value,
          close: d.value,
        };
      });
      candleSeriesRef.current.setData(candleData);
    }
  }, [data, chartType]);

  return (
    <div className="chart-container">
      <div ref={chartContainerRef} />
    </div>
  );
};

export default ChartComponent;
