import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
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

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 4,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: 8,
    fontSize: 12,
    color: '#6b7280',
    fontWeight: 500,
  };

  const renderConfigContent = () => {
    switch (node.type) {
      case 'createTask':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
              Configure Create Task Node
            </Typography>
            <Box sx={{ mb: 2 }}>
              <label style={labelStyle}>Task Title *</label>
              <input
                type="text"
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
                style={inputStyle}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <label style={labelStyle}>Task Description</label>
              <textarea
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
                rows={3}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <label style={labelStyle}>Priority</label>
              <select
                value={localConfig.priority || 'MEDIUM'}
                onChange={(e) => {
                  stopProp(e);
                  handleConfigChange('priority', e.target.value);
                }}
                onMouseDown={stopProp}
                onClick={stopProp}
                onKeyDown={stopProp}
                onFocus={stopProp}
                style={{ ...inputStyle, backgroundColor: 'white', cursor: 'pointer' }}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </Box>
            <Box>
              <label style={labelStyle}>Assignee ID (optional)</label>
              <input
                type="text"
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
                style={inputStyle}
              />
            </Box>
          </Box>
        );

      case 'updateTask':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
              Configure Update Task Node
            </Typography>
            <Box sx={{ mb: 2 }}>
              <label style={labelStyle}>Task ID *</label>
              <input
                type="text"
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
                style={inputStyle}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <label style={labelStyle}>New Title (optional)</label>
              <input
                type="text"
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
                style={inputStyle}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <label style={labelStyle}>Status</label>
              <select
                value={localConfig.status || ''}
                onChange={(e) => {
                  stopProp(e);
                  handleConfigChange('status', e.target.value);
                }}
                onMouseDown={stopProp}
                onClick={stopProp}
                onKeyDown={stopProp}
                onFocus={stopProp}
                style={{ ...inputStyle, backgroundColor: 'white', cursor: 'pointer' }}
              >
                <option value="">Keep current</option>
                <option value="OPEN">Open</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </Box>
            <Box>
              <label style={labelStyle}>Priority</label>
              <select
                value={localConfig.priority || ''}
                onChange={(e) => {
                  stopProp(e);
                  handleConfigChange('priority', e.target.value);
                }}
                onMouseDown={stopProp}
                onClick={stopProp}
                onKeyDown={stopProp}
                onFocus={stopProp}
                style={{ ...inputStyle, backgroundColor: 'white', cursor: 'pointer' }}
              >
                <option value="">Keep current</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </Box>
          </Box>
        );

      case 'condition':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
              Configure Condition Node
            </Typography>
            <Box>
              <label style={labelStyle}>Condition Expression *</label>
              <textarea
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
                rows={4}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 100, fontFamily: 'monospace' }}
              />
            </Box>
          </Box>
        );

      case 'delay':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
              Configure Delay Node
            </Typography>
            <Box sx={{ mb: 2 }}>
              <label style={labelStyle}>Duration *</label>
              <input
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
                style={inputStyle}
              />
            </Box>
            <Box>
              <label style={labelStyle}>Unit</label>
              <select
                value={localConfig.unit || 'milliseconds'}
                onChange={(e) => {
                  stopProp(e);
                  handleConfigChange('unit', e.target.value);
                }}
                onMouseDown={stopProp}
                onClick={stopProp}
                onKeyDown={stopProp}
                onFocus={stopProp}
                style={{ ...inputStyle, backgroundColor: 'white', cursor: 'pointer' }}
              >
                <option value="milliseconds">Milliseconds</option>
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
            </Box>
          </Box>
        );

      case 'httpRequest':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
              Configure HTTP Request Node
            </Typography>
            <Box sx={{ mb: 2 }}>
              <label style={labelStyle}>Method</label>
              <select
                value={localConfig.method || 'GET'}
                onChange={(e) => {
                  stopProp(e);
                  handleConfigChange('method', e.target.value);
                }}
                onMouseDown={stopProp}
                onClick={stopProp}
                onKeyDown={stopProp}
                onFocus={stopProp}
                style={{ ...inputStyle, backgroundColor: 'white', cursor: 'pointer' }}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </Box>
            <Box sx={{ mb: 2 }}>
              <label style={labelStyle}>URL *</label>
              <input
                type="text"
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
                style={inputStyle}
              />
            </Box>
            {['POST', 'PUT', 'PATCH'].includes(localConfig.method || 'GET') && (
              <Box>
                <label style={labelStyle}>Request Body (JSON)</label>
                <textarea
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
                  rows={5}
                  style={{ ...inputStyle, fontFamily: 'monospace', resize: 'vertical' }}
                />
              </Box>
            )}
          </Box>
        );

      case 'code':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
              Configure Code Node
            </Typography>
            <Box>
              <label style={labelStyle}>JavaScript Code *</label>
              <textarea
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
                rows={12}
                style={{ ...inputStyle, fontFamily: 'monospace', resize: 'vertical', minHeight: 200 }}
              />
            </Box>
          </Box>
        );

      case 'email':
        return (
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
              Configure Email Node
            </Typography>
            <Box sx={{ mb: 2 }}>
              <label style={labelStyle}>To *</label>
              <input
                type="text"
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
                style={inputStyle}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <label style={labelStyle}>From</label>
              <input
                type="text"
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
                style={inputStyle}
              />
            </Box>
            <Box sx={{ mb: 2 }}>
              <label style={labelStyle}>Subject *</label>
              <input
                type="text"
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
                style={inputStyle}
              />
            </Box>
            <Box>
              <label style={labelStyle}>Body *</label>
              <textarea
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
                rows={6}
                style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
              />
            </Box>
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

      {/* Node Name - EXACTLY like the working version */}
      <Box
        sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}
        onMouseDown={stopProp}
        onClick={stopProp}
      >
        <label style={labelStyle}>Node Name</label>
        <input
          type="text"
          value={localLabel}
          onChange={(e) => {
            stopProp(e);
            handleLabelChange(e.target.value);
          }}
          onMouseDown={stopProp}
          onClick={stopProp}
          onKeyDown={stopProp}
          style={inputStyle}
        />
        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mt: 1 }}>
          Node ID: {node.id}
        </Typography>
      </Box>

      <Divider />

      {/* Configuration Form - ALL native HTML inputs */}
      <Box sx={{ flex: 1, overflow: 'auto' }} onMouseDown={stopProp} onClick={stopProp}>
        {renderConfigContent()}
      </Box>
    </Drawer>
  );
};

export default NodePropertiesPanel;
