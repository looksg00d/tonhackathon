import { FC, useState, useEffect } from 'react';
import { Page } from '@/components/Page.tsx';
import { List, Section, Cell, Text } from '@telegram-apps/telegram-ui';
import BottomNavigation from '@/components/TradingGame/BottomNavigation';
import './LeaderboardPage.css';
import { ScoreService } from '../../services/scoreService';

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
        const data = await ScoreService.getLeaderboard();
        setLeaderboardData(data.map(entry => ({
          first_name: entry.username.split(' ')[0],
          last_name: entry.username.split(' ')[1] || '',
          score: entry.score
        })));
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
      <List>
        <Section header="Лидерборд">
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
      <BottomNavigation />
    </Page>
  );
};
