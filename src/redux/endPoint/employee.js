import { api } from '../api'

export const employeeApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllEmployee: builder.query({
      query: () => ({
        url: '/employee'
      }),
      transformResponse: res => res?.metadata,
      providesTags: (result, error, arg) =>
        result ? [...result.map(({ _id }) => ({ type: 'EmployeesTag', _id })), 'EmployeesTag'] : ['EmployeesTag']
    }),
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
    }),

    getInfoEmployee: builder.query({
      query: (employeeId) => ({
        url: `/employee/${employeeId}`
      }),
      transformResponse: res => res?.metadata,
      providesTags: ['EmployeesTag']
    }),
    addEmployee: builder.mutation({
      query: body => ({
        url: `/employee`,
        method: 'POST',
        body
      }),
      invalidatesTags: ['EmployeesTag']
    }),
    editEmployee: builder.mutation({
      query: body => ({
        url: '/employee',
        method: "PATCH",
        body
      }),
      invalidatesTags: ['EmployeesTag']

    }),
  })
})
export const { useGetAllEmployeeDoingQuery, useGetEmployeesHasNotAccountQuery, useGetAllEmployeeQuery, useAddEmployeeMutation, useEditEmployeeMutation, useGetInfoEmployeeQuery } = employeeApi
