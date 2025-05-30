import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ToastType = 'success' | 'error' | 'info' | 'warning' | null;

interface ToastState {
  message: string | null;
  type: ToastType;
}

const initialState: ToastState = {
  message: null,
  type: null,
};

interface ShowToastPayload {
  message: string;
  type: Exclude<ToastType, null>;
}

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<ShowToastPayload>) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearToast: (state) => {
      state.message = null;
      state.type = null;
    },
  },
});

export const { showToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;