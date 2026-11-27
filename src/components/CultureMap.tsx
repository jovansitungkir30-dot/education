import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { REGIONS } from '../data/regions';

const icon = (active: boolean) =>
  L.divIcon({ className: `map-pin${active ? ' is-active' : ''}`, html: '<span></span>', iconSize: [34, 34], iconAnchor: [17, 17] });

export default function CultureMap({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const markers = useRef(new Map<string, L.Marker>());
  const select = useRef(onSelect);
  select.current = onSelect;

  useEffect(() => {
    const m = L.map(el.current!, { scrollWheelZoom: false, zoomSnap: 0.25 });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 14,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(m);
    m.fitBounds(L.latLngBounds(REGIONS.map((r) => r.coords)), { padding: [36, 36] });
    for (const r of REGIONS) {
      const marker = L.marker(r.coords, { icon: icon(false), title: r.name, alt: r.name })
        .addTo(m)
        .bindTooltip(r.name, { direction: 'top', offset: [0, -12] })
        .on('click', () => select.current(r.id));
      markers.current.set(r.id, marker);
    }
    map.current = m;
    const ro = new ResizeObserver(() => m.invalidateSize());
    ro.observe(el.current!);
    return () => {
      ro.disconnect();
      m.remove();
      markers.current.clear();
    };
  }, []);

  useEffect(() => {
    markers.current.forEach((marker, id) => {
      marker.setIcon(icon(id === selected));
      marker.setZIndexOffset(id === selected ? 1000 : 0);
    });
    const r = REGIONS.find((x) => x.id === selected);
    if (r && map.current && !map.current.getBounds().pad(-0.1).contains(r.coords)) map.current.panTo(r.coords);
  }, [selected]);

  return <div ref={el} className="isolate size-full" role="region" aria-label="Map of North Sumatra cultural destinations. A text list of the same places appears above the map." />;
}
