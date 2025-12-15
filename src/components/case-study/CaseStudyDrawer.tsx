import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CaseStudy } from '../../types/portfolio';
import { caseStudies } from '../../lib/content';
import CaseStudyHero from './CaseStudyHero';
import CaseStudyContent from './CaseStudyContent';
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
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showStickyHeader, setShowStickyHeader] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Reset scroll position when opening
            if (scrollRef.current) {
                scrollRef.current.scrollTop = 0;
            }
            setShowStickyHeader(false);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, caseStudy]);

    // Handle ESC key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Track scroll for sticky header
    const handleScroll = () => {
        if (scrollRef.current) {
            setShowStickyHeader(scrollRef.current.scrollTop > 120);
        }
    };

    if (!caseStudy) return null;

    return (
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
                            backdropFilter: 'blur(8px)',
                            zIndex: 'var(--drawer-z-index)',
                            cursor: 'pointer'
                        }}
                    />

                    {/* Drawer Panel */}
                    <motion.div
                        ref={scrollRef}
                        initial={isMobile ? { y: '100%' } : { x: '100%' }}
                        animate={isMobile ? { y: 0 } : { x: 0 }}
                        exit={isMobile ? { y: '100%' } : { x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        onScroll={handleScroll}
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
                            overflowX: 'hidden',
                            boxShadow: 'var(--shadow-drawer)',
                            borderLeft: isMobile ? 'none' : '1px solid var(--color-border-light)'
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

                        {/* Sticky Header - appears on scroll */}
                        <motion.div
                            initial={false}
                            animate={{
                                y: showStickyHeader ? 0 : -60,
                                opacity: showStickyHeader ? 1 : 0
                            }}
                            transition={{ duration: 0.2 }}
                            style={{
                                position: 'sticky',
                                top: 0,
                                left: 0,
                                right: 0,
                                height: '56px',
                                background: 'var(--color-background)',
                                borderBottom: '1px solid var(--color-border-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0 var(--space-lg)',
                                zIndex: 20,
                                pointerEvents: showStickyHeader ? 'auto' : 'none'
                            }}
                        >
                            <span style={{
                                fontSize: '14px',
                                fontFamily: 'var(--font-serif)',
                                fontStyle: 'italic',
                                color: 'var(--color-text-secondary)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                                maxWidth: 'calc(100% - 50px)'
                            }}>
                                {caseStudy.title}
                            </span>
                            <button
                                onClick={onClose}
                                aria-label="Close"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-text-tertiary)',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                ✕
                            </button>
                        </motion.div>

                        {/* Fixed Close Button (when not scrolled) */}
                        <motion.button
                            onClick={onClose}
                            aria-label="Close case study"
                            animate={{ opacity: showStickyHeader ? 0 : 1 }}
                            style={{
                                position: 'absolute',
                                top: 'var(--space-lg)',
                                right: 'var(--space-lg)',
                                width: '40px',
                                height: '40px',
                                background: 'var(--color-surface-glass)',
                                border: '1px solid var(--color-border-light)',
                                borderRadius: '50%',
                                color: 'var(--color-text-secondary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                zIndex: 15,
                                backdropFilter: 'blur(8px)',
                                transition: 'all 0.2s ease',
                                fontSize: '16px',
                                pointerEvents: showStickyHeader ? 'none' : 'auto'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'var(--color-surface-glass-strong)';
                                e.currentTarget.style.color = 'var(--color-text-primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'var(--color-surface-glass)';
                                e.currentTarget.style.color = 'var(--color-text-secondary)';
                            }}
                        >
                            ✕
                        </motion.button>

                        {/* Content */}
                        <div style={{
                            marginTop: showStickyHeader ? '-56px' : 0,
                            paddingBottom: 'var(--space-3xl)'
                        }}>
                            {/* HERO: Title + Primary Metric + Meta */}
                            <CaseStudyHero caseStudy={caseStudy} isMobile={isMobile} />

                            {/* CONTENT: Markdown narrative */}
                            <CaseStudyContent caseStudy={caseStudy} isMobile={isMobile} />

                            {/* FOOTER: CTA + Nav */}
                            <CaseStudyFooter
                                caseStudy={caseStudy}
                                prevStudy={caseStudies.find(s => s.id === caseStudy.id - 1) || null}
                                nextStudy={caseStudies.find(s => s.id === caseStudy.id + 1) || null}
                                onNavigate={onNavigate}
                                isMobile={isMobile}
                            />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
