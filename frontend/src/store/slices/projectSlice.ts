import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";
interface User {
  _id: string;
  name: string;
  email: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;

  createdBy: string;

  member: User[];

  status: "planning" | "active" | "completed";

  priority: "low" | "medium" | "high";

  startDate: string;
  endDate: string;

  visibility: "private" | "team" | "public";

  attachments: {
    fileName: string;
    fileUrl: string;
    uploadedAt: string;
  }[];

  createdAt: string;
  updatedAt: string;
}

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
};

export const getProjects = createAsyncThunk("project/getProjects", async () => {
  const res = await api.get("/project");
  return res.data.projects;
});

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(getProjects.rejected, (state, action) => {
        state.loading = false;
        state.projects = []; 
        state.error = action.error.message || null;
      });
  },
});

export default projectSlice.reducer;
