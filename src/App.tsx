import { lazy, Suspense, useEffect } from 'react';
import { Footer, Navbar, NAV } from './components/Layout';
import { useRoute, href } from './lib/router';

const PAGES = {
  '/': lazy(() => import('./pages/Home')),
  '/explore': lazy(() => import('./pages/Explore')),
  '/cultures': lazy(() => import('./pages/Cultures')),
  '/gallery': lazy(() => import('./pages/Gallery')),
  '/learn': lazy(() => import('./pages/Learn')),
  '/about': lazy(() => import('./pages/About')),
};

export default function App() {
  const { path, params } = useRoute();
  const Page = PAGES[path as keyof typeof PAGES];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const label = NAV.find(([to]) => to === path)?.[1];
    document.title = label && path !== '/' ? `${label} · RuangNusantara` : 'RuangNusantara: Jelajah Budaya Sumatera Utara';
  }, [path]);

  return (
    <>
      <button type="button" className="btn btn-gold fixed top-2 left-2 z-[1200] -translate-y-24 focus:translate-y-0" onClick={() => document.getElementById('main')?.focus()}>
        Langsung ke konten
      </button>
      <Navbar path={path} />
      <main id="main" tabIndex={-1} className="min-h-dvh outline-none">
        <Suspense fallback={<div className="grid min-h-dvh place-items-center" role="status">Memuat…</div>}>
          {Page ? (
            <Page params={params} />
          ) : (
            <div className="wrap grid min-h-dvh place-content-center gap-4 text-center">
              <h1 className="display">Jalur ini tidak ada di peta.</h1>
              <a className="btn btn-gold justify-self-center" href={href('/')}>Kembali ke beranda</a>
            </div>
          )}
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
