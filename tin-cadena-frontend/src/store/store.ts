// src/store/store.ts

import {
  combineReducers,
  configureStore,
} from '@reduxjs/toolkit'
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist'
import authReducer from './authSlice'
import cartReducer from './cartSlice'
import favoritesReducer from './favoritesSlice'

const storage = {
  getItem: (
    key: string,
  ): Promise<string | null> => {
    return Promise.resolve(localStorage.getItem(key))
  },

  setItem: (
    key: string,
    value: string,
  ): Promise<void> => {
    localStorage.setItem(key, value)

    return Promise.resolve()
  },

  removeItem: (
    key: string,
  ): Promise<void> => {
    localStorage.removeItem(key)

    return Promise.resolve()
  },
}

const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  favorites: favoritesReducer,
})

const persistConfig = {
  key: 'photomarket',
  storage,
  whitelist: [
    'auth',
    'cart',
    'favorites',
  ],
}

const persistedReducer = persistReducer(
  persistConfig,
  rootReducer,
)

export const store = configureStore({
  reducer: persistedReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          FLUSH,
          REHYDRATE,
          PAUSE,
          PERSIST,
          PURGE,
          REGISTER,
        ],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<
  typeof store.getState
>

export type AppDispatch = typeof store.dispatch