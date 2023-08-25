import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {RootState} from '../store';
// import { ReqResult } from '../../../interfaces/user.interface';

// const BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_API_URL;
const BASE_URL = 'http://localhost:8080/';
console.log(BASE_URL);
// Define a service using a base URL and expected endpoints
export const UserAuthApi = createApi({
  reducerPath: 'UserAuthApi',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, {getState}) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).userAuth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    login: builder.mutation({
      query: credentials => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    createCandidate: builder.mutation({
      query: credentials => ({
        url: '/newcandidate/',
        method: 'POST',
        body: credentials,
      }),
    }),
    uploadCandidateImage: builder.mutation({
      query: ({username,formData}) => ({
        url: `/upload/candidate/document/${username}`,
        method: 'POST',
        body: formData,
      }),
    }),
    setCandidateJobSector: builder.mutation({
      query: ({username,credentials}) => ({
        url: `/jobsectors/candidate/${username}`,
        method: 'POST',
        body: credentials,
      }),
    }),
    updateCandidateReferral: builder.mutation({
      query: ({vacancyId,credentials}) => ({
        url: `/candidate/vacancies/employeereferral/${vacancyId}`,
        method: 'POST',
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation({
      query: credentials => ({
        url: '/api/v1/users/get-reset-otp-mail',
        method: 'GET',
        body: credentials,
      }),
    }),
    retrieveAccount: builder.mutation({
      query: credentials => ({
        url: '/api/retrieveAccount',
        method: 'POST',
        body: credentials,
      }),
    }),
    loginActivity: builder.mutation({
      query: ({name, credentials}) => ({
        url: `/user/activity/${name}`,
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useLoginMutation,
  useCreateCandidateMutation,
  useSetCandidateJobSectorMutation,
  useUploadCandidateImageMutation,
  useUpdateCandidateReferralMutation,
  useForgotPasswordMutation,
  useRetrieveAccountMutation,
  useLoginActivityMutation,
} = UserAuthApi;
