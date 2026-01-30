import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Snackbar,
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axiosInstance from '../api/axios';

interface Workflow {
  id: string;
  name: string;
  description: string;
  status: string;
  createdAt: string;
}

const WorkflowsPage: React.FC = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workflowToDelete, setWorkflowToDelete] = useState<Workflow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

      const response = await axiosInstance.get(`${apiUrl}/v1/workflows`);

      setWorkflows(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching workflows:', err);
      setError(err.response?.data?.message || 'Failed to load workflows');
      setLoading(false);
    }
  };

  const handleExecuteWorkflow = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

      await axiosInstance.post(`${apiUrl}/v1/workflows/${id}/execute`, {});

      setSnackbar({
        open: true,
        message: 'Workflow executed successfully!',
        severity: 'success',
      });
    } catch (err: any) {
      console.error('Error executing workflow:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to execute workflow',
        severity: 'error',
      });
    }
  };

  const handleDeleteClick = (workflow: Workflow, event: React.MouseEvent) => {
    event.stopPropagation();
    setWorkflowToDelete(workflow);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!workflowToDelete) return;

    setDeleting(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

      await axiosInstance.delete(`${apiUrl}/v1/workflows/${workflowToDelete.id}`);

      setSnackbar({
        open: true,
        message: 'Workflow deleted successfully',
        severity: 'success',
      });

      // Refresh workflows list
      await fetchWorkflows();
      setDeleteDialogOpen(false);
      setWorkflowToDelete(null);
    } catch (err: any) {
      console.error('Error deleting workflow:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to delete workflow',
        severity: 'error',
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setWorkflowToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'DRAFT':
        return 'default';
      case 'ARCHIVED':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Workflows
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Create and manage automated workflows with visual editor
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

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Your Workflows
          </Typography>
        </Box>

        {loading && (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!loading && !error && workflows.length === 0 && (
          <Box textAlign="center" p={4}>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              No workflows yet. Create your first automated workflow!
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              💡 The workflow execution engine is ready. Frontend builder coming soon!
            </Typography>
          </Box>
        )}

        {!loading && workflows.length > 0 && (
          <List>
            {workflows.map((workflow) => (
              <ListItem
                key={workflow.id}
                disablePadding
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/workflows/${workflow.id}/edit`);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PlayIcon />}
                      onClick={(e) => handleExecuteWorkflow(workflow.id, e)}
                    >
                      Execute
                    </Button>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={(e) => handleDeleteClick(workflow, e)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemButton>
                  <ListItemText
                    primary={workflow.name}
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {workflow.description || 'No description'}
                        </Typography>
                        <Chip
                          label={workflow.status}
                          color={getStatusColor(workflow.status) as any}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Created: {new Date(workflow.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Workflow
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the workflow "{workflowToDelete?.name}"? 
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WorkflowsPage;
