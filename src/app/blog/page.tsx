import { Metadata } from 'next';
import Link from 'next/link';
import { blogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog — Pull Tab Tips, News & Guides',
  description: 'Learn about pull tabs, charitable gaming strategies, and find tips for playing across Minnesota, Alaska, Iowa, and Wisconsin.',
};

export default function BlogPage() {
  return (
    <div className="bg-charcoal-950 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-12">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream-200 mb-3">
            Blog
          </h1>
          <p className="text-charcoal-400 text-lg">
            Tips, guides, and news about pull tabs and charitable gaming.
          </p>
        </div>

        <div className="space-y-6">
          {blogPosts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block glass rounded-xl p-6 sm:p-8 card-premium group"
            >
              <div className="flex items-center gap-3 mb-3">
                <time className="text-xs text-charcoal-500">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span className="text-xs text-charcoal-600">·</span>
                <span className="text-xs text-charcoal-500">{post.readTime}</span>
              </div>

              <h2 className="font-display text-xl sm:text-2xl font-semibold text-cream-200 group-hover:text-gold-300 transition-colors mb-2">
                {post.title}
              </h2>

              <p className="text-charcoal-400 text-sm leading-relaxed">
                {post.excerpt}
              </p>

              <span className="inline-flex items-center gap-1 text-sm text-gold-400 mt-4 group-hover:gap-2 transition-all">
                Read more
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
