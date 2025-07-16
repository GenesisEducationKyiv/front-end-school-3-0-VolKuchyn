import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { z } from "zod";
import {
  TrackSchema,
  type TrackType,
  type TrackCreateType,
} from "../schemas/track-schema";
import { ok, err, Result } from "neverthrow";

const API_URL = import.meta.env.VITE_API_URL;

const GenresSchema = z.array(z.string());


interface FormState {
  selectedGenres: string[];
  isModalOpened: boolean;
  isClosing: boolean;
  currentTrack: TrackType | null;
  modalMode: string | null;
  savedTrack?: TrackType;
}

const initialState: FormState = {
  selectedGenres: [],
  isModalOpened: false,
  isClosing: false,
  currentTrack: null,
  modalMode: null,
};

export const formSlice = createSlice({
  name: 'form',
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
      state.modalMode = null;
      state.savedTrack = undefined;
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
    setModalMode(state, action: PayloadAction<string | null>) {
      state.modalMode = action.payload;
    },
    setSavedTrack(state, action: PayloadAction<TrackType>) {
      state.savedTrack = action.payload;
    },
  },
});

export const {
  openModal,
  closeModal,
  startClosingModal,
  toggleGenre,
  setCurrentTrack,
  setModalMode,
  setSavedTrack,
} = formSlice.actions;

export default formSlice.reducer;