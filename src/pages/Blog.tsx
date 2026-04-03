import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { useGetAllBlogPosts } from '../api/hooks/blogQuery'
import PageSEO from '../components/PageSEO'

const CATEGORIES = ['all', 'general', 'inscriptions', 'history', 'research', 'culture']

const Blog = () => {
  const headerReveal = useScrollReveal()
  const [page, setPage] = useState(1)
  const [category, setCategory] = useState('all')

  const { data, isLoading } = useGetAllBlogPosts(page, 12, category)
  const posts = data?.posts || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / 12)

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen px-5 sm:px-6 lg:px-8 py-16 max-w-[1600px] mx-auto">
      <PageSEO
        title="Blog"
        description="Explore articles on ancient Indian inscriptions, epigraphy, Tamil heritage, and archaeological research. Insights from the Sasanam community."
        path="/blog"
      />

      {/* Page Header */}
      <div
        ref={headerReveal.ref as any}
        className={`text-center mb-16 reveal-smooth ${
          headerReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h1 className="text-4xl sm:text-5xl xl:text-6xl font-serif font-black text-body tracking-tight">
          Our <span className="text-primary">Blog</span>
        </h1>
        <div className="w-24 h-1 bg-primary/20 rounded-full mx-auto mt-6 mb-6" />
        <p className="text-lg text-muted max-w-2xl mx-auto font-medium leading-relaxed">
          Articles, insights, and discoveries from the world of ancient inscriptions and epigraphy.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setCategory(cat); setPage(1) }}
            className={`px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-300 ${
              category === cat
                ? 'bg-primary text-white shadow-xl -translate-y-0.5'
                : 'bg-white/50 text-accent hover:bg-white/80 hover:text-primary border border-primary/10'
            }`}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-3xl bg-beige/80 border border-white/30 overflow-hidden animate-pulse">
              <div className="h-48 bg-primary/10" />
              <div className="p-8 space-y-4">
                <div className="h-4 bg-primary/10 rounded w-1/3" />
                <div className="h-6 bg-primary/10 rounded w-3/4" />
                <div className="h-4 bg-primary/10 rounded w-full" />
                <div className="h-4 bg-primary/10 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <BlogCard key={post._id} post={post} formatDate={formatDate} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && posts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl text-accent font-bold">No blog posts found.</p>
          <p className="text-muted mt-2">Check back soon for new articles!</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-16">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white/50 border border-primary/10 text-primary hover:bg-primary/5"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                page === p
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white/50 border border-primary/10 text-muted hover:bg-primary/5 hover:text-primary'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-white/50 border border-primary/10 text-primary hover:bg-primary/5"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

const BlogCard = ({ post, formatDate }: { post: any; formatDate: (d: string) => string }) => {
  const reveal = useScrollReveal()

  return (
    <Link to={`/blog/${post.slug}`}>
      <article
        ref={reveal.ref as any}
        className={`group relative overflow-hidden rounded-3xl bg-beige/80 backdrop-blur-md border border-white/30 shadow-[0_8px_32px_rgba(61,37,22,0.1)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_16px_48px_rgba(61,37,22,0.18)] hover:border-white/50 h-full ${
          reveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {/* Cover Image */}
        {post.coverImage && (
          <div className="h-48 overflow-hidden relative">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-beige/90 to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className={`p-8 ${post.coverImage ? '-mt-8 relative z-[1]' : ''}`}>
          {/* Category & Date */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-lg text-2xs font-black uppercase tracking-widest bg-primary/10 text-primary">
              {post.category}
            </span>
            <span className="text-xs font-bold text-accent">
              {formatDate(post.createdAt)}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-body leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-sm text-muted leading-relaxed line-clamp-3 font-medium">
            {post.excerpt}
          </p>

          {/* Author & Read More */}
          <div className="mt-6 flex items-center justify-between">
            <span className="text-xs font-bold text-accent">{post.author}</span>
            <div className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
              <span>Read More</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default Blog
