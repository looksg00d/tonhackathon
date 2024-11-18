import { FC, useState, useEffect } from 'react';
import { Page } from '@/components/Page.tsx';
import { List, Section, Cell, Text } from '@telegram-apps/telegram-ui';
import BottomNavigation from '@/components/TradingGame/BottomNavigation';
import './LeaderboardPage.css';

interface LeaderboardEntry {
  first_name: string;
  last_name?: string;
  score: number;
}

export const LeaderboardPage: FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/getLeaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data = await response.json();
        setLeaderboardData(
          data.map((entry: any) => ({
            first_name: entry.username.split(' ')[0],
            last_name: entry.username.split(' ')[1] || '',
            score: entry.score,
          }))
        );
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Page>
      <div className="leaderboard-container">
        <div className="coming-soon-overlay">
          <h1 className="coming-soon-text">SOON</h1>
        </div>
        <List>
          <Section>
            {leaderboardData.map((player, index) => (
              <Cell key={index}>
                <div className="leaderboard-item">
                  <Text weight="1">#{index + 1}</Text>
                  <Text>
                    {player.first_name}
                    {player.last_name ? ` ${player.last_name}` : ''}
                  </Text>
                  <Text className="score">{player.score}</Text>
                </div>
              </Cell>
            ))}
          </Section>
        </List>
      </div>
      <BottomNavigation />
    </Page>
  );
};
