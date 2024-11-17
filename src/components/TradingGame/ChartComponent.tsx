import React, { useEffect, useRef } from 'react';
import {
  createChart,
  IChartApi,
  ISeriesApi,
  ChartOptions,
  DeepPartial,
  ColorType,
} from 'lightweight-charts';
import { ChartType, ChartDataPoint } from './types';

interface ChartComponentProps {
  data: ChartDataPoint[];
  chartType: ChartType;
  height: number;
  width?: number;
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
    alignLabels: true,
  },
  timeScale: {
    timeVisible: true,
    secondsVisible: false,
    borderVisible: false,
    rightOffset: 0,
    barSpacing: 20,
    fixLeftEdge: true,
    fixRightEdge: true,
  },
};

const ChartComponent: React.FC<ChartComponentProps> = ({ 
  data, 
  chartType, 
  height,
  width = window.innerWidth
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        ...chartOptions,
        width: chartContainerRef.current.clientWidth,
        height,
        timeScale: {
          ...chartOptions.timeScale,
          rightOffset: 5,
          barSpacing: 20,
          fixLeftEdge: true,
          fixRightEdge: true,
        },
        rightPriceScale: {
          autoScale: true,
          scaleMargins: {
            top: 0.1,
            bottom: 0.1
          },
        }
      });

      if (chartRef.current) {
        lineSeriesRef.current = chartRef.current.addLineSeries({
          color: '#2962FF',
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

        if (chartType === 'line' && lineSeriesRef.current) {
          lineSeriesRef.current.setData(data);
          chartRef.current.timeScale().fitContent();
        } else if (chartType === 'candle' && candleSeriesRef.current) {
          candleSeriesRef.current.setData(data);
          chartRef.current.timeScale().fitContent();
        }
      }

      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          const containerWidth = chartContainerRef.current.clientWidth;
          chartRef.current.applyOptions({ 
            width: containerWidth,
            height: height 
          });
          chartRef.current.timeScale().fitContent();
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
  }, [data, chartType, width, height]);

  return (
    <div className="chart-container">
      <div ref={chartContainerRef} />
    </div>
  );
};

export default ChartComponent;
