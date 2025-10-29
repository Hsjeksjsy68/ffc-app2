export type Feature = 'news' | 'schedule' | 'map' | 'art' | 'analyzer' | 'players' | 'moderator' | 'contact';

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '9:16',
  LANDSCAPE = '16:9',
  PHOTO_PORTRAIT = '3:4',
  PHOTO_LANDSCAPE = '4:3'
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets: {
            uri: string;
            title: string;
            text: string;
        }[];
    }[]
  };
}

export interface NewsResult {
  text: string;
  sources: GroundingChunk[];
}

export interface MapResult {
  text: string;
  sources: GroundingChunk[];
}

export interface ImageResult {
  url: string;
  prompt: string;
}

export interface AnalysisResult {
  text: string;
}

// --- Player Section Types --- //

export interface Player {
  id: string;
  name: string;
  // password should not be sent to the frontend in a real app
}

export interface PlayerStats {
  label: string;
  value: string;
}

export interface MatchInfo {
  opponent: string;
  competition: string;
  date: string; // YYYY-MM-DD format
  time: string;
  venue: string;
  score?: string; // e.g., "2 - 1"
}

export interface TeamNewsItem {
  id: number;
  title: string;
}

export interface DashboardData {
  seasonStats: PlayerStats[];
  allTimeStats: PlayerStats[];
  nextMatch: MatchInfo;
  teamNews: TeamNewsItem[];
}

// --- Moderator Section Types --- //
export interface NewPlayer {
  id: string;
  name: string;
  password_hash: string;
}

// --- Club Leaders Types --- //
export interface ClubLeader {
  name: string;
  value: string;
}

export interface ClubLeadersData {
  topScorer: ClubLeader;
  topAssister: ClubLeader;
  topGA: ClubLeader;
}