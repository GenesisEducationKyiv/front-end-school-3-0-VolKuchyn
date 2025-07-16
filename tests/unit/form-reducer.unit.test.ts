import {
  describe,
  it,
  test,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  beforeEach,
} from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import reducer, {
  openModal,
  toggleGenre,
} from '../../src/redux/form-reducer';
import { formApi } from '../../src/redux/api/formApi';
import { configureStore } from '@reduxjs/toolkit';

type TrackPayload = {
  title: string;
  artist: string;
  album: string;
  coverImage: string;
  genres: string[];
};

const mockTrackData: TrackPayload = {
  title: 'Test Song',
  artist: 'Test Artist',
  album: 'Test Album',
  coverImage: 'https://example.com/image.jpg',
  genres: ['Rock'],
};

const API_URL = import.meta.env.VITE_API_URL;

vi.mock('axios');
const mockedAxios = axios as unknown as {
  get: ReturnType<typeof vi.fn>;
  post: ReturnType<typeof vi.fn>;

};

const server = setupServer(
  http.get('http://localhost:8000/api/genres', () => {
    return HttpResponse.json(['Rock', 'Jazz']);
  }),

  http.post('http://localhost:8000/api/tracks', async ({ request }) => {
    const body = (await request.json()) as TrackPayload;

    return HttpResponse.json({
      id: '1',
      ...body,
      slug: 'test-song',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      audioFile: null,
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const setupTestStore = () =>
  configureStore({
    reducer: {
      [formApi.reducerPath]: formApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(formApi.middleware),
  });

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

describe('formReducer basic logic', () => {
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

describe('formApi: fetchGenres', () => {
  let store: ReturnType<typeof setupTestStore>;

  beforeEach(() => {
    store = setupTestStore();
  });

  test('returns genres on valid response', async () => {
    const result = await store.dispatch(
      formApi.endpoints.fetchGenres.initiate()
    );

    expect(mockedAxios.get).toHaveBeenCalledWith(`${API_URL}/genres`);
    expect(result.payload).toEqual(['Rock', 'Jazz']);
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'addModalForm/fetchGenres/pending' }));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'addModalForm/fetchGenres/fulfilled' }));

  });

  test('returns error on invalid data', async () => {
    server.use(
      http.get('http://localhost:8000/api/genres', () => {
        return HttpResponse.json(123);
      })
    );

    const result = await store.dispatch(
      formApi.endpoints.fetchGenres.initiate()
    );

    expect(result.error).toBeDefined();
  });
});

describe('formApi: addTrack', () => {
  let store: ReturnType<typeof setupTestStore>;

  beforeEach(() => {
    store = setupTestStore();
  });

  test('dispatches fulfilled on valid track', async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: mockResponseData });

    const thunk = addTrack(mockTrackData);
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(mockedAxios.post).toHaveBeenCalledWith(
      `${API_URL}/tracks`,
      mockTrackData

    );

    expect(result.data).toMatchObject({
      id: '1',
      ...mockTrackData,
      slug: 'test-song',
      audioFile: null,
    });  });

  test('returns error on API failure', async () => {
    server.use(
      http.post('http://localhost:8000/api/tracks', () => {
        return new HttpResponse(null, { status: 500 });
      })
    );

    const result = await store.dispatch(
      formApi.endpoints.addTrack.initiate(mockTrackData)
    );

    expect(result.error).toBeDefined();
  });
});