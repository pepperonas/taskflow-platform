import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountTree as WorkflowIcon,
  Task as TaskIcon,
  VpnKey as CredentialsIcon,
  Logout as LogoutIcon,
  Rocket as RocketIcon,
  Settings as SettingsIcon,
  Code as CodeIcon,
  Http as HttpIcon,
  AutoAwesome as AutoAwesomeIcon,
  Storage as DatabaseIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import AppFooter from './AppFooter';

const drawerWidth = 280;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleUserMenuClose();
  };

  const menuItems = [
    {
      section: 'Hauptmenü',
      items: [
        { text: 'Übersicht', icon: <AutoAwesomeIcon />, path: '/showcase', badge: 'NEU' },
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
        { text: 'Workflows', icon: <WorkflowIcon />, path: '/workflows' },
        { text: 'Aufgaben', icon: <TaskIcon />, path: '/tasks' },
      ]
    },
    {
      section: 'Integrationen',
      items: [
        { text: 'HTTP-Anfragen', icon: <HttpIcon />, path: '/integrations/http' },
        { text: 'Code-Ausführung', icon: <CodeIcon />, path: '/integrations/code' },
        { text: 'Datenbank', icon: <DatabaseIcon />, path: '/integrations/database' },
        { text: 'E-Mail', icon: <EmailIcon />, path: '/integrations/email' },
        { text: 'Zugangsdaten', icon: <CredentialsIcon />, path: '/credentials' },
      ]
    },
    {
      section: 'System',
      items: [
        { text: 'Einstellungen', icon: <SettingsIcon />, path: '/settings' },
      ]
    }
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo & Title */}
      <Box
        sx={{
          p: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          cursor: 'pointer',
        }}
        onClick={() => navigate('/showcase')}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <RocketIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              TaskFlow
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              Workflow-Automatisierungsplattform
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider />

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 2 }}>
        {menuItems.map((section, idx) => (
          <Box key={idx}>
            <Typography
              variant="caption"
              sx={{
                px: 3,
                py: 1,
                display: 'block',
                color: 'text.secondary',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {section.section}
            </Typography>
            <List>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem key={item.text} disablePadding sx={{ px: 2 }}>
                    <ListItemButton
                      selected={isActive}
                      onClick={() => navigate(item.path)}
                      sx={{
                        borderRadius: 2,
                        mb: 0.5,
                        '&.Mui-selected': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                          '& .MuiListItemIcon-root': {
                            color: 'white',
                          },
                          '&:hover': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            opacity: 0.9,
                          }
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: isActive ? 'white' : 'inherit' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText primary={item.text} />
                      {item.badge && (
                        <Chip
                          label={item.badge}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: '10px',
                            background: isActive ? 'rgba(255,255,255,0.2)' : '#667eea',
                            color: 'white',
                            fontWeight: 700,
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
            {idx < menuItems.length - 1 && <Divider sx={{ my: 1 }} />}
          </Box>
        ))}
      </Box>

      {/* User Info */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 1.5,
            borderRadius: 2,
            bgcolor: 'grey.100',
            cursor: 'pointer',
            '&:hover': { bgcolor: 'grey.200' }
          }}
          onClick={handleUserMenuOpen}
        >
          <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
            {user?.username?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>
              {user?.username}
            </Typography>
            <Typography variant="caption" noWrap sx={{ color: 'text.secondary' }}>
              {user?.email}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {menuItems.flatMap(s => s.items).find(i => i.path === location.pathname)?.text || 'TaskFlow'}
          </Typography>
          <Chip
            icon={<RocketIcon />}
            label="Live-Demo"
            color="primary"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              border: 'none',
              boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: '#f5f7fa',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1 }}>
          {children}
        </Box>
        <AppFooter />
      </Box>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleUserMenuClose}
      >
        <MenuItem onClick={() => { navigate('/settings'); handleUserMenuClose(); }}>
          <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
          Einstellungen
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
          Abmelden
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MainLayout;
