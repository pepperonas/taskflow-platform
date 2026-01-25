import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Node } from 'reactflow';

interface UpdateTaskConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
}

const UpdateTaskConfig: React.FC<UpdateTaskConfigProps> = ({ node, onUpdate }) => {
  const config = node.data.config || {
    taskId: '',
    title: '',
    description: '',
    priority: '',
    status: '',
    assigneeId: '',
    updateTitle: false,
    updateDescription: false,
    updatePriority: false,
    updateStatus: false,
    updateAssignee: false,
  };

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onUpdate(node.id, { ...node.data, config: newConfig });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
        Configure Update Task Node
      </Typography>

      <TextField
        fullWidth
        label="Task ID"
        value={config.taskId}
        onChange={(e) => handleConfigChange('taskId', e.target.value)}
        placeholder="e.g., {{ $trigger.taskId }}"
        helperText="Use {{ }} for expressions"
        sx={{ mb: 2 }}
        required
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={config.updateTitle}
            onChange={(e) => handleConfigChange('updateTitle', e.target.checked)}
          />
        }
        label="Update Title"
        sx={{ mb: 1 }}
      />
      {config.updateTitle && (
        <TextField
          fullWidth
          label="New Title"
          value={config.title}
          onChange={(e) => handleConfigChange('title', e.target.value)}
          placeholder="e.g., {{ $trigger.newTitle }}"
          sx={{ mb: 2, ml: 4 }}
        />
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={config.updateDescription}
            onChange={(e) => handleConfigChange('updateDescription', e.target.checked)}
          />
        }
        label="Update Description"
        sx={{ mb: 1 }}
      />
      {config.updateDescription && (
        <TextField
          fullWidth
          multiline
          rows={3}
          label="New Description"
          value={config.description}
          onChange={(e) => handleConfigChange('description', e.target.value)}
          placeholder="e.g., {{ $trigger.newDescription }}"
          sx={{ mb: 2, ml: 4 }}
        />
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={config.updatePriority}
            onChange={(e) => handleConfigChange('updatePriority', e.target.checked)}
          />
        }
        label="Update Priority"
        sx={{ mb: 1 }}
      />
      {config.updatePriority && (
        <FormControl fullWidth sx={{ mb: 2, ml: 4 }}>
          <InputLabel>New Priority</InputLabel>
          <Select
            value={config.priority}
            label="New Priority"
            onChange={(e) => handleConfigChange('priority', e.target.value)}
          >
            <MenuItem value="LOW">Low</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="CRITICAL">Critical</MenuItem>
          </Select>
        </FormControl>
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={config.updateStatus}
            onChange={(e) => handleConfigChange('updateStatus', e.target.checked)}
          />
        }
        label="Update Status"
        sx={{ mb: 1 }}
      />
      {config.updateStatus && (
        <FormControl fullWidth sx={{ mb: 2, ml: 4 }}>
          <InputLabel>New Status</InputLabel>
          <Select
            value={config.status}
            label="New Status"
            onChange={(e) => handleConfigChange('status', e.target.value)}
          >
            <MenuItem value="TODO">To Do</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="DONE">Done</MenuItem>
          </Select>
        </FormControl>
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={config.updateAssignee}
            onChange={(e) => handleConfigChange('updateAssignee', e.target.checked)}
          />
        }
        label="Update Assignee"
        sx={{ mb: 1 }}
      />
      {config.updateAssignee && (
        <TextField
          fullWidth
          label="New Assignee ID"
          value={config.assigneeId}
          onChange={(e) => handleConfigChange('assigneeId', e.target.value)}
          placeholder="e.g., {{ $trigger.assigneeId }}"
          sx={{ mb: 2, ml: 4 }}
        />
      )}
    </Box>
  );
};

export default UpdateTaskConfig;
