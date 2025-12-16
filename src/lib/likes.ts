/**
 * Blog Post Likes System
 *
 * Manages like functionality with client-side persistence and tracking.
 * Stores like data in localStorage with user tracking information.
 */

export interface LikeData {
    postSlug: string;
    count: number;
    timestamp: number;
    userFingerprint: string;
}

export interface UserLike {
    postSlug: string;
    timestamp: number;
    userAgent: string;
    fingerprintHash: string;
}

const LIKES_STORAGE_KEY = 'blog-post-likes';
const USER_LIKES_KEY = 'user-likes';
const USER_FINGERPRINT_KEY = 'user-fingerprint';

/**
 * Generate a simple fingerprint for the user
 * Uses browser characteristics to create a semi-stable identifier
 */
function generateUserFingerprint(): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('fingerprint', 2, 2);
    }

    const components = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        canvas.toDataURL()
    ];

    // Simple hash function
    const str = components.join('|');
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }

    return Math.abs(hash).toString(36);
}

/**
 * Get or create user fingerprint
 */
function getUserFingerprint(): string {
    try {
        let fingerprint = localStorage.getItem(USER_FINGERPRINT_KEY);
        if (!fingerprint) {
            fingerprint = generateUserFingerprint();
            localStorage.setItem(USER_FINGERPRINT_KEY, fingerprint);
        }
        return fingerprint;
    } catch {
        // Fallback if localStorage is not available
        return generateUserFingerprint();
    }
}

/**
 * Get all likes from storage
 */
function getAllLikes(): Record<string, LikeData> {
    try {
        const data = localStorage.getItem(LIKES_STORAGE_KEY);
        return data ? JSON.parse(data) : {};
    } catch {
        return {};
    }
}

/**
 * Save likes to storage
 */
function saveLikes(likes: Record<string, LikeData>): void {
    try {
        localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likes));
    } catch (error) {
        console.error('Failed to save likes:', error);
    }
}

/**
 * Get user's likes from storage
 */
function getUserLikes(): UserLike[] {
    try {
        const data = localStorage.getItem(USER_LIKES_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

/**
 * Save user's likes to storage
 */
function saveUserLikes(userLikes: UserLike[]): void {
    try {
        localStorage.setItem(USER_LIKES_KEY, JSON.stringify(userLikes));
    } catch (error) {
        console.error('Failed to save user likes:', error);
    }
}

/**
 * Check if user has liked a post
 */
export function hasUserLikedPost(postSlug: string): boolean {
    const userLikes = getUserLikes();
    return userLikes.some(like => like.postSlug === postSlug);
}

/**
 * Get like count for a post
 */
export function getLikeCount(postSlug: string): number {
    const likes = getAllLikes();
    return likes[postSlug]?.count || 0;
}

/**
 * Like a post (increment count)
 */
export function likePost(postSlug: string): { count: number; success: boolean } {
    try {
        // Check if already liked
        if (hasUserLikedPost(postSlug)) {
            return { count: getLikeCount(postSlug), success: false };
        }

        const likes = getAllLikes();
        const fingerprint = getUserFingerprint();
        const timestamp = Date.now();

        // Update like count
        if (!likes[postSlug]) {
            likes[postSlug] = {
                postSlug,
                count: 0,
                timestamp,
                userFingerprint: fingerprint
            };
        }
        likes[postSlug].count += 1;
        saveLikes(likes);

        // Track user's like
        const userLikes = getUserLikes();
        userLikes.push({
            postSlug,
            timestamp,
            userAgent: navigator.userAgent,
            fingerprintHash: fingerprint
        });
        saveUserLikes(userLikes);

        return { count: likes[postSlug].count, success: true };
    } catch (error) {
        console.error('Failed to like post:', error);
        return { count: getLikeCount(postSlug), success: false };
    }
}

/**
 * Unlike a post (decrement count)
 */
export function unlikePost(postSlug: string): { count: number; success: boolean } {
    try {
        // Check if user has liked this post
        if (!hasUserLikedPost(postSlug)) {
            return { count: getLikeCount(postSlug), success: false };
        }

        const likes = getAllLikes();

        // Decrement count
        if (likes[postSlug] && likes[postSlug].count > 0) {
            likes[postSlug].count -= 1;
            saveLikes(likes);
        }

        // Remove from user's likes
        const userLikes = getUserLikes();
        const updatedUserLikes = userLikes.filter(like => like.postSlug !== postSlug);
        saveUserLikes(updatedUserLikes);

        return { count: likes[postSlug]?.count || 0, success: true };
    } catch (error) {
        console.error('Failed to unlike post:', error);
        return { count: getLikeCount(postSlug), success: false };
    }
}

/**
 * Get all posts with likes (for analytics)
 */
export function getAllPostLikes(): LikeData[] {
    const likes = getAllLikes();
    return Object.values(likes).sort((a, b) => b.count - a.count);
}

/**
 * Get all user likes (for analytics)
 */
export function getAllUserLikes(): UserLike[] {
    return getUserLikes().sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Export likes data as JSON (for backup/analysis)
 */
export function exportLikesData(): string {
    return JSON.stringify({
        postLikes: getAllPostLikes(),
        userLikes: getAllUserLikes(),
        exportDate: new Date().toISOString()
    }, null, 2);
}

/**
 * Get like analytics for a specific post
 */
export function getPostLikeAnalytics(postSlug: string): {
    count: number;
    userLikes: UserLike[];
    firstLikeDate: Date | null;
    lastLikeDate: Date | null;
} {
    const count = getLikeCount(postSlug);
    const userLikes = getAllUserLikes().filter(like => like.postSlug === postSlug);

    let firstLikeDate = null;
    let lastLikeDate = null;

    if (userLikes.length > 0) {
        const timestamps = userLikes.map(like => like.timestamp);
        firstLikeDate = new Date(Math.min(...timestamps));
        lastLikeDate = new Date(Math.max(...timestamps));
    }

    return {
        count,
        userLikes,
        firstLikeDate,
        lastLikeDate
    };
}
