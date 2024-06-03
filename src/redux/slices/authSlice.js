import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'

const initialState = {
  accessToken: null,
  refreshToken: null,
  account: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, { payload }) => {
      const { accessToken, refreshToken, account } = payload
      Cookies.set('accessToken', accessToken)
      state.accessToken = accessToken
      state.refreshToken = refreshToken
      state.account = account
    },
    logOut: (state, action) => {
      Cookies.remove('accessToken')
      state.accessToken = null
      state.refreshToken = null
      state.account = null
    }
  }
})

export const { setCredentials, logOut } = authSlice.actions

export default authSlice.reducer
