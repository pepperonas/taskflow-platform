import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Fab,
  Chip,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  AccountTree as WorkflowIcon,
  Task as TaskIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Code as CodeIcon,
  Storage as DatabaseIcon,
  Email as EmailIcon,
  Key as KeyIcon,
  TrendingUp as TrendingUpIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { AppDispatch, RootState } from '../store';
import { fetchTasks } from '../store/slices/tasksSlice';
import TaskList from '../components/tasks/TaskList';
import TaskFormDialog from '../components/tasks/TaskFormDialog';
import axiosInstance from '../api/axios';

interface Workflow {
  id: string;
  name: string;
  status: string;
  createdAt: string;
}

interface WorkflowExecution {
  id: string;
  workflowId: string;
  status: string;
  executedAt: string;
  completedAt: string;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks, loading: tasksLoading, error: tasksError } = useSelector((state: RootState) => state.tasks);
  const [openDialog, setOpenDialog] = useState(false);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [workflowsLoading, setWorkflowsLoading] = useState(true);
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [credentialsCount, setCredentialsCount] = useState(0);
  const [credentialsLoading, setCredentialsLoading] = useState(true);

  useEffect(() => {
    // Wait a bit to ensure token is set after login
    const token = localStorage.getItem('token');
    if (!token) {
      // If no token, redirect to login
      navigate('/login');
      return;
    }
    
    // Small delay to ensure token is available for API calls
    const timer = setTimeout(() => {
      dispatch(fetchTasks());
      fetchWorkflows();
      fetchRecentExecutions();
      fetchCredentialsCount();
    }, 100);
    
    return () => clearTimeout(timer);
  }, [dispatch, navigate]);

  const fetchWorkflows = async () => {
    try {
      const response = await axiosInstance.get('/v1/workflows');
      setWorkflows(response.data || []);
    } catch (err) {
      console.error('Failed to fetch workflows:', err);
    } finally {
      setWorkflowsLoading(false);
    }
  };

  const fetchRecentExecutions = async () => {
    try {
      // Fetch executions from all workflows
      const workflowsResponse = await axiosInstance.get('/v1/workflows');
      const allWorkflows = workflowsResponse.data || [];
      
      // Get executions for each workflow (limit to first 5 workflows to avoid too many requests)
      const executionPromises = allWorkflows.slice(0, 5).map(async (workflow: Workflow) => {
        try {
          const execResponse = await axiosInstance.get(`/v1/workflows/${workflow.id}/executions`);
          return execResponse.data || [];
        } catch (err) {
          return [];
        }
      });
      
      const allExecutions = await Promise.all(executionPromises);
      const flattened = allExecutions.flat().sort((a, b) => 
        new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()
      ).slice(0, 20);
      
      setExecutions(flattened);
    } catch (err) {
      console.error('Failed to fetch executions:', err);
    }
  };

  const fetchCredentialsCount = async () => {
    try {
      const response = await axiosInstance.get('/v1/credentials');
      setCredentialsCount((response.data || []).length);
    } catch (err) {
      console.error('Failed to fetch credentials:', err);
    } finally {
      setCredentialsLoading(false);
    }
  };

  // Calculate task statistics
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const openTasks = tasks.filter(t => t.status === 'OPEN').length;
  const archivedTasks = tasks.filter(t => t.status === 'ARCHIVED').length;

  // Calculate workflow statistics
  const activeWorkflows = workflows.filter(w => w.status === 'ACTIVE').length;
  const draftWorkflows = workflows.filter(w => w.status === 'DRAFT').length;

  // Calculate execution statistics
  const completedExecutions = executions.filter(e => e.status === 'COMPLETED').length;
  const failedExecutions = executions.filter(e => e.status === 'FAILED').length;
  const runningExecutions = executions.filter(e => e.status === 'RUNNING').length;

  // Task status distribution for pie chart
  const taskStatusData = [
    { name: 'Completed', value: completedTasks, color: '#43e97b' },
    { name: 'In Progress', value: inProgressTasks, color: '#f093fb' },
    { name: 'Open', value: openTasks, color: '#fa709a' },
    { name: 'Archived', value: archivedTasks, color: '#9ca3af' },
  ].filter(item => item.value > 0);

  // Task priority distribution
  const priorityData = [
    { name: 'LOW', value: tasks.filter(t => t.priority === 'LOW').length },
    { name: 'MEDIUM', value: tasks.filter(t => t.priority === 'MEDIUM').length },
    { name: 'HIGH', value: tasks.filter(t => t.priority === 'HIGH').length },
    { name: 'CRITICAL', value: tasks.filter(t => t.priority === 'CRITICAL').length },
  ].filter(item => item.value > 0);

  // Execution status distribution
  const executionStatusData = [
    { name: 'Completed', value: completedExecutions, color: '#43e97b' },
    { name: 'Failed', value: failedExecutions, color: '#ef4444' },
    { name: 'Running', value: runningExecutions, color: '#f093fb' },
  ].filter(item => item.value > 0);

  // Tasks created over time (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const tasksOverTime = last7Days.map(date => {
    const dayTasks = tasks.filter(t => {
      const taskDate = new Date(t.createdAt).toISOString().split('T')[0];
      return taskDate === date;
    });
    return {
      date: new Date(date).toLocaleDateString('de-DE', { month: 'short', day: 'numeric' }),
      tasks: dayTasks.length,
    };
  });

  const stats = [
    {
      title: 'Total Tasks',
      value: tasks.length,
      icon: <TaskIcon sx={{ fontSize: 40 }} />,
      color: '#667eea',
      link: '/tasks',
    },
    {
      title: 'Active Workflows',
      value: activeWorkflows,
      icon: <WorkflowIcon sx={{ fontSize: 40 }} />,
      color: '#764ba2',
      link: '/workflows',
    },
    {
      title: 'Completed Executions',
      value: completedExecutions,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: '#43e97b',
      link: '/workflows',
    },
    {
      title: 'Credentials',
      value: credentialsCount,
      icon: <KeyIcon sx={{ fontSize: 40 }} />,
      color: '#fa709a',
      link: '/credentials',
      loading: credentialsLoading,
    },
  ];

  const quickActions = [
    {
      title: 'Create Workflow',
      icon: <WorkflowIcon />,
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      onClick: () => navigate('/workflows/new'),
    },
    {
      title: 'Database Integration',
      icon: <DatabaseIcon />,
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      onClick: () => navigate('/integrations/database'),
    },
    {
      title: 'Code Execution',
      icon: <CodeIcon />,
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      onClick: () => navigate('/integrations/code'),
    },
    {
      title: 'Email Integration',
      icon: <EmailIcon />,
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      onClick: () => navigate('/integrations/email'),
    },
  ];

  const COLORS = ['#667eea', '#764ba2', '#43e97b', '#fa709a', '#f093fb', '#4facfe'];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, {user?.username}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your TaskFlow platform
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                border: `1px solid ${stat.color}30`,
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 8px 16px ${stat.color}30`,
                },
              }}
              onClick={() => stat.link && navigate(stat.link)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stat.loading ? <CircularProgress size={24} /> : stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color, opacity: 0.6 }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          {quickActions.map((action, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Button
                fullWidth
                variant="contained"
                startIcon={action.icon}
                onClick={action.onClick}
                sx={{
                  background: action.color,
                  py: 2,
                  '&:hover': {
                    background: action.color,
                    opacity: 0.9,
                  },
                }}
              >
                {action.title}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Task Status Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Task Status Distribution
            </Typography>
            {taskStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Typography variant="body2" color="text.secondary">
                  No tasks yet
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Task Priority Distribution */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Task Priority Distribution
            </Typography>
            {priorityData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Typography variant="body2" color="text.secondary">
                  No tasks yet
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Tasks Created Over Time */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Tasks Created (Last 7 Days)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={tasksOverTime}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="tasks" stroke="#667eea" strokeWidth={2} name="Tasks Created" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Workflow Execution Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Workflow Execution Status
            </Typography>
            {executionStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={executionStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {executionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Typography variant="body2" color="text.secondary">
                  No executions yet
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Workflow Overview */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Workflows Overview
              </Typography>
              <Chip label={`${workflows.length} total`} size="small" />
            </Box>
            {workflowsLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : workflows.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  No workflows yet
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/workflows/new')}
                  sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  Create Workflow
                </Button>
              </Box>
            ) : (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Active: <strong>{activeWorkflows}</strong>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Draft: <strong>{draftWorkflows}</strong>
                  </Typography>
                </Box>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<WorkflowIcon />}
                  onClick={() => navigate('/workflows')}
                  sx={{ mt: 2 }}
                >
                  View All Workflows
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Recent Executions
              </Typography>
              <Chip label={`${executions.length} shown`} size="small" />
            </Box>
            {executions.length === 0 ? (
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  No executions yet. Execute a workflow to see results here.
                </Typography>
              </Box>
            ) : (
              <Box>
                {executions.slice(0, 5).map((execution, idx) => (
                  <Box key={execution.id} sx={{ mb: 1.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {execution.workflowId.substring(0, 8)}...
                      </Typography>
                      <Chip
                        label={execution.status}
                        size="small"
                        color={
                          execution.status === 'COMPLETED' ? 'success' :
                          execution.status === 'FAILED' ? 'error' :
                          'default'
                        }
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(execution.executedAt).toLocaleString()}
                    </Typography>
                    {idx < Math.min(executions.length, 5) - 1 && <Divider sx={{ mt: 1 }} />}
                  </Box>
                ))}
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<PlayIcon />}
                  onClick={() => navigate('/workflows')}
                  sx={{ mt: 2 }}
                >
                  View All Executions
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Tasks */}
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Recent Tasks
          </Typography>
          <Chip label={`${tasks.length} total`} size="small" />
        </Box>
        <TaskList tasks={tasks.slice(0, 10)} loading={tasksLoading} error={tasksError} />
        {tasks.length > 10 && (
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button variant="outlined" onClick={() => navigate('/tasks')}>
              View All Tasks
            </Button>
          </Box>
        )}
      </Paper>

      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        }}
        onClick={() => setOpenDialog(true)}
      >
        <AddIcon />
      </Fab>

      <TaskFormDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />
    </Container>
  );
};

export default DashboardPage;
