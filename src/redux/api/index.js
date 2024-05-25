import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
// import { setCredentials } from '../slices/authSlice'
import { HYDRATE } from 'next-redux-wrapper'
import { REHYDRATE } from 'redux-persist'

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3055/v1/api/',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken
    const clientId = getState().auth.clientId
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

  // if (result?.error?.status === 403) {
  //   console.log("sending refresh token");
  //   const auth = api.getState().auth

  //   const refreshResult = await baseQuery(
  //     {
  //       url: "/shop/handleRefreshToken",
  //       method: 'POST',
  //       body: { refreshToken: auth.refreshToken }
  //     },
  //     { ...api },
  //     extraOptions
  //   );

  //   console.log(refreshResult, 'refreshResult');
  //   console.log(refreshResult.data.metadata, 'datadatadatadatadata')
  //   if (refreshResult.data.status === 200) {
  //     // store the new token
  //     const refreshResultData = {
  //       accessToken: refreshResult.data.metadata.tokens.accessToken,
  //       refreshToken: refreshResult.data.metadata.tokens.refreshToken,
  //       clientId: refreshResult.data.metadata.user.userId,
  //     }
  //     console.log(refreshResultData, 'datadatadatadatadata')
  //     api.dispatch(setCredentials({ ...refreshResultData }));

  //     // retry original query with new access token
  //     result = await baseQuery(args, api, extraOptions);
  //   } else {
  //     if (refreshResult?.error?.status === 403) {
  //       refreshResult.error.data.message = "Your login has expired. ";
  //     }
  //     return refreshResult;
  //   }
  // }

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
