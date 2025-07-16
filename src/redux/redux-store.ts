import { configureStore } from '@reduxjs/toolkit';

import tracksReducer from './tracks-reducer';
import formReducer from './form-reducer';
import toastReducer from './toast-reducer';
import playerReducer from './player-reducer';
import trackModalReducer from './track-modal-reducer';
import confirmReducer from './confirm-reducer';

import { tracksApi } from './api/tracksApi';
import { formApi } from './api/formApi';
import { playerApi } from './api/playerApi';
import { trackModalApi } from './api/trackModalApi';

const store = configureStore({
  reducer: {
    tracks: tracksReducer,
    form: formReducer,
    toast: toastReducer,
    player: playerReducer,
    trackModal: trackModalReducer,
    confirm: confirmReducer,

    [tracksApi.reducerPath]: tracksApi.reducer,
    [formApi.reducerPath]: formApi.reducer,
    [playerApi.reducerPath]: playerApi.reducer,
    [trackModalApi.reducerPath]: trackModalApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      tracksApi.middleware,
      formApi.middleware,
      playerApi.middleware,
      trackModalApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;