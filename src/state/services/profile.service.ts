import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import type {RootState} from '../store';
// import { ReqResult } from '../../../interfaces/user.interface';

const BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_API_URL;
// console.log(BASE_URL);
// Define a service using a base URL and expected endpoints
export const ProfileApi = createApi({
  reducerPath: 'ProfileApi',
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
  tagTypes: ['percentage'],
  endpoints: builder => ({
    saveProfileData: builder.mutation({
      query: ({username,credentials}) => ({
        url: `/candidate/profile/${username}`,
        method: 'PUT',
        body: credentials
      }),
    }),
    saveProfilePics: builder.mutation({
      query: ({username,credentials}) => ({
        url: `/upload/candidate/photo/${username}`,
        method: 'POST',
        body: credentials
      }),
    }),
    uploadCV: builder.mutation({
      query: ({username,credentials}) => ({
        url: `/upload/candidate/document/${username}`,
        method: 'POST',
        body: credentials
      }),
    }),
    saveTechnicalSkill: builder.mutation({
      query: ({username,credentials}) => ({
        url: `/technicalSkills/candidate/${username}`,
        method: 'POST',
        body: credentials
      }),
    }),
    saveFunctionalSkill: builder.mutation({
      query: ({username,credentials}) => ({
        url: `/functionalSkills/candidate/${username}`,
        method: 'POST',
        body: credentials
      }),
    }),
    saveFunctionAreas: builder.mutation({
      query: ({username,credentials}) => ({
        url: `/functionAreas/candidate/${username}`,
        method: 'POST',
        body: credentials
      }),
    }),
    saveJobsector: builder.mutation({
      query: ({username,credentials}) => ({
        url: `/jobsectors/candidate/${username}`,
        method: 'POST',
        body: credentials
      }),
    }),
    saveBehaviourData: builder.mutation({
      query: ({username,credentials}) => ({
        url: `/behaviourprofile/candidate/${username}`,
        method: 'POST',
        body: credentials
      }),
      invalidatesTags: ['percentage']
    }),
    saveCompetencyData: builder.mutation({
      query: ({username,credentials}) => ({
        url: `/competencyprofile/candidate/${username}`,
        method: 'POST',
        body: credentials
      }),
      invalidatesTags: ['percentage']
    }),
    getCompetencyData: builder.query({
      query: (username) => ({
        url: `/competencyprofile/candidate/${username}`,
      }),
    }),
    saveValuesBenchmarkData: builder.mutation({
      query: ({username,credentials}) => ({
        url: `/candidate/valuesurvey/${username}`,
        method: 'POST',
        body: credentials
      }),
      invalidatesTags: ['percentage']
    }),
    getValuesBenchmarkData: builder.query({
      query: (username) => ({
        url: `/candidate/valuesurvey/${username}`,
      }),
    }),
    getProfileData: builder.query({
      query: (username) => ({
        url: `/candidate/profile/${username}`,
      }),
    }),
    getBehaviourData: builder.query({
      query: (username) => ({
        url: `/behaviourprofile/candidate/${username}`,
      }),
    }),
    getCandidatePercentage: builder.query({
      query: (username) => ({
        url: `/candidate/profile/percentage/${username}`,
      }),
      providesTags: ['percentage']
    }),
    getFunctionAreas: builder.query({
      query: () => ({
        url: `/functionAreas/`
      }),
    }),
    getCandidateFunctionAreas: builder.mutation({
      query: (username) => ({
        url: `/functionAreas/candidate/${username}`
      }),
    }),
    getCandidateJobSectors: builder.query({
      query: (username) => ({
        url: `/jobsectors/candidate/${username}`
      }),
    }),

    getFunctionalSkills: builder.mutation({
      query: (functionArea) => ({
        url: `/functionalSkills?functionArea=${functionArea}`,
        method: 'GET',
      }),
    }),
    getCandidateFunctionalSkills: builder.mutation({
      query: (username) => ({
        url: `/functionalSkills/candidate/${username}`,
        method: 'GET',
      }),
    }),
    getTechnicalSkills: builder.mutation({
      query: (functionArea) => ({
        url: `/technicalSkills?functionArea=${functionArea}`,
        method: 'GET',
      }),
    }),
    getCandidateTechnicalSkills: builder.mutation({
      query: (username) => ({
        url: `/technicalSkills/candidate/${username}`,
        method: 'GET',
      }),
    }),



  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useSaveProfileDataMutation,
  useGetProfileDataQuery,
  useGetBehaviourDataQuery,
  useGetCandidateFunctionAreasMutation,
  useGetCandidateJobSectorsQuery,
  useGetCandidateTechnicalSkillsMutation,
  useGetCandidateFunctionalSkillsMutation,
  useGetCompetencyDataQuery,
  useGetFunctionAreasQuery,
  useGetFunctionalSkillsMutation,
  useGetTechnicalSkillsMutation,
  useSaveBehaviourDataMutation,
  useSaveCompetencyDataMutation,
  useSaveFunctionAreasMutation,
  useSaveFunctionalSkillMutation,
  useSaveJobsectorMutation,
  useSaveProfilePicsMutation,
  useUploadCVMutation,
  useGetValuesBenchmarkDataQuery,
  useSaveValuesBenchmarkDataMutation,
  useSaveTechnicalSkillMutation,
  useGetCandidatePercentageQuery
} = ProfileApi;
