import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Node } from 'reactflow';

interface NodePropertiesPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: any) => void;
}

const NodePropertiesPanel: React.FC<NodePropertiesPanelProps> = ({
  node,
  onClose,
  onUpdate,
}) => {
  const [localLabel, setLocalLabel] = React.useState<string>('');
  const [localConfig, setLocalConfig] = React.useState<any>({});

  React.useEffect(() => {
    if (node) {
      setLocalLabel(node.data?.label || '');
      setLocalConfig(node.data?.config || {});
    }
  }, [node]);

  const handleLabelChange = (newLabel: string) => {
    setLocalLabel(newLabel);
    if (node) {
      onUpdate(node.id, { ...node.data, label: newLabel });
    }
  };

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...localConfig, [field]: value };
    setLocalConfig(newConfig);
    if (node) {
      onUpdate(node.id, { ...node.data, config: newConfig });
    }
  };

  // ONLY stopPropagation - NO preventDefault!
  const stopProp = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  if (!node) return null;

  const getNodeIcon = (type: string) => {
    const icons: Record<string, string> = {
      trigger: '⚡', createTask: '📝', updateTask: '✏️', condition: '🔀',
      delay: '⏱️', httpRequest: '🌐', code: '💻', email: '📧',
    };
    return icons[type] || '📦';
  };

  const getNodeTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      trigger: 'Trigger', createTask: 'Create Task', updateTask: 'Update Task',
      condition: 'Condition', delay: 'Delay', httpRequest: 'HTTP Request',
      code: 'Code', email: 'Email',
    };
    return labels[type] || type;
  };

  const renderConfigContent = () => {
    switch (node.type) {
      case 'createTask':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
              Configure Create Task Node
            </Typography>
            <TextField
              fullWidth
              label="Task Title *"
              value={localConfig.title || ''}
              onChange={(e) => {
                stopProp(e);
                handleConfigChange('title', e.target.value);
              }}
              onMouseDown={stopProp}
              onClick={stopProp}
              onKeyDown={stopProp}
              onKeyUp={stopProp}
              onFocus={stopProp}
              placeholder="e.g., {{ $trigger.title }}"
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
              inputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
            />
            <TextField
              fullWidth
              label="Task Description"
              value={localConfig.description || ''}
              onChange={(e) => {
                stopProp(e);
                handleConfigChange('description', e.target.value);
              }}
              onMouseDown={stopProp}
              onClick={stopProp}
              onKeyDown={stopProp}
              onKeyUp={stopProp}
              onFocus={stopProp}
              placeholder="e.g., {{ $trigger.description }}"
              multiline
              rows={3}
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
              inputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
            />
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                value={localConfig.priority || 'MEDIUM'}
                label="Priority"
                onChange={(e) => {
                  e.stopPropagation();
                  handleConfigChange('priority', e.target.value);
                }}
                onMouseDown={stopProp}
                onClick={stopProp}
                onKeyDown={stopProp}
                onFocus={stopProp}
                MenuProps={{
                  disablePortal: true,
                  onMouseDown: stopProp,
                  onClick: stopProp,
                  PaperProps: {
                    onMouseDown: stopProp,
                    onClick: stopProp,
                    sx: {
                      pointerEvents: 'auto',
                    },
                  },
                }}
              >
                <MenuItem 
                  value="LOW"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('priority', 'LOW');
                  }}
                >
                  Low
                </MenuItem>
                <MenuItem 
                  value="MEDIUM"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('priority', 'MEDIUM');
                  }}
                >
                  Medium
                </MenuItem>
                <MenuItem 
                  value="HIGH"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('priority', 'HIGH');
                  }}
                >
                  High
                </MenuItem>
                <MenuItem 
                  value="CRITICAL"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('priority', 'CRITICAL');
                  }}
                >
                  Critical
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Assignee ID (optional)"
              value={localConfig.assigneeId || ''}
              onChange={(e) => {
                stopProp(e);
                handleConfigChange('assigneeId', e.target.value);
              }}
              onMouseDown={stopProp}
              onClick={stopProp}
              onKeyDown={stopProp}
              onKeyUp={stopProp}
              onFocus={stopProp}
              placeholder="e.g., {{ $trigger.assigneeId }}"
              size="small"
              InputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
              inputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
            />
          </Box>
        );

      case 'updateTask':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
              Configure Update Task Node
            </Typography>
            <TextField
              fullWidth
              label="Task ID *"
              value={localConfig.taskId || ''}
              onChange={(e) => {
                stopProp(e);
                handleConfigChange('taskId', e.target.value);
              }}
              onMouseDown={stopProp}
              onClick={stopProp}
              onKeyDown={stopProp}
              onKeyUp={stopProp}
              onFocus={stopProp}
              placeholder="e.g., {{ $trigger.taskId }}"
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
              inputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
            />
            <TextField
              fullWidth
              label="New Title (optional)"
              value={localConfig.title || ''}
              onChange={(e) => {
                stopProp(e);
                handleConfigChange('title', e.target.value);
              }}
              onMouseDown={stopProp}
              onClick={stopProp}
              onKeyDown={stopProp}
              onKeyUp={stopProp}
              onFocus={stopProp}
              placeholder="Leave empty to keep current"
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
              inputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
            />
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={localConfig.status || ''}
                label="Status"
                onChange={(e) => {
                  e.stopPropagation();
                  handleConfigChange('status', e.target.value);
                }}
                onMouseDown={stopProp}
                onClick={stopProp}
                onKeyDown={stopProp}
                onFocus={stopProp}
                MenuProps={{
                  disablePortal: true,
                  onMouseDown: stopProp,
                  onClick: stopProp,
                  PaperProps: {
                    onMouseDown: stopProp,
                    onClick: stopProp,
                    sx: {
                      pointerEvents: 'auto',
                    },
                  },
                }}
              >
                <MenuItem 
                  value=""
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('status', '');
                  }}
                >
                  Keep current
                </MenuItem>
                <MenuItem 
                  value="OPEN"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('status', 'OPEN');
                  }}
                >
                  Open
                </MenuItem>
                <MenuItem 
                  value="IN_PROGRESS"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('status', 'IN_PROGRESS');
                  }}
                >
                  In Progress
                </MenuItem>
                <MenuItem 
                  value="COMPLETED"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('status', 'COMPLETED');
                  }}
                >
                  Completed
                </MenuItem>
                <MenuItem 
                  value="CANCELLED"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('status', 'CANCELLED');
                  }}
                >
                  Cancelled
                </MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth size="small">
              <InputLabel>Priority</InputLabel>
              <Select
                value={localConfig.priority || ''}
                label="Priority"
                onChange={(e) => {
                  e.stopPropagation();
                  handleConfigChange('priority', e.target.value);
                }}
                onMouseDown={stopProp}
                onClick={stopProp}
                onKeyDown={stopProp}
                onFocus={stopProp}
                MenuProps={{
                  disablePortal: true,
                  onMouseDown: stopProp,
                  onClick: stopProp,
                  PaperProps: {
                    onMouseDown: stopProp,
                    onClick: stopProp,
                    sx: {
                      pointerEvents: 'auto',
                    },
                  },
                }}
              >
                <MenuItem 
                  value=""
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('priority', '');
                  }}
                >
                  Keep current
                </MenuItem>
                <MenuItem 
                  value="LOW"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('priority', 'LOW');
                  }}
                >
                  Low
                </MenuItem>
                <MenuItem 
                  value="MEDIUM"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('priority', 'MEDIUM');
                  }}
                >
                  Medium
                </MenuItem>
                <MenuItem 
                  value="HIGH"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('priority', 'HIGH');
                  }}
                >
                  High
                </MenuItem>
                <MenuItem 
                  value="CRITICAL"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('priority', 'CRITICAL');
                  }}
                >
                  Critical
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      case 'condition':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
              Configure Condition Node
            </Typography>
            <TextField
              fullWidth
              label="Condition Expression *"
              value={localConfig.expression || ''}
              onChange={(e) => {
                stopProp(e);
                handleConfigChange('expression', e.target.value);
              }}
              onMouseDown={stopProp}
              onClick={stopProp}
              onKeyDown={stopProp}
              onKeyUp={stopProp}
              onFocus={stopProp}
              placeholder="e.g., {{ $trigger.priority === 'HIGH' }}"
              multiline
              rows={4}
              size="small"
              InputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
              inputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
                style: { fontFamily: 'monospace' },
              }}
            />
          </Box>
        );

      case 'delay':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
              Configure Delay Node
            </Typography>
            <TextField
              fullWidth
              label="Duration *"
              type="number"
              value={localConfig.duration || 1000}
              onChange={(e) => {
                stopProp(e);
                handleConfigChange('duration', parseInt(e.target.value) || 0);
              }}
              onMouseDown={stopProp}
              onClick={stopProp}
              onKeyDown={stopProp}
              onKeyUp={stopProp}
              onFocus={stopProp}
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
              inputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Unit</InputLabel>
              <Select
                value={localConfig.unit || 'milliseconds'}
                label="Unit"
                onChange={(e) => {
                  e.stopPropagation();
                  handleConfigChange('unit', e.target.value);
                }}
                onMouseDown={stopProp}
                onClick={stopProp}
                onKeyDown={stopProp}
                onFocus={stopProp}
                MenuProps={{
                  disablePortal: true,
                  onMouseDown: stopProp,
                  onClick: stopProp,
                  PaperProps: {
                    onMouseDown: stopProp,
                    onClick: stopProp,
                    sx: {
                      pointerEvents: 'auto',
                    },
                  },
                }}
              >
                <MenuItem 
                  value="milliseconds"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('unit', 'milliseconds');
                  }}
                >
                  Milliseconds
                </MenuItem>
                <MenuItem 
                  value="seconds"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('unit', 'seconds');
                  }}
                >
                  Seconds
                </MenuItem>
                <MenuItem 
                  value="minutes"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('unit', 'minutes');
                  }}
                >
                  Minutes
                </MenuItem>
                <MenuItem 
                  value="hours"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('unit', 'hours');
                  }}
                >
                  Hours
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        );

      case 'httpRequest':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
              Configure HTTP Request Node
            </Typography>
            <FormControl fullWidth size="small" sx={{ mb: 2 }}>
              <InputLabel>Method</InputLabel>
              <Select
                value={localConfig.method || 'GET'}
                label="Method"
                onChange={(e) => {
                  e.stopPropagation();
                  handleConfigChange('method', e.target.value);
                }}
                onMouseDown={stopProp}
                onClick={stopProp}
                onKeyDown={stopProp}
                onFocus={stopProp}
                MenuProps={{
                  disablePortal: true,
                  onMouseDown: stopProp,
                  onClick: stopProp,
                  PaperProps: {
                    onMouseDown: stopProp,
                    onClick: stopProp,
                    sx: {
                      pointerEvents: 'auto',
                    },
                  },
                }}
              >
                <MenuItem 
                  value="GET"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('method', 'GET');
                  }}
                >
                  GET
                </MenuItem>
                <MenuItem 
                  value="POST"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('method', 'POST');
                  }}
                >
                  POST
                </MenuItem>
                <MenuItem 
                  value="PUT"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('method', 'PUT');
                  }}
                >
                  PUT
                </MenuItem>
                <MenuItem 
                  value="PATCH"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('method', 'PATCH');
                  }}
                >
                  PATCH
                </MenuItem>
                <MenuItem 
                  value="DELETE"
                  onMouseDown={stopProp}
                  onClick={(e) => {
                    stopProp(e);
                    handleConfigChange('method', 'DELETE');
                  }}
                >
                  DELETE
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="URL *"
              value={localConfig.url || ''}
              onChange={(e) => {
                stopProp(e);
                handleConfigChange('url', e.target.value);
              }}
              onMouseDown={stopProp}
              onClick={stopProp}
              onKeyDown={stopProp}
              onKeyUp={stopProp}
              onFocus={stopProp}
              placeholder="https://api.example.com/endpoint"
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
              inputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
            />
            {['POST', 'PUT', 'PATCH'].includes(localConfig.method || 'GET') && (
              <TextField
                fullWidth
                label="Request Body (JSON)"
                value={localConfig.body || ''}
                onChange={(e) => {
                  stopProp(e);
                  handleConfigChange('body', e.target.value);
                }}
                onMouseDown={stopProp}
                onClick={stopProp}
                onKeyDown={stopProp}
                onKeyUp={stopProp}
                onFocus={stopProp}
                placeholder='{"key": "value"}'
                multiline
                rows={5}
                size="small"
                InputProps={{
                  onMouseDown: stopProp,
                  onClick: stopProp,
                }}
                inputProps={{
                  onMouseDown: stopProp,
                  onClick: stopProp,
                  style: { fontFamily: 'monospace' },
                }}
              />
            )}
          </Box>
        );

      case 'code':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
              Configure Code Node
            </Typography>
            <TextField
              fullWidth
              label="JavaScript Code *"
              value={localConfig.code || ''}
              onChange={(e) => {
                stopProp(e);
                handleConfigChange('code', e.target.value);
              }}
              onMouseDown={stopProp}
              onClick={stopProp}
              onKeyDown={stopProp}
              onKeyUp={stopProp}
              onFocus={stopProp}
              placeholder="// Access trigger data with $trigger\nreturn { result: $trigger.value * 2 };"
              multiline
              rows={12}
              size="small"
              InputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
              inputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
                style: { fontFamily: 'monospace' },
              }}
            />
          </Box>
        );

      case 'email':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
              Configure Email Node
            </Typography>
            <TextField
              fullWidth
              label="To *"
              value={localConfig.to || ''}
              onChange={(e) => {
                stopProp(e);
                handleConfigChange('to', e.target.value);
              }}
              onMouseDown={stopProp}
              onClick={stopProp}
              onKeyDown={stopProp}
              onKeyUp={stopProp}
              onFocus={stopProp}
              placeholder="recipient@example.com"
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
              inputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
            />
            <TextField
              fullWidth
              label="From"
              value={localConfig.from || ''}
              onChange={(e) => {
                stopProp(e);
                handleConfigChange('from', e.target.value);
              }}
              onMouseDown={stopProp}
              onClick={stopProp}
              onKeyDown={stopProp}
              onKeyUp={stopProp}
              onFocus={stopProp}
              placeholder="noreply@example.com"
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
              inputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
            />
            <TextField
              fullWidth
              label="Subject *"
              value={localConfig.subject || ''}
              onChange={(e) => {
                stopProp(e);
                handleConfigChange('subject', e.target.value);
              }}
              onMouseDown={stopProp}
              onClick={stopProp}
              onKeyDown={stopProp}
              onKeyUp={stopProp}
              onFocus={stopProp}
              placeholder="e.g., Task {{ $trigger.title }} created"
              size="small"
              sx={{ mb: 2 }}
              InputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
              inputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
            />
            <TextField
              fullWidth
              label="Body *"
              value={localConfig.body || ''}
              onChange={(e) => {
                stopProp(e);
                handleConfigChange('body', e.target.value);
              }}
              onMouseDown={stopProp}
              onClick={stopProp}
              onKeyDown={stopProp}
              onKeyUp={stopProp}
              onFocus={stopProp}
              placeholder="Email body content..."
              multiline
              rows={6}
              size="small"
              InputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
              inputProps={{
                onMouseDown: stopProp,
                onClick: stopProp,
              }}
            />
          </Box>
        );

      case 'trigger':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              This is a manual trigger node. Click "Execute" to run the workflow with custom trigger data.
            </Typography>
          </Box>
        );

      default:
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              No configuration available for this node type.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <Drawer
      anchor="right"
      open={!!node}
      onClose={onClose}
      variant="persistent"
      hideBackdrop={true}
      ModalProps={{
        disableEnforceFocus: true,
        disableAutoFocus: true,
        disableRestoreFocus: true,
        keepMounted: false,
      }}
      PaperProps={{
        sx: {
          pointerEvents: 'auto',
        },
        onMouseDown: stopProp,
        onClick: stopProp,
      }}
      sx={{
        zIndex: 9999,
        '& .MuiDrawer-paper': {
          width: 400,
          boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          pointerEvents: 'auto',
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
        }}
        onMouseDown={stopProp}
        onClick={stopProp}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: '24px' }}>{getNodeIcon(node.type || '')}</span>
          <Typography variant="h6">{getNodeTypeLabel(node.type || '')}</Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Node Name */}
      <Box
        sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}
        onMouseDown={stopProp}
        onClick={stopProp}
      >
        <TextField
          fullWidth
          label="Node Name"
          value={localLabel}
          onChange={(e) => {
            stopProp(e);
            handleLabelChange(e.target.value);
          }}
          onMouseDown={stopProp}
          onClick={stopProp}
          onKeyDown={stopProp}
          onKeyUp={stopProp}
          onFocus={stopProp}
          size="small"
          InputProps={{
            onMouseDown: stopProp,
            onClick: stopProp,
          }}
          inputProps={{
            onMouseDown: stopProp,
            onClick: stopProp,
          }}
        />
        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mt: 1 }}>
          Node ID: {node.id}
        </Typography>
      </Box>

      <Divider />

      {/* Configuration Form */}
      <Box sx={{ flex: 1, overflow: 'auto' }} onMouseDown={stopProp} onClick={stopProp}>
        {renderConfigContent()}
      </Box>
    </Drawer>
  );
};

export default NodePropertiesPanel;
