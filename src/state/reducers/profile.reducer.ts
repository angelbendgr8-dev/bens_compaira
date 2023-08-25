import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type ProfileState = {
  profileData: any;
  behaviourData: any;
  competencyData: any;
  valuesData:any;
  functionAreas: Array<any>;
  sectors: Array<any>;
  technicalSkills: Array<any>;
  functionalSkills: Array<any>;
  candidateFunctionAreas: Array<any>;
  candidateSectors: Array<any>;
  candidateTechnicalSkills: Array<any>;
  candidateFunctionalSkills: Array<any>;
   candidateProgress: any
};

const slice = createSlice({
  name: "profile",
  initialState: {
    profileData: {},
    behaviourData: {},
    competencyData: {},
    valuesData:{},
    functionAreas: [],
    sectors: [],
    technicalSkills: [],
    functionalSkills: [],
    candidateFunctionAreas: [],
    candidateSectors: [],
    candidateTechnicalSkills: [],
    candidateFunctionalSkills: [],
    candidateProgress: {}
  } as unknown as ProfileState,
  reducers: {
    setProfileData: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.profileData = data;
    },
    setBehaviourData: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.behaviourData = data;
    },
    setCompetencyData: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.competencyData = data;
    },
    setValuesData: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.valuesData = data;
    },
    setFunctionAreas: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.functionAreas = data;
    },
    setSectors: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.sectors = data;
    },
    setFunctionalSkills: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.functionalSkills = data;
    },
    setTechnicalSkills: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.technicalSkills = data;
    },
    setCandidateFunctionAreas: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.candidateFunctionAreas = data;
    },
    setCandidateFunctionalSkills: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.candidateFunctionalSkills = data;
    },
    setCandidateTechnicalSkills: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.candidateTechnicalSkills = data;
    },
    setCandidateSectors: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.candidateSectors = data;
    },
    setCandidateProgress: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.candidateProgress = data;
    },
  },
});

export const {
  setBehaviourData,
  setCompetencyData,
  setValuesData,
  setCandidateFunctionAreas,
  setCandidateSectors,
  setCandidateTechnicalSkills,
  setCandidateFunctionalSkills,
  setFunctionAreas,
  setFunctionalSkills,
  setProfileData,
  setSectors,
  setTechnicalSkills,
  setCandidateProgress
} = slice.actions;

export default slice.reducer;

export const selectProfileData = (state: RootState) =>
  state.profile.profileData;
export const selectCandidateProgress = (state: RootState) =>
  state.profile.candidateProgress;
export const selectCompetencyData = (state: RootState) =>
  state.profile.competencyData;
export const selectValuesData = (state: RootState) =>
  state.profile.valuesData;
export const selectBehaviorData = (state: RootState) =>
  state.profile.behaviourData;
export const selectFunctionAreas = (state: RootState) =>
  state.profile.functionAreas;
export const selectSectors = (state: RootState) => state.profile.sectors;
export const selectTechnicalSkills = (state: RootState) =>
  state.profile.technicalSkills;
export const selectFunctionSkills = (state: RootState) =>
  state.profile.functionalSkills;
export const selectCandidateFunctionAreas = (state: RootState) =>
  state.profile.candidateFunctionAreas;
export const selectCandidateSectors = (state: RootState) =>
  state.profile.candidateSectors;
export const selectCandidateTechnicalSkills = (state: RootState) =>
  state.profile.candidateTechnicalSkills;
export const selectCandidateFunctionalSkills = (state: RootState) =>
  state.profile.candidateFunctionalSkills;
