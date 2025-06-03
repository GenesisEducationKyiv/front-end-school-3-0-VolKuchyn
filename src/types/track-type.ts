export interface TrackType {
    id: string;
    title: string;
    artist: string;
    album?: string;
    genres: string[];
    slug: string;
    coverImage?: string;
    createdAt: string;
    updatedAt: string;
    audioFile?: string | null;
}