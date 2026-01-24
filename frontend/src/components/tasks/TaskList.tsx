import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  CircularProgress,
  Box,
  Typography,
  Alert,
  ListItemButton,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Task } from '../../types';
import { deleteTask } from '../../store/slices/tasksSlice';
import { AppDispatch } from '../../store';

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  error?: string | null;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, loading, error }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleDelete = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(id));
    }
  };

  const handleTaskClick = (id: string) => {
    navigate(`/tasks/${id}`);
  };

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
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (tasks.length === 0) {
    return (
      <Box textAlign="center" p={4}>
        <Typography variant="body1" color="textSecondary">
          No tasks yet. Create your first task!
        </Typography>
      </Box>
    );
  }

  return (
    <List>
      {tasks.map((task) => (
        <ListItem
          key={task.id}
          disablePadding
          secondaryAction={
            <>
              <IconButton edge="end" onClick={(e) => handleDelete(task.id, e)}>
                <DeleteIcon />
              </IconButton>
            </>
          }
        >
          <ListItemButton onClick={() => handleTaskClick(task.id)}>
            <ListItemText
              primary={task.title}
              secondary={
                <Box sx={{ mt: 1 }}>
                  <Chip
                    label={task.priority}
                    color={getPriorityColor(task.priority) as any}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={task.status}
                    color={getStatusColor(task.status) as any}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Chip label={task.category} size="small" variant="outlined" />
                </Box>
              }
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default TaskList;
