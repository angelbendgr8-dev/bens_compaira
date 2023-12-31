import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {RootState} from '../store';
// import { ReqResult } from '../../../interfaces/user.interface';

const BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_API_URL;
const PDF_URL = process.env.NEXT_PUBLIC_REACT_APP_PDF_REPORTING_SERVICE_URL;
console.log(BASE_URL);
// Define a service using a base URL and expected endpoints
export const DashboardApi = createApi({
  reducerPath: 'DashboardApi',
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
    getDashboard: builder.mutation({
      query: (credentials) => ({
        url: `/dashboardstats/jobstats/${credentials.username}`,
        method: 'GET',
      }),
    }),
    getVacancyTests: builder.mutation({
      query: (vacancyTestId) => ({
        url: `/candidate/vacancytests/questions/${vacancyTestId}`,
        method: 'GET',
      }),
    }),
    getCompentecyGraph: builder.mutation({
      query: (userID) => ({
        url: `${process.env.NEXT_PUBLIC_REACT_APP_GRAPH_URL}/competency/candidate/${userID}`,
        method: 'GET',
      }),
    }),
    getBehaviourGraph: builder.mutation({
      query: (userID) => ({
        url: `${process.env.NEXT_PUBLIC_REACT_APP_GRAPH_URL}/behaviour/candidate/${userID}`,
        method: 'GET',
      }),
    }),
    applyVacancy: builder.mutation({
      query: ({username,credentials}) => ({
        url: `/vacancies/choice/candidate/${username}`,
        method: 'POST',
        body: credentials
      }),
    }),
    rejectVacancy: builder.mutation({
      query: ({username,credentials}) => ({
        url: `/vacancies/choice/candidate/${username}`,
        method: 'POST',
        body: credentials
      }),
    }),
    deleteVacancy: builder.mutation({
      query: ({username,credentials}) => ({
        url: `/vacancies/choice/candidate/${username}`,
        method: 'POST',
        body: credentials
      }),
    }),
    generatePdfReport: builder.mutation({
      query: (candidateId) => ({
        url: `${PDF_URL}/candidate/${candidateId}`,
        method: 'GET',
      }),
    }),


  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetDashboardMutation,
  useGetBehaviourGraphMutation,
  useGetCompentecyGraphMutation,
  useGetVacancyTestsMutation,
  useApplyVacancyMutation,
  useRejectVacancyMutation,
  useDeleteVacancyMutation,
  useGeneratePdfReportMutation,
} = DashboardApi;
