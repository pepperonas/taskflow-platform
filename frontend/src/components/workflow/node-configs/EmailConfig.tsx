import React from 'react';
import { Node } from 'reactflow';

interface EmailConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
}

const EmailConfig: React.FC<EmailConfigProps> = ({ node, onUpdate }) => {
  const config = node.data.config || {
    to: '',
    from: '',
    subject: '',
    body: '',
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
        Configure Email Node
      </div>

      {/* To */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          To *
        </label>
        <input
          type="text"
          value={config.to}
          placeholder="recipient@example.com"
          style={inputStyle}
          onChange={(e) => handleConfigChange('to', e.target.value)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onKeyUp={stopAll}
          onFocus={stopAll}
        />
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
          Use {'{{ $trigger.email }}'} for dynamic recipient
        </div>
      </div>

      {/* From */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          From
        </label>
        <input
          type="text"
          value={config.from}
          placeholder="noreply@example.com"
          style={inputStyle}
          onChange={(e) => handleConfigChange('from', e.target.value)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onKeyUp={stopAll}
          onFocus={stopAll}
        />
      </div>

      {/* Subject */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          Subject *
        </label>
        <input
          type="text"
          value={config.subject}
          placeholder="e.g., Task {{ $trigger.title }} created"
          style={inputStyle}
          onChange={(e) => handleConfigChange('subject', e.target.value)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onKeyUp={stopAll}
          onFocus={stopAll}
        />
      </div>

      {/* Body */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          Body *
        </label>
        <textarea
          value={config.body}
          placeholder="Email body content..."
          rows={6}
          style={{ ...inputStyle, resize: 'vertical', minHeight: 120 }}
          onChange={(e) => handleConfigChange('body', e.target.value)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onKeyUp={stopAll}
          onFocus={stopAll}
        />
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>
          Supports HTML. Use {'{{ }}'} for dynamic content.
        </div>
      </div>
    </div>
  );
};

export default EmailConfig;
