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
  Chip,
  Alert,
  Divider,
} from '@mui/material';
import { PlayArrow as PlayIcon, Code as CodeIcon, Check as CheckIcon, Warning as WarningIcon } from '@mui/icons-material';

const CodeIntegrationPage: React.FC = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState(`// Access trigger data
const name = $trigger.name || 'World';
const timestamp = $now();

// Transform data
const result = {
  message: \`Hello, \${name}!\`,
  timestamp: timestamp,
  uppercase: name.toUpperCase(),
  length: name.length
};

// Return result
return result;`);
  const [result, setResult] = useState<string>('');

  const examples = [
    {
      title: 'Data Transformation',
      code: `const data = $trigger.users;

return data.map(user => ({
  id: user.id,
  fullName: \`\${user.firstName} \${user.lastName}\`,
  email: user.email.toLowerCase()
}));`,
      description: 'Transform array of user objects',
    },
    {
      title: 'Conditional Logic',
      code: `const score = $trigger.score;

if (score >= 90) {
  return { grade: 'A', passed: true };
} else if (score >= 80) {
  return { grade: 'B', passed: true };
} else if (score >= 70) {
  return { grade: 'C', passed: true };
} else {
  return { grade: 'F', passed: false };
}`,
      description: 'Calculate grade from score',
    },
    {
      title: 'Date Manipulation',
      code: `const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);

return {
  today: now.toISOString(),
  tomorrow: tomorrow.toISOString(),
  dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' })
};`,
      description: 'Work with dates and times',
    },
  ];

  const handleRunDemo = (demoCode: string) => {
    setCode(demoCode);
    // Simulate execution result
    setResult(`// This is a demo simulation
// In a real workflow, this code would execute in a sandboxed GraalVM environment

// Simulated output:
{
  "status": "success",
  "executionTime": "45ms",
  "output": "Results would appear here"
}`);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Chip
          icon={<CodeIcon />}
          label="Code Executor"
          sx={{ mb: 2, bgcolor: 'primary.main', color: 'white' }}
        />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          JavaScript Code Node
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Execute custom JavaScript code in a secure sandboxed environment. Perfect for data transformation,
          conditional logic, and custom business rules.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/workflows/new')}
          sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          Create Code Workflow
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Code Editor */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Try It Out
            </Typography>
            <Alert severity="info" sx={{ mb: 2, fontSize: '12px' }}>
              Available variables: <code>$trigger</code>, <code>$vars</code>, <code>$now()</code>, <code>$json()</code>, <code>$uuid()</code>
            </Alert>
            <TextField
              fullWidth
              multiline
              rows={16}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiInputBase-input': {
                  fontFamily: 'monospace',
                  fontSize: '13px',
                  bgcolor: '#1e1e1e',
                  color: '#d4d4d4',
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              startIcon={<PlayIcon />}
              onClick={() => handleRunDemo(code)}
            >
              Run in Workflow Editor
            </Button>
          </Paper>

          {result && (
            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Execution Result
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
                }}
              >
                <pre>{result}</pre>
              </Box>
            </Paper>
          )}
        </Grid>

        {/* Examples & Features */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Examples
            </Typography>
            {examples.map((example, idx) => (
              <Box key={idx} sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {example.title}
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => handleRunDemo(example.code)}
                  >
                    Try
                  </Button>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {example.description}
                </Typography>
                {idx < examples.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
          </Paper>

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Security Features
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
              <CheckIcon color="success" sx={{ mr: 1, mt: 0.5 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Sandboxed Execution
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Runs in isolated GraalVM context
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
              <CheckIcon color="success" sx={{ mr: 1, mt: 0.5 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  No File System Access
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Cannot read or write files
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'start', mb: 2 }}>
              <CheckIcon color="success" sx={{ mr: 1, mt: 0.5 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  No Network Access
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Cannot make external HTTP requests
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'start' }}>
              <CheckIcon color="success" sx={{ mr: 1, mt: 0.5 }} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Execution Timeout
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Maximum 5 seconds per execution
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Alert severity="warning" icon={<WarningIcon />}>
            <Typography variant="caption">
              <strong>Production Ready:</strong> All code executes in a secure, isolated environment with strict resource limits.
            </Typography>
          </Alert>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CodeIntegrationPage;
