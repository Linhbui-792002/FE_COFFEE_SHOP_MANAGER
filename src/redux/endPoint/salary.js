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
<<<<<<< HEAD
    getEmployeeSalary: builder.query({
      query: salaryId => ({
        url: '/salary/employee'
=======
    getAllEmployeeFix: builder.query({
      query: () => ({
        url: '/salary/list/employee'
>>>>>>> 6eb1ba4418ae6b262aa7f1e376e49b7b710d1494
      }),
      transformResponse: res => res?.metadata,
      providesTags: ['SalariesTag']
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
  })
})

export const {
  useAddSalaryMutation,
  useGetAllSalariesQuery,
  useGetEmployeeSalaryQuery,
  useGetInfoSalaryQuery,
<<<<<<< HEAD
  useEditSalaryMutation
=======
  useEditSalaryMutation,
  useGetAllEmployeeQueryFix
>>>>>>> 6eb1ba4418ae6b262aa7f1e376e49b7b710d1494
} = salaryApi
