import React from 'react';
import { Node } from 'reactflow';

interface HttpRequestConfigProps {
  node: Node;
  onUpdate: (nodeId: string, data: any) => void;
}

const HttpRequestConfig: React.FC<HttpRequestConfigProps> = ({ node, onUpdate }) => {
  const config = node.data.config || {
    method: 'GET',
    url: '',
    headers: [] as { key: string; value: string }[],
    body: '',
  };

  const handleConfigChange = (field: string, value: any) => {
    const newConfig = { ...config, [field]: value };
    onUpdate(node.id, { ...node.data, config: newConfig });
  };

  const addHeader = () => {
    const newHeaders = [...(config.headers || []), { key: '', value: '' }];
    handleConfigChange('headers', newHeaders);
  };

  const updateHeader = (index: number, field: 'key' | 'value', value: string) => {
    const newHeaders = [...(config.headers || [])];
    newHeaders[index] = { ...newHeaders[index], [field]: value };
    handleConfigChange('headers', newHeaders);
  };

  const removeHeader = (index: number) => {
    const newHeaders = config.headers.filter((_: any, i: number) => i !== index);
    handleConfigChange('headers', newHeaders);
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
        Configure HTTP Request Node
      </div>

      {/* Method */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          Method
        </label>
        <select
          value={config.method}
          style={{ ...inputStyle, backgroundColor: 'white', cursor: 'pointer' }}
          onChange={(e) => handleConfigChange('method', e.target.value)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onFocus={stopAll}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      {/* URL */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
          URL *
        </label>
        <input
          type="text"
          value={config.url}
          placeholder="https://api.example.com/endpoint"
          style={inputStyle}
          onChange={(e) => handleConfigChange('url', e.target.value)}
          onMouseDown={stopAll}
          onClick={stopAll}
          onPointerDown={stopAll}
          onKeyDown={stopAll}
          onKeyUp={stopAll}
          onFocus={stopAll}
        />
      </div>

      {/* Headers */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <label style={{ fontSize: 12, color: '#6b7280' }}>Headers</label>
          <button
            onClick={(e) => { stopAll(e); addHeader(); }}
            style={{
              padding: '4px 8px',
              fontSize: 12,
              border: '1px solid #d1d5db',
              borderRadius: 4,
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            + Add Header
          </button>
        </div>
        {(config.headers || []).map((header: { key: string; value: string }, index: number) => (
          <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Key"
              value={header.key}
              style={{ ...inputStyle, flex: 1 }}
              onChange={(e) => updateHeader(index, 'key', e.target.value)}
              onMouseDown={stopAll}
              onClick={stopAll}
              onPointerDown={stopAll}
              onKeyDown={stopAll}
              onKeyUp={stopAll}
              onFocus={stopAll}
            />
            <input
              type="text"
              placeholder="Value"
              value={header.value}
              style={{ ...inputStyle, flex: 1 }}
              onChange={(e) => updateHeader(index, 'value', e.target.value)}
              onMouseDown={stopAll}
              onClick={stopAll}
              onPointerDown={stopAll}
              onKeyDown={stopAll}
              onKeyUp={stopAll}
              onFocus={stopAll}
            />
            <button
              onClick={(e) => { stopAll(e); removeHeader(index); }}
              style={{
                padding: '8px 12px',
                border: '1px solid #fca5a5',
                borderRadius: 4,
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Body */}
      {['POST', 'PUT', 'PATCH'].includes(config.method) && (
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 4, fontSize: 12, color: '#6b7280' }}>
            Request Body (JSON)
          </label>
          <textarea
            value={config.body}
            placeholder='{"key": "value"}'
            rows={5}
            style={{ ...inputStyle, fontFamily: 'monospace', resize: 'vertical' }}
            onChange={(e) => handleConfigChange('body', e.target.value)}
            onMouseDown={stopAll}
            onClick={stopAll}
            onPointerDown={stopAll}
            onKeyDown={stopAll}
            onKeyUp={stopAll}
            onFocus={stopAll}
          />
        </div>
      )}
    </div>
  );
};

export default HttpRequestConfig;
