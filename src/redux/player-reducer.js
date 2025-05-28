import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    currentTrack: null,
    isPlaying: false,
    isLoading: false,
    error: null,
};

let currentTrackAbortController = null;

export const loadTrack = createAsyncThunk('player/loadTrack', async ({ fileName, title, artist, id }, { rejectWithValue }) => {
    if (currentTrackAbortController) {
        currentTrackAbortController.abort();
    }

    currentTrackAbortController = new AbortController();

    try {
        const response = await axios.get(`http://localhost:8000/api/files/${fileName}`, {
            responseType: 'blob',
            signal: currentTrackAbortController.signal,
        });

        const blobUrl = URL.createObjectURL(response.data);

        return {
            fileName,
            url: blobUrl,
            title,
            artist,
            id,
        };
    } catch (error) {
        if (axios.isCancel?.(error) || error.name === 'CanceledError') {
            return rejectWithValue('Cancelled');
        }

        return rejectWithValue('Could not download the track');
    }
}
);

const playerReducer = createSlice({
    name: 'player',
    initialState,
    reducers: {
        togglePlay(state) {
            state.isPlaying = !state.isPlaying;
        },
        stopTrack(state) {
            state.currentTrack = null;
            state.isPlaying = false;
        },
        pauseTrack(state) {
            state.isPlaying = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTrack.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.currentTrack = null;
                state.isPlaying = false;
            })
            .addCase(loadTrack.fulfilled, (state, action) => {
                state.currentTrack = {
                    file: action.payload.fileName,
                    url: action.payload.url,
                    title: action.payload.title,
                    artist: action.payload.artist,
                    id: action.payload.id,
                };
                state.isPlaying = true;
                state.isLoading = false;
            })
            .addCase(loadTrack.rejected, (state, action) => {
                if (action.payload === 'Cancelled') {
                    return;
                }
                state.error = action.payload;
                state.isLoading = false;
            });
    }
});

export const { setTrack, togglePlay, setProgress, stopTrack, pauseTrack } = playerReducer.actions;
export default playerReducer.reducer;