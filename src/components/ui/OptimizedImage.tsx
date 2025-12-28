/**
 * OptimizedImage Component
 *
 * Wrapper for responsive images with:
 * - Native lazy loading
 * - Aspect ratio preservation (prevents CLS)
 * - Blur placeholder effect
 * - Accessibility attributes
 *
 * For full srcSet/WebP optimization, import images with vite-imagetools:
 * import heroWebp from '../assets/hero.jpg?w=640;1024;1920&format=webp&as=srcset'
 * import heroFallback from '../assets/hero.jpg?w=1024'
 *
 * Then use with <picture> element for format fallback.
 */

import { useState, useRef, useEffect } from 'react';
import type { CSSProperties } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  sizes?: string;
  srcSet?: string;
  className?: string;
  style?: CSSProperties;
  priority?: boolean; // Skip lazy loading for above-fold images
  aspectRatio?: string; // e.g., "16/9", "4/3", "1/1"
  objectFit?: 'cover' | 'contain' | 'fill' | 'none';
  placeholder?: 'blur' | 'none';
  blurDataURL?: string; // Base64 tiny image for blur placeholder
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  sizes = '100vw',
  srcSet,
  className = '',
  style = {},
  priority = false,
  aspectRatio,
  objectFit = 'cover',
  placeholder = 'none',
  blurDataURL,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  // Intersection observer for lazy loading trigger
  useEffect(() => {
    if (priority || !imgRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '50px' } // Start loading slightly before visible
    );

    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  const containerStyle: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...(aspectRatio && { aspectRatio }),
    ...style,
  };

  const imgStyle: CSSProperties = {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit,
    transition: 'opacity 0.3s ease-in-out',
    opacity: placeholder === 'blur' && !isLoaded ? 0 : 1,
  };

  const placeholderStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundImage: blurDataURL ? `url(${blurDataURL})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(20px)',
    transform: 'scale(1.1)', // Prevent blur edge artifacts
    opacity: isLoaded ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
  };

  return (
    <div className={className} style={containerStyle}>
      {/* Blur placeholder */}
      {placeholder === 'blur' && blurDataURL && (
        <div style={placeholderStyle} aria-hidden="true" />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={isInView ? src : undefined}
        srcSet={isInView ? srcSet : undefined}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={() => setIsLoaded(true)}
        style={imgStyle}
      />
    </div>
  );
}

/**
 * Picture component for format fallbacks (WebP/AVIF with JPG fallback)
 *
 * Usage:
 * <OptimizedPicture
 *   sources={[
 *     { srcSet: avifSrcSet, type: 'image/avif' },
 *     { srcSet: webpSrcSet, type: 'image/webp' },
 *   ]}
 *   src={fallbackJpg}
 *   alt="Description"
 * />
 */
interface PictureSource {
  srcSet: string;
  type: 'image/avif' | 'image/webp' | 'image/jpeg' | 'image/png';
  sizes?: string;
}

interface OptimizedPictureProps extends Omit<OptimizedImageProps, 'srcSet'> {
  sources: PictureSource[];
}

export function OptimizedPicture({
  sources,
  src,
  alt,
  sizes = '100vw',
  className = '',
  style = {},
  priority = false,
  aspectRatio,
  objectFit = 'cover',
  width,
  height,
}: OptimizedPictureProps) {
  const containerStyle: CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    ...(aspectRatio && { aspectRatio }),
    ...style,
  };

  const imgStyle: CSSProperties = {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit,
  };

  return (
    <picture className={className} style={containerStyle}>
      {sources.map((source, index) => (
        <source
          key={index}
          srcSet={source.srcSet}
          type={source.type}
          sizes={source.sizes || sizes}
        />
      ))}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        style={imgStyle}
      />
    </picture>
  );
}

export default OptimizedImage;
