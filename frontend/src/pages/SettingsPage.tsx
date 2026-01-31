import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  Divider,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  Language as LanguageIcon,
  Security as SecurityIcon,
  Info as InfoIcon,
  GitHub as GitHubIcon,
  Code as CodeIcon,
} from '@mui/icons-material';
import { Link } from '@mui/material';

const SettingsPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Einstellungen
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Verwalte deine Präferenzen und Kontoeinstellungen
        </Typography>
      </Box>

      <Paper>
        <List>
          <ListItem>
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText
              primary="E-Mail-Benachrichtigungen"
              secondary="E-Mail-Benachrichtigungen für Workflow-Ausführungen erhalten"
            />
            <Switch defaultChecked />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <DarkModeIcon />
            </ListItemIcon>
            <ListItemText
              primary="Dunkler Modus"
              secondary="Dunkles Design verwenden (Demnächst verfügbar)"
            />
            <Switch disabled />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText
              primary="Sprache"
              secondary="Deutsch"
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemIcon>
              <SecurityIcon />
            </ListItemIcon>
            <ListItemText
              primary="Zwei-Faktor-Authentifizierung"
              secondary="Zusätzliche Sicherheitsebene hinzufügen (Demnächst verfügbar)"
            />
          <Switch disabled />
        </ListItem>
      </List>
      </Paper>

      <Paper sx={{ mt: 3 }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Über TaskFlow Plattform
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Version:</strong> 1.0.0
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Entwickler:</strong> Martin Pfeffer
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              <strong>Lizenz:</strong> MIT-Lizenz
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              <strong>Copyright:</strong> © 2026 Martin Pfeffer
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Link
              href="https://github.com/pepperonas/taskflow-platform"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <GitHubIcon fontSize="small" />
              <Typography variant="body2">GitHub Repository</Typography>
            </Link>
            <Link
              href="https://celox.io"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              <CodeIcon fontSize="small" />
              <Typography variant="body2">celox.io</Typography>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SettingsPage;
