import { configureStore } from '@reduxjs/toolkit';
import tasksReducer, { fetchTasks, createTask, updateTask, deleteTask, setCurrentTask } from '../tasksSlice';
import { taskApi } from '../../../api/taskApi';

// Mock the API
jest.mock('../../../api/taskApi');
const mockedTaskApi = taskApi as jest.Mocked<typeof taskApi>;

describe('tasksSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        tasks: tasksReducer,
      },
    });
    jest.clearAllMocks();
  });

  describe('fetchTasks', () => {
    it('should handle fetchTasks pending state', () => {
      mockedTaskApi.getAllTasks.mockImplementation(() => new Promise(() => {}));

      store.dispatch(fetchTasks());

      const state = store.getState().tasks;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle successful fetchTasks', async () => {
      const mockTasks = [
        { id: '1', title: 'Task 1', status: 'OPEN' },
        { id: '2', title: 'Task 2', status: 'IN_PROGRESS' },
      ];

      mockedTaskApi.getAllTasks.mockResolvedValue({ data: mockTasks });

      await store.dispatch(fetchTasks());

      const state = store.getState().tasks;
      expect(state.loading).toBe(false);
      expect(state.tasks).toEqual(mockTasks);
      expect(state.error).toBeNull();
    });

    it('should handle fetchTasks failure', async () => {
      mockedTaskApi.getAllTasks.mockRejectedValue(new Error('Network error'));

      await store.dispatch(fetchTasks());

      const state = store.getState().tasks;
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Network error');
    });
  });

  describe('createTask', () => {
    it('should add new task to state', async () => {
      const newTask = { id: '1', title: 'New Task', status: 'OPEN' };
      mockedTaskApi.createTask.mockResolvedValue({ data: newTask });

      await store.dispatch(createTask({ title: 'New Task', priority: 'MEDIUM' }));

      const state = store.getState().tasks;
      expect(state.tasks).toContainEqual(newTask);
    });
  });

  describe('updateTask', () => {
    it('should update existing task in state', async () => {
      // Setup initial state
      const initialTask = { id: '1', title: 'Original Task', status: 'OPEN' };
      mockedTaskApi.getAllTasks.mockResolvedValue({ data: [initialTask] });
      await store.dispatch(fetchTasks());

      // Update task
      const updatedTask = { id: '1', title: 'Updated Task', status: 'IN_PROGRESS' };
      mockedTaskApi.updateTask.mockResolvedValue({ data: updatedTask });

      await store.dispatch(updateTask({ id: '1', data: { title: 'Updated Task' } }));

      const state = store.getState().tasks;
      expect(state.tasks[0]).toEqual(updatedTask);
    });
  });

  describe('deleteTask', () => {
    it('should remove task from state', async () => {
      // Setup initial state
      const task1 = { id: '1', title: 'Task 1', status: 'OPEN' };
      const task2 = { id: '2', title: 'Task 2', status: 'OPEN' };
      mockedTaskApi.getAllTasks.mockResolvedValue({ data: [task1, task2] });
      await store.dispatch(fetchTasks());

      // Delete task
      mockedTaskApi.deleteTask.mockResolvedValue(undefined);

      await store.dispatch(deleteTask('1'));

      const state = store.getState().tasks;
      expect(state.tasks).toHaveLength(1);
      expect(state.tasks[0].id).toBe('2');
    });
  });

  describe('setCurrentTask', () => {
    it('should set current task', () => {
      const task = { id: '1', title: 'Current Task', status: 'OPEN' };

      store.dispatch(setCurrentTask(task));

      const state = store.getState().tasks;
      expect(state.currentTask).toEqual(task);
    });

    it('should clear current task', () => {
      store.dispatch(setCurrentTask(null));

      const state = store.getState().tasks;
      expect(state.currentTask).toBeNull();
    });
  });
});
