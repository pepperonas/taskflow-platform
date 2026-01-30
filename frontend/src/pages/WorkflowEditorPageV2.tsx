import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
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
  Typography,
  Paper,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import NodePropertiesPanel from '../components/workflow/NodePropertiesPanel';
import ExecutionResultsPanel from '../components/workflow/ExecutionResultsPanel';
import NodeContextMenu from '../components/workflow/NodeContextMenu';
import ExecutionHistoryPanel from '../components/workflow/ExecutionHistoryPanel';
import CommandPalette, { Command } from '../components/workflow/CommandPalette';
import KeyboardShortcutsDialog from '../components/workflow/KeyboardShortcutsDialog';
import StickyNoteNode from '../components/workflow/StickyNoteNode';
import { exportWorkflow, importWorkflow } from '../utils/workflowExport';
import { autoArrangeNodes } from '../utils/graphLayout';

// Custom Node Components
const TriggerNode = ({ data, id }: any) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '12px 16px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
        border: data.disabled ? '2px dashed #9ca3af' : '2px solid #10b981',
        minWidth: '180px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        opacity: data.disabled ? 0.5 : 1,
      }}
    >
      {isHovered && !data.disabled && (
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: 0,
            display: 'flex',
            gap: '4px',
            background: 'white',
            padding: '4px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onToggleDisable?.(id);
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: '#f3f4f6',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Disable"
          >
            ⏸️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete?.(id);
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: '#fee2e2',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>⚡</span>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>{data.label || 'Trigger'}</span>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#10b981' }} />
    </div>
  );
};

const CreateTaskNode = ({ data, id }: any) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '12px 16px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        border: data.disabled ? '2px dashed #9ca3af' : '2px solid #3b82f6',
        minWidth: '180px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        opacity: data.disabled ? 0.5 : 1,
      }}
    >
      {isHovered && !data.disabled && (
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: 0,
            display: 'flex',
            gap: '4px',
            background: 'white',
            padding: '4px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onToggleDisable?.(id);
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: '#f3f4f6',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Disable"
          >
            ⏸️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete?.(id);
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: '#fee2e2',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
      <Handle type="target" position={Position.Left} style={{ background: '#3b82f6' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>📝</span>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>{data.label || 'Create Task'}</span>
      </div>
      {data.title && (
        <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(59, 130, 246, 0.2)' }}>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>{data.title}</div>
        </div>
      )}
      <Handle type="source" position={Position.Right} style={{ background: '#3b82f6' }} />
    </div>
  );
};

const ConditionNode = ({ data, id }: any) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '12px 16px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
        border: data.disabled ? '2px dashed #9ca3af' : '2px solid #f59e0b',
        minWidth: '180px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        opacity: data.disabled ? 0.5 : 1,
      }}
    >
      {isHovered && !data.disabled && (
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: 0,
            display: 'flex',
            gap: '4px',
            background: 'white',
            padding: '4px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onToggleDisable?.(id);
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: '#f3f4f6',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Disable"
          >
            ⏸️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete?.(id);
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: '#fee2e2',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
      <Handle type="target" position={Position.Left} style={{ background: '#f59e0b' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>🔀</span>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>{data.label || 'Condition'}</span>
      </div>
      <Handle type="source" position={Position.Right} id="true" style={{ top: '30%', background: '#10b981' }} />
      <Handle type="source" position={Position.Right} id="false" style={{ top: '70%', background: '#ef4444' }} />
    </div>
  );
};

const DelayNode = ({ data, id }: any) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '12px 16px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
        border: data.disabled ? '2px dashed #9ca3af' : '2px solid #8b5cf6',
        minWidth: '180px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        opacity: data.disabled ? 0.5 : 1,
      }}
    >
      {isHovered && !data.disabled && (
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: 0,
            display: 'flex',
            gap: '4px',
            background: 'white',
            padding: '4px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onToggleDisable?.(id);
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: '#f3f4f6',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Disable"
          >
            ⏸️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete?.(id);
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: '#fee2e2',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
      <Handle type="target" position={Position.Left} style={{ background: '#8b5cf6' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>⏱️</span>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>{data.label || 'Delay'}</span>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#8b5cf6' }} />
    </div>
  );
};

const UpdateTaskNode = ({ data, id }: any) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '12px 16px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
        border: data.disabled ? '2px dashed #9ca3af' : '2px solid #f59e0b',
        minWidth: '180px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        opacity: data.disabled ? 0.5 : 1,
      }}
    >
      {isHovered && !data.disabled && (
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: 0,
            display: 'flex',
            gap: '4px',
            background: 'white',
            padding: '4px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onToggleDisable?.(id);
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: '#f3f4f6',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Disable"
          >
            ⏸️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete?.(id);
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: '#fee2e2',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
      <Handle type="target" position={Position.Left} style={{ background: '#f59e0b' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>✏️</span>
        <span style={{ fontWeight: 600, fontSize: '14px' }}>{data.label || 'Update Task'}</span>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#f59e0b' }} />
    </div>
  );
};

const HttpRequestNode = ({ data, id }: any) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '15px 20px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        border: data.disabled ? '2px dashed #9ca3af' : 'none',
        color: 'white',
        minWidth: '200px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        opacity: data.disabled ? 0.4 : 1,
      }}
    >
      {isHovered && !data.disabled && (
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: 0,
            display: 'flex',
            gap: '4px',
            background: 'white',
            padding: '4px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onToggleDisable?.(id);
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: '#f3f4f6',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Disable"
          >
            ⏸️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete?.(id);
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: '#fee2e2',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
      <Handle type="target" position={Position.Left} style={{ background: '#764ba2' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>🌐</span>
        <div>
          <div style={{ fontWeight: 600 }}>{data.label || 'HTTP Request'}</div>
          {data.method && data.url && (
            <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '4px' }}>
              {data.method} {data.url.substring(0, 30)}{data.url.length > 30 ? '...' : ''}
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#764ba2' }} />
    </div>
  );
};

const CodeNode = ({ data, id }: any) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '12px 16px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        border: data.disabled ? '2px dashed #9ca3af' : 'none',
        color: 'white',
        minWidth: '180px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        opacity: data.disabled ? 0.4 : 1,
      }}
    >
      {isHovered && !data.disabled && (
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: 0,
            display: 'flex',
            gap: '4px',
            background: 'white',
            padding: '4px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onToggleDisable?.(id);
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: '#f3f4f6',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Disable"
          >
            ⏸️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete?.(id);
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: '#fee2e2',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
      <Handle type="target" position={Position.Left} style={{ background: '#334155' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '20px' }}>💻</span>
        <div>
          <div style={{ fontWeight: 600, fontSize: '14px' }}>{data.label || 'Code'}</div>
          <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>JavaScript</div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#334155' }} />
    </div>
  );
};

const EmailNode = ({ data, id }: any) => {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        padding: '15px 20px',
        borderRadius: '8px',
        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        border: data.disabled ? '2px dashed #9ca3af' : 'none',
        color: 'white',
        minWidth: '200px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        opacity: data.disabled ? 0.4 : 1,
      }}
    >
      {isHovered && !data.disabled && (
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: 0,
            display: 'flex',
            gap: '4px',
            background: 'white',
            padding: '4px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onToggleDisable?.(id);
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: '#f3f4f6',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Disable"
          >
            ⏸️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete?.(id);
            }}
            style={{
              padding: '4px 8px',
              border: 'none',
              background: '#fee2e2',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      )}
      <Handle type="target" position={Position.Left} style={{ background: '#fee140' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>📧</span>
        <div>
          <div style={{ fontWeight: 600 }}>{data.label || 'Email'}</div>
          {data.config?.to && (
            <div style={{ fontSize: '11px', opacity: 0.9, marginTop: '4px' }}>
              To: {data.config.to.substring(0, 30)}{data.config.to.length > 30 ? '...' : ''}
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#fee140' }} />
    </div>
  );
};

const nodeTypes: NodeTypes = {
  trigger: TriggerNode,
  createTask: CreateTaskNode,
  updateTask: UpdateTaskNode,
  condition: ConditionNode,
  delay: DelayNode,
  httpRequest: HttpRequestNode,
  code: CodeNode,
  email: EmailNode,
  stickyNote: StickyNoteNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

// Helper function to format relative time
const formatRelativeTime = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / 60000);

  if (diffSecs < 10) return 'just now';
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMs / 3600000);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleString();
};

const WorkflowEditorPageV2: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [saving, setSaving] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [selectedExecution, setSelectedExecution] = useState<any>(null);
  const [copiedNodes, setCopiedNodes] = useState<Node[]>([]);
  const [contextMenu, setContextMenu] = useState<{ node: Node; position: { top: number; left: number } } | null>(null);
  const [history, setHistory] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showShortcutsDialog, setShowShortcutsDialog] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [notification, setNotification] = useState<{ message: string; severity: 'success' | 'error' | 'info' } | null>(null);

  // Debug logs only in development
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Only log significant changes, not every render
      console.log('[WorkflowEditorV2] Nodes:', nodes.length, 'Edges:', edges.length);
    }
  }, [nodes.length, edges.length]);

  const handleNodeToggleDisable = useCallback((nodeId: string) => {
    setNodes(prev =>
      prev.map(n => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: { ...n.data, disabled: !n.data.disabled }
          };
        }
        return n;
      })
    );
    const node = nodes.find(n => n.id === nodeId);
    setNotification({
      message: node?.data.disabled ? 'Node enabled' : 'Node disabled',
      severity: 'success'
    });
  }, [nodes, setNodes]);

  const handleNodeDelete = useCallback((nodeId: string) => {
    setNodes(prev => prev.filter(n => n.id !== nodeId));
    setEdges(prev => prev.filter(e => e.source !== nodeId && e.target !== nodeId));
    setNotification({ message: 'Node deleted', severity: 'success' });
  }, [setNodes, setEdges]);

  const handleStickyNoteChange = useCallback((nodeId: string, content: string) => {
    setNodes(prev =>
      prev.map(n => {
        if (n.id === nodeId) {
          return {
            ...n,
            data: { ...n.data, content }
          };
        }
        return n;
      })
    );
  }, [setNodes]);

  const loadWorkflow = useCallback(async (workflowId: string) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

      const response = await axios.get(`${apiUrl}/v1/workflows/${workflowId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const workflow = response.data;
      setWorkflowName(workflow.name);

      // Add handlers to loaded nodes
      const loadedNodes = JSON.parse(workflow.nodesJson || '[]').map((node: Node) => ({
        ...node,
        position: node.position || { x: 0, y: 0 }, // Ensure position is always defined
        data: {
          ...node.data,
          onToggleDisable: handleNodeToggleDisable,
          onDelete: handleNodeDelete,
        },
      }));

      setNodes(loadedNodes);
      setEdges(JSON.parse(workflow.edgesJson || '[]'));
    } catch (error) {
      console.error('Error loading workflow:', error);
      setNotification({ message: 'Failed to load workflow', severity: 'error' });
    }
  }, [handleNodeToggleDisable, handleNodeDelete, setNodes, setEdges]);

  const handleSave = useCallback(async (silent = false) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

      // Validation: Check if user is logged in
      if (!user || !user.id) {
        console.error('User not authenticated - user object:', user);
        setNotification({
          message: 'Please log in to save workflows',
          severity: 'error'
        });
        setSaving(false);
        // Redirect to login
        window.location.href = '/login';
        return;
      }

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

      setIsDirty(false);
      setLastSaved(new Date());

      if (!silent) {
        setNotification({ message: 'Workflow saved successfully', severity: 'success' });
      }
    } catch (error: any) {
      console.error('Error saving workflow:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      if (!silent) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to save workflow';
        setNotification({ message: errorMessage, severity: 'error' });
      }
    } finally {
      setSaving(false);
    }
  }, [workflowName, nodes, edges, id]);

  const handleExecute = useCallback(async () => {
    if (!id || id === 'new') {
      setNotification({
        message: 'Please save the workflow first before executing',
        severity: 'error'
      });
      return;
    }

    try {
      setExecuting(true);
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8082/api';

      if (process.env.NODE_ENV === 'development') {
        console.log('[WorkflowEditorV2] Executing workflow:', id);
      }

      const response = await axios.post(
        `${apiUrl}/v1/workflows/${id}/execute`,
        {}, // Empty trigger data for manual execution
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (process.env.NODE_ENV === 'development') {
        console.log('[WorkflowEditorV2] Execution response:', response.data);
      }

      const executionStatus = response.data.status;

      setNotification({
        message: `Workflow execution ${executionStatus.toLowerCase()}`,
        severity: executionStatus === 'COMPLETED' ? 'success' : executionStatus === 'FAILED' ? 'error' : 'info'
      });

      // Store execution result for display
      setSelectedExecution(response.data);

    } catch (error: any) {
      console.error('[WorkflowEditorV2] Execution error:', error);
      setNotification({
        message: error.response?.data?.message || 'Workflow execution failed',
        severity: 'error'
      });
    } finally {
      setExecuting(false);
    }
  }, [id]);

  const addNode = useCallback((type: string) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: {
        label: type.charAt(0).toUpperCase() + type.slice(1),
        onToggleDisable: handleNodeToggleDisable,
        onDelete: handleNodeDelete,
        onChange: type === 'stickyNote' ? handleStickyNoteChange : undefined,
        content: type === 'stickyNote' ? '' : undefined,
      },
    };

    if (process.env.NODE_ENV === 'development') {
      console.log('[WorkflowEditorV2] Adding node:', newNode);
    }
    setNodes((nds) => [...nds, newNode]);
  }, [handleNodeToggleDisable, handleNodeDelete, handleStickyNoteChange, setNodes]);

  // Load workflow only once when id changes
  const workflowLoadedRef = useRef<string | null>(null);
  useEffect(() => {
    if (id && id !== 'new' && workflowLoadedRef.current !== id) {
      loadWorkflow(id);
      workflowLoadedRef.current = id;
    } else if (!id || id === 'new') {
      workflowLoadedRef.current = null;
    }
  }, [id, loadWorkflow]);

  // Track changes to mark as dirty (only when actually changed, not on initial load)
  const prevNodesRef = React.useRef<Node[]>([]);
  const prevEdgesRef = React.useRef<Edge[]>([]);
  const prevWorkflowNameRef = React.useRef<string>('Untitled Workflow');
  
  useEffect(() => {
    const nodesChanged = JSON.stringify(nodes) !== JSON.stringify(prevNodesRef.current);
    const edgesChanged = JSON.stringify(edges) !== JSON.stringify(prevEdgesRef.current);
    const nameChanged = workflowName !== prevWorkflowNameRef.current;
    
    if (nodesChanged || edgesChanged || nameChanged) {
      setIsDirty(true);
      prevNodesRef.current = nodes;
      prevEdgesRef.current = edges;
      prevWorkflowNameRef.current = workflowName;
    }
  }, [nodes, edges, workflowName]);

  // Auto-save every 30 seconds if dirty
  useEffect(() => {
    const interval = setInterval(() => {
      if (isDirty && id && id !== 'new' && !saving) {
        handleSave(true); // silent save
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isDirty, id, saving, handleSave]);

  // Save to history when nodes or edges change (debounced to avoid excessive updates)
  useEffect(() => {
    // Skip if this is the initial load or if nodes/edges are empty
    if (nodes.length === 0 && edges.length === 0) {
      return;
    }

    const timeoutId = setTimeout(() => {
      const newHistoryEntry = { nodes, edges };

      // Only save if actually different from current history state
      if (historyIndex === -1 ||
          JSON.stringify(newHistoryEntry) !== JSON.stringify(history[historyIndex])) {
        // Remove any future history if we're not at the end
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newHistoryEntry);

        // Limit history to last 50 states
        if (newHistory.length > 50) {
          newHistory.shift();
        }

        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }, 300); // Debounce by 300ms

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const previousState = history[historyIndex - 1];
      // Ensure all nodes have valid positions
      const validatedNodes = previousState.nodes.map((node: Node) => ({
        ...node,
        position: node.position || { x: 0, y: 0 },
      }));
      setNodes(validatedNodes);
      setEdges(previousState.edges);
      setHistoryIndex(historyIndex - 1);
      setNotification({ message: 'Undone', severity: 'info' });
    }
  }, [historyIndex, history, setNodes, setEdges]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      // Ensure all nodes have valid positions
      const validatedNodes = nextState.nodes.map((node: Node) => ({
        ...node,
        position: node.position || { x: 0, y: 0 },
      }));
      setNodes(validatedNodes);
      setEdges(nextState.edges);
      setHistoryIndex(historyIndex + 1);
      setNotification({ message: 'Redone', severity: 'info' });
    }
  }, [historyIndex, history, setNodes, setEdges]);

  // Keyboard shortcuts for copy/paste/duplicate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if user is typing in an input field
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement?.tagName === 'INPUT' ||
        activeElement?.tagName === 'TEXTAREA' ||
        activeElement?.hasAttribute('contenteditable') ||
        activeElement?.closest('.MuiDrawer-paper') !== null;

      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Exit early if in input field - let the input handle the key
      // Exception: Command Palette (Cmd+K) should always work
      if (isInputFocused) {
        if (cmdOrCtrl && e.key === 'k') {
          // Allow Command Palette to open even from input
          e.preventDefault();
          setShowCommandPalette(true);
          return;
        }
        // Allow Escape to bubble (e.g., close autocomplete)
        if (e.key === 'Escape') {
          return;
        }
        // For all other keys, let the input handle them
        return;
      }

      // Copy (Ctrl/Cmd+C)
      if (cmdOrCtrl && e.key === 'c' && !e.shiftKey) {
        const selectedNodes = nodes.filter(n => n.selected);
        if (selectedNodes.length > 0) {
          e.preventDefault();
          setCopiedNodes(selectedNodes);
          setNotification({
            message: `Copied ${selectedNodes.length} node(s)`,
            severity: 'success'
          });
        }
      }

      // Paste (Ctrl/Cmd+V)
      if (cmdOrCtrl && e.key === 'v' && copiedNodes.length > 0) {
        e.preventDefault();
        const newNodes = copiedNodes.map(node => ({
          ...node,
          id: `${node.type}-${Date.now()}-${Math.random()}`,
          position: {
            x: (node.position?.x || 0) + 50,
            y: (node.position?.y || 0) + 50
          },
          selected: false,
        }));
        setNodes(prev => [...prev, ...newNodes]);
        setNotification({
          message: `Pasted ${newNodes.length} node(s)`,
          severity: 'success'
        });
      }

      // Duplicate (Ctrl/Cmd+D)
      if (cmdOrCtrl && e.key === 'd') {
        const selectedNodes = nodes.filter(n => n.selected);
        if (selectedNodes.length > 0) {
          e.preventDefault();
          const duplicatedNodes = selectedNodes.map(node => ({
            ...node,
            id: `${node.type}-${Date.now()}-${Math.random()}`,
            position: {
              x: (node.position?.x || 0) + 50,
              y: (node.position?.y || 0) + 50
            },
            selected: false,
          }));
          setNodes(prev => [...prev, ...duplicatedNodes]);
          setNotification({
            message: `Duplicated ${duplicatedNodes.length} node(s)`,
            severity: 'success'
          });
        }
      }

      // Command Palette (Ctrl/Cmd+K)
      if (cmdOrCtrl && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }

      // Keyboard Shortcuts (?)
      if (e.key === '?' && !cmdOrCtrl) {
        e.preventDefault();
        setShowShortcutsDialog(true);
      }

      // Add Sticky Note (Shift+S)
      if (e.shiftKey && e.key === 'S' && !cmdOrCtrl) {
        e.preventDefault();
        addNode('stickyNote');
      }

      // Undo (Ctrl/Cmd+Z)
      if (cmdOrCtrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo (Shift+Ctrl/Cmd+Z or Ctrl/Cmd+Y)
      if ((cmdOrCtrl && e.shiftKey && e.key === 'z') || (cmdOrCtrl && e.key === 'y')) {
        e.preventDefault();
        redo();
      }

      // Save (Ctrl/Cmd+S)
      if (cmdOrCtrl && e.key === 's') {
        e.preventDefault();
        handleSave();
      }

      // Execute (Ctrl/Cmd+Enter)
      if (cmdOrCtrl && e.key === 'Enter') {
        e.preventDefault();
        handleExecute();
      }

      // Delete selected nodes (Delete or Backspace)
      if ((e.key === 'Delete' || e.key === 'Backspace') && !e.ctrlKey && !e.metaKey) {
        const selectedNodes = nodes.filter(n => n.selected);
        if (selectedNodes.length > 0) {
          e.preventDefault();
          const selectedIds = selectedNodes.map(n => n.id);
          setNodes(prev => prev.filter(n => !selectedIds.includes(n.id)));
          setEdges(prev => prev.filter(e =>
            !selectedIds.includes(e.source) && !selectedIds.includes(e.target)
          ));
          setNotification({
            message: `Deleted ${selectedNodes.length} node(s)`,
            severity: 'success'
          });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nodes, copiedNodes, id, undo, redo, addNode, handleExecute, handleSave, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      if (process.env.NODE_ENV === 'development') {
        console.log('[WorkflowEditorV2] Connecting:', params);
      }
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

  const handleExportWorkflow = useCallback(() => {
    exportWorkflow(workflowName, nodes, edges);
    setNotification({ message: 'Workflow exported successfully', severity: 'success' });
  }, [workflowName, nodes, edges]);

  const handleImportWorkflow = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      importWorkflow(
        file,
        (data) => {
          // Add handlers to imported nodes
          const nodesWithHandlers = data.nodes.map(node => ({
            ...node,
            position: node.position || { x: 0, y: 0 }, // Ensure position is always defined
            data: {
              ...node.data,
              onToggleDisable: handleNodeToggleDisable,
              onDelete: handleNodeDelete,
              onChange: node.type === 'stickyNote' ? handleStickyNoteChange : undefined,
            },
          }));

          setWorkflowName(data.name + ' (Imported)');
          setNodes(nodesWithHandlers);
          setEdges(data.edges);
          setNotification({ message: 'Workflow imported successfully', severity: 'success' });
        },
        (error) => {
          setNotification({ message: error, severity: 'error' });
        }
      );
    };
    input.click();
  }, [handleNodeToggleDisable, handleNodeDelete, handleStickyNoteChange, setNodes, setEdges]);

  const handleAutoArrange = useCallback(() => {
    const arrangedNodes = autoArrangeNodes(nodes, edges);
    setNodes(arrangedNodes);
    setNotification({ message: 'Nodes arranged automatically', severity: 'success' });
  }, [nodes, edges, setNodes]);

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[WorkflowEditorV2] Node clicked:', node);
    }
    setSelectedNode(node);
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    setContextMenu({
      node,
      position: { top: event.clientY, left: event.clientX }
    });
  }, []);

  const handleContextMenuAction = useCallback((action: string, node: Node) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[WorkflowEditorV2] Context menu action:', action, node);
    }

    switch (action) {
      case 'execute':
        // TODO: Execute single node
        setNotification({ message: 'Node execution not yet implemented', severity: 'info' });
        break;

      case 'duplicate':
        const duplicated = {
          ...node,
          id: `${node.type}-${Date.now()}-${Math.random()}`,
          position: {
            x: (node.position?.x || 0) + 50,
            y: (node.position?.y || 0) + 50
          },
          selected: false,
        };
        setNodes(prev => [...prev, duplicated]);
        setNotification({ message: 'Node duplicated', severity: 'success' });
        break;

      case 'copy':
        setCopiedNodes([node]);
        setNotification({ message: 'Node copied', severity: 'success' });
        break;

      case 'toggle-disable':
        setNodes(prev =>
          prev.map(n => {
            if (n.id === node.id) {
              return {
                ...n,
                data: { ...n.data, disabled: !n.data.disabled }
              };
            }
            return n;
          })
        );
        setNotification({
          message: node.data.disabled ? 'Node enabled' : 'Node disabled',
          severity: 'success'
        });
        break;

      case 'delete':
        setNodes(prev => prev.filter(n => n.id !== node.id));
        setEdges(prev => prev.filter(e => e.source !== node.id && e.target !== node.id));
        setNotification({ message: 'Node deleted', severity: 'success' });
        break;
    }
  }, [setNodes, setEdges]);

  const updateNodeData = useCallback((nodeId: string, data: any) => {
    // Use functional update to avoid stale closure issues
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,  // Keep existing data
              ...data,       // Merge with new data
              onToggleDisable: handleNodeToggleDisable,
              onDelete: handleNodeDelete,
            }
          };
        }
        return node;
      })
    );
  }, [setNodes, handleNodeToggleDisable, handleNodeDelete]);

  // Command Palette Commands
  const commands: Command[] = React.useMemo(() => [
    {
      id: 'add-trigger',
      label: 'Add Trigger Node',
      description: 'Add a manual trigger node to the canvas',
      category: 'Nodes',
      action: () => addNode('trigger'),
    },
    {
      id: 'add-create-task',
      label: 'Add CreateTask Node',
      description: 'Add a create task node to the canvas',
      category: 'Nodes',
      action: () => addNode('createTask'),
    },
    {
      id: 'add-update-task',
      label: 'Add UpdateTask Node',
      description: 'Add an update task node to the canvas',
      category: 'Nodes',
      action: () => addNode('updateTask'),
    },
    {
      id: 'add-http-request',
      label: 'Add HTTP Request Node',
      description: 'Add an HTTP request node to call external APIs',
      category: 'Nodes',
      action: () => addNode('httpRequest'),
    },
    {
      id: 'add-code',
      label: 'Add Code Node',
      description: 'Add a code node to run custom JavaScript',
      category: 'Nodes',
      action: () => addNode('code'),
    },
    {
      id: 'add-condition',
      label: 'Add Condition Node',
      description: 'Add a condition node to the canvas',
      category: 'Nodes',
      action: () => addNode('condition'),
    },
    {
      id: 'add-delay',
      label: 'Add Delay Node',
      description: 'Add a delay node to the canvas',
      category: 'Nodes',
      action: () => addNode('delay'),
    },
    {
      id: 'add-sticky-note',
      label: 'Add Sticky Note',
      description: 'Add a sticky note annotation to the canvas',
      category: 'Nodes',
      action: () => addNode('stickyNote'),
      shortcut: 'Shift+S',
    },
    {
      id: 'save',
      label: 'Save Workflow',
      description: 'Save the current workflow',
      category: 'Workflow',
      action: () => handleSave(),
      shortcut: 'Ctrl+S',
    },
    {
      id: 'execute',
      label: 'Execute Workflow',
      description: 'Run the workflow with trigger data',
      category: 'Workflow',
      action: handleExecute,
      shortcut: 'Ctrl+Enter',
    },
    {
      id: 'history',
      label: 'View Execution History',
      description: 'Show past workflow executions',
      category: 'Workflow',
      action: () => setShowHistoryPanel(true),
    },
    {
      id: 'export',
      label: 'Export Workflow',
      description: 'Download workflow as JSON file',
      category: 'Workflow',
      action: handleExportWorkflow,
    },
    {
      id: 'import',
      label: 'Import Workflow',
      description: 'Load workflow from JSON file',
      category: 'Workflow',
      action: handleImportWorkflow,
    },
    {
      id: 'auto-arrange',
      label: 'Auto-Arrange Nodes',
      description: 'Automatically arrange nodes in a clean layout',
      category: 'Workflow',
      action: handleAutoArrange,
    },
    {
      id: 'undo',
      label: 'Undo',
      description: 'Undo last action',
      category: 'Edit',
      action: undo,
      shortcut: 'Ctrl+Z',
    },
    {
      id: 'redo',
      label: 'Redo',
      description: 'Redo last undone action',
      category: 'Edit',
      action: redo,
      shortcut: 'Ctrl+Shift+Z',
    },
    {
      id: 'copy',
      label: 'Copy Selected Nodes',
      description: 'Copy selected nodes to clipboard',
      category: 'Edit',
      action: () => {
        const selectedNodes = nodes.filter(n => n.selected);
        if (selectedNodes.length > 0) {
          setCopiedNodes(selectedNodes);
          setNotification({ message: `Copied ${selectedNodes.length} node(s)`, severity: 'success' });
        }
      },
      shortcut: 'Ctrl+C',
    },
    {
      id: 'paste',
      label: 'Paste Nodes',
      description: 'Paste copied nodes',
      category: 'Edit',
      action: () => {
        if (copiedNodes.length > 0) {
          const newNodes = copiedNodes.map(node => ({
            ...node,
            id: `${node.type}-${Date.now()}-${Math.random()}`,
            position: {
              x: (node.position?.x || 0) + 50,
              y: (node.position?.y || 0) + 50
            },
            selected: false,
          }));
          setNodes(prev => [...prev, ...newNodes]);
          setNotification({ message: `Pasted ${newNodes.length} node(s)`, severity: 'success' });
        }
      },
      shortcut: 'Ctrl+V',
    },
    {
      id: 'delete',
      label: 'Delete Selected Nodes',
      description: 'Delete all selected nodes',
      category: 'Edit',
      action: () => {
        const selectedNodes = nodes.filter(n => n.selected);
        if (selectedNodes.length > 0) {
          const selectedIds = selectedNodes.map(n => n.id);
          setNodes(prev => prev.filter(n => !selectedIds.includes(n.id)));
          setEdges(prev => prev.filter(e => !selectedIds.includes(e.source) && !selectedIds.includes(e.target)));
          setNotification({ message: `Deleted ${selectedNodes.length} node(s)`, severity: 'success' });
        }
      },
      shortcut: 'Delete',
    },
  ], [handleExecute, undo, redo, nodes, copiedNodes, addNode, handleAutoArrange, handleExportWorkflow, handleImportWorkflow, handleSave, setNodes, setEdges]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#f3f4f6' }}>
      {/* Top Toolbar */}
      <AppBar position="static" sx={{ background: 'white', color: '#1f2937', boxShadow: 1 }}>
        <Toolbar>
          <Button onClick={() => navigate('/workflows')} sx={{ mr: 2 }}>
            ← Back
          </Button>
          <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 300 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TextField
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                variant="standard"
                InputProps={{ style: { fontSize: '16px', fontWeight: 600 } }}
                sx={{ flex: 1 }}
              />
              {isDirty && (
                <Typography sx={{ color: '#ef4444', fontWeight: 600, fontSize: '16px' }}>
                  *
                </Typography>
              )}
            </Box>
            {lastSaved && (
              <Typography variant="caption" sx={{ color: '#6b7280', mt: 0.5 }}>
                {saving ? 'Saving...' : `Saved ${formatRelativeTime(lastSaved)}`}
              </Typography>
            )}
          </Box>

          <Box sx={{ display: 'flex', gap: 0.5, ml: 2, mr: 'auto' }}>
            <Tooltip title="Undo (Ctrl+Z)">
              <span>
                <IconButton
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  size="small"
                >
                  <UndoIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title="Redo (Ctrl+Shift+Z)">
              <span>
                <IconButton
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  size="small"
                >
                  <RedoIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          <Button onClick={() => handleSave()} disabled={saving} variant="contained" sx={{ mr: 1 }}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            onClick={() => setShowHistoryPanel(true)}
            variant="outlined"
            sx={{ mr: 1 }}
            disabled={!id || id === 'new'}
          >
            📋 History
          </Button>
          <Button
            onClick={handleExecute}
            disabled={executing || !id || id === 'new'}
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
          >
            {executing ? '⏳ Executing...' : '▶ Execute'}
          </Button>
          <Tooltip title="Keyboard Shortcuts (?)">
            <IconButton onClick={() => setShowShortcutsDialog(true)} size="small">
              <HelpOutlineIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Options">
            <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)} size="small">
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
          >
            <MenuItem onClick={() => { handleAutoArrange(); setMenuAnchor(null); }}>
              Auto-Arrange Nodes
            </MenuItem>
            <MenuItem onClick={() => { handleExportWorkflow(); setMenuAnchor(null); }}>
              Export Workflow
            </MenuItem>
            <MenuItem onClick={() => { handleImportWorkflow(); setMenuAnchor(null); }}>
              Import Workflow
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel - Node Palette */}
        <Drawer
          variant="permanent"
          sx={{
            width: 260,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 260,
              position: 'static',
              height: '100%',
              boxSizing: 'border-box',
              border: 'none',
            }
          }}
        >
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

            <Paper
              sx={{ p: 1.5, mb: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f0f9ff' } }}
              onClick={() => addNode('updateTask')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>✏️</span>
                <span>Update Task</span>
              </Box>
            </Paper>

            <Paper
              sx={{ p: 1.5, mb: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f0f9ff' } }}
              onClick={() => addNode('httpRequest')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>🌐</span>
                <span>HTTP Request</span>
              </Box>
            </Paper>

            <Paper
              sx={{ p: 1.5, mb: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f0f9ff' } }}
              onClick={() => addNode('code')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>💻</span>
                <span>Code (JavaScript)</span>
              </Box>
            </Paper>

            <Paper
              sx={{ p: 1.5, mb: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f0f9ff' } }}
              onClick={() => addNode('email')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>📧</span>
                <span>Send Email</span>
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

            <Typography variant="caption" sx={{ mb: 1, mt: 2, display: 'block', color: '#6b7280' }}>
              ANNOTATIONS
            </Typography>
            <Paper
              sx={{ p: 1.5, mb: 1, cursor: 'pointer', '&:hover': { bgcolor: '#f0f9ff' } }}
              onClick={() => addNode('stickyNote')}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <span>📝</span>
                <span>Sticky Note</span>
              </Box>
            </Paper>
          </Box>
        </Drawer>

        {/* Center - React Flow Canvas */}
        <Box sx={{
          flex: 1,
          position: 'relative',
          marginRight: selectedNode ? '400px' : 0,
          transition: 'margin-right 0.2s',
        }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeContextMenu={onNodeContextMenu}
            onPaneClick={() => {
              // Allow clicks on pane to deselect nodes
              if (selectedNode) {
                setSelectedNode(null);
              }
            }}
            nodeTypes={nodeTypes}
            fitView
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
            snapToGrid={true}
            snapGrid={[15, 15]}
            nodesDraggable={true}
            nodesConnectable={true}
            elementsSelectable={true}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#e5e7eb" />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </Box>
      </Box>

      {/* Right Panel - Node Properties */}
      <NodePropertiesPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onUpdate={updateNodeData}
      />

      {/* Bottom Panel - Execution Results */}
      <ExecutionResultsPanel
        execution={selectedExecution}
        onClose={() => setSelectedExecution(null)}
      />

      {/* Node Context Menu */}
      <NodeContextMenu
        node={contextMenu?.node || null}
        position={contextMenu?.position || null}
        onClose={() => setContextMenu(null)}
        onAction={handleContextMenuAction}
      />

      {/* Execution History Panel */}
      <ExecutionHistoryPanel
        open={showHistoryPanel}
        onClose={() => setShowHistoryPanel(false)}
        workflowId={id}
        onSelectExecution={(execution) => {
          setSelectedExecution(execution);
          setShowHistoryPanel(false);
        }}
      />

      {/* Command Palette */}
      <CommandPalette
        open={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        commands={commands}
      />

      {/* Keyboard Shortcuts Dialog */}
      <KeyboardShortcutsDialog
        open={showShortcutsDialog}
        onClose={() => setShowShortcutsDialog(false)}
      />

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
