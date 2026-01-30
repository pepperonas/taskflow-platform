import React from 'react';
import { Node } from 'reactflow';

interface DelayConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
}

const DelayConfig: React.FC<DelayConfigProps> = ({ node, onUpdate }) => {
  const config = node.data.config || {
    duration: 1000,
    unit: 'milliseconds',
  };

  const handleConfigChange = (field: string, value: string | number) => {
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
        Configure Delay Node
      </div>

      {/* Duration */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          Duration *
        </label>
        <input
          type="number"
          value={config.duration}
          min={0}
          style={inputStyle}
          onChange={(e) => handleConfigChange('duration', parseInt(e.target.value) || 0)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onKeyUp={stopAll}
          onFocus={stopAll}
        />
      </div>

      {/* Unit */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          Unit
        </label>
        <select
          value={config.unit}
          style={{ ...inputStyle, backgroundColor: 'white', cursor: 'pointer' }}
          onChange={(e) => handleConfigChange('unit', e.target.value)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onFocus={stopAll}
        >
          <option value="milliseconds">Milliseconds</option>
          <option value="seconds">Seconds</option>
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
        </select>
      </div>

      <div style={{ padding: 12, backgroundColor: '#fef3c7', borderRadius: 4, border: '1px solid #fcd34d' }}>
        <div style={{ fontSize: 12, color: '#92400e' }}>
          ⏱️ The workflow will pause for {config.duration} {config.unit} before continuing.
        </div>
      </div>
    </div>
  );
};

export default DelayConfig;
