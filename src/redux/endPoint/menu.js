import { api } from '../api'
export const menuApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllMenu: builder.query({
      query: () => ({
        url: '/menu',
        method: 'GET'
      }),
      transformResponse: res => res.metadata
    }),
    getOneMenu: builder.query({
      query: menuId => ({
        url: `/menu/${menuId}`
      }),
      transformResponse: res => res.metadata
    }),
    createMenu: builder.mutation({
      query: body => ({
        url: '/menu',
        method: 'POST',
        body
      })
    }),
    updateMenu: builder.mutation({
      query: body => ({
        url: '/menu',
        method: 'PATCH',
        body
      })
    })
  })
})

export const { useCreateMenuMutation, useGetAllMenuQuery, useGetOneMenuQuery, useUpdateMenuMutation } = menuApi
