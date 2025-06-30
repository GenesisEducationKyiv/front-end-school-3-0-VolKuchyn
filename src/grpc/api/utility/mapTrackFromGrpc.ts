import { Track } from '../../music_pb';
import { TrackType } from '../../../types/track-type';

export function mapTrackFromGrpc(track: Track.AsObject): TrackType {
  return {
    id: track.id,
    title: track.title,
    artist: track.artist,
    album: track.album,
    slug: track.slug,
    coverImage: track.coverimage,     
    audioFile: track.audiofile,       
    genres: track.genresList,
    createdAt: track.createdat,
    updatedAt: track.updatedat,
  };
}