import { objectToUrlParams } from '@src/utils'
import { api } from '../api'

export const orderApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllOrders: builder.query({
      query: query => {
        const strQuery = objectToUrlParams(query)
        return { url: `/order?${strQuery}` }
      },
      transformResponse: res => {
        return { metadata: res?.metadata, options: res?.options }
      },
      providesTags: (result, error, arg) => {
        return result ? [...result.metadata.map(({ _id }) => ({ type: 'OrdersTag', _id })), 'OrdersTag'] : ['OrdersTag']
      }
    }),
    getOneOrder: builder.query({
      query: orderId => ({
        url: `/order/${orderId}`
      }),
      transformResponse: res => res.metadata,
      providesTags: (result, error, arg) => [{ type: 'OrdersTag', _id: arg }]
    }),
    createOrder: builder.mutation({
      query: body => ({
        url: '/order',
        method: 'POST',
        body
      }),
      invalidatesTags: ['OrdersTag']
    })
  })
})

export const { useCreateOrderMutation, useGetAllOrdersQuery, useGetOneOrderQuery } = orderApi
