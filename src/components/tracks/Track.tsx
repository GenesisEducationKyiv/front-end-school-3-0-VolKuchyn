import './Track.css';
import { useDispatch } from 'react-redux';
import { loadTrack } from '../../redux/player-reducer';
import { openTrackModal } from '../../redux/track-modal-reducer';
import DefaultCover from '../../assets/default-cover.webp';
import PlayOnCoverIcon from '../../assets/play-on-cover-icon.webp';
import { AppDispatch } from '../../redux/redux-store';
import React from 'react';

import { TrackType } from '../../types/track-type';

const Track: React.FC<TrackType> = (track) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div
      className="track-wrapper"
      onClick={() => dispatch(openTrackModal({ track }))}
      data-testid={`track-item-${track.id}`}
    >
      <div
        className="track-cover-wrapper"
        onClick={(e) => {
          if (track.audioFile) {
            e.stopPropagation();
            dispatch(loadTrack({
              fileName: track.audioFile,
              title: track.title,
              artist: track.artist,
              id: track.id,
            }));
          }
        }}
      >
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
