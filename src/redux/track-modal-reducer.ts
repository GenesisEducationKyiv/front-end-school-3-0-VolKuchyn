import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { TrackType } from '../types/track-type';
import { TrackSchema } from '../schemas/track-schema';
import { Result, err, ok } from 'neverthrow';

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

const fetchTrackBySlugSafe = async (slug: string): Promise<Result<TrackType, string>> => {
  try {
    const res = await axios.get(`http://localhost:8000/api/tracks/${slug}`);
    const parsed = TrackSchema.safeParse(res.data);

    if (!parsed.success) {
      return err('❌ Invalid track format from server.');
    }

    return ok(parsed.data);
  } catch {
    return err('❌ Failed to fetch track.');
  }
};

export const fetchTrackBySlug = createAsyncThunk<
  TrackType,
  string,
  { rejectValue: string }
>('trackModal/fetchTrackBySlug', async (slug, { rejectWithValue }) => {
  const result = await fetchTrackBySlugSafe(slug);

  if (result.isErr()) {
    return rejectWithValue(result.error);
  }

  return result.value;
});

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
        state.error = action.payload ?? 'Unknown error';
        state.isLoading = false;
      });
  },
});

export const {
  openTrackModal,
  closeTrackModal,
  startClosing,
  updateTrackInModal,
} = trackModalSlice.actions;

export default trackModalSlice.reducer;