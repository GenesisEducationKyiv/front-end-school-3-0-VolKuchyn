import { describe, it, test, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import reducer, {
  openModal,
  toggleGenre,
  fetchGenres,
  addTrack,
} from '../../src/redux/form-reducer';

const API_URL = import.meta.env.VITE_API_URL;

vi.mock('axios');
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;
};

const initialState = {
  selectedGenres: [],
  isModalOpened: false,
  isClosing: false,
  genres: [],
  currentTrack: null,
  modalMode: null,
  isGenresLoading: false,
  isTrackSaving: false,
  error: null,
  savedTrack: undefined,
};

describe('tests for formReducer', () => {
  it('should open modal (blackbox)', () => {
    const state = reducer(initialState, openModal());
    expect(state.isModalOpened).toBe(true);
    expect(state.isClosing).toBe(false);
  });

  it('should toggle genre correctly (blackbox)', () => {
    const added = reducer(initialState, toggleGenre('Rock'));
    expect(added.selectedGenres).toEqual(['Rock']);

    const removed = reducer(added, toggleGenre('Rock'));
    expect(removed.selectedGenres).toEqual([]);
  });
});

describe('fetchGenres unit test', () => {
  let dispatch: ReturnType<typeof vi.fn>;
  let thunk: ReturnType<typeof fetchGenres>;

  beforeEach(() => {
    vi.clearAllMocks();
    dispatch = vi.fn();
    thunk = fetchGenres();
  });

  test('dispatches correct actions on success', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: ['Rock', 'Jazz'] });

    const result = await thunk(dispatch, () => ({}), undefined);

    expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/genres`);
    expect(result.payload).toEqual(['Rock', 'Jazz']);
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'addModalForm/fetchGenres/pending' }));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'addModalForm/fetchGenres/fulfilled' }));
  });

  test('handles invalid response and dispatches rejected', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: 123 });

    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.payload).toBe('Invalid genres format received from server');
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'addModalForm/fetchGenres/rejected' }));
  });
});

describe('Thunk: addTrack', () => {
  const mockTrackData = {
    title: 'Test Song',
    artist: 'Test Artist',
    album: 'Test Album',
    coverImage: 'https://example.com/image.jpg',
    genres: ['Rock'],
  };

  const mockResponseData = {
    id: '1',
    ...mockTrackData,
    slug: 'test-song',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    audioFile: null,
  };

  let dispatch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    dispatch = vi.fn();
  });

  test('dispatches fulfilled on valid track', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponseData });

    const thunk = addTrack(mockTrackData);
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${API_URL}/tracks`,
      mockTrackData
    );
    expect(result.payload).toEqual(mockResponseData);
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'addModalForm/addTrack/pending' }));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'addModalForm/addTrack/fulfilled' }));
  });

  test('dispatches rejected on API error', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('API failed'));

    const thunk = addTrack(mockTrackData);
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.payload).toBe('Failed to add track');
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'addModalForm/addTrack/rejected' }));
  });
});


