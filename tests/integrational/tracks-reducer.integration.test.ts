import { vi, describe, beforeEach, test, expect } from 'vitest';
import axios from 'axios';
import { fetchAllTracks } from '../../src/redux/tracks-reducer';
import { setupTestStore, TestRootState, TestDispatch } from '../test-utils/setupTestStore';

vi.mock('axios');

const mockedAxios = vi.mocked(axios);

const mockTrack = {
  id: '1',
  title: 'Mock Song',
  artist: 'Mock Artist',
  album: 'Mock Album',
  coverImage: 'https://example.com/img.jpg',
  genres: ['Rock'],
  slug: 'mock-song',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  audioFile: null,
};

describe('Integration: Redux logic - fetchAllTracks', () => {
  let store: ReturnType<typeof setupTestStore>;
  let dispatch: TestDispatch;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupTestStore();
    dispatch = store.dispatch;
  });

  test('fetchAllTracks updates state when API succeeds', async () => {
    (mockedAxios.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      data: {
        data: [mockTrack],
        meta: { total: 1, totalPages: 1, page: 1, limit: 10 },
      },
    });

    await dispatch(fetchAllTracks());
    const state: TestRootState = store.getState();

    expect(state.tracks.tracks.length).toBe(1);
    expect(state.tracks.tracks[0].title).toBe('Mock Song');
    expect(state.tracks.totalPages).toBe(1);
    expect(state.tracks.isTracksLoading).toBe(false);
  });
});