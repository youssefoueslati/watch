import { useState, useEffect, useMemo } from 'react';
import { Watch as WatchIcon, Sparkles, ShieldCheck, Wrench } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Watch } from '@/types/watch';
import Header, { type CategoryFilter } from '@/components/Header';
import WatchCard from '@/components/WatchCard';
import WatchDetailModal from '@/components/WatchDetailModal';
import SellYourWatchForm from '@/components/SellYourWatchForm';

const CATEGORY_MAP: Record<CategoryFilter, string | null> = {
  All: null,
  Automatics: 'Automatic',
  Chronographs: 'Chronograph',
  Dress: 'Dress',
  Quartz: 'Quartz',
};

export default function App() {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWatch, setSelectedWatch] = useState<Watch | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('watches')
          .select('*')
          .order('created_at', { ascending: true });
        if (error) throw error;
        if (!cancelled) setWatches((data ?? []) as Watch[]);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Failed to load the collection.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const categoryValue = CATEGORY_MAP[activeCategory];
    const q = searchQuery.trim().toLowerCase();

    return watches.filter((w) => {
      if (categoryValue && w.category !== categoryValue) return false;
      if (q) {
        const haystack = [w.brand, w.model, w.reference, w.caliber, w.movement_type]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [watches, activeCategory, searchQuery]);

  return (
    <div id="top" className="min-h-screen bg-ink-950">
      <Header
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        resultCount={filtered.length}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-bronze-400/5 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-bronze-500/5 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bronze-400/10 ring-1 ring-bronze-400/20 text-xs text-bronze-300 mb-6 animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-[0.2em]">Restored · Verified · Ready</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-zinc-50 leading-[1.05] tracking-tight animate-slide-up">
            Timepieces with a{' '}
            <span className="text-gradient-bronze italic">story</span>
            <br className="hidden sm:block" /> worth keeping.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-slide-up [animation-delay:120ms] opacity-0 [animation-fill-mode:forwards]">
            An independent studio curating restored mechanical and luxury quartz watches. Each piece
            is authenticated, serviced, and ready for its next chapter.
          </p>

          {/* Trust badges */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-zinc-500 animate-slide-up [animation-delay:240ms] opacity-0 [animation-fill-mode:forwards]">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-bronze-400/60" />
              Authenticity verified
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Wrench className="w-4 h-4 text-bronze-400/60" />
              Serviced &amp; regulated
            </span>
            <span className="inline-flex items-center gap-1.5">
              <WatchIcon className="w-4 h-4 text-bronze-400/60" />
              Vintage &amp; curated
            </span>
          </div>
        </div>
      </section>

      {/* Catalog grid */}
      <section id="catalog" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-24">
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden bg-ink-850 shadow-card"
              >
                <div className="aspect-[4/5] skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-4 w-1/2 rounded skeleton" />
                  <div className="h-3 w-3/4 rounded skeleton" />
                  <div className="h-3 w-2/3 rounded skeleton" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <p className="text-zinc-400 mb-2">We couldn't load the collection.</p>
            <p className="text-sm text-zinc-600">{error}</p>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="font-serif text-2xl text-zinc-300">No pieces match your search.</p>
            <p className="text-sm text-zinc-500 mt-2">
              Try a different category or clear the search.
            </p>
            <button
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
              }}
              className="mt-5 px-5 py-2 rounded-full text-sm text-bronze-300 ring-1 ring-bronze-400/30 hover:bg-bronze-400/10 transition-colors"
            >
              Reset filters
            </button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((watch, i) => (
              <WatchCard
                key={watch.id}
                watch={watch}
                index={i}
                onClick={() => setSelectedWatch(watch)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Sell / Trade section */}
      <section
        id="sell"
        className="relative py-24 border-t border-white/5 overflow-hidden"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[300px] rounded-full bg-bronze-400/5 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.25em] text-bronze-400/70">
              Sell or Trade
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-zinc-50 mt-3">
              Have a watch worth evaluating?
            </h2>
            <p className="text-zinc-400 mt-4 max-w-xl mx-auto leading-relaxed">
              Share the details of your vintage timepiece and our studio will assess it for
              acquisition or trade. We respond within 48 hours.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-ink-850/80 ring-1 ring-white/5 shadow-card">
            <SellYourWatchForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full border border-bronze-400/40 flex items-center justify-center">
              <WatchIcon className="w-4 h-4 text-bronze-400" strokeWidth={1.5} />
            </div>
            <span className="font-serif text-lg text-zinc-300">Maison Horloge</span>
          </div>
          <p className="text-xs text-zinc-600">
            © {new Date().getFullYear()} Maison Horloge. Every piece authenticated &amp; serviced.
          </p>
        </div>
      </footer>

      {/* Detail modal */}
      <WatchDetailModal watch={selectedWatch} onClose={() => setSelectedWatch(null)} />
    </div>
  );
}
