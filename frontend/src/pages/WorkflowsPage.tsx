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
      const response = await axiosInstance.get('/v1/workflows');

      setWorkflows(response.data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching workflows:', err);
      setError(err.response?.data?.message || 'Workflows konnten nicht geladen werden');
      setLoading(false);
    }
  };

  const handleExecuteWorkflow = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();

    try {
      await axiosInstance.post(`/v1/workflows/${id}/execute`, {});

      setSnackbar({
        open: true,
        message: 'Workflow erfolgreich ausgeführt!',
        severity: 'success',
      });
    } catch (err: any) {
      console.error('Error executing workflow:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Workflow konnte nicht ausgeführt werden',
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
      await axiosInstance.delete(`/v1/workflows/${workflowToDelete.id}`);

      setSnackbar({
        open: true,
        message: 'Workflow erfolgreich gelöscht',
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
        message: err.response?.data?.message || 'Workflow konnte nicht gelöscht werden',
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
          Erstelle und verwalte automatisierte Workflows mit dem visuellen Editor
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/workflows/new')}
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          Workflow erstellen
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Deine Workflows
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
              Noch keine Workflows. Erstelle deinen ersten automatisierten Workflow!
            </Typography>
            <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
              💡 Die Workflow-Engine ist bereit. Der visuelle Builder ist einsatzbereit!
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
                      Bearbeiten
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<PlayIcon />}
                      onClick={(e) => handleExecuteWorkflow(workflow.id, e)}
                    >
                      Ausführen
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
                          {workflow.description || 'Keine Beschreibung'}
                        </Typography>
                        <Chip
                          label={workflow.status}
                          color={getStatusColor(workflow.status) as any}
                          size="small"
                          sx={{ mr: 1 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Erstellt: {new Date(workflow.createdAt).toLocaleDateString('de-DE')}
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
          Workflow löschen
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Bist du sicher, dass du den Workflow "{workflowToDelete?.name}" löschen möchtest? 
            Diese Aktion kann nicht rückgängig gemacht werden.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleting}>
            Abbrechen
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={16} /> : <DeleteIcon />}
          >
            {deleting ? 'Wird gelöscht...' : 'Löschen'}
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
