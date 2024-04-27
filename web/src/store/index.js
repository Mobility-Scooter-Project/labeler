import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import appSlice from "./appSlice";
import { persistReducer } from "redux-persist";

const reducers = combineReducers({
  app: appSlice,
});

const persistConfig = {
  key: "key",
  root: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
