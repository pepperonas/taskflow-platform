import React from 'react';
import {
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { Node } from 'reactflow';
import ExpressionEditor from '../ExpressionEditor';

interface ConditionConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
}

const ConditionConfig: React.FC<ConditionConfigProps> = ({ node, onUpdate }) => {
  const config = node.data.config || {
    expression: '',
  };

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onUpdate(node.id, { ...node.data, config: newConfig });
  };

  return (
    <Box 
      sx={{ p: 2 }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
        Configure Condition Node
      </Typography>

      <Alert severity="info" sx={{ mb: 2 }}>
        The condition evaluates to true or false and routes the workflow accordingly.
      </Alert>

      <Box 
        sx={{ mb: 2 }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <ExpressionEditor
          label="Condition Expression"
          value={config.expression}
          onChange={(value) => handleConfigChange('expression', value)}
          placeholder="e.g., {{ $trigger.priority }} === 'HIGH'"
          multiline
          rows={4}
          helperText="Must evaluate to true or false"
        />
      </Box>

      <Box sx={{ mt: 2, p: 2, bgcolor: '#f9fafb', borderRadius: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
          Available Variables:
        </Typography>
        <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', color: '#6b7280' }}>
          • $trigger.* - Access trigger data
        </Typography>
        <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', color: '#6b7280' }}>
          • $nodes.nodeName.* - Access previous node outputs
        </Typography>
      </Box>

      <Box sx={{ mt: 2, p: 2, bgcolor: '#fffbeb', borderRadius: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
          Example Expressions:
        </Typography>
        <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', color: '#6b7280' }}>
          • {"{{ $trigger.priority }} === 'HIGH'"}
        </Typography>
        <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', color: '#6b7280' }}>
          • {"{{ $trigger.amount }} > 1000"}
        </Typography>
        <Typography variant="caption" component="div" sx={{ fontFamily: 'monospace', color: '#6b7280' }}>
          • {"{{ $nodes.createTask.status }} === 'success'"}
        </Typography>
      </Box>
    </Box>
  );
};

export default ConditionConfig;
