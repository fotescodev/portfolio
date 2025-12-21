import { useParams, useNavigate, Link, Navigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../context/ThemeContext';
import { likePost, unlikePost, getLikeCount, hasUserLikedPost } from '../lib/likes';
import { profile } from '../lib/content';
import ThemeToggle from '../components/ThemeToggle';
import type { BlogPost } from '../types/blog';

// Auto-discover blog posts
const blogPostFiles = import.meta.glob('../../content/blog/*.md', { query: '?raw', eager: true });

interface TableOfContentsItem {
    id: string;
    text: string;
    level: number;
}

function parseFrontmatter(raw: string): { frontmatter: Record<string, unknown>; content: string } {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { frontmatter: {}, content: raw };

    const frontmatterStr = match[1];
    const content = match[2];
    const frontmatter: Record<string, unknown> = {};

    for (const line of frontmatterStr.split('\n')) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;
        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();

        if (value.startsWith('[') && value.endsWith(']')) {
            frontmatter[key] = value.slice(1, -1).split(',').map(item => item.trim().replace(/^["']|["']$/g, ''));
        } else if (value.startsWith('"') && value.endsWith('"')) {
            frontmatter[key] = value.slice(1, -1);
        } else if (value === 'null') {
            frontmatter[key] = null;
        } else {
            frontmatter[key] = value;
        }
    }
    return { frontmatter, content };
}

function calculateReadingTime(content: string): number {
    return Math.ceil(content.split(/\s+/).length / 200);
}

function extractSlugFromFilename(path: string): string {
    const filename = path.split('/').pop() || '';
    return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
}

function parseBlogPosts(): BlogPost[] {
    return Object.entries(blogPostFiles)
        .map(([path, module]) => {
            const raw = (module as { default: string }).default;
            const slug = extractSlugFromFilename(path);
            const { frontmatter, content } = parseFrontmatter(raw);
            return {
                slug,
                title: frontmatter.title as string || 'Untitled',
                date: frontmatter.date as string || new Date().toISOString().split('T')[0],
                excerpt: frontmatter.excerpt as string || '',
                tags: (frontmatter.tags as string[]) || [],
                thumbnail: frontmatter.thumbnail as string | null || null,
                readingTime: calculateReadingTime(content),
                content
            };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Author info
const author = {
    name: 'Dmitrii Fotesco',
    bio: 'Senior Technical PM shipping institutional crypto infrastructure. Currently exploring the intersection of deterministic systems and probabilistic intelligence.',
    avatar: '/images/avatar.jpg',
    twitter: 'https://x.com/kolob0kk'
};

export default function BlogPostPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const posts = parseBlogPosts();
    const post = posts.find(p => p.slug === slug);
    const currentIndex = post ? posts.findIndex(p => p.slug === post.slug) : -1;
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

    const [scrollProgress, setScrollProgress] = useState(0);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [activeHeading, setActiveHeading] = useState<string>('');
    const [tocItems, setTocItems] = useState<TableOfContentsItem[]>([]);
    const [showCopyToast, setShowCopyToast] = useState(false);
    const [clapCount, setClapCount] = useState(0);
    const [hasClapped, setHasClapped] = useState(false);
    const [isClapping, setIsClapping] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [emailCopied, setEmailCopied] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [tocOpen, setTocOpen] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    // Calculate reading time remaining based on scroll progress
    const readingTimeRemaining = post ? Math.max(0, Math.ceil(post.readingTime * (1 - scrollProgress / 100))) : 0;

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!post) return;
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
    }, [post?.content]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            setScrollProgress(Math.min((scrollTop / docHeight) * 100, 100));
            setShowBackToTop(scrollTop > 400);

            if (contentRef.current) {
                const headings = contentRef.current.querySelectorAll('h1, h2, h3');
                let currentActiveId = '';
                headings.forEach((heading) => {
                    if (heading.getBoundingClientRect().top <= 150) {
                        currentActiveId = heading.id;
                    }
                });
                setActiveHeading(currentActiveId);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!contentRef.current) return;
        contentRef.current.querySelectorAll('h1, h2, h3').forEach((heading) => {
            const text = heading.textContent || '';
            heading.id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        });
    }, [post?.content]);

    useEffect(() => {
        if (!post) return;
        setClapCount(getLikeCount(post.slug));
        setHasClapped(hasUserLikedPost(post.slug));
    }, [post?.slug]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if user is typing in an input
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.key === 'Escape') {
                navigate('/#blog');
            } else if (e.key === 'j' && nextPost) {
                navigate(`/blog/${nextPost.slug}`);
            } else if (e.key === 'k' && prevPost) {
                navigate(`/blog/${prevPost.slug}`);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate, nextPost, prevPost]);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [slug]);

    if (!post) return <Navigate to="/" replace />;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatDateShort = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' }).replace(/\//g, '.');
    };

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const scrollToHeading = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
        }
    };

    const copyCode = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch (err) {
            console.error('Failed to copy code:', err);
        }
    };

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(profile.email);
            setEmailCopied(true);
            setTimeout(() => setEmailCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy email:', err);
        }
    };

    const getPostUrl = () => `${window.location.origin}/#/blog/${post.slug}`;

    const shareOnTwitter = () => {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${post.title} by @kolob0kk`)}&url=${encodeURIComponent(getPostUrl())}`, '_blank', 'width=550,height=420');
    };

    const shareOnLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getPostUrl())}`, '_blank', 'width=550,height=420');
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(getPostUrl());
            setShowCopyToast(true);
            setTimeout(() => setShowCopyToast(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    const handleClap = () => {
        if (hasClapped) {
            const result = unlikePost(post.slug);
            if (result.success) { setClapCount(result.count); setHasClapped(false); }
        } else {
            const result = likePost(post.slug);
            if (result.success) {
                setClapCount(result.count);
                setHasClapped(true);
                setIsClapping(true);
                setTimeout(() => setIsClapping(false), 600);
            }
        }
    };

    const relatedPosts = posts
        .filter(p => p.slug !== post.slug && p.tags.some(tag => post.tags.includes(tag)))
        .slice(0, 2);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-background)', color: 'var(--color-text-primary)' }}>
            <style>{`
                /* Reading Progress */
                .progress-bar { position: fixed; top: 0; left: 0; right: 0; height: 3px; background: var(--color-border-light); z-index: 1001; }
                .progress-fill { height: 100%; background: var(--color-accent); transition: width 0.1s ease-out; }

                /* Nav */
                .blog-nav { position: sticky; top: 0; background: var(--color-nav-bg); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-bottom: 1px solid var(--color-border-light); z-index: 100; }
                .back-link { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; color: var(--color-text-tertiary); text-decoration: none; transition: color var(--transition-fast); font-family: var(--font-sans); }
                .back-link:hover { color: var(--color-accent); }
                .back-link span { transition: transform var(--transition-fast); }
                .back-link:hover span { transform: translateX(-4px); }

                /* Tags */
                .tag { display: inline-flex; align-items: center; padding: 4px 10px; font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; border-radius: 0; font-family: var(--font-sans); }
                .tag-primary { background: var(--color-tag-hover); color: var(--color-accent); border: 1px solid var(--color-cert-border); }
                .tag-secondary { background: var(--color-background-secondary); color: var(--color-text-muted); border: 1px solid var(--color-border-light); }

                /* Author row */
                .author-row { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--color-border-light); border-bottom: 1px solid var(--color-border-light); padding: 20px 0; margin-top: 32px; }
                .author-info { display: flex; align-items: center; gap: 16px; }
                .author-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; filter: grayscale(1); border: 2px solid var(--color-photo-border); }
                .author-name { font-size: 14px; font-weight: 600; color: var(--color-text-primary); font-family: var(--font-sans); }
                .author-meta { font-size: 12px; color: var(--color-text-muted); font-family: var(--font-sans); }
                .action-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: var(--color-background-secondary); border: none; color: var(--color-text-muted); cursor: pointer; transition: all var(--transition-fast); }
                .action-btn:hover { color: var(--color-accent); background: var(--color-tag-hover); }
                .action-btn svg { width: 16px; height: 16px; }

                /* Hero image */
                .hero-figure { margin: 48px 0; }
                .hero-image-wrapper { position: relative; aspect-ratio: 16/9; border-radius: 0; overflow: hidden; box-shadow: var(--shadow-drawer); background: var(--color-background-secondary); }
                .hero-image { width: 100%; height: 100%; object-fit: cover; opacity: 0.85; }
                .hero-gradient { position: absolute; inset: 0; background: linear-gradient(to top right, var(--color-overlay-dark), transparent); }
                .hero-caption { margin-top: 16px; font-size: 12px; text-align: center; color: var(--color-text-muted); font-style: italic; font-family: var(--font-serif); }

                /* Prose - using Instrument fonts */
                .blog-prose h2 { font-size: clamp(22px, 4vw, 28px); font-family: var(--font-serif); font-weight: 400; font-style: italic; color: var(--color-text-primary); margin: 48px 0 20px; letter-spacing: -0.02em; line-height: 1.3; }
                .blog-prose h3 { font-size: clamp(18px, 3vw, 22px); font-family: var(--font-serif); font-weight: 400; font-style: italic; color: var(--color-text-primary); margin: 40px 0 16px; line-height: 1.4; }
                .blog-prose p { font-size: 17px; color: var(--color-text-secondary); line-height: 1.8; margin: 0 0 24px; font-family: var(--font-sans); }
                .blog-prose ul, .blog-prose ol { margin: 0 0 24px; padding-left: 24px; color: var(--color-text-secondary); }
                .blog-prose li { font-size: 17px; line-height: 1.8; margin-bottom: 12px; font-family: var(--font-sans); }
                .blog-prose li strong { color: var(--color-text-primary); }
                .blog-prose a { color: var(--color-accent); text-decoration: none; transition: opacity var(--transition-fast); }
                .blog-prose a:hover { opacity: 0.8; }
                .blog-prose strong { color: var(--color-text-primary); font-weight: 600; }
                .blog-prose em { font-style: italic; }
                .blog-prose hr { border: none; height: 1px; background: var(--color-border); margin: 48px 0; }
                .blog-prose code:not([class*="language-"]) { background: var(--color-background-tertiary); padding: 2px 8px; font-size: 0.9em; color: var(--color-accent); border-radius: 0; }

                /* Blockquote */
                .blog-prose blockquote { border-left: 3px solid var(--color-accent); margin: 32px 0; padding: 16px 24px; background: var(--color-background-secondary); border-radius: 0; }
                .blog-prose blockquote p { margin: 0; font-size: 18px; color: var(--color-text-secondary); line-height: 1.7; font-family: var(--font-sans); }

                /* Code block with macOS chrome - using design system colors */
                .code-block { margin: 32px 0; border-radius: 0; overflow: hidden; border: 1px solid var(--color-border); background: var(--color-code-bg); box-shadow: var(--shadow-drawer); }
                .code-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--color-background-tertiary); border-bottom: 1px solid var(--color-border); }
                .code-dots { display: flex; gap: 6px; }
                .code-dot { width: 10px; height: 10px; border-radius: 50%; }
                .code-dot-red { background: var(--color-danger); }
                .code-dot-yellow { background: #FFBD2E; }
                .code-dot-green { background: var(--color-success); }
                .code-filename { font-size: 12px; font-family: monospace; color: var(--color-text-tertiary); margin-left: 12px; }
                .code-lang { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted); font-family: var(--font-sans); }
                .code-copy-btn { display: flex; align-items: center; gap: 6px; background: transparent; border: none; color: var(--color-text-tertiary); font-size: 12px; cursor: pointer; padding: 4px 8px; border-radius: 0; transition: all var(--transition-fast); font-family: var(--font-sans); }
                .code-copy-btn:hover { color: var(--color-text-primary); background: var(--color-border-light); }
                .code-copy-btn svg { width: 14px; height: 14px; }
                .code-content { padding: 20px; overflow-x: auto; }
                .code-content pre { margin: 0 !important; background: transparent !important; }
                .code-content code { background: transparent !important; }
                .code-content span { background: transparent !important; }

                /* Author bio card */
                .author-card { display: flex; flex-direction: column; gap: 20px; padding: 24px; background: var(--color-background-secondary); border: 1px solid var(--color-border-light); margin-top: 32px; margin-bottom: 48px; }
                @media (min-width: 768px) { .author-card { flex-direction: row; align-items: flex-start; gap: 24px; padding: 28px; } }
                .author-card-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; filter: grayscale(1); flex-shrink: 0; }
                .author-card-content { flex: 1; }
                .author-card-title { font-family: var(--font-serif); font-style: italic; font-size: 18px; color: var(--color-text-primary); margin-bottom: 6px; }
                .author-card-bio { font-size: 13px; color: var(--color-text-tertiary); line-height: 1.5; margin-bottom: 16px; font-family: var(--font-sans); }
                .author-card-actions { display: inline-flex; align-items: center; gap: 4px; padding: 4px; background: var(--color-background); border: 1px solid var(--color-border-light); }
                .author-card-btn { display: flex; align-items: center; gap: 5px; padding: 6px 12px; background: transparent; border: none; color: var(--color-text-secondary); font-size: 11px; font-weight: 500; font-family: var(--font-sans); cursor: pointer; text-decoration: none; transition: all 0.2s ease; white-space: nowrap; }
                .author-card-btn:hover { color: var(--color-text-primary); background: var(--color-tag-hover); }
                .author-card-btn svg { width: 12px; height: 12px; opacity: 0.7; }
                .author-card-btn-primary { background: var(--color-accent); color: var(--color-background); }
                .author-card-btn-primary:hover { background: var(--color-accent-hover); color: var(--color-background); }
                .author-card-btn-primary svg { opacity: 1; }
                .author-card-divider { width: 1px; height: 14px; background: var(--color-border-light); }

                /* Tags footer */
                .tags-footer { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--color-border-light); }
                .tags-label { font-size: 14px; font-weight: 500; color: var(--color-text-muted); margin-right: 8px; font-family: var(--font-sans); }
                .tag-link { font-size: 14px; color: var(--color-text-tertiary); text-decoration: none; transition: color var(--transition-fast); font-family: var(--font-sans); }
                .tag-link:hover { color: var(--color-accent); }

                /* More thoughts section */
                .more-thoughts { background: var(--color-background-secondary); border-top: 1px solid var(--color-border-light); padding: 80px 0; margin-top: 80px; }
                .more-thoughts-title { font-family: var(--font-serif); font-style: italic; font-size: 24px; color: var(--color-text-primary); margin-bottom: 32px; }
                .thought-card { display: block; padding: 24px; background: var(--color-background); border: 1px solid var(--color-border-light); border-radius: 0; text-decoration: none; transition: all var(--transition-fast); }
                .thought-card:hover { border-color: var(--color-accent); background: var(--color-card-hover); }
                .thought-date { font-size: 12px; font-weight: 600; color: var(--color-text-muted); margin-bottom: 8px; font-family: var(--font-sans); }
                .thought-title { font-family: var(--font-serif); font-style: italic; font-size: 20px; color: var(--color-text-primary); margin-bottom: 12px; transition: color var(--transition-fast); }
                .thought-card:hover .thought-title { color: var(--color-accent); }
                .thought-cta { display: inline-flex; align-items: center; gap: 4px; font-size: 14px; font-weight: 500; color: var(--color-accent); font-family: var(--font-sans); }
                .thought-cta svg { width: 16px; height: 16px; transition: transform var(--transition-fast); }
                .thought-card:hover .thought-cta svg { transform: translateX(4px); }

                /* TOC */
                .toc-container { position: sticky; top: 100px; padding: 20px; background: transparent; border: none; border-radius: 0; }
                .toc-title { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 16px; font-family: var(--font-sans); }
                .toc-item { display: block; font-size: 13px; color: var(--color-text-tertiary); padding: 8px 0; cursor: pointer; transition: color var(--transition-fast); border-left: 2px solid var(--color-border-light); padding-left: 12px; font-family: var(--font-sans); background: transparent; border-top: none; border-right: none; border-bottom: none; text-align: left; width: 100%; }
                .toc-item:hover { color: var(--color-text-primary); }
                .toc-item.active { color: var(--color-accent); border-left-color: var(--color-accent); }
                .toc-item.level-2 { padding-left: 20px; }
                .toc-item.level-3 { padding-left: 28px; font-size: 12px; }

                /* Utils */
                .back-to-top { position: fixed; bottom: 24px; right: 24px; width: 48px; height: 48px; border-radius: 0; background: var(--color-background-secondary); border: 1px solid var(--color-border); color: var(--color-text-secondary); cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 20px; z-index: 100; opacity: 0; transform: translateY(20px); pointer-events: none; transition: all var(--transition-fast); font-family: var(--font-serif); }
                .back-to-top.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }
                .back-to-top:hover { background: var(--color-accent); color: var(--color-background); border-color: var(--color-accent); }
                .copy-toast { position: fixed; bottom: 90px; right: 24px; background: var(--color-background-secondary); border: 1px solid var(--color-accent); color: var(--color-text-primary); padding: 12px 20px; font-size: 13px; font-weight: 500; z-index: 1002; opacity: 0; transform: translateY(10px); transition: all var(--transition-fast); pointer-events: none; border-radius: 0; font-family: var(--font-sans); }
                .copy-toast.visible { opacity: 1; transform: translateY(0); }

                /* Clap */
                .clap-btn { display: flex; align-items: center; gap: 6px; background: none; border: none; color: var(--color-text-muted); cursor: pointer; padding: 8px; transition: all var(--transition-fast); font-family: var(--font-sans); }
                .clap-btn:hover, .clap-btn.clapped { color: var(--color-accent); }
                .clap-btn svg { width: 20px; height: 20px; }
                .clap-btn.animating svg { animation: clapBounce 0.6s var(--ease-smooth); }
                @keyframes clapBounce { 0% { transform: scale(1); } 25% { transform: scale(1.3); } 50% { transform: scale(1.1); } 75% { transform: scale(1.25); } 100% { transform: scale(1); } }

                /* Drop cap */
                .blog-prose > p:first-of-type::first-letter { float: left; font-family: var(--font-serif); font-size: 3.5em; line-height: 0.8; padding-right: 12px; padding-top: 4px; color: var(--color-text-primary); font-weight: 400; }

                /* Reading time remaining */
                .reading-indicator { position: fixed; top: 3px; right: 24px; font-size: 11px; color: var(--color-text-muted); font-family: var(--font-sans); z-index: 1002; opacity: 0; transition: opacity var(--transition-fast); }
                .reading-indicator.visible { opacity: 1; }

                /* Prev/Next navigation */
                .post-nav { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 48px; padding-top: 32px; border-top: 1px solid var(--color-border-light); }
                @media (max-width: 640px) { .post-nav { grid-template-columns: 1fr; } }
                .post-nav-link { display: flex; flex-direction: column; padding: 20px; background: var(--color-background-secondary); border: 1px solid var(--color-border-light); text-decoration: none; transition: all var(--transition-fast); }
                .post-nav-link:hover { border-color: var(--color-accent); background: var(--color-card-hover); }
                .post-nav-link.next { text-align: right; }
                .post-nav-label { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-text-muted); margin-bottom: 8px; font-family: var(--font-sans); display: flex; align-items: center; gap: 6px; }
                .post-nav-link.next .post-nav-label { justify-content: flex-end; }
                .post-nav-title { font-family: var(--font-serif); font-style: italic; font-size: 16px; color: var(--color-text-primary); line-height: 1.3; transition: color var(--transition-fast); }
                .post-nav-link:hover .post-nav-title { color: var(--color-accent); }

                /* Mobile menu */
                .mobile-menu { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: var(--color-background); z-index: 99; display: flex; flex-direction: column; justify-content: center; padding: 0 24px; opacity: 0; pointer-events: none; transition: opacity 0.3s ease; }
                .mobile-menu.open { opacity: 1; pointer-events: auto; }
                .mobile-menu-link { color: var(--color-text-primary); text-decoration: none; font-family: var(--font-serif); font-size: 32px; font-style: italic; padding: 16px 0; border-bottom: 1px solid var(--color-border); transition: color var(--transition-fast); }
                .mobile-menu-link:hover { color: var(--color-accent); }

                /* Mobile TOC */
                .toc-mobile { margin-bottom: 32px; }
                .toc-toggle { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 16px; background: var(--color-background-secondary); border: 1px solid var(--color-border-light); color: var(--color-text-primary); font-size: 14px; font-weight: 500; cursor: pointer; font-family: var(--font-sans); transition: all var(--transition-fast); }
                .toc-toggle:hover { background: var(--color-background-tertiary); }
                .toc-toggle svg { width: 16px; height: 16px; transition: transform var(--transition-fast); color: var(--color-text-muted); }
                .toc-toggle.open svg { transform: rotate(180deg); }
                .toc-mobile-content { padding: 16px; background: var(--color-background-secondary); border: 1px solid var(--color-border-light); border-top: none; display: none; }
                .toc-mobile-content.open { display: block; }
                .toc-mobile-content .toc-item { display: block; text-align: left; width: 100%; background: transparent; border: none; }

                /* Desktop TOC sidebar */
                .toc-sidebar { position: fixed; top: 120px; right: max(24px, calc((100vw - 1200px) / 2 - 200px)); width: 200px; display: none; }
                @media (min-width: 1280px) { .toc-sidebar { display: block; } }

                /* Anchor links on headings */
                .heading-anchor { opacity: 0; margin-left: 8px; color: var(--color-text-muted); text-decoration: none; transition: opacity var(--transition-fast); }
                .blog-prose h2:hover .heading-anchor, .blog-prose h3:hover .heading-anchor { opacity: 1; }
                .heading-anchor:hover { color: var(--color-accent); }

                /* Image blur-up */
                .hero-image { transition: opacity 0.5s ease, filter 0.5s ease; }
                .hero-image.loading { filter: blur(10px); opacity: 0.6; }
                .hero-image.loaded { filter: blur(0); opacity: 0.85; }

                /* Print styles */
                @media print {
                    .progress-bar, .blog-nav, .back-to-top, .copy-toast, .toc-sidebar, .toc-mobile, .post-nav, .more-thoughts, .author-card-actions, .action-btn, .clap-btn, .mobile-menu { display: none !important; }
                    .blog-prose { max-width: 100% !important; }
                    .blog-prose a { color: inherit; text-decoration: underline; }
                    .blog-prose a::after { content: " (" attr(href) ")"; font-size: 0.8em; color: #666; }
                    .code-block { break-inside: avoid; box-shadow: none; border: 1px solid #ccc; }
                    .author-card { break-inside: avoid; }
                    body { font-size: 12pt; line-height: 1.5; }
                    h1 { font-size: 24pt; }
                    h2 { font-size: 18pt; }
                    h3 { font-size: 14pt; }
                }

                /* Keyboard hints */
                .keyboard-hints { position: fixed; bottom: 24px; left: 24px; display: none; gap: 8px; font-size: 11px; color: var(--color-text-muted); font-family: var(--font-sans); z-index: 50; }
                @media (min-width: 1024px) { .keyboard-hints { display: flex; } }
                .kbd { display: inline-flex; align-items: center; justify-content: center; min-width: 20px; height: 20px; padding: 0 6px; background: var(--color-background-secondary); border: 1px solid var(--color-border); font-size: 10px; font-weight: 600; }
            `}</style>

            {/* Open Graph Meta Tags */}
            <Helmet>
                <title>{post.title} | Dmitrii Fotesco</title>
                <meta name="description" content={post.excerpt} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={post.excerpt} />
                <meta property="og:type" content="article" />
                <meta property="og:url" content={`${window.location.origin}/#/blog/${post.slug}`} />
                {post.thumbnail && <meta property="og:image" content={post.thumbnail} />}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={post.title} />
                <meta name="twitter:description" content={post.excerpt} />
                <meta name="twitter:creator" content="@kolob0kk" />
                <meta property="article:published_time" content={post.date} />
                <meta property="article:author" content="Dmitrii Fotesco" />
                {post.tags.map((tag, i) => (
                    <meta key={i} property="article:tag" content={tag} />
                ))}
            </Helmet>

            {/* Progress bar */}
            <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${scrollProgress}%` }} />
            </div>

            {/* Reading time remaining */}
            <div className={`reading-indicator ${scrollProgress > 5 && scrollProgress < 95 ? 'visible' : ''}`}>
                {readingTimeRemaining} min left
            </div>

            {/* Main Portfolio Nav - consistent across all pages */}
            <nav
                aria-label="Primary"
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 100,
                    background: 'var(--color-nav-bg)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    borderBottom: '1px solid var(--color-border-light)'
                }}
            >
                <div style={{
                    maxWidth: 'var(--layout-max-width)',
                    margin: '0 auto',
                    padding: isMobile ? 'var(--nav-height-mobile) var(--space-lg)' : 'var(--nav-height) var(--space-3xl)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {/* Logo */}
                    <div style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '24px',
                        fontStyle: 'italic',
                        fontWeight: 700
                    }}>
                        <Link
                            to="/"
                            style={{
                                textDecoration: 'none',
                                color: 'var(--color-text-primary)',
                                transition: 'color 0.4s ease'
                            }}
                        >
                            {profile.name}
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    {!isMobile && (
                        <div style={{ display: 'flex', gap: 'var(--space-xl)', alignItems: 'center' }}>
                            {[
                                { label: 'Experience', id: 'experience' },
                                { label: 'Cases', id: 'work' },
                                { label: 'Blog', id: 'blog' },
                                { label: 'About', id: 'about' }
                            ].map((item) => (
                                <a
                                    key={item.id}
                                    href={`/#/${item.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        navigate('/');
                                        setTimeout(() => {
                                            const el = document.getElementById(item.id);
                                            if (el) {
                                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                            }
                                        }, 100);
                                    }}
                                    style={{
                                        textDecoration: 'none',
                                        fontSize: '13px',
                                        fontWeight: 500,
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase' as const,
                                        color: 'var(--color-text-tertiary)',
                                        transition: 'color 0.2s ease',
                                        fontFamily: 'var(--font-sans)',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-text-primary)'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-tertiary)'}
                                >
                                    {item.label}
                                </a>
                            ))}
                            <ThemeToggle />
                            <a
                                href="/#/contact"
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/');
                                    setTimeout(() => {
                                        const el = document.getElementById('contact');
                                        if (el) {
                                            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                        }
                                    }, 100);
                                }}
                                style={{
                                    padding: '12px 24px',
                                    background: 'var(--color-accent)',
                                    color: 'var(--color-background)',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    letterSpacing: '0.02em',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                    fontFamily: 'var(--font-sans)',
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--color-accent-hover)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--color-accent)'}
                            >
                                Get in Touch
                            </a>
                        </div>
                    )}

                    {/* Mobile: Theme toggle and hamburger */}
                    {isMobile && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <ThemeToggle isMobile />
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '8px',
                                    cursor: 'pointer',
                                    color: 'var(--color-text-primary)',
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    fontFamily: 'var(--font-sans)'
                                }}
                            >
                                {mobileMenuOpen ? 'Close' : 'Menu'}
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                {[
                    { label: 'Experience', id: 'experience' },
                    { label: 'Cases', id: 'work' },
                    { label: 'Blog', id: 'blog' },
                    { label: 'About', id: 'about' },
                    { label: 'Get in Touch', id: 'contact' }
                ].map((item) => (
                    <a
                        key={item.id}
                        href={`/#/${item.id}`}
                        className="mobile-menu-link"
                        onClick={(e) => {
                            e.preventDefault();
                            setMobileMenuOpen(false);
                            navigate('/');
                            setTimeout(() => {
                                const el = document.getElementById(item.id);
                                if (el) {
                                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }, 100);
                        }}
                    >
                        {item.label}
                    </a>
                ))}
            </div>

            {/* Desktop TOC Sidebar */}
            {tocItems.length > 0 && (
                <aside className="toc-sidebar">
                    <div className="toc-container">
                        <div className="toc-title">Contents</div>
                        {tocItems.map((item) => (
                            <button
                                key={item.id}
                                className={`toc-item level-${item.level} ${activeHeading === item.id ? 'active' : ''}`}
                                onClick={() => scrollToHeading(item.id)}
                            >
                                {item.text}
                            </button>
                        ))}
                    </div>
                </aside>
            )}

            {/* Main */}
            <main style={{ paddingTop: isMobile ? '80px' : '100px', paddingBottom: '0' }}>
                <article style={{ maxWidth: '768px', margin: '0 auto', padding: isMobile ? '0 24px' : '0 24px' }}>
                    {/* Back link */}
                    <div style={{ marginBottom: 'var(--space-xl)' }}>
                        <a
                            href="/#/blog"
                            className="back-link"
                            onClick={(e) => {
                                e.preventDefault();
                                navigate('/');
                                setTimeout(() => {
                                    const el = document.getElementById('blog');
                                    if (el) {
                                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                }, 100);
                            }}
                        >
                            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '16px' }}>←</span>
                            Back to Thoughts
                        </a>
                    </div>

                    {/* Mobile TOC */}
                    {isMobile && tocItems.length > 0 && (
                        <div className="toc-mobile">
                            <button className={`toc-toggle ${tocOpen ? 'open' : ''}`} onClick={() => setTocOpen(!tocOpen)}>
                                <span>Table of Contents</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="6 9 12 15 18 9" />
                                </svg>
                            </button>
                            <div className={`toc-mobile-content ${tocOpen ? 'open' : ''}`}>
                                {tocItems.map((item) => (
                                    <button
                                        key={item.id}
                                        className={`toc-item level-${item.level} ${activeHeading === item.id ? 'active' : ''}`}
                                        onClick={() => { scrollToHeading(item.id); setTocOpen(false); }}
                                    >
                                        {item.text}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
                        {post.tags.map((tag, i) => (
                            <span key={i} className={i === 0 ? 'tag tag-primary' : 'tag tag-secondary'}>{tag}</span>
                        ))}
                    </div>

                    {/* Title */}
                    <h1 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: isMobile ? '32px' : '48px',
                        fontWeight: 400,
                        lineHeight: 1.1,
                        color: 'var(--color-text-primary)',
                        marginBottom: '32px',
                        letterSpacing: '-0.02em'
                    }}>
                        {post.title}
                    </h1>

                    {/* Lead / Excerpt */}
                    <p style={{
                        fontSize: isMobile ? '18px' : '22px',
                        color: 'var(--color-text-tertiary)',
                        lineHeight: 1.6,
                        fontWeight: 300,
                        marginBottom: '0'
                    }}>
                        {post.excerpt}
                    </p>

                    {/* Author row */}
                    <div className="author-row">
                        <div className="author-info">
                            <img src={author.avatar} alt={author.name} className="author-avatar" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/48'; }} />
                            <div>
                                <div className="author-name">{author.name}</div>
                                <div className="author-meta">{formatDate(post.date)} · {post.readingTime} min read</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <button className={`clap-btn ${hasClapped ? 'clapped' : ''} ${isClapping ? 'animating' : ''}`} onClick={handleClap} title={hasClapped ? 'Unlike' : 'Like'}>
                                <svg viewBox="0 0 24 24" fill={hasClapped ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {clapCount > 0 && <span style={{ fontSize: '13px', fontWeight: 500 }}>{clapCount}</span>}
                            </button>
                            <div style={{ width: '1px', height: '20px', background: 'var(--color-border-light)' }} />
                            <button className="action-btn" onClick={shareOnTwitter} title="Share on X">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                            </button>
                            <button className="action-btn" onClick={shareOnLinkedIn} title="Share on LinkedIn">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" /><path d="M8 11l0 5" /><path d="M8 8l0 .01" /><path d="M12 16l0 -5" /><path d="M16 16v-3a2 2 0 0 0 -4 0" /></svg>
                            </button>
                            <button className="action-btn" onClick={copyLink} title="Copy link">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
                            </button>
                        </div>
                    </div>

                    {/* Hero image with blur-up loading */}
                    {post.thumbnail && (
                        <figure className="hero-figure">
                            <div className="hero-image-wrapper">
                                <img
                                    src={post.thumbnail}
                                    alt={post.title}
                                    className={`hero-image ${imageLoaded ? 'loaded' : 'loading'}`}
                                    loading="lazy"
                                    onLoad={() => setImageLoaded(true)}
                                />
                                <div className="hero-gradient" />
                            </div>
                            <figcaption className="hero-caption">Visualization of agent-to-protocol interaction layers.</figcaption>
                        </figure>
                    )}

                    {/* Content */}
                    <div ref={contentRef} className="blog-prose" style={{ marginTop: post.thumbnail ? '0' : '48px' }}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h2({ children, ...props }) {
                                    const text = String(children);
                                    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                    return (
                                        <h2 id={id} {...props}>
                                            {children}
                                            <a href={`#${id}`} className="heading-anchor" aria-label={`Link to ${text}`}>#</a>
                                        </h2>
                                    );
                                },
                                h3({ children, ...props }) {
                                    const text = String(children);
                                    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                                    return (
                                        <h3 id={id} {...props}>
                                            {children}
                                            <a href={`#${id}`} className="heading-anchor" aria-label={`Link to ${text}`}>#</a>
                                        </h3>
                                    );
                                },
                                code({ className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const isInline = !match;
                                    const code = String(children).replace(/\n$/, '');
                                    const lang = match ? match[1] : 'text';
                                    const filename = lang === 'solidity' ? 'Contract.sol' : lang === 'json' ? 'config.json' : lang === 'typescript' ? 'index.ts' : `code.${lang}`;

                                    return !isInline ? (
                                        <div className="code-block">
                                            <div className="code-header">
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <div className="code-dots">
                                                        <div className="code-dot code-dot-red" />
                                                        <div className="code-dot code-dot-yellow" />
                                                        <div className="code-dot code-dot-green" />
                                                    </div>
                                                    <span className="code-filename">{filename}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <span className="code-lang">{lang}</span>
                                                    <button className="code-copy-btn" onClick={() => copyCode(code)}>
                                                        {copiedCode === code ? (
                                                            <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20,6 9,17 4,12"/></svg> Copied</>
                                                        ) : (
                                                            <><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg> Copy</>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="code-content">
                                                <SyntaxHighlighter
                                                    style={isDark ? oneDark : oneLight}
                                                    language={lang}
                                                    PreTag="div"
                                                    customStyle={{ margin: 0, padding: 0, background: 'transparent', fontSize: '14px', lineHeight: '1.6', fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, monospace' }}
                                                >
                                                    {code}
                                                </SyntaxHighlighter>
                                            </div>
                                        </div>
                                    ) : (
                                        <code className={className} {...props}>{children}</code>
                                    );
                                }
                            }}
                        >
                            {post.content}
                        </ReactMarkdown>
                    </div>

                    {/* Tags footer */}
                    <div className="tags-footer">
                        <span className="tags-label">Tags:</span>
                        {post.tags.map((tag, i) => (
                            <span key={i} className="tag-link">#{tag}</span>
                        ))}
                    </div>

                    {/* Author bio card */}
                    <div className="author-card">
                        <img src={author.avatar} alt={author.name} className="author-card-avatar" onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/80'; }} />
                        <div className="author-card-content">
                            <h4 className="author-card-title">About {author.name.split(' ')[0]}</h4>
                            <p className="author-card-bio">{author.bio}</p>
                            <div className="author-card-actions">
                                <button onClick={copyEmail} className="author-card-btn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        {emailCopied ? (
                                            <polyline points="20 6 9 17 4 12" />
                                        ) : (
                                            <>
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                            </>
                                        )}
                                    </svg>
                                    {emailCopied ? 'Copied!' : 'Copy Email'}
                                </button>
                                <div className="author-card-divider" />
                                <a href="/dmitrii-fotesco-resume.pdf" target="_blank" rel="noopener noreferrer" className="author-card-btn">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    Resume
                                </a>
                                <div className="author-card-divider" />
                                <a href="https://calendar.google.com/calendar/u/0/appointments/AcZssZ2leGghBAF6F4IbGMZQErnaR21wvu-mYWXP06o=" target="_blank" rel="noopener noreferrer" className="author-card-btn author-card-btn-primary">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                    Book Time
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Prev/Next Navigation */}
                    {(prevPost || nextPost) && (
                        <nav className="post-nav">
                            {prevPost ? (
                                <Link to={`/blog/${prevPost.slug}`} className="post-nav-link prev">
                                    <span className="post-nav-label">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                                        Previous
                                    </span>
                                    <span className="post-nav-title">{prevPost.title}</span>
                                </Link>
                            ) : <div />}
                            {nextPost ? (
                                <Link to={`/blog/${nextPost.slug}`} className="post-nav-link next">
                                    <span className="post-nav-label">
                                        Next
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                                    </span>
                                    <span className="post-nav-title">{nextPost.title}</span>
                                </Link>
                            ) : <div />}
                        </nav>
                    )}
                </article>

                {/* More Thoughts */}
                {relatedPosts.length > 0 && (
                    <section className="more-thoughts">
                        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px' }}>
                            <h3 className="more-thoughts-title">More Thoughts</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '24px' }}>
                                {relatedPosts.map((relatedPost) => (
                                    <Link key={relatedPost.slug} to={`/blog/${relatedPost.slug}`} className="thought-card">
                                        <div className="thought-date">{formatDateShort(relatedPost.date)}</div>
                                        <h4 className="thought-title">{relatedPost.title}</h4>
                                        <span className="thought-cta">
                                            Read Article
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/></svg>
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </main>

            {/* Back to top */}
            <button className={`back-to-top ${showBackToTop ? 'visible' : ''}`} onClick={scrollToTop} title="Back to top">↑</button>

            {/* Toast */}
            <div className={`copy-toast ${showCopyToast ? 'visible' : ''}`}>Link copied to clipboard!</div>

            {/* Keyboard hints */}
            <div className="keyboard-hints">
                <span><span className="kbd">J</span> Next</span>
                <span><span className="kbd">K</span> Prev</span>
                <span><span className="kbd">Esc</span> Back</span>
            </div>
        </div>
    );
}
