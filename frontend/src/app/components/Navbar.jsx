'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import SearchBar from './SearchBar';

export default function Navbar() {
  const [dark, setDark] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') === 'dark';
    setDark(saved);
    document.documentElement.classList.toggle('dark', saved);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[#8C6239]/15 bg-[#FFFDF5]/90 backdrop-blur-md dark:border-[#F5E6BE]/10 dark:bg-[#1C1410]/95">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="group rounded-full bg-[#8C6239]/6 px-3.5 py-1 ring-1 ring-[#8C6239]/25 transition-all duration-300 hover:bg-[#8C6239]/12 hover:ring-[#8C6239]/50 dark:bg-[#F5E6BE]/5 dark:ring-[#F5E6BE]/15 dark:hover:bg-[#F5E6BE]/10 dark:hover:ring-[#F5E6BE]/35"
        >
          <span className="bg-linear-to-r from-[#8C6239] via-[#C4874A] to-[#8C6239] bg-clip-text text-2xl font-serif tracking-wide text-transparent drop-shadow-[0_1px_6px_rgba(140,98,57,0.3)] transition-all duration-300 group-hover:from-[#6B4226] group-hover:via-[#E09A55] group-hover:to-[#6B4226] group-hover:tracking-wider group-hover:drop-shadow-[0_2px_12px_rgba(140,98,57,0.5)] dark:from-[#F5E6BE] dark:via-[#FFD97D] dark:to-[#F5E6BE] dark:drop-shadow-[0_1px_6px_rgba(255,217,125,0.25)] dark:group-hover:from-[#FFFDF5] dark:group-hover:via-[#FFE89A] dark:group-hover:to-[#FFFDF5] dark:group-hover:drop-shadow-[0_2px_12px_rgba(255,217,125,0.45)]">
            {process.env.NEXT_PUBLIC_APP_NAME}
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <SearchBar />
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#8C6239]/20 text-[#8C6239] hover:bg-[#F5E6BE]/50 dark:border-[#F5E6BE]/10 dark:text-[#F5E6BE] dark:hover:bg-white/10"
          >
            {dark ? <Sun size={25} /> : <Moon size={25} />}
          </button>
        </div>
      </nav>
    </header>
  );
}