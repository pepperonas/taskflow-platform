import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { 
  PlayArrow as PlayIcon, 
  Storage as DatabaseIcon, 
  Check as CheckIcon,
  Warning as WarningIcon 
} from '@mui/icons-material';
import axiosInstance from '../api/axios';

const DatabaseIntegrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(`SELECT id, title, status, created_at 
FROM tasks 
WHERE status = 'OPEN' 
ORDER BY created_at DESC 
LIMIT 10;`);

  const examples = [
    {
      title: 'Select Tasks',
      query: `SELECT id, title, status, created_at 
FROM tasks 
WHERE status = 'OPEN' 
ORDER BY created_at DESC 
LIMIT 10;`,
      description: 'Fetch open tasks',
    },
    {
      title: 'Count Workflows',
      query: `SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active,
  COUNT(CASE WHEN status = 'DRAFT' THEN 1 END) as draft
FROM workflows;`,
      description: 'Get workflow statistics',
    },
    {
      title: 'Join Query',
      query: `SELECT 
  t.id,
  t.title,
  t.status,
  u.email as assigned_to,
  w.name as workflow_name
FROM tasks t
LEFT JOIN users u ON t.assignee_id = u.id
LEFT JOIN workflows w ON t.id = w.id
WHERE t.status = 'IN_PROGRESS';`,
      description: 'Join tasks with users and workflows',
    },
  ];

  const handleTestQuery = async (testQuery: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axiosInstance.post('/v1/database/query', {
        query: testQuery
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setResult({
          rows: response.data.rows || [],
          rowCount: response.data.rowCount || 0,
          executionTime: `${response.data.executionTimeMs || 0}ms`
        });
      }
    } catch (err: any) {
      console.error('Query execution error:', err);
      console.error('Error response:', err.response?.data);
      
      // Try to extract the error message from the response
      let errorMessage = 'Query execution failed';
      if (err.response?.data) {
        if (err.response.data.error) {
          errorMessage = err.response.data.error;
        } else if (err.response.data.message) {
          errorMessage = err.response.data.message;
        } else if (typeof err.response.data === 'string') {
          errorMessage = err.response.data;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Chip
          icon={<DatabaseIcon />}
          label="Database Integration"
          sx={{ mb: 2, bgcolor: '#43e97b', color: 'white' }}
        />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Database Node
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Execute SQL queries against your PostgreSQL database. Read and write data directly from your workflows.
          Perfect for data synchronization, reporting, and complex data operations.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/workflows/new')}
          sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}
        >
          Create Database Workflow
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Query Editor */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              SQL Query Editor
            </Typography>
            <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>
              Available variables: <code>{'{{ $trigger.field }}'}</code>, <code>{'{{ $vars.name }}'}</code>
            </Alert>
            <TextField
              fullWidth
              multiline
              rows={10}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiInputBase-input': {
                  fontFamily: 'monospace',
                  fontSize: '13px',
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<PlayIcon />}
              onClick={() => handleTestQuery(query)}
              disabled={loading}
              sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}
            >
              Execute Query
            </Button>
          </Paper>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Query Results
            </Typography>
            {loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Executing query...
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
                  Query executed successfully! ({result.executionTime})
                </Alert>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Rows returned: {result.rowCount}
                  </Typography>
                </Box>
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
                  <pre>{JSON.stringify(result.rows, null, 2)}</pre>
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
                <DatabaseIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
                <Typography variant="body2">
                  Enter a SQL query and click "Execute Query" to see results
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Examples */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Example Queries
            </Typography>
            <Grid container spacing={2}>
              {examples.map((example, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Card sx={{ border: '1px solid #e5e7eb', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {example.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {example.description}
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: '#f5f7fa',
                          p: 1,
                          borderRadius: 1,
                          fontFamily: 'monospace',
                          fontSize: '11px',
                          mb: 2,
                          maxHeight: '100px',
                          overflow: 'auto',
                        }}
                      >
                        {example.query}
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<PlayIcon />}
                        onClick={() => {
                          setQuery(example.query);
                          handleTestQuery(example.query);
                        }}
                        disabled={loading}
                        fullWidth
                      >
                        Try This Query
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
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
                    Full SQL Support
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    SELECT, INSERT, UPDATE, DELETE
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Parameterized Queries
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Safe variable interpolation
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Transaction Support
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rollback on errors
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Connection Pooling
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Optimized performance
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            <Alert severity="warning" icon={<WarningIcon />} sx={{ mt: 3 }}>
              <Typography variant="caption">
                <strong>Security:</strong> All queries are executed with read-only permissions by default. 
                Write operations require explicit configuration in workflow settings.
              </Typography>
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DatabaseIntegrationPage;
