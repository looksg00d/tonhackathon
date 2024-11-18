// src/api/getLeaderboard.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import pool from '../config/database.js';

export default async (req: VercelRequest, res: VercelResponse) => {
  console.log('Received request to get leaderboard:', req.method);

  if (req.method !== 'GET') {
    console.warn('Method not allowed:', req.method);
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

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

  try {
    const result = await pool.query(query);
    console.log('Leaderboard fetched successfully:', result.rows.length, 'entries');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};