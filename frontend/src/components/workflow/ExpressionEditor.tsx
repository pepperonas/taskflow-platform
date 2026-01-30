import React, { useState, useRef } from 'react';
import {
  TextField,
  Box,
  Typography,
} from '@mui/material';

interface ExpressionEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  helperText?: string;
}

const ExpressionEditor: React.FC<ExpressionEditorProps> = ({
  value,
  onChange,
  label,
  placeholder,
  multiline = false,
  rows = 1,
  helperText,
}) => {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Available variables for autocomplete
  const variables = [
    { category: 'Trigger', items: [
      { label: '$trigger.taskId', description: 'Task ID from trigger' },
      { label: '$trigger.title', description: 'Task title from trigger' },
      { label: '$trigger.description', description: 'Task description from trigger' },
      { label: '$trigger.priority', description: 'Task priority from trigger' },
      { label: '$trigger.assigneeId', description: 'Assignee ID from trigger' },
      { label: '$trigger.status', description: 'Task status from trigger' },
    ]},
    { category: 'Built-in Functions', items: [
      { label: '$now()', description: 'Current timestamp' },
      { label: '$json()', description: 'Parse JSON string' },
      { label: '$uuid()', description: 'Generate UUID' },
    ]},
  ];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Show autocomplete on Ctrl+Space or when typing {{
    if ((e.ctrlKey && e.key === ' ') || value.endsWith('{{')) {
      setShowAutocomplete(true);
    }

    // Hide autocomplete on Escape
    if (e.key === 'Escape') {
      setShowAutocomplete(false);
    }
  };

  const insertVariable = (variable: string) => {
    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);

    // If we're inside {{ }}, replace the content
    if (textBeforeCursor.lastIndexOf('{{') > textBeforeCursor.lastIndexOf('}}')) {
      const beforeBraces = textBeforeCursor.substring(0, textBeforeCursor.lastIndexOf('{{'));
      const newValue = `${beforeBraces}{{ ${variable} }}${textAfterCursor}`;
      onChange(newValue);
    } else {
      // Otherwise, insert at cursor position
      const newValue = `${textBeforeCursor}{{ ${variable} }}${textAfterCursor}`;
      onChange(newValue);
    }

    setShowAutocomplete(false);
  };

  return (
    <Box 
      sx={{ position: 'relative', zIndex: 1 }}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
    >
      <TextField
        fullWidth
        label={label}
        value={value}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e.target.value);
          setCursorPosition(e.target.selectionStart || 0);
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
          handleKeyDown(e);
        }}
        onKeyPress={(e) => {
          e.stopPropagation();
        }}
        onKeyUp={(e) => {
          e.stopPropagation();
        }}
        onFocus={(e) => {
          e.stopPropagation();
          setCursorPosition(e.target.selectionStart || 0);
        }}
        placeholder={placeholder}
        helperText={helperText || 'Press Ctrl+Space for variable suggestions, or type {{ to insert expressions'}
        multiline={multiline}
        rows={multiline ? rows : undefined}
        inputRef={inputRef}
        autoComplete="off"
        InputProps={{
          onMouseDown: (e) => {
            e.stopPropagation();
          },
          onClick: (e) => {
            e.stopPropagation();
          },
        }}
        inputProps={{
          onMouseDown: (e) => {
            e.stopPropagation();
          },
          onClick: (e) => {
            e.stopPropagation();
          },
        }}
      />

      {showAutocomplete && (
        <Box
          sx={{
            position: 'absolute',
            zIndex: 1000,
            mt: 1,
            bgcolor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: 1,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxHeight: '300px',
            overflow: 'auto',
            width: '400px',
          }}
        >
          {variables.map((category) => (
            <Box key={category.category}>
              <Typography
                variant="caption"
                sx={{
                  p: 1,
                  display: 'block',
                  bgcolor: '#f9fafb',
                  fontWeight: 600,
                  color: '#6b7280',
                }}
              >
                {category.category}
              </Typography>
              {category.items.map((item) => (
                <Box
                  key={item.label}
                  onClick={() => insertVariable(item.label)}
                  sx={{
                    p: 1.5,
                    cursor: 'pointer',
                    '&:hover': { bgcolor: '#f0f9ff' },
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontFamily: 'monospace', fontWeight: 600 }}
                  >
                    {item.label}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#6b7280' }}>
                    {item.description}
                  </Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ExpressionEditor;
