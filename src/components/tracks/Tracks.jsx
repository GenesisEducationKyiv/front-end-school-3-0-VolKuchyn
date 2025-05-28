import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTracks } from '../../redux/tracks-reducer';
import { useEffect, useState } from 'react';
import Track from './Track';
import { setPage, setGenre, setOrder, setSort } from '../../redux/tracks-reducer';
import { fetchGenres } from '../../redux/form-reducer';
import { openModal } from '../../redux/form-reducer';
import Preloader from '../../assets/Preloader';
import { fetchTrackBySlug } from '../../redux/track-modal-reducer';
import { useParams } from 'react-router-dom';
import FilterAsc from '../../assets/sort-ascending-svgrepo-com.svg'
import FilterDesc from '../../assets/sort-descending-svgrepo-com.svg'
import LeftArrow from '../../assets/left-arrow.svg'
import RightArrow from '../../assets/right-arrow.svg'
import SkeletonTrack from './skeletonTrack/SkeletonTrack';
import NoTracksImage from '../../assets/no-tracks-found.png';
import './Tracks.css'


const Tracks = () => {
  const dispatch = useDispatch();

  const tracksState = useSelector((state) => state.tracks);

  const isPlayer = useSelector((state) => state.player.currentTrack)

  const { slug } = useParams();


  useEffect(() => {
    if (slug) {
      dispatch(fetchTrackBySlug(slug));
    }
  }, [slug]);

  useEffect(() => {
    dispatch(fetchGenres());
  }, []);

  const genres = useSelector((state) => state.form.genres);

  useEffect(() => {
    dispatch(fetchAllTracks());
  }, [tracksState.currentPage,
  tracksState.sort,
  tracksState.order,
  tracksState.genre,
  tracksState.search,
  ]);



  const setPaginator = (p) => {
    dispatch(setPage(p));
  }


  return (
    <>
      <div>
        <div className="filters">
          <button
            className="add-track-button"
            data-testid="create-track-button"
            onClick={() => dispatch(openModal())}
            data-loading={tracksState.isTracksLoading}
            disabled={tracksState.isTracksLoading}
            aria-disabled={tracksState.isTracksLoading}
          >
            + Add Track
          </button>

          <select
            className="filter-select"
            value={tracksState.genre}
            onChange={(e) => dispatch(setGenre(e.target.value))}
            data-testid="filter-genre"
            data-loading={tracksState.isTracksLoading}
            disabled={tracksState.isTracksLoading}
            aria-disabled={tracksState.isTracksLoading}
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
            value={tracksState.sort}
            onChange={(e) => dispatch(setSort(e.target.value))}
            data-testid="sort-select"
            data-loading={tracksState.isTracksLoading}
            disabled={tracksState.isTracksLoading}
            aria-disabled={tracksState.isTracksLoading}
          >
            <option value="createdAt">Date Created</option>
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="album">Album</option>
          </select>

          <button
            className="sort-order-btn"
            onClick={() =>
              dispatch(setOrder(tracksState.order === 'asc' ? 'desc' : 'asc'))
            }
            title={`Sort ${tracksState.order === 'asc' ? 'descending' : 'ascending'}`}
            data-loading={tracksState.isTracksLoading}
            disabled={tracksState.isTracksLoading}
            aria-disabled={tracksState.isTracksLoading}
          >
            <img
              src={tracksState.order === 'asc' ? FilterAsc : FilterDesc}
              alt="Sort order"
              className="sort-icon"
            />
          </button>
        </div>

        {tracksState.length > 10 && (
          <div className="pagination-buttons" data-testid="pagination">
            <button
              onClick={() => setPaginator(tracksState.currentPage - 1)}
              disabled={tracksState.currentPage <= 1 || tracksState.isTracksLoading}
              aria-disabled={tracksState.currentPage <= 1 || tracksState.isTracksLoading}
              className="pagination-button"
              title="Previous page"
              data-testid="pagination-prev"
              data-loading={tracksState.isTracksLoading}
            >
              <img src={LeftArrow} alt="Previous" />
            </button>

            <p>Page {tracksState.currentPage} / {tracksState.totalPages}</p>

            <button
              onClick={() => setPaginator(tracksState.currentPage + 1)}
              disabled={tracksState.currentPage >= tracksState.totalPages || tracksState.isTracksLoading}
              aria-disabled={tracksState.currentPage >= tracksState.totalPages || tracksState.isTracksLoading}
              className="pagination-button"
              title="Next page"
              data-testid="pagination-next"
              data-loading={tracksState.isTracksLoading}
            >
              <img src={RightArrow} alt="Next" />
            </button>
          </div>
        )}
      </div>

      {tracksState.isTracksLoading && (
        <>
          <SkeletonTrack />
          <SkeletonTrack />
          <SkeletonTrack />
        </>
      )}

      {tracksState.tracks.map((t) => (
        <Track key={t.id} {...t} />
      ))}

      {!tracksState.isTracksLoading && tracksState.tracks.length === 0 && (
        <div className="no-tracks">
          <img src={NoTracksImage} alt="no-image" />
        </div>
      )}

      {isPlayer && <div style={{ height: '65px' }}></div>}
    </>
  );
}

export default Tracks;
