import { z } from "zod";

export const TrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  coverImage: z.string().optional(),
  genres: z.array(z.string()),
  album: z.string().optional(),
  slug: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  audioFile: z.string().nullable().optional(),
});

export type TrackType = z.infer<typeof TrackSchema>;

export const TrackCreateSchema = TrackSchema.omit({
  id: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
  audioFile: true,
});
export type TrackCreateType = z.infer<typeof TrackCreateSchema>;

export const TracksMetaSchema = z.object({
  total: z.number(),
  totalPages: z.number(),
  page: z.number(),
  limit: z.number(),
});
export type TracksMeta = z.infer<typeof TracksMetaSchema>;

export const TracksResponseSchema = z.object({
  data: z.array(TrackSchema),
  meta: TracksMetaSchema,
});