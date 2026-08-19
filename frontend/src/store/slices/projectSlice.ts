import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";

interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Project {
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
  selectedProject: Project | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,
};

export const getProjects = createAsyncThunk<
  Project[],
  void,
  { rejectValue: string }
>("project/getProjects", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/project");

    return res.data.projects;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to get projects",
    );
  }
});

export const getProjectById = createAsyncThunk<
  Project,
  string,
  { rejectValue: string }
>("project/getProjectById", async (projectId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/project/${projectId}`);

    return res.data.project || res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to get project",
    );
  }
});

export const createProject = createAsyncThunk<
  Project,
  FormData,
  { rejectValue: string }
>("project/createProject", async (formData, { rejectWithValue }) => {
  try {
    const res = await api.post("/project", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.project || res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to create project",
    );
  }
});

export const updateProject = createAsyncThunk<
  Project,
  {
    projectId: string;
    projectData: FormData;
  },
  { rejectValue: string }
>(
  "project/updateProject",
  async ({ projectId, projectData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/project/${projectId}`, projectData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data.project || res.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update project",
      );
    }
  },
);

export const deleteProject = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("project/deleteProject", async (projectId, { rejectWithValue }) => {
  try {
    await api.delete(`project/${projectId}`);
    return projectId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete Project",
    );
  }
});

export const addMember = createAsyncThunk<
  { message: string; members: string[] },
  { projectId: string; userId: string },
  { rejectValue: string }
>("project/addMember", async ({ projectId, userId }, { rejectWithValue }) => {
  try {
    const res = await api.post(`/project/${projectId}/members`, {
      userId,
    });

    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to add member",
    );
  }
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
        state.error =
          action.payload || action.error.message || "Failed to get projects";
      })

      .addCase(getProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProject = action.payload;
        state.error = null;
      })

      .addCase(getProjectById.rejected, (state, action) => {
        state.loading = false;
        state.selectedProject = null;
        state.error =
          action.payload || action.error.message || "Failed to get project";
      })

      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;

        state.projects.unshift(action.payload);

        state.error = null;
      })

      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || action.error.message || "Failed to create project";
      })

      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;

        const updatedProject = action.payload;

        const index = state.projects.findIndex(
          (project) => project._id === updatedProject._id,
        );

        if (index !== -1) {
          state.projects[index] = updatedProject;
        }

        if (state.selectedProject?._id === updatedProject._id) {
          state.selectedProject = updatedProject;
        }

        state.error = null;
      })

      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || action.error.message || "Failed to update project";
      })
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;

        state.projects = state.projects.filter(
          (project) => project._id !== action.payload,
        );

        state.error = null;
      })

      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || action.error.message || "Failed to delete project";
      })

      .addCase(addMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addMember.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(addMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add member";
      });
  },
});

export default projectSlice.reducer;
