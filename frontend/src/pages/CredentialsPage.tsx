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
import axiosInstance from '../api/axios';

interface Credential {
  id: string;
  name: string;
  type: string;
  createdAt: string;
}

const CredentialsPage: React.FC = () => {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
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
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/v1/credentials');
      setCredentials(response.data || []);
    } catch (err: any) {
      console.error('Failed to fetch credentials:', err);
      
      // Handle network errors (502, 503, etc.)
      if (!err.response) {
        setError('Unable to connect to server. Please check your connection and try again.');
        return;
      }
      
      // Handle authentication errors
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Don't set error here - axiosInstance will handle redirect
        setError('Authentifizierung erforderlich. Bitte melde dich an.');
        return;
      }
      
      // Handle server errors
      if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
        return;
      }
      
      // Handle other errors
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Zugangsdaten konnten nicht geladen werden';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!newCred.name.trim()) {
      setError('Name ist erforderlich');
      return;
    }

    if (newCred.type === 'api_key' && !newCred.data.apiKey.trim()) {
      setError('API-Schlüssel ist erforderlich');
      return;
    }

    if (newCred.type === 'basic_auth' && (!newCred.data.username || !newCred.data.password)) {
      setError('Benutzername und Passwort sind für Basic Auth erforderlich');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axiosInstance.post(
        '/v1/credentials',
        {
          name: newCred.name,
          type: newCred.type,
          data: newCred.type === 'api_key'
            ? { apiKey: newCred.data.apiKey }
            : { username: newCred.data.username, password: newCred.data.password },
        }
      );

      setSuccess('Zugangsdaten erfolgreich erstellt');
      setDialogOpen(false);
      setNewCred({
        name: '',
        type: 'api_key',
        data: { apiKey: '', username: '', password: '' },
      });
      fetchCredentials();
    } catch (err: any) {
      console.error('Failed to create credential:', err);
      
      // Handle network errors
      if (!err.response) {
        setError('Unable to connect to server. Please check your connection and try again.');
        return;
      }
      
      // Handle server errors
      if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
        return;
      }
      
      // Handle validation errors
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Zugangsdaten konnten nicht erstellt werden';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bist du sicher, dass du diese Zugangsdaten löschen möchtest?')) {
      return;
    }

    try {
      await axiosInstance.delete(`/v1/credentials/${id}`);
      setSuccess('Zugangsdaten erfolgreich gelöscht');
      fetchCredentials();
    } catch (err: any) {
      console.error('Failed to delete credential:', err);
      
      // Handle network errors
      if (!err.response) {
        setError('Unable to connect to server. Please check your connection and try again.');
        return;
      }
      
      // Handle server errors
      if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
        return;
      }
      
      // Handle other errors
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Zugangsdaten konnten nicht gelöscht werden';
      setError(errorMessage);
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
            Zugangsdaten
          </Typography>
          <Typography variant="body2" sx={{ color: '#6b7280', mt: 1 }}>
            API-Schlüssel und Authentifizierungsdaten sicher speichern
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Zugangsdaten hinzufügen
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

      {loading ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: '#6b7280' }}>
            Lade Zugangsdaten...
          </Typography>
        </Paper>
      ) : credentials.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: '#6b7280', mb: 2 }}>
            Noch keine Zugangsdaten
          </Typography>
          <Typography variant="body2" sx={{ color: '#9ca3af' }}>
            Erstelle deine ersten Zugangsdaten für HTTP-Request-Nodes
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
                  secondary={`Erstellt: ${new Date(cred.createdAt).toLocaleString('de-DE')}`}
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
        <DialogTitle>Neue Zugangsdaten erstellen</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={newCred.name}
            onChange={(e) => setNewCred({ ...newCred, name: e.target.value })}
            sx={{ mt: 2, mb: 2 }}
            placeholder="z.B. OpenWeather API Key"
          />

          <TextField
            select
            fullWidth
            label="Typ"
            value={newCred.type}
            onChange={(e) => setNewCred({ ...newCred, type: e.target.value })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="api_key">API-Schlüssel</MenuItem>
            <MenuItem value="basic_auth">Basic Auth (Benutzername/Passwort)</MenuItem>
          </TextField>

          {newCred.type === 'api_key' && (
            <TextField
              fullWidth
              type="password"
              label="API-Schlüssel"
              value={newCred.data.apiKey}
              onChange={(e) =>
                setNewCred({
                  ...newCred,
                  data: { ...newCred.data, apiKey: e.target.value },
                })
              }
              placeholder="Gib deinen API-Schlüssel ein"
              helperText="Dein API-Schlüssel wird vor dem Speichern verschlüsselt"
            />
          )}

          {newCred.type === 'basic_auth' && (
            <>
              <TextField
                fullWidth
                label="Benutzername"
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
                label="Passwort"
                value={newCred.data.password}
                onChange={(e) =>
                  setNewCred({
                    ...newCred,
                    data: { ...newCred.data, password: e.target.value },
                  })
                }
                helperText="Deine Zugangsdaten werden vor dem Speichern verschlüsselt"
              />
            </>
          )}

          <Alert severity="info" sx={{ mt: 2, fontSize: '12px' }}>
            Zugangsdaten werden mit AES-256-GCM verschlüsselt gespeichert.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Abbrechen</Button>
          <Button onClick={handleCreate} variant="contained" disabled={loading}>
            {loading ? 'Wird erstellt...' : 'Erstellen'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CredentialsPage;
