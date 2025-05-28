import React, { useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { closeTrackModal, fetchTrackBySlug, startClosing } from '../../redux/track-modal-reducer';
import { deleteAudioFile, deleteTrack, fetchAllTracks } from '../../redux/tracks-reducer';
import { showToast } from '../../redux/toast-reducer';
import Preloader from '../../assets/Preloader';
import './TrackModal.css'
import { uploadAudioFile } from '../../redux/tracks-reducer';
import { setCurrentTrack, openModal } from '../../redux/form-reducer';
import { useNavigate, useLocation } from 'react-router-dom';
import { pauseTrack } from '../../redux/player-reducer';
import { showConfirm } from '../../redux/confirm-reducer';
import ConfirmDialog from '../confirm-dialog/confirmDialog';
import DefaultCover from '../../assets/default-cover.jpg'
import SkeletonTrack from '../tracks/skeletonTrack/SkeletonTrack';


const TrackModal = () => {
    const dispatch = useDispatch();
    const { track, isOpen, isClosing, isLoading } = useSelector((state) => state.trackModal);
    const { uploadingTrackId, currentPage } = useSelector((state) => state.tracks);
    const fileInputRef = useRef();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (isOpen && track?.slug) {
            navigate(`/tracks/${track.slug}`, { replace: false });
        }

        if (!isOpen && location.pathname.startsWith('/tracks/') && location.pathname !== '/tracks') {
            navigate('/tracks', { replace: false });
        }
    }, [isOpen, track?.slug]);



    if (!track) return null;

    const handleAudioDelete = () => {
        ConfirmDialog.setOnConfirm(() => {
            dispatch(deleteAudioFile(track.id))
                .unwrap()
                .then(() => {
                    dispatch(fetchAllTracks({ page: currentPage }));
                    dispatch(showToast({ message: '✅ Audio deleted', type: 'success' }));
                    dispatch(fetchTrackBySlug(track.slug));
                })
                .catch(() => {
                    dispatch(showToast({ message: '❌ Error while deleting audio', type: 'error' }));
                });
        });

        dispatch(showConfirm({ message: 'Delete audio file?' }));
    };

    const handleDeleteTrack = () => {
        ConfirmDialog.setOnConfirm(() => {
            dispatch(deleteTrack(track.id))
                .unwrap()
                .then(() => {
                    dispatch(fetchAllTracks({ page: currentPage }));
                    dispatch(showToast({ message: '🗑️ Track deleted', type: 'success' }));
                    dispatch(closeTrackModal());
                })
                .catch(() => {
                    dispatch(showToast({ message: '❌ Error when deleting a track', type: 'error' }));
                });
        });

        dispatch(showConfirm({
            message: 'Do you really want to delete this track?',
        }));
    };


    const handleEdit = () => {
        dispatch(setCurrentTrack(track));
        dispatch(openModal());
    };

    const handleOverlayClick = () => {
        dispatch(startClosing());
        setTimeout(() => {
            dispatch(closeTrackModal());
        }, 300);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav'];
        const maxSizeMB = 30;

        if (!validTypes.includes(file.type)) {
            dispatch(showToast({
                message: '❌ Unsupported file format. Acceptable ones are: mp3, wav, mpeg.',
                type: 'error'
            }));
            return;
        }

        const sizeInMB = file.size / (1024 * 1024);
        if (sizeInMB > maxSizeMB) {
            dispatch(showToast({
                message: `❌ File is too large (${sizeInMB.toFixed(2)} MB). Maximum — 30 MB.`,
                type: 'error'
            }));
            return;
        }

        dispatch(uploadAudioFile({ id: track.id, file, _uniq: Date.now() }))
            .unwrap()
            .then(() => {
                dispatch(fetchAllTracks({ page: currentPage }));
                dispatch(showToast({
                    message: '✅ Audio file uploaded successfully!',
                    type: 'success',
                }));
                dispatch(fetchTrackBySlug(track.slug));
            })
            .catch((err) => {
                dispatch(showToast({
                    message: `❌ ${err}`,
                    type: 'error',
                }));
            })
            .finally(() => {
                e.target.value = null;
            });
    };


    const handleUploadClick = () => {
        fileInputRef.current.click();
    };


    const isUploading = uploadingTrackId === track.id;

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
                                    src={`http://localhost:8000/api/files/${track.audioFile}`}
                                />
                                <button
                                    onClick={handleAudioDelete}
                                    className="btn btn-warning"
                                    disabled={isUploading}
                                    aria-disabled={isUploading}
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
                            aria-disabled={isUploading}
                        >
                            ✏️ Edit a track
                        </button>

                        <button
                            className="btn btn-danger"
                            onClick={handleDeleteTrack}
                            data-testid={`delete-track-${track.id}`}
                            disabled={isUploading}
                            aria-disabled={isUploading}
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