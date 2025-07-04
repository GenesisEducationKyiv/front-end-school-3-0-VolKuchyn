import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { ok, err, Result } from 'neverthrow';

const API_URL = import.meta.env.VITE_API_URL;

interface CurrentTrack {
    file: string;
    url: string;
    title: string;
    artist: string;
    id: string;
}

interface PlayerState {
    currentTrack: CurrentTrack | null;
    isPlaying: boolean;
    isLoading: boolean;
    error: string | null;
}

const initialState: PlayerState = {
    currentTrack: null,
    isPlaying: false,
    isLoading: false,
    error: null,
};

let currentTrackAbortController: AbortController | null = null;

interface LoadTrackArgs {
    fileName: string;
    title: string;
    artist: string;
    id: string;
}

function hasName(error: unknown): error is { name: string } {
    return (
        typeof error === 'object' &&
        error !== null &&
        'name' in error &&
        typeof (error as Record<string, unknown>).name === 'string'
    );
}

function isAxiosError(error: unknown): error is AxiosError {
    return axios.isAxiosError(error);
}

export const loadTrack = createAsyncThunk<
    CurrentTrack,
    LoadTrackArgs,
    { rejectValue: string }
>('player/loadTrack', async ({ fileName, title, artist, id }, { rejectWithValue }) => {
    if (currentTrackAbortController) {
        currentTrackAbortController.abort();
    }

    currentTrackAbortController = new AbortController();

    const result: Result<CurrentTrack, string> = await axios
        .get(`${API_URL}/files/${fileName}`, {
            responseType: 'blob',
            signal: currentTrackAbortController.signal,
        })
        .then((response) => {
            const blobUrl = URL.createObjectURL(response.data);
            return ok({
                file: fileName,
                url: blobUrl,
                title,
                artist,
                id,
            });
        })
        .catch((error: unknown) => {
            if (isAxiosError(error) && axios.isCancel(error)) {
                return err('Cancelled');
            }

            if (hasName(error) && error.name === 'CanceledError') {
                return err('Cancelled');
            }

            return err('Could not download the track');
        });

    if (result.isErr()) {
        return rejectWithValue(result.error);
    }

    return result.value;
});

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
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadTrack.pending, (state) => {
                state.isLoading = true;
                state.error = null;
                state.currentTrack = null;
                state.isPlaying = false;
            })
            .addCase(loadTrack.fulfilled, (state, action: PayloadAction<CurrentTrack>) => {
                state.currentTrack = action.payload;
                state.isPlaying = true;
                state.isLoading = false;
            })
            .addCase(loadTrack.rejected, (state, action) => {
                if (action.payload === 'Cancelled') {
                    return;
                }
                state.error = action.payload as string;
                state.isLoading = false;
            });
    },
});

export const { togglePlay, stopTrack, pauseTrack } = playerReducer.actions;
export default playerReducer.reducer;