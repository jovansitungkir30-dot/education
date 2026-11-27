import { useEffect, useState } from 'react';
import { href } from '../lib/router';
import { useProgress } from '../lib/progress';

export const NAV = [
  ['/', 'Beranda'], ['/explore', 'Jelajah'], ['/cultures', 'Budaya'], ['/gallery', 'Galeri'], ['/learn', 'Belajar'], ['/about', 'Tentang'],
] as const;

function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
      <path d="M3 9Q16 23 29 9L25 21H7Z" fill="var(--color-gold-500)" />
      <path d="M9 21v7M23 21v7M7 28h18" stroke="var(--color-terracotta-400)" strokeWidth="2.2" fill="none" />
    </svg>
  );
}

export function Navbar({ path }: { path: string }) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const { points } = useProgress();

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = NAV.map(([to, label]) => (
    <li key={to} className="list-none">
      <a
        href={href(to)}
        aria-current={path === to ? 'page' : undefined}
        onClick={() => setOpen(false)}
        className={`block rounded-full px-4 py-2.5 text-sm font-semibold transition ${path === to ? 'bg-ivory/12 text-gold-300' : 'opacity-85 hover:opacity-100'}`}
      >
        {label}
      </a>
    </li>
  ));

  return (
    <header
      onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
      className={`fixed inset-x-0 top-0 z-[1100] transition-colors duration-300 ${solid || open || path !== '/' ? 'bg-forest-950/95 shadow-lg shadow-black/20' : 'bg-gradient-to-b from-forest-950/75 to-transparent'}`}
    >
      <nav className="wrap flex h-18 items-center justify-between gap-4" aria-label="Utama">
        <a href={href('/')} className="flex items-center gap-2.5">
          <Mark />
          <span className="font-display text-lg sm:text-xl">RuangNusantara</span>
        </a>
        <ul className="m-0 hidden items-center gap-1 p-0 lg:flex">{links}</ul>
        <div className="flex items-center gap-2">
          <a href={href('/learn', { view: 'progress' })} className="whitespace-nowrap rounded-full border border-gold-500/50 px-3.5 py-2 text-xs font-extrabold text-gold-300 tabular-nums">
            {points} <span className="font-semibold max-sm:sr-only">poin</span><span aria-hidden="true" className="sm:hidden">pt</span>
          </a>
          <button type="button" className="chip lg:hidden" aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen(!open)}>
            {open ? 'Tutup' : 'Menu'}
          </button>
        </div>
      </nav>
      {open && <ul id="mobile-menu" className="wrap m-0 grid gap-1 pb-4 lg:hidden">{links}</ul>}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-forest-950 pt-4 pb-10">
      <div className="weave" aria-hidden="true" />
      <div className="wrap mt-10 grid gap-8 md:grid-cols-[2fr_1fr_2fr]">
        <div>
          <p className="font-display text-2xl">RuangNusantara</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed opacity-70">Jelajah Budaya Sumatera Utara. Ruang belajar tentang banyak komunitas yang berbeda, dengan label yang memisahkan sejarah, tradisi, dan cerita rakyat.</p>
        </div>
        <ul className="m-0 grid content-start gap-2 p-0">
          {NAV.map(([to, label]) => (
            <li key={to} className="list-none"><a className="text-sm opacity-80 hover:text-gold-300" href={href(to)}>{label}</a></li>
          ))}
        </ul>
        <div className="text-sm leading-relaxed opacity-70">
          <p>Budaya itu hidup dan berbeda antarkampung serta keluarga. Isi situs ini adalah pengantar yang masih perlu ditinjau oleh komunitas dan ahli.</p>
          <p className="mt-3"><a className="underline" href={href('/about')}>Sumber, kredit foto, dan keterbatasan</a></p>
        </div>
      </div>
    </footer>
  );
}
