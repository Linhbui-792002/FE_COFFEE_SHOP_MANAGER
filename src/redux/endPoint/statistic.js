import { objectToUrlParams } from '@src/utils'
import { api } from '../api'

export const statisticApi = api.injectEndpoints({
  endpoints: builder => ({
    getProductStatistic: builder.query({
      query: query => {
        const strQuery = objectToUrlParams(query)
        return { url: `/statistic/statisticProduct?${strQuery}` }
      },
      transformResponse: res => {
        return res?.metadata
      },
      providesTags: (result, error, arg) =>
        result ? [...result.map(({ _id }) => ({ type: 'StatisticsTag', _id })), 'StatisticsTag'] : ['StatisticsTag']
    }),
    getOrderAnalystic: builder.query({
      query: query => {
        return { url: `/statistic/statisticInDay` }
      },
      transformResponse: res => {
        return res?.metadata
      },
      providesTags: ['StatisticsTag']
    }),
    getRevenueStatistic: builder.query({
      query: query => {
        return { url: `/statistic/statisticRevenue` }
      },
      transformResponse: res => {
        return res?.metadata
      },
      providesTags: ['StatisticsTag']
    })
  })
})

export const { useGetProductStatisticQuery, useGetOrderAnalysticQuery, useGetRevenueStatisticQuery } = statisticApi
