import { configureStore } from '@reduxjs/toolkit';
import tracksReducer from '../../src/redux/tracks-reducer';
import formReducer from '../../src/redux/form-reducer';
import toastReducer from '../../src/redux/toast-reducer';
import playerReducer from '../../src/redux/player-reducer';
import trackModalReducer from '../../src/redux/track-modal-reducer';
import confirmReducer from '../../src/redux/confirm-reducer';

import { tracksApi } from '../../src/redux/api/tracksApi';
import { formApi } from '../../src/redux/api/formApi';
import { playerApi } from '../../src/redux/api/playerApi';
import { trackModalApi } from '../../src/redux/api/trackModalApi';

export const setupTestStore = () => {
  return configureStore({
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
};

export type TestStore = ReturnType<typeof setupTestStore>;
export type TestRootState = ReturnType<TestStore['getState']>;
export type TestDispatch = TestStore['dispatch'];