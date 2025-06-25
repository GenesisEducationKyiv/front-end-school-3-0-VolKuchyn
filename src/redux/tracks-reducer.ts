import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TracksUIState {
  currentPage: number;
  sort: string;
  order: 'asc' | 'desc';
  search: string;
  genre: string;
  artist: string;
  uploadingTrackId: string | null;
}

const initialState: TracksUIState = {
  currentPage: 1,
  sort: 'title',
  order: 'asc',
  search: '',
  genre: '',
  artist: '',
  uploadingTrackId: null,
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
    setOrder(state, action: PayloadAction<'asc' | 'desc'>) {
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
} = tracksSlice.actions;

export default tracksSlice.reducer;