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
} from '@mui/material';
import {
  Add as AddIcon,
  AccountTree as WorkflowIcon,
  Task as TaskIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import { AppDispatch, RootState } from '../store';
import { fetchTasks } from '../store/slices/tasksSlice';
import TaskList from '../components/tasks/TaskList';
import TaskFormDialog from '../components/tasks/TaskFormDialog';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const openTasks = tasks.filter(t => t.status === 'OPEN').length;

  const stats = [
    {
      title: 'Total Tasks',
      value: tasks.length,
      icon: <TaskIcon sx={{ fontSize: 40 }} />,
      color: '#667eea',
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: <ScheduleIcon sx={{ fontSize: 40 }} />,
      color: '#f093fb',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: <CheckCircleIcon sx={{ fontSize: 40 }} />,
      color: '#43e97b',
    },
    {
      title: 'Open',
      value: openTasks,
      icon: <TaskIcon sx={{ fontSize: 40 }} />,
      color: '#fa709a',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Welcome back, {user?.username}! 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's what's happening with your tasks today
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
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                      {stat.value}
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
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<WorkflowIcon />}
            onClick={() => navigate('/workflows/new')}
            sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            Create Workflow
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            New Task
          </Button>
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
        <TaskList tasks={tasks} loading={loading} error={error} />
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
