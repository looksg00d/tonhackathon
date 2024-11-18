import pool from '../config/database';
import { UserService } from './userService';
import { ScoreService } from './scoreService';
import { TelegramUser } from '../models/types';

export const TransactionService = {
  async updateUserAndScore(userData: TelegramUser, score: number) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Создаем/обновляем пользователя
      await UserService.createOrUpdateUser(userData);
      
      // Обновляем счет
      await ScoreService.updateScore({
        user_id: userData.id.toString(),
        username: `${userData.first_name} ${userData.last_name || ''}`.trim(),
        score
      });
      
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Transaction failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }
};