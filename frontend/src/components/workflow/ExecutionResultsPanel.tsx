import React, { useState } from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';

interface ExecutionResultsPanelProps {
  execution: any;
  onClose: () => void;
}

const ExecutionResultsPanel: React.FC<ExecutionResultsPanelProps> = ({ execution, onClose }) => {
  if (!execution) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon sx={{ color: '#10b981' }} />;
      case 'FAILED':
        return <ErrorIcon sx={{ color: '#ef4444' }} />;
      default:
        return <InfoIcon sx={{ color: '#3b82f6' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'FAILED':
        return 'error';
      default:
        return 'info';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Drawer
      anchor="bottom"
      open={!!execution}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          height: '400px',
          boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getStatusIcon(execution.status)}
          <Typography variant="h6">Execution Results</Typography>
          <Chip
            label={execution.status}
            color={getStatusColor(execution.status) as any}
            size="small"
          />
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Execution Info */}
      <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb', bgcolor: '#f9fafb' }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#6b7280' }}>
              Execution ID
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {execution.id}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" sx={{ color: '#6b7280' }}>
              Started At
            </Typography>
            <Typography variant="body2">
              {formatTimestamp(execution.createdAt)}
            </Typography>
          </Box>
          {execution.updatedAt && (
            <Box>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                Completed At
              </Typography>
              <Typography variant="body2">
                {formatTimestamp(execution.updatedAt)}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Execution Log */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">Execution Log</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              sx={{
                bgcolor: '#1f2937',
                color: '#f3f4f6',
                p: 2,
                borderRadius: 1,
                fontFamily: 'monospace',
                fontSize: '12px',
                maxHeight: '200px',
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
              }}
            >
              {execution.executionLog || 'No log available'}
            </Box>
          </AccordionDetails>
        </Accordion>

        {execution.triggerData && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2">Trigger Data</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  bgcolor: '#f9fafb',
                  p: 2,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                <pre>{JSON.stringify(execution.triggerData, null, 2)}</pre>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}

        {execution.result && (
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle2">Execution Result</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  bgcolor: '#f0fdf4',
                  p: 2,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  overflow: 'auto',
                }}
              >
                <pre>{JSON.stringify(execution.result, null, 2)}</pre>
              </Box>
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    </Drawer>
  );
};

export default ExecutionResultsPanel;
