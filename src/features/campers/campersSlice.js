import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCampers, getCamperById } from "../../api/campers";

export const fetchCampers = createAsyncThunk(
  "campers/fetchCampers",
  async (params, { rejectWithValue }) => {
    try {
      const res = await getCampers(params);

      const data = res.data;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.data)
        ? data.data
        : [];

      return list;
    } catch (e) {
      return rejectWithValue(e?.message || "Fetch campers failed");
    }
  }
);

export const fetchCamperById = createAsyncThunk(
  "campers/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getCamperById(id);
      return res.data;
    } catch (e) {
      return rejectWithValue(e?.message || "Fetch camper failed");
    }
  }
);

const campersSlice = createSlice({
  name: "campers",
  initialState: {
    items: [],
    page: 1,
    limit: 4,
    hasMore: true,
    selected: null,
    status: "idle",
    error: null,
  },
  reducers: {
    resetCampers(state) {
      state.items = [];
      state.page = 1;
      state.hasMore = true;
      state.selected = null;
      state.status = "idle";
      state.error = null;
    },
    nextPage(state) {
      state.page += 1;
    },
    clearSelected(state) {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- campers list ----
      .addCase(fetchCampers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCampers.fulfilled, (state, action) => {
        state.status = "succeeded";

        const list = action.payload;

        if (list.length < state.limit) {
          state.hasMore = false;
        }

        const existingIds = new Set(state.items.map((x) => x.id));
        const uniqueList = list.filter((x) => !existingIds.has(x.id));

        state.items.push(...uniqueList);
      })
      .addCase(fetchCampers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      })

      // ---- camper details ----
      .addCase(fetchCamperById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCamperById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selected = action.payload;
      })
      .addCase(fetchCamperById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unknown error";
      });
  },
});

export const { resetCampers, nextPage, clearSelected } = campersSlice.actions;
export default campersSlice.reducer;
