import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import TasksPage from '../TasksPage';
import tasksReducer from '../../store/slices/tasksSlice';

// Mock the taskApi module
jest.mock('../../api/taskApi', () => ({
  taskApi: {
    getAllTasks: jest.fn(() => Promise.resolve({ data: [] })),
    getTaskById: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
  },
}));

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

  it('should render tasks page title', async () => {
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

    // Wait for component to render and check for title
    await waitFor(() => {
      expect(screen.getByText('Aufgaben')).toBeInTheDocument();
    });
  });

  it('should display loading state initially', async () => {
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

    // Loading state should show progressbar
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('should show subtitle text', async () => {
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

    // Check for subtitle text
    await waitFor(() => {
      expect(screen.getByText(/Verwalte alle deine Aufgaben/i)).toBeInTheDocument();
    });
  });

  it('should show FAB button for adding tasks', async () => {
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

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
    });
  });
});
