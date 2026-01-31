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
  Lock as LockIcon,
  Web as WebIcon,
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
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const features = [
    {
      icon: <WorkflowIcon sx={{ fontSize: 40 }} />,
      title: 'Visual Workflow Builder',
      description: 'Drag-and-drop workflow editor with real-time execution',
      color: '#667eea',
      path: '/workflows/new',
      demo: 'workflow',
    },
    {
      icon: <HttpIcon sx={{ fontSize: 40 }} />,
      title: 'HTTP Request Node',
      description: 'Call any REST API with custom headers and authentication',
      color: '#f093fb',
      path: '/integrations/http',
      demo: 'http',
    },
    {
      icon: <CodeIcon sx={{ fontSize: 40 }} />,
      title: 'JavaScript Code Executor',
      description: 'Run custom JavaScript in a sandboxed environment',
      color: '#4facfe',
      path: '/integrations/code',
      demo: 'code',
    },
    {
      icon: <DatabaseIcon sx={{ fontSize: 40 }} />,
      title: 'Database Integration',
      description: 'Execute SQL queries and manage data',
      color: '#43e97b',
      path: '/integrations/database',
      demo: 'database',
    },
    {
      icon: <EmailIcon sx={{ fontSize: 40 }} />,
      title: 'Email Notifications',
      description: 'Send automated emails with templates',
      color: '#fa709a',
      path: '/integrations/email',
      demo: 'email',
    },
    {
      icon: <CredentialsIcon sx={{ fontSize: 40 }} />,
      title: 'Secure Credentials',
      description: 'AES-256 encrypted credential storage',
      color: '#30cfd0',
      path: '/credentials',
      demo: 'credentials',
    },
  ];

  const stats = [
    { label: 'Node Types', value: '8+', icon: <ExtensionIcon /> },
    { label: 'Execution Speed', value: '<100ms', icon: <SpeedIcon /> },
    { label: 'Security', value: 'AES-256', icon: <SecurityIcon /> },
    { label: 'Integrations', value: 'Unlimited', icon: <BoltIcon /> },
  ];

  const useCases = [
    {
      title: 'API Integration Workflow',
      description: 'Fetch data from external APIs, transform it, and create tasks automatically',
      steps: ['HTTP Request Node', 'Code Node (Transform)', 'Create Task Node'],
    },
    {
      title: 'Automated Email Reports',
      description: 'Query database, generate report, and email to stakeholders',
      steps: ['Database Query', 'Code Node (Format)', 'Email Node'],
    },
    {
      title: 'Multi-step Approval Process',
      description: 'Create task, wait for approval, execute action based on decision',
      steps: ['Create Task', 'Condition Node', 'HTTP Request / Email'],
    },
  ];

  const demoWorkflows = {
    workflow: {
      title: 'Build a Workflow',
      description: 'Create complex automation workflows with our visual editor',
      steps: [
        'Add a Trigger node to start your workflow',
        'Connect HTTP Request node to call external APIs',
        'Use Code node to transform the response',
        'Add Create Task node to store results',
        'Execute and see live results',
      ],
    },
    http: {
      title: 'HTTP Request Demo',
      description: 'Call any REST API with authentication and custom headers',
      code: `{
  "method": "GET",
  "url": "https://api.github.com/users/github",
  "headers": {
    "Accept": "application/json"
  }
}`,
    },
    code: {
      title: 'JavaScript Executor Demo',
      description: 'Run custom JavaScript with access to workflow context',
      code: `// Access trigger data
const userData = $trigger.data;

// Transform data
const result = {
  fullName: \`\${userData.firstName} \${userData.lastName}\`,
  email: userData.email.toLowerCase(),
  createdAt: $now()
};

// Return result
return result;`,
    },
  };

  const techStack = {
    backend: [
      { name: 'Java 17', description: 'Modern Java with latest features' },
      { name: 'Spring Boot 3.2.1', description: 'Enterprise-grade framework' },
      { name: 'Apache Kafka', description: 'Event-driven messaging' },
      { name: 'PostgreSQL 15', description: 'Reliable relational database' },
      { name: 'Spring Data JPA', description: 'Data access layer' },
      { name: 'Spring Security', description: 'JWT authentication & authorization' },
      { name: 'Liquibase', description: 'Database migrations' },
      { name: 'OpenAPI 3.0', description: 'API documentation' },
    ],
    frontend: [
      { name: 'React 18', description: 'Modern UI library' },
      { name: 'TypeScript 5.3', description: 'Type-safe JavaScript' },
      { name: 'Redux Toolkit', description: 'State management' },
      { name: 'Material-UI (MUI)', description: 'Component library' },
      { name: 'React Flow', description: 'Workflow visualization' },
      { name: 'Axios', description: 'HTTP client' },
      { name: 'Recharts', description: 'Data visualization' },
    ],
    devops: [
      { name: 'Docker', description: 'Containerization' },
      { name: 'Docker Compose', description: 'Multi-container orchestration' },
      { name: 'Nginx', description: 'Reverse proxy & load balancing' },
      { name: 'GitHub Actions', description: 'CI/CD pipeline' },
      { name: 'Maven', description: 'Build management' },
    ],
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            icon={<AutoAwesomeIcon />}
            label="Interactive Showcase"
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
            TaskFlow Platform
          </Typography>
          <Typography variant="h5" sx={{ color: 'text.secondary', mb: 4, maxWidth: 800, mx: 'auto' }}>
            Next-generation workflow automation platform with visual editor, code execution, and powerful integrations
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
              Try Workflow Editor
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setTabValue(1)}
              sx={{ px: 4, py: 1.5 }}
            >
              View Demos
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
              Backend API
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
            About TaskFlow Platform
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                What is TaskFlow?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                TaskFlow is a modern, event-driven task management and workflow automation platform. 
                It combines the power of visual workflow editing with code execution, database integration, 
                and API connectivity to create a comprehensive automation solution.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Built with enterprise-grade technologies, TaskFlow provides a scalable, secure, and 
                user-friendly platform for automating business processes, managing tasks, and integrating 
                with external systems.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                Key Capabilities
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <WorkflowIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Visual Workflow Builder"
                    secondary="Drag-and-drop interface for creating complex automation workflows"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CodeIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Code Execution"
                    secondary="Run JavaScript code in a secure, sandboxed environment"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <DatabaseIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Database Integration"
                    secondary="Execute SQL queries with built-in security protection"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Email Automation"
                    secondary="Send automated emails with HTML templates"
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
                    Backend API
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  Access the RESTful API endpoints for tasks, workflows, credentials, and more.
                  All endpoints are secured with JWT authentication.
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
                  Explore API
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
                  Interactive API documentation with OpenAPI 3.0. Test endpoints directly 
                  from your browser with built-in authentication support.
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
                  Open Swagger UI
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
            <Tab label="Features" />
            <Tab label="Interactive Demos" />
            <Tab label="Use Cases" />
            <Tab label="Technologies & Architecture" />
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
                        Try Now
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
                    HTTP Request Demo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Call any REST API with authentication and custom headers
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
                    Create HTTP Request Workflow
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, height: '100%' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    <CodeIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                    JavaScript Executor Demo
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Run custom JavaScript with access to workflow context
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
                    Create Code Workflow
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12}>
                <Alert severity="info">
                  <strong>Try it yourself!</strong> Click on any "Create Workflow" button to open the visual workflow editor and start building your automation.
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
                        WORKFLOW STEPS:
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

          {/* Tab 4: Technologies & Architecture */}
          <TabPanel value={tabValue} index={3}>
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
            Get Started in 3 Simple Steps
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 2 }}>
                  <Typography variant="h4">1</Typography>
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1 }}>Create Workflow</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Open the visual editor and drag nodes onto the canvas
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 2 }}>
                  <Typography variant="h4">2</Typography>
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1 }}>Configure Nodes</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Set up HTTP requests, code logic, and task creation
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ width: 64, height: 64, bgcolor: 'rgba(255,255,255,0.2)', mx: 'auto', mb: 2 }}>
                  <Typography variant="h4">3</Typography>
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1 }}>Execute & Monitor</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Run your workflow and see real-time execution results
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
              Start Building Now
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
              View on GitHub
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ShowcasePage;
