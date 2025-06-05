import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConfirmState {
  isOpen: boolean;
  isClosing: boolean;
  message: string;
}

const initialState: ConfirmState = {
  isOpen: false,
  isClosing: false,
  message: '',
};

const confirmSlice = createSlice({
  name: 'confirm',
  initialState,
  reducers: {
    showConfirm(state, action: PayloadAction<{ message: string }>) {
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

export const { showConfirm, hideConfirm, startClosing } = confirmSlice.actions;
export default confirmSlice.reducer;