import { useEffect, useState } from 'react';
import Row from './Row';
import { Movie } from '../types';

interface Props {
  movieId: number;
  mediaType: string;
}

export default function RecommendedRow({ movieId, mediaType }: Props) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    if (!movieId) return;
    fetch(
      `https://api.themoviedb.org/3/${mediaType}/${movieId}/recommendations?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setMovies(data.results || []));
  }, [movieId, mediaType]);

  if (!movies.length) return null;

  return <Row title="Recommended For You" movies={movies} />;
}

