import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/api";

export interface User {
  _id: string;
  name: string;
  email: string;
}

export interface Project {
  _id: string;
  title: string;
}

export interface Attachment {
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  project: Project;
  assignee?: string | User;
  createdBy: string | User;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  attachments: Attachment[];
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
};

export const createTask = createAsyncThunk<
  Task,
  FormData,
  { rejectValue: string }
>("task/createTask", async (taskData, { rejectWithValue }) => {
  try {
    const res = await api.post("/task", taskData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.task;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const getTask = createAsyncThunk<Task[]>("task/getTask", async () => {
  const res = await api.get("/task");
  return res.data.tasks;
});

export const getTaskById = createAsyncThunk(
  "task/getTaskById",
  async (taskId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/task/${taskId}`);
      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message);
    }
  },
);

const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
        state.error = null;
      })
      .addCase(getTask.rejected, (state, action) => {
        state.loading = false;
        state.tasks = [];
        state.error = action.error.message || null;
      })
      .addCase(getTaskById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTask = action.payload;
      })
      .addCase(getTaskById.rejected, (state, action) => {
        state.loading = false;
        state.selectedTask = null;
        state.error = action.payload as string;
      })
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default taskSlice.reducer;
