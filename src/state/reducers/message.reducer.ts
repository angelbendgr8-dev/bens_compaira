import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type messageState = {
  allVacancies: any,
  individualMessage: any
};

const slice = createSlice({
  name: "dashboard",
  initialState: {
    allVacancies: [],
    individualMessage: []
  } as unknown as messageState,
  reducers: {
    setAllVacancies: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      console.log(data,'here')
      state.allVacancies = data;
    },
    setAllIndividualMessages: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.individualMessage = data;
    },
    resetAllMessages: (
      state,
      { payload: { data } }: PayloadAction<{ data: any }>
    ) => {
      state.allVacancies = [];
      state.individualMessage = [];
    },

  },
});

export const {
  setAllVacancies,
  setAllIndividualMessages,
  resetAllMessages,
} = slice.actions;

export default slice.reducer;

export const selectVacancies = (state: RootState) =>
  state.messages.allVacancies;
export const selectAllMessages = (state: RootState) =>
  state.messages.individualMessage;
