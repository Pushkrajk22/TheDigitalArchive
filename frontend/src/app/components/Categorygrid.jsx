import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import { BookOpen, ChevronRight } from 'lucide-react';

const ICON = BookOpen;

function formatTitle(slug) {
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

function CategoryCard({ title, href, icon: Icon }) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-4 rounded-2xl border border-[#8C6239]/15 bg-[#FFFDF5] p-5 transition-colors hover:border-[#FF9933]/40 dark:border-[#F5E6BE]/10 dark:bg-[#1C1410]"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF9933]/15 text-[#FF9933]">
        <Icon size={20} />
      </span>

      <span className="flex-1">
        <span className="flex items-center justify-between">
          <span className="font-serif text-lg text-[#8C6239] dark:text-[#F5E6BE]">{title}</span>
        </span>
      </span>

      <ChevronRight
        size={18}
        className="mt-1 shrink-0 text-[#8C6239]/40 transition-transform group-hover:translate-x-1 group-hover:text-[#FF9933] dark:text-[#F5E6BE]/40"
      />
    </Link>
  );
}

export default function CategoryGrid() {
  const contentDir = path.join(process.cwd(), 'content');
  const categories = fs.readdirSync(contentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const slug = entry.name;
      return {
        slug,
        title: formatTitle(slug),
        href: `/${slug}`,
        icon: ICON,
      };
    });

  return (
    <div className="mx-auto grid max-w-6xl gap-4 px-5 py-8 sm:grid-cols-2 sm:px-8">
      {categories.map((cat) => (
        <CategoryCard key={cat.href} {...cat} />
      ))}
    </div>
  );
}
