// src/services/userService.ts
import pool from '../config/database';
import { TelegramUser } from '../models/types';
import { PoolClient } from 'pg';

export const UserService = {
  async createOrUpdateUser(userData: TelegramUser, client?: PoolClient) {
    const queryExecutor = client || pool;
    const query = `
      INSERT INTO users (
        user_id, 
        username, 
        first_name, 
        last_name
      ) VALUES ($1, $2, $3, $4)
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        username = EXCLUDED.username,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        last_login = NOW()
      RETURNING *
    `;

    const values = [
      userData.id.toString(),
      userData.username || '',
      userData.first_name,
      userData.last_name || ''
    ];

    try {
      const result = await queryExecutor.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  },

  async getUser(userId: string) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE user_id = $1',
        [userId]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }
};