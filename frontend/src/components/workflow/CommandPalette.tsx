import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  Box,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Chip,
} from '@mui/material';

export interface Command {
  id: string;
  label: string;
  description?: string;
  category: string;
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: Command[];
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose, commands }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setSearch('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  const filteredCommands = commands.filter((cmd) => {
    const searchLower = search.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.description?.toLowerCase().includes(searchLower) ||
      cmd.category.toLowerCase().includes(searchLower)
    );
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      executeCommand(filteredCommands[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const executeCommand = (command: Command) => {
    command.action();
    onClose();
  };

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          position: 'absolute',
          top: '20%',
          m: 0,
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          placeholder="Type a command or search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedIndex(0);
          }}
          onKeyDown={handleKeyDown}
          inputRef={inputRef}
          autoFocus
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: '16px',
            },
          }}
        />
      </Box>

      <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
        {Object.keys(groupedCommands).length === 0 && (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              No commands found
            </Typography>
          </Box>
        )}

        {Object.entries(groupedCommands).map(([category, cmds]) => (
          <Box key={category}>
            <Typography
              variant="caption"
              sx={{
                px: 2,
                py: 1,
                display: 'block',
                bgcolor: '#f9fafb',
                fontWeight: 600,
                color: '#6b7280',
              }}
            >
              {category}
            </Typography>
            <List disablePadding>
              {cmds.map((cmd, index) => {
                const globalIndex = filteredCommands.indexOf(cmd);
                const isSelected = globalIndex === selectedIndex;

                return (
                  <ListItem key={cmd.id} disablePadding>
                    <ListItemButton
                      onClick={() => executeCommand(cmd)}
                      selected={isSelected}
                      sx={{
                        py: 1.5,
                        px: 2,
                        bgcolor: isSelected ? '#eff6ff' : 'transparent',
                        '&:hover': {
                          bgcolor: '#f0f9ff',
                        },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="body2">{cmd.label}</Typography>
                            {cmd.shortcut && (
                              <Chip
                                label={cmd.shortcut}
                                size="small"
                                sx={{
                                  height: '20px',
                                  fontSize: '11px',
                                  bgcolor: '#e5e7eb',
                                  fontFamily: 'monospace',
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={cmd.description}
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          p: 1.5,
          borderTop: '1px solid #e5e7eb',
          bgcolor: '#f9fafb',
          display: 'flex',
          gap: 2,
        }}
      >
        <Typography variant="caption" sx={{ color: '#6b7280' }}>
          <kbd style={{ padding: '2px 6px', background: '#e5e7eb', borderRadius: '3px' }}>↑↓</kbd> Navigate
        </Typography>
        <Typography variant="caption" sx={{ color: '#6b7280' }}>
          <kbd style={{ padding: '2px 6px', background: '#e5e7eb', borderRadius: '3px' }}>Enter</kbd> Execute
        </Typography>
        <Typography variant="caption" sx={{ color: '#6b7280' }}>
          <kbd style={{ padding: '2px 6px', background: '#e5e7eb', borderRadius: '3px' }}>Esc</kbd> Close
        </Typography>
      </Box>
    </Dialog>
  );
};

export default CommandPalette;
