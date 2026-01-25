import { Node, Edge } from 'reactflow';

export interface WorkflowExport {
  version: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
}

export const exportWorkflow = (name: string, nodes: Node[], edges: Edge[]): void => {
  const workflowData: WorkflowExport = {
    version: '1.0',
    name,
    nodes,
    edges,
    createdAt: new Date().toISOString(),
  };

  const dataStr = JSON.stringify(workflowData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${name.replace(/\s+/g, '_')}_workflow.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importWorkflow = (
  file: File,
  onSuccess: (data: { name: string; nodes: Node[]; edges: Edge[] }) => void,
  onError: (error: string) => void
): void => {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const result = e.target?.result;
      if (typeof result !== 'string') {
        throw new Error('Invalid file content');
      }

      const data: WorkflowExport = JSON.parse(result);

      // Validate data structure
      if (!data.version || !data.name || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
        throw new Error('Invalid workflow file format');
      }

      onSuccess({
        name: data.name,
        nodes: data.nodes,
        edges: data.edges,
      });
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Failed to parse workflow file');
    }
  };

  reader.onerror = () => {
    onError('Failed to read file');
  };

  reader.readAsText(file);
};
