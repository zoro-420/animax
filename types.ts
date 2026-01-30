export enum ContentType {
  EPISODE = 'EPISODE',
  MOVIE = 'MOVIE',
  OVA = 'OVA'
}

export interface WatchOrderItem {
  id: string;
  type: ContentType;
  title: string;
  duration: string;
  thumbnail: string;
  description: string;
  orderIndex: number; // The canonical order
  isReleased: boolean;
  releaseDate?: string;
}

export interface Anime {
  id: string;
  title: string;
  japaneseTitle?: string;
  coverImage: string;
  bannerImage: string;
  description: string;
  rating: number; // 0-10
  genres: string[];
  year: number;
  status: 'Ongoing' | 'Completed' | 'Upcoming';
  type: 'TV' | 'Movie' | 'OVA' | 'ONA'; // New field for card badge
  quality: 'HD' | 'FHD' | '4K'; // New field for card badge
  totalEpisodes?: number; // New field
  currentEpisode?: number; // New field for badge
  nextEpisodeDate?: string; // For AI context
  availableLanguages: string[]; // Sub/Dub languages
  hasDub: boolean; // New badge
  hasSub: boolean; // New badge
  watchOrder: WatchOrderItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin' | 'guest';
  isGuest: boolean;
  watchlist: string[];
  history: string[];
}

export type ViewState = 'HOME' | 'DETAIL' | 'WATCH' | 'AUTH';