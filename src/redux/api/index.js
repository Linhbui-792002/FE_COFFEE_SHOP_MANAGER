import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { HYDRATE } from 'next-redux-wrapper'
import { REHYDRATE } from 'redux-persist'
import { setCredentials, logout } from '../slices/authSlice'
import Cookies from 'js-cookie'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth?.accessToken
    const clientId = getState().auth?.account?._id
    console.log(getState(), 'getState()')
    console.log('Token:', token)
    console.log('Client ID:', clientId)
    if (token && clientId) {
      headers.set('authorization', `Bearer ${token}`)
      headers.set('x-client-id', clientId)
    }
    return headers
  }
})

const baseQueryWithInterceptor = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  console.log(result, 'result')
  if (result?.error?.status === 403) {
    console.log('sending refresh token')
    const auth = api.getState().auth

    const refreshResult = await baseQuery(
      {
        url: '/handleRefreshToken',
        method: 'POST',
        body: { refreshToken: auth.refreshToken }
      },
      { ...api },
      extraOptions
    )

    console.log(refreshResult?.error?.status, 'refreshResult')
    if (refreshResult?.error?.status === 500) {
      Cookies.remove('accessToken')
      window.location.replace(window.location.pathname)
    }
    if (refreshResult.data.status === 200) {
      // store the new token
      const refreshResultData = {
        accessToken: refreshResult.data.metadata.tokens.accessToken,
        refreshToken: refreshResult.data.metadata.tokens.refreshToken,
        account: refreshResult.data.metadata.account
      }
      api.dispatch(setCredentials({ ...refreshResultData }))

      // retry original query with new access token
      result = await baseQuery(args, api, extraOptions)
    } else if (refreshResult?.error?.status === 403) {
      api.dispatch(logout())
      refreshResult.error.data.message = 'Your login has expired. '
      console.log(refreshResult.error.data.message, 'refreshResult.error.data.message')
      return refreshResult
    }
  }

  return result
}

export const api = createApi({
  baseQuery: baseQueryWithInterceptor,
  reducerPath: 'api',
  tagTypes: ['FAVORITE', 'STATUS'],
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === REHYDRATE) {
      return action.payload?.[reducerPath]
    }
    if (action.type === HYDRATE) {
      return action.payload[reducerPath]
    }
    return undefined
  },
  endpoints: () => ({})
})
