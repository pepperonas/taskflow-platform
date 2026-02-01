import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Tabs,
  Tab,
  Divider,
  Link,
} from '@mui/material';
import {
  AccountTree as WorkflowIcon,
  Http as HttpIcon,
  Code as CodeIcon,
  Email as EmailIcon,
  Storage as DatabaseIcon,
  VpnKey as CredentialsIcon,
  PlayArrow as PlayIcon,
  CheckCircle as CheckIcon,
  AutoAwesome as AutoAwesomeIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Extension as ExtensionIcon,
  Bolt as BoltIcon,
  Api as ApiIcon,
  Description as DocsIcon,
  GitHub as GitHubIcon,
  Cloud as CloudIcon,
  Storage as StorageIcon,
  Web as WebIcon,
  Science as TestIcon,
  BugReport as BugIcon,
  Verified as VerifiedIcon,
  Timeline as TimelineIcon,
  Memory as MemoryIcon,
} from '@mui/icons-material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ShowcasePage: React.FC = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const features = [
    {
      icon: <WorkflowIcon sx={{ fontSize: 40 }} />,
      title: 'Visueller Workflow-Builder',
      description: 'Drag-and-Drop Workflow-Editor mit Echtzeit-Ausführung',
      color: '#667eea',
      path: '/workflows/new',
      demo: 'workflow',
    },
    {
      icon: <HttpIcon sx={{ fontSize: 40 }} />,
      title: 'HTTP-Request-Node',
      description: 'Beliebige REST-APIs mit benutzerdefinierten Headern und Authentifizierung aufrufen',
      color: '#f093fb',
      path: '/integrations/http',
      demo: 'http',
    },
    {
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      title: 'JavaScript Code-Ausführung',
      description: 'Eigenen JavaScript-Code in einer Sandbox-Umgebung ausführen',
      color: '#4facfe',
      path: '/integrations/code',
      demo: 'code',
    },
    {
      icon: <DatabaseIcon sx={{ fontSize: 40 }} />,
      title: 'Datenbank-Integration',
      description: 'SQL-Abfragen ausführen und Daten verwalten',
      color: '#43e97b',
      path: '/integrations/database',
      demo: 'database',
    },
    {
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      title: 'E-Mail-Benachrichtigungen',
      description: 'Automatisierte E-Mails mit Vorlagen senden',
      color: '#fa709a',
      path: '/integrations/email',
      demo: 'email',
    },
    {
      icon: <CredentialsIcon sx={{ fontSize: 40 }} />,
      title: 'Sichere Zugangsdaten',
      description: 'AES-256 verschlüsselte Credential-Speicherung',
      color: '#30cfd0',
      path: '/credentials',
      demo: 'credentials',
    },
  ];

  const stats = [
    { label: 'Node-Typen', value: '8+', icon: <ExtensionIcon /> },
    { label: 'Ausführungszeit', value: '<100ms', icon: <SpeedIcon /> },
    { label: 'Sicherheit', value: 'AES-256', icon: <SecurityIcon /> },
    { label: 'Integrationen', value: 'Unbegrenzt', icon: <BoltIcon /> },
  ];

  const useCases = [
    {
      title: 'API-Integrations-Workflow',
      description: 'Daten von externen APIs abrufen, transformieren und automatisch Tasks erstellen',
      steps: ['HTTP-Request-Node', 'Code-Node (Transformation)', 'Task-Erstellen-Node'],
    },
    {
      title: 'Automatisierte E-Mail-Berichte',
      description: 'Datenbank abfragen, Bericht generieren und an Stakeholder per E-Mail senden',
      steps: ['Datenbank-Abfrage', 'Code-Node (Formatierung)', 'E-Mail-Node'],
    },
    {
      title: 'Mehrstufiger Genehmigungsprozess',
      description: 'Task erstellen, auf Genehmigung warten, Aktion basierend auf Entscheidung ausführen',
      steps: ['Task erstellen', 'Bedingungs-Node', 'HTTP-Request / E-Mail'],
    },
  ];

  const demoWorkflows = {
    workflow: {
      title: 'Workflow erstellen',
      description: 'Komplexe Automatisierungs-Workflows mit unserem visuellen Editor erstellen',
      steps: [
        'Trigger-Node hinzufügen, um den Workflow zu starten',
        'HTTP-Request-Node verbinden, um externe APIs aufzurufen',
        'Code-Node verwenden, um die Antwort zu transformieren',
        'Task-Erstellen-Node hinzufügen, um Ergebnisse zu speichern',
        'Ausführen und Live-Ergebnisse sehen',
      ],
    },
    http: {
      title: 'HTTP-Request Demo',
      description: 'Beliebige REST-APIs mit Authentifizierung und benutzerdefinierten Headern aufrufen',
      code: `{
  "method": "GET",
  "url": "https://api.github.com/users/github",
  "headers": {
    "Accept": "application/json"
  }
}`,
    },
    code: {
      title: 'JavaScript-Ausführung Demo',
      description: 'Eigenen JavaScript-Code mit Zugriff auf den Workflow-Kontext ausführen',
      code: `// Trigger-Daten abrufen
const userData = $trigger.data;

// Daten transformieren
const result = {
  fullName: \`\${userData.firstName} \${userData.lastName}\`,
  email: userData.email.toLowerCase(),
  createdAt: $now()
};

// Ergebnis zurückgeben
return result;`,
    },
  };

  const techStack = {
    backend: [
      { name: 'Java 17', description: 'Modernes Java mit neuesten Features' },
      { name: 'Spring Boot 3.2.1', description: 'Enterprise-Framework' },
      { name: 'Apache Kafka', description: 'Event-getriebenes Messaging' },
      { name: 'PostgreSQL 15', description: 'Zuverlässige relationale Datenbank' },
      { name: 'Spring Data JPA', description: 'Datenzugriffsschicht' },
      { name: 'Spring Security', description: 'JWT-Authentifizierung & -Autorisierung' },
      { name: 'Liquibase', description: 'Datenbank-Migrationen' },
      { name: 'OpenAPI 3.0', description: 'API-Dokumentation' },
    ],
    frontend: [
      { name: 'React 18', description: 'Moderne UI-Bibliothek' },
      { name: 'TypeScript 5.3', description: 'Typsicheres JavaScript' },
      { name: 'Redux Toolkit', description: 'State-Management' },
      { name: 'Material-UI (MUI)', description: 'Komponenten-Bibliothek' },
      { name: 'React Flow', description: 'Workflow-Visualisierung' },
      { name: 'Axios', description: 'HTTP-Client' },
      { name: 'Recharts', description: 'Daten-Visualisierung' },
    ],
    devops: [
      { name: 'Docker', description: 'Containerisierung' },
      { name: 'Docker Compose', description: 'Multi-Container-Orchestrierung' },
      { name: 'Nginx', description: 'Reverse Proxy & Load Balancing' },
      { name: 'GitHub Actions', description: 'CI/CD-Pipeline' },
      { name: 'Maven', description: 'Build-Management' },
    ],
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            icon={<AutoAwesomeIcon />}
            label="Interaktive Übersicht"
            sx={{
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              mb: 2,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            TaskFlow Plattform
          </Typography>
          <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4, maxWidth: 800, mx: 'auto' }}>
            Workflow-Automatisierungsplattform der nächsten Generation mit visuellem Editor, Code-Ausführung und leistungsstarken Integrationen
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<PlayIcon />}
              onClick={() => navigate('/workflows/new')}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                px: 4,
                py: 1.5,
              }}
            >
              Workflow-Editor testen
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setTabValue(1)}
              sx={{ px: 4, py: 1.5 }}
            >
              Demos ansehen
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<ApiIcon />}
              href="https://taskflow.celox.io/api"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ px: 4, py: 1.5 }}
            >
              Backend-API
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<DocsIcon />}
              href="https://taskflow.celox.io/swagger-ui.html"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ px: 4, py: 1.5 }}
            >
              Swagger UI
            </Button>
          </Box>
        </Box>

        {/* Project Overview */}
        <Paper sx={{ p: 4, mb: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)' }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
            Über TaskFlow Plattform
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                Was ist TaskFlow?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                TaskFlow ist eine moderne, event-getriebene Aufgabenverwaltungs- und Workflow-Automatisierungsplattform. 
                Sie kombiniert die Stärke des visuellen Workflow-Editors mit Code-Ausführung, Datenbank-Integration 
                und API-Anbindung zu einer umfassenden Automatisierungslösung.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Mit Enterprise-Technologien gebaut, bietet TaskFlow eine skalierbare, sichere und 
                benutzerfreundliche Plattform zur Automatisierung von Geschäftsprozessen, Aufgabenverwaltung 
                und Integration mit externen Systemen.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                Hauptfunktionen
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <WorkflowIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Visueller Workflow-Builder"
                    secondary="Drag-and-Drop-Oberfläche zum Erstellen komplexer Automatisierungs-Workflows"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CodeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Code-Ausführung"
                    secondary="JavaScript-Code in einer sicheren Sandbox-Umgebung ausführen"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DatabaseIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Datenbank-Integration"
                    secondary="SQL-Abfragen mit integriertem Sicherheitsschutz ausführen"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="E-Mail-Automatisierung"
                    secondary="Automatisierte E-Mails mit HTML-Vorlagen senden"
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </Paper>

        {/* API & Documentation Links */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ApiIcon sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Backend-API
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  Zugriff auf die RESTful-API-Endpunkte für Tasks, Workflows, Credentials und mehr.
                  Alle Endpunkte sind mit JWT-Authentifizierung gesichert.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  href="https://taskflow.celox.io/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  API erkunden
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                color: 'white',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <DocsIcon sx={{ fontSize: 40, mr: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Swagger UI
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  Interaktive API-Dokumentation mit OpenAPI 3.0. Endpunkte direkt 
                  im Browser mit integrierter Authentifizierungsunterstützung testen.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  href="https://taskflow.celox.io/swagger-ui.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  Swagger UI öffnen
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Stats */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.label}>
              <Paper
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
                  border: '1px solid #e5e7eb',
                }}
              >
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    bgcolor: 'primary.main',
                    mx: 'auto',
                    mb: 2,
                  }}
                >
                  {stat.icon}
                </Avatar>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Tabs */}
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ 
              borderBottom: 1, 
              borderColor: 'divider',
              '& .MuiTab-root': {
                minWidth: 120,
                fontWeight: 600,
              }
            }}
          >
            <Tab label="Funktionen" />
            <Tab label="Interaktive Demos" />
            <Tab label="Anwendungsfälle" />
            <Tab label="Tests & CI/CD" />
            <Tab label="Technologien & Architektur" />
          </Tabs>

          {/* Tab 1: Features */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {features.map((feature, idx) => (
                <Grid item xs={12} sm={6} md={4} key={idx}>
                  <Card
                    sx={{
                      height: '100%',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                      },
                    }}
                    onClick={() => navigate(feature.path)}
                  >
                    <CardContent>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: 2,
                          background: `linear-gradient(135deg, ${feature.color}, ${feature.color}88)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          mb: 2,
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {feature.description}
                      </Typography>
                      <Button
                        size="small"
                        endIcon={<PlayIcon />}
                        sx={{ color: feature.color }}
                      >
                        Jetzt testen
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Tab 2: Interactive Demos */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    <HttpIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    HTTP-Request Demo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Beliebige REST-APIs mit Authentifizierung und benutzerdefinierten Headern aufrufen
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: '#1e1e1e',
                      color: '#d4d4d4',
                      p: 2,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      overflow: 'auto',
                      mb: 2,
                    }}
                  >
                    <pre>{demoWorkflows.http.code}</pre>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/workflows/new')}
                  >
                    HTTP-Request-Workflow erstellen
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    <CodeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    JavaScript-Ausführung Demo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Eigenen JavaScript-Code mit Zugriff auf den Workflow-Kontext ausführen
                  </Typography>
                  <Box
                    sx={{
                      bgcolor: '#1e1e1e',
                      color: '#d4d4d4',
                      p: 2,
                      borderRadius: 1,
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      overflow: 'auto',
                      mb: 2,
                    }}
                  >
                    <pre>{demoWorkflows.code.code}</pre>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={() => navigate('/workflows/new')}
                  >
                    Code-Workflow erstellen
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info">
                  <strong>Probiere es selbst aus!</strong> Klicke auf einen "Workflow erstellen"-Button, um den visuellen Workflow-Editor zu öffnen und deine Automatisierung zu erstellen.
                </Alert>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Tab 3: Use Cases */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {useCases.map((useCase, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {useCase.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {useCase.description}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, color: 'primary.main' }}>
                        WORKFLOW-SCHRITTE:
                      </Typography>
                      <Stepper orientation="vertical" sx={{ mt: 1 }}>
                        {useCase.steps.map((step, stepIdx) => (
                          <Step key={stepIdx} active completed>
                            <StepLabel
                              StepIconComponent={() => (
                                <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
                              )}
                            >
                              <Typography variant="body2">{step}</Typography>
                            </StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          {/* Tab 4: Tests & CI/CD */}
          <TabPanel value={tabValue} index={3}>
            {/* GitHub Actions Badge */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Link
                href="https://github.com/pepperonas/taskflow-platform/actions/workflows/tests.yml"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://github.com/pepperonas/taskflow-platform/actions/workflows/tests.yml/badge.svg"
                  alt="Tests"
                  style={{ height: 28 }}
                />
              </Link>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Automatisierte Tests werden bei jedem Push auf GitHub ausgeführt
              </Typography>
            </Box>

            {/* Test Overview */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              {/* Backend Tests */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TestIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Backend Tests
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                    Unit- und Controller-Tests für die Java/Spring Boot Anwendung
                  </Typography>
                  <List sx={{ '& .MuiListItemIcon-root': { color: 'white', minWidth: 36 } }}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon><CheckIcon /></ListItemIcon>
                      <ListItemText primary="JUnit 5" secondary={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Test-Framework</span>} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon><CheckIcon /></ListItemIcon>
                      <ListItemText primary="Mockito" secondary={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Mock-Framework</span>} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon><CheckIcon /></ListItemIcon>
                      <ListItemText primary="Spring Test" secondary={<span style={{ color: 'rgba(255,255,255,0.7)' }}>MockMvc für Controller</span>} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon><CheckIcon /></ListItemIcon>
                      <ListItemText primary="Testcontainers" secondary={<span style={{ color: 'rgba(255,255,255,0.7)' }}>PostgreSQL Container</span>} />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              {/* Frontend Tests */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                    color: 'white',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <MemoryIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Frontend Tests
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                    Component- und Unit-Tests für die React/TypeScript Anwendung
                  </Typography>
                  <List sx={{ '& .MuiListItemIcon-root': { color: 'white', minWidth: 36 } }}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon><CheckIcon /></ListItemIcon>
                      <ListItemText primary="Jest" secondary={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Test-Runner</span>} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon><CheckIcon /></ListItemIcon>
                      <ListItemText primary="React Testing Library" secondary={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Component-Tests</span>} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon><CheckIcon /></ListItemIcon>
                      <ListItemText primary="Redux Slice Tests" secondary={<span style={{ color: 'rgba(255,255,255,0.7)' }}>State-Management</span>} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon><CheckIcon /></ListItemIcon>
                      <ListItemText primary="Coverage Reports" secondary={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Code-Abdeckung</span>} />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>

              {/* E2E Tests */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    height: '100%',
                    background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                    color: 'white',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BugIcon sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      E2E Tests
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
                    End-to-End Tests simulieren echte Benutzerinteraktionen
                  </Typography>
                  <List sx={{ '& .MuiListItemIcon-root': { color: 'white', minWidth: 36 } }}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon><CheckIcon /></ListItemIcon>
                      <ListItemText primary="Playwright" secondary={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Browser-Automatisierung</span>} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon><CheckIcon /></ListItemIcon>
                      <ListItemText primary="Login/Logout Flow" secondary={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Authentifizierung</span>} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon><CheckIcon /></ListItemIcon>
                      <ListItemText primary="Task CRUD" secondary={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Aufgaben-Verwaltung</span>} />
                    </ListItem>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon><CheckIcon /></ListItemIcon>
                      <ListItemText primary="Workflow Editor" secondary={<span style={{ color: 'rgba(255,255,255,0.7)' }}>Visual Editor Tests</span>} />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>

            {/* CI/CD Pipeline */}
            <Paper sx={{ p: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
                <TimelineIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                CI/CD Pipeline mit GitHub Actions
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
                Automatisierte Tests und Deployments gewährleisten konstante Code-Qualität
              </Typography>

              {/* Pipeline Steps */}
              <Stepper orientation="vertical" sx={{ maxWidth: 700, mx: 'auto' }}>
                <Step active completed>
                  <StepLabel
                    StepIconComponent={() => (
                      <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                        <GitHubIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                    )}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Code Push / Pull Request
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Entwickler pusht Code zu GitHub oder erstellt einen Pull Request
                    </Typography>
                  </StepLabel>
                </Step>
                <Step active completed>
                  <StepLabel
                    StepIconComponent={() => (
                      <Avatar sx={{ bgcolor: '#667eea', width: 36, height: 36 }}>
                        <TestIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                    )}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Backend Tests (JUnit 5 + Mockito)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Unit-Tests für Controller, Services und DTOs mit PostgreSQL-Testcontainer
                    </Typography>
                  </StepLabel>
                </Step>
                <Step active completed>
                  <StepLabel
                    StepIconComponent={() => (
                      <Avatar sx={{ bgcolor: '#43e97b', width: 36, height: 36 }}>
                        <MemoryIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                    )}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Frontend Tests (Jest + React Testing Library)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Component-Tests, Redux-Slice-Tests und Coverage-Report-Generierung
                    </Typography>
                  </StepLabel>
                </Step>
                <Step active completed>
                  <StepLabel
                    StepIconComponent={() => (
                      <Avatar sx={{ bgcolor: '#fa709a', width: 36, height: 36 }}>
                        <BugIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                    )}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      E2E Tests (Playwright)
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Browser-Automatisierung testet echte Benutzer-Flows mit PostgreSQL und Kafka
                    </Typography>
                  </StepLabel>
                </Step>
                <Step active completed>
                  <StepLabel
                    StepIconComponent={() => (
                      <Avatar sx={{ bgcolor: 'success.main', width: 36, height: 36 }}>
                        <VerifiedIcon sx={{ fontSize: 20 }} />
                      </Avatar>
                    )}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Build erfolgreich
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Alle Tests bestanden - Code kann deployed werden
                    </Typography>
                  </StepLabel>
                </Step>
              </Stepper>

              {/* Test Commands */}
              <Box sx={{ mt: 4, p: 3, bgcolor: '#1e1e1e', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#4fc3f7', mb: 2 }}>
                  Tests lokal ausführen:
                </Typography>
                <Box sx={{ fontFamily: 'monospace', fontSize: '13px', color: '#d4d4d4' }}>
                  <Typography sx={{ color: '#608b4e', mb: 1 }}># Backend Tests</Typography>
                  <Typography sx={{ mb: 2 }}>cd backend && mvn test</Typography>
                  <Typography sx={{ color: '#608b4e', mb: 1 }}># Frontend Tests</Typography>
                  <Typography sx={{ mb: 2 }}>cd frontend && npm test</Typography>
                  <Typography sx={{ color: '#608b4e', mb: 1 }}># E2E Tests</Typography>
                  <Typography>cd frontend && npx playwright test</Typography>
                </Box>
              </Box>

              {/* GitHub Link */}
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<GitHubIcon />}
                  href="https://github.com/pepperonas/taskflow-platform/actions"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    px: 4,
                    py: 1.5,
                  }}
                >
                  GitHub Actions ansehen
                </Button>
              </Box>
            </Paper>
          </TabPanel>

          {/* Tab 5: Technologies & Architecture */}
          <TabPanel value={tabValue} index={4}>
            {/* Technologies Section */}
            <Grid container spacing={4} sx={{ mb: 4 }}>
              {/* Backend Technologies */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <CloudIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Backend
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Die Server-Seite der Anwendung - verarbeitet Anfragen, speichert Daten und führt Workflows aus.
                  </Typography>
                  <List>
                    {techStack.backend.map((tech, idx) => (
                      <ListItem key={idx} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={tech.name}
                          secondary={tech.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>

              {/* Frontend Technologies */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <WebIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      Frontend
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Die Benutzeroberfläche - das, was Sie im Browser sehen und mit dem Sie interagieren.
                  </Typography>
                  <List>
                    {techStack.frontend.map((tech, idx) => (
                      <ListItem key={idx} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={tech.name}
                          secondary={tech.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>

              {/* DevOps Technologies */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <StorageIcon sx={{ fontSize: 32, mr: 1, color: 'primary.main' }} />
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                      DevOps
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Tools für Deployment, Containerisierung und Automatisierung der Software-Entwicklung.
                  </Typography>
                  <List>
                    {techStack.devops.map((tech, idx) => (
                      <ListItem key={idx} sx={{ px: 0 }}>
                        <ListItemIcon>
                          <CheckIcon color="success" />
                        </ListItemIcon>
                        <ListItemText
                          primary={tech.name}
                          secondary={tech.description}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            </Grid>

            {/* Architecture Section */}
            <Paper sx={{ p: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)' }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
                System-Architektur
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
                TaskFlow verwendet eine moderne, event-driven Architektur. Hier sehen Sie, wie die einzelnen Komponenten zusammenarbeiten.
              </Typography>

              {/* Visual Architecture Diagram */}
              <Box sx={{ mb: 4 }}>
                <Grid container spacing={3} sx={{ mb: 3 }}>
                  {/* Frontend Box */}
                  <Grid item xs={12} md={3}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        height: '100%',
                      }}
                    >
                      <WebIcon sx={{ fontSize: 48, mb: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        Frontend
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                        React 18 + TypeScript
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Die Benutzeroberfläche, die Sie im Browser sehen. Hier erstellen Sie Workflows, verwalten Tasks und sehen Ergebnisse.
                      </Typography>
                    </Paper>
                  </Grid>

                  {/* Arrow */}
                  <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'primary.main' }}>→</Typography>
                  </Grid>

                  {/* Task Service Box */}
                  <Grid item xs={12} md={3}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                        color: 'white',
                        height: '100%',
                      }}
                    >
                      <CloudIcon sx={{ fontSize: 48, mb: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        Task Service
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                        Spring Boot 3.2.1
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Der Hauptserver. Verarbeitet alle Anfragen, führt Workflows aus, verwaltet Tasks und authentifiziert Benutzer.
                      </Typography>
                    </Paper>
                  </Grid>

                  {/* Arrow */}
                  <Grid item xs={12} md={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h4" sx={{ color: 'primary.main' }}>→</Typography>
                  </Grid>

                  {/* Database Box */}
                  <Grid item xs={12} md={3}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                        color: 'white',
                        height: '100%',
                      }}
                    >
                      <StorageIcon sx={{ fontSize: 48, mb: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        PostgreSQL
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
                        Datenbank 15
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Speichert alle Daten: Tasks, Workflows, Benutzer, Credentials. Sicher und zuverlässig.
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                {/* Kafka Section */}
                <Box sx={{ textAlign: 'center', my: 4 }}>
                  <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                    Event-Streaming mit Apache Kafka
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                      <Paper
                        sx={{
                          p: 2,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          color: 'white',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          Task Service
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          Sendet Events (z.B. "Task erstellt", "Task abgeschlossen")
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
                          color: 'white',
                          textAlign: 'center',
                        }}
                      >
                        <BoltIcon sx={{ fontSize: 40, mb: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Apache Kafka
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          Event-Messaging System
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Paper
                        sx={{
                          p: 2,
                          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                          color: 'white',
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                          Notification Service
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.9 }}>
                          Empfängt Events und sendet Benachrichtigungen
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>

                {/* Architecture Explanation */}
                <Box sx={{ mt: 4, p: 3, bgcolor: '#eff6ff', borderRadius: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                    Wie funktioniert die Architektur? (Für Nicht-Techniker)
                  </Typography>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        1. Frontend (React)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Das ist die Webseite, die Sie im Browser sehen. Wenn Sie einen Workflow erstellen oder eine Task anlegen, 
                        sendet der Browser diese Information an den Server.
                      </Typography>

                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        2. Task Service (Spring Boot)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Der Server empfängt Ihre Anfrage, prüft ob Sie eingeloggt sind, führt den Workflow aus oder speichert 
                        die Task in der Datenbank. Er ist das "Gehirn" der Anwendung.
                      </Typography>

                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        3. PostgreSQL (Datenbank)
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Wie ein digitales Archiv. Hier werden alle Tasks, Workflows und Benutzerdaten sicher gespeichert. 
                        Wenn Sie später etwas ansehen, holt der Server die Daten aus der Datenbank.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        4. Apache Kafka (Event-Streaming)
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Stellen Sie sich Kafka wie ein Postsystem vor: Wenn etwas Wichtiges passiert (z.B. eine Task wird 
                        abgeschlossen), sendet der Task Service eine "Nachricht" an Kafka. Andere Services können diese 
                        Nachrichten empfangen und darauf reagieren.
                      </Typography>

                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        5. Notification Service
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Ein separater Service, der auf Events von Kafka "hört". Wenn eine Task abgeschlossen wird, 
                        kann dieser Service automatisch eine E-Mail senden oder eine Benachrichtigung erstellen.
                      </Typography>

                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                        Warum diese Architektur?
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Skalierbarkeit:</strong> Jede Komponente kann unabhängig erweitert werden.<br/>
                        <strong>Zuverlässigkeit:</strong> Wenn ein Service ausfällt, funktionieren die anderen weiter.<br/>
                        <strong>Flexibilität:</strong> Neue Features können einfach hinzugefügt werden.
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                {/* Data Flow Diagram */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, textAlign: 'center' }}>
                    Datenfluss: Was passiert, wenn Sie einen Workflow ausführen?
                  </Typography>
                  <Stepper orientation="vertical" sx={{ maxWidth: 600, mx: 'auto' }}>
                    <Step active completed>
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <Typography variant="body2" sx={{ color: 'white' }}>1</Typography>
                          </Avatar>
                        )}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Sie klicken auf "Execute" im Frontend
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Der Browser sendet eine Anfrage an den Task Service
                        </Typography>
                      </StepLabel>
                    </Step>
                    <Step active completed>
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <Typography variant="body2" sx={{ color: 'white' }}>2</Typography>
                          </Avatar>
                        )}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Task Service authentifiziert Sie
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Prüft Ihr Login-Token und lädt den Workflow aus der Datenbank
                        </Typography>
                      </StepLabel>
                    </Step>
                    <Step active completed>
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <Typography variant="body2" sx={{ color: 'white' }}>3</Typography>
                          </Avatar>
                        )}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Workflow wird Schritt für Schritt ausgeführt
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Jeder Node (HTTP Request, Code, Email, etc.) wird nacheinander ausgeführt
                        </Typography>
                      </StepLabel>
                    </Step>
                    <Step active completed>
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <Typography variant="body2" sx={{ color: 'white' }}>4</Typography>
                          </Avatar>
                        )}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Events werden an Kafka gesendet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Wichtige Ereignisse (z.B. "Task erstellt") werden als Events gesendet
                        </Typography>
                      </StepLabel>
                    </Step>
                    <Step active completed>
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <Typography variant="body2" sx={{ color: 'white' }}>5</Typography>
                          </Avatar>
                        )}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Notification Service reagiert
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Empfängt Events von Kafka und sendet Benachrichtigungen
                        </Typography>
                      </StepLabel>
                    </Step>
                    <Step active completed>
                      <StepLabel
                        StepIconComponent={() => (
                          <Avatar sx={{ bgcolor: 'success.main' }}>
                            <CheckIcon sx={{ color: 'white' }} />
                          </Avatar>
                        )}
                      >
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Ergebnisse werden an das Frontend zurückgesendet
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Sie sehen die Ausführungsergebnisse in Echtzeit
                        </Typography>
                      </StepLabel>
                    </Step>
                  </Stepper>
                </Box>
              </Box>
            </Paper>
          </TabPanel>
        </Paper>

        {/* Quick Start Guide */}
        <Paper sx={{ p: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
            In 3 einfachen Schritten starten
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 2 }}>
                  <Typography variant="h4">1</Typography>
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1 }}>Workflow erstellen</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Öffne den visuellen Editor und ziehe Nodes auf die Arbeitsfläche
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 2 }}>
                  <Typography variant="h4">2</Typography>
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1 }}>Nodes konfigurieren</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  HTTP-Requests, Code-Logik und Task-Erstellung einrichten
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 2 }}>
                  <Typography variant="h4">3</Typography>
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1 }}>Ausführen & Überwachen</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Workflow ausführen und Echtzeit-Ergebnisse sehen
                </Typography>
              </Box>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/workflows/new')}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
                px: 4,
                py: 1.5,
                mr: 2,
              }}
            >
              Jetzt loslegen
            </Button>
            <Button
              variant="outlined"
              size="large"
              startIcon={<GitHubIcon />}
              href="https://github.com/pepperonas/taskflow-platform"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                px: 4,
                py: 1.5,
              }}
            >
              Auf GitHub ansehen
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ShowcasePage;
