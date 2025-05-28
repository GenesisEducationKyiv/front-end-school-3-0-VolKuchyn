import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isOpen: false,
  isClosing: false,
  track: null,
  error: null,
  isLoading: false,
};


export const fetchTrackBySlug = createAsyncThunk('trackModal/fetchTrackBySlug', async (slug, { rejectWithValue }) => {
  try {
    const res = await axios.get(`http://localhost:8000/api/tracks/${slug}`);
    return res.data;
  } catch (err) {
    return rejectWithValue('❌ Track not found!');
  }
});

const trackModalReducer = createSlice({
  name: 'trackModal',
  initialState,
  reducers: {
    openTrackModal(state, action) {
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
    updateTrackInModal(state, action) {
      if (state.track && state.track.id === action.payload.id) {
        state.track = { ...state.track, ...action.payload };
      }
    }
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
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const { openTrackModal, closeTrackModal, startClosing } = trackModalReducer.actions;
export default trackModalReducer.reducer;