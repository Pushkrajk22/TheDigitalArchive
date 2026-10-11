import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const RADIUS = 80;
const MAX_RESULTS = 8;

function formatTitle(slug) {
  return slug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getSnippet(text, query) {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerText.indexOf(lowerQuery);

  if (idx === -1) {
    const snippet = text.slice(0, 150).trim() + (text.length > 150 ? '…' : '');
    return { snippet, matchStart: -1, matchEnd: -1 };
  }

  const start = Math.max(0, idx - RADIUS);
  const end = Math.min(text.length, idx + query.length + RADIUS);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < text.length ? '…' : '';
  const snippet = prefix + text.slice(start, end) + suffix;

  // Position of match inside the assembled snippet string
  const matchStart = prefix.length + (idx - start);
  const matchEnd = matchStart + query.length;

  return { snippet, matchStart, matchEnd };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').trim();

  if (!query || query.length < 2) return NextResponse.json([]);

  const results = [];
  const lower = query.toLowerCase();

  let categories;
  try {
    categories = fs
      .readdirSync(CONTENT_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
  } catch {
    return NextResponse.json([]);
  }

  outer: for (const category of categories) {
    const catDir = path.join(CONTENT_DIR, category);
    let files;
    try {
      files = fs.readdirSync(catDir).filter((f) => f.endsWith('.md'));
    } catch {
      continue;
    }

    for (const file of files) {
      const slug = file.replace(/\.md$/, '');
      const filePath = path.join(catDir, file);

      let raw;
      try {
        raw = fs.readFileSync(filePath, 'utf-8');
      } catch {
        continue;
      }

      const { data, content } = matter(raw);
      const title = data.title || formatTitle(slug);
      // Strip basic markdown symbols so snippet text is clean
      const body = content.replace(/^#{1,6}\s+/gm, '').replace(/[*_`[\]()]/g, '').trim();

      const titleMatch = title.toLowerCase().includes(lower);
      const bodyMatch = body.toLowerCase().includes(lower);
      if (!titleMatch && !bodyMatch) continue;

      const { snippet, matchStart, matchEnd } = bodyMatch
        ? getSnippet(body, query)
        : { snippet: body.slice(0, 150).trim() + (body.length > 150 ? '…' : ''), matchStart: -1, matchEnd: -1 };

      results.push({
        title,
        category,
        slug,
        href: `/${category}/${encodeURIComponent(slug)}`,
        snippet,
        matchStart,
        matchEnd,
        matchIn: bodyMatch ? 'body' : 'title',
      });

      if (results.length >= MAX_RESULTS) break outer;
    }
  }

  return NextResponse.json(results);
}
