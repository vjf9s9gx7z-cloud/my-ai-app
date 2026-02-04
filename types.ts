
export interface SearchResult {
  text: string;
  groundingChunks: GroundingChunk[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchState {
  isLoading: boolean;
  error: string | null;
  data: SearchResult | null;
}

export enum SearchType {
  LOCATION = 'LOCATION',
  COMPANY = 'COMPANY'
}

export interface RecentSearch {
  query: string;
  type: SearchType;
  timestamp: number;
}
