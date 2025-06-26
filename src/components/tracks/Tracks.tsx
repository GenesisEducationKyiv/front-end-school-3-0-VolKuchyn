import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/redux-store';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import { useFetchTracksQuery } from '../../redux/api/tracksApi';
import { useFetchGenresQuery } from '../../redux/api/formApi';
import { useFetchTrackBySlugQuery } from '../../redux/api/trackModalApi';
import { openModal } from '../../redux/form-reducer';

import Track from './Track';
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

  const [sort, setSort] = useState('');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [genre, setGenre] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const hasQueryParams = location.search && location.search !== '';

    if (!hasQueryParams) {
      const params = new URLSearchParams();
      params.set('sort', 'createdAt');
      params.set('order', 'desc');
      navigate({ search: params.toString() }, { replace: true });
    }
  }, [location.search, navigate]);

  const {
    data: genres = [],
    isLoading: genresLoading,
  } = useFetchGenresQuery();

  const {
    data,
    isLoading: tracksLoading,
  } = useFetchTracksQuery({
    genre,
    sort,
    order,
    search,
    page: String(page),
  });

  const tracks = data?.data || [];
  const meta = data?.meta;

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const sortParam = params.get('sort') || 'createdAt';
    const orderParam = (params.get('order') || 'desc') as 'asc' | 'desc';
    const genreParam = params.get('genre') || '';
    const searchParam = params.get('search') || '';
    const pageParam = parseInt(params.get('page') || '1', 10);

    setSort(sortParam);
    setOrder(orderParam);
    setGenre(genreParam);
    setSearch(searchParam);
    setPage(pageParam > 0 ? pageParam : 1);
  }, [location.search]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (genre) params.set('genre', genre);
    if (sort) params.set('sort', sort);
    if (order) params.set('order', order);
    if (search) params.set('search', search);
    if (page > 1) params.set('page', String(page));
    navigate({ search: params.toString() }, { replace: true });
  }, [genre, sort, order, search, page, navigate]);

  const {
    data: selectedTrack,
    isLoading: isSlugLoading,
    error: slugError,
  } = useFetchTrackBySlugQuery(slug ?? '', {
    skip: !slug,
  });

  const handlePaginator = (newPage: number) => {
    if (newPage >= 1 && (!meta || newPage <= meta.totalPages)) {
      setPage(newPage);
    }
  };

  return (
    <>
      <div className="filters">
        <button
          className="add-track-button"
          data-testid="create-track-button"
          onClick={() => dispatch(openModal())}
          disabled={tracksLoading}
        >
          + Add Track
        </button>

        <select
          className="filter-select"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          data-testid="filter-genre"
          disabled={tracksLoading || genresLoading}
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
          onChange={(e) => setSort(e.target.value)}
          data-testid="sort-select"
          disabled={tracksLoading}
        >
          <option value="createdAt">Date Created</option>
          <option value="title">Title</option>
          <option value="artist">Artist</option>
          <option value="album">Album</option>
        </select>

        <button
          className="sort-order-btn"
          onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
          title={`Sort ${order === 'asc' ? 'descending' : 'ascending'}`}
          disabled={tracksLoading}
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
            onClick={() => handlePaginator(page - 1)}
            disabled={page <= 1 || tracksLoading}
            className="pagination-button"
            data-testid="pagination-prev"
          >
            <img src={LeftArrow} alt="Previous" />
          </button>

          <p>
            Page {page} / {meta.totalPages}
          </p>

          <button
            onClick={() => handlePaginator(page + 1)}
            disabled={page >= meta.totalPages || tracksLoading}
            className="pagination-button"
            data-testid="pagination-next"
          >
            <img src={RightArrow} alt="Next" />
          </button>
        </div>
      )}

      {tracksLoading && (
        <>
          <SkeletonTrack />
          <SkeletonTrack />
          <SkeletonTrack />
        </>
      )}

      {!tracksLoading &&
        tracks.map((track) => <Track key={track.id} {...track} />)}

      {!tracksLoading && tracks.length === 0 && (
        <div className="no-tracks">
          <img src={NoTracksImage} alt="no-image" />
        </div>
      )}

      {isPlayer && <div style={{ height: '65px' }}></div>}
    </>
  );
};

export default Tracks;
