import { api } from '../api'

export const employeeApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllAccount: builder.query({
      query: () => ({
        url: '/account'
      }),
      transformResponse: res => {
        return { metadata: res?.metadata, options: res?.options }
      },
      providesTags: (result, error, arg) => {
        return result
          ? [...result.metadata.map(({ _id }) => ({ type: 'AccountsTag', _id })), 'AccountsTag']
          : ['AccountsTag']
      }
    }),
    getInfoAccount: builder.query({
      query: accountId => ({
        url: `/account/${accountId}`
      }),
      transformResponse: res => res.metadata,
      providesTags: ['AccountsTag']
    }),
    addAccount: builder.mutation({
      query: body => ({
        url: '/account',
        method: 'POST',
        body
      }),
      invalidatesTags: ['AccountsTag']
    }),
    editAccount: builder.mutation({
      query: body => ({
        url: '/account',
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['AccountsTag']
    }),
    resetPassword: builder.mutation({
      query: body => ({
        url: '/account/resetPassword',
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['AccountsTag']
    }),
    blockAccount: builder.mutation({
      query: body => ({
        url: '/account/blockAccount',
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['AccountsTag']
    })
  })
})
export const {
  useGetAllAccountQuery,
  useAddAccountMutation,
  useEditAccountMutation,
  useResetPasswordMutation,
  useGetInfoAccountQuery,
  useBlockAccountMutation
} = employeeApi
