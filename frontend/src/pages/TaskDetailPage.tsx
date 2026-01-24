import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Stack,
  Divider,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '../store';
import { fetchTasks } from '../store/slices/tasksSlice';

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    if (tasks.length === 0) {
      dispatch(fetchTasks());
    }
  }, [dispatch, tasks.length]);

  const task = tasks.find((t) => t.id === id);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'error';
      case 'HIGH':
        return 'warning';
      case 'MEDIUM':
        return 'info';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'IN_PROGRESS':
        return 'primary';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!task) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Task nicht gefunden
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{ mt: 2 }}
          >
            Zurück zum Dashboard
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/dashboard')}
        sx={{ mb: 2 }}
      >
        Zurück
      </Button>

      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {task.title}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
          <Chip
            label={task.priority}
            color={getPriorityColor(task.priority) as any}
            size="small"
          />
          <Chip
            label={task.status}
            color={getStatusColor(task.status) as any}
            size="small"
          />
          <Chip label={task.category} size="small" variant="outlined" />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Beschreibung
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {task.description || 'Keine Beschreibung vorhanden'}
          </Typography>
        </Box>

        {task.assigneeName && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Zugewiesen an
            </Typography>
            <Typography variant="body1">{task.assigneeName}</Typography>
          </Box>
        )}

        {task.dueDate && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Fällig am
            </Typography>
            <Typography variant="body1">
              {new Date(task.dueDate).toLocaleDateString('de-DE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </Typography>
          </Box>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Erstellt am
          </Typography>
          <Typography variant="body1">
            {new Date(task.createdAt).toLocaleDateString('de-DE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </Box>

        {task.tags && task.tags.length > 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Tags
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {task.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" />
              ))}
            </Stack>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default TaskDetailPage;
