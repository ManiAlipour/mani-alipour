import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LikedBlogsState = string[];

const initialState: LikedBlogsState = [];

const blogSlice = createSlice({
  name: "likedBlogs",
  initialState,
  reducers: {
    addBlog: (state, action: PayloadAction<string>) => {
      // جلوگیری از تکراری شدن
      if (!state.includes(action.payload)) {
        state.push(action.payload);
      }
    },

    deleteBlog: (state, action: PayloadAction<string>) => {
      return state.filter((id) => id !== action.payload);
    },

    toggleBlog: (state, action: PayloadAction<string>) => {
      const exists = state.includes(action.payload);

      if (exists) {
        return state.filter((id) => id !== action.payload);
      } else {
        state.push(action.payload);
      }
    },

    clearAll: () => {
      return [];
    },
  },
});

export const { addBlog, deleteBlog, toggleBlog, clearAll } = blogSlice.actions;

export default blogSlice.reducer;
