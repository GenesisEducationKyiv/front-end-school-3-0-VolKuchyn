import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import type { TrackType } from "../types/track-type";

const API_URL = "http://localhost:8000/api";

// Типізація стану
interface FormState {
  selectedGenres: string[];

  isModalOpened: boolean;
  isClosing: boolean;

  genres: string[];

  currentTrack: TrackType | null;
  modalMode: string | null;

  isGenresLoading: boolean;
  isTrackSaving: boolean;
  error: string | null;

  savedTrack?: TrackType;
}

const initialState: FormState = {
  selectedGenres: [],
  isModalOpened: false,
  isClosing: false,
  genres: [],
  currentTrack: null,
  modalMode: null,
  isGenresLoading: false,
  isTrackSaving: false,
  error: null,
};

export const fetchGenres = createAsyncThunk<string[]>(
  "addModalForm/fetchGenres",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/genres`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error when loading genres!");
    }
  }
);

// Async thunk для додавання треку
export const addTrack = createAsyncThunk<TrackType, Partial<TrackType>>(
  "addModalForm/addTrack",
  async (trackData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/tracks`, trackData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error when adding a track!");
    }
  }
);

// Async thunk для оновлення треку
export const updateTrack = createAsyncThunk<
TrackType,
  { id: string; updatedData: Partial<TrackType> }
>(
  "addModalForm/updateTrack",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/tracks/${id}`, updatedData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error when updating a track!");
    }
  }
);

// Slice
export const formReducer = createSlice({
  name: "form",
  initialState,
  reducers: {
    openModal(state) {
      state.isModalOpened = true;
      state.isClosing = false;
    },
    closeModal(state) {
      state.isModalOpened = false;
      state.isClosing = false;
      state.selectedGenres = [];
      state.currentTrack = null;
    },
    startClosingModal(state) {
      state.isClosing = true;
    },
    toggleGenre(state, action: PayloadAction<string>) {
      const genre = action.payload;
      if (state.selectedGenres.includes(genre)) {
        state.selectedGenres = state.selectedGenres.filter((g) => g !== genre);
      } else {
        state.selectedGenres.push(genre);
      }
    },
    setCurrentTrack(state, action: PayloadAction<TrackType>) {
      const track = action.payload;
      state.currentTrack = track;
      state.selectedGenres = track.genres || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.pending, (state) => {
        state.genres = [];
        state.isGenresLoading = true;
        state.error = null;
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.genres = action.payload;
        state.isGenresLoading = false;
        state.error = null;
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.isGenresLoading = false;
        state.error = action.payload as string;
      })
      .addCase(addTrack.pending, (state) => {
        state.isTrackSaving = true;
        state.error = null;
      })
      .addCase(addTrack.fulfilled, (state, action) => {
        state.isTrackSaving = false;
        state.selectedGenres = [];
        state.savedTrack = action.payload;
      })
      .addCase(addTrack.rejected, (state, action) => {
        state.isTrackSaving = false;
        state.selectedGenres = [];
        state.error = action.payload as string;
      })
      .addCase(updateTrack.fulfilled, (state) => {
        state.isTrackSaving = false;
      });
  },
});

export const {
  openModal,
  closeModal,
  startClosingModal,
  toggleGenre,
  setCurrentTrack,
} = formReducer.actions;

export default formReducer.reducer;