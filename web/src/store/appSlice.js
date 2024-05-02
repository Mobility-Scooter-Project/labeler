import { createSlice } from "@reduxjs/toolkit";

const appSlice = createSlice({
  name: "app",
  initialState: {
    keypointsData: [],
    labelData: [],
  },
  reducers: {
    setKeypointSlice(state, action) {
      const keypointsData = action.payload;
      state.keypointsData = keypointsData;
    },
    setLabelSlice(state, action) {
      const labelList = action.payload;
      state.labelData = labelList;
    },
    resetKeypoint(state) {
      state.keypointsData = [];
    },
    resetLabel(state) {
      state.labelData = [];
    },
  },
});

export const { setKeypointSlice, setLabelSlice, resetKeypoint, resetLabel } =
  appSlice.actions;

export default appSlice.reducer;
