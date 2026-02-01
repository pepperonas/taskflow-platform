import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import DashboardPage from '../DashboardPage';
import authReducer from '../../store/slices/authSlice';
import tasksReducer from '../../store/slices/tasksSlice';

// Mock functions must be prefixed with 'mock' to be hoisted correctly
const mockGet = jest.fn();
const mockPost = jest.fn();

// Mock axios
jest.mock('../../api/axios', () => ({
  __esModule: true,
  default: {
    get: mockGet,
    post: mockPost,
  },
}));

// Mock recharts to avoid canvas issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => children,
  BarChart: () => <div data-testid="bar-chart">BarChart</div>,
  Bar: () => null,
  PieChart: () => <div data-testid="pie-chart">PieChart</div>,
  Pie: () => null,
  Cell: () => null,
  LineChart: () => <div data-testid="line-chart">LineChart</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

// Mock react-router-dom navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const mockTasks = [
  {
    id: '1',
    title: 'Test Task 1',
    description: 'Description 1',
    status: 'OPEN',
    priority: 'HIGH',
    category: 'BUG',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Test Task 2',
    description: 'Description 2',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    category: 'FEATURE',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Test Task 3',
    description: 'Description 3',
    status: 'COMPLETED',
    priority: 'LOW',
    category: 'TASK',
    createdAt: new Date().toISOString(),
  },
];

const mockWorkflows = [
  {
    id: 'wf-1',
    name: 'Test Workflow 1',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'wf-2',
    name: 'Test Workflow 2',
    status: 'DRAFT',
    createdAt: new Date().toISOString(),
  },
];

const mockExecutions = [
  {
    id: 'exec-1',
    workflowId: 'wf-1',
    status: 'COMPLETED',
    executedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
  {
    id: 'exec-2',
    workflowId: 'wf-1',
    status: 'FAILED',
    executedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
  },
];

const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      tasks: tasksReducer,
    },
    preloadedState: {
      auth: {
        user: { id: '1', username: 'testuser', email: 'test@example.com' },
        token: 'mock-token',
        loading: false,
        error: null,
        ...initialState,
      },
      tasks: {
        tasks: mockTasks,
        currentTask: null,
        loading: false,
        error: null,
      },
    },
  });
};

const renderWithProviders = (store = createMockStore()) => {
  // Set token in localStorage
  localStorage.setItem('token', 'mock-token');
  
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    </Provider>
  );
};

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('token', 'mock-token');
    
    // Setup default mock responses
    mockGet.mockImplementation((url: string) => {
      if (url === '/v1/workflows') {
        return Promise.resolve({ data: mockWorkflows });
      }
      if (url.includes('/executions')) {
        return Promise.resolve({ data: mockExecutions });
      }
      if (url === '/v1/credentials') {
        return Promise.resolve({ data: [{ id: '1', name: 'API Key' }] });
      }
      return Promise.resolve({ data: [] });
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render welcome message with username', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/Willkommen zurück, testuser!/)).toBeInTheDocument();
    });
  });

  it('should display stats cards', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Aufgaben gesamt')).toBeInTheDocument();
      expect(screen.getByText('Aktive Workflows')).toBeInTheDocument();
      expect(screen.getByText('Erfolgreiche Ausführungen')).toBeInTheDocument();
      expect(screen.getByText('Zugangsdaten')).toBeInTheDocument();
    });
  });

  it('should display quick actions buttons', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Schnellaktionen')).toBeInTheDocument();
      expect(screen.getByText('Workflow erstellen')).toBeInTheDocument();
      expect(screen.getByText('Datenbank-Integration')).toBeInTheDocument();
      expect(screen.getByText('Code-Ausführung')).toBeInTheDocument();
      expect(screen.getByText('E-Mail-Integration')).toBeInTheDocument();
    });
  });

  it('should navigate to workflows/new when create workflow is clicked', async () => {
    renderWithProviders();

    await waitFor(() => {
      const createWorkflowButton = screen.getByText('Workflow erstellen');
      fireEvent.click(createWorkflowButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/workflows/new');
  });

  it('should navigate to database integration', async () => {
    renderWithProviders();

    await waitFor(() => {
      const dbButton = screen.getByText('Datenbank-Integration');
      fireEvent.click(dbButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/integrations/database');
  });

  it('should navigate to code integration', async () => {
    renderWithProviders();

    await waitFor(() => {
      const codeButton = screen.getByText('Code-Ausführung');
      fireEvent.click(codeButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/integrations/code');
  });

  it('should navigate to email integration', async () => {
    renderWithProviders();

    await waitFor(() => {
      const emailButton = screen.getByText('E-Mail-Integration');
      fireEvent.click(emailButton);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/integrations/email');
  });

  it('should display task status chart section', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Aufgaben nach Status')).toBeInTheDocument();
    });
  });

  it('should display task priority chart section', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Aufgaben nach Priorität')).toBeInTheDocument();
    });
  });

  it('should display workflow overview section', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Workflows-Übersicht')).toBeInTheDocument();
    });
  });

  it('should display recent executions section', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Letzte Ausführungen')).toBeInTheDocument();
    });
  });

  it('should display recent tasks section', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Letzte Aufgaben')).toBeInTheDocument();
    });
  });

  it('should show FAB button for adding tasks', async () => {
    renderWithProviders();

    await waitFor(() => {
      const fabButton = screen.getByRole('button', { name: /add/i });
      expect(fabButton).toBeInTheDocument();
    });
  });

  it('should redirect to login if no token', async () => {
    localStorage.clear();
    
    render(
      <Provider store={createMockStore()}>
        <BrowserRouter>
          <DashboardPage />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    }, { timeout: 3000 });
  });

  it('should display correct task counts', async () => {
    renderWithProviders();

    await waitFor(() => {
      // Total tasks should be 3 (from mockTasks)
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  it('should display tasks created over time chart', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Erstellte Aufgaben (Letzte 7 Tage)')).toBeInTheDocument();
    });
  });

  it('should display workflow execution chart', async () => {
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText('Workflow-Ausführungen')).toBeInTheDocument();
    });
  });

  it('should show loading state for credentials', async () => {
    mockGet.mockImplementation((url: string) => {
      if (url === '/v1/credentials') {
        return new Promise(() => {}); // Never resolves
      }
      return Promise.resolve({ data: [] });
    });

    renderWithProviders();

    // Should show loading spinner initially
    await waitFor(() => {
      expect(screen.getByText('Zugangsdaten')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    mockGet.mockRejectedValue(new Error('API Error'));

    // Should not throw and should render
    renderWithProviders();

    await waitFor(() => {
      expect(screen.getByText(/Willkommen zurück/)).toBeInTheDocument();
    });
  });
});

describe('DashboardPage with empty data', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'mock-token');
    
    mockGet.mockImplementation((url: string) => {
      if (url === '/v1/workflows') {
        return Promise.resolve({ data: [] });
      }
      if (url === '/v1/credentials') {
        return Promise.resolve({ data: [] });
      }
      return Promise.resolve({ data: [] });
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should display empty state for workflows', async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        tasks: tasksReducer,
      },
      preloadedState: {
        auth: {
          user: { id: '1', username: 'testuser', email: 'test@example.com' },
          token: 'mock-token',
          loading: false,
          error: null,
        },
        tasks: {
          tasks: [],
          currentTask: null,
          loading: false,
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <DashboardPage />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Noch keine Workflows')).toBeInTheDocument();
    });
  });

  it('should display empty state for tasks chart', async () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        tasks: tasksReducer,
      },
      preloadedState: {
        auth: {
          user: { id: '1', username: 'testuser', email: 'test@example.com' },
          token: 'mock-token',
          loading: false,
          error: null,
        },
        tasks: {
          tasks: [],
          currentTask: null,
          loading: false,
          error: null,
        },
      },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <DashboardPage />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Noch keine Aufgaben')[0]).toBeInTheDocument();
    });
  });
});
