import { api } from '../api'

export const orderApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllOrders: builder.query({
      query: () => ({
        url: '/order'
      }),
      transformResponse: res => res.metadata,
      providesTags: (result, error, arg) =>
        result ? [...result.map(({ _id }) => ({ type: 'OrdersTag', _id })), 'OrdersTag'] : ['OrdersTag']
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
