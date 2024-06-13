import { api } from '../api'

export const salaryApi = api.injectEndpoints({
  endpoints: builder => ({
    getAllSalaries: builder.query({
      query: params => ({
        url: '/salary'
      }),
      transformResponse: res => res?.metadata,
      providesTags: (result, error, arg) =>
        result ? [...result.map(({ _id }) => ({ type: 'SalariesTag', _id })), 'SalariesTag'] : ['SalariesTag']
    }),
    getInfoSalary: builder.query({
      query: salaryId => ({
        url: `/salary/${salaryId}`
      }),
      transformResponse: res => res?.metadata,
      providesTags: ['SalariesTag']
    }),
    getAllEmployee: builder.query({
      query: () => ({
        url: '/salary/list/employee'
      }),
      transformResponse: res => res?.metadata,
      providesTags: (result, error, arg) =>
        result ? [...result.map(({ _id }) => ({ type: 'EmployeesTag', _id })), 'EmployeesTag'] : ['EmployeesTag']
    }),
    addSalary: builder.mutation({
      query: body => ({
        url: '/salary',
        method: 'POST',
        body
      }),
      invalidatesTags: ['SalariesTag']
    }),
    editSalary: builder.mutation({
      query: body => ({
        url: '/salary',
        method: 'PUT',
        body
      }),
      invalidatesTags: ['SalariesTag']
    })
    // getAllSalaries: builder.query({
    //   query: accountId => ({
    //     url: `/employee/list/employeeHasNotAccount/${accountId && accountId}`
    //   }),
    //   transformResponse: res => res?.metadata,
    //   providesTags: ['EmployeesTag']
    // })
  })
})

export const {
  useAddSalaryMutation,
  useGetAllSalariesQuery,
  useGetInfoSalaryQuery,
  useEditSalaryMutation,
  useGetAllEmployeeQuery
} = salaryApi
