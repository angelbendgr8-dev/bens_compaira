import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {RootState} from '../store';
// import { ReqResult } from '../../../interfaces/user.interface';

const BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_API_URL;
console.log(BASE_URL);
// Define a service using a base URL and expected endpoints
export const MiscApi = createApi({
  reducerPath: 'MiscApi',
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
    getJobSector: builder.mutation({
      query: () => ({
        url: '/jobsectors',
        method: 'GET',
      }),
    }),
    getSector: builder.mutation({
      query: credentials => ({
        url: `/candidate/vacancies/sector/${credentials.vacancyId}`,
        method: 'GET',
      }),
    }),
    checkEmail: builder.mutation({
      query: credentials => ({
        url: `/newcandidate/checkemail/${credentials.email}`,
        method: 'GET',
      }),
    }),
    checkUsername: builder.mutation({
      query: credentials => ({
        url: `newcandidate/checkuser/${credentials.username}`,
        method: 'GET',
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetJobSectorMutation,
  useCheckEmailMutation,
  useCheckUsernameMutation,
  useGetSectorMutation,
} = MiscApi;
