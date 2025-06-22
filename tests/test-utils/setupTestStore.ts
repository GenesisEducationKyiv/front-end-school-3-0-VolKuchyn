import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../../src/redux/redux-store';

export const setupTestStore = () => {
  return configureStore({
    reducer: rootReducer,
  });
};

export type TestStore = ReturnType<typeof setupTestStore>;
export type TestRootState = ReturnType<TestStore['getState']>;
export type TestDispatch = TestStore['dispatch'];