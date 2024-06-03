import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authSlice from '../slices/authSlice'
import { authApi } from '../endPoint/auth'
import { root } from 'postcss'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: root,
  storage,
  whitelist: ['auth']
}

const makeStore = () => {
  //add reducers
  const rootReducer = combineReducers({
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer
  })

  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ serializableCheck: false }).concat([
        //add middleware
        authApi.middleware
      ])
  })

  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()
export const persistor = typeof window !== 'undefined' ? persistStore(store) : null
