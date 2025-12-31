"use client";

import { useState } from "react";
import Image from "next/image";
import type { Movie } from "@/types/movie";
import { getPosterUrl } from "@/lib/api";

interface MovieCardProps {
  movie: Movie;
  rank?: number;
}

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

function MovieModal({ movie, onClose }: MovieModalProps) {
  const releaseYear = movie.release_date?.split("-")[0] || "Unknown";
  const rating = movie.vote_average != null ? Number(movie.vote_average).toFixed(1) : "N/A";
  const popularity = movie.popularity != null ? Math.round(Number(movie.popularity)) : null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#181818] rounded-lg overflow-hidden shadow-2xl animate-scale-in my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-[#181818]/80 rounded-full flex items-center justify-center hover:bg-zinc-700 transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Hero Image */}
        <div className="relative h-80 sm:h-[28rem] bg-zinc-900">
          <Image
            src={getPosterUrl(movie.poster_path, "original")}
            alt={movie.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 896px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-[#181818]/20 to-black/30" />
          
          {/* Title overlay */}
          <div className="absolute bottom-6 left-8 right-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
              {movie.title}
            </h2>
            {movie.tagline && (
              <p className="text-base text-zinc-300 mt-2 italic">&ldquo;{movie.tagline}&rdquo;</p>
            )}
          </div>
        </div>

        {/* Content with Poster */}
        <div className="p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Movie Details */}
            <div className="flex-1 space-y-5">
              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {/* Year */}
                <span className="text-zinc-300 font-medium text-base">{releaseYear}</span>
                
                {/* Rating with Star */}
                {rating !== "N/A" && (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-white font-semibold text-base">{rating}</span>
                    <span className="text-zinc-500">/10</span>
                  </div>
                )}

                {/* Popularity with Trending Icon */}
                {popularity !== null && (
                  <div className="flex items-center gap-1.5">
                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
                    </svg>
                    <span className="text-white font-semibold text-base">{popularity.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {movie.genres && (
                <div className="flex flex-wrap gap-2">
                  {movie.genres.split(",").map((genre) => (
                    <span 
                      key={genre.trim()} 
                      className="px-4 py-1.5 text-sm font-medium bg-zinc-700/50 text-zinc-200 rounded-full"
                    >
                      {genre.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Overview */}
              {movie.overview && (
                <div>
                  <h4 className="text-sm font-semibold text-zinc-400 mb-3 uppercase tracking-wide">Overview</h4>
                  <p className="text-base text-zinc-300 leading-relaxed">
                    {movie.overview}
                  </p>
                </div>
              )}
            </div>

            {/* Right: Poster Image */}
            <div className="flex-shrink-0 hidden md:block">
              <div className="relative w-48 aspect-[2/3] rounded-lg overflow-hidden shadow-xl ring-1 ring-white/10">
                <Image
                  src={getPosterUrl(movie.poster_path, "w500")}
                  alt={movie.title}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [showModal, setShowModal] = useState(false);
  const releaseYear = movie.release_date?.split("-")[0] || "";

  return (
    <>
      <div 
        className="group relative rounded overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-20"
        onClick={() => setShowModal(true)}
      >
      {/* Poster */}
      <div className="relative aspect-[2/3] bg-zinc-900">
        <Image
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
        />
        
        {/* Netflix-style hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Hover Info Card */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[#181818] p-4 rounded-b shadow-2xl">
        {/* Title */}
        <h3 className="font-bold text-white text-sm md:text-base mb-2">
          {movie.title}
        </h3>

        {/* Year & Genres */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          {releaseYear && <span className="text-zinc-400">{releaseYear}</span>}
          {releaseYear && movie.genres && <span className="text-zinc-600">•</span>}
          {movie.genres && (
            <span className="text-zinc-300">
              {movie.genres.split(",").slice(0, 2).map(g => g.trim()).join(", ")}
            </span>
          )}
        </div>
      </div>
      </div>

      {/* Movie Details Modal */}
      {showModal && (
        <MovieModal movie={movie} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
