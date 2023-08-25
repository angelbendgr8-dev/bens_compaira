import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {RootState} from '../store';
// import { ReqResult } from '../../../interfaces/user.interface';

const BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_API_URL;
console.log(BASE_URL);
// Define a service using a base URL and expected endpoints
export const MessageApi = createApi({
  reducerPath: 'MessageApi',
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
    getAllVacancies: builder.mutation({
      query: (username) => ({
        url: `/messages/candidate/vacancy/data/${username}`,
        method: 'GET',
      }),
    }),
    getIndividualMessages: builder.mutation({
      query: ({username,id}) => ({
        url: `/messages/candidate/${username}/${id}`,
        method: 'GET',
      }),
    }),
    sendMessageData: builder.mutation({
      query: ({username,credentials}) => ({
        url: `/messages/${username}`,
        method: 'POST',
        body: credentials
      }),
    }),



  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetAllVacanciesMutation,
  useGetIndividualMessagesMutation,
  useSendMessageDataMutation,
} = MessageApi;
