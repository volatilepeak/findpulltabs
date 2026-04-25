import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogPost, getAllBlogSlugs, blogPosts } from '@/lib/blog';

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const post = getBlogPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = getBlogPost(params.slug);
  if (!post) notFound();

  // Get next/prev posts
  const currentIndex = blogPosts.findIndex((p) => p.slug === params.slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  // Simple markdown-like rendering
  const contentHtml = post.content
    .split('\n\n')
    .map((block) => {
      if (block.startsWith('## ')) {
        return `<h2 class="font-display text-xl font-semibold text-cream-200 mt-8 mb-3">${block.replace('## ', '')}</h2>`;
      }
      return `<p class="text-charcoal-300 leading-relaxed mb-4">${block}</p>`;
    })
    .join('');

  return (
    <div className="bg-charcoal-950 min-h-screen">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-charcoal-400 mb-8">
          <Link href="/" className="hover:text-gold-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-gold-300 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-cream-300 truncate">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <time className="text-sm text-charcoal-500">
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className="text-charcoal-600">·</span>
            <span className="text-sm text-charcoal-500">{post.readTime}</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream-200 leading-tight">
            {post.title}
          </h1>

          <p className="mt-4 text-lg text-charcoal-400 leading-relaxed">
            {post.excerpt}
          </p>
        </header>

        {/* Content */}
        <div
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        {/* Navigation */}
        <div className="mt-16 pt-8 border-t border-charcoal-800 grid sm:grid-cols-2 gap-4">
          {prevPost && (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="glass rounded-xl p-5 group"
            >
              <span className="text-xs text-charcoal-500">← Previous</span>
              <p className="text-sm font-medium text-cream-200 group-hover:text-gold-300 transition-colors mt-1">
                {prevPost.title}
              </p>
            </Link>
          )}
          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug}`}
              className={`glass rounded-xl p-5 group ${!prevPost ? 'sm:col-start-2' : ''}`}
            >
              <span className="text-xs text-charcoal-500">Next →</span>
              <p className="text-sm font-medium text-cream-200 group-hover:text-gold-300 transition-colors mt-1">
                {nextPost.title}
              </p>
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
