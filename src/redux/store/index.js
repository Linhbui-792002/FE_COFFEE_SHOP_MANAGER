import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authSlice from '../slices/authSlice'
import { authApi } from '../endPoint/auth'
import { root } from 'postcss'
import { persistReducer, persistStore } from 'redux-persist'
import { employeeApi } from '../endPoint/employee'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
import { uploadApi } from '../endPoint/upload'
import { generalApi } from '../endPoint/general'
import { productCategoryApi } from '../endPoint/productCategory'

const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null)
    },
    setItem(_key, value) {
      return Promise.resolve(value)
    },
    removeItem(_key) {
      return Promise.resolve()
    }
  }
}

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage()

const persistConfig = {
  key: root,
  storage,
  whitelist: ['auth']
}

const makeStore = () => {
  //add reducers
  const rootReducer = combineReducers({
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [generalApi.reducerPath]: generalApi.reducer,
    [productCategoryApi.reducerPath]: productCategoryApi.reducer
  })

  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ serializableCheck: false }).concat([
        //add middleware
        authApi.middleware,
        employeeApi.middleware,
        uploadApi.middleware,
        generalApi.middleware
      ])
  })

  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

export const persistor = typeof window !== 'undefined' ? persistStore(store) : null
