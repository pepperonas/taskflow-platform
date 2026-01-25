import React from 'react';
import { Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import PauseIcon from '@mui/icons-material/Pause';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { Node } from 'reactflow';

interface NodeContextMenuProps {
  node: Node | null;
  position: { top: number; left: number } | null;
  onClose: () => void;
  onAction: (action: string, node: Node) => void;
}

const NodeContextMenu: React.FC<NodeContextMenuProps> = ({
  node,
  position,
  onClose,
  onAction,
}) => {
  if (!node || !position) return null;

  const isDisabled = node.data?.disabled || false;

  return (
    <Menu
      open={!!node && !!position}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={position}
    >
      <MenuItem
        onClick={() => {
          onAction('execute', node);
          onClose();
        }}
      >
        <ListItemIcon>
          <PlayArrowIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Execute Node</ListItemText>
      </MenuItem>

      <MenuItem
        onClick={() => {
          onAction('duplicate', node);
          onClose();
        }}
      >
        <ListItemIcon>
          <FileCopyIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Duplicate</ListItemText>
      </MenuItem>

      <MenuItem
        onClick={() => {
          onAction('copy', node);
          onClose();
        }}
      >
        <ListItemIcon>
          <ContentCopyIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>Copy</ListItemText>
      </MenuItem>

      <MenuItem
        onClick={() => {
          onAction('toggle-disable', node);
          onClose();
        }}
      >
        <ListItemIcon>
          {isDisabled ? <PlayCircleOutlineIcon fontSize="small" /> : <PauseIcon fontSize="small" />}
        </ListItemIcon>
        <ListItemText>{isDisabled ? 'Enable' : 'Disable'}</ListItemText>
      </MenuItem>

      <Divider />

      <MenuItem
        onClick={() => {
          onAction('delete', node);
          onClose();
        }}
        sx={{ color: 'error.main' }}
      >
        <ListItemIcon>
          <DeleteIcon fontSize="small" color="error" />
        </ListItemIcon>
        <ListItemText>Delete</ListItemText>
      </MenuItem>
    </Menu>
  );
};

export default NodeContextMenu;
