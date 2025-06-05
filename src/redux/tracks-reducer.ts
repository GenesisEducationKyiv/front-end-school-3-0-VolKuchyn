import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { Result, ok, err } from "neverthrow";
import { RootState } from "./redux-store";
import {
    TracksResponseSchema,
    type TrackType,
    type TracksMeta,
} from "../schemas/track-schema";
import { O } from "@mobily/ts-belt";


const API_URL = "http://localhost:8000/api";

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

const fetchTracksSafe = async (url: string): Promise<Result<{ data: TrackType[]; meta: TracksMeta }, string>> => {
    try {
        const response = await axios.get(url);
        const parsed = TracksResponseSchema.safeParse(response.data);
        if (!parsed.success) {
            return err("Invalid data structure from server");
        }
        return ok(parsed.data);
    } catch {
        return err("❌ Failed to fetch tracks");
    }
};

export const fetchAllTracks = createAsyncThunk<
    { data: TrackType[]; meta: TracksMeta },
    void,
    { state: RootState; rejectValue: string }
>("tracks/fetchAllTracks", async (_, { getState, rejectWithValue }) => {
    const state = getState().tracks;
    const params = new URLSearchParams();

    params.append("page", String(state.currentPage));


    const appendIfPresent = (key: string, value: string) => {
        const option = O.fromNullable(value);
        O.tap(option, (v) => {
            params.append(key, v);
        });
    };

    appendIfPresent("sort", state.sort);
    appendIfPresent("order", state.order);
    appendIfPresent("search", state.search);
    appendIfPresent("genre", state.genre);
    appendIfPresent("artist", state.artist);

    const result = await fetchTracksSafe(`${API_URL}/tracks?${params.toString()}`);
    return result.match(
        (val) => val,
        (errorMsg) => rejectWithValue(errorMsg)
    );
});

const deleteTrackSafe = async (trackId: string): Promise<Result<string, string>> => {
    try {
        await axios.delete(`${API_URL}/tracks/${trackId}`);
        return ok(trackId);
    } catch {
        return err("❌ Error deleting track");
    }
};

export const deleteTrack = createAsyncThunk<string, string, { rejectValue: string }>(
    "tracks/deleteTrack",
    async (trackId, { rejectWithValue }) => {
        const result = await deleteTrackSafe(trackId);
        return result.match(
            (val) => val,
            (errorMsg) => rejectWithValue(errorMsg)
        );
    }
);

interface UploadAudioFileArgs {
    id: string;
    file: File;
    _uniq?: number;
}

interface UploadAudioFileResponse {
    id: string;
    audioUrl: string;
}

const uploadAudioFileSafe = async (id: string, file: File): Promise<Result<UploadAudioFileResponse, string>> => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axios.post<{ url?: string }>(
            `${API_URL}/tracks/${id}/upload`,
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );

        return ok({
            id,
            audioUrl: res.data?.url ?? '',
        });
    } catch {
        return err('❌ Error uploading file');
    }
};

export const uploadAudioFile = createAsyncThunk<
    UploadAudioFileResponse,
    UploadAudioFileArgs,
    { rejectValue: string }
>(
    'tracks/uploadAudioFile',
    async ({ id, file }, { rejectWithValue }) => {
        const result = await uploadAudioFileSafe(id, file);
        return result.match(
            (val) => val,
            (errorMsg) => rejectWithValue(errorMsg)
        );
    }
);

const deleteAudioFileSafe = async (id: string): Promise<Result<{ id: string }, string>> => {
    try {
        await axios.delete(`${API_URL}/tracks/${id}/file`);
        return ok({ id });
    } catch {
        return err("❌ Error deleting audio file");
    }
};

export const deleteAudioFile = createAsyncThunk<
    { id: string },
    string,
    { rejectValue: string }
>(
    "tracks/deleteAudioFile",
    async (id, { rejectWithValue }) => {
        const result = await deleteAudioFileSafe(id);
        return result.match(
            (val) => val,
            (errorMsg) => rejectWithValue(errorMsg)
        );
    }
);

export const tracksReducer = createSlice({
    name: "tracks",
    initialState,
    reducers: {
        setPage(state, action: PayloadAction<number>) {
            const newPage = action.payload;
            if (newPage !== state.currentPage && newPage >= 1 && newPage <= state.totalPages) {
                state.currentPage = newPage;
            }
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
                state.isTracksLoading = true;
                state.tracks = [];
                state.error = null;
            })
            .addCase(fetchAllTracks.fulfilled, (state, action) => {
                state.isTracksLoading = false;
                state.tracks = action.payload.data;
                state.length = action.payload.meta.total;
                state.totalPages = action.payload.meta.totalPages;
                state.paginationLength = action.payload.meta.limit;
                state.currentPage = action.payload.meta.page;
            })
            .addCase(fetchAllTracks.rejected, (state, action) => {
                state.isTracksLoading = false;
                state.error = action.payload ?? "Unknown error";
            })
            .addCase(deleteTrack.fulfilled, (state, action) => {
                state.tracks = state.tracks.filter((track) => track.id !== action.payload);
            })
            .addCase(deleteTrack.rejected, (state, action) => {
                state.error = action.payload ?? "Unknown error";
            })
            .addCase(uploadAudioFile.pending, (state, action) => {
                state.uploadingTrackId = action.meta.arg.id;
            })
            .addCase(uploadAudioFile.fulfilled, (state) => {
                state.uploadingTrackId = null;
            })
            .addCase(uploadAudioFile.rejected, (state, action) => {
                state.uploadingTrackId = null;
                state.error = action.payload ?? "Upload error";
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