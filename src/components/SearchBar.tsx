"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string, options: { aiOverview: boolean }) => void;
  isLoading?: boolean;
}

export default function SearchBar({ onSearch, isLoading = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [aiOverview, setAiOverview] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, { aiOverview });
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        {/* Netflix-style Search Container */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to watch?"
              className="w-full h-14 sm:h-16 px-6 pr-12 text-lg bg-black/60 border border-zinc-600 rounded
                         text-white placeholder-zinc-400 focus:outline-none focus:border-white
                         transition-colors backdrop-blur-sm"
            />
            {/* Search Icon */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400">
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="h-14 sm:h-16 px-8 bg-[#E50914] hover:bg-[#F40612] text-white font-semibold text-lg
                       rounded transition-colors flex items-center justify-center gap-2"
          >
            Search
          </button>
        </div>
      </form>

      {/* AI Overview Toggle - inline below search */}
      <div className="mt-4 flex items-center justify-center">
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              checked={aiOverview}
              onChange={(e) => setAiOverview(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-700 rounded-full peer-checked:bg-[#E50914] transition-colors" />
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[#E50914]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm text-white font-medium">AI Overview</span>
            <span className="text-xs text-zinc-500 hidden sm:inline">Get AI-powered explanations</span>
          </div>
        </label>
      </div>
    </div>
  );
}
