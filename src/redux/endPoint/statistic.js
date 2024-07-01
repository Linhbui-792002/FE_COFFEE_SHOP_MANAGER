import { api } from '../api'

export const statisticApi = api.injectEndpoints({
  endpoints: builder => ({
    getStatistic: builder.query({
      query: () => ({
        url: '/statistic'
      }),
      transformResponse: res => {
        return res?.metadata
      },
      providesTags: ['Statistic']
    })
  })
})
export const { useGetStatisticQuery } = statisticApi
