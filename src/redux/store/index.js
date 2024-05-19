import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

const makeStore = () => {
  //add reducers
  const reducers = {}
  const store = configureStore({
    reducer: reducers,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({ serializableCheck: false }).concat([
        //add middleware
      ])
  })
  setupListeners(store.dispatch)
  return store
}

export const store = makeStore()
