"use client";

import { useState, useCallback, useRef } from "react";
import SearchBar from "@/components/SearchBar";
import MovieGrid from "@/components/MovieGrid";
import AIOverview from "@/components/AIOverview";
import { SearchSkeleton, AIOverviewSkeleton } from "@/components/LoadingState";
import { searchMovies, searchMoviesStream } from "@/lib/api";
import type { SearchResponse, AIOverviewResponse } from "@/types/movie";

export default function Home() {
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);
  const [aiOverview, setAiOverview] = useState<AIOverviewResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [lastAiOverview, setLastAiOverview] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  const handleSearch = useCallback(
    (query: string, options: { aiOverview: boolean }) => {
      if (!query.trim()) return;

      // Close any existing SSE connection
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      setIsLoading(true);
      setError(null);
      setHasSearched(true);
      setLastAiOverview(options.aiOverview);
      setSearchResult(null);
      setAiOverview(null);

      if (options.aiOverview) {
        // Use SSE streaming for AI overview
        setIsAiLoading(true);

        eventSourceRef.current = searchMoviesStream(
          query,
          { k: 24 },
          {
            onResults: (response) => {
              // Results arrive immediately - display them!
              setSearchResult(response);
              setIsLoading(false);
            },
            onOverview: (overview) => {
              // AI overview arrives later - update the display
              setAiOverview(overview);
              setIsAiLoading(false);
            },
            onError: (err) => {
              console.error("Stream error:", err);
              setError(err.message);
              setIsLoading(false);
              setIsAiLoading(false);
            },
            onComplete: () => {
              setIsAiLoading(false);
              eventSourceRef.current = null;
            },
          }
        );
      } else {
        // Use regular fetch for non-AI searches
        searchMovies(query, { k: 24, aiOverview: false })
          .then((result) => {
            setSearchResult(result);
          })
          .catch((err) => {
            console.error("Search error:", err);
            setError(err instanceof Error ? err.message : "Failed to search movies");
            setSearchResult(null);
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    },
    []
  );

  const showResults = hasSearched || isLoading || error;

  const handleLogoClick = () => {
    // Close any existing SSE connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setSearchResult(null);
    setAiOverview(null);
    setIsLoading(false);
    setIsAiLoading(false);
    setError(null);
    setHasSearched(false);
    setLastAiOverview(false);
  };

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col">
      {/* Netflix-style Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        <div className="flex items-center justify-between px-4 md:px-12 py-4">
          {/* Netflix-style Logo - Clickable */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <span className="text-[#E50914] text-2xl md:text-3xl font-black tracking-tight" style={{ fontFamily: "'Bebas Neue', Arial Black, sans-serif" }}>
              NETFLIX
            </span>
            <span className="text-white text-sm font-medium opacity-70">AI Search</span>
          </button>

          {/* User Avatar */}
          <button className="w-9 h-9 rounded-md overflow-hidden bg-gradient-to-br from-[#E50914] to-[#831010] hover:ring-2 hover:ring-white/50 transition-all">
            <svg className="w-full h-full p-1.5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section - Full height when no results */}
      <section className={`relative flex items-center justify-center ${showResults ? 'pt-24 pb-8' : 'flex-1 min-h-screen'}`}>
        {/* Cinematic Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#141414]/80 to-[#141414]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

        {/* Subtle animated gradient */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, rgba(229, 9, 20, 0.15) 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
          {/* Main Title */}
          <div className="text-center mb-8">
            <h1 className={`font-black text-white tracking-tight transition-all duration-300 ${showResults ? 'text-3xl md:text-4xl mb-2' : 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4'}`}>
              {showResults ? (
                <>Find your next favorite</>
              ) : (
                <>
                  Unlimited movies,
                  <br />
                  <span className="text-[#E50914]">AI-powered</span> discovery
                </>
              )}
            </h1>
            {!showResults && (
              <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto">
                Search by mood, theme, or vibe. Our AI understands what you&apos;re looking for.
              </p>
            )}
          </div>

          {/* Search Bar */}
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          {/* Quick suggestions - only show when no search */}
          {!showResults && (
            <div className="text-center mt-8">
              <p className="text-zinc-500 text-sm mb-4">Try searching for:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["mind-bending thriller", "feel-good comedy", "epic adventure", "romantic drama"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSearch(suggestion, { aiOverview: false })}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white rounded-full text-sm transition-all border border-white/10 hover:border-white/20"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Section - Only show when there are results */}
      {showResults && (
        <main className="flex-1 px-4 md:px-12 pb-12">
          {/* Error State */}
          {error && (
            <div className="bg-[#E50914]/10 border border-[#E50914]/30 rounded p-4 mb-6 max-w-4xl mx-auto">
              <p className="text-[#E50914] text-center">{error}</p>
              <p className="text-sm text-zinc-500 mt-1 text-center">
                Make sure the backend server is running on port 8000
              </p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && <SearchSkeleton showAiOverview={lastAiOverview} />}

          {/* Results */}
          {!isLoading && searchResult && (
            <div className="space-y-6">
              {/* Results Header */}
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                  Results for &ldquo;{searchResult.query}&rdquo;
                </h2>
                <p className="text-zinc-500 text-sm">
                  {searchResult.count} titles found
                </p>
              </div>

              {/* AI Overview Loading State */}
              {isAiLoading && lastAiOverview && <AIOverviewSkeleton />}

              {/* AI Overview */}
              {aiOverview && (
                <AIOverview
                  overview={aiOverview}
                  query={searchResult.query}
                />
              )}

              {/* Movie Grid */}
              <MovieGrid movies={searchResult.results} />
            </div>
          )}

          {/* No results after search */}
          {!isLoading && !searchResult && hasSearched && !error && (
            <div className="text-center py-12">
              <p className="text-zinc-400">No results found. Try a different search.</p>
            </div>
          )}
        </main>
      )}
    </div>
  );
}
