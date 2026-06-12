import { film } from '../data/film';
import { RevealSection } from './RevealSection';
import './TrailerSection.css';

function getEmbedSrc(url: string): string | null {
  if (!url) return null;
  if (url.includes('youtube.com/watch')) {
    const id = new URL(url).searchParams.get('v');
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (url.includes('youtu.be/')) {
    const id = url.split('youtu.be/')[1]?.split(/[?#]/)[0];
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (url.includes('youtube.com/embed/')) return url;
  if (url.includes('player.vimeo.com')) return url;
  if (url.includes('vimeo.com/')) {
    const path = url.split('vimeo.com/')[1]?.split(/[?#]/)[0] ?? '';
    const [id, hash] = path.split('/');
    if (!id) return null;
    const embed = new URL(`https://player.vimeo.com/video/${id}`);
    if (hash) embed.searchParams.set('h', hash);
    return embed.toString();
  }
  return url;
}

export function TrailerSection() {
  const embedSrc = getEmbedSrc(film.trailer.embedUrl);
  const videoSrc = film.trailer.videoSrc;

  return (
    <RevealSection id="trailer" className="trailer">
      <div className="trailer__inner">
        <h2 className="trailer__title">{film.trailer.headline}</h2>
        <p className="trailer__synopsis">{film.heroBody}</p>
        <p className="trailer__sub field-label">{film.trailer.subheading}</p>

        <div className="trailer__screen">
          <div className="trailer__player">
            {embedSrc ? (
              <iframe
                src={embedSrc}
                title="Kuzaya trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : videoSrc ? (
              <video
                className="trailer__video"
                src={videoSrc}
                poster={film.trailer.posterSrc}
                controls
                playsInline
                preload="metadata"
              >
                <track kind="captions" />
              </video>
            ) : (
              <div className="trailer__placeholder">
                <p className="trailer__placeholder-text">Trailer coming soon</p>
                {film.trailer.watchUrl && (
                  <a href={film.trailer.watchUrl} className="trailer__placeholder-link field-label" target="_blank" rel="noopener noreferrer">
                    Watch the full trailer
                  </a>
                )}
              </div>
            )}
            <div className="trailer__vignette" aria-hidden="true" />
          </div>
        </div>
      </div>
    </RevealSection>
  );
}
