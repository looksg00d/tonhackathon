import { Time } from 'lightweight-charts';

export type ChartType = 'line' | 'candle';
export type PredictionType = 'up' | 'down';

export interface TradingPair {
  symbol: string;
  name: string;
}

export type CustomLineData = {
  time: Time;
  value: number;
};

export type CustomCandleData = {
  time: Time;
  open: number;
  high: number;
  low: number;
  close: number;
};

export type ChartDataPoint = 
  | (CustomLineData & { type: 'line' })
  | (CustomCandleData & { type: 'candle' });