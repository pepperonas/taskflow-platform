import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Paper,
  Alert,
  Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import KeyIcon from '@mui/icons-material/Key';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

interface Credential {
  id: string;
  name: string;
  type: string;
  createdAt: string;
}

const CredentialsPage: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [newCred, setNewCred] = useState({
    name: '',
    type: 'api_key',
    data: {
      apiKey: '',
      username: '',
      password: '',
    },
  });

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/v1/credentials`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCredentials(response.data);
    } catch (err: any) {
      console.error('Failed to fetch credentials:', err);
      setError('Failed to load credentials');
    }
  };

  const handleCreate = async () => {
    if (!newCred.name.trim()) {
      setError('Credential name is required');
      return;
    }

    if (newCred.type === 'api_key' && !newCred.data.apiKey.trim()) {
      setError('API Key is required');
      return;
    }

    if (newCred.type === 'basic_auth' && (!newCred.data.username || !newCred.data.password)) {
      setError('Username and password are required for basic auth');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_URL}/v1/credentials`,
        {
          name: newCred.name,
          type: newCred.type,
          data: newCred.type === 'api_key'
            ? { apiKey: newCred.data.apiKey }
            : { username: newCred.data.username, password: newCred.data.password },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess('Credential created successfully');
      setDialogOpen(false);
      setNewCred({
        name: '',
        type: 'api_key',
        data: { apiKey: '', username: '', password: '' },
      });
      fetchCredentials();
    } catch (err: any) {
      console.error('Failed to create credential:', err);
      setError(err.response?.data?.message || 'Failed to create credential');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this credential?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/v1/credentials/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Credential deleted successfully');
      fetchCredentials();
    } catch (err: any) {
      console.error('Failed to delete credential:', err);
      setError('Failed to delete credential');
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'api_key':
        return 'primary';
      case 'basic_auth':
        return 'secondary';
      case 'oauth2':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            <KeyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Credentials
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
            Securely store API keys and authentication credentials
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Add Credential
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      {credentials.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: '#6b7280', mb: 2 }}>
            No credentials yet
          </Typography>
          <Typography variant="body2" sx={{ color: '#9ca3af' }}>
            Create your first credential to use in HTTP Request nodes
          </Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {credentials.map((cred, index) => (
              <ListItem
                key={cred.id}
                divider={index < credentials.length - 1}
                sx={{ py: 2 }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {cred.name}
                      <Chip
                        label={cred.type.replace('_', ' ').toUpperCase()}
                        size="small"
                        color={getTypeColor(cred.type) as any}
                      />
                    </Box>
                  }
                  secondary={`Created: ${new Date(cred.createdAt).toLocaleString()}`}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => handleDelete(cred.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Credential</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Credential Name"
            value={newCred.name}
            onChange={(e) => setNewCred({ ...newCred, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
            placeholder="e.g., OpenWeather API Key"
          />

          <TextField
            select
            fullWidth
            label="Type"
            value={newCred.type}
            onChange={(e) => setNewCred({ ...newCred, type: e.target.value })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="api_key">API Key</MenuItem>
            <MenuItem value="basic_auth">Basic Auth (Username/Password)</MenuItem>
          </TextField>

          {newCred.type === 'api_key' && (
            <TextField
              fullWidth
              type="password"
              label="API Key"
              value={newCred.data.apiKey}
              onChange={(e) =>
                setNewCred({
                  ...newCred,
                  data: { ...newCred.data, apiKey: e.target.value },
                })
              }
              placeholder="Enter your API key"
              helperText="Your API key will be encrypted before storage"
            />
          )}

          {newCred.type === 'basic_auth' && (
            <>
              <TextField
                fullWidth
                label="Username"
                value={newCred.data.username}
                onChange={(e) =>
                  setNewCred({
                    ...newCred,
                    data: { ...newCred.data, username: e.target.value },
                  })
                }
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                type="password"
                label="Password"
                value={newCred.data.password}
                onChange={(e) =>
                  setNewCred({
                    ...newCred,
                    data: { ...newCred.data, password: e.target.value },
                  })
                }
                helperText="Your credentials will be encrypted before storage"
              />
            </>
          )}

          <Alert severity="info" sx={{ mt: 2, fontSize: '12px' }}>
            Credentials are encrypted using AES-256-GCM before being stored.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={loading}>
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CredentialsPage;
