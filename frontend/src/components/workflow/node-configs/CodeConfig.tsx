import React from 'react';
import {
  Box,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { Node } from 'reactflow';

interface CodeConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
}

const CodeConfig: React.FC<CodeConfigProps> = ({ node, onUpdate }) => {
  const config = node.data.config || {
    code: '// Available: $trigger, $vars\n// Example:\nreturn {\n  result: "Hello World",\n  timestamp: new Date().toISOString()\n};'
  };

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onUpdate(node.id, { ...node.data, config: newConfig });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
        JavaScript Code Configuration
      </Typography>

      <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>
        Write JavaScript code. Access <code>$trigger</code> and <code>$vars</code> objects. Must return a value.
      </Alert>

      <Alert severity="warning" sx={{ mb: 2, fontSize: '11px' }}>
        <strong>Security:</strong> Code runs in a sandbox with no file system or network access. Execution timeout: 5 seconds.
      </Alert>

      <TextField
        fullWidth
        multiline
        rows={18}
        label="JavaScript Code"
        value={config.code}
        onChange={(e) => handleConfigChange('code', e.target.value)}
        sx={{
          '& .MuiInputBase-input': {
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            fontSize: '13px',
            lineHeight: '1.6',
          },
          '& .MuiInputLabel-root': {
            fontFamily: 'inherit',
          }
        }}
        helperText="Code must return a value that will be stored in context variables"
      />

      <Box sx={{ mt: 2, p: 2, bgcolor: '#f8fafc', borderRadius: 1 }}>
        <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 1 }}>
          Examples:
        </Typography>
        <Box sx={{ fontFamily: 'monospace', fontSize: '11px', color: '#475569' }}>
          <div>// Transform data</div>
          <div>{'return { title: $trigger.name.toUpperCase() };'}</div>
          <div style={{ marginTop: '8px' }}>// Filter array</div>
          <div>{'return $vars.items.filter(i => i.price > 100);'}</div>
          <div style={{ marginTop: '8px' }}>// Calculate</div>
          <div>{'return { total: $vars.price * $vars.quantity };'}</div>
        </Box>
      </Box>

      <Alert severity="success" sx={{ mt: 2, fontSize: '11px' }}>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          Result Access:
        </Typography>
        <br />
        <code style={{ fontSize: '10px' }}>
          {'{{ nodeId_result.yourProperty }}'}
        </code>
      </Alert>
    </Box>
  );
};

export default CodeConfig;
