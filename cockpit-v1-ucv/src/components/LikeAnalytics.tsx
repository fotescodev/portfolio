/**
 * Like Analytics Component
 *
 * Admin view to see blog post like analytics and user tracking data.
 * Shows which posts are most liked and when users liked them.
 */

import { useState, useEffect } from 'react';
import { getAllPostLikes, getAllUserLikes, getPostLikeAnalytics, exportLikesData } from '../lib/likes';
import type { LikeData, UserLike } from '../lib/likes';

interface LikeAnalyticsProps {
    onClose: () => void;
}

export default function LikeAnalytics({ onClose }: LikeAnalyticsProps) {
    const [postLikes, setPostLikes] = useState<LikeData[]>([]);
    const [userLikes, setUserLikes] = useState<UserLike[]>([]);
    const [selectedPost, setSelectedPost] = useState<string | null>(null);
    const [view, setView] = useState<'posts' | 'users' | 'details'>('posts');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        setPostLikes(getAllPostLikes());
        setUserLikes(getAllUserLikes());
    };

    const handleExport = () => {
        const data = exportLikesData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `blog-likes-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const postDetails = selectedPost ? getPostLikeAnalytics(selectedPost) : null;

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateUserAgent = (ua: string) => {
        if (ua.length <= 50) return ua;
        return ua.substring(0, 47) + '...';
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 2000,
                background: 'var(--color-background)',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <style>{`
                .analytics-container {
                    font-family: var(--font-sans);
                    color: var(--color-text-primary);
                }

                .analytics-header {
                    padding: var(--space-xl) var(--space-2xl);
                    border-bottom: 1px solid var(--color-border-light);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .analytics-title {
                    font-size: 24px;
                    font-family: var(--font-serif);
                    font-style: italic;
                    color: var(--color-text-primary);
                }

                .analytics-close-btn {
                    background: none;
                    border: 1px solid var(--color-border);
                    color: var(--color-text-tertiary);
                    padding: var(--space-sm) var(--space-lg);
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all var(--transition-fast);
                }

                .analytics-close-btn:hover {
                    border-color: var(--color-accent);
                    color: var(--color-accent);
                }

                .analytics-nav {
                    display: flex;
                    gap: var(--space-md);
                    padding: var(--space-lg) var(--space-2xl);
                    border-bottom: 1px solid var(--color-border-light);
                }

                .analytics-nav-btn {
                    background: none;
                    border: none;
                    color: var(--color-text-tertiary);
                    padding: var(--space-sm) var(--space-md);
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    transition: all var(--transition-fast);
                }

                .analytics-nav-btn:hover {
                    color: var(--color-text-primary);
                }

                .analytics-nav-btn.active {
                    color: var(--color-accent);
                    border-bottom: 2px solid var(--color-accent);
                }

                .analytics-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: var(--space-2xl);
                }

                .analytics-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--space-lg);
                    margin-bottom: var(--space-2xl);
                }

                .stat-card {
                    padding: var(--space-lg);
                    border: 1px solid var(--color-border-light);
                    background: var(--color-background-secondary);
                }

                .stat-label {
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--color-text-muted);
                    margin-bottom: var(--space-sm);
                }

                .stat-value {
                    font-size: 32px;
                    font-family: var(--font-serif);
                    font-style: italic;
                    color: var(--color-accent);
                }

                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .data-table th {
                    text-align: left;
                    padding: var(--space-md);
                    border-bottom: 1px solid var(--color-border);
                    font-size: 11px;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: var(--color-text-muted);
                }

                .data-table td {
                    padding: var(--space-md);
                    border-bottom: 1px solid var(--color-border-light);
                    font-size: 13px;
                    color: var(--color-text-secondary);
                }

                .data-table tr:hover {
                    background: var(--color-card-hover);
                }

                .post-link {
                    color: var(--color-accent);
                    cursor: pointer;
                    text-decoration: none;
                    transition: opacity var(--transition-fast);
                }

                .post-link:hover {
                    opacity: 0.8;
                }

                .export-btn {
                    background: var(--color-accent);
                    border: none;
                    color: var(--color-background);
                    padding: var(--space-sm) var(--space-lg);
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    transition: all var(--transition-fast);
                }

                .export-btn:hover {
                    opacity: 0.9;
                    transform: translateY(-2px);
                }

                .back-btn {
                    background: none;
                    border: 1px solid var(--color-border);
                    color: var(--color-text-tertiary);
                    padding: var(--space-sm) var(--space-lg);
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all var(--transition-fast);
                    margin-bottom: var(--space-lg);
                }

                .back-btn:hover {
                    border-color: var(--color-accent);
                    color: var(--color-accent);
                }
            `}</style>

            <div className="analytics-container">
                {/* Header */}
                <div className="analytics-header">
                    <h1 className="analytics-title">Blog Like Analytics</h1>
                    <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                        <button className="export-btn" onClick={handleExport}>
                            Export Data
                        </button>
                        <button className="analytics-close-btn" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <div className="analytics-nav">
                    <button
                        className={`analytics-nav-btn ${view === 'posts' ? 'active' : ''}`}
                        onClick={() => setView('posts')}
                    >
                        Posts ({postLikes.length})
                    </button>
                    <button
                        className={`analytics-nav-btn ${view === 'users' ? 'active' : ''}`}
                        onClick={() => setView('users')}
                    >
                        User Activity ({userLikes.length})
                    </button>
                </div>

                {/* Content */}
                <div className="analytics-content">
                    {/* Summary Stats */}
                    <div className="analytics-stats">
                        <div className="stat-card">
                            <div className="stat-label">Total Likes</div>
                            <div className="stat-value">
                                {postLikes.reduce((sum, post) => sum + post.count, 0)}
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Posts with Likes</div>
                            <div className="stat-value">{postLikes.length}</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-label">Unique Users</div>
                            <div className="stat-value">
                                {new Set(userLikes.map(like => like.fingerprintHash)).size}
                            </div>
                        </div>
                    </div>

                    {/* Posts View */}
                    {view === 'posts' && (
                        <>
                            <h2 style={{
                                fontSize: '18px',
                                fontFamily: 'var(--font-serif)',
                                fontStyle: 'italic',
                                marginBottom: 'var(--space-lg)',
                                color: 'var(--color-text-primary)'
                            }}>
                                Posts by Likes
                            </h2>
                            {postLikes.length === 0 ? (
                                <p style={{ color: 'var(--color-text-tertiary)' }}>
                                    No posts have been liked yet.
                                </p>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Post</th>
                                            <th>Likes</th>
                                            <th>First Liked</th>
                                            <th>Last Liked</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {postLikes.map((post) => {
                                            const analytics = getPostLikeAnalytics(post.postSlug);
                                            return (
                                                <tr key={post.postSlug}>
                                                    <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                                        {post.postSlug}
                                                    </td>
                                                    <td>{post.count}</td>
                                                    <td>
                                                        {analytics.firstLikeDate
                                                            ? formatDate(analytics.firstLikeDate.getTime())
                                                            : 'N/A'}
                                                    </td>
                                                    <td>
                                                        {analytics.lastLikeDate
                                                            ? formatDate(analytics.lastLikeDate.getTime())
                                                            : 'N/A'}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className="post-link"
                                                            onClick={() => {
                                                                setSelectedPost(post.postSlug);
                                                                setView('details');
                                                            }}
                                                        >
                                                            View Details
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}

                    {/* Users View */}
                    {view === 'users' && (
                        <>
                            <h2 style={{
                                fontSize: '18px',
                                fontFamily: 'var(--font-serif)',
                                fontStyle: 'italic',
                                marginBottom: 'var(--space-lg)',
                                color: 'var(--color-text-primary)'
                            }}>
                                Recent User Activity
                            </h2>
                            {userLikes.length === 0 ? (
                                <p style={{ color: 'var(--color-text-tertiary)' }}>
                                    No user activity yet.
                                </p>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Post</th>
                                            <th>Timestamp</th>
                                            <th>User Agent</th>
                                            <th>Fingerprint</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userLikes.map((like, index) => (
                                            <tr key={index}>
                                                <td style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                                    {like.postSlug}
                                                </td>
                                                <td>{formatDate(like.timestamp)}</td>
                                                <td title={like.userAgent}>
                                                    {truncateUserAgent(like.userAgent)}
                                                </td>
                                                <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                                    {like.fingerprintHash}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </>
                    )}

                    {/* Post Details View */}
                    {view === 'details' && postDetails && (
                        <>
                            <button className="back-btn" onClick={() => setView('posts')}>
                                ← Back to Posts
                            </button>
                            <h2 style={{
                                fontSize: '18px',
                                fontFamily: 'var(--font-serif)',
                                fontStyle: 'italic',
                                marginBottom: 'var(--space-lg)',
                                color: 'var(--color-text-primary)'
                            }}>
                                {selectedPost}
                            </h2>
                            <div style={{ marginBottom: 'var(--space-xl)' }}>
                                <p style={{ color: 'var(--color-text-secondary)' }}>
                                    <strong>Total Likes:</strong> {postDetails.count}
                                </p>
                                <p style={{ color: 'var(--color-text-secondary)' }}>
                                    <strong>First Liked:</strong>{' '}
                                    {postDetails.firstLikeDate
                                        ? formatDate(postDetails.firstLikeDate.getTime())
                                        : 'N/A'}
                                </p>
                                <p style={{ color: 'var(--color-text-secondary)' }}>
                                    <strong>Last Liked:</strong>{' '}
                                    {postDetails.lastLikeDate
                                        ? formatDate(postDetails.lastLikeDate.getTime())
                                        : 'N/A'}
                                </p>
                            </div>
                            <h3 style={{
                                fontSize: '16px',
                                fontWeight: 600,
                                marginBottom: 'var(--space-md)',
                                color: 'var(--color-text-primary)'
                            }}>
                                User Likes
                            </h3>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Timestamp</th>
                                        <th>User Agent</th>
                                        <th>Fingerprint</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {postDetails.userLikes.map((like, index) => (
                                        <tr key={index}>
                                            <td>{formatDate(like.timestamp)}</td>
                                            <td title={like.userAgent}>
                                                {truncateUserAgent(like.userAgent)}
                                            </td>
                                            <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                                                {like.fingerprintHash}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
