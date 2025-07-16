import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TrackType } from '../types/track-type';

const API_URL = import.meta.env.VITE_API_URL;


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
    const res = await axios.get(`${API_URL}/tracks/${slug}`);
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