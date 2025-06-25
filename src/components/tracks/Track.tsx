import React from 'react';
import './Track.css';

import { useDispatch } from 'react-redux';
import { openTrackModal } from '../../redux/track-modal-reducer';
import { setCurrentTrack } from '../../redux/player-reducer';

import DefaultCover from '../../assets/default-cover.jpg';
import PlayOnCoverIcon from '../../assets/play-on-cover-icon.png';

import { TrackType } from '../../types/track-type';
import { useLazyLoadTrackQuery } from '../../redux/api/playerApi';

const Track: React.FC<TrackType> = (track) => {
  const dispatch = useDispatch();
  const [triggerLoadTrack] = useLazyLoadTrackQuery();

  const handlePlayClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!track.audioFile) return;

    try {
      const result = await triggerLoadTrack({
        fileName: track.audioFile,
        title: track.title,
        artist: track.artist,
        id: track.id,
      }).unwrap();

      // 🔊 передаємо трек у плеєр
      dispatch(setCurrentTrack(result));
    } catch (error) {
      console.error('Failed to load track:', error);
    }
  };

  const handleOpenModal = () => {
    dispatch(openTrackModal({ track }));
  };

  return (
    <div
      className="track-wrapper"
      onClick={handleOpenModal}
      data-testid={`track-item-${track.id}`}
    >
      <div className="track-cover-wrapper" onClick={handlePlayClick}>
        <img
          className="track-cover"
          src={track.coverImage || DefaultCover}
          alt={track.title}
        />
        {track.audioFile && (
          <img
            src={PlayOnCoverIcon}
            alt={`Play icon ${track.id}`}
            className="play-icon"
          />
        )}
      </div>

      <div className="track-info">
        <h3 className="track-title" data-testid={`track-item-${track.id}-title`}>
          {track.title}
        </h3>

        <p className="track-artist" data-testid={`track-item-${track.id}-artist`}>
          👤 {track.artist}
        </p>

        {track.album && <p className="track-album">💿 {track.album}</p>}

        <div className="track-genres">
          {track.genres?.map((genre, idx) => (
            <span key={idx} className="track-genre">
              {genre}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Track;