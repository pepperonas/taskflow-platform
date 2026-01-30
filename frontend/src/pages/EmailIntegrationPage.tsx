import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { 
  PlayArrow as PlayIcon, 
  Email as EmailIcon, 
  Check as CheckIcon,
  Send as SendIcon 
} from '@mui/icons-material';

const EmailIntegrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    to: 'user@example.com',
    subject: 'Workflow Notification',
    body: 'Hello {{ $trigger.user.name }},\n\nYour workflow has been completed successfully.\n\nBest regards,\nTaskFlow Platform',
  });

  const templates = [
    {
      title: 'Task Completion',
      subject: 'Task {{ $trigger.task.name }} Completed',
      body: `Hello {{ $trigger.user.name }},

Your task "{{ $trigger.task.name }}" has been completed.

Status: {{ $trigger.task.status }}
Completed at: {{ $trigger.task.completedAt }}

View task: {{ $trigger.task.url }}

Best regards,
TaskFlow Platform`,
      description: 'Notify users when a task is completed',
    },
    {
      title: 'Workflow Alert',
      subject: 'Workflow Execution Alert',
      body: `Alert: {{ $trigger.workflow.name }}

The workflow "{{ $trigger.workflow.name }}" has encountered an issue.

Error: {{ $trigger.error.message }}
Time: {{ $now() }}

Please review the workflow execution.

TaskFlow Platform`,
      description: 'Send alerts for workflow errors',
    },
    {
      title: 'Welcome Email',
      subject: 'Welcome to TaskFlow Platform',
      body: `Hello {{ $trigger.user.name }},

Welcome to TaskFlow Platform! We're excited to have you on board.

Your account has been successfully created.
Email: {{ $trigger.user.email }}

Get started by creating your first workflow.

Best regards,
TaskFlow Team`,
      description: 'Welcome new users',
    },
  ];

  const handleSendTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Simulate email sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setResult({
        success: true,
        messageId: `msg-${Date.now()}`,
        sentAt: new Date().toISOString(),
        to: formData.to,
        subject: formData.subject,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to send email');
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = (template: typeof templates[0]) => {
    setFormData({
      to: 'user@example.com',
      subject: template.subject,
      body: template.body,
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Chip
          icon={<EmailIcon />}
          label="Email Notifications"
          sx={{ mb: 2, bgcolor: '#fa709a', color: 'white' }}
        />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Email Node
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Send automated emails with dynamic templates. Perfect for notifications, alerts, and user communications.
          Supports HTML templates, attachments, and variable interpolation.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/workflows/new')}
          sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
        >
          Create Email Workflow
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Email Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Compose Email
            </Typography>
            <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>
              Use <code>{'{{ $trigger.field }}'}</code> or <code>{'{{ $vars.name }}'}</code> for dynamic content
            </Alert>
            <TextField
              fullWidth
              label="To"
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={10}
              label="Body"
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              sx={{
                mb: 2,
                '& .MuiInputBase-input': {
                  fontFamily: 'monospace',
                  fontSize: '13px',
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSendTest}
              disabled={loading}
              sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
            >
              Send Test Email
            </Button>
          </Paper>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Send Result
            </Typography>
            {loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Sending email...
                </Typography>
              </Box>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {result && (
              <>
                <Alert severity="success" icon={<CheckIcon />} sx={{ mb: 2 }}>
                  Email sent successfully!
                </Alert>
                <Box
                  sx={{
                    bgcolor: '#1e1e1e',
                    color: '#d4d4d4',
                    p: 2,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    overflow: 'auto',
                  }}
                >
                  <pre>{JSON.stringify(result, null, 2)}</pre>
                </Box>
              </>
            )}
            {!loading && !result && !error && (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 6,
                  color: 'text.secondary',
                }}
              >
                <EmailIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
                <Typography variant="body2">
                  Compose an email and click "Send Test Email" to see the result
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Templates */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Email Templates
            </Typography>
            <Grid container spacing={2}>
              {templates.map((template, idx) => (
                <Grid item xs={12} md={4} key={idx}>
                  <Card sx={{ border: '1px solid #e5e7eb', height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {template.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {template.description}
                      </Typography>
                      <Box
                        sx={{
                          bgcolor: '#f5f7fa',
                          p: 1,
                          borderRadius: 1,
                          fontFamily: 'monospace',
                          fontSize: '11px',
                          mb: 2,
                          maxHeight: '150px',
                          overflow: 'auto',
                        }}
                      >
                        <div style={{ whiteSpace: 'pre-wrap' }}>{template.body.substring(0, 100)}...</div>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleUseTemplate(template)}
                        fullWidth
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Features */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Features
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    HTML Support
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rich HTML email templates
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Variable Interpolation
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Dynamic content with {'{{ }}'} syntax
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Attachments
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Attach files from workflow data
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    SMTP Configuration
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Use your own SMTP server
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EmailIntegrationPage;
