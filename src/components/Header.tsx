import { useState, useEffect } from 'react';
import { Search, X, Menu, Watch } from 'lucide-react';

export type CategoryFilter = 'All' | 'Automatics' | 'Chronographs' | 'Dress' | 'Quartz';

interface HeaderProps {
  activeCategory: CategoryFilter;
  onCategoryChange: (cat: CategoryFilter) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  resultCount: number;
}

const CATEGORIES: { label: CategoryFilter; value: string }[] = [
  { label: 'All', value: 'All' },
  { label: 'Automatics', value: 'Automatic' },
  { label: 'Chronographs', value: 'Chronograph' },
  { label: 'Dress', value: 'Dress' },
  { label: 'Quartz', value: 'Quartz' },
];

export default function Header({
  activeCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  resultCount,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled ? 'glass border-b border-white/5 py-3' : 'py-5 bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <a href="#top" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-full border border-bronze-400/40 flex items-center justify-center bg-ink-900/60 group-hover:border-bronze-400 transition-colors duration-300">
              <Watch className="w-5 h-5 text-bronze-400" strokeWidth={1.5} />
            </div>
            <div className="hidden sm:block leading-none">
              <span className="font-serif text-xl text-zinc-100 tracking-wide">Maison Horloge</span>
              <span className="block text-[10px] uppercase tracking-[0.25em] text-bronze-400/70 mt-0.5">
                Curated Timepieces
              </span>
            </div>
          </a>

          {/* Desktop category filters */}
          <nav className="hidden md:flex items-center gap-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => onCategoryChange(cat.label)}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeCategory === cat.label
                    ? 'bg-bronze-400/15 text-bronze-300 ring-1 ring-bronze-400/30'
                    : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search model or caliber…"
                className="w-36 sm:w-52 lg:w-64 pl-9 pr-8 py-2 text-sm bg-ink-800/80 border border-white/5 rounded-full text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-bronze-400/40 focus:ring-1 focus:ring-bronze-400/20 transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-200 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-full bg-ink-800/80 border border-white/5 text-zinc-300"
              aria-label="Toggle filters"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile filters */}
        {mobileOpen && (
          <nav className="md:hidden mt-3 flex flex-wrap gap-2 animate-fade-in">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.label}
                onClick={() => {
                  onCategoryChange(cat.label);
                  setMobileOpen(false);
                }}
                className={`px-3.5 py-1.5 text-sm font-medium rounded-full transition-all duration-300 ${
                  activeCategory === cat.label
                    ? 'bg-bronze-400/15 text-bronze-300 ring-1 ring-bronze-400/30'
                    : 'text-zinc-400 bg-ink-800/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </nav>
        )}

        {/* Result count line */}
        <div className="mt-2.5 text-xs text-zinc-500">
          {resultCount} {resultCount === 1 ? 'piece' : 'pieces'} available
        </div>
      </div>
    </header>
  );
}
