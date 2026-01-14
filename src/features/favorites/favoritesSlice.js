import { createSlice } from "@reduxjs/toolkit";

const loadFromStorage = () => {
  try {
    const data = localStorage.getItem("favorites");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveToStorage = (state) => {
  localStorage.setItem("favorites", JSON.stringify(state.ids));
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    ids: loadFromStorage(),
  },
  reducers: {
    toggleFavorite(state, action) {
      const id = action.payload;
      if (state.ids.includes(id)) {
        state.ids = state.ids.filter((x) => x !== id);
      } else {
        state.ids.push(id);
      }
      saveToStorage(state);
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
