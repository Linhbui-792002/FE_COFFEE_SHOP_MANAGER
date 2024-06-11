import { api } from '../api'

export const menuApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllMenu: builder.query({
      query: () => ({
        url: '/menu'
      }),
      transformResponse: res => res.metadata,
      providesTags: (result, error, arg) =>
        result ? [...result.map(({ _id }) => ({ type: 'MenuTag', _id })), 'MenuTag'] : ['MenuTag']
    }),
    getOneMenu: builder.query({
      query: menuId => ({
        url: `/menu/${menuId}`
      }),
      transformResponse: res => res.metadata,
      providesTags: ['MenuTag']
    }),
    createMenu: builder.mutation({
      query: body => ({
        url: '/menu',
        method: 'POST',
        body
      }),
      invalidatesTags: ['MenuTag']
    }),
    updateMenu: builder.mutation({
      query: body => ({
        url: '/menu',
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['MenuTag']
    })
  })
})

export const { useCreateMenuMutation, useGetAllMenuQuery, useGetOneMenuQuery, useUpdateMenuMutation } = menuApi
