import React from 'react';
import { Box, Container, Typography, Link, Stack, Divider } from '@mui/material';
import { GitHub as GitHubIcon, Code as CodeIcon } from '@mui/icons-material';

const AppFooter: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 3,
        bgcolor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Box>
            <Typography variant="body2" color="text.secondary">
              © 2026 <strong>Martin Pfeffer</strong> | TaskFlow Platform
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Licensed under <strong>MIT License</strong>
            </Typography>
          </Box>
          <Stack direction="row" spacing={3} alignItems="center">
            <Link
              href="https://github.com/pepperonas/taskflow-platform"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <GitHubIcon fontSize="small" />
              <Typography variant="body2">GitHub</Typography>
            </Link>
            <Divider orientation="vertical" flexItem />
            <Link
              href="https://celox.io"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': {
                  color: 'primary.main',
                },
              }}
            >
              <CodeIcon fontSize="small" />
              <Typography variant="body2">celox.io</Typography>
            </Link>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
};

export default AppFooter;
