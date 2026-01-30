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
import CreateTaskConfig from './node-configs/CreateTaskConfig';
import UpdateTaskConfig from './node-configs/UpdateTaskConfig';
import ConditionConfig from './node-configs/ConditionConfig';
import DelayConfig from './node-configs/DelayConfig';
import HttpRequestConfig from './node-configs/HttpRequestConfig';
import CodeConfig from './node-configs/CodeConfig';

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
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [localLabel, setLocalLabel] = React.useState<string>('');

  React.useEffect(() => {
    if (node) {
      setLocalLabel(node.data?.label || '');
    }
  }, [node]);

  const handleLabelChange = React.useCallback((newLabel: string) => {
    setLocalLabel(newLabel);
    if (node) {
      onUpdate(node.id, { ...node.data, label: newLabel });
    }
  }, [node, onUpdate]);

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
      case 'httpRequest':
        return '🌐';
      case 'code':
        return '💻';
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
      case 'httpRequest':
        return 'HTTP Request';
      case 'code':
        return 'Code';
      default:
        return type;
    }
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
      case 'httpRequest':
        return <HttpRequestConfig node={node} onUpdate={onUpdate} />;
      case 'code':
        return <CodeConfig node={node} onUpdate={onUpdate} />;
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
        disablePortal: false,
        style: {
          pointerEvents: 'none',
        },
      }}
      PaperProps={{
        onMouseDown: (e) => {
          e.stopPropagation();
        },
        onClick: (e) => {
          e.stopPropagation();
        },
      }}
      sx={{
        zIndex: 1300,
        pointerEvents: 'none',
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
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Box sx={{ mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mb: 0.5 }}>
            Node Name
          </Typography>
          <input
            ref={inputRef}
            type="text"
            value={localLabel}
            onChange={(e) => {
              const newValue = e.target.value;
              setLocalLabel(newValue);
              handleLabelChange(newValue);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
            }}
            onKeyPress={(e) => {
              e.stopPropagation();
            }}
            onKeyUp={(e) => {
              e.stopPropagation();
            }}
            onFocus={(e) => {
              e.stopPropagation();
              (e.target as HTMLInputElement).style.borderColor = '#667eea';
              (e.target as HTMLInputElement).style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)';
              e.target.select();
            }}
            onBlur={(e) => {
              (e.target as HTMLInputElement).style.borderColor = '#d1d5db';
              (e.target as HTMLInputElement).style.boxShadow = 'none';
            }}
            onMouseEnter={(e) => {
              if (document.activeElement !== e.target) {
                (e.target as HTMLInputElement).style.borderColor = '#9ca3af';
              }
            }}
            onMouseLeave={(e) => {
              if (document.activeElement !== e.target) {
                (e.target as HTMLInputElement).style.borderColor = '#d1d5db';
              }
            }}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            data-testid="node-name-input"
          />
        </Box>
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
