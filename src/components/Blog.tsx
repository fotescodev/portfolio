import { useState } from 'react';
import type { BlogPost } from '../types/blog';
import BlogPostModal from './BlogPostModal';

// Import blog posts statically (we'll parse these)
import aiAgentsPost from '../../content/blog/2024-12-01-ai-agents-meet-onchain.md?raw';
import stakingPost from '../../content/blog/2024-11-15-etf-grade-staking.md?raw';

interface BlogProps {
    isMobile: boolean;
    isTablet: boolean;
}

// Parse frontmatter from markdown
function parseFrontmatter(raw: string): { frontmatter: Record<string, unknown>; content: string } {
    const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return { frontmatter: {}, content: raw };

    const frontmatterStr = match[1];
    const content = match[2];

    const frontmatter: Record<string, unknown> = {};
    const lines = frontmatterStr.split('\n');

    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex === -1) continue;

        const key = line.slice(0, colonIndex).trim();
        let value = line.slice(colonIndex + 1).trim();

        // Handle arrays
        if (value.startsWith('[') && value.endsWith(']')) {
            const arrayContent = value.slice(1, -1);
            frontmatter[key] = arrayContent.split(',').map(item =>
                item.trim().replace(/^["']|["']$/g, '')
            );
        }
        // Handle quoted strings
        else if (value.startsWith('"') && value.endsWith('"')) {
            frontmatter[key] = value.slice(1, -1);
        }
        // Handle null
        else if (value === 'null') {
            frontmatter[key] = null;
        }
        // Regular string
        else {
            frontmatter[key] = value;
        }
    }

    return { frontmatter, content };
}

// Calculate reading time
function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

// Parse all blog posts
function parseBlogPosts(): BlogPost[] {
    const posts = [
        { raw: aiAgentsPost, slug: 'ai-agents-meet-onchain' },
        { raw: stakingPost, slug: 'etf-grade-staking' },
    ];

    return posts.map(({ raw, slug }) => {
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
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function Blog({ isMobile, isTablet }: BlogProps) {
    const [hoveredPost, setHoveredPost] = useState<string | null>(null);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const posts = parseBlogPosts();

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit'
        }).replace(/\//g, '.');
    };

    const handleNavigate = (direction: 'prev' | 'next') => {
        if (!selectedPost) return;
        const currentIndex = posts.findIndex(p => p.slug === selectedPost.slug);
        const newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex >= 0 && newIndex < posts.length) {
            setSelectedPost(posts[newIndex]);
        }
    };

    const sectionPadding = isMobile ? '48px 24px' : isTablet ? '64px 40px' : '80px 64px';

    return (
        <>
            <section id="blog" style={{
                padding: sectionPadding,
                maxWidth: '1400px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Section label */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '24px',
                    marginBottom: isMobile ? '32px' : '40px'
                }}>
                    <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: '#4a4a4c'
                    }}>
                        Insights
                    </span>
                    <div style={{
                        flex: 1,
                        height: '1px',
                        background: 'rgba(232, 230, 227, 0.08)'
                    }} />
                </div>

                {/* Section header */}
                <div style={{
                    marginBottom: isMobile ? '32px' : '48px'
                }}>
                    <h2 style={{
                        fontSize: isMobile ? '28px' : isTablet ? '36px' : '42px',
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontWeight: 400,
                        fontStyle: 'italic',
                        color: '#e8e6e3',
                        marginBottom: '16px',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2
                    }}>
                        Thoughts on building at the edge
                    </h2>
                    <p style={{
                        fontSize: '15px',
                        color: '#6b6966',
                        maxWidth: '600px',
                        lineHeight: 1.6
                    }}>
                        Reflections on product management, crypto infrastructure, and the intersection of AI with on-chain execution.
                    </p>
                </div>

                {/* Blog posts list */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0'
                }}>
                    {posts.map((post, index) => (
                        <article
                            key={post.slug}
                            style={{
                                borderTop: index === 0 ? '1px solid rgba(232, 230, 227, 0.1)' : 'none',
                                borderBottom: '1px solid rgba(232, 230, 227, 0.1)',
                                padding: isMobile ? '28px 0' : '36px 0',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                background: hoveredPost === post.slug ? 'rgba(194, 154, 108, 0.02)' : 'transparent'
                            }}
                            onMouseEnter={() => !isMobile && setHoveredPost(post.slug)}
                            onMouseLeave={() => !isMobile && setHoveredPost(null)}
                            onClick={() => setSelectedPost(post)}
                        >
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : isTablet ? '120px 1fr' : '140px 1fr auto',
                                gap: isMobile ? '16px' : '32px',
                                alignItems: 'start'
                            }}>
                                {/* Date */}
                                <div style={{
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    letterSpacing: '0.05em',
                                    color: '#4a4a4c',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                }}>
                                    <span>{formatDate(post.date)}</span>
                                    <span style={{ color: '#3a3a3c' }}>•</span>
                                    <span>{post.readingTime} min</span>
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 style={{
                                        fontSize: isMobile ? '22px' : '26px',
                                        fontFamily: "'Instrument Serif', Georgia, serif",
                                        fontWeight: 400,
                                        fontStyle: 'italic',
                                        color: '#e8e6e3',
                                        marginBottom: '12px',
                                        letterSpacing: '-0.02em',
                                        lineHeight: 1.2,
                                        transition: 'color 0.2s ease'
                                    }}>
                                        {post.title}
                                    </h3>

                                    <p style={{
                                        fontSize: '14px',
                                        color: '#6b6966',
                                        lineHeight: 1.6,
                                        marginBottom: '16px',
                                        maxWidth: '600px'
                                    }}>
                                        {post.excerpt}
                                    </p>

                                    {/* Tags */}
                                    <div style={{
                                        display: 'flex',
                                        gap: '8px',
                                        flexWrap: 'wrap'
                                    }}>
                                        {post.tags.map((tag, i) => (
                                            <span key={i} style={{
                                                fontSize: '10px',
                                                fontWeight: 500,
                                                letterSpacing: '0.05em',
                                                textTransform: 'uppercase',
                                                color: '#4a4a4c',
                                                padding: '4px 8px',
                                                border: '1px solid rgba(232, 230, 227, 0.08)',
                                                transition: 'all 0.2s ease',
                                                background: hoveredPost === post.slug ? 'rgba(194, 154, 108, 0.05)' : 'transparent'
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Read link - desktop only */}
                                {!isMobile && !isTablet && (
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: hoveredPost === post.slug ? '#c29a6c' : '#4a4a4c',
                                        transition: 'color 0.2s ease',
                                        alignSelf: 'center'
                                    }}>
                                        <span style={{
                                            fontSize: '13px',
                                            fontWeight: 500,
                                            letterSpacing: '0.02em'
                                        }}>
                                            Read
                                        </span>
                                        <span style={{
                                            transform: hoveredPost === post.slug ? 'translateX(4px)' : 'translateX(0)',
                                            transition: 'transform 0.2s ease',
                                            fontFamily: "'Instrument Serif', serif",
                                            fontStyle: 'italic'
                                        }}>→</span>
                                    </div>
                                )}
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Blog Post Modal */}
            {selectedPost && (
                <BlogPostModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                    onNavigate={handleNavigate}
                    hasPrev={posts.findIndex(p => p.slug === selectedPost.slug) > 0}
                    hasNext={posts.findIndex(p => p.slug === selectedPost.slug) < posts.length - 1}
                    prevTitle={posts[posts.findIndex(p => p.slug === selectedPost.slug) - 1]?.title}
                    nextTitle={posts[posts.findIndex(p => p.slug === selectedPost.slug) + 1]?.title}
                    isMobile={isMobile}
                />
            )}
        </>
    );
}
