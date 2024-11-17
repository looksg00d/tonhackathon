export interface UserScore {
    user_id: string;
    username: string;
    score: number;
    last_updated?: Date;
  }
  
  export interface LeaderboardEntry extends UserScore {
    rank: number;
  }