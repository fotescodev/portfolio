import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { BlogPost } from '../types/blog';
import { useTheme } from '../context/ThemeContext';
import { likePost, unlikePost, getLikeCount, hasUserLikedPost } from '../lib/likes';

interface TableOfContentsItem {
    id: string;
    text: string;
    level: number;
}

interface BlogPostModalProps {
    post: BlogPost;
    onClose: () => void;
    onNavigate?: (direction: 'prev' | 'next') => void;
    hasPrev?: boolean;
    hasNext?: boolean;
    prevTitle?: string;
    nextTitle?: string;
    isMobile: boolean;
    relatedPosts?: BlogPost[];
    onPostSelect?: (post: BlogPost) => void;
}

export default function BlogPostModal({
    post,
    onClose,
    onNavigate,
    hasPrev,
    hasNext,
    prevTitle,
    nextTitle,
    isMobile,
    relatedPosts = [],
    onPostSelect
}: BlogPostModalProps) {
    // Only keep isDark for the SyntaxHighlighter theme (third-party library)
    const { isDark } = useTheme();

    // State for UX features
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [activeHeading, setActiveHeading] = useState<string>('');
    const [tocItems, setTocItems] = useState<TableOfContentsItem[]>([]);
    const [showToc, setShowToc] = useState(false);
    const [showCopyToast, setShowCopyToast] = useState(false);
    const [likeCount, setLikeCount] = useState(0);
    const [hasLiked, setHasLiked] = useState(false);
    const [isLikeAnimating, setIsLikeAnimating] = useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Handle scroll lock and ESC key
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    // Extract table of contents from markdown
    useEffect(() => {
        const headings: TableOfContentsItem[] = [];
        const headingRegex = /^(#{1,3})\s+(.+)$/gm;
        let match;

        while ((match = headingRegex.exec(post.content)) !== null) {
            const level = match[1].length;
            const text = match[2].trim();
            const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            headings.push({ id, text, level });
        }

        setTocItems(headings);
        setShowToc(headings.length > 0);
    }, [post.content]);

    // Track scroll progress and back-to-top visibility
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const scrollTop = container.scrollTop;
            const scrollHeight = container.scrollHeight - container.clientHeight;
            const progress = (scrollTop / scrollHeight) * 100;

            setScrollProgress(Math.min(progress, 100));
            setShowBackToTop(scrollTop > 400);

            // Track active heading
            if (contentRef.current) {
                const headings = contentRef.current.querySelectorAll('h1, h2, h3');
                let currentActiveId = '';

                headings.forEach((heading) => {
                    const rect = heading.getBoundingClientRect();
                    if (rect.top <= 200) {
                        currentActiveId = heading.id;
                    }
                });

                setActiveHeading(currentActiveId);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    // Set IDs on headings for anchor links
    useEffect(() => {
        if (!contentRef.current) return;

        const headings = contentRef.current.querySelectorAll('h1, h2, h3');
        headings.forEach((heading) => {
            const text = heading.textContent || '';
            const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            heading.id = id;
        });
    }, [post.content]);

    // Initialize like state from localStorage
    useEffect(() => {
        setLikeCount(getLikeCount(post.slug));
        setHasLiked(hasUserLikedPost(post.slug));
    }, [post.slug]);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const scrollToTop = () => {
        scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element && scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const elementTop = element.offsetTop;
            const offset = 100; // Account for sticky header
            container.scrollTo({ top: elementTop - offset, behavior: 'smooth' });
        }
    };

    const copyCode = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    const getPostUrl = () => {
        // Generate a shareable URL for the post
        return `${window.location.origin}/blog/${post.slug}`;
    };

    const shareOnTwitter = () => {
        const url = getPostUrl();
        const text = `${post.title} by @kolob0kk`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
    };

    const shareOnLinkedIn = () => {
        const url = getPostUrl();
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        window.open(linkedInUrl, '_blank', 'width=550,height=420');
    };

    const copyLink = async () => {
        try {
            const url = getPostUrl();
            await navigator.clipboard.writeText(url);
            setShowCopyToast(true);
            setTimeout(() => setShowCopyToast(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const shareNative = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: getPostUrl()
                });
            } catch (err) {
                // User cancelled or error occurred
                console.log('Share cancelled or failed:', err);
            }
        }
    };

    const handleLike = () => {
        if (hasLiked) {
            // Unlike
            const result = unlikePost(post.slug);
            if (result.success) {
                setLikeCount(result.count);
                setHasLiked(false);
            }
        } else {
            // Like with animation
            const result = likePost(post.slug);
            if (result.success) {
                setLikeCount(result.count);
                setHasLiked(true);
                setIsLikeAnimating(true);
                setTimeout(() => setIsLikeAnimating(false), 600);
            }
        }
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--color-background)',
                animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
        >
            {/* Reading Progress Bar */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'var(--color-border-light)',
                    zIndex: 1001
                }}
            >
                <div
                    style={{
                        height: '100%',
                        width: `${scrollProgress}%`,
                        background: 'var(--color-accent)',
                        transition: 'width 0.1s ease-out'
                    }}
                />
            </div>
            {/* Modal styles - all using CSS variables */}
            <style>{`
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .blog-modal-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .blog-modal-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .blog-modal-scroll::-webkit-scrollbar-thumb {
          background: var(--color-scrollbar-thumb);
          border-radius: 3px;
        }

        .blog-modal-scroll::-webkit-scrollbar-thumb:hover {
          background: var(--color-scrollbar-thumb-hover);
        }

        .blog-modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: var(--color-scrollbar-thumb) transparent;
        }

        .blog-content h1 {
          font-size: clamp(28px, 5vw, 36px);
          font-family: var(--font-serif);
          font-weight: 400;
          font-style: italic;
          color: var(--color-text-primary);
          margin: 40px 0 20px;
          letter-spacing: -0.02em;
          line-height: 1.2;
          text-wrap: balance;
        }

        .blog-content h2 {
          font-size: clamp(22px, 4vw, 26px);
          font-family: var(--font-serif);
          font-weight: 400;
          font-style: italic;
          color: var(--color-text-primary);
          margin: 36px 0 16px;
          letter-spacing: -0.02em;
          line-height: 1.3;
          text-wrap: balance;
        }

        .blog-content h3 {
          font-size: clamp(18px, 3vw, 20px);
          font-weight: 600;
          color: var(--color-text-primary);
          margin: 28px 0 12px;
          line-height: 1.4;
          text-wrap: balance;
        }

        .blog-content p {
          font-size: clamp(16px, 2.5vw, 17px);
          color: var(--color-text-secondary);
          line-height: 1.8;
          margin: 0 0 20px;
        }

        .blog-content ul, .blog-content ol {
          margin: 0 0 20px;
          padding-left: 24px;
          color: var(--color-text-secondary);
        }

        .blog-content li {
          font-size: ${isMobile ? '16px' : '17px'};
          line-height: 1.8;
          margin-bottom: 8px;
        }

        .blog-content a {
          color: var(--color-accent);
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .blog-content a:hover {
          opacity: 0.8;
        }

        .blog-content strong {
          color: var(--color-text-primary);
          font-weight: 600;
        }

        .blog-content em {
          font-style: italic;
        }

        .blog-content blockquote {
          border-left: 3px solid var(--color-accent);
          margin: 24px 0;
          padding: 16px 24px;
          background: var(--color-tag-hover);
        }

        .blog-content blockquote p {
          margin: 0;
          font-style: italic;
        }

        .blog-content hr {
          border: none;
          height: 1px;
          background: var(--color-border);
          margin: 40px 0;
        }

        .blog-content pre {
          margin: 24px 0;
          border-radius: 0;
          border: 1px solid var(--color-border);
        }

        .blog-content code:not([class*="language-"]) {
          background: var(--color-border-light);
          padding: 2px 6px;
          font-size: 0.9em;
          color: var(--color-accent);
        }

        .blog-modal-back-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          color: var(--color-text-tertiary);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          padding: 0;
          font-family: var(--font-sans);
          transition: color 0.2s ease;
        }

        .blog-modal-back-btn:hover {
          color: var(--color-text-primary);
        }

        .blog-modal-close-btn {
          background: none;
          border: 1px solid var(--color-border);
          color: var(--color-text-tertiary);
          width: 40px;
          height: 40px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.2s ease;
        }

        .blog-modal-close-btn:hover {
          border-color: var(--color-text-tertiary);
          color: var(--color-text-primary);
        }

        .back-to-top-btn {
          position: fixed;
          bottom: var(--space-xl);
          right: var(--space-xl);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--color-background-secondary);
          border: 1px solid var(--color-border);
          color: var(--color-text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all var(--transition-fast);
          z-index: 100;
          opacity: 0;
          transform: translateY(20px);
          pointer-events: none;
        }

        .back-to-top-btn.visible {
          opacity: 1;
          transform: translateY(0);
          pointer-events: auto;
        }

        .back-to-top-btn:hover {
          background: var(--color-accent);
          color: var(--color-background);
          border-color: var(--color-accent);
          transform: translateY(-2px);
        }

        .toc-container {
          position: sticky;
          top: 120px;
          max-height: calc(100vh - 200px);
          overflow-y: auto;
          padding: var(--space-lg);
          background: var(--color-background-secondary);
          border: 1px solid var(--color-border-light);
          border-radius: 0;
        }

        .toc-container::-webkit-scrollbar {
          width: 4px;
        }

        .toc-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-bottom: var(--space-md);
        }

        .toc-item {
          display: block;
          font-size: 13px;
          color: var(--color-text-tertiary);
          text-decoration: none;
          padding: 6px 0;
          transition: color var(--transition-fast);
          cursor: pointer;
          line-height: 1.4;
        }

        .toc-item:hover {
          color: var(--color-text-primary);
        }

        .toc-item.active {
          color: var(--color-accent);
          font-weight: 500;
        }

        .toc-item.level-2 {
          padding-left: var(--space-md);
        }

        .toc-item.level-3 {
          padding-left: var(--space-xl);
          font-size: 12px;
        }

        .code-block-wrapper {
          position: relative;
          margin: 24px 0;
        }

        .code-copy-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: var(--color-background-secondary);
          border: 1px solid var(--color-border);
          color: var(--color-text-tertiary);
          padding: 6px 12px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          cursor: pointer;
          border-radius: 0;
          transition: all var(--transition-fast);
          font-family: var(--font-sans);
          z-index: 10;
        }

        .code-copy-btn:hover {
          background: var(--color-accent);
          color: var(--color-background);
          border-color: var(--color-accent);
        }

        .related-posts-section {
          margin-top: var(--space-3xl);
          padding-top: var(--space-3xl);
          border-top: 1px solid var(--color-border-light);
        }

        .related-posts-title {
          font-size: clamp(20px, 3vw, 24px);
          font-family: var(--font-serif);
          font-style: italic;
          color: var(--color-text-primary);
          margin-bottom: var(--space-xl);
        }

        .related-post-card {
          padding: var(--space-lg);
          border: 1px solid var(--color-border-light);
          cursor: pointer;
          transition: all var(--transition-fast);
          background: var(--color-background);
        }

        .related-post-card:hover {
          border-color: var(--color-accent);
          background: var(--color-card-hover);
        }

        .related-post-title {
          font-size: 16px;
          font-family: var(--font-serif);
          font-style: italic;
          color: var(--color-text-primary);
          margin-bottom: var(--space-sm);
        }

        .related-post-meta {
          font-size: 12px;
          color: var(--color-text-tertiary);
        }

        .share-buttons-container {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          margin-top: var(--space-lg);
        }

        .share-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }

        .share-btn {
          background: none;
          border: 1px solid var(--color-border-light);
          color: var(--color-text-tertiary);
          width: 36px;
          height: 36px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--transition-fast);
          padding: 0;
        }

        .share-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          transform: translateY(-2px);
        }

        .share-btn svg {
          width: 16px;
          height: 16px;
        }

        .copy-toast {
          position: fixed;
          bottom: calc(var(--space-xl) * 2 + 48px);
          right: var(--space-xl);
          background: var(--color-background-secondary);
          border: 1px solid var(--color-accent);
          color: var(--color-text-primary);
          padding: var(--space-md) var(--space-lg);
          font-size: 13px;
          font-weight: 500;
          z-index: 1002;
          opacity: 0;
          transform: translateY(10px);
          transition: all var(--transition-fast);
          pointer-events: none;
        }

        .copy-toast.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .like-button-container {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          margin-top: var(--space-2xl);
          padding-top: var(--space-xl);
          border-top: 1px solid var(--color-border-light);
        }

        .like-button {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
          background: none;
          border: 1px solid var(--color-border-light);
          color: var(--color-text-tertiary);
          padding: var(--space-md) var(--space-lg);
          cursor: pointer;
          transition: all var(--transition-fast);
          font-family: var(--font-sans);
          font-size: 14px;
          font-weight: 500;
        }

        .like-button:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
          transform: translateY(-2px);
        }

        .like-button.liked {
          border-color: var(--color-accent);
          background: var(--color-accent);
          color: var(--color-background);
        }

        .like-button.liked:hover {
          opacity: 0.9;
          transform: translateY(-2px);
        }

        .like-button svg {
          width: 18px;
          height: 18px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .like-button.animating svg {
          animation: likeHeartBeat 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes likeHeartBeat {
          0% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.3);
          }
          50% {
            transform: scale(1.1);
          }
          75% {
            transform: scale(1.25);
          }
          100% {
            transform: scale(1);
          }
        }

        .like-count {
          font-size: 14px;
          font-weight: 500;
          color: var(--color-text-secondary);
        }

        .like-count.has-likes {
          color: var(--color-text-primary);
        }

        .like-label {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }
      `}</style>

            {/* Modal Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: isMobile ? '20px 24px' : '28px 64px',
                borderBottom: '1px solid var(--color-border-light)',
                background: 'var(--color-background)',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <button onClick={onClose} className="blog-modal-back-btn">
                    <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}>←</span>
                    Back to Blog
                </button>

                <button onClick={onClose} className="blog-modal-close-btn">
                    ✕
                </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div
                ref={scrollContainerRef}
                className="blog-modal-scroll"
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: isMobile ? '40px 24px' : '64px',
                    display: 'flex',
                    gap: 'var(--space-3xl)',
                    justifyContent: 'center'
                }}
            >
                {/* Main Content */}
                <div style={{
                    maxWidth: '800px',
                    width: '100%',
                    flex: '1 1 auto'
                }}>
                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{
                        fontSize: '13px',
                        color: 'var(--color-text-tertiary)',
                        marginBottom: 'var(--space-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-sm)'
                    }}>
                        <span>{formatDate(post.date)}</span>
                        <span style={{ color: 'var(--color-separator)' }}>•</span>
                        <span>{post.readingTime} min read</span>
                    </div>

                    <h1 style={{
                        fontSize: isMobile ? '32px' : '48px',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 400,
                        fontStyle: 'italic',
                        color: 'var(--color-text-primary)',
                        marginBottom: '20px',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1
                    }}>
                        {post.title}
                    </h1>

                    {/* Tags */}
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap'
                    }}>
                        {post.tags.map((tag, i) => (
                            <span key={i} style={{
                                fontSize: '11px',
                                fontWeight: 500,
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                color: 'var(--color-text-muted)',
                                padding: '6px 12px',
                                border: '1px solid var(--color-border-light)'
                            }}>
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Share Buttons */}
                    <div className="share-buttons-container">
                        <span className="share-label">Share</span>

                        {/* Twitter/X */}
                        <button
                            className="share-btn"
                            onClick={shareOnTwitter}
                            title="Share on Twitter/X"
                            aria-label="Share on Twitter/X"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
                                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                            </svg>
                        </button>

                        {/* LinkedIn */}
                        <button
                            className="share-btn"
                            onClick={shareOnLinkedIn}
                            title="Share on LinkedIn"
                            aria-label="Share on LinkedIn"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                <rect x="2" y="9" width="4" height="12" />
                                <circle cx="4" cy="4" r="2" />
                            </svg>
                        </button>

                        {/* Copy Link */}
                        <button
                            className="share-btn"
                            onClick={copyLink}
                            title="Copy link"
                            aria-label="Copy link to clipboard"
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                            </svg>
                        </button>

                        {/* Native Share (Mobile) */}
                        {typeof navigator !== 'undefined' && 'share' in navigator && (
                            <button
                                className="share-btn"
                                onClick={shareNative}
                                title="Share"
                                aria-label="Open share menu"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="18" cy="5" r="3" />
                                    <circle cx="6" cy="12" r="3" />
                                    <circle cx="18" cy="19" r="3" />
                                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Like Button */}
                    <div className="like-button-container">
                        <span className="like-label">Enjoyed this?</span>
                        <button
                            className={`like-button ${hasLiked ? 'liked' : ''} ${isLikeAnimating ? 'animating' : ''}`}
                            onClick={handleLike}
                            title={hasLiked ? 'Unlike this post' : 'Like this post'}
                            aria-label={hasLiked ? 'Unlike this post' : 'Like this post'}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill={hasLiked ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                            </svg>
                            <span>{hasLiked ? 'Liked' : 'Like'}</span>
                        </button>
                        {likeCount > 0 && (
                            <span className={`like-count ${likeCount > 0 ? 'has-likes' : ''}`}>
                                {likeCount} {likeCount === 1 ? 'like' : 'likes'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Hero Image */}
                {post.thumbnail && (
                    <div style={{
                        aspectRatio: '16/9',
                        marginBottom: 'var(--space-2xl)',
                        background: 'linear-gradient(135deg, var(--color-background-secondary) 0%, var(--color-background-tertiary) 100%)',
                        border: '1px solid var(--color-border-light)',
                        overflow: 'hidden'
                    }}>
                        <img
                            src={post.thumbnail}
                            alt={post.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                )}

                {/* Article Content */}
                <div ref={contentRef} className="blog-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                const isInline = !match;
                                const code = String(children).replace(/\n$/, '');

                                return !isInline ? (
                                    <div className="code-block-wrapper">
                                        <button
                                            className="code-copy-btn"
                                            onClick={() => copyCode(code)}
                                            title="Copy code"
                                        >
                                            Copy
                                        </button>
                                        <SyntaxHighlighter
                                            style={isDark ? oneDark : oneLight}
                                            language={match[1]}
                                            PreTag="div"
                                            customStyle={{
                                                margin: 0,
                                                borderRadius: 0,
                                                border: '1px solid var(--color-border)',
                                                background: 'var(--color-code-bg)'
                                            }}
                                        >
                                            {code}
                                        </SyntaxHighlighter>
                                    </div>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            }
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

                {/* Navigation Between Posts */}
                {(hasPrev || hasNext) && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: 'var(--space-3xl)',
                        paddingTop: 'var(--space-xl)',
                        borderTop: '1px solid var(--color-border-light)',
                        gap: 'var(--space-lg)',
                        flexWrap: 'wrap'
                    }}>
                        {hasPrev ? (
                            <button
                                onClick={() => onNavigate?.('prev')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    padding: 0,
                                    flex: 1,
                                    fontFamily: 'var(--font-sans)'
                                }}
                            >
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    color: 'var(--color-text-muted)',
                                    display: 'block',
                                    marginBottom: 'var(--space-sm)'
                                }}>← Previous</span>
                                <span style={{
                                    fontSize: '16px',
                                    fontFamily: 'var(--font-serif)',
                                    fontStyle: 'italic',
                                    color: 'var(--color-text-secondary)'
                                }}>{prevTitle}</span>
                            </button>
                        ) : <div style={{ flex: 1 }} />}

                        {hasNext ? (
                            <button
                                onClick={() => onNavigate?.('next')}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    textAlign: 'right',
                                    padding: 0,
                                    flex: 1,
                                    fontFamily: 'var(--font-sans)'
                                }}
                            >
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    color: 'var(--color-text-muted)',
                                    display: 'block',
                                    marginBottom: 'var(--space-sm)'
                                }}>Next →</span>
                                <span style={{
                                    fontSize: '16px',
                                    fontFamily: 'var(--font-serif)',
                                    fontStyle: 'italic',
                                    color: 'var(--color-text-secondary)'
                                }}>{nextTitle}</span>
                            </button>
                        ) : <div style={{ flex: 1 }} />}
                    </div>
                )}

                {/* Related Posts */}
                {relatedPosts && relatedPosts.length > 0 && (
                    <div className="related-posts-section">
                        <h2 className="related-posts-title">Related Articles</h2>
                        <div style={{
                            display: 'grid',
                            gap: 'var(--space-lg)',
                            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(280px, 1fr))'
                        }}>
                            {relatedPosts.map((relatedPost, index) => (
                                <div
                                    key={index}
                                    className="related-post-card"
                                    onClick={() => onPostSelect?.(relatedPost)}
                                >
                                    <h3 className="related-post-title">{relatedPost.title}</h3>
                                    <div className="related-post-meta">
                                        {formatDate(relatedPost.date)} · {relatedPost.readingTime} min read
                                    </div>
                                    {relatedPost.tags && relatedPost.tags.length > 0 && (
                                        <div style={{
                                            display: 'flex',
                                            gap: '8px',
                                            flexWrap: 'wrap',
                                            marginTop: 'var(--space-sm)'
                                        }}>
                                            {relatedPost.tags.slice(0, 3).map((tag, i) => (
                                                <span key={i} style={{
                                                    fontSize: '10px',
                                                    fontWeight: 500,
                                                    letterSpacing: '0.08em',
                                                    textTransform: 'uppercase',
                                                    color: 'var(--color-text-muted)',
                                                    padding: '4px 8px',
                                                    border: '1px solid var(--color-border-light)'
                                                }}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                </div>

                {/* Table of Contents - Desktop Only */}
                {!isMobile && showToc && tocItems.length > 0 && (
                    <div style={{
                        width: '280px',
                        flexShrink: 0
                    }}>
                        <div className="toc-container">
                            <div className="toc-title">Contents</div>
                            <nav>
                                {tocItems.map((item, index) => (
                                    <div
                                        key={index}
                                        className={`toc-item level-${item.level} ${activeHeading === item.id ? 'active' : ''}`}
                                        onClick={() => scrollToHeading(item.id)}
                                    >
                                        {item.text}
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </div>
                )}
            </div>

            {/* Back to Top Button */}
            <button
                className={`back-to-top-btn ${showBackToTop ? 'visible' : ''}`}
                onClick={scrollToTop}
                title="Back to top"
            >
                ↑
            </button>

            {/* Copy Toast Notification */}
            <div className={`copy-toast ${showCopyToast ? 'visible' : ''}`}>
                Link copied to clipboard!
            </div>
        </div>
    );
}
