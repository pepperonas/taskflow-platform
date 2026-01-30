import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { Node } from 'reactflow';
import ExpressionEditor from '../ExpressionEditor';

interface CreateTaskConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
}

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

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
        Configure Create Task Node
      </Typography>

      <Box sx={{ mb: 2 }}>
        <ExpressionEditor
          label="Task Title"
          value={config.title}
          onChange={(value) => handleConfigChange('title', value)}
          placeholder="e.g., {{ $trigger.title }}"
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <ExpressionEditor
          label="Task Description"
          value={config.description}
          onChange={(value) => handleConfigChange('description', value)}
          placeholder="e.g., {{ $trigger.description }}"
          multiline
          rows={3}
        />
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Priority</InputLabel>
        <Select
          value={config.priority}
          label="Priority"
          onChange={(e) => handleConfigChange('priority', e.target.value)}
        >
          <MenuItem value="LOW">Low</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
          <MenuItem value="CRITICAL">Critical</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Assignee ID (optional)"
        value={config.assigneeId}
        onChange={(e) => handleConfigChange('assigneeId', e.target.value)}
        onClick={(e) => {
          e.currentTarget.querySelector('input')?.focus();
        }}
        placeholder="e.g., {{ $trigger.assigneeId }}"
        helperText="Leave empty for unassigned"
        sx={{ mb: 2 }}
      />
    </Box>
  );
};

export default CreateTaskConfig;
