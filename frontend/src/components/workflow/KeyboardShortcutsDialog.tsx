import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Chip,
  IconButton,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface KeyboardShortcutsDialogProps {
  open: boolean;
  onClose: () => void;
}

interface Shortcut {
  keys: string;
  description: string;
}

interface ShortcutCategory {
  category: string;
  shortcuts: Shortcut[];
}

const KeyboardShortcutsDialog: React.FC<KeyboardShortcutsDialogProps> = ({ open, onClose }) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const cmdKey = isMac ? '⌘' : 'Ctrl';

  const shortcutCategories: ShortcutCategory[] = [
    {
      category: 'General',
      shortcuts: [
        { keys: `${cmdKey}+K`, description: 'Open command palette' },
        { keys: `${cmdKey}+S`, description: 'Save workflow' },
        { keys: `${cmdKey}+Enter`, description: 'Execute workflow' },
        { keys: '?', description: 'Show keyboard shortcuts' },
      ],
    },
    {
      category: 'Editing',
      shortcuts: [
        { keys: `${cmdKey}+C`, description: 'Copy selected nodes' },
        { keys: `${cmdKey}+V`, description: 'Paste nodes' },
        { keys: `${cmdKey}+D`, description: 'Duplicate selected nodes' },
        { keys: 'Delete', description: 'Delete selected nodes' },
        { keys: `${cmdKey}+Z`, description: 'Undo' },
        { keys: `${cmdKey}+Shift+Z`, description: 'Redo' },
      ],
    },
    {
      category: 'Nodes',
      shortcuts: [
        { keys: 'Click', description: 'Select node' },
        { keys: 'Right Click', description: 'Open context menu' },
        { keys: 'D', description: 'Toggle node disable/enable' },
        { keys: 'Drag', description: 'Move node' },
      ],
    },
    {
      category: 'Canvas',
      shortcuts: [
        { keys: 'Mouse Wheel', description: 'Zoom in/out' },
        { keys: 'Space+Drag', description: 'Pan canvas' },
        { keys: 'Ctrl+Space', description: 'Show variable autocomplete' },
      ],
    },
  ];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Keyboard Shortcuts</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pb: 2 }}>
          {shortcutCategories.map((category, index) => (
            <Box key={category.category} sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{ mb: 2, color: '#6b7280', fontWeight: 600 }}
              >
                {category.category}
              </Typography>

              {category.shortcuts.map((shortcut, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.5,
                    px: 2,
                    bgcolor: idx % 2 === 0 ? '#f9fafb' : 'white',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="body2">{shortcut.description}</Typography>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {shortcut.keys.split('+').map((key, keyIdx) => (
                      <React.Fragment key={keyIdx}>
                        {keyIdx > 0 && (
                          <Typography variant="body2" sx={{ mx: 0.5, color: '#6b7280' }}>
                            +
                          </Typography>
                        )}
                        <Chip
                          label={key}
                          size="small"
                          sx={{
                            bgcolor: '#e5e7eb',
                            fontFamily: 'monospace',
                            fontSize: '12px',
                            fontWeight: 600,
                          }}
                        />
                      </React.Fragment>
                    ))}
                  </Box>
                </Box>
              ))}

              {index < shortcutCategories.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 3, p: 2, bgcolor: '#eff6ff', borderRadius: 1 }}>
          <Typography variant="caption" sx={{ color: '#1e40af' }}>
            <strong>Tip:</strong> Press <kbd style={{ padding: '2px 6px', background: '#dbeafe', borderRadius: '3px' }}>?</kbd> at any time to open this dialog.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default KeyboardShortcutsDialog;
