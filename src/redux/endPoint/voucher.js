import { api } from '../api'
export const voucherApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllVoucher: builder.query({
      query: () => ({
        url: '/voucher',
      }),
      transformResponse: res => res.metadata
    }),
    getOneVoucher: builder.query({
      query: voucherId => ({
        url: `/voucher/${voucherId}`
      }),
      transformResponse: res => res.metadata
    }),
    createVoucher: builder.mutation({
      query: body => ({
        url: '/voucher',
        method: 'POST',
        body
      })
    }),
    updateVoucher: builder.mutation({
      query: body => ({
        url: '/voucher',
        method: 'PATCH',
        body
      })
    })
  })
})

export const {  useGetAllVoucherQuery,useCreateVoucherMutation,useGetOneVoucherQuery, useUpdateVoucherMutation} = voucherApi
