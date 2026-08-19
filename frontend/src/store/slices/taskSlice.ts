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
    return rejectWithValue(
      error.response?.data?.message || "Failed to create task",
    );
  }
});

export const getTask = createAsyncThunk<Task[]>(
  "task/getTask",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/task");

      return res.data.tasks;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get tasks",
      );
    }
  },
);

export const getTaskById = createAsyncThunk<
  Task,
  string,
  { rejectValue: string }
>("task/getTaskById", async (taskId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/task/${taskId}`);

    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to get task",
    );
  }
});

export const updateTask = createAsyncThunk<
  Task,
  { taskId: string; taskData: FormData },
  { rejectValue: string }
>("task/updateTask", async ({ taskId, taskData }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/task/${taskId}`, taskData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to update task",
    );
  }
});

export const deleteTask = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("task/deleteTask", async (taskId, { rejectWithValue }) => {
  try {
    await api.delete(`/task/${taskId}`);

    return taskId;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete task",
    );
  }
});

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
        state.error =
          (action.payload as string) || action.error.message || null;
      })

      .addCase(getTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTask = action.payload;
        state.error = null;
      })

      .addCase(getTaskById.rejected, (state, action) => {
        state.loading = false;
        state.selectedTask = null;
        state.error =
          (action.payload as string) || action.error.message || null;
      })

      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;

        // Add newly created task to list
        state.tasks.push(action.payload);

        state.error = null;
      })

      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || action.error.message || null;
      })

      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updatedTask = action.payload;

        const index = state.tasks.findIndex(
          (task) => task._id === updatedTask._id,
        );

        if (index !== -1) {
          state.tasks[index] = updatedTask;
        }

        if (state.selectedTask?._id === updatedTask._id) {
          state.selectedTask = updatedTask;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update task";
      })

      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;

        const deletedTaskId = action.payload;

        state.tasks = state.tasks.filter((task) => task._id !== deletedTaskId);

        // If deleted task was selected, clear it
        if (state.selectedTask?._id === deletedTaskId) {
          state.selectedTask = null;
        }

        state.error = null;
      })

      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || action.error.message || null;
      });
  },
});

export default taskSlice.reducer;
