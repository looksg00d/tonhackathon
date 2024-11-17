import { FC } from 'react';
import { Page } from '@/components/Page.tsx';
import { List, Section, Cell, Text } from '@telegram-apps/telegram-ui';
import BottomNavigation from '@/components/TradingGame/BottomNavigation';
import './LeaderboardPage.css';

export const LeaderboardPage: FC = () => {
  // Здесь можно добавить состояние для хранения данных лидерборда
  const leaderboardData = [
    { rank: 1, name: 'Player 1', score: 1000 },
    { rank: 2, name: 'Player 2', score: 850 },
    { rank: 3, name: 'Player 3', score: 700 },
  ];

  return (
    <Page>
      <List>
        <Section header="Лидерборд">
          {leaderboardData.map((player) => (
            <Cell key={player.rank}>
              <div className="leaderboard-item">
                <Text weight="bold">#{player.rank}</Text>
                <Text>{player.name}</Text>
                <Text className="score">{player.score}</Text>
              </div>
            </Cell>
          ))}
        </Section>
      </List>
      <BottomNavigation />
    </Page>
  );
};