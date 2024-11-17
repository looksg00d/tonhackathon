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
    textColor: 'black',
    background: {
      type: ColorType.Solid,
      color: 'white',
    },
  },
  rightPriceScale: {
    visible: true,
    borderVisible: false,
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
  },
  grid: {
    vertLines: { visible: false },
    horzLines: { visible: false },
  },
  crosshair: {
    mode: 0, // CrosshairMode.Normal
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

      lineSeriesRef.current = chartRef.current.addLineSeries({
        color: '#2962FF',
        lineWidth: 2,
        visible: chartType === 'line',
      });

      candleSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        visible: chartType === 'candle',
      });

      predictionLineRef.current = chartRef.current.addLineSeries({
        color: '#808080',
        lineWidth: 1,
        lineStyle: 2, // LineStyle.Dotted
        visible: false,
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

  return <div ref={chartContainerRef} />;
};

export default ChartComponent;