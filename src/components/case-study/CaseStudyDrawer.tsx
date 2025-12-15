import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CaseStudy } from '../../types/portfolio';
import { caseStudies } from '../../lib/content';
import CaseStudyHero from './CaseStudyHero';
import CaseStudyContent from './CaseStudyContent';
import CaseStudyOutcome from './CaseStudyOutcome';
import CaseStudyFooter from './CaseStudyFooter';
import SEO from '../common/SEO';

interface CaseStudyDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    caseStudy: CaseStudy | null;
    isMobile: boolean;
    onNavigate: (study: CaseStudy) => void;
}

export default function CaseStudyDrawer({ isOpen, onClose, caseStudy, isMobile, onNavigate }: CaseStudyDrawerProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!caseStudy) return null;

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={onClose}
                            style={{
                                position: 'fixed',
                                inset: 0,
                                background: 'var(--color-backdrop)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 'var(--drawer-z-index)',
                                cursor: 'pointer'
                            }}
                        />

                        {/* Drawer Panel */}
                        <motion.div
                            initial={isMobile ? { y: '100%' } : { x: '100%' }}
                            animate={isMobile ? { y: 0 } : { x: 0 }}
                            exit={isMobile ? { y: '100%' } : { x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                width: isMobile ? '100%' : 'var(--drawer-width)',
                                height: '100%',
                                background: 'var(--color-background)',
                                zIndex: 'calc(var(--drawer-z-index) + 1)',
                                overflowY: 'auto',
                                boxShadow: 'var(--shadow-drawer)',
                                borderLeft: '1px solid var(--color-border-light)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Dynamic SEO */}
                            <SEO
                                title={caseStudy.title}
                                description={caseStudy.hook.headline}
                                image={caseStudy.hook.thumbnail || undefined}
                                path={`?case-study=${caseStudy.id}`}
                            />

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                aria-label="Close case study"
                                style={{
                                    position: 'absolute',
                                    top: 'var(--space-lg)',
                                    right: 'var(--space-lg)',
                                    width: '40px',
                                    height: '40px',
                                    background: 'var(--color-surface-glass)',
                                    border: 'none',
                                    color: 'var(--color-text-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    zIndex: 10,
                                    backdropFilter: 'blur(4px)',
                                    transition: 'transform 0.2s ease',
                                    fontSize: '18px'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                            >
                                ✕
                            </button>

                            {/* Content */}
                            <div style={{ paddingBottom: 'var(--space-2xl)' }}>
                                {/* HERO: Title + Primary Metric + Meta */}
                                <CaseStudyHero caseStudy={caseStudy} isMobile={isMobile} />

                                {/* CONTENT: Problem → Discovery → Solution → Lessons */}
                                <CaseStudyContent caseStudy={caseStudy} isMobile={isMobile} />

                                {/* OUTCOME: Merged metrics/results */}
                                <CaseStudyOutcome caseStudy={caseStudy} isMobile={isMobile} />

                                {/* FOOTER: Testimonial + CTA + Nav */}
                                <CaseStudyFooter
                                    caseStudy={caseStudy}
                                    prevStudy={caseStudies.find(s => s.id === caseStudy.id - 1) || null}
                                    nextStudy={caseStudies.find(s => s.id === caseStudy.id + 1) || null}
                                    onNavigate={onNavigate}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
