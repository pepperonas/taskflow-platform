import React from 'react';
import {
  Box,
  Typography,
  Alert,
} from '@mui/material';
import { Node } from 'reactflow';
import ExpressionEditor from '../ExpressionEditor';

interface EmailConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
}

const EmailConfig: React.FC<EmailConfigProps> = ({ node, onUpdate }) => {
  const config = node.data.config || {
    to: '',
    subject: '',
    body: '',
    from: 'martin.pfeffer@celox.io',
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
        Email Configuration
      </Typography>

      <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>
        Send emails via SMTP. Use {'{{ }}'} syntax to reference variables.
      </Alert>

      <Box 
        sx={{ mb: 2 }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <ExpressionEditor
          label="To (Recipient)"
          value={config.to}
          onChange={(value) => handleConfigChange('to', value)}
          placeholder="recipient@example.com or {{ $trigger.email }}"
        />
      </Box>

      <Box 
        sx={{ mb: 2 }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <ExpressionEditor
          label="From (Sender)"
          value={config.from}
          onChange={(value) => handleConfigChange('from', value)}
          placeholder="martin.pfeffer@celox.io"
        />
      </Box>

      <Box 
        sx={{ mb: 2 }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <ExpressionEditor
          label="Subject"
          value={config.subject}
          onChange={(value) => handleConfigChange('subject', value)}
          placeholder="e.g., {{ $trigger.taskTitle }} - Task Notification"
        />
      </Box>

      <Box 
        sx={{ mb: 2 }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <ExpressionEditor
          label="Body (HTML)"
          value={config.body}
          onChange={(value) => handleConfigChange('body', value)}
          multiline
          rows={8}
          placeholder="<h1>Hello</h1><p>This is an email notification.</p>"
          helperText="HTML content is supported"
        />
      </Box>

      <Alert severity="success" sx={{ mt: 2, fontSize: '11px' }}>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          Result Variables:
        </Typography>
        <br />
        <code style={{ fontSize: '10px' }}>
          {'{{ nodeId_result.sent }}'}<br />
          {'{{ nodeId_result.to }}'}<br />
          {'{{ nodeId_result.subject }}'}
        </code>
      </Alert>
    </Box>
  );
};

export default EmailConfig;
