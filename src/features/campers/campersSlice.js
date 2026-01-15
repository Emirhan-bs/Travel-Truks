import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCampers, getCamperById } from "../../api/campers";

export const fetchCampers = createAsyncThunk(
  "campers/fetchCampers",
  async (params, { rejectWithValue }) => {
    try {
      console.log("API çağrısı yapılıyor:", params);
      const res = await getCampers(params);
      const data = res.data;
      
      console.log("API'den gelen veri:", data);

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
        ? data.items
        : Array.isArray(data?.data)
        ? data.data
        : [];

      console.log("İşlenen liste:", list);
      console.log("Liste uzunluğu:", list.length);

      return { list, fetchedCount: list.length };
    } catch (e) {
      console.error("API hatası:", e);
      return rejectWithValue(e?.message || "Kamperler yüklenemedi");
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
      return rejectWithValue(e?.message || "Kamper yüklenemedi");
    }
  }
);

const campersSlice = createSlice({
  name: "campers",
  initialState: { items: [], status: "idle", error: null, total: 0 },
  reducers: {
    resetCampers: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
      state.total = 0;
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
      .addCase(fetchCampers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCampers.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { list, fetchedCount } = action.payload;
        if (fetchedCount < state.limit) {
          state.hasMore = false;
        }

        if (state.page === 1) {
          state.items = list;
          return;
        }

        const existingIds = new Set(state.items.map((x) => x.id));
        const uniqueList = list.filter((x) => !existingIds.has(x.id));
        state.items.push(...uniqueList);
      })
      .addCase(fetchCampers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
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
        state.error = action.payload || "Bilinmeyen hata";
      });
  },
});

export const { resetCampers, nextPage, clearSelected } = campersSlice.actions;
export default campersSlice.reducer;