import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type SortOrder = 'asc' | 'desc';

interface TracksUIState {
  currentPage: number;
  sort: string;
  order: SortOrder;
  search: string;
  genre: string;
  artist: string;
  uploadingTrackId: string | null;
  shouldRefetch: boolean;
}

const initialState: TracksUIState = {
  currentPage: 1,
  sort: 'title',
  order: 'asc',
  search: '',
  genre: '',
  artist: '',
  uploadingTrackId: null,
  shouldRefetch: false,
};

export const tracksSlice = createSlice({
  name: 'tracksUI',
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },
    setSort(state, action: PayloadAction<string>) {
      state.sort = action.payload;
      state.currentPage = 1;
    },
    setOrder(state, action: PayloadAction<SortOrder>) {
      state.order = action.payload;
      state.currentPage = 1;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
      state.currentPage = 1;
    },
    setGenre(state, action: PayloadAction<string>) {
      state.genre = action.payload;
      state.currentPage = 1;
    },
    setArtist(state, action: PayloadAction<string>) {
      state.artist = action.payload;
      state.currentPage = 1;
    },
    setUploadingTrackId(state, action: PayloadAction<string | null>) {
      state.uploadingTrackId = action.payload;
    },
    triggerRefetch(state) {
      state.shouldRefetch = true;
    },
    resetRefetch(state) {
      state.shouldRefetch = false;
    },
  },
});

export const {
  setPage,
  setSort,
  setOrder,
  setSearch,
  setGenre,
  setArtist,
  setUploadingTrackId,
  triggerRefetch,
  resetRefetch,
} = tracksSlice.actions;

export default tracksSlice.reducer;