import type { SearchResponse, HealthResponse, ReadyResponse, AIOverviewResponse } from "@/types/movie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Search movies using hybrid search with SSE streaming for AI overview
 */
export interface SearchStreamCallbacks {
  onResults: (response: SearchResponse) => void;
  onOverview: (overview: AIOverviewResponse) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

/**
 * Search movies with SSE streaming - returns results immediately, then AI overview
 */
export function searchMoviesStream(
  query: string,
  options: {
    k?: number;
    alpha?: number;
  } = {},
  callbacks: SearchStreamCallbacks
): EventSource {
  const { k = 10, alpha = 0.5 } = options;

  const params = new URLSearchParams({
    q: query,
    k: k.toString(),
    alpha: alpha.toString(),
    ai_overview: "true",
    stream: "true",
  });

  const url = `${API_BASE_URL}/search?${params}`;
  const eventSource = new EventSource(url);

  eventSource.addEventListener("results", (event) => {
    try {
      const data = JSON.parse(event.data);
      callbacks.onResults(data);
    } catch (error) {
      callbacks.onError?.(new Error("Failed to parse results"));
    }
  });

  eventSource.addEventListener("overview", (event) => {
    try {
      const data = JSON.parse(event.data);
      callbacks.onOverview(data);
    } catch (error) {
      callbacks.onError?.(new Error("Failed to parse overview"));
    }
  });

  eventSource.addEventListener("error", (event) => {
    try {
      const data = JSON.parse((event as MessageEvent).data);
      callbacks.onError?.(new Error(data.error || "Stream error"));
    } catch {
      callbacks.onError?.(new Error("Stream connection error"));
    }
    eventSource.close();
  });

  eventSource.addEventListener("done", () => {
    callbacks.onComplete?.();
    eventSource.close();
  });

  eventSource.onerror = () => {
    callbacks.onError?.(new Error("EventSource connection failed"));
    eventSource.close();
  };

  return eventSource;
}

/**
 * Search movies using hybrid search with optional AI overview (non-streaming)
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

