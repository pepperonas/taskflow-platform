import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box } from '@mui/material';
import { mountWorkflowBuilder } from '../workflows/main';

const WorkflowEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!mountedRef.current) {
      try {
        mountWorkflowBuilder('workflow-builder-root');
        mountedRef.current = true;
      } catch (error) {
        console.error('Error mounting workflow builder:', error);
      }
    }

    // Cleanup is not needed as Vue app will be destroyed when React component unmounts
  }, []);

  return (
    <Box sx={{ height: '100vh', width: '100%', overflow: 'hidden' }}>
      <div id="workflow-builder-root" style={{ height: '100%', width: '100%' }} />
    </Box>
  );
};

export default WorkflowEditorPage;
