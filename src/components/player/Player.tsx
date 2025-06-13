import React, { useEffect, useRef, useState, MouseEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { togglePlay, stopTrack } from '../../redux/player-reducer';
import { RootState, AppDispatch } from '../../redux/redux-store';
import './Player.css';
import PlayButton from '../../assets/play-button.svg';
import PauseButton from '../../assets/pause-button.svg';
import Preloader from '../../assets/Preloader';

const Player = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const dispatch: AppDispatch = useDispatch();
    const { currentTrack, isPlaying, isLoading } = useSelector(
        (state: RootState) => state.player
    );

    const [progress, setProgress] = useState<number>(0);
    const [currentTime, setCurrentTime] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);

    useEffect(() => {
        if (audioRef.current && !isLoading) {
            if (isPlaying) {
                audioRef.current.play();
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentTrack, isLoading]);

    const handleTimeUpdate = () => {
        if (!audioRef.current) return;
        const current = audioRef.current.currentTime;
        const total = audioRef.current.duration;
        setCurrentTime(current);
        setDuration(total);
        if (!isNaN(total)) {
            setProgress((current / total) * 100);
        }
    };

    const handleEnded = () => {
        dispatch(stopTrack());
    };

    const handleSeek = (e: MouseEvent<HTMLDivElement>) => {
        if (!audioRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percent = clickX / rect.width;
        audioRef.current.currentTime = percent * duration;
    };

    const formatTime = (seconds: number): string => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    if (!currentTrack && !isLoading) return null;

    return (
        <div className="player" data-testid={`audio-player-${currentTrack?.id}`}>
            {isLoading ? (
                <div className="player-loading">
                    <Preloader />
                </div>
            ) : (
                <>
                    <audio
                        ref={audioRef}
                        src={currentTrack?.url}
                        onTimeUpdate={handleTimeUpdate}
                        onEnded={handleEnded}
                    />

                    <div
                        className="progress-bar-wrapper"
                        onClick={handleSeek}
                        data-testid={`audio-progress-${currentTrack?.id}`}
                    >
                        <div className="progress-bar">
                            <div className="progress" style={{ width: `${progress}%` }} />
                        </div>
                    </div>

                    <div className="player-content">
                        <button
                            className="play-button"
                            onClick={() => dispatch(togglePlay())}
                            data-testid={
                                isPlaying
                                    ? `pause-button-${currentTrack?.id}`
                                    : `play-button-${currentTrack?.id}`
                            }
                        >
                            <img
                                src={isPlaying ? PauseButton : PlayButton}
                                alt={isPlaying ? 'Pause' : 'Play'}
                                className="player-play-icon"
                            />
                        </button>

                        <div className="time-info">
                            <span>{formatTime(currentTime)}</span>
                            <span> / {formatTime(duration)}</span>
                        </div>

                        {currentTrack && (
                            <div
                                className="track-info"
                                title={`${currentTrack.artist} — ${currentTrack.title}`}
                            >
                                <strong>{currentTrack.artist}</strong> — {currentTrack.title}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Player;
