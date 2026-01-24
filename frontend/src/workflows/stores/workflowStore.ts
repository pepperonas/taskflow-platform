import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import axios from 'axios';
import type { Node, Edge, Connection } from '@vue-flow/core';

export const useWorkflowStore = defineStore('workflow', () => {
  // State
  const currentWorkflowId = ref<string | null>(null);
  const workflowName = ref('Untitled Workflow');
  const workflowDescription = ref('');
  const nodes = ref<Node[]>([
    {
      id: 'trigger-1',
      type: 'trigger',
      position: { x: 250, y: 50 },
      data: { label: 'Manual Trigger' },
    },
  ]);
  const edges = ref<Edge[]>([]);
  const selectedNode = ref<Node | null>(null);
  const selectedEdge = ref<Edge | null>(null);

  // Computed
  const hasUnsavedChanges = computed(() => {
    return nodes.value.length > 1 || edges.value.length > 0;
  });

  // Actions
  function addNode(type: string, position?: { x: number; y: number }) {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position: position || { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: {
        label: type.charAt(0).toUpperCase() + type.slice(1),
      },
    };

    nodes.value.push(newNode);
    return newNode;
  }

  function removeNode(nodeId: string) {
    nodes.value = nodes.value.filter((n) => n.id !== nodeId);
    edges.value = edges.value.filter((e) => e.source !== nodeId && e.target !== nodeId);
    if (selectedNode.value?.id === nodeId) {
      selectedNode.value = null;
    }
  }

  function updateNodeData(nodeId: string, data: any) {
    const node = nodes.value.find((n) => n.id === nodeId);
    if (node) {
      node.data = { ...node.data, ...data };
    }
  }

  function selectNode(node: Node | null) {
    selectedNode.value = node;
    selectedEdge.value = null;
  }

  function onConnect(connection: Connection) {
    const edge: Edge = {
      id: `e${edges.value.length + 1}`,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle || undefined,
      targetHandle: connection.targetHandle || undefined,
    };
    edges.value.push(edge);
  }

  async function saveWorkflow() {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

      const payload = {
        name: workflowName.value,
        description: workflowDescription.value,
        nodesJson: JSON.stringify(nodes.value),
        edgesJson: JSON.stringify(edges.value),
      };

      if (currentWorkflowId.value) {
        // Update existing workflow
        const response = await axios.put(
          `${apiUrl}/v1/workflows/${currentWorkflowId.value}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        return response.data;
      } else {
        // Create new workflow
        const response = await axios.post(
          `${apiUrl}/v1/workflows?ownerId=${user.id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        currentWorkflowId.value = response.data.id;
        return response.data;
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      throw error;
    }
  }

  async function loadWorkflow(id: string) {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

      const response = await axios.get(`${apiUrl}/v1/workflows/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const workflow = response.data;
      currentWorkflowId.value = workflow.id;
      workflowName.value = workflow.name;
      workflowDescription.value = workflow.description;
      nodes.value = JSON.parse(workflow.nodesJson);
      edges.value = JSON.parse(workflow.edgesJson);

      return workflow;
    } catch (error) {
      console.error('Error loading workflow:', error);
      throw error;
    }
  }

  function resetWorkflow() {
    currentWorkflowId.value = null;
    workflowName.value = 'Untitled Workflow';
    workflowDescription.value = '';
    nodes.value = [
      {
        id: 'trigger-1',
        type: 'trigger',
        position: { x: 250, y: 50 },
        data: { label: 'Manual Trigger' },
      },
    ];
    edges.value = [];
    selectedNode.value = null;
    selectedEdge.value = null;
  }

  return {
    // State
    currentWorkflowId,
    workflowName,
    workflowDescription,
    nodes,
    edges,
    selectedNode,
    selectedEdge,

    // Computed
    hasUnsavedChanges,

    // Actions
    addNode,
    removeNode,
    updateNodeData,
    selectNode,
    onConnect,
    saveWorkflow,
    loadWorkflow,
    resetWorkflow,
  };
});
