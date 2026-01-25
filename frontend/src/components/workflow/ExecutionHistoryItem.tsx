import React from 'react';
import {
  ListItem,
  ListItemButton,
  Box,
  Typography,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';

interface ExecutionHistoryItemProps {
  execution: any;
  onClick: () => void;
}

const ExecutionHistoryItem: React.FC<ExecutionHistoryItemProps> = ({ execution, onClick }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon sx={{ color: '#10b981', fontSize: '20px' }} />;
      case 'FAILED':
        return <ErrorIcon sx={{ color: '#ef4444', fontSize: '20px' }} />;
      default:
        return <PendingIcon sx={{ color: '#f59e0b', fontSize: '20px' }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'FAILED':
        return 'error';
      default:
        return 'warning';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getDuration = () => {
    if (!execution.createdAt || !execution.updatedAt) return null;
    const start = new Date(execution.createdAt).getTime();
    const end = new Date(execution.updatedAt).getTime();
    const durationMs = end - start;
    const seconds = Math.floor(durationMs / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <ListItem disablePadding>
      <ListItemButton onClick={onClick} sx={{ py: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
          {getStatusIcon(execution.status)}

          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                {execution.id.substring(0, 8)}...
              </Typography>
              <Chip
                label={execution.status}
                size="small"
                color={getStatusColor(execution.status) as any}
                sx={{ height: '20px', fontSize: '11px' }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography variant="caption" sx={{ color: '#6b7280' }}>
                {formatTimestamp(execution.createdAt)}
              </Typography>
              {getDuration() && (
                <Typography variant="caption" sx={{ color: '#6b7280' }}>
                  Duration: {getDuration()}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </ListItemButton>
    </ListItem>
  );
};

export default ExecutionHistoryItem;
