// Movie type from the backend API
export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview?: string;
  tagline?: string;
  genres?: string;
  release_date?: string;
  original_language?: string;
  poster_path?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  // Search-specific fields
  rerank_score?: number;
  rrf_score?: number;
  vector_rank?: number | null;
  bm25_rank?: number | null;
  distance?: number;
}

// AI Overview types
export interface MovieExplanation {
  id: number;
  title: string;
  explanation: string;
}

export interface AIMetadata {
  model: string;
  generation_time_ms: number;
  status: "success" | "parse_error" | "error" | "no_results";
  eval_count?: number;
  prompt_eval_count?: number;
  error?: string;
}

export interface AIOverviewResponse {
  overview: string;
  movie_explanations: MovieExplanation[];
  ai_metadata: AIMetadata;
}

// Search API response
export interface SearchResponse {
  query: string;
  config?: {
    alpha: number;
    rrf_k: number;
    vector_candidates?: number;
    bm25_candidates?: number;
    rerank_candidates?: number;
  };
  timings?: {
    encode_ms: number;
    retrieval_ms: number;
    fusion_ms: number;
    fetch_ms: number;
    rerank_ms: number;
    total_ms: number;
  };
  retrieval?: {
    vector: number;
    bm25: number;
    fused: number;
  };
  count: number;
  results: Movie[];
  ai_overview?: AIOverviewResponse;
}

// Health check response
export interface HealthResponse {
  status: string;
}

export interface ReadyResponse {
  status: string;
  models_loaded: boolean;
  load_times: Record<string, number>;
}

