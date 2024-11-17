import pool from '../config/database';
import { UserScore, LeaderboardEntry } from '../models/types';

export const ScoreService = {
  // Добавление или обновление счета пользователя
  async updateScore(userData: {
    user_id: string;
    username: string;
    score: number;
  }): Promise<void> {
    try {
      const query = `
        INSERT INTO user_scores (user_id, username, score, last_updated)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          score = GREATEST(user_scores.score, $3),
          last_updated = NOW()
      `;
      
      await pool.query(query, [
        userData.user_id,
        userData.username,
        userData.score
      ]);
    } catch (error) {
      console.error('Error updating score:', error);
      throw error;
    }
  },

  // Получение списка лидеров
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const query = `
        SELECT 
          user_id,
          username,
          score,
          last_updated,
          ROW_NUMBER() OVER (ORDER BY score DESC) as rank
        FROM user_scores
        ORDER BY score DESC
        LIMIT 100
      `;
      
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  },

  // Получение счета конкретного пользователя
  async getUserScore(userId: string): Promise<UserScore | null> {
    try {
      const query = `
        SELECT user_id, username, score, last_updated
        FROM user_scores
        WHERE user_id = $1
      `;
      
      const result = await pool.query(query, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching user score:', error);
      throw error;
    }
  }
};