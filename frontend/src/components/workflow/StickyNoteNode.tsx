import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Paper, TextField, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface StickyNoteNodeProps {
  data: any;
  id: string;
}

const StickyNoteNode: React.FC<StickyNoteNodeProps> = ({ data, id }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Paper
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        background: '#fff9c4',
        border: '1px solid #f9a825',
        padding: 2,
        minWidth: 200,
        maxWidth: 400,
        minHeight: 100,
        position: 'relative',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        cursor: isEditing ? 'text' : 'move',
      }}
    >
      {isHovered && !isEditing && (
        <Box
          sx={{
            position: 'absolute',
            top: -35,
            right: 0,
            display: 'flex',
            gap: 0.5,
            background: 'white',
            padding: '4px',
            borderRadius: '6px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            zIndex: 1000,
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              data.onDelete?.(id);
            }}
            sx={{ padding: '4px' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      <TextField
        multiline
        fullWidth
        value={data.content || ''}
        onChange={(e) => data.onChange?.(id, e.target.value)}
        onFocus={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
        placeholder="Add note..."
        variant="standard"
        InputProps={{
          disableUnderline: true,
          style: {
            fontSize: '14px',
            fontFamily: 'inherit',
          },
        }}
        sx={{
          '& .MuiInputBase-root': {
            '&:before, &:after': {
              display: 'none',
            },
          },
        }}
      />
    </Paper>
  );
};

export default StickyNoteNode;
