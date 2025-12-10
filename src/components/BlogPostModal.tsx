import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { BlogPost } from '../types/blog';

interface BlogPostModalProps {
    post: BlogPost;
    onClose: () => void;
    onNavigate?: (direction: 'prev' | 'next') => void;
    hasPrev?: boolean;
    hasNext?: boolean;
    prevTitle?: string;
    nextTitle?: string;
    isMobile: boolean;
}

export default function BlogPostModal({
    post,
    onClose,
    onNavigate,
    hasPrev,
    hasNext,
    prevTitle,
    nextTitle,
    isMobile
}: BlogPostModalProps) {
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

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                background: '#08080a',
                animation: 'modalSlideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
        >
            {/* Modal styles */}
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
          background: rgba(232, 230, 227, 0.15);
          border-radius: 3px;
        }
        
        .blog-modal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(232, 230, 227, 0.25);
        }
        
        .blog-modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(232, 230, 227, 0.15) transparent;
        }

        .blog-content h1 {
          font-size: ${isMobile ? '28px' : '36px'};
          font-family: 'Instrument Serif', Georgia, serif;
          font-weight: 400;
          font-style: italic;
          color: #e8e6e3;
          margin: 40px 0 20px;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }

        .blog-content h2 {
          font-size: ${isMobile ? '22px' : '26px'};
          font-family: 'Instrument Serif', Georgia, serif;
          font-weight: 400;
          font-style: italic;
          color: #e8e6e3;
          margin: 36px 0 16px;
          letter-spacing: -0.02em;
          line-height: 1.3;
        }

        .blog-content h3 {
          font-size: ${isMobile ? '18px' : '20px'};
          font-weight: 600;
          color: #e8e6e3;
          margin: 28px 0 12px;
          line-height: 1.4;
        }

        .blog-content p {
          font-size: ${isMobile ? '16px' : '17px'};
          color: #a8a5a0;
          line-height: 1.8;
          margin: 0 0 20px;
        }

        .blog-content ul, .blog-content ol {
          margin: 0 0 20px;
          padding-left: 24px;
          color: #a8a5a0;
        }

        .blog-content li {
          font-size: ${isMobile ? '16px' : '17px'};
          line-height: 1.8;
          margin-bottom: 8px;
        }

        .blog-content a {
          color: #c29a6c;
          text-decoration: none;
          transition: opacity 0.2s ease;
        }

        .blog-content a:hover {
          opacity: 0.8;
        }

        .blog-content strong {
          color: #e8e6e3;
          font-weight: 600;
        }

        .blog-content em {
          font-style: italic;
        }

        .blog-content blockquote {
          border-left: 3px solid #c29a6c;
          margin: 24px 0;
          padding: 16px 24px;
          background: rgba(194, 154, 108, 0.05);
        }

        .blog-content blockquote p {
          margin: 0;
          font-style: italic;
        }

        .blog-content hr {
          border: none;
          height: 1px;
          background: rgba(232, 230, 227, 0.1);
          margin: 40px 0;
        }

        .blog-content pre {
          margin: 24px 0;
          border-radius: 0;
          border: 1px solid rgba(232, 230, 227, 0.1);
        }

        .blog-content code:not([class*="language-"]) {
          background: rgba(232, 230, 227, 0.08);
          padding: 2px 6px;
          font-size: 0.9em;
          color: #c29a6c;
        }
      `}</style>

            {/* Modal Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: isMobile ? '20px 24px' : '28px 64px',
                borderBottom: '1px solid rgba(232, 230, 227, 0.08)',
                background: '#08080a',
                position: 'sticky',
                top: 0,
                zIndex: 10
            }}>
                <button
                    onClick={onClose}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'none',
                        border: 'none',
                        color: '#6b6966',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        padding: 0,
                        fontFamily: "'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif",
                        transition: 'color 0.2s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#e8e6e3'}
                    onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.color = '#6b6966'}
                >
                    <span style={{ fontFamily: "'Instrument Serif', serif", fontStyle: 'italic' }}>←</span>
                    Back to Blog
                </button>

                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: '1px solid rgba(232, 230, 227, 0.1)',
                        color: '#6b6966',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(232, 230, 227, 0.3)';
                        (e.currentTarget as HTMLButtonElement).style.color = '#e8e6e3';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(232, 230, 227, 0.1)';
                        (e.currentTarget as HTMLButtonElement).style.color = '#6b6966';
                    }}
                >
                    ✕
                </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div
                className="blog-modal-scroll"
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: isMobile ? '40px 24px' : '64px',
                    maxWidth: '800px',
                    margin: '0 auto',
                    width: '100%'
                }}
            >
                {/* Header */}
                <div style={{ marginBottom: '40px' }}>
                    <div style={{
                        fontSize: '13px',
                        color: '#6b6966',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <span>{formatDate(post.date)}</span>
                        <span style={{ color: '#3a3a3c' }}>•</span>
                        <span>{post.readingTime} min read</span>
                    </div>

                    <h1 style={{
                        fontSize: isMobile ? '32px' : '48px',
                        fontFamily: "'Instrument Serif', Georgia, serif",
                        fontWeight: 400,
                        fontStyle: 'italic',
                        color: '#e8e6e3',
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
                                color: '#4a4a4c',
                                padding: '6px 12px',
                                border: '1px solid rgba(232, 230, 227, 0.08)'
                            }}>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Hero Image */}
                {post.thumbnail && (
                    <div style={{
                        aspectRatio: '16/9',
                        marginBottom: '48px',
                        background: 'linear-gradient(135deg, #141416 0%, #1a1a1c 100%)',
                        border: '1px solid rgba(232, 230, 227, 0.06)',
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
                <div className="blog-content">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            code({ className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || '');
                                const isInline = !match;
                                return !isInline ? (
                                    <SyntaxHighlighter
                                        style={oneDark}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{
                                            margin: '24px 0',
                                            borderRadius: 0,
                                            border: '1px solid rgba(232, 230, 227, 0.1)',
                                            background: '#141416'
                                        }}
                                    >
                                        {String(children).replace(/\n$/, '')}
                                    </SyntaxHighlighter>
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
                        marginTop: '64px',
                        paddingTop: '32px',
                        borderTop: '1px solid rgba(232, 230, 227, 0.08)',
                        gap: '24px',
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
                                    fontFamily: "'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif"
                                }}
                            >
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    color: '#4a4a4c',
                                    display: 'block',
                                    marginBottom: '8px'
                                }}>← Previous</span>
                                <span style={{
                                    fontSize: '16px',
                                    fontFamily: "'Instrument Serif', Georgia, serif",
                                    fontStyle: 'italic',
                                    color: '#a8a5a0'
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
                                    fontFamily: "'Instrument Sans', -apple-system, BlinkMacSystemFont, sans-serif"
                                }}
                            >
                                <span style={{
                                    fontSize: '11px',
                                    fontWeight: 500,
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    color: '#4a4a4c',
                                    display: 'block',
                                    marginBottom: '8px'
                                }}>Next →</span>
                                <span style={{
                                    fontSize: '16px',
                                    fontFamily: "'Instrument Serif', Georgia, serif",
                                    fontStyle: 'italic',
                                    color: '#a8a5a0'
                                }}>{nextTitle}</span>
                            </button>
                        ) : <div style={{ flex: 1 }} />}
                    </div>
                )}
            </div>
        </div>
    );
}
