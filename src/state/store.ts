import { configureStore, PreloadedState } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";

import { setupListeners } from "@reduxjs/toolkit/query";
// import { PersistGate } from 'redux-persist/integration/react'

import userAuth from "./reducers/auth.reducer";
import dashboard from "./reducers/dashboard.reducer";
import messages from "./reducers/message.reducer";
import profile from "./reducers/profile.reducer";
import { UserAuthApi } from "./services/auth.service";
import { MessageApi } from "./services/messages.service";
import { MiscApi } from "./services/miscellaneous.service";
import { DashboardApi } from "./services/dashboard.service";
import { ProfileApi } from "./services/profile.service";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whiteList: ["userAuth"],
};

const reducers = combineReducers({
  userAuth,
  dashboard,
  profile,
  messages,
  [UserAuthApi.reducerPath]: UserAuthApi.reducer,
  [DashboardApi.reducerPath]: DashboardApi.reducer,
  [ProfileApi.reducerPath]: ProfileApi.reducer,
  [MessageApi.reducerPath]: MessageApi.reducer,
  [MiscApi.reducerPath]: MiscApi.reducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "userauth/signOut") {
    // this applies to all keys defined in persistConfig(s)
    // store.removeItem('persist:root');

    state = {};
  }
  return reducers(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const createStore = (preloadedState?: PreloadedState<RootState>) =>
  configureStore({
    reducer: persistedReducer,

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat([
        UserAuthApi.middleware,
        MiscApi.middleware,
        DashboardApi.middleware,
        ProfileApi.middleware,
        MessageApi.middleware,
      ]),
  });
export const store = createStore();
export type RootState = ReturnType<typeof reducers>;
export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = typeof store.dispatch;
setupListeners(store.dispatch);
