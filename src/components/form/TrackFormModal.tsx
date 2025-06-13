import React, { useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeModal,
  startClosingModal,
  addTrack,
  updateTrack,
  fetchGenres,
} from '../../redux/form-reducer';
import { fetchAllTracks } from '../../redux/tracks-reducer';
import { fetchTrackBySlug } from '../../redux/track-modal-reducer';
import { showToast } from '../../redux/toast-reducer';
import { RootState, AppDispatch } from '../../redux/redux-store';
import './TrackFormModal.css';


type TrackFormValues = {
  title: string;
  artist: string;
  album: string;
  coverImage?: string;
  genres: string[];
};

const TrackFormModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => state.form);
  const genresList = state.genres;
  const currentTrack = state.currentTrack;
  const selectedGenres = state.selectedGenres;
  const isEdit = !!currentTrack;

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  const handleClose = () => {
    dispatch(startClosingModal());
    setTimeout(() => dispatch(closeModal()), 300);
  };

  const initialValues: TrackFormValues = {
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
      .matches(/\.(jpeg|jpg|png|webp|gif|bmp|svg)(\?.*)?$/i, 'The link should lead to the image!')
      .nullable(),
    genres: Yup.array().of(Yup.string()).min(1, 'At least one genre must be selected'),
  });

  const handleSubmit = (
    values: TrackFormValues,
    { resetForm }: FormikHelpers<TrackFormValues>
  ) => {
    const getErrorMessage = (error: unknown, fallback = '❌ An error occurred.'): string => {
      if (typeof error === 'string') return error;
      if (error instanceof Error) return error.message;
      return fallback;
    };

    if (isEdit) {
      dispatch(updateTrack({ id: currentTrack!.id, updatedData: values }))
        .unwrap()
        .then((updatedTrack) => {
          dispatch(fetchAllTracks());
          dispatch(fetchTrackBySlug(updatedTrack.slug));
          dispatch(closeModal());

          dispatch(
            showToast({
              message: '✅ Track successfully updated!',
              type: 'success',
            })
          );

          resetForm();
        })
        .catch((error) => {
          dispatch(
            showToast({
              message: `❌ ${getErrorMessage(error, 'Error when updating a track!')}`,
              type: 'error',
            })
          );
        });
    } else {
      dispatch(addTrack(values))
        .unwrap()
        .then((updatedTrack) => {
          dispatch(fetchAllTracks());
          dispatch(fetchTrackBySlug(updatedTrack.slug));
          dispatch(closeModal());

          dispatch(
            showToast({
              message: '✅ Track added successfully!',
              type: 'success',
            })
          );

          resetForm();
        })
        .catch((error) => {
          dispatch(
            showToast({
              message: `❌ ${getErrorMessage(error, 'Error adding a track!')}`,
              type: 'error',
            })
          );
        });
    }
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
                {genresList.map((genre: string) => {
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
                <button type="button" onClick={handleClose}>Cancel</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TrackFormModal;
