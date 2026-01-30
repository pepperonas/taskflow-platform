import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TasksPage from '../TasksPage';
import tasksReducer from '../../store/slices/tasksSlice';
import { taskApi } from '../../api/taskApi';

// Mock the API
jest.mock('../../api/taskApi');
const mockedTaskApi = taskApi as jest.Mocked<typeof taskApi>;

const createMockStore = (initialTasksState: any) => {
  return configureStore({
    reducer: {
      tasks: tasksReducer,
    },
    preloadedState: {
      tasks: initialTasksState,
    },
  });
};

describe('TasksPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render tasks page', () => {
    const store = createMockStore({
      tasks: [],
      currentTask: null,
      loading: false,
      error: null,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <TasksPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/tasks/i)).toBeInTheDocument();
  });

  it('should display loading state', () => {
    const store = createMockStore({
      tasks: [],
      currentTask: null,
      loading: true,
      error: null,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <TasksPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should display tasks list', async () => {
    const mockTasks = [
      { id: '1', title: 'Task 1', status: 'OPEN', priority: 'HIGH' },
      { id: '2', title: 'Task 2', status: 'IN_PROGRESS', priority: 'MEDIUM' },
    ];

    mockedTaskApi.getAllTasks.mockResolvedValue({ data: mockTasks });

    const store = createMockStore({
      tasks: mockTasks,
      currentTask: null,
      loading: false,
      error: null,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <TasksPage />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  it('should display error message on failure', () => {
    const store = createMockStore({
      tasks: [],
      currentTask: null,
      loading: false,
      error: 'Failed to load tasks',
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <TasksPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument();
  });
});
