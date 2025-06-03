import { z } from "zod";

export const TrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  album: z.string().optional(),
  coverImage: z.string().url().optional(),
  genres: z.array(z.string()),
});

export const TrackCreateSchema = TrackSchema.omit({ id: true });

export type TrackType = z.infer<typeof TrackSchema>;
export type TrackCreateType = z.infer<typeof TrackCreateSchema>;