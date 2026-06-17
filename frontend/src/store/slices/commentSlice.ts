import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";

export interface CommentUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export interface Comment {
  _id: string;
  message: string;
  user: CommentUser;
  createdAt: string;
}
interface CommentState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}
const initialState: CommentState = {
  comments: [],
  loading: false,
  error: null,
};

export const getComments = createAsyncThunk<Comment[], string>(
  "comment/getComments",
  async (taskId: string) => {
    const res = await api.get(`/task/${taskId}/comments`);

    return res.data.comments;
  },
);

export const addComment = createAsyncThunk<
  Comment,
  {
    taskId: string;
    message: string;
  }
>("comment/addComment", async ({ taskId, message }) => {
  const res = await api.post(`/task/${taskId}/comments`, { message });

  return res.data.comment;
});

export const deleteComment = createAsyncThunk<string, string>(
  "comment/deleteComment",
  async (commentId: string) => {
    await api.delete(`/comment/${commentId}`);

    return commentId;
  },
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(getComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })

      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || null;
      })

      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
      })

      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (comment) => comment._id !== action.payload,
        );
      });
  },
});

export default commentSlice.reducer;