import { useEffect, useState } from 'react';
import Head from 'next/head';
import Header from '../components/Header';
import Row from '../components/Row';
import { Movie } from '../types';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [genre, setGenre] = useState('');

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US`
    )
      .then((res) => res.json())
      .then((data) => setGenres(data.genres || []));
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (genre) {
      const data = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&with_genres=${genre}`
      ).then((res) => res.json());
      setResults(data.results || []);
    } else {
      const data = await fetch(
        `https://api.themoviedb.org/3/search/multi?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}&language=en-US&query=${query}`
      ).then((res) => res.json());
      setResults(
        (data.results || []).filter((r: any) => r.media_type !== 'person')
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Head>
        <title>Search - Netflix clone</title>
      </Head>
      <Header />
      <div className="pt-24 p-4">
        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded bg-gray-800 p-2"
            placeholder="Search..."
          />
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="rounded bg-gray-800 p-2"
          >
            <option value="">All Genres</option>
            {genres.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded bg-red-600 px-4">
            Go
          </button>
        </form>
        {results.length > 0 && <Row title="Results" movies={results} />}
      </div>
    </div>
  );
}

