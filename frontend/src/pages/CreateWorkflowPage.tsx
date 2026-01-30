import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface WorkflowNode {
  id: string;
  type: string;
  data: {
    [key: string]: any;
  };
}

const CreateWorkflowPage: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: 'trigger-1',
      type: 'trigger',
      data: { label: 'Manual Trigger' },
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const addNode = (type: string) => {
    const newNode: WorkflowNode = {
      id: `${type}-${Date.now()}`,
      type,
      data: {},
    };

    setNodes([...nodes, newNode]);
  };

  const removeNode = (id: string) => {
    setNodes(nodes.filter((n) => n.id !== id));
  };

  const updateNodeData = (id: string, key: string, value: any) => {
    setNodes(
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, [key]: value } }
          : node
      )
    );
  };

  const generateEdges = () => {
    const edges = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      edges.push({
        id: `e${i}`,
        source: nodes[i].id,
        target: nodes[i + 1].id,
      });
    }
    return edges;
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Workflow name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

      const edges = generateEdges();

      const response = await axios.post(
        `${apiUrl}/v1/workflows?ownerId=${user.id}`,
        {
          name,
          description,
          nodesJson: JSON.stringify(nodes),
          edgesJson: JSON.stringify(edges),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess(true);
      setTimeout(() => {
        navigate('/workflows');
      }, 1500);
    } catch (err: any) {
      console.error('Error creating workflow:', err);
      setError(err.response?.data?.message || 'Failed to create workflow');
      setLoading(false);
    }
  };

  const renderNodeForm = (node: WorkflowNode) => {
    switch (node.type) {
      case 'trigger':
        return (
          <Typography variant="body2" color="text.secondary">
            Trigger node - starts the workflow execution
          </Typography>
        );

      case 'createTask':
        return (
          <Stack spacing={2}>
            <TextField
              label="Task Title"
              value={node.data.title || ''}
              onChange={(e) => updateNodeData(node.id, 'title', e.target.value)}
              size="small"
              fullWidth
            />
            <TextField
              label="Description"
              value={node.data.description || ''}
              onChange={(e) => updateNodeData(node.id, 'description', e.target.value)}
              size="small"
              multiline
              rows={2}
              fullWidth
            />
            <FormControl size="small" fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={node.data.priority || 'MEDIUM'}
                label="Priority"
                onChange={(e) => updateNodeData(node.id, 'priority', e.target.value)}
              >
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="CRITICAL">Critical</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={node.data.category || 'WORK'}
                label="Category"
                onChange={(e) => updateNodeData(node.id, 'category', e.target.value)}
              >
                <MenuItem value="WORK">Work</MenuItem>
                <MenuItem value="PERSONAL">Personal</MenuItem>
                <MenuItem value="DEVELOPMENT">Development</MenuItem>
                <MenuItem value="BUG">Bug</MenuItem>
                <MenuItem value="FEATURE">Feature</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        );

      case 'delay':
        return (
          <TextField
            label="Delay (milliseconds)"
            type="number"
            value={node.data.delayMs || 1000}
            onChange={(e) => updateNodeData(node.id, 'delayMs', parseInt(e.target.value))}
            size="small"
            fullWidth
          />
        );

      case 'condition':
        return (
          <Stack spacing={2}>
            <TextField
              label="Left Value (e.g., ${priority})"
              value={node.data.left || ''}
              onChange={(e) => updateNodeData(node.id, 'left', e.target.value)}
              size="small"
              fullWidth
            />
            <FormControl size="small" fullWidth>
              <InputLabel>Operator</InputLabel>
              <Select
                value={node.data.operator || 'equals'}
                label="Operator"
                onChange={(e) => updateNodeData(node.id, 'operator', e.target.value)}
              >
                <MenuItem value="equals">Equals (==)</MenuItem>
                <MenuItem value="notEquals">Not Equals (!=)</MenuItem>
                <MenuItem value="contains">Contains</MenuItem>
                <MenuItem value="greaterThan">Greater Than (&gt;)</MenuItem>
                <MenuItem value="lessThan">Less Than (&lt;)</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Right Value"
              value={node.data.right || ''}
              onChange={(e) => updateNodeData(node.id, 'right', e.target.value)}
              size="small"
              fullWidth
            />
          </Stack>
        );

      default:
        return (
          <Typography variant="body2" color="text.secondary">
            No configuration needed
          </Typography>
        );
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Button
            color="inherit"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/workflows')}
          >
            Back to Workflows
          </Button>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
            Create Workflow
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Workflow created successfully! Redirecting...
          </Alert>
        )}

        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Basic Information
          </Typography>

          <Stack spacing={3} sx={{ mb: 4 }}>
            <TextField
              label="Workflow Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={3}
              fullWidth
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">
              Workflow Nodes ({nodes.length})
            </Typography>
            <Box>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => addNode('createTask')}
                sx={{ mr: 1 }}
              >
                Create Task
              </Button>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => addNode('delay')}
                sx={{ mr: 1 }}
              >
                Delay
              </Button>
              <Button
                size="small"
                startIcon={<AddIcon />}
                onClick={() => addNode('condition')}
              >
                Condition
              </Button>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Nodes will execute in order from top to bottom.
          </Typography>

          {nodes.map((node, index) => (
            <Accordion key={node.id} defaultExpanded={index === 0}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Typography sx={{ flexGrow: 1 }}>
                    {index + 1}. {node.type.charAt(0).toUpperCase() + node.type.slice(1)} ({node.id})
                  </Typography>
                  {node.type !== 'trigger' && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNode(node.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>{renderNodeForm(node)}</AccordionDetails>
            </Accordion>
          ))}

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading || !name.trim()}
              fullWidth
            >
              {loading ? 'Creating...' : 'Create Workflow'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/workflows')} fullWidth>
              Cancel
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateWorkflowPage;
