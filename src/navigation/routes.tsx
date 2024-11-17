import type { ComponentType, JSX } from 'react';
import TradingGame from '@/components/TradingGame/TradingGame';
import { WalletPage } from '@/components/TradingGame/WalletPage';
import { LeaderboardPage } from '@/components/TradingGame/LeaderboardPage';

interface Route {
  path: string;
  Component: ComponentType;
  title?: string;
  icon?: JSX.Element;
}

export const routes: Route[] = [
  { path: '/', Component: TradingGame, title: 'Trading Game' },
  { path: '/wallet', Component: WalletPage, title: 'Wallet' },
  { path: '/leaderboard', Component: LeaderboardPage, title: 'Leaderboard' },
];
