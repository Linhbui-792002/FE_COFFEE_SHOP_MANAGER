import { objectToUrlParams } from '@src/utils'
import { api } from '../api'

export const statisticApi = api.injectEndpoints({
  endpoints: builder => ({
    getProductStatistic: builder.query({
      query: query => {
        const strQuery = objectToUrlParams(query)
        return { url: `/statistic/statisticProduct${strQuery}` }
      },
      transformResponse: res => {
        return res?.metadata
      },
      providesTags: (result, error, arg) =>
        result ? [...result.map(({ _id }) => ({ type: 'StatisticsTag', _id })), 'StatisticsTag'] : ['StatisticsTag']
    })
  })
})

export const { useGetProductStatisticQuery } = statisticApi
