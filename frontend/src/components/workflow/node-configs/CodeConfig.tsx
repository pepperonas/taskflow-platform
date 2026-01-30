import React from 'react';
import { Node } from 'reactflow';

interface CodeConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
}

const CodeConfig: React.FC<CodeConfigProps> = ({ node, onUpdate }) => {
  const config = node.data.config || {
    code: '',
  };

  const handleConfigChange = (value: string) => {
    const newConfig = { ...config, code: value };
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
        Configure Code Node
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          JavaScript Code *
        </label>
        <textarea
          value={config.code}
          placeholder={`// Access trigger data with $trigger\n// Access previous node data with $nodeId\nreturn {\n  result: $trigger.value * 2\n};`}
          rows={12}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #d1d5db',
            borderRadius: 4,
            fontSize: 13,
            outline: 'none',
            boxSizing: 'border-box',
            resize: 'vertical',
            minHeight: 200,
            fontFamily: 'monospace',
            lineHeight: 1.5,
          }}
          onChange={(e) => handleConfigChange(e.target.value)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onKeyUp={stopAll}
          onFocus={stopAll}
        />
      </div>

      <div style={{ padding: 12, backgroundColor: '#eff6ff', borderRadius: 4, border: '1px solid #bfdbfe' }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#1e40af', marginBottom: 4 }}>
          Available Variables:
        </div>
        <code style={{ fontSize: 11, color: '#1e40af', display: 'block' }}>
          $trigger - Trigger data<br/>
          $nodeId - Previous node output<br/>
          $context - Workflow context
        </code>
      </div>
    </div>
  );
};

export default CodeConfig;
