import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://looksgood:k4sUygEP7cnjcmtE4LIHfB9V0OLpKskJ@dpg-cst6fs52ng1s73as2ing-a.frankfurt-postgres.render.com/telegram_app_pwm4',
  ssl: {
    rejectUnauthorized: false
  }
});

export default pool;  