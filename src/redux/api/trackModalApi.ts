import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { TrackSchema, TrackType } from '../../schemas/track-schema';
import { z } from 'zod';

export const trackModalApi = createApi({
  reducerPath: 'trackModalApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:8000/api' }),
  endpoints: (builder) => ({
    fetchTrackBySlug: builder.query<TrackType, string>({
      query: (slug) => `tracks/${slug}`,
      transformResponse: (response: unknown) => {
        const parsed = TrackSchema.safeParse(response);
        if (!parsed.success) {
          throw new Error('❌ Invalid track format from server.');
        }
        return parsed.data;
      },
    }),
  }),
});

export const { useFetchTrackBySlugQuery, useLazyFetchTrackBySlugQuery } = trackModalApi;