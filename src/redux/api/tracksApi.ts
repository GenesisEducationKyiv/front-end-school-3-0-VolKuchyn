import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  TrackSchema,
  TracksResponseSchema,
  TrackType,
  TracksMeta,
} from '../../schemas/track-schema';
import { z } from 'zod';

export interface UploadAudioFileArgs {
  id: string;
  file: File;
}

export const tracksApi = createApi({
  reducerPath: 'tracksApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }),
  tagTypes: ['Tracks'],
  endpoints: (builder) => ({
    fetchTracks: builder.query<
      { data: TrackType[]; meta: TracksMeta },
      Record<string, string>
    >({
      query: (params) => {
        const filteredParams = Object.fromEntries(
          Object.entries(params).filter(([_, value]) => value !== '')
        );

        return {
          url: 'tracks',
          params: filteredParams,
        };
      },
      transformResponse: (response: unknown) => {
        const parsed = TracksResponseSchema.safeParse(response);
        if (!parsed.success) throw new Error('Invalid tracks response');
        return parsed.data;
      },
      providesTags: ['Tracks'],
    }),

    deleteTrack: builder.mutation<string, string>({
      query: (id) => ({
        url: `tracks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tracks'],
    }),

    uploadAudioFile: builder.mutation<
      { id: string; audioUrl: string },
      UploadAudioFileArgs
    >({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append('file', file);

        return {
          url: `tracks/${id}/upload`,
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (res: { url?: string }, meta, arg) => ({
        id: arg.id,
        audioUrl: res.url ?? '',
      }),
      invalidatesTags: ['Tracks'],
    }),

    deleteAudioFile: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `tracks/${id}/file`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Tracks'],
    }),
  }),
});

export const {
  useFetchTracksQuery,
  useLazyFetchTracksQuery,
  useDeleteTrackMutation,
  useUploadAudioFileMutation,
  useDeleteAudioFileMutation,
} = tracksApi;