export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface UserScore {
    user_id: string;
    username: string;
    score: number;
    last_updated?: Date;
  }
  
  export interface LeaderboardEntry extends UserScore {
    rank: number;
  }