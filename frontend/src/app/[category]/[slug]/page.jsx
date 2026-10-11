import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import matter from 'gray-matter';
import { marked } from 'marked';
import Navbar from '../../components/Navbar';

function formatTitle(slug) {
  return slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function SlugPage({ params }) {
  const { category: rawCategory, slug: rawSlug } = await params;
  const category = decodeURIComponent(rawCategory);
  const slug = decodeURIComponent(rawSlug);
  const filePath = path.join(process.cwd(), 'content', category, `${slug}.md`);

  if (!fs.existsSync(filePath)) notFound();

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content } = matter(raw);
  const title = frontmatter.title || formatTitle(slug);
  const html = marked(content, { breaks: true });

  return (
    <main className="mx-auto min-h-screen max-w-2xl bg-[#FFFDF5] px-5 py-8 dark:bg-[#1C1410] sm:px-8">
      <Navbar />
      <nav className="mb-8 flex items-center gap-1.5 text-sm text-[#8C6239]/60 dark:text-[#F5E6BE]/60">
        <Link href="/" className="hover:text-[#FF9933] transition-colors">Home</Link>
        <ChevronRight size={14} className="shrink-0" />
        <Link href={`/${category}`} className="hover:text-[#FF9933] transition-colors capitalize">{category}</Link>
        <ChevronRight size={14} className="shrink-0" />
        <span className="text-[#8C6239] dark:text-[#F5E6BE] font-medium truncate">{title}</span>
      </nav>

      <h1 className="text-center font-serif text-3xl text-[#8C6239] dark:text-[#F5E6BE]">
        {title}
      </h1>
      <div className="mx-auto mt-4 h-px w-16 bg-[#FF9933]/50" />

      <div
        className="prose-content mt-8 text-center font-serif text-xl leading-relaxed text-[#8C6239] dark:text-[#F5E6BE]"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="mt-16 -mx-5 sm:-mx-8">
        <Link
          href={`/${category}`}
          className="flex items-center gap-2 border-t border-[#8C6239]/15 bg-[#FFF8E7] px-5 py-4 text-sm font-medium text-[#8C6239] transition-colors hover:bg-[#FF9933]/10 hover:text-[#FF9933] dark:border-[#F5E6BE]/10 dark:bg-[#241A10] dark:text-[#F5E6BE] dark:hover:bg-[#FF9933]/10 dark:hover:text-[#FF9933] sm:px-8"
        >
          <ArrowLeft size={16} /> Back
        </Link>
      </div>
    </main>
  );
}
