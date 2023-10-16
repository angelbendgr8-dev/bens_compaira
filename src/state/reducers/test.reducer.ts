import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type testState = {
  test: any;
  job: any;
  questions: any;
};

const slice = createSlice({
  name: "test",
  initialState: {
    test: {},
    job: {},
    questions: [],
  } as unknown as testState,
  reducers: {
    setTest: (state, { payload: { test } }: PayloadAction<{ test: any }>) => {
      state.test = test;
    },
    setJob: (state, { payload: { job } }: PayloadAction<{ job: any }>) => {
      state.job = job;
    },
    setQuestions: (
      state,
      { payload: { questions } }: PayloadAction<{ questions: any }>
    ) => {
      state.questions = questions;
    },
  },
});

export const { setTest, setQuestions, setJob } = slice.actions;

export default slice.reducer;

export const selectTest = (state: RootState) => state.tests.test;
export const selectJob = (state: RootState) => state.tests.job;
export const selectQuestion = (state: RootState) => state.tests.questions;
