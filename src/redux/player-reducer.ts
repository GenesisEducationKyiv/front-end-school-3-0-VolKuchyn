import { createSlice } from '@reduxjs/toolkit';
import { CurrentTrack } from './api/playerApi';

interface PlayerState {
  currentTrack: CurrentTrack | null;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: PlayerState = {
  currentTrack: null,
  isPlaying: false,
  isLoading: false,
  error: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    togglePlay(state) {
      state.isPlaying = !state.isPlaying;
    },
    stopTrack(state) {
      state.currentTrack = null;
      state.isPlaying = false;
    },
    pauseTrack(state) {
      state.isPlaying = false;
    },
    setCurrentTrack(state, action) {
      state.currentTrack = action.payload;
      state.isPlaying = true;
      state.isLoading = false;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const {
  togglePlay,
  stopTrack,
  pauseTrack,
  setCurrentTrack,
  setLoading,
  setError,
} = playerSlice.actions;

export default playerSlice.reducer;