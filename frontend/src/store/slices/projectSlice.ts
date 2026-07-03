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

export const createProject = createAsyncThunk(
  "project/createProject",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await api.post("/project", formData);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data.message);
    }
  },
);

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
      })
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })

      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.unshift(action.payload);
      })

      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default projectSlice.reducer;
