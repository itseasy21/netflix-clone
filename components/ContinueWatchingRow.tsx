import { useEffect, useState } from 'react';
import Row from './Row';
import { Movie } from '../types';

interface ProgressData {
  id: number;
  type: string;
}

export default function ContinueWatchingRow() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const key = 'continueWatching';
    const stored = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    if (!stored) return;
    const list: ProgressData[] = JSON.parse(stored);
    if (!list.length) return;

    Promise.all(
      list.map((item) =>
        fetch(
          `https://api.themoviedb.org/3/${item.type}/${item.id}?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
        ).then((res) => res.json())
      )
    ).then((data) => {
      setMovies(data);
    });
  }, []);

  if (!movies.length) return null;

  return <Row title="Continue Watching" movies={movies} />;
}

