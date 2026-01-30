import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Fab,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { AppDispatch, RootState } from '../store';
import { fetchTasks } from '../store/slices/tasksSlice';
import TaskList from '../components/tasks/TaskList';
import TaskFormDialog from '../components/tasks/TaskFormDialog';

const TasksPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading, error } = useSelector((state: RootState) => state.tasks);
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Tasks
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage all your tasks in one place
        </Typography>
      </Box>

      <TaskList tasks={tasks} loading={loading} error={error} />

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

export default TasksPage;
