import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "travelTrucks_favorites";

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { ids: [] };
  } catch (error) {
    console.error("Error loading favorites from localStorage:", error);
    return { ids: [] };
  }
};

const saveToStorage = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Error saving favorites to localStorage:", error);
  }
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: loadFromStorage(),
  reducers: {
    toggleFavorite: (state, action) => {
      const id = action.payload;
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((i) => i !== id);
      } else {
        state.ids.push(id);
      }
      saveToStorage(state);
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;