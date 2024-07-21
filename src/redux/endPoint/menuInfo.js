import { api } from '../api'

export const menuInfoApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllMenuInfo: builder.query({
      query: () => ({
        url: '/menuInfo'
      }),
      transformResponse: res => res.metadata,
      providesTags: (result, error, arg) =>
        result ? [...result.map(({ _id }) => ({ type: 'MenuInfosTag', _id })), 'MenuInfosTag'] : ['MenuInfosTag']
    }),
    getOneMenuInfo: builder.query({
      query: menuInfoId => ({
        url: `/menuInfo/${menuInfoId}`
      }),
      transformResponse: res => res.metadata,
      providesTags: ['MenuInfosTag']
    }),
    createMenuInfo: builder.mutation({
      query: body => ({
        url: '/menuInfo',
        method: 'POST',
        body
      }),
      invalidatesTags: ['MenuInfosTag']
    }),
    updateMenuInfo: builder.mutation({
      query: body => ({
        url: '/menuInfo',
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['MenuInfosTag']
    })
  })
})

export const { useCreateMenuInfoMutation, useGetAllMenuInfoQuery, useGetOneMenuInfoQuery, useUpdateMenuInfoMutation } =
  menuInfoApi
