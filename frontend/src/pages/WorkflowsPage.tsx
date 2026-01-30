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
} from '@mui/material';
import {
  Add as AddIcon,
  PlayArrow as PlayIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import axios from 'axios';

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

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

      const response = await axios.get(`${apiUrl}/v1/workflows`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

      await axios.post(
        `${apiUrl}/v1/workflows/${id}/execute`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Workflow executed successfully!');
    } catch (err: any) {
      console.error('Error executing workflow:', err);
      alert(err.response?.data?.message || 'Failed to execute workflow');
    }
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
                    <>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EditIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/workflows/${workflow.id}/edit`);
                        }}
                        sx={{ mr: 1 }}
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
                    </>
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
    </Container>
  );
};

export default WorkflowsPage;
