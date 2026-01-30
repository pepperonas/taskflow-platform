import React from 'react';
import { Node } from 'reactflow';

interface ConditionConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
}

const ConditionConfig: React.FC<ConditionConfigProps> = ({ node, onUpdate }) => {
  const config = node.data.config || {
    expression: '',
  };

  const handleConfigChange = (value: string) => {
    const newConfig = { ...config, expression: value };
    onUpdate(node.id, { ...node.data, config: newConfig });
  };

  const stopAll = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
  };

  return (
    <div 
      style={{ padding: 16 }}
      onMouseDown={stopAll}
      onClick={stopAll}
      onPointerDown={stopAll}
    >
      <div style={{ marginBottom: 8, fontSize: 13, color: '#6b7280', fontWeight: 500 }}>
        Configure Condition Node
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          Condition Expression *
        </label>
        <textarea
          value={config.expression}
          placeholder="e.g., {{ $trigger.priority === 'HIGH' }}"
          rows={4}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box',
            resize: 'vertical',
            minHeight: 100,
            fontFamily: 'monospace',
          }}
          onChange={(e) => handleConfigChange(e.target.value)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onKeyUp={stopAll}
          onFocus={stopAll}
        />
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
          Expression must evaluate to true or false. Use {'{{ }}'} syntax.
        </div>
      </div>

      <div style={{ padding: 12, backgroundColor: '#f0fdf4', borderRadius: 4, border: '1px solid #bbf7d0' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#166534', marginBottom: 4 }}>
          Examples:
        </div>
        <code style={{ fontSize: 11, color: '#166534', display: 'block' }}>
          {'{{ $trigger.status === "urgent" }}'}<br/>
          {'{{ $node1.count > 10 }}'}<br/>
          {'{{ $trigger.assignee !== null }}'}
        </code>
      </div>
    </div>
  );
};

export default ConditionConfig;
