import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import tracksReducer from './tracks-reducer';
import formReducer from './form-reducer';
import toastReducer from './toast-reducer';
import playerReducer from './player-reducer';
import trackModalReducer from './track-modal-reducer';
import confirmReducer from './confirm-reducer';

export const rootReducer = combineReducers({
  tracks: tracksReducer,
  form: formReducer,
  toast: toastReducer,
  player: playerReducer,
  trackModal: trackModalReducer,
  confirm: confirmReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;