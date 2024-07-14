import { objectToUrlParams } from '@src/utils'
import { api } from '../api'
export const menuApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllMenu: builder.query({
      query: query => {
        const strQuery = objectToUrlParams(query)
        return { url: `/menu${strQuery && '?' + strQuery}` }
      },
      transformResponse: res => {
        return { metadata: res?.metadata, options: res?.options }
      },
    }),
    getAllMenuPublicForEmployee: builder.query({
      query: query => {
        const strQuery = objectToUrlParams(query)
        return { url: `/menu/getMenu/forEmployee${strQuery && '?' + strQuery}` }
      },
      transformResponse: res => {
        return { metadata: res?.metadata, options: res?.options }
      },
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

export const { useCreateMenuMutation, useGetAllMenuQuery, useGetOneMenuQuery, useUpdateMenuMutation, useGetAllMenuPublicForEmployeeQuery } = menuApi
