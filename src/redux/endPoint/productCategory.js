import { api } from '../api'

export const productCategoryApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllProductCategory: builder.query({
      query: () => ({
        url: `/productCategory`
      }),
      transformResponse: res => res.metadata,
      providesTags: ['ProductCategoryTag']
    }),
    getProductCategory: builder.query({
      query: productCategoryId => ({
        url: `/productCategory/${productCategoryId}`
      }),
      transformResponse: res => res.metadata,
      providesTags: ['ProductCategoryTag']
    }),
    addProductCategory: builder.mutation({
      query: body => ({
        url: '/productCategory',
        method: 'POST',
        body
      }),
      invalidatesTags: ['ProductCategoryTag']
    }),
    updateProductCategory: builder.mutation({
      query: body => ({
        url: '/productCategory',
        method: 'PATCH',
        body
      }),
      invalidatesTags: ['ProductCategoryTag']
    })
  })
})

export const {
  useGetAllProductCategoryQuery,
  useGetProductCategoryQuery,
  useAddProductCategoryMutation,
  useUpdateProductCategoryMutation
} = productCategoryApi
