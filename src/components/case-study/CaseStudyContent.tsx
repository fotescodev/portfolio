import type { CaseStudy } from '../../types/portfolio';

interface CaseStudyContentProps {
    caseStudy: CaseStudy;
    isMobile: boolean;
}

export default function CaseStudyContent({ caseStudy, isMobile }: CaseStudyContentProps) {
    const padding = isMobile ? 'var(--space-lg)' : 'var(--space-2xl)';

    // Check what content we have
    const hasStakes = caseStudy.problem?.stakes;
    const hasContext = caseStudy.problem?.businessContext;
    const hasHypothesis = caseStudy.approach?.hypothesis;
    const hasChosenPath = caseStudy.approach?.chosenPath;
    const hasKeyDecision = caseStudy.execution?.keyDecision;
    const hasReflection = caseStudy.reflection?.lessonLearned;

    return (
        <article style={{
            maxWidth: '640px',
            margin: '0 auto',
            padding: `0 ${padding}`
        }}>
            {/* Opening hook - the stakes */}
            {hasStakes && (
                <p style={{
                    fontSize: isMobile ? '18px' : '20px',
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    color: 'var(--color-text-primary)',
                    lineHeight: 1.6,
                    margin: '0 0 var(--space-2xl) 0'
                }}>
                    {caseStudy.problem.stakes}
                </p>
            )}

            {/* Context paragraph */}
            {hasContext && (
                <p style={{
                    fontSize: '16px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.8,
                    margin: '0 0 var(--space-2xl) 0'
                }}>
                    {caseStudy.problem.businessContext}
                </p>
            )}

            {/* The insight/hypothesis - key turning point */}
            {hasHypothesis && (
                <p style={{
                    fontSize: '16px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.8,
                    margin: '0 0 var(--space-2xl) 0'
                }}>
                    {caseStudy.approach.hypothesis}
                </p>
            )}

            {/* Key decision callout - minimal styling */}
            {hasKeyDecision && (
                <div style={{
                    margin: '0 0 var(--space-2xl) 0',
                    paddingLeft: 'var(--space-lg)',
                    borderLeft: '2px solid var(--color-accent)'
                }}>
                    <p style={{
                        fontSize: '15px',
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.7,
                        margin: '0 0 var(--space-xs) 0',
                        fontWeight: 500
                    }}>
                        {caseStudy.execution.keyDecision.title}
                    </p>
                    <p style={{
                        fontSize: '15px',
                        color: 'var(--color-text-tertiary)',
                        lineHeight: 1.7,
                        margin: 0
                    }}>
                        {caseStudy.execution.keyDecision.decision}
                        {caseStudy.execution.keyDecision.outcome && (
                            <span style={{ color: 'var(--color-text-secondary)' }}>
                                {' '}— {caseStudy.execution.keyDecision.outcome}
                            </span>
                        )}
                    </p>
                </div>
            )}

            {/* Solution approach */}
            {hasChosenPath && (
                <p style={{
                    fontSize: '16px',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.8,
                    margin: '0 0 var(--space-2xl) 0'
                }}>
                    {caseStudy.approach.chosenPath}
                </p>
            )}

            {/* Reflection/lesson - closing thought */}
            {hasReflection && (
                <p style={{
                    fontSize: '17px',
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.6,
                    margin: '0 0 var(--space-3xl) 0',
                    paddingTop: 'var(--space-xl)',
                    borderTop: '1px solid var(--color-border-light)'
                }}>
                    {caseStudy.reflection.lessonLearned}
                </p>
            )}
        </article>
    );
}
