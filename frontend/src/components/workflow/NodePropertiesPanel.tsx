import React from 'react';
import {
  Drawer,
  Box,
  Typography,
  TextField,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Node } from 'reactflow';
import CreateTaskConfig from './node-configs/CreateTaskConfig';
import UpdateTaskConfig from './node-configs/UpdateTaskConfig';
import ConditionConfig from './node-configs/ConditionConfig';
import DelayConfig from './node-configs/DelayConfig';

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
  if (!node) return null;

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'trigger':
        return '⚡';
      case 'createTask':
        return '📝';
      case 'updateTask':
        return '✏️';
      case 'condition':
        return '🔀';
      case 'delay':
        return '⏱️';
      default:
        return '📦';
    }
  };

  const getNodeTypeLabel = (type: string) => {
    switch (type) {
      case 'trigger':
        return 'Trigger';
      case 'createTask':
        return 'Create Task';
      case 'updateTask':
        return 'Update Task';
      case 'condition':
        return 'Condition';
      case 'delay':
        return 'Delay';
      default:
        return type;
    }
  };

  const handleLabelChange = (newLabel: string) => {
    onUpdate(node.id, { ...node.data, label: newLabel });
  };

  const renderConfig = () => {
    switch (node.type) {
      case 'createTask':
        return <CreateTaskConfig node={node} onUpdate={onUpdate} />;
      case 'updateTask':
        return <UpdateTaskConfig node={node} onUpdate={onUpdate} />;
      case 'condition':
        return <ConditionConfig node={node} onUpdate={onUpdate} />;
      case 'delay':
        return <DelayConfig node={node} onUpdate={onUpdate} />;
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
        }}
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
      <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}>
        <TextField
          fullWidth
          label="Node Name"
          value={node.data.label || ''}
          onChange={(e) => handleLabelChange(e.target.value)}
          variant="outlined"
          size="small"
        />
        <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mt: 1 }}>
          Node ID: {node.id}
        </Typography>
      </Box>

      <Divider />

      {/* Configuration Form */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        {renderConfig()}
      </Box>
    </Drawer>
  );
};

export default NodePropertiesPanel;
