import { objectToUrlParams } from '@src/utils'
import { api } from '../api'

export const productApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllProduct: builder.query({
      query: query => {
        const strQuery = objectToUrlParams(query)
        return { url: `/product?${strQuery}` }
      },
      transformResponse: res => {
        return { metadata: res?.metadata, options: res?.options }
      },
      providesTags: (result, error, arg) => {
        return result
          ? [...result.metadata.map(({ _id }) => ({ type: 'ProductsTag', _id })), 'ProductsTag']
          : ['ProductsTag']
      }
    }),
    getAllProductPublic: builder.query({
      query: () => {
        return { url: `/product/getProduct/productsPublic` }
      },
      transformResponse: res => res.metadata,
      invalidatesTags: ['ProductsTag']
    }),
    getProductInfo: builder.query({
      query: productId => ({
        url: `/product/${productId}`
      }),
      transformResponse: res => res.metadata,
      providesTags: ['ProductsTag']
    }),
    addProduct: builder.mutation({
      query: body => ({
        url: '/product',
        method: 'POST',
        body
      }),
      invalidatesTags: ['ProductsTag']
    }),
    updateProduct: builder.mutation({
      query: body => ({
        url: '/product',
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['ProductsTag']
    }),
    changeStatusProduct: builder.mutation({
      query: body => ({
        url: '/product/changeStatus',
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['ProductsTag']
    })
  })
})

export const {
  useAddProductMutation,
  useGetAllProductPublicQuery,
  useGetAllProductQuery,
  useGetProductInfoQuery,
  useUpdateProductMutation,
  useChangeStatusProductMutation
} = productApi
