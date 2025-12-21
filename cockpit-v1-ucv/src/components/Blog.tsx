import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../types/blog';

// Auto-discover blog posts using import.meta.glob
const blogPostFiles = import.meta.glob('../../content/blog/*.md', { query: '?raw', eager: true });

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

// Extract slug from filename (YYYY-MM-DD-slug.md → slug)
function extractSlugFromFilename(path: string): string {
    const filename = path.split('/').pop() || '';
    // Remove .md extension and date prefix (YYYY-MM-DD-)
    return filename.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
}

// Parse all blog posts (auto-discovered)
function parseBlogPosts(): BlogPost[] {
    const posts = Object.entries(blogPostFiles).map(([path, module]) => {
        const raw = (module as any).default as string;
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
    });

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default function Blog({ isMobile, isTablet }: BlogProps) {
    const [hoveredPost, setHoveredPost] = useState<string | null>(null);

    const posts = parseBlogPosts().slice(0, 2);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: '2-digit'
        }).replace(/\//g, '.');
    };

    const sectionPadding = isMobile ? '48px 24px' : isTablet ? '64px 40px' : '80px 64px';

    return (
        <>
            <section id="blog" style={{
                padding: sectionPadding,
                maxWidth: 'var(--layout-max-width)',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Section label */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-lg)',
                    marginBottom: isMobile ? 'var(--space-xl)' : '40px'
                }}>
                    <span style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--color-text-muted)'
                    }}>
                        Insights
                    </span>
                    <div style={{
                        flex: 1,
                        height: '1px',
                        background: 'var(--color-border-light)'
                    }} />
                </div>

                {/* Section header */}
                <div style={{
                    marginBottom: isMobile ? 'var(--space-xl)' : 'var(--space-2xl)'
                }}>
                    <h2 style={{
                        fontSize: isMobile ? '28px' : isTablet ? '36px' : '42px',
                        fontFamily: 'var(--font-serif)',
                        fontWeight: 400,
                        fontStyle: 'italic',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--space-md)',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2
                    }}>
                        Thoughts on building at the edge
                    </h2>
                    <p style={{
                        fontSize: '15px',
                        color: 'var(--color-text-tertiary)',
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
                        <Link
                            key={post.slug}
                            to={`/blog/${post.slug}`}
                            style={{ textDecoration: 'none', display: 'block' }}
                        >
                        <article
                            style={{
                                borderTop: index === 0 ? '1px solid var(--color-border)' : 'none',
                                borderBottom: '1px solid var(--color-border)',
                                padding: isMobile ? '28px 0' : '36px 0',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                background: hoveredPost === post.slug ? 'var(--color-card-hover)' : 'transparent'
                            }}
                            onMouseEnter={() => !isMobile && setHoveredPost(post.slug)}
                            onMouseLeave={() => !isMobile && setHoveredPost(null)}
                        >
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: isMobile ? '1fr' : isTablet ? '120px 1fr' : '140px 1fr auto',
                                gap: isMobile ? 'var(--space-md)' : 'var(--space-xl)',
                                alignItems: 'start'
                            }}>
                                {/* Date */}
                                <div style={{
                                    fontSize: '12px',
                                    fontWeight: 500,
                                    letterSpacing: '0.05em',
                                    color: 'var(--color-text-muted)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 'var(--space-sm)'
                                }}>
                                    <span>{formatDate(post.date)}</span>
                                    <span style={{ color: 'var(--color-separator)' }}>•</span>
                                    <span>{post.readingTime} min</span>
                                </div>

                                {/* Content */}
                                <div>
                                    <h3 style={{
                                        fontSize: isMobile ? '22px' : '26px',
                                        fontFamily: 'var(--font-serif)',
                                        fontWeight: 400,
                                        fontStyle: 'italic',
                                        color: 'var(--color-text-primary)',
                                        marginBottom: 'var(--space-sm)',
                                        letterSpacing: '-0.02em',
                                        lineHeight: 1.2,
                                        transition: 'color 0.2s ease'
                                    }}>
                                        {post.title}
                                    </h3>

                                    <p style={{
                                        fontSize: '14px',
                                        color: 'var(--color-text-tertiary)',
                                        lineHeight: 1.6,
                                        marginBottom: 'var(--space-md)',
                                        maxWidth: '600px'
                                    }}>
                                        {post.excerpt}
                                    </p>

                                    {/* Tags */}
                                    <div style={{
                                        display: 'flex',
                                        gap: 'var(--space-sm)',
                                        flexWrap: 'wrap'
                                    }}>
                                        {post.tags.map((tag, i) => (
                                            <span key={i} style={{
                                                fontSize: '10px',
                                                fontWeight: 500,
                                                letterSpacing: '0.05em',
                                                textTransform: 'uppercase',
                                                color: 'var(--color-text-muted)',
                                                padding: '4px 8px',
                                                border: '1px solid var(--color-border-light)',
                                                transition: 'all 0.2s ease',
                                                background: hoveredPost === post.slug ? 'var(--color-tag-hover)' : 'transparent'
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
                                        gap: 'var(--space-sm)',
                                        color: hoveredPost === post.slug ? 'var(--color-accent)' : 'var(--color-text-muted)',
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
                                            fontFamily: 'var(--font-serif)',
                                            fontStyle: 'italic'
                                        }}>→</span>
                                    </div>
                                )}
                            </div>
                        </article>
                        </Link>
                    ))}
                </div>
            </section>
        </>
    );
}
