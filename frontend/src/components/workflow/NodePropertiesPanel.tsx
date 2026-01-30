import React from 'react';
import { Node } from 'reactflow';
import CreateTaskConfig from './node-configs/CreateTaskConfig';
import UpdateTaskConfig from './node-configs/UpdateTaskConfig';
import ConditionConfig from './node-configs/ConditionConfig';
import DelayConfig from './node-configs/DelayConfig';
import HttpRequestConfig from './node-configs/HttpRequestConfig';
import CodeConfig from './node-configs/CodeConfig';
import EmailConfig from './node-configs/EmailConfig';

interface NodePropertiesPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdate: (nodeId: string, data: any) => void;
}

const NodePropertiesPanel: React.FC<NodePropertiesPanelProps> = ({
  node,
  onClose,
  onUpdate,
}) => {
  const [localLabel, setLocalLabel] = React.useState<string>('');

  React.useEffect(() => {
    if (node) {
      setLocalLabel(node.data?.label || '');
    }
  }, [node]);

  const handleLabelChange = (newLabel: string) => {
    setLocalLabel(newLabel);
    if (node) {
      onUpdate(node.id, { ...node.data, label: newLabel });
    }
  };

  if (!node) return null;

  const getNodeIcon = (type: string) => {
    const icons: Record<string, string> = {
      trigger: '⚡', createTask: '📝', updateTask: '✏️', condition: '🔀',
      delay: '⏱️', httpRequest: '🌐', code: '💻', email: '📧',
    };
    return icons[type] || '📦';
  };

  const getNodeTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      trigger: 'Trigger', createTask: 'Create Task', updateTask: 'Update Task',
      condition: 'Condition', delay: 'Delay', httpRequest: 'HTTP Request',
      code: 'Code', email: 'Email',
    };
    return labels[type] || type;
  };

  const renderConfig = () => {
    switch (node.type) {
      case 'createTask': return <CreateTaskConfig node={node} onUpdate={onUpdate} />;
      case 'updateTask': return <UpdateTaskConfig node={node} onUpdate={onUpdate} />;
      case 'condition': return <ConditionConfig node={node} onUpdate={onUpdate} />;
      case 'delay': return <DelayConfig node={node} onUpdate={onUpdate} />;
      case 'httpRequest': return <HttpRequestConfig node={node} onUpdate={onUpdate} />;
      case 'code': return <CodeConfig node={node} onUpdate={onUpdate} />;
      case 'email': return <EmailConfig node={node} onUpdate={onUpdate} />;
      case 'trigger':
        return <div style={{ padding: 16, color: '#6b7280' }}>Manual trigger node. Click "Execute" to run.</div>;
      default:
        return <div style={{ padding: 16, color: '#6b7280' }}>No configuration available.</div>;
    }
  };

  // Pure HTML/CSS Drawer - NO Material-UI
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        right: 0,
        width: 400,
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: '-2px 0 8px rgba(0, 0, 0, 0.1)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div style={{
        padding: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #e5e7eb',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>{getNodeIcon(node.type || '')}</span>
          <span style={{ fontSize: 18, fontWeight: 600 }}>{getNodeTypeLabel(node.type || '')}</span>
        </div>
        <button
          onClick={onClose}
          style={{
            border: 'none',
            background: '#f3f4f6',
            borderRadius: 4,
            padding: '4px 8px',
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          ✕
        </button>
      </div>

      {/* Node Name */}
      <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb' }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          Node Name
        </label>
        <input
          type="text"
          value={localLabel}
          onChange={(e) => handleLabelChange(e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ marginTop: 8, fontSize: 11, color: '#9ca3af' }}>
          Node ID: {node.id}
        </div>
      </div>

      {/* Config */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {renderConfig()}
      </div>
    </div>
  );
};

export default NodePropertiesPanel;
