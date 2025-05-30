import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./redux-store";
import { TrackType } from "../types/track-type";

const API_URL = "http://localhost:8000/api";

interface TracksMeta {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}

interface TracksState {
  tracks: TrackType[];
  length: number;
  currentPage: number;
  totalPages: number;
  paginationLength: number;
  sort: string;
  order: "asc" | "desc";
  search: string;
  genre: string;
  artist: string;
  isTracksLoading: boolean;
  uploadingTrackId: string | null;
  error: string | null;
}

const initialState: TracksState = {
  tracks: [],
  length: 0,
  currentPage: 1,
  totalPages: 0,
  paginationLength: 10,
  sort: "title",
  order: "asc",
  search: "",
  genre: "",
  artist: "",
  isTracksLoading: false,
  uploadingTrackId: null,
  error: null,
};

export const fetchAllTracks = createAsyncThunk<
  { data: TrackType[]; meta: TracksMeta },
  void,
  { state: RootState; rejectValue: string }
>("tracks/fetchAllTracks", async (_, { getState, rejectWithValue }) => {
  const state = getState().tracks;
  const params = new URLSearchParams();

  params.append("page", String(state.currentPage));
  if (state.sort) params.append("sort", state.sort);
  if (state.order) params.append("order", state.order);
  if (state.search) params.append("search", state.search);
  if (state.genre) params.append("genre", state.genre);
  if (state.artist) params.append("artist", state.artist);

  try {
    const response = await axios.get<{ data: TrackType[]; meta: TracksMeta }>(
      `${API_URL}/tracks?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Loading error!");
  }
});

export const deleteTrack = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("tracks/deleteTrack", async (trackId, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/tracks/${trackId}`);
    return trackId;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error when deleting a track!");
  }
});

export const uploadAudioFile = createAsyncThunk<
  any,
  { id: string; file: File; _uniq?: number }, // ⬅ додано _uniq
  { rejectValue: string }
>(
  "tracks/uploadAudioFile",
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(`${API_URL}/tracks/${id}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Error uploading a file!");
    }
  }
);

export const deleteAudioFile = createAsyncThunk<
  { id: string; data: any },
  string,
  { rejectValue: string }
>("tracks/deleteAudioFile", async (id, { rejectWithValue }) => {
  try {
    const response = await axios.delete(`${API_URL}/tracks/${id}/file`);
    return { id, data: response.data };
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Error when deleting an audio file");
  }
});

export const tracksReducer = createSlice({
  name: "tracks",
  initialState,
  reducers: {
    setPage(state, action: PayloadAction<number>) {
      const newPage = action.payload;
      if (newPage === state.currentPage || newPage < 1 || newPage > state.totalPages) return;
      state.currentPage = newPage;
    },
    setSort(state, action: PayloadAction<string>) {
      state.sort = action.payload;
      state.currentPage = 1;
    },
    setOrder(state, action: PayloadAction<"asc" | "desc">) {
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTracks.pending, (state) => {
        state.tracks = [];
        state.length = 0;
        state.isTracksLoading = true;
        state.error = null;
      })
      .addCase(fetchAllTracks.fulfilled, (state, action) => {
        state.isTracksLoading = false;
        state.tracks = action.payload.data;
        state.length = action.payload.meta.total;
        state.totalPages = action.payload.meta.totalPages;
        state.paginationLength = action.payload.meta.limit;
        state.currentPage = action.payload.meta.page;
        state.error = null;
      })
      .addCase(fetchAllTracks.rejected, (state, action) => {
        state.isTracksLoading = false;
        state.error = action.payload || "Unknown error";
      })
      .addCase(deleteTrack.fulfilled, (state, action) => {
        state.tracks = state.tracks.filter((track) => track.id !== action.payload);
      })
      .addCase(deleteTrack.rejected, (state, action) => {
        state.error = action.payload || "Error deleting track";
      })
      .addCase(uploadAudioFile.pending, (state, action) => {
        state.uploadingTrackId = action.meta.arg.id;
      })
      .addCase(uploadAudioFile.fulfilled, (state) => {
        state.uploadingTrackId = null;
      })
      .addCase(uploadAudioFile.rejected, (state, action) => {
        state.uploadingTrackId = null;
        state.error = action.payload || "Error uploading file";
      })
      .addCase(deleteAudioFile.fulfilled, (state, action) => {
        const id = action.payload.id;
        const track = state.tracks.find((t) => t.id === id);
        if (track) {
          track.audioFile = null;
        }
      });
  },
});

export const {
  setPage,
  setArtist,
  setGenre,
  setOrder,
  setSearch,
  setSort,
} = tracksReducer.actions;

export default tracksReducer.reducer;