import { configureStore } from '@reduxjs/toolkit';
import { userApi } from './api/userApi';
import { aiApi } from './api/aiApi';

export const store = configureStore({
    reducer: {
        [userApi.reducerPath]: userApi.reducer,
        [aiApi.reducerPath]: aiApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(userApi.middleware, aiApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;