import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/redux-store';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import {
  setGenre, setOrder, setPage, setSearch, setSort, resetRefetch
} from '../../redux/tracks-reducer';
import { openModal } from '../../redux/form-reducer';
import { musicClient } from '../../grpc/api/grpc-api';
import { Track, TrackListResponse } from '../../grpc/src/proto/music_pb';
import TrackCard from './Track';
import SkeletonTrack from './skeletonTrack/SkeletonTrack';
import NoTracksImage from '../../assets/no-tracks-found.png';
import FilterAsc from '../../assets/sort-ascending-svgrepo-com.svg';
import FilterDesc from '../../assets/sort-descending-svgrepo-com.svg';
import LeftArrow from '../../assets/left-arrow.svg';
import RightArrow from '../../assets/right-arrow.svg';
import './Tracks.css';

const Tracks = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { slug } = useParams<{ slug?: string }>();
  const isPlayer = useSelector((state: RootState) => state.player.currentTrack);

  const {
    sort, order, genre, search, currentPage, shouldRefetch
  } = useSelector((state: RootState) => state.tracks);

  const [tracks, setTracks] = useState<Track[]>([]);
  const [genres, setGenres] = useState<string[]>([]);
  const [meta, setMeta] = useState<TrackListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    dispatch(setSort(params.get('sort') || 'createdAt'));
    dispatch(setOrder((params.get('order') || 'desc') as 'asc' | 'desc'));
    dispatch(setGenre(params.get('genre') || ''));
    dispatch(setSearch(params.get('search') || ''));
    dispatch(setPage(parseInt(params.get('page') || '1', 10)));
    setIsInitialized(true);
  }, [location.search, dispatch]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (genre) params.set('genre', genre);
    if (sort) params.set('sort', sort);
    if (order) params.set('order', order);
    if (search) params.set('search', search);
    if (currentPage > 1) params.set('page', String(currentPage));
    navigate({ search: params.toString() }, { replace: true });
  }, [genre, sort, order, search, currentPage, navigate]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await musicClient.getGenres({});
        setGenres(res.genres ?? []);
      } catch (error) {
        console.error('gRPC Genre Fetch Error:', error);
      }
    };
    fetchGenres();
  }, []);


  useEffect(() => {
    if (!isInitialized) return;

    const fetchTracks = async () => {
      setLoading(true);
      try {
        const response = await musicClient.getTracks({
          genre,
          sort,
          order,
          search,
          page: currentPage,
          limit: 10,
        });
        setTracks(response.tracks ?? []);
        setMeta(response);

        if (shouldRefetch) {
          dispatch(resetRefetch());
        }
      } catch (error) {
        console.error('gRPC Track Fetch Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [genre, sort, order, search, currentPage, shouldRefetch, dispatch, isInitialized]);

  const handlePaginator = (newPage: number) => {
    if (newPage >= 1 && (!meta || newPage <= meta.totalPages)) {
      dispatch(setPage(newPage));
    }
  };

  return (
    <>
      <div className="filters">
        <button
          className="add-track-button"
          data-testid="create-track-button"
          onClick={() => dispatch(openModal())}
          disabled={loading}
        >
          + Add Track
        </button>

        <select
          className="filter-select"
          value={genre}
          onChange={(e) => dispatch(setGenre(e.target.value))}
          data-testid="filter-genre"
          disabled={loading}
        >
          <option value="">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={sort}
          onChange={(e) => dispatch(setSort(e.target.value))}
          data-testid="sort-select"
          disabled={loading}
        >
          <option value="createdAt">Date Created</option>
          <option value="title">Title</option>
          <option value="artist">Artist</option>
          <option value="album">Album</option>
        </select>

        <button
          className="sort-order-btn"
          onClick={() => dispatch(setOrder(order === 'asc' ? 'desc' : 'asc'))}
          title={`Sort ${order === 'asc' ? 'descending' : 'ascending'}`}
          disabled={loading}
        >
          <img
            src={order === 'asc' ? FilterAsc : FilterDesc}
            alt="Sort order"
            className="sort-icon"
          />
        </button>
      </div>

      {meta && meta.total > 10 && (
        <div className="pagination-buttons" data-testid="pagination">
          <button
            onClick={() => handlePaginator(currentPage - 1)}
            disabled={currentPage <= 1 || loading}
            className="pagination-button"
            data-testid="pagination-prev"
          >
            <img src={LeftArrow} alt="Previous" />
          </button>

          <p>
            Page {currentPage} / {meta.totalPages}
          </p>

          <button
            onClick={() => handlePaginator(currentPage + 1)}
            disabled={currentPage >= meta.totalPages || loading}
            className="pagination-button"
            data-testid="pagination-next"
          >
            <img src={RightArrow} alt="Next" />
          </button>
        </div>
      )}

      {loading && (
        <>
          <SkeletonTrack />
          <SkeletonTrack />
          <SkeletonTrack />
        </>
      )}

      {!loading && tracks.map((track) => <TrackCard key={track.id} {...track} />)}

      {!loading && tracks.length === 0 && (
        <div className="no-tracks">
          <img src={NoTracksImage} alt="no-image" />
        </div>
      )}

      {isPlayer && <div style={{ height: '65px' }}></div>}
    </>
  );
};

export default Tracks;
