import type { SearchResponse, HealthResponse, ReadyResponse } from "@/types/movie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Search movies using hybrid search with optional AI overview
 */
export async function searchMovies(
  query: string,
  options: {
    k?: number;
    alpha?: number;
    aiOverview?: boolean;
  } = {}
): Promise<SearchResponse> {
  const { k = 10, alpha = 0.5, aiOverview = false } = options;

  const params = new URLSearchParams({
    q: query,
    k: k.toString(),
    alpha: alpha.toString(),
    ai_overview: aiOverview.toString(),
  });

  const response = await fetch(`${API_BASE_URL}/search?${params}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * Check if the API is healthy
 */
export async function checkHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error("Health check failed");
  }
  return response.json();
}

/**
 * Check if models are loaded and ready
 */
export async function checkReady(): Promise<ReadyResponse> {
  const response = await fetch(`${API_BASE_URL}/ready`);
  if (!response.ok) {
    throw new Error("Readiness check failed");
  }
  return response.json();
}

/**
 * Get the full TMDB poster URL
 */
export function getPosterUrl(posterPath: string | null | undefined, size: "w200" | "w300" | "w500" | "original" = "w500"): string {
  if (!posterPath) {
    return "/placeholder-poster.svg";
  }
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}

