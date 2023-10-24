import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type DashboardState = {
  dashboardData: any;
  competencyGraph: string;
  behaviourGraph: string;
  vacancyTest: any;
};

const slice = createSlice({
  name: "dashboard",
  initialState: {
    dashboardData: {},
    competencyGraph: "",
    behaviourGraph: "",
    vacancyTest: [],
  } as unknown as DashboardState,
  reducers: {
    setDashbordData: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      console.log(data,'here')
      state.dashboardData = data;
    },
    setCompetencyGraphData: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.competencyGraph = data;
    },
    setBehaviourGraphData: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.behaviourGraph = data;
    },
    setVacancyData: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.vacancyTest = data;
    },
  },
});

export const {
  setDashbordData,
  setCompetencyGraphData,
  setBehaviourGraphData,
  setVacancyData,
} = slice.actions;

export default slice.reducer;

export const selectDashboard = (state: RootState) =>
  state.dashboard.dashboardData;
export const selectCompetencyGraph = (state: RootState) =>
  state.dashboard.competencyGraph;
export const selectBehaviorGraph = (state: RootState) =>
  state.dashboard.behaviourGraph;
export const selectVacancyTest = (state: RootState) =>
  state.dashboard.vacancyTest;
