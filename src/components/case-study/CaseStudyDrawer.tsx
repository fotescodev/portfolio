import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CaseStudy } from '../../types/portfolio';
import { caseStudies } from '../../lib/content';
import { useTheme } from '../../context/ThemeContext';
import CaseStudyHero from './CaseStudyHero';
import CaseStudyHeader from './CaseStudyHeader';
import CaseStudyMetrics from './CaseStudyMetrics';
import CaseStudyNarrative from './CaseStudyNarrative';
import CaseStudyResults from './CaseStudyResults';
import CaseStudyReflection from './CaseStudyReflection';
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
    const { colors } = useTheme();

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
                                background: 'rgba(0,0,0,0.4)',
                                backdropFilter: 'blur(4px)',
                                zIndex: 'var(--drawer-z-index)', // 200
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
                                width: isMobile ? '100%' : 'var(--drawer-width)', // 800px
                                height: '100%',
                                background: colors.background,
                                zIndex: 201, // Above backdrop
                                overflowY: 'auto',
                                boxShadow: '-10px 0 40px rgba(0,0,0,0.2)',
                                borderLeft: `1px solid ${colors.border}`
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

                            {/* Content Container */}
                            <div style={{ position: 'relative', paddingBottom: '80px' }}>

                                {/* Close Button (Floating) */}
                                <button
                                    onClick={onClose}
                                    style={{
                                        position: 'absolute',
                                        top: '24px',
                                        right: '24px',
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'rgba(0,0,0,0.5)',
                                        border: 'none',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        zIndex: 10,
                                        backdropFilter: 'blur(4px)',
                                        transition: 'transform 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
                                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                >
                                    ✕
                                </button>

                                <CaseStudyHero caseStudy={caseStudy} isMobile={isMobile} />

                                <div style={{ padding: isMobile ? '24px' : '48px 48px 0' }}>
                                    <CaseStudyHeader
                                        onClose={onClose}
                                        isMobile={isMobile}
                                    />

                                    <CaseStudyMetrics caseStudy={caseStudy} isMobile={isMobile} />

                                    <CaseStudyNarrative caseStudy={caseStudy} isMobile={isMobile} />

                                    <CaseStudyResults caseStudy={caseStudy} />

                                    <CaseStudyReflection caseStudy={caseStudy} isMobile={isMobile} />
                                </div>

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
