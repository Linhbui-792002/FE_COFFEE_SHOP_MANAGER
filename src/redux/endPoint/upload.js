import { api } from '../api'

export const uploadApi = api.injectEndpoints({
  endpoints: builder => ({
    uploadImage: builder.mutation({
      query: body => ({
        url: '/upload',
        method: 'POST',
        body
      }),
      transformResponse: res => res?.metadata
    })
  })
})
export const { useUploadImageMutation } = uploadApi
