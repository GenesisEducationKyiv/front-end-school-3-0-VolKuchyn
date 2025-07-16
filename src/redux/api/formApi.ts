import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TrackSchema, TrackType, TrackCreateType } from '../../schemas/track-schema';
import { z } from 'zod';

const GenresSchema = z.array(z.string());

export const formApi = createApi({
  reducerPath: 'formApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }),
  tagTypes: ['Tracks'],
  endpoints: (builder) => ({
    fetchGenres: builder.query<string[], void>({
      query: () => 'genres',
      transformResponse: (response: unknown) => {
        const parsed = GenresSchema.safeParse(response);
        if (!parsed.success) throw new Error('Invalid genres format received from server');
        return parsed.data;
      },
    }),

    addTrack: builder.mutation<TrackType, TrackCreateType>({
      query: (body) => ({
        url: 'tracks',
        method: 'POST',
        body,
      }),
      transformResponse: (response: unknown) => {
        const parsed = TrackSchema.safeParse(response);
        if (!parsed.success) throw new Error('Invalid track data from server');
        return parsed.data;
      },
      invalidatesTags: ['Tracks'],
    }),

    updateTrack: builder.mutation<TrackType, { id: string; updatedData: Partial<TrackCreateType> }>({
      query: ({ id, updatedData }) => ({
        url: `tracks/${id}`,
        method: 'PUT',
        body: updatedData,
      }),
      transformResponse: (response: unknown) => {
        const parsed = TrackSchema.safeParse(response);
        if (!parsed.success) throw new Error('Invalid updated track data from server');
        return parsed.data;
      },
      invalidatesTags: ['Tracks'],
    }),
  }),
});

export const {
  useFetchGenresQuery,
  useAddTrackMutation,
  useUpdateTrackMutation,
} = formApi;