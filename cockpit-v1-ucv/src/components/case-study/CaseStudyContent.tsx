import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { CaseStudy } from '../../types/portfolio';
import { useTheme } from '../../context/ThemeContext';

interface CaseStudyContentProps {
    caseStudy: CaseStudy;
    isMobile: boolean;
}

export default function CaseStudyContent({ caseStudy, isMobile }: CaseStudyContentProps) {
    const padding = isMobile ? 'var(--space-lg)' : 'var(--space-2xl)';
    const { isDark } = useTheme();

    return (
        <article style={{
            maxWidth: 'var(--drawer-content-max-width)',
            margin: '0 auto',
            padding: `0 ${padding}`
        }}>
            {/* Markdown content styles */}
            <style>{`
                .case-study-content h1 {
                    font-size: ${isMobile ? '28px' : '36px'};
                    font-family: var(--font-serif);
                    font-weight: 400;
                    font-style: italic;
                    color: var(--color-text-primary);
                    margin: 40px 0 20px;
                    letter-spacing: -0.02em;
                    line-height: 1.2;
                }

                .case-study-content h2 {
                    font-size: ${isMobile ? '22px' : '26px'};
                    font-family: var(--font-serif);
                    font-weight: 400;
                    font-style: italic;
                    color: var(--color-text-primary);
                    margin: 36px 0 16px;
                    letter-spacing: -0.02em;
                    line-height: 1.3;
                }

                .case-study-content h3 {
                    font-size: ${isMobile ? '18px' : '20px'};
                    font-weight: 600;
                    color: var(--color-text-primary);
                    margin: 28px 0 12px;
                    line-height: 1.4;
                }

                .case-study-content p {
                    font-size: ${isMobile ? '16px' : '17px'};
                    color: var(--color-text-secondary);
                    line-height: 1.8;
                    margin: 0 0 20px;
                }

                .case-study-content ul, .case-study-content ol {
                    margin: 0 0 20px;
                    padding-left: 24px;
                    color: var(--color-text-secondary);
                }

                .case-study-content li {
                    font-size: ${isMobile ? '16px' : '17px'};
                    line-height: 1.8;
                    margin-bottom: 8px;
                }

                .case-study-content a {
                    color: var(--color-accent);
                    text-decoration: none;
                    transition: opacity 0.2s ease;
                }

                .case-study-content a:hover {
                    opacity: 0.8;
                }

                .case-study-content strong {
                    color: var(--color-text-primary);
                    font-weight: 600;
                }

                .case-study-content em {
                    font-style: italic;
                }

                .case-study-content blockquote {
                    border-left: 3px solid var(--color-accent);
                    margin: 24px 0;
                    padding: 16px 24px;
                    background: var(--color-tag-hover);
                }

                .case-study-content blockquote p {
                    margin: 0;
                    font-family: var(--font-serif);
                    font-style: italic;
                    color: var(--color-text-secondary);
                }

                .case-study-content hr {
                    border: none;
                    height: 1px;
                    background: var(--color-border);
                    margin: 40px 0;
                }

                .case-study-content pre {
                    margin: 24px 0;
                    border-radius: 0;
                    border: 1px solid var(--color-border);
                }

                .case-study-content code:not([class*="language-"]) {
                    background: var(--color-border-light);
                    padding: 2px 6px;
                    font-size: 0.9em;
                    color: var(--color-accent);
                }

                .case-study-content img {
                    max-width: 100%;
                    height: auto;
                    margin: 24px 0;
                    border: 1px solid var(--color-border-light);
                }

                .case-study-content table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 24px 0;
                    font-size: 15px;
                }

                .case-study-content th,
                .case-study-content td {
                    border: 1px solid var(--color-border);
                    padding: 12px 16px;
                    text-align: left;
                }

                .case-study-content th {
                    background: var(--color-tag-hover);
                    color: var(--color-text-primary);
                    font-weight: 600;
                }

                .case-study-content td {
                    color: var(--color-text-secondary);
                }
            `}</style>

            <div className="case-study-content">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            const isInline = !match;
                            return !isInline ? (
                                <SyntaxHighlighter
                                    style={isDark ? oneDark : oneLight}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{
                                        margin: '24px 0',
                                        borderRadius: 0,
                                        border: '1px solid var(--color-border)',
                                        background: 'var(--color-code-bg)'
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
                    {caseStudy.content}
                </ReactMarkdown>
            </div>
        </article>
    );
}
