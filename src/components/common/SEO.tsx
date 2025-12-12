import { Helmet } from 'react-helmet-async';
import { profile } from '../../lib/content';

interface SEOProps {
    title?: string;
    description?: string;
    image?: string;
    path?: string;
}

export default function SEO({
    title,
    description,
    image,
    path = ''
}: SEOProps) {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://dfotesco.com'; // Fallback

    // Defaults from profile
    const defaultTitle = profile.name;
    const defaultDescription = profile.hero.subheadline;
    const defaultImage = `${siteUrl}/linkedin-banner-wide.png`;

    const metaTitle = title ? `${profile.name} | ${title}` : defaultTitle;
    const metaDescription = description || defaultDescription;
    const metaImage = image ? (image.startsWith('http') ? image : `${siteUrl}${image}`) : defaultImage;
    const metaUrl = `${siteUrl}${path}`;

    return (
        <Helmet>
            {/* Basic */}
            <title>{metaTitle}</title>
            <meta name="description" content={metaDescription} />

            {/* Open Graph */}
            <meta property="og:title" content={metaTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={profile.name} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={metaTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />
        </Helmet>
    );
}
