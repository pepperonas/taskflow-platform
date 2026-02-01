import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import { PlayArrow as PlayIcon, Http as HttpIcon, Check as CheckIcon } from '@mui/icons-material';
import axios from 'axios';

const HttpIntegrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const examples = [
    {
      title: 'GitHub API',
      method: 'GET',
      url: 'https://api.github.com/users/github',
      description: 'Fetch GitHub user information',
    },
    {
      title: 'JSONPlaceholder',
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts/1',
      description: 'Fetch sample post data',
    },
    {
      title: 'Public REST API',
      method: 'GET',
      url: 'https://catfact.ninja/fact',
      description: 'Get random cat fact',
    },
  ];

  const handleTestRequest = async (url: string, method: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios({ method, url });
      setResult(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Chip
          icon={<HttpIcon />}
          label="HTTP Integration"
          sx={{ mb: 2, bgcolor: 'primary.main', color: 'white' }}
        />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          HTTP Request Node
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Make HTTP requests to any REST API with custom headers, authentication, and request bodies.
          Perfect for integrating external services into your workflows.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/workflows/new')}
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          Create HTTP Workflow
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Examples */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Try Live Examples
            </Typography>
            {examples.map((example, idx) => (
              <Card key={idx} sx={{ mb: 2, border: '1px solid #e5e7eb' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {example.title}
                    </Typography>
                    <Chip label={example.method} size="small" color="primary" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {example.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: '#f5f7fa',
                      p: 1,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      display: 'block',
                      mb: 2,
                      overflow: 'auto',
                    }}
                  >
                    {example.url}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<PlayIcon />}
                    onClick={() => handleTestRequest(example.url, example.method)}
                    disabled={loading}
                  >
                    Test Request
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Paper>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Response
            </Typography>
            {loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Making request...
                </Typography>
              </Box>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {result && (
              <>
                <Alert severity="success" icon={<CheckIcon />} sx={{ mb: 2 }}>
                  Request successful!
                </Alert>
                <Box
                  sx={{
                    bgcolor: '#1e1e1e',
                    color: '#d4d4d4',
                    p: 2,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    overflow: 'auto',
                    maxHeight: '400px',
                  }}
                >
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </Box>
              </>
            )}
            {!loading && !result && !error && (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  color: 'text.secondary',
                }}
              >
                <HttpIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
                <Typography variant="body2">
                  Click "Test Request" on any example to see the response
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Features */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Features
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    All HTTP Methods
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    GET, POST, PUT, PATCH, DELETE
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Custom Headers
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Add any headers you need
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Authentication
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    API Keys, Bearer tokens, Basic Auth
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Variable Interpolation
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Use {'{{ }}'} syntax for dynamic values
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HttpIntegrationPage;
