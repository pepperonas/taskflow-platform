import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import { Node } from 'reactflow';

interface CreateTaskConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
}

// Native input style to match Material-UI appearance
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #d1d5db',
  borderRadius: '4px',
  fontSize: '14px',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box' as const,
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '4px',
  fontSize: '12px',
  color: '#6b7280',
  fontWeight: 500,
};

const helperTextStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#9ca3af',
  marginTop: '4px',
};

const CreateTaskConfig: React.FC<CreateTaskConfigProps> = ({ node, onUpdate }) => {
  const config = node.data.config || {
    title: '',
    description: '',
    priority: 'MEDIUM',
    assigneeId: '',
  };

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onUpdate(node.id, { ...node.data, config: newConfig });
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.stopPropagation();
    e.currentTarget.style.borderColor = '#667eea';
    e.currentTarget.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = '#d1d5db';
    e.currentTarget.style.boxShadow = 'none';
  };

  const stopProp = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
        Configure Create Task Node
      </Typography>

      {/* Task Title */}
      <Box sx={{ mb: 2 }}>
        <label style={labelStyle}>Task Title *</label>
        <input
          type="text"
          value={config.title}
          placeholder="e.g., {{ $trigger.title }}"
          style={inputStyle}
          onChange={(e) => {
            stopProp(e);
            handleConfigChange('title', e.target.value);
          }}
          onMouseDown={stopProp}
          onClick={stopProp}
          onKeyDown={stopProp}
          onKeyPress={stopProp}
          onKeyUp={stopProp}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div style={helperTextStyle}>
          Press Ctrl+Space for variable suggestions, or type {'{{ }}'} to insert expressions
        </div>
      </Box>

      {/* Task Description */}
      <Box sx={{ mb: 2 }}>
        <label style={labelStyle}>Task Description</label>
        <textarea
          value={config.description}
          placeholder="e.g., {{ $trigger.description }}"
          rows={3}
          style={{
            ...inputStyle,
            resize: 'vertical',
            minHeight: '80px',
          }}
          onChange={(e) => {
            stopProp(e);
            handleConfigChange('description', e.target.value);
          }}
          onMouseDown={stopProp}
          onClick={stopProp}
          onKeyDown={stopProp}
          onKeyPress={stopProp}
          onKeyUp={stopProp}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div style={helperTextStyle}>
          Press Ctrl+Space for variable suggestions, or type {'{{ }}'} to insert expressions
        </div>
      </Box>

      {/* Priority */}
      <Box sx={{ mb: 2 }}>
        <label style={labelStyle}>Priority</label>
        <select
          value={config.priority}
          style={{
            ...inputStyle,
            backgroundColor: 'white',
            cursor: 'pointer',
          }}
          onChange={(e) => {
            stopProp(e);
            handleConfigChange('priority', e.target.value);
          }}
          onMouseDown={stopProp}
          onClick={stopProp}
          onKeyDown={stopProp}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </Box>

      {/* Assignee ID */}
      <Box sx={{ mb: 2 }}>
        <label style={labelStyle}>Assignee ID (optional)</label>
        <input
          type="text"
          value={config.assigneeId}
          placeholder="e.g., {{ $trigger.assigneeId }}"
          style={inputStyle}
          onChange={(e) => {
            stopProp(e);
            handleConfigChange('assigneeId', e.target.value);
          }}
          onMouseDown={stopProp}
          onClick={stopProp}
          onKeyDown={stopProp}
          onKeyPress={stopProp}
          onKeyUp={stopProp}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <div style={helperTextStyle}>
          Leave empty for unassigned
        </div>
      </Box>
    </Box>
  );
};

export default CreateTaskConfig;
