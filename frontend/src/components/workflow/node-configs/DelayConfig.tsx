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

interface DelayConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
}

const DelayConfig: React.FC<DelayConfigProps> = ({ node, onUpdate }) => {
  const config = node.data.config || {
    duration: '5',
    unit: 'seconds',
  };

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onUpdate(node.id, { ...node.data, config: newConfig });
  };

  const getDurationInSeconds = () => {
    const duration = parseInt(config.duration) || 0;
    switch (config.unit) {
      case 'seconds':
        return duration;
      case 'minutes':
        return duration * 60;
      case 'hours':
        return duration * 3600;
      default:
        return duration;
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
        Configure Delay Node
      </Typography>

      <Box 
        sx={{ display: 'flex', gap: 2, mb: 2 }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <TextField
          label="Duration"
          type="number"
          value={config.duration}
          onChange={(e) => {
            e.stopPropagation();
            handleConfigChange('duration', e.target.value);
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
          placeholder="5"
          sx={{ flex: 1 }}
          inputProps={{ min: 1 }}
          InputProps={{
            onMouseDown: (e) => {
              e.stopPropagation();
            },
            onClick: (e) => {
              e.stopPropagation();
            },
          }}
        />

        <FormControl 
          sx={{ flex: 1 }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <InputLabel>Unit</InputLabel>
          <Select
            value={config.unit}
            label="Unit"
            onChange={(e) => {
              e.stopPropagation();
              handleConfigChange('unit', e.target.value);
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
            <MenuItem value="seconds">Seconds</MenuItem>
            <MenuItem value="minutes">Minutes</MenuItem>
            <MenuItem value="hours">Hours</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ p: 2, bgcolor: '#f0fdf4', borderRadius: 1, border: '1px solid #86efac' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
          Total Delay:
        </Typography>
        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
          {getDurationInSeconds()} seconds
        </Typography>
      </Box>

      <Typography variant="caption" sx={{ mt: 2, display: 'block', color: '#6b7280' }}>
        The workflow will pause for the specified duration before continuing to the next node.
      </Typography>
    </Box>
  );
};

export default DelayConfig;
