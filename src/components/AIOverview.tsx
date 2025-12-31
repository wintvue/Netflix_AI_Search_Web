"use client";

import { useState, useEffect, useMemo } from "react";
import type { AIOverviewResponse, MovieExplanation } from "@/types/movie";

interface AIOverviewProps {
  overview: AIOverviewResponse;
  query: string;
}

/**
 * Parse raw JSON content that may have markdown code fences or formatting issues.
 * Returns extracted overview text and movie explanations if parsing succeeds.
 */
function parseRawOverview(rawContent: string): { 
  overview: string; 
  movieExplanations: MovieExplanation[] 
} | null {
  try {
    // Clean up potential markdown code fences
    let content = rawContent.trim();
    if (content.startsWith("```json")) {
      content = content.slice(7);
    }
    if (content.startsWith("```")) {
      content = content.slice(3);
    }
    if (content.endsWith("```")) {
      content = content.slice(0, -3);
    }
    content = content.trim();
    
    // Try to fix common JSON issues (missing comma after overview)
    // Pattern: "overview": "..." followed by newline and "movie_explanations" without comma
    content = content.replace(
      /("overview"\s*:\s*"[^"]*")\s*\n\s*("movie_explanations")/g,
      '$1,\n  $2'
    );
    
    const parsed = JSON.parse(content);
    return {
      overview: parsed.overview || "",
      movieExplanations: parsed.movie_explanations || []
    };
  } catch {
    // If JSON parsing fails, try to extract just the overview text using regex
    const overviewMatch = rawContent.match(/"overview"\s*:\s*"([^"]+)"/);
    if (overviewMatch) {
      return {
        overview: overviewMatch[1],
        movieExplanations: []
      };
    }
    return null;
  }
}

function TypewriterText({ text, speed = 15 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!text) {
      setDisplayedText("");
      setIsComplete(true);
      return;
    }
    
    setDisplayedText("");
    setIsComplete(false);
    
    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span>
      {displayedText}
      {!isComplete && <span className="animate-pulse text-[#E50914]">|</span>}
    </span>
  );
}

export default function AIOverview({ overview, query }: AIOverviewProps) {
  const ai_metadata = overview?.ai_metadata;
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Handle parse_error status by trying to extract content from raw JSON
  const { displayOverview, displayExplanations } = useMemo(() => {
    const overviewText = overview?.overview || "";
    const movieExplanations = overview?.movie_explanations || [];
    
    if (ai_metadata?.status === "parse_error" && overviewText) {
      const parsed = parseRawOverview(overviewText);
      if (parsed) {
        return {
          displayOverview: parsed.overview,
          displayExplanations: parsed.movieExplanations.length > 0 
            ? parsed.movieExplanations 
            : movieExplanations
        };
      }
    }
    return {
      displayOverview: overviewText,
      displayExplanations: movieExplanations
    };
  }, [overview, ai_metadata?.status]);
  
  // Don't render if there's no meaningful content
  if (!displayOverview && displayExplanations.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] rounded overflow-hidden border border-zinc-800">
      {/* Header */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#E50914] rounded flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-white font-semibold">AI Overview</h3>
            <p className="text-xs text-zinc-500">Why these titles match &ldquo;{query}&rdquo;</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {ai_metadata?.generation_time_ms && ai_metadata.generation_time_ms > 0 && (
            <span className="text-xs text-zinc-500">
              {(ai_metadata.generation_time_ms / 1000).toFixed(1)}s
            </span>
          )}
          <svg 
            className={`w-5 h-5 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Overview Text */}
          <p className="text-zinc-300 leading-relaxed">
            <TypewriterText text={displayOverview} speed={12} />
          </p>

          {/* Movie Explanations */}
          {displayExplanations.length > 0 && (
            <div className="grid gap-2">
              {displayExplanations.slice(0, 5).map((exp, index) => (
                <div 
                  key={exp.id} 
                  className="flex gap-3 p-3 bg-black/30 rounded hover:bg-black/50 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-zinc-800 rounded text-xs font-bold text-zinc-400 flex items-center justify-center">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h5 className="font-medium text-white text-sm truncate">{exp.title}</h5>
                    <p className="text-xs text-zinc-500 line-clamp-2">{exp.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
