import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

let initialState = {
    selectedGenres: [],

    isModalOpened: false,
    isClosing: false,

    genres: [],

    currentTrack: null,
    modalMode: null,

    isGenresLoading: false,
    isTrackSaving: false,
    error: null,

}


export const fetchGenres = createAsyncThunk('addModalForm/fetchGenres', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${API_URL}/genres`);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error when loading genres!");
    }
});

export const addTrack = createAsyncThunk('addModalForm/addTrack', async (trackData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/tracks`, trackData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error when adding a track!");
    }
});

export const updateTrack = createAsyncThunk('addModalForm/updateTrack', async ({ id, updatedData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${API_URL}/tracks/${id}`, updatedData);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Error when updating a track!");
    }
});




export const formReducer = createSlice({
    name: 'form',
    initialState,
    reducers: {
        openModal: (state, action) => {
            state.isModalOpened = true;
            state.isClosing = false;
        },
        closeModal: (state) => {
            state.isModalOpened = false;
            state.isClosing = false;
            state.selectedGenres = [];
            state.currentTrack = null;
        },
        startClosingModal: (state) => {
            state.isClosing = true;
        },
        toggleGenre: (state, action) => {
            const genre = action.payload;
            if (state.selectedGenres.includes(genre)) {
                state.selectedGenres = state.selectedGenres.filter((g) => g !== genre);
            } else {
                state.selectedGenres.push(genre);
            }
        },
        setCurrentTrack: (state, action) => {
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
                state.isGenresLoading = false;
                state.genres = action.payload;
                state.error = null;
            })
            .addCase(fetchGenres.rejected, (state, action) => {
                state.isGenresLoading = false;
                state.error = action.payload;
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
                state.selectedGenres = [];
                state.isTrackSaving = false;
                state.error = action.payload;
            })
            .addCase(updateTrack.fulfilled, (state) => {
                state.isTrackSaving = false;
            })
    }
})

export const { openModal, closeModal, startClosingModal, toggleGenre, setTitle, setCurrentTrack } = formReducer.actions;

export default formReducer.reducer;