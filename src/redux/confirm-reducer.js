import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isOpen: false,
    isClosing: false,
    message: '',
};

const confirmReducer = createSlice({
    name: 'confirm',
    initialState,
    reducers: {
        showConfirm(state, action) {
            state.isOpen = true;
            state.isClosing = false;
            state.message = action.payload.message;
        },
        startClosing(state) {
            state.isClosing = true;
        },
        hideConfirm(state) {
            state.isOpen = false;
            state.isClosing = false;
            state.message = '';
        },
    },
});

export const { showConfirm, hideConfirm, startClosing } = confirmReducer.actions;
export default confirmReducer.reducer;