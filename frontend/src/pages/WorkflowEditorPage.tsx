import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { mountWorkflowBuilder } from '../workflows/main';

const WorkflowEditorPage: React.FC = () => {
  const mountedRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[WorkflowEditorPage] Component mounted');
    console.log('[WorkflowEditorPage] mountWorkflowBuilder type:', typeof mountWorkflowBuilder);

    if (!mountedRef.current) {
      const timeoutId = setTimeout(() => {
        try {
          console.log('[WorkflowEditorPage] Starting Vue mount...');
          const element = document.getElementById('workflow-builder-root');

          if (!element) {
            throw new Error('workflow-builder-root element not found');
          }

          console.log('[WorkflowEditorPage] Element found:', element);
          mountWorkflowBuilder('workflow-builder-root');
          console.log('[WorkflowEditorPage] Vue app mounted successfully');

          mountedRef.current = true;
          setLoading(false);
        } catch (err: any) {
          console.error('[WorkflowEditorPage] Error mounting workflow builder:', err);
          console.error('[WorkflowEditorPage] Error stack:', err.stack);
          setError(err.message || 'Failed to load workflow builder');
          setLoading(false);
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, []);

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">
          <strong>Failed to load workflow builder:</strong> {error}
          <br />
          <small>Check browser console for details</small>
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', width: '100%', overflow: 'hidden', position: 'relative' }}>
      {loading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 9999,
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <div
        id="workflow-builder-root"
        style={{
          height: '100%',
          width: '100%',
          visibility: loading ? 'hidden' : 'visible'
        }}
      />
    </Box>
  );
};

export default WorkflowEditorPage;
