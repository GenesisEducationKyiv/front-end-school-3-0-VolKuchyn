import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, startClosingModal } from '../../redux/form-reducer';
import {
  useFetchGenresQuery,
  useAddTrackMutation,
  useUpdateTrackMutation,
} from '../../redux/api/formApi';
import { useLazyFetchTrackBySlugQuery } from '../../redux/api/trackModalApi';
import { showToast } from '../../redux/toast-reducer';
import { RootState, AppDispatch } from '../../redux/redux-store';
import { openTrackModal } from '../../redux/track-modal-reducer';
import { tracksApi } from '../../redux/api/tracksApi';
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
  const currentTrack = state.currentTrack;
  const selectedGenres = state.selectedGenres;
  const isEdit = !!currentTrack;

  const { data: genresList = [] } = useFetchGenresQuery();
  const [addTrack] = useAddTrackMutation();
  const [updateTrack] = useUpdateTrackMutation();
  const [fetchTrackBySlug] = useLazyFetchTrackBySlugQuery();

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
    title: Yup.string().required('Title is required!'),
    artist: Yup.string().required('Artist is required!'),
    album: Yup.string(),
    coverImage: Yup.string()
      .url('Wrong URL')
      .matches(/\.(jpeg|jpg|png|webp|gif|bmp|svg)(\?.*)?$/i, 'The link should lead to the image!')
      .nullable(),
    genres: Yup.array().of(Yup.string()).min(1, 'At least one genre must be selected'),
  });

  const handleSubmit = async (
    values: TrackFormValues,
    { resetForm }: FormikHelpers<TrackFormValues>
  ) => {
    const getErrorMessage = (error: unknown, fallback = '❌ An error occurred.'): string => {
      if (typeof error === 'string') return error;
      if (error instanceof Error) return error.message;
      return fallback;
    };

    try {
      const mutation = isEdit
        ? updateTrack({ id: currentTrack!.id, updatedData: values })
        : addTrack(values);

      const updatedTrack = await mutation.unwrap();

      dispatch(tracksApi.util.invalidateTags(['Tracks']));

      fetchTrackBySlug(updatedTrack.slug)
        .unwrap()
        .then((refetchedTrack) => {
          dispatch(openTrackModal({ track: refetchedTrack }));
        });

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
    } catch (error) {
      dispatch(
        showToast({
          message: `❌ ${getErrorMessage(error, isEdit ? 'Error updating track!' : 'Error adding track!')}`,
          type: 'error',
        })
      );
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