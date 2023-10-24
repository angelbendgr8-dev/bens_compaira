import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
// import { ReqResult } from '../../../interfaces/user.interface';

const BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_API_URL;
// const BASE_URL = 'http://localhost:8080/';
console.log(BASE_URL);
// Define a service using a base URL and expected endpoints
export const TestApi = createApi({
  reducerPath: "TestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/candidate/tests`,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).userAuth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTest: builder.mutation({
      query: (testId) => ({
        url: `/check/vacancyLink/${testId}`,
        method: "GET",
      }),
    }),
    getQuestions: builder.mutation({
      query: ({ username, testId }) => ({
        url: `get/questionset/${username}/${testId}`,
        method: "GET",
      }),
    }),
    submitQuestions: builder.mutation({
      query: ({ username, vacancyId, testId, formData }) => ({
        url: `/submit/${username}/${vacancyId}/${testId}`,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetTestMutation,
  useGetQuestionsMutation,
  useSubmitQuestionsMutation,
} = TestApi;
