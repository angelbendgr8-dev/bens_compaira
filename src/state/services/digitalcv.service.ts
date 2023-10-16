import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
// import { ReqResult } from '../../../interfaces/user.interface';

const BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_API_URL;
// console.log(BASE_URL);
// Define a service using a base URL and expected endpoints
export const DigitalCvApi = createApi({
  reducerPath: "DigitalCvApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).userAuth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["languages", "hobbies"],
  endpoints: (builder) => ({
    updateHobbiesData: builder.mutation({
      query: ({ username, credentials }) => ({
        url: `/hobbies/${username}`,
        method: "PUT",
        body: credentials,
      }),
      invalidatesTags: ["hobbies"],
    }),
    saveHobbies: builder.mutation({
      query: ({ username, credentials }) => ({
        url: `/hobbies/${username}`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["hobbies"],
    }),
    saveLanguage: builder.mutation({
      query: ({ username, credentials }) => ({
        url: `/hobbies/${username}`,
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["hobbies"],
    }),
    saveDigitalCvInfo: builder.mutation({
      query: ({ username, credentials }) => ({
        url: `/digitalcv/candidate/${username}`,
        method: "POST",
        body: credentials,
      }),
    }),
    getDigitalCvInfo: builder.mutation({
      query: (username) => ({
        url: `/digitalcv/candidate/${username}`,
      }),
    }),
    generateDigitalCv: builder.mutation({
      query: (username) => ({
        url: ` http://dev-ec2.compaira.com:9090/api/reports/pdf/digitalcv/${username}`,
      }),
    }),

    getHobbiesData: builder.query({
      query: (username) => ({
        url: `/hobbies/${username}`,
      }),
      providesTags: ["hobbies"],
    }),
    getAllHobbies: builder.query({
      query: () => ({
        url: `/hobbies`,
      }),
      providesTags: ["hobbies"],
    }),
    getAllLanguages: builder.query({
      query: () => ({
        url: `/languages`,
      }),
      providesTags: ["languages"],
    }),
    getUserLanguages: builder.query({
      query: ({ username }) => ({
        url: `/languages/${username}`,
      }),
      providesTags: ["languages"],
    }),
    getUserExperience: builder.mutation({
      query: (username) => ({
        url: `/ner/raw/experience/${username}`,
      }),
    }),
    getUserEducation: builder.mutation({
      query: (username) => ({
        url: `/ner/raw/education/${username}`,
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useUpdateHobbiesDataMutation,
  useGetHobbiesDataQuery,
  useSaveHobbiesMutation,
  useGetAllHobbiesQuery,
  useGetAllLanguagesQuery,
  useGetUserLanguagesQuery,
  useSaveDigitalCvInfoMutation,
  useGetDigitalCvInfoMutation,
  useGenerateDigitalCvMutation,
  useGetUserExperienceMutation,
  useGetUserEducationMutation,
} = DigitalCvApi;
