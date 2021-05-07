import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import inspectorReducer from './slice';

export const store = configureStore({
  reducer: {
    inspector: inspectorReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
