import { vi, describe, beforeEach, test, expect } from 'vitest';
import { tracksApi } from '../../src/redux/api/tracksApi';
import { setupTestStore } from '../test-utils/setupTestStore';

// Мок трек
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

describe('Integration: tracksApi.fetchTracks', () => {
  let store: ReturnType<typeof setupTestStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    store = setupTestStore();
  });

  test('fetchTracks returns data and updates cache on success', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({
            data: [mockTrack],
            meta: { total: 1, totalPages: 1, page: 1, limit: 10 },
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      )
    ));

    const result = await store.dispatch(
      tracksApi.endpoints.fetchTracks.initiate({ page: '1' })
    );

    expect(result.data).toBeDefined();
    expect(result.data?.data.length).toBe(1);
    expect(result.data?.data[0].title).toBe('Mock Song');

    const state = store.getState();
    const cached = tracksApi.endpoints.fetchTracks.select({ page: '1' })(state);

    expect(cached?.data?.meta.totalPages).toBe(1);
    expect(cached?.data?.data[0].id).toBe('1');
  });

  test('fetchTracks returns error on API failure', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.reject(new Error('API failure'))
    ));

    const result = await store.dispatch(
      tracksApi.endpoints.fetchTracks.initiate({ page: '1' })
    );

    expect(result.error).toBeDefined();
    expect('data' in result).toBe(false);
  });
});