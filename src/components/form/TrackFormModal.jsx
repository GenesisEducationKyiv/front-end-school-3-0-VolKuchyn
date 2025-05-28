import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, startClosingModal, toggleGenre, addTrack, updateTrack, fetchGenres } from '../../redux/form-reducer';
import { fetchAllTracks } from '../../redux/tracks-reducer';
import { fetchTrackBySlug } from '../../redux/track-modal-reducer';
import { showToast } from '../../redux/toast-reducer';
import './TrackFormModal.css';

const TrackFormModal = () => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.form);
    const genresList = state.genres;
    const currentTrack = state.currentTrack;
    const selectedGenres = state.selectedGenres;
    const currentPage = useSelector((state) => state.tracks.currentPage);
    const isEdit = !!currentTrack;

    useEffect(() => {
        dispatch(fetchGenres());
    }, []);

    const handleClose = () => {
        dispatch(startClosingModal());
        setTimeout(() => dispatch(closeModal()), 300);
    };

    const initialValues = {
        title: currentTrack?.title || '',
        artist: currentTrack?.artist || '',
        album: currentTrack?.album || '',
        coverImage: currentTrack?.coverImage || '',
        genres: selectedGenres || [],
    };

    const validationSchema = Yup.object({
        title: Yup.string().required('Required!'),
        artist: Yup.string().required('Required!'),
        album: Yup.string(),
        coverImage: Yup.string()
            .url('Wrong URL')
            .matches(/\.(jpeg|jpg|png|webp|gif|bmp|svg)$/i, 'The link should lead to the image!')
            .nullable(),
        genres: Yup.array()
            .min(1, 'At least one genre must be selected')
            .of(Yup.string()),
    });

    const handleSubmit = (values, { resetForm }) => {
        const action = isEdit
            ? updateTrack({ id: currentTrack.id, updatedData: values })
            : addTrack(values);

        const getErrorMessage = (error, fallback = '❌ An error occurred.') =>
            typeof error === 'string' ? error : error?.error || fallback;

        dispatch(action)
            .unwrap()
            .then((updatedTrack) => {
                dispatch(fetchAllTracks({ page: isEdit ? currentPage : 1 }));
                dispatch(fetchTrackBySlug(updatedTrack.slug));
                dispatch(closeModal());

                dispatch(
                    showToast({
                        message: isEdit
                            ? '✅ Track successfully updated!'
                            : '✅ Track added successfully!',
                        type: 'success',
                    })
                );

                resetForm();
            })
            .catch((error) => {
                dispatch(
                    showToast({
                        message: isEdit
                            ? `❌ ${getErrorMessage(error, 'Error when updating a track!')}`
                            : `❌ ${getErrorMessage(error, 'Error adding a track!')}`,
                        type: 'error',
                    })
                );
            });
    };

    if (!state.isModalOpened) return null;

    return (
        <div
            className={`modal-overlay ${state.isClosing ? 'overlay-closing' : ''}`}
            onClick={handleClose}
        >
            <div
                className={`modal ${state.isClosing ? 'modal-closing' : ''}`}
                onClick={(e) => e.stopPropagation()}
            >
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                    enableReinitialize
                >
                    {({ values, setFieldValue }) => (
                        <Form className="form" data-testid="track-form">
                            <h2>{isEdit ? 'Edit track' : 'Add track'}</h2>

                            <label>Title</label>
                            <Field name="title" data-testid="input-title" />
                            <ErrorMessage name="title" component="div" className="error" data-testid="error-title" />

                            <label>Artist</label>
                            <Field name="artist" data-testid="input-artist" />
                            <ErrorMessage name="artist" component="div" className="error" data-testid="error-artist" />

                            <label>Album</label>
                            <Field name="album" data-testid="input-album" />
                            <ErrorMessage name="album" component="div" className="error" data-testid="error-album" />

                            <label>Cover Image</label>
                            <Field name="coverImage" data-testid="input-cover-image" />
                            <ErrorMessage name="coverImage" component="div" className="error" data-testid="error-coverImage" />

                            <label>Genres</label>
                            <ErrorMessage name="genres" component="div" className="error" data-testid="error-genre" />
                            <div className="genre-list" data-testid="genre-selector">
                                {genresList.map((genre) => {
                                    const isSelected = values.genres.includes(genre);
                                    return (
                                        <button
                                            type="button"
                                            key={genre}
                                            className={`genre-btn ${isSelected ? 'selected' : ''}`}
                                            onClick={() => {
                                                const updated = isSelected
                                                    ? values.genres.filter((g) => g !== genre)
                                                    : [...values.genres, genre];
                                                setFieldValue('genres', updated);
                                            }}
                                        >
                                            {isSelected ? 'x ' : '+ '} {genre}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="form-buttons">
                                <button type="submit" data-testid="submit-button">Save</button>
                                <button type="button" onClick={handleClose}>
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default TrackFormModal;