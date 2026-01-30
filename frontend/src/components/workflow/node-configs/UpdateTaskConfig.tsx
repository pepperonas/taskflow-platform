import React from 'react';
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
    status: '',
    priority: '',
  };

  const handleConfigChange = (field: string, value: string) => {
    const newConfig = { ...config, [field]: value };
    onUpdate(node.id, { ...node.data, config: newConfig });
  };

  const stopAll = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: 4,
    fontSize: 14,
    outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div 
      style={{ padding: 16 }}
      onMouseDown={stopAll}
      onClick={stopAll}
      onPointerDown={stopAll}
    >
      <div style={{ marginBottom: 8, fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
        Configure Update Task Node
      </div>

      {/* Task ID */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          Task ID *
        </label>
        <input
          type="text"
          value={config.taskId}
          placeholder="e.g., {{ $trigger.taskId }}"
          style={inputStyle}
          onChange={(e) => handleConfigChange('taskId', e.target.value)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onKeyUp={stopAll}
          onFocus={stopAll}
        />
      </div>

      {/* Title */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          New Title (optional)
        </label>
        <input
          type="text"
          value={config.title}
          placeholder="Leave empty to keep current"
          style={inputStyle}
          onChange={(e) => handleConfigChange('title', e.target.value)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onKeyUp={stopAll}
          onFocus={stopAll}
        />
      </div>

      {/* Status */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          Status
        </label>
        <select
          value={config.status}
          style={{ ...inputStyle, backgroundColor: 'white', cursor: 'pointer' }}
          onChange={(e) => handleConfigChange('status', e.target.value)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onFocus={stopAll}
        >
          <option value="">Keep current</option>
          <option value="OPEN">Open</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Priority */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          Priority
        </label>
        <select
          value={config.priority}
          style={{ ...inputStyle, backgroundColor: 'white', cursor: 'pointer' }}
          onChange={(e) => handleConfigChange('priority', e.target.value)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onFocus={stopAll}
        >
          <option value="">Keep current</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>
    </div>
  );
};

export default UpdateTaskConfig;
