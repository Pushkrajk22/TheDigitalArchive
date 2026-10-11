'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';

function Snippet({ text, matchStart, matchEnd }) {
  if (matchStart < 0 || matchStart >= text.length) return <span>{text}</span>;
  return (
    <>
      {text.slice(0, matchStart)}
      <mark className="rounded-sm bg-[#C4874A]/30 px-0.5 not-italic text-[#5A3518] dark:bg-[#FFD97D]/25 dark:text-[#FFD97D]">
        {text.slice(matchStart, matchEnd)}
      </mark>
      {text.slice(matchEnd)}
    </>
  );
}

export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);

  const inputRef = useRef(null);
  const wrapRef = useRef(null);
  const timerRef = useRef(null);
  const router = useRouter();

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setResults([]);
    setActive(-1);
  }, []);

  // Close on outside click or Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) close();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [close]);

  const doSearch = useCallback((q) => {
    if (!q || q.length < 2) { setResults([]); setLoading(false); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => { setResults(d); setActive(-1); })
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  const onChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(val), 250);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter' && active >= 0) {
      router.push(results[active].href);
      close();
    }
  };

  const showDrop = open && query.length >= 2;

  return (
    <div ref={wrapRef} className="relative flex items-center">
      {/* Collapsed: icon button */}
      {!open && (
        <button
          onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 50); }}
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8C6239]/20 text-[#8C6239] transition-colors duration-200 hover:bg-[#F5E6BE]/50 dark:border-[#F5E6BE]/10 dark:text-[#F5E6BE] dark:hover:bg-white/10"
        >
          <Search size={18} />
        </button>
      )}

      {/* Expanded: input bar */}
      {open && (
        <div className="flex w-56 items-center gap-1.5 rounded-full border border-[#8C6239]/30 bg-[#FFFDF5] px-3 py-1.5 shadow-sm ring-1 ring-[#8C6239]/10 dark:border-[#F5E6BE]/15 dark:bg-[#1C1410] dark:ring-[#F5E6BE]/8 sm:w-72">
          <Search size={14} className="shrink-0 text-[#8C6239]/50 dark:text-[#F5E6BE]/40" />
          <input
            ref={inputRef}
            value={query}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder="Search…"
            aria-label="Search content"
            className="min-w-0 flex-1 bg-transparent text-sm text-[#3D2B1F] outline-none placeholder:text-[#8C6239]/40 dark:text-[#F5E6BE] dark:placeholder:text-[#F5E6BE]/30"
          />
          <button
            onClick={close}
            aria-label="Close search"
            className="shrink-0 text-[#8C6239]/40 transition-colors hover:text-[#8C6239] dark:text-[#F5E6BE]/30 dark:hover:text-[#F5E6BE]"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Results dropdown */}
      {showDrop && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-[#8C6239]/15 bg-[#FFFDF5]/98 shadow-xl backdrop-blur-sm dark:border-[#F5E6BE]/10 dark:bg-[#1C1410]/98 sm:w-[26rem]">
          {loading && (
            <p className="px-4 py-3 text-sm text-[#8C6239]/55 dark:text-[#F5E6BE]/40">
              Searching…
            </p>
          )}

          {!loading && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-[#8C6239]/55 dark:text-[#F5E6BE]/40">
              No results for &ldquo;{query}&rdquo;
            </p>
          )}

          {!loading && results.length > 0 && (
            <ul role="listbox" aria-label="Search results">
              {results.map((r, i) => (
                <li key={r.href} role="option" aria-selected={i === active}>
                  <Link
                    href={r.href}
                    onClick={close}
                    className={[
                      'block px-4 py-3 transition-colors duration-100',
                      i > 0 ? 'border-t border-[#8C6239]/8 dark:border-[#F5E6BE]/6' : '',
                      i === active
                        ? 'bg-[#8C6239]/10 dark:bg-[#F5E6BE]/8'
                        : 'hover:bg-[#8C6239]/6 dark:hover:bg-[#F5E6BE]/5',
                    ].join(' ')}
                  >
                    {/* Title row */}
                    <div className="mb-1 flex items-center gap-2">
                      <span className="text-sm font-medium leading-snug text-[#3D2B1F] dark:text-[#F5E6BE]">
                        {r.title}
                      </span>
                      <span className="shrink-0 rounded-full bg-[#8C6239]/10 px-2 py-0.5 text-[9px] uppercase tracking-widest text-[#8C6239]/65 dark:bg-[#F5E6BE]/8 dark:text-[#F5E6BE]/45">
                        {r.category}
                      </span>
                    </div>

                    {/* Snippet with highlighted match */}
                    {r.snippet && (
                      <p className="line-clamp-2 text-xs leading-relaxed text-[#6B4226]/65 dark:text-[#F5E6BE]/45">
                        <Snippet
                          text={r.snippet}
                          matchStart={r.matchStart}
                          matchEnd={r.matchEnd}
                        />
                      </p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
