import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '../types/track-type';

interface TrackModalState {
  isOpen: boolean;
  isClosing: boolean;
  track: TrackType | null;
  error: string | null;
  isLoading: boolean;
}

const initialState: TrackModalState = {
  isOpen: false,
  isClosing: false,
  track: null,
  error: null,
  isLoading: false,
};

const trackModalSlice = createSlice({
  name: 'trackModal',
  initialState,
  reducers: {
    openTrackModal(state, action: PayloadAction<{ track: TrackType }>) {
      state.track = action.payload.track;
      state.isOpen = true;
      state.isClosing = false;
    },
    startClosing(state) {
      state.isClosing = true;
    },
    closeTrackModal(state) {
      state.track = null;
      state.isOpen = false;
      state.isClosing = false;
    },
    updateTrackInModal(state, action: PayloadAction<Partial<TrackType> & { id: string }>) {
      if (state.track?.id === action.payload.id) {
        state.track = { ...state.track, ...action.payload };
      }
    },
    setTrackLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setTrackError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

export const {
  openTrackModal,
  closeTrackModal,
  startClosing,
  updateTrackInModal,
  setTrackLoading,
  setTrackError,
} = trackModalSlice.actions;

export default trackModalSlice.reducer;