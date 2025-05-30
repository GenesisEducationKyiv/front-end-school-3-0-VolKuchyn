import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { TrackType } from '../types/track-type'; // Імпортуй звідки ти створив тип Track

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

export const fetchTrackBySlug = createAsyncThunk<TrackType, string, { rejectValue: string }>(
  'trackModal/fetchTrackBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const res = await axios.get<TrackType>(`http://localhost:8000/api/tracks/${slug}`);
      return res.data;
    } catch (err) {
      return rejectWithValue('❌ Track not found!');
    }
  }
);

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
    },
    updateTrackInModal(state, action: PayloadAction<Partial<TrackType> & { id: string }>) {
      if (state.track && state.track.id === action.payload.id) {
        state.track = { ...state.track, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrackBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTrackBySlug.fulfilled, (state, action) => {
        state.track = action.payload;
        state.isOpen = true;
        state.isClosing = false;
        state.isLoading = false;
      })
      .addCase(fetchTrackBySlug.rejected, (state, action) => {
        state.error = action.payload || 'Unknown error';
        state.isLoading = false;
      });
  },
});

export const { openTrackModal, closeTrackModal, startClosing, updateTrackInModal } = trackModalSlice.actions;
export default trackModalSlice.reducer;