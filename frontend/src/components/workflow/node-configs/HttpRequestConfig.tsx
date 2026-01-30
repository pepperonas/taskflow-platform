import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  IconButton,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Node } from 'reactflow';
import ExpressionEditor from '../ExpressionEditor';

interface HttpRequestConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
}

const HttpRequestConfig: React.FC<HttpRequestConfigProps> = ({ node, onUpdate }) => {
  const config = node.data.config || {
    method: 'GET',
    url: '',
    headers: [],
    body: '',
  };

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onUpdate(node.id, { ...node.data, config: newConfig, method: newConfig.method, url: newConfig.url });
  };

  const addHeader = () => {
    const newHeaders = [...(config.headers || []), { key: '', value: '' }];
    handleConfigChange('headers', newHeaders);
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...(config.headers || [])];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    handleConfigChange('headers', newHeaders);
  };

  const removeHeader = (index: number) => {
    const newHeaders = (config.headers || []).filter((_: any, i: number) => i !== index);
    handleConfigChange('headers', newHeaders);
  };

  return (
    <Box 
      sx={{ p: 2 }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <Typography variant="subtitle2" sx={{ mb: 2, color: '#6b7280' }}>
        HTTP Request Configuration
      </Typography>

      <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>
        Make HTTP requests to external APIs. Use {'{{ }}'} syntax to reference variables.
      </Alert>

      <FormControl 
        fullWidth 
        sx={{ mb: 2 }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <InputLabel>Method</InputLabel>
        <Select
          value={config.method}
          label="Method"
          onChange={(e) => {
            e.stopPropagation();
            handleConfigChange('method', e.target.value);
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
          size="small"
        >
          <MenuItem value="GET">GET</MenuItem>
          <MenuItem value="POST">POST</MenuItem>
          <MenuItem value="PUT">PUT</MenuItem>
          <MenuItem value="PATCH">PATCH</MenuItem>
          <MenuItem value="DELETE">DELETE</MenuItem>
        </Select>
      </FormControl>

      <Box 
        sx={{ mb: 2 }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <ExpressionEditor
          label="URL"
          value={config.url}
          onChange={(value) => handleConfigChange('url', value)}
          placeholder="https://api.example.com/endpoint"
        />
      </Box>

      <Box 
        sx={{ mb: 2 }}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#6b7280' }}>
            Headers
          </Typography>
          <IconButton size="small" onClick={addHeader} color="primary">
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
        {(config.headers || []).map((header: any, index: number) => (
          <Box 
            key={index} 
            sx={{ display: 'flex', gap: 1, mb: 1 }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <TextField
              size="small"
              placeholder="Header Name"
              value={header.key}
              onChange={(e) => {
                e.stopPropagation();
                updateHeader(index, 'key', e.target.value);
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
              autoComplete="off"
              sx={{ flex: 1 }}
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
            <TextField
              size="small"
              placeholder="Header Value"
              value={header.value}
              onChange={(e) => {
                e.stopPropagation();
                updateHeader(index, 'value', e.target.value);
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
              autoComplete="off"
              sx={{ flex: 1 }}
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
            <IconButton 
              size="small" 
              onClick={(e) => {
                e.stopPropagation();
                removeHeader(index);
              }} 
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
      </Box>

      {['POST', 'PUT', 'PATCH'].includes(config.method) && (
        <Box 
          sx={{ mb: 2 }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <ExpressionEditor
            label="Request Body"
            value={config.body}
            onChange={(value) => handleConfigChange('body', value)}
            multiline
            rows={6}
            placeholder='{"key": "value"}'
            helperText="JSON body for the request"
          />
        </Box>
      )}

      <Alert severity="success" sx={{ mt: 2, fontSize: '11px' }}>
        <Typography variant="caption" sx={{ fontWeight: 600 }}>
          Result Variables:
        </Typography>
        <br />
        <code style={{ fontSize: '10px' }}>
          {'{{ nodeId_result.statusCode }}'}<br />
          {'{{ nodeId_result.body.data }}'}<br />
          {'{{ nodeId_result.headers }}'}
        </code>
      </Alert>
    </Box>
  );
};

export default HttpRequestConfig;
