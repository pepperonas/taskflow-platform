import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { taskApi } from '../../api/taskApi';
import { Task, CreateTaskDto, UpdateTaskDto } from '../../types';

interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
};

export const fetchTasks = createAsyncThunk('tasks/fetchAll', async () => {
  console.log('API call: fetching all tasks');
  const response = await taskApi.getAllTasks();
  console.log('API response:', response);
  return response.data;
});

export const createTask = createAsyncThunk(
  'tasks/create',
  async (task: CreateTaskDto) => {
    const response = await taskApi.createTask(task);
    return response.data;
  }
);

export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, data }: { id: string; data: UpdateTaskDto }) => {
    const response = await taskApi.updateTask(id, data);
    return response.data;
  }
);

export const deleteTask = createAsyncThunk('tasks/delete', async (id: string) => {
  await taskApi.deleteTask(id);
  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setCurrentTask: (state, action: PayloadAction<Task | null>) => {
      state.currentTask = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        console.log('Fetching tasks...');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        console.log('Tasks fetched successfully:', action.payload);
        console.log('Number of tasks:', action.payload.length);
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        console.error('Failed to fetch tasks:', action.error);
        console.error('Error message:', action.error?.message);
        state.loading = false;
        state.error = action.error?.message || 'Failed to fetch tasks';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
      });
  },
});

export const { setCurrentTask } = tasksSlice.actions;
export default tasksSlice.reducer;
