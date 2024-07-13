import { api } from '../api'
import { logOut } from '../slices/authSlice'
import { setCredentials } from '../slices/authSlice'
import Cookies from 'js-cookie'

export const authApi = api.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation({
      query: body => ({
        url: '/login',
        method: 'POST',
        body
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          const { tokens, account } = data?.metadata
          await dispatch(
            setCredentials({
              accessToken: tokens?.accessToken,
              refreshToken: tokens?.refreshToken,
              account: account
            })
          )
        } catch (error) {
          if (error?.error?.status === 400) {
            dispatch(authApi.endpoints.logout.initiate())
          }
          console.error('Failed to login:', error)
        }
      }
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/logout',
        method: 'POST'
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          dispatch(logOut())
          setTimeout(() => {
            dispatch(api.util.resetApiState())
          }, 1000)
        } catch (err) {
          console.error('Failed to logout:', err)
        }
      }
    }),
    refresh: builder.mutation({
      query: () => ({
        url: '/handleRefreshToken',
        method: 'POST'
      })
    }),
    changePassword: builder.mutation({
      query: body => ({
        url: '/changePassword',
        method: 'PATCH',
        body
      }),
      transformResponse: res => res.metadata
    })
  })
})

export const { useLoginMutation, useRefreshMutation, useLogoutMutation, useChangePasswordMutation } = authApi
