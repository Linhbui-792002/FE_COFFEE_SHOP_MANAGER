import { createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import { jwtDecode } from 'jwt-decode'

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
      const decodedToken = jwtDecode(accessToken)
      const accessTokenExpiry = decodedToken.exp

      const expires = new Date(accessTokenExpiry * 1000)
      Cookies.set('accessToken', accessToken, { expires })
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
