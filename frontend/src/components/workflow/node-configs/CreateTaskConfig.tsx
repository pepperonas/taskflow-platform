import React from 'react';
import { Node } from 'reactflow';

interface CreateTaskConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
}

const CreateTaskConfig: React.FC<CreateTaskConfigProps> = ({ node, onUpdate }) => {
  const config = node.data.config || {
    title: '',
    description: '',
    priority: 'MEDIUM',
    assigneeId: '',
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
        Configure Create Task Node
      </div>

      {/* Task Title */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          Task Title *
        </label>
        <input
          type="text"
          value={config.title}
          placeholder="e.g., {{ $trigger.title }}"
          style={inputStyle}
          onChange={(e) => handleConfigChange('title', e.target.value)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onKeyUp={stopAll}
          onFocus={stopAll}
        />
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
          Use {'{{ }}'} for expressions
        </div>
      </div>

      {/* Task Description */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          Task Description
        </label>
        <textarea
          value={config.description}
          placeholder="e.g., {{ $trigger.description }}"
          rows={3}
          style={{ ...inputStyle, resize: 'vertical', minHeight: 80 }}
          onChange={(e) => handleConfigChange('description', e.target.value)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onKeyUp={stopAll}
          onFocus={stopAll}
        />
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
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
      </div>

      {/* Assignee ID */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          Assignee ID (optional)
        </label>
        <input
          type="text"
          value={config.assigneeId}
          placeholder="e.g., {{ $trigger.assigneeId }}"
          style={inputStyle}
          onChange={(e) => handleConfigChange('assigneeId', e.target.value)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onKeyUp={stopAll}
          onFocus={stopAll}
        />
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
          Leave empty for unassigned
        </div>
      </div>
    </div>
  );
};

export default CreateTaskConfig;
