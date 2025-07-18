import React, { useRef, useEffect, ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { closeTrackModal, startClosing } from '../../redux/track-modal-reducer';
import { setCurrentTrack, openModal } from '../../redux/form-reducer'

import { pauseTrack } from '../../redux/player-reducer';
import { showToast } from '../../redux/toast-reducer';
import { showConfirm } from '../../redux/confirm-reducer';
import ConfirmDialog from '../confirm-dialog/ConfirmDialog';

import { RootState, AppDispatch } from '../../redux/redux-store';

import { openTrackModal } from '../../redux/track-modal-reducer';
import {
  useDeleteTrackMutation,
  useUploadAudioFileMutation,
  useDeleteAudioFileMutation,
  tracksApi,
} from '../../redux/api/tracksApi';

import { useLazyFetchTrackBySlugQuery } from '../../redux/api/trackModalApi';

import SkeletonTrack from '../tracks/skeletonTrack/SkeletonTrack';
import Preloader from '../../assets/Preloader';
import DefaultCover from '../../assets/default-cover.jpg';
import './TrackModal.css';

const API_URL = import.meta.env.VITE_API_URL;

const TrackModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { track, isOpen, isClosing, isLoading } = useSelector((state: RootState) => state.trackModal);
  const { uploadingTrackId } = useSelector((state: RootState) => state.tracks);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { track, isOpen, isClosing, isLoading } = useSelector(
    (state: RootState) => state.trackModal
  );

  const [deleteTrack] = useDeleteTrackMutation();
  const [uploadAudioFile, { isLoading: isUploading }] = useUploadAudioFileMutation();
  const [deleteAudioFile] = useDeleteAudioFileMutation();
  const [fetchTrackBySlug] = useLazyFetchTrackBySlugQuery();

  useEffect(() => {
    if (isOpen && track?.slug) {
      navigate(`/tracks/${track.slug}`, { replace: true });
    }

    if (!isOpen && location.pathname.startsWith('/tracks/') && location.pathname !== '/tracks') {
      navigate('/tracks', { replace: true });
    }
  }, [isOpen, track?.slug, navigate, location.pathname]);

  if (!track) return null;

  const handleOverlayClick = () => {
    dispatch(startClosing());
    setTimeout(() => dispatch(closeTrackModal()), 300);
  };

  const handleAudioDelete = () => {
    ConfirmDialog.setOnConfirm(() => {
      deleteAudioFile(track.id)
        .unwrap()
        .then(() => {
          dispatch(showToast({ message: '✅ Audio deleted', type: 'success' }));
          fetchTrackBySlug(track.slug)
            .unwrap()
            .then((updatedTrack) => {
              dispatch(openTrackModal({ track: updatedTrack }));
            }); dispatch(tracksApi.util.invalidateTags(['Tracks']));
        })
        .catch(() => {
          dispatch(showToast({ message: '❌ Error while deleting audio', type: 'error' }));
        });
    });

    dispatch(showConfirm({ message: 'Delete audio file?' }));
  };

  const handleDeleteTrack = () => {
    ConfirmDialog.setOnConfirm(() => {
      deleteTrack(track.id)
        .unwrap()
        .then(() => {
          dispatch(showToast({ message: '🗑️ Track deleted', type: 'success' }));
          dispatch(closeTrackModal());
          dispatch(tracksApi.util.invalidateTags(['Tracks']));
        })
        .catch(() => {
          dispatch(showToast({ message: '❌ Error when deleting a track', type: 'error' }));
        });
    });

    dispatch(showConfirm({ message: 'Do you really want to delete this track?' }));
  };

  const handleEdit = () => {
    dispatch(setCurrentTrack(track));
    dispatch(openModal());
  };

  const handleOverlayClick = () => {
    dispatch(startClosing());
    setTimeout(() => {
      dispatch(closeTrackModal());
      navigate('/tracks', { replace: true });
    }, 300);

  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav'];
    const maxSizeMB = 30;

    if (!validTypes.includes(file.type)) {
      dispatch(
        showToast({
          message: '❌ Unsupported file format. Acceptable ones are: mp3, wav, mpeg.',
          type: 'error',
        })
      );
      return;
    }

    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeMB) {
      dispatch(
        showToast({
          message: `❌ File is too large (${sizeInMB.toFixed(2)} MB). Maximum — 30 MB.`,
          type: 'error',
        })
      );
      return;
    }

    uploadAudioFile({ id: track.id, file })
      .unwrap()
      .then(() => {
        dispatch(showToast({ message: '✅ Audio file uploaded successfully!', type: 'success' }));
        fetchTrackBySlug(track.slug)
          .unwrap()
          .then((updatedTrack) => {
            dispatch(openTrackModal({ track: updatedTrack }));
          }); dispatch(tracksApi.util.invalidateTags(['Tracks']));
      })
      .catch((err: string) => {
        dispatch(showToast({ message: `❌ ${err}`, type: 'error' }));
      })
      .finally(() => {
        if (e.target) e.target.value = '';
      });
  };

  return (
    <div
      className={`track-modal-overlay ${isOpen ? '' : 'hidden'} ${isClosing ? 'closing' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="track-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={handleOverlayClick}>
          ✖
        </button>

        {isLoading ? (
          <SkeletonTrack data-loading="true" />
        ) : (
          <>
            <div className="track-modal-header">
              <img
                className="track-modal-cover"
                src={track.coverImage || DefaultCover}
                alt={track.title}
              />

              <div className="track-modal-info">
                <h2>{track.title}</h2>
                <p>👤 {track.artist}</p>
                {track.album && <p>💿 {track.album}</p>}
              </div>
            </div>

            {isUploading && (
              <div className="audio-uploading-preloader" data-loading="true">
                <Preloader />
              </div>
            )}

            {track.audioFile ? (
              <>
                <audio
                  onPlay={() => dispatch(pauseTrack())}
                  controls
                  src={`${API_URL}/files/${track.audioFile}`}
                />
                <button
                  onClick={handleAudioDelete}
                  className="btn btn-warning"
                  disabled={isUploading}
                >
                  ❌ Delete audio
                </button>
              </>
            ) : (
              !isUploading && (
                <button
                  onClick={handleUploadClick}
                  className="btn btn-primary"
                  data-testid={`upload-track-${track.id}`}
                >
                  🎵 Add audio
                </button>
              )
            )}

            <button
              className="btn btn-secondary"
              onClick={handleEdit}
              data-testid={`edit-track-${track.id}`}
              disabled={isUploading}
            >
              ✏️ Edit a track
            </button>

            <button
              className="btn btn-danger"
              onClick={handleDeleteTrack}
              data-testid={`delete-track-${track.id}`}
              disabled={isUploading}
            >
              🗑️ Delete track
            </button>

            <input
              type="file"
              accept="audio/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TrackModal;