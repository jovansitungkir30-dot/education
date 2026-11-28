import type { MediaItem } from '../../data/media';

export default function StationImage({ photo, className = '' }: { photo: MediaItem; className?: string }) {
  return <img src={`./${photo.file}`} alt={photo.alt} loading="lazy" decoding="async" className={`block object-cover ${className}`} />;
}
