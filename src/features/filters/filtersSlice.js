import { createSlice } from "@reduxjs/toolkit";

const filtersSlice = createSlice({
  name: "filters",
  initialState: {
    location: "",
    vehicleType: "",
    equipment: {
      AC: false,
      kitchen: false,
      bathroom: false,
      TV: false,
      radio: false,
      
    },
  },
  reducers: {
    setLocation(state, action) {
      state.location = action.payload;
    },
    setVehicleType(state, action) {
      state.vehicleType = action.payload;
    },
    toggleEquipment(state, action) {
      const key = action.payload;
      state.equipment[key] = !state.equipment[key];
    },
    resetFilters(state) {
      state.location = "";
      state.vehicleType = "";
      Object.keys(state.equipment).forEach((k) => (state.equipment[k] = false));
    },
  },
});

export const { setLocation, setVehicleType, toggleEquipment, resetFilters } =
  filtersSlice.actions;
export default filtersSlice.reducer;
