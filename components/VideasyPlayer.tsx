import { useEffect } from 'react';

interface ProgressData {
  id: number;
  type: string;
  progress: number;
  timestamp: number;
  duration: number;
  season?: number;
  episode?: number;
}

interface Props {
  id: number;
  type: 'movie' | 'tv' | 'anime';
  season?: number;
  episode?: number;
  color?: string;
  dub?: boolean;
  startTime?: number;
  nextEpisode?: boolean;
  episodeSelector?: boolean;
  autoplayNextEpisode?: boolean;
}

function buildUrl({
  id,
  type,
  season,
  episode,
  color,
  dub,
  startTime,
  nextEpisode,
  episodeSelector,
  autoplayNextEpisode,
}: Props) {
  let base = 'https://player.videasy.net';
  if (type === 'movie') {
    base += `/movie/${id}`;
  } else if (type === 'tv') {
    base += `/tv/${id}/${season || 1}/${episode || 1}`;
  } else {
    // anime
    if (episode) {
      base += `/anime/${id}/${episode}`;
    } else {
      base += `/anime/${id}`;
    }
  }
  const params = new URLSearchParams();
  if (color) params.set('color', color.replace('#', ''));
  if (dub) params.set('dub', 'true');
  if (startTime) params.set('progress', String(startTime));
  if (nextEpisode) params.set('nextEpisode', 'true');
  if (episodeSelector) params.set('episodeSelector', 'true');
  if (autoplayNextEpisode) params.set('autoplayNextEpisode', 'true');

  const query = params.toString();
  return query ? `${base}?${query}` : base;
}

export default function VideasyPlayer(props: Props) {
  const src = buildUrl(props);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (typeof event.data !== 'string') return;
      try {
        const data: ProgressData = JSON.parse(event.data);
        if (!data || typeof data.progress === 'undefined') return;
        const key = 'continueWatching';
        const list: ProgressData[] = JSON.parse(
          localStorage.getItem(key) || '[]'
        );
        const index = list.findIndex(
          (i) => i.id === data.id && i.type === data.type
        );
        if (data.progress >= 95) {
          if (index !== -1) list.splice(index, 1);
        } else if (index === -1) {
          list.push(data);
        } else {
          list[index] = data;
        }
        localStorage.setItem(key, JSON.stringify(list));
      } catch (e) {
        // ignore invalid messages
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, []);

  return (
    <iframe
      src={src}
      className="h-full w-full"
      allowFullScreen
      allow="autoplay"
    />
  );
}

