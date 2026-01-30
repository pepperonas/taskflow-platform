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
        onChange={(e) => {
          e.stopPropagation();
          handleConfigChange('taskId', e.target.value);
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
        placeholder="e.g., {{ $trigger.taskId }}"
        helperText="Use {{ }} for expressions"
        sx={{ mb: 2 }}
        required
        InputProps={{
          onMouseDown: (e) => {
            e.stopPropagation();
          },
          onClick: (e) => {
            e.stopPropagation();
          },
        }}
        inputProps={{
          onMouseDown: (e) => {
            e.stopPropagation();
          },
          onClick: (e) => {
            e.stopPropagation();
          },
        }}
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={config.updateTitle}
            onChange={(e) => {
              e.stopPropagation();
              handleConfigChange('updateTitle', e.target.checked);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        }
        label="Update Title"
        sx={{ mb: 1 }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      />
      {config.updateTitle && (
        <TextField
          fullWidth
          label="New Title"
          value={config.title}
          onChange={(e) => {
            e.stopPropagation();
            handleConfigChange('title', e.target.value);
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
          placeholder="e.g., {{ $trigger.newTitle }}"
          sx={{ mb: 2, ml: 4 }}
          InputProps={{
            onMouseDown: (e) => {
              e.stopPropagation();
            },
            onClick: (e) => {
              e.stopPropagation();
            },
          }}
          inputProps={{
            onMouseDown: (e) => {
              e.stopPropagation();
            },
            onClick: (e) => {
              e.stopPropagation();
            },
          }}
        />
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={config.updateDescription}
            onChange={(e) => {
              e.stopPropagation();
              handleConfigChange('updateDescription', e.target.checked);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        }
        label="Update Description"
        sx={{ mb: 1 }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      />
      {config.updateDescription && (
        <TextField
          fullWidth
          multiline
          rows={3}
          label="New Description"
          value={config.description}
          onChange={(e) => {
            e.stopPropagation();
            handleConfigChange('description', e.target.value);
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
          placeholder="e.g., {{ $trigger.newDescription }}"
          sx={{ mb: 2, ml: 4 }}
          InputProps={{
            onMouseDown: (e) => {
              e.stopPropagation();
            },
            onClick: (e) => {
              e.stopPropagation();
            },
          }}
          inputProps={{
            onMouseDown: (e) => {
              e.stopPropagation();
            },
            onClick: (e) => {
              e.stopPropagation();
            },
          }}
        />
      )}

      <FormControlLabel
        control={
          <Checkbox
            checked={config.updatePriority}
            onChange={(e) => {
              e.stopPropagation();
              handleConfigChange('updatePriority', e.target.checked);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        }
        label="Update Priority"
        sx={{ mb: 1 }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      />
      {config.updatePriority && (
        <FormControl 
          fullWidth 
          sx={{ mb: 2, ml: 4 }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <InputLabel>New Priority</InputLabel>
          <Select
            value={config.priority}
            label="New Priority"
            onChange={(e) => {
              e.stopPropagation();
              handleConfigChange('priority', e.target.value);
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
            onChange={(e) => {
              e.stopPropagation();
              handleConfigChange('updateStatus', e.target.checked);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        }
        label="Update Status"
        sx={{ mb: 1 }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      />
      {config.updateStatus && (
        <FormControl 
          fullWidth 
          sx={{ mb: 2, ml: 4 }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <InputLabel>New Status</InputLabel>
          <Select
            value={config.status}
            label="New Status"
            onChange={(e) => {
              e.stopPropagation();
              handleConfigChange('status', e.target.value);
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
            onChange={(e) => {
              e.stopPropagation();
              handleConfigChange('updateAssignee', e.target.checked);
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
        }
        label="Update Assignee"
        sx={{ mb: 1 }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      />
      {config.updateAssignee && (
        <TextField
          fullWidth
          label="New Assignee ID"
          value={config.assigneeId}
          onChange={(e) => {
            e.stopPropagation();
            handleConfigChange('assigneeId', e.target.value);
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
          placeholder="e.g., {{ $trigger.assigneeId }}"
          sx={{ mb: 2, ml: 4 }}
          InputProps={{
            onMouseDown: (e) => {
              e.stopPropagation();
            },
            onClick: (e) => {
              e.stopPropagation();
            },
          }}
          inputProps={{
            onMouseDown: (e) => {
              e.stopPropagation();
            },
            onClick: (e) => {
              e.stopPropagation();
            },
          }}
        />
      )}
    </Box>
  );
};

export default UpdateTaskConfig;
