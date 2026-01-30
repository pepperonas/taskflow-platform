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
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
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
          </Box>
        </Box>

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
            variant="fullWidth"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Features" />
            <Tab label="Interactive Demos" />
            <Tab label="Use Cases" />
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
              }}
            >
              Start Building Now
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ShowcasePage;
