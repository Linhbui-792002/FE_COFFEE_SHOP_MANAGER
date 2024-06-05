import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authSlice from '../slices/authSlice'
import { authApi } from '../endPoint/auth'
import { root } from 'postcss'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { employeeApi } from '../endPoint/employee'
import orderSlice from '../slices/orderSlice'

const persistConfig = {
  key: root,
  storage,
  whitelist: ['auth', 'order']
}

const makeStore = () => {
  //add reducers
  const rootReducer = combineReducers({
    auth: authSlice,
    order: orderSlice,
    [authApi.reducerPath]: authApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer
  })

  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ serializableCheck: false }).concat([
        //add middleware
        authApi.middleware,
        employeeApi.middleware
      ])
  })

  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()
export const persistor = typeof window !== 'undefined' ? persistStore(store) : null
