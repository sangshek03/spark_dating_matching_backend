export interface MatchScore {
    userId: string;
    score: number;
  }
  
  export interface MatchResult {
    userId: string;
    score: number;
    profile: any; // We'll replace this with actual Profile type later
  }