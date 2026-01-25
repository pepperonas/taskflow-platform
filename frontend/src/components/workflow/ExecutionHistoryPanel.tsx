import React, { useState, useEffect, useCallback } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  List,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import axios from 'axios';
import ExecutionHistoryItem from './ExecutionHistoryItem';

interface ExecutionHistoryPanelProps {
  open: boolean;
  onClose: () => void;
  workflowId: string | undefined;
  onSelectExecution: (execution: any) => void;
}

const ExecutionHistoryPanel: React.FC<ExecutionHistoryPanelProps> = ({
  open,
  onClose,
  workflowId,
  onSelectExecution,
}) => {
  const [executions, setExecutions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExecutions = useCallback(async () => {
    if (!workflowId || workflowId === 'new') return;

    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

      const response = await axios.get(
        `${apiUrl}/v1/workflows/${workflowId}/executions`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('[ExecutionHistoryPanel] Fetched executions:', response.data);
      setExecutions(response.data);
    } catch (err: any) {
      console.error('[ExecutionHistoryPanel] Error fetching executions:', err);
      setError(err.response?.data?.message || 'Failed to load execution history');
    } finally {
      setLoading(false);
    }
  }, [workflowId]);

  useEffect(() => {
    if (open && workflowId && workflowId !== 'new') {
      fetchExecutions();
    }
  }, [open, workflowId, fetchExecutions]);

  const handleSelectExecution = (execution: any) => {
    onSelectExecution(execution);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 400,
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e5e7eb',
          bgcolor: '#f9fafb',
        }}
      >
        <Typography variant="h6">Execution History</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={fetchExecutions} size="small" disabled={loading}>
            <RefreshIcon />
          </IconButton>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Box sx={{ p: 2 }}>
            <Alert severity="error">{error}</Alert>
          </Box>
        )}

        {!loading && !error && executions.length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              No executions yet
            </Typography>
            <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block', mt: 1 }}>
              Execute your workflow to see history here
            </Typography>
          </Box>
        )}

        {!loading && !error && executions.length > 0 && (
          <>
            <Box sx={{ p: 2, bgcolor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                {executions.length} execution{executions.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
            <List disablePadding>
              {executions.map((execution, index) => (
                <React.Fragment key={execution.id}>
                  <ExecutionHistoryItem
                    execution={execution}
                    onClick={() => handleSelectExecution(execution)}
                  />
                  {index < executions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default ExecutionHistoryPanel;
