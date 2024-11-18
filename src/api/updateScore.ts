// src/api/updateScore.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../config/database';
import { handleDatabaseError } from '../utils/errorHandler';
import { UserService } from '../services/userService';

export default async (req: VercelRequest, res: VercelResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, username, score } = req.body;

  if (!user_id || !username || typeof score !== 'number') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Сначала обновляем/создаем пользователя
    await UserService.createOrUpdateUser({
      id: parseInt(user_id),
      first_name: username,
      username
    }, client);

    // Затем обновляем счет
    const scoreQuery = `
      INSERT INTO user_scores (user_id, username, score, last_updated)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (user_id) 
      DO UPDATE SET 
        score = GREATEST(user_scores.score, $3),
        last_updated = NOW()
      RETURNING *
    `;

    const scoreResult = await client.query(scoreQuery, [user_id, username, score]);
    
    await client.query('COMMIT');
    
    console.log('Score updated successfully for user_id:', user_id);
    res.status(200).json({ 
      message: 'Score updated successfully',
      data: scoreResult.rows[0]
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating score:', error);
    const dbError = handleDatabaseError(error);
    res.status(500).json({ error: dbError.message });
  } finally {
    client.release();
  }
};