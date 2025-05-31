import React from 'react';
import './SkeletonTrack.css';

const SkeletonTrack = () => {
    return (
        <div className="track-wrapper skeleton" data-testid="loading-tracks">
            <div className="track-cover-wrapper">
                <div className="skeleton-box skeleton-cover" />
            </div>
            <div className="track-info">
                <div className="skeleton-box skeleton-title" />
                <div className="skeleton-box skeleton-text" />
                <div className="skeleton-box skeleton-text short" />
                <div className="skeleton-genres">
                    <span className="skeleton-box skeleton-genre" />
                    <span className="skeleton-box skeleton-genre" />
                    <span className="skeleton-box skeleton-genre" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonTrack;