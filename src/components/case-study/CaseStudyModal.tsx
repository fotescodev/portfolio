import type { CaseStudy } from '../../types/portfolio';
import CaseStudyHeader from './CaseStudyHeader';
import CaseStudyHero from './CaseStudyHero';
import CaseStudyMetrics from './CaseStudyMetrics';
import CaseStudyNarrative from './CaseStudyNarrative';
import CaseStudyResults from './CaseStudyResults';
import CaseStudyReflection from './CaseStudyReflection';
import CaseStudyFooter from './CaseStudyFooter';

interface CaseStudyModalProps {
    caseStudy: CaseStudy;
    allCaseStudies: CaseStudy[];
    onClose: () => void;
    onNavigate: (caseStudy: CaseStudy) => void;
    isMobile: boolean;
}

export default function CaseStudyModal({
    caseStudy,
    allCaseStudies,
    onClose,
    onNavigate,
    isMobile
}: CaseStudyModalProps) {
    const currentIndex = allCaseStudies.findIndex(c => c.id === caseStudy.id);
    const prevStudy = currentIndex > 0 ? allCaseStudies[currentIndex - 1] : null;
    const nextStudy = currentIndex < allCaseStudies.length - 1 ? allCaseStudies[currentIndex + 1] : null;

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 1000,
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--color-background)',
                animation: 'modalSlideUp 0.4s var(--ease-smooth)'
            }}
        >
            <style>{`
        .modal-scroll::-webkit-scrollbar { width: 6px; }
        .modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .modal-scroll::-webkit-scrollbar-thumb { background: var(--color-scrollbar-thumb); border-radius: 3px; }
        .modal-scroll { scrollbar-width: thin; scrollbar-color: var(--color-scrollbar-thumb) transparent; }
      `}</style>

            {/* 1. Header (Sticky) */}
            <CaseStudyHeader onClose={onClose} isMobile={isMobile} />

            {/* Content Scroll Container */}
            <div
                className="modal-scroll"
                style={{
                    flex: 1,
                    overflowY: 'auto'
                }}
            >
                {/* 2. Hero Section (Title + Context + [NEW] Image) */}
                <CaseStudyHero caseStudy={caseStudy} isMobile={isMobile} />

                {/* 3. Metrics (Full Width) */}
                <CaseStudyMetrics caseStudy={caseStudy} isMobile={isMobile} />

                {/* Main Content Container */}
                <div style={{
                    maxWidth: '680px',
                    margin: '0 auto',
                    padding: isMobile ? '0 20px var(--space-3xl)' : '0 var(--space-2xl) 80px'
                }}>
                    {/* 4. Narrative (Problem, Approach, Execution) */}
                    <CaseStudyNarrative caseStudy={caseStudy} isMobile={isMobile} />

                    {/* 5. Results (Stats & Quotes) */}
                    <CaseStudyResults caseStudy={caseStudy} />

                    {/* 6. Reflection (Lessons & What Worked) */}
                    <CaseStudyReflection caseStudy={caseStudy} isMobile={isMobile} />

                    {/* 7. Footer (Links, Stack, Nav) */}
                    <CaseStudyFooter
                        caseStudy={caseStudy}
                        prevStudy={prevStudy}
                        nextStudy={nextStudy}
                        onNavigate={onNavigate}
                    />
                </div>
            </div>
        </div>
    );
}
