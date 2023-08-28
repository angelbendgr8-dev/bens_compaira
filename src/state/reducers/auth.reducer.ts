import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type AuthState = {
  user: any | null;
  token: string;
  isLoading: boolean;
  error: {
    state: boolean;
    message: string;
  };
  data: any;
  resetEmail: string;
  prevRoute: string;
  logout: boolean;
};

const slice = createSlice({
  name: "userauth",
  initialState: {
    isLoading: false,
    user: null,
    token: '',
    error: {
      state: false,
      message: "",
    },
    data: {},
    logout: false,
    resetEmail: "",
    prevRoute: '',
  } as unknown as AuthState,
  reducers: {
    setCredentials: (
      state,
      {
        payload: { user, token },
      }: PayloadAction<{ user: any; token: string }>
    ) => {
      state.user = user;
      state.token = token;
      state.logout = false;
    },
    updateCredentials: (
      state,
      { payload: { user } }: PayloadAction<{ user: any }>
    ) => {
      // //console.log(user);
      state.user = user;
    },
    setPrevRoute: (
      state,
      { payload: { route } }: PayloadAction<{ route: any }>
    ) => {
      // //console.log(user);
      state.prevRoute = route;
    },
    setLoading: (
      state,
      { payload: { isLoading } }: PayloadAction<{ isLoading: boolean }>
    ) => {
      state.isLoading = isLoading;
    },
    setError: (
      state,
      { payload: { error } }: PayloadAction<{ error: any }>
    ) => {
      state.error = error;
    },
    setData: (state, { payload: { data } }: PayloadAction<{ data: any }>) => {
      state.data = data;
    },
    setEmail: (
      state,
      { payload: { email } }: PayloadAction<{ email: string }>
    ) => {
      state.resetEmail = email;
    },
    signOut: (state) => {
      state.logout = true;
    },
  },
});

export const {
  setCredentials,
  updateCredentials,
  signOut,
  setLoading,
  setError,
  setData,
  setEmail,
  setPrevRoute
} = slice.actions;

export default slice.reducer;

export const selectUser = (state: RootState) => state.userAuth.user;
export const selectLogout = (state: RootState) => state.userAuth.logout;
export const selectRoute = (state: RootState) => state.userAuth.prevRoute;
export const selectToken = (state: RootState) => state.userAuth.token;
export const selectIsLoading = (state: RootState) => state.userAuth.isLoading;
export const selectError = (state: RootState) => state.userAuth.error;
export const selectData = (state: RootState) => state.userAuth.data;
export const selectEmail = (state: RootState) => state.userAuth.resetEmail;
