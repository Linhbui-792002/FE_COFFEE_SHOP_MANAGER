import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import authSlice from '../slices/authSlice'
import { authApi } from '../endPoint/auth'
import { root } from 'postcss'
import { persistReducer, persistStore } from 'redux-persist'
import { employeeApi } from '../endPoint/employee'
import { salaryApi } from '../endPoint/salary'
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'
import { uploadApi } from '../endPoint/upload'
import { generalApi } from '../endPoint/general'
import { productCategoryApi } from '../endPoint/productCategory'
import { menuInfoApi } from '../endPoint/menuInfo'
import orderSlice from '../slices/orderSlice'
import { productApi } from '../endPoint/product'

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
  whitelist: ['auth', 'order']
}

const makeStore = () => {
  //add reducers
  const rootReducer = combineReducers({
    auth: authSlice,
    order: orderSlice,
    [authApi.reducerPath]: authApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [generalApi.reducerPath]: generalApi.reducer,
    [menuInfoApi.reducerPath]: menuInfoApi.reducer,
    [salaryApi.reducerPath]: salaryApi.reducer,
    [productCategoryApi.reducerPath]: productCategoryApi.reducer,
    [productApi.reducerPath]: productApi.reducer
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
        generalApi.middleware,
        menuInfoApi.middleware,
        salaryApi.middleware,
        productApi.middleware
      ])
  })

  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()

export const persistor = typeof window !== 'undefined' ? persistStore(store) : null
