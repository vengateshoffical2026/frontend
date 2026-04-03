import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useGetBlogPostBySlug } from '../api/hooks/blogQuery'

const BASE_URL = import.meta.env.VITE_SITE_URL || 'https://sasanam.in'

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, isError } = useGetBlogPostBySlug(slug || '')

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen px-5 sm:px-6 lg:px-8 py-16 max-w-4xl mx-auto animate-pulse">
        <div className="h-8 bg-primary/10 rounded w-1/3 mb-8" />
        <div className="h-12 bg-primary/10 rounded w-3/4 mb-4" />
        <div className="h-6 bg-primary/10 rounded w-1/2 mb-12" />
        <div className="h-64 bg-primary/10 rounded-3xl mb-12" />
        <div className="space-y-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-4 bg-primary/10 rounded" style={{ width: `${85 + Math.random() * 15}%` }} />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-5">
        <h1 className="text-3xl font-serif font-black text-body mb-4">Post Not Found</h1>
        <p className="text-muted mb-8">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link
          to="/blog"
          className="px-6 py-3 rounded-2xl bg-primary text-white font-bold text-sm uppercase tracking-widest hover:bg-primary-light transition-all"
        >
          Back to Blog
        </Link>
      </div>
    )
  }

  const seoTitle = post.metaTitle || post.title
  const seoDescription = post.metaDescription || post.excerpt
  const postUrl = `${BASE_URL}/blog/${post.slug}`

  // JSON-LD structured data for Google rich results
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: seoDescription,
    image: post.coverImage || undefined,
    author: {
      '@type': 'Person',
      name: post.author || 'Sasanam Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sasanam',
      url: BASE_URL,
    },
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    url: postUrl,
    keywords: post.tags?.join(', '),
    articleSection: post.category,
  }

  return (
    <article className="min-h-screen">
      <Helmet>
        <title>{`${seoTitle} | Sasanam Blog`}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={postUrl} />

        <meta property="og:type" content="article" />
        <meta property="og:url" content={postUrl} />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:site_name" content="Sasanam" />
        {post.coverImage && <meta property="og:image" content={post.coverImage} />}

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        {post.coverImage && <meta name="twitter:image" content={post.coverImage} />}

        <meta property="article:published_time" content={post.createdAt} />
        <meta property="article:modified_time" content={post.updatedAt || post.createdAt} />
        <meta property="article:section" content={post.category} />
        {post.tags?.map((tag: string) => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}

        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="px-5 sm:px-6 lg:px-8 py-16 max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-primary font-semibold truncate max-w-[200px]">{post.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="px-3 py-1 rounded-lg text-2xs font-black uppercase tracking-widest bg-primary/10 text-primary">
              {post.category}
            </span>
            {post.tags?.map((tag: string) => (
              <span key={tag} className="px-3 py-1 rounded-lg text-2xs font-bold uppercase tracking-wider bg-body/5 text-muted">
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black text-body leading-tight mb-5">
            {post.title}
          </h1>

          <p className="text-lg text-muted leading-relaxed mb-6 font-medium">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase">
                {(post.author || 'S')[0]}
              </div>
              <span className="font-bold text-body">{post.author}</span>
            </div>
            <span className="text-accent">|</span>
            <time className="font-bold text-accent" dateTime={post.createdAt}>
              {formatDate(post.createdAt)}
            </time>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="rounded-3xl overflow-hidden mb-12 shadow-[0_8px_32px_rgba(61,37,22,0.15)]">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none
            prose-headings:font-serif prose-headings:text-body prose-headings:font-black
            prose-p:text-muted prose-p:leading-relaxed prose-p:font-medium
            prose-a:text-primary prose-a:font-bold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-body
            prose-img:rounded-2xl prose-img:shadow-lg
            prose-blockquote:border-primary/30 prose-blockquote:bg-cream/50 prose-blockquote:rounded-r-2xl prose-blockquote:py-1 prose-blockquote:px-6
            prose-li:text-muted prose-li:font-medium
            prose-code:text-primary prose-code:bg-primary/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-normal"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Back to Blog */}
        <div className="mt-16 pt-8 border-t border-primary/10">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to all articles
          </Link>
        </div>
      </div>
    </article>
  )
}

export default BlogPost
