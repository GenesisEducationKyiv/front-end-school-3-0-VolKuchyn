import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { z } from "zod";
import {
  TrackSchema,
  type TrackType,
  type TrackCreateType,
} from "../schemas/track-schema";

const API_URL = "http://localhost:8000/api";

const GenresSchema = z.array(z.string());

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

export const fetchGenres = createAsyncThunk<string[], void>(
  "addModalForm/fetchGenres",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/genres`);
      const parsed = GenresSchema.safeParse(res.data);
      if (!parsed.success) {
        return rejectWithValue("Invalid genres format received from server");
      }
      return parsed.data;
    } catch {
      return rejectWithValue("Failed to load genres");
    }
  }
);

export const addTrack = createAsyncThunk<TrackType, TrackCreateType>(
  "addModalForm/addTrack",
  async (trackData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/tracks`, trackData);
      const parsed = TrackSchema.safeParse(res.data);
      if (!parsed.success) {
        return rejectWithValue("Invalid track data from server");
      }
      return parsed.data;
    } catch {
      return rejectWithValue("Failed to add track");
    }
  }
);

export const updateTrack = createAsyncThunk<
  TrackType,
  { id: string; updatedData: Partial<TrackCreateType> }
>(
  "addModalForm/updateTrack",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${API_URL}/tracks/${id}`, updatedData);
      const parsed = TrackSchema.safeParse(res.data);
      if (!parsed.success) {
        return rejectWithValue("Invalid updated track data from server");
      }
      return parsed.data;
    } catch {
      return rejectWithValue("Failed to update track");
    }
  }
);

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
      state.selectedGenres = track.genres;
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
        state.error = typeof action.payload === "string" ? action.payload : "Unknown error";
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
        state.error = typeof action.payload === "string" ? action.payload : "Unknown error";
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
