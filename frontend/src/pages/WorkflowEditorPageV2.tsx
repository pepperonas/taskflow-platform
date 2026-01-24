import React, { useCallback, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  NodeTypes,
  MarkerType,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Box,
  AppBar,
  Toolbar,
  Button,
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Alert,
  Snackbar,
} from '@mui/material';
import axios from 'axios';

// Custom Node Components
const TriggerNode = ({ data }: any) => (
  <div
    style={{
      padding: '12px 16px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      border: '2px solid #10b981',
      minWidth: '180px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '20px' }}>⚡</span>
      <span style={{ fontWeight: 600, fontSize: '14px' }}>{data.label || 'Trigger'}</span>
    </div>
    <Handle type="source" position={Position.Bottom} style={{ background: '#10b981' }} />
  </div>
);

const CreateTaskNode = ({ data }: any) => (
  <div
    style={{
      padding: '12px 16px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
      border: '2px solid #3b82f6',
      minWidth: '180px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}
  >
    <Handle type="target" position={Position.Top} style={{ background: '#3b82f6' }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '20px' }}>📝</span>
      <span style={{ fontWeight: 600, fontSize: '14px' }}>{data.label || 'Create Task'}</span>
    </div>
    {data.title && (
      <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
        <div style={{ fontSize: '12px', color: '#6b7280' }}>{data.title}</div>
      </div>
    )}
    <Handle type="source" position={Position.Bottom} style={{ background: '#3b82f6' }} />
  </div>
);

const ConditionNode = ({ data }: any) => (
  <div
    style={{
      padding: '12px 16px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
      border: '2px solid #f59e0b',
      minWidth: '180px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}
  >
    <Handle type="target" position={Position.Top} style={{ background: '#f59e0b' }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '20px' }}>🔀</span>
      <span style={{ fontWeight: 600, fontSize: '14px' }}>{data.label || 'Condition'}</span>
    </div>
    <Handle type="source" position={Position.Bottom} id="true" style={{ left: '30%', background: '#10b981' }} />
    <Handle type="source" position={Position.Bottom} id="false" style={{ left: '70%', background: '#ef4444' }} />
  </div>
);

const DelayNode = ({ data }: any) => (
  <div
    style={{
      padding: '12px 16px',
      borderRadius: '8px',
      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
      border: '2px solid #8b5cf6',
      minWidth: '180px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    }}
  >
    <Handle type="target" position={Position.Top} style={{ background: '#8b5cf6' }} />
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '20px' }}>⏱️</span>
      <span style={{ fontWeight: 600, fontSize: '14px' }}>{data.label || 'Delay'}</span>
    </div>
    <Handle type="source" position={Position.Bottom} style={{ background: '#8b5cf6' }} />
  </div>
);

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  createTask: CreateTaskNode,
  condition: ConditionNode,
  delay: DelayNode,
};

const initialNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: { label: 'Manual Trigger' },
  },
];

const WorkflowEditorPageV2: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);

  console.log('[WorkflowEditorV2] Component rendered');
  console.log('[WorkflowEditorV2] Nodes:', nodes.length);
  console.log('[WorkflowEditorV2] Edges:', edges.length);

  useEffect(() => {
    if (id && id !== 'new') {
      loadWorkflow(id);
    }
  }, [id]);

  const loadWorkflow = async (workflowId: string) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

      const response = await axios.get(`${apiUrl}/v1/workflows/${workflowId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const workflow = response.data;
      setWorkflowName(workflow.name);
      setNodes(JSON.parse(workflow.nodesJson));
      setEdges(JSON.parse(workflow.edgesJson));
    } catch (error) {
      console.error('Error loading workflow:', error);
      setNotification({ message: 'Failed to load workflow', severity: 'error' });
    }
  };

  const onConnect = useCallback(
    (params: Connection) => {
      console.log('[WorkflowEditorV2] Connecting:', params);
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            markerEnd: { type: MarkerType.ArrowClosed },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const addNode = (type: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
    };

    console.log('[WorkflowEditorV2] Adding node:', newNode);
    setNodes((nds) => [...nds, newNode]);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

      const payload = {
        name: workflowName,
        description: '',
        nodesJson: JSON.stringify(nodes),
        edgesJson: JSON.stringify(edges),
      };

      if (id && id !== 'new') {
        await axios.put(`${apiUrl}/v1/workflows/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${apiUrl}/v1/workflows?ownerId=${user.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setNotification({ message: 'Workflow saved successfully', severity: 'success' });
    } catch (error) {
      console.error('Error saving workflow:', error);
      setNotification({ message: 'Failed to save workflow', severity: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6' }}>
      {/* Top Toolbar */}
      <AppBar position="static" sx={{ background: 'white', color: '#1f2937', boxShadow: 1 }}>
        <Toolbar>
          <Button onClick={() => navigate('/workflows')} sx={{ mr: 2 }}>
            ← Back
          </Button>
          <TextField
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            variant="standard"
            sx={{ minWidth: 300, mr: 'auto' }}
            InputProps={{ style: { fontSize: '16px', fontWeight: 600 } }}
          />
          <Button onClick={handleSave} disabled={saving} variant="contained" sx={{ mr: 1 }}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant="contained" color="primary">
            ▶ Execute
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel - Node Palette */}
        <Drawer variant="permanent" sx={{ width: 260, flexShrink: 0 }}>
          <Box sx={{ width: 260, p: 2, background: '#f9fafb', height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Nodes
            </Typography>

            <Typography variant="caption" sx={{ mb: 1, display: 'block', color: '#6b7280' }}>
              TRIGGERS
            </Typography>
            <Paper
              sx={{ p: 1.5, mb: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f0f9ff' } }}
              onClick={() => addNode('trigger')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>⚡</span>
                <span>Manual Trigger</span>
              </Box>
            </Paper>

            <Typography variant="caption" sx={{ mb: 1, mt: 2, display: 'block', color: '#6b7280' }}>
              ACTIONS
            </Typography>
            <Paper
              sx={{ p: 1.5, mb: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f0f9ff' } }}
              onClick={() => addNode('createTask')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>📝</span>
                <span>Create Task</span>
              </Box>
            </Paper>

            <Typography variant="caption" sx={{ mb: 1, mt: 2, display: 'block', color: '#6b7280' }}>
              LOGIC
            </Typography>
            <Paper
              sx={{ p: 1.5, mb: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f0f9ff' } }}
              onClick={() => addNode('condition')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>🔀</span>
                <span>Condition</span>
              </Box>
            </Paper>

            <Typography variant="caption" sx={{ mb: 1, mt: 2, display: 'block', color: '#6b7280' }}>
              UTILITIES
            </Typography>
            <Paper
              sx={{ p: 1.5, mb: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f0f9ff' } }}
              onClick={() => addNode('delay')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>⏱️</span>
                <span>Delay</span>
              </Box>
            </Paper>
          </Box>
        </Drawer>

        {/* Center - React Flow Canvas */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e5e7eb" />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </Box>
      </Box>

      {/* Notifications */}
      <Snackbar
        open={!!notification}
        autoHideDuration={3000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        {notification && (
          <Alert severity={notification.severity} onClose={() => setNotification(null)}>
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default WorkflowEditorPageV2;
