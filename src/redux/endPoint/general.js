import { api } from '../api'

export const generalApi = api.injectEndpoints({
  endpoints: builder => ({
    getGeneral: builder.query({
      query: () => ({
        url: `/general`
      }),
      transformResponse: res => res.metadata,
      providesTags: ['GeneralsTag']
    }),
    updateGeneral: builder.mutation({
      query: body => ({
        url: '/general',
        method: 'POST',
        body
      }),
      invalidatesTags: ['GeneralsTag']
    })
  })
})

export const { useGetGeneralQuery, useUpdateGeneralMutation } = generalApi
