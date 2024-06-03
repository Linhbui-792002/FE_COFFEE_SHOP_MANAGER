import { api } from '../api'

export const employeeApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllEmployeeDoing: builder.query({
      query: () => ({
        url: '/employee/list/employeeDoing'
      }),
      transformResponse: res => res?.metadata,
      providesTags: (result, error, arg) =>
        result ? [...result.map(({ _id }) => ({ type: 'EmployeesTag', _id })), 'EmployeesTag'] : ['EmployeesTag']
    }),
    getEmployeesHasNotAccount: builder.query({
      query: accountId => ({
        url: `/employee/list/employeeHasNotAccount/${accountId && accountId}`
      }),
      transformResponse: res => res?.metadata,
      providesTags: ['EmployeesTag']
    })
  })
})
export const { useGetAllEmployeeDoingQuery, useGetEmployeesHasNotAccountQuery } = employeeApi
