import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';

function slugify(filename) {
  return filename.replace(/\.md$/, '');
}

function formatTitle(slug) {
  return slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function CategoryPage({ params }) {
  const { category: rawCategory } = await params;
  const category = decodeURIComponent(rawCategory);
  const categoryDir = path.join(process.cwd(), 'content', category);

  if (!fs.existsSync(categoryDir)) notFound();

  const files = fs
    .readdirSync(categoryDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ slug: slugify(f), title: formatTitle(slugify(f)) }));

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-[#FFFDF5] px-5 py-8 dark:bg-[#1C1410] sm:px-8">
      <Navbar />

      <nav className="mb-8 flex items-center gap-1.5 text-sm text-[#8C6239]/60 dark:text-[#F5E6BE]/60">
        <Link href="/" className="hover:text-[#FF9933] transition-colors">Home</Link>
        <ChevronRight size={14} className="shrink-0" />
        <span className="text-[#8C6239] dark:text-[#F5E6BE] font-medium capitalize">{category}</span>
      </nav>

      <h1 className="font-serif text-3xl text-[#8C6239] dark:text-[#F5E6BE]">
        {formatTitle(category)}
      </h1>
      <div className="mt-4 h-px w-16 bg-[#FF9933]/50" />

      <ul className="mt-8 space-y-3">
        {files.map(({ slug, title }) => (
          <li key={slug}>
            <Link
              href={`/${category}/${encodeURIComponent(slug)}`}
              className="group flex items-center justify-between rounded-xl border border-[#8C6239]/15 bg-[#FFFDF5] px-5 py-4 transition-colors hover:border-[#FF9933]/40 dark:border-[#F5E6BE]/10 dark:bg-[#1C1410]"
            >
              <span className="font-serif text-lg text-[#8C6239] dark:text-[#F5E6BE]">
                {title}
              </span>
              <ChevronRight
                size={18}
                className="shrink-0 text-[#8C6239]/40 transition-transform group-hover:translate-x-1 group-hover:text-[#FF9933] dark:text-[#F5E6BE]/40"
              />
            </Link>
          </li>
        ))}

        {files.length === 0 && (
          <p className="text-sm text-[#8C6239]/60 dark:text-[#F5E6BE]/60">
            No items found.
          </p>
        )}
      </ul>

      <div className="mt-16 -mx-5 sm:-mx-8">
        <Link
          href="/"
          className="flex items-center gap-2 border-t border-[#8C6239]/15 bg-[#FFF8E7] px-5 py-4 text-sm font-medium text-[#8C6239] transition-colors hover:bg-[#FF9933]/10 hover:text-[#FF9933] dark:border-[#F5E6BE]/10 dark:bg-[#241A10] dark:text-[#F5E6BE] dark:hover:bg-[#FF9933]/10 dark:hover:text-[#FF9933] sm:px-8"
        >
          <ArrowLeft size={16} /> Home
        </Link>
      </div>
    </main>
  );
}
