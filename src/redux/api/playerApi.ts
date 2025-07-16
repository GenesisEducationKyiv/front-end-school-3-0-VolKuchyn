import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { z } from 'zod';

const TrackBlobResponseSchema = z.instanceof(Blob);

export interface CurrentTrack {
  file: string;
  url: string;
  title: string;
  artist: string;
  id: string;
}

export interface LoadTrackArgs {
  fileName: string;
  title: string;
  artist: string;
  id: string;
}

export const playerApi = createApi({
  reducerPath: 'playerApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api',
    responseHandler: (response) => response.blob(),
  }),
  endpoints: (builder) => ({
    loadTrack: builder.query<CurrentTrack, LoadTrackArgs>({
      query: ({ fileName }) => `files/${fileName}`,
      transformResponse: (blob: Blob, meta, arg) => {
        const parsed = TrackBlobResponseSchema.safeParse(blob);
        if (!parsed.success) {
          throw new Error('Invalid blob response');
        }

        const blobUrl = URL.createObjectURL(blob);
        return {
          file: arg.fileName,
          url: blobUrl,
          title: arg.title,
          artist: arg.artist,
          id: arg.id,
        };
      },
    }),
  }),
});

export const { useLoadTrackQuery, useLazyLoadTrackQuery } = playerApi;