import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type digitalCvState = {
  cvInfo: any;
};

const slice = createSlice({
  name: "digitalCv",
  initialState: {
    hobbiesData: {},

  } as unknown as digitalCvState,
  reducers: {
    setCvInfo: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.cvInfo = data;
    }

  },
});

export const {
  setCvInfo,
} = slice.actions;

export default slice.reducer;

export const selectCvInfo = (state: RootState) =>
  state.digitalCv.cvInfo;

