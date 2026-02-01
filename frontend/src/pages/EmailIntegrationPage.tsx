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
} from '@mui/material';
import { 
  Email as EmailIcon, 
  Check as CheckIcon,
  Send as SendIcon 
} from '@mui/icons-material';
import axiosInstance from '../api/axios';

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
      title: 'Aufgabe abgeschlossen',
      subject: 'Aufgabe {{ $trigger.task.name }} abgeschlossen',
      body: `Hallo {{ $trigger.user.name }},

Deine Aufgabe "{{ $trigger.task.name }}" wurde abgeschlossen.

Status: {{ $trigger.task.status }}
Abgeschlossen am: {{ $trigger.task.completedAt }}

Aufgabe ansehen: {{ $trigger.task.url }}

Mit freundlichen Grüßen,
TaskFlow Plattform`,
      description: 'Benutzer benachrichtigen, wenn eine Aufgabe abgeschlossen ist',
    },
    {
      title: 'Workflow-Warnung',
      subject: 'Workflow-Ausführungswarnung',
      body: `Warnung: {{ $trigger.workflow.name }}

Der Workflow "{{ $trigger.workflow.name }}" ist auf ein Problem gestoßen.

Fehler: {{ $trigger.error.message }}
Zeit: {{ $now() }}

Bitte überprüfe die Workflow-Ausführung.

TaskFlow Plattform`,
      description: 'Warnungen bei Workflow-Fehlern senden',
    },
    {
      title: 'Willkommens-E-Mail',
      subject: 'Willkommen bei TaskFlow Plattform',
      body: `Hallo {{ $trigger.user.name }},

Willkommen bei TaskFlow Plattform! Wir freuen uns, dich an Bord zu haben.

Dein Konto wurde erfolgreich erstellt.
E-Mail: {{ $trigger.user.email }}

Starte mit der Erstellung deines ersten Workflows.

Mit freundlichen Grüßen,
TaskFlow Team`,
      description: 'Neue Benutzer begrüßen',
    },
  ];

  const handleSendTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log('Sending email request:', {
        to: formData.to,
        subject: formData.subject,
        body: formData.body,
      });
      
      const response = await axiosInstance.post('/v1/email/send', {
        to: formData.to,
        subject: formData.subject,
        body: formData.body,
        from: 'martin.pfeffer@celox.io',
        triggerData: {}
      });
      
      console.log('Email response:', response);
      console.log('Email response data:', response.data);
      console.log('Email response status:', response.status);

      if (response.data && response.data.success) {
        setResult({
          success: true,
          messageId: `msg-${Date.now()}`,
          sentAt: new Date().toISOString(),
          to: response.data.to,
          subject: response.data.subject,
          executionTime: response.data.executionTimeMs,
        });
      } else {
        const errorMsg = response.data?.error || response.data?.message || 'Failed to send email';
        console.error('Email sending failed:', errorMsg);
        setError(errorMsg);
      }
    } catch (err: any) {
      console.error('Email sending error:', err);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // Check if it's a network error
      if (!err.response) {
        setError('Network error: Unable to connect to server. Please check your connection.');
        return;
      }
      
      // Check if it's an authentication error
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError('Authentication required. Please log in and try again.');
        return;
      }
      
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          err.message || 
                          'Failed to send email';
      setError(errorMessage);
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
          label="E-Mail-Benachrichtigungen"
          sx={{ mb: 2, bgcolor: '#fa709a', color: 'white' }}
        />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          E-Mail-Node
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Sende automatisierte E-Mails mit dynamischen Vorlagen. Perfekt für Benachrichtigungen, Warnungen und Benutzerkommunikation.
          Unterstützt HTML-Vorlagen, Anhänge und Variablen-Interpolation.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/workflows/new')}
          sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
        >
          E-Mail-Workflow erstellen
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Email Form */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              E-Mail erstellen
            </Typography>
            <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>
              Verwende <code>{'{{ $trigger.field }}'}</code> oder <code>{'{{ $vars.name }}'}</code> für dynamische Inhalte
            </Alert>
            <TextField
              fullWidth
              label="An"
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Betreff"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={10}
              label="Inhalt"
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
              onClick={() => {
                console.log('Button clicked!');
                handleSendTest();
              }}
              disabled={loading}
              sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' }}
            >
              Test-E-Mail senden
            </Button>
          </Paper>
        </Grid>

        {/* Results */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Sende-Ergebnis
            </Typography>
            {loading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" sx={{ mt: 2 }}>
                  E-Mail wird gesendet...
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
                  E-Mail erfolgreich gesendet!
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
                  Erstelle eine E-Mail und klicke "Test-E-Mail senden" um das Ergebnis zu sehen
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Templates */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              E-Mail-Vorlagen
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
                        Vorlage verwenden
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
              Funktionen
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    HTML-Unterstützung
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Reichhaltige HTML-E-Mail-Vorlagen
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Variablen-Interpolation
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Dynamische Inhalte mit {'{{ }}'} Syntax
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Anhänge
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Dateien aus Workflow-Daten anhängen
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CheckIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    SMTP-Konfiguration
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Eigenen SMTP-Server verwenden
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
