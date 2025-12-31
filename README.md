# Netflix AI Search - Frontend

A beautiful Next.js frontend for the Netflix AI Search backend, featuring semantic movie search with AI-powered overviews.

## Features

- **Semantic Search**: Find movies by mood, theme, or description - not just titles
- **AI Overview**: Get AI-generated explanations of why movies match your query
- **Hybrid Search**: Adjustable balance between keyword and semantic search
- **Netflix-inspired Design**: Dark theme with cinematic aesthetics

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend server running (see `../netflix_ai_search/`)

### Start the Backend

First, make sure the backend is running:

```bash
cd ../netflix_ai_search
source venv/bin/activate
uvicorn api.main:app --reload --port 8000
```

### Start the Frontend

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file (optional):

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Project Structure

```
web/
├── src/
│   ├── app/
│   │   ├── layout.tsx      # Root layout with fonts
│   │   ├── page.tsx        # Main search page
│   │   └── globals.css     # Global styles
│   ├── components/
│   │   ├── SearchBar.tsx   # Search input with options
│   │   ├── MovieCard.tsx   # Movie display card
│   │   ├── MovieGrid.tsx   # Responsive movie grid
│   │   ├── AIOverview.tsx  # AI summary panel
│   │   └── LoadingState.tsx # Skeleton loaders
│   ├── lib/
│   │   └── api.ts          # Backend API client
│   └── types/
│       └── movie.ts        # TypeScript interfaces
```

## Usage

1. Type a search query (e.g., "mind-bending sci-fi thriller")
2. Toggle "AI Overview" to get AI-generated explanations
3. Adjust the Keyword/Semantic slider to change search behavior
4. Browse results with hover effects for more details
