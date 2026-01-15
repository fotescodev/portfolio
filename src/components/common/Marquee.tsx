import type { ReactNode } from 'react';

interface MarqueeProps {
    children: ReactNode;
    direction?: 'left' | 'right';
    speed?: 'slow' | 'normal' | 'fast';
    className?: string;
}

// Calculate animation duration based on speed
function getAnimationDuration(speed: MarqueeProps['speed']) {
    switch (speed) {
        case 'slow': return '45s';
        case 'fast': return '20s';
        default: return '30s';
    }
}

export default function Marquee({
    children,
    direction = 'left',
    speed = 'normal',
    className = ''
}: MarqueeProps) {
    const duration = getAnimationDuration(speed);
    const animationName = direction === 'left' ? 'marquee' : 'marqueeReverse';

    return (
        <div className={`marquee-container ${className}`}>
            <div
                className="marquee-track"
                style={{
                    animation: `${animationName} ${duration} linear infinite`
                }}
            >
                {/* Repeat content 4x for seamless loop */}
                {children}
                {children}
                {children}
                {children}
            </div>
        </div>
    );
}

// Pre-styled marquee items for common use cases
export function MarqueeText({
    children,
    variant = 'default'
}: {
    children: ReactNode;
    variant?: 'default' | 'serif' | 'outline';
}) {
    const variantClass = variant === 'default' ? '' : variant;
    return <span className={`marquee-text ${variantClass}`}>{children}</span>;
}

export function MarqueeSeparator() {
    return <span className="marquee-separator" />;
}

// Complete marquee item with text and separator
export function MarqueeItem({ children }: { children: ReactNode }) {
    return (
        <div className="marquee-item">
            {children}
            <MarqueeSeparator />
        </div>
    );
}
