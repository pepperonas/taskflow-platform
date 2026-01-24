<template>
  <div class="workflow-builder">
    <!-- Top Toolbar -->
    <div class="top-toolbar">
      <div class="toolbar-left">
        <button class="toolbar-btn back-btn" @click="goBack">
          ← Back
        </button>
        <input
          v-model="workflowStore.workflowName"
          type="text"
          class="workflow-name-input"
          placeholder="Workflow Name"
        />
      </div>
      <div class="toolbar-right">
        <button class="toolbar-btn" @click="handleSave" :disabled="saving">
          {{ saving ? 'Saving...' : 'Save' }}
        </button>
        <button class="toolbar-btn primary-btn" @click="handleExecute" :disabled="!canExecute">
          ▶ Execute
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="builder-content">
      <!-- Left Panel - Tool Palette -->
      <ToolPanel />

      <!-- Center - VueFlow Canvas -->
      <div class="canvas-container" @drop="onDrop" @dragover.prevent @dragenter.prevent>
        <VueFlow
          v-model:nodes="workflowStore.nodes"
          v-model:edges="workflowStore.edges"
          @nodes-change="onNodesChange"
          @edges-change="onEdgesChange"
          @connect="workflowStore.onConnect"
          @node-click="onNodeClick"
          @pane-click="onPaneClick"
          :default-zoom="0.8"
          :min-zoom="0.2"
          :max-zoom="2"
          fit-view-on-init
        >
          <Background pattern-color="#e5e7eb" :gap="16" />
          <Controls />
          <MiniMap />

          <!-- Custom Node Templates -->
          <template #node-trigger="props">
            <TriggerNode v-bind="props" />
          </template>
          <template #node-createTask="props">
            <CreateTaskNode v-bind="props" />
          </template>
          <template #node-updateTask="props">
            <UpdateTaskNode v-bind="props" />
          </template>
          <template #node-condition="props">
            <ConditionNode v-bind="props" />
          </template>
          <template #node-delay="props">
            <DelayNode v-bind="props" />
          </template>
        </VueFlow>
      </div>

      <!-- Right Panel - Properties -->
      <PropertiesPanel />
    </div>

    <!-- Notifications -->
    <div v-if="notification" class="notification" :class="notification.type">
      {{ notification.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { VueFlow, useVueFlow } from '@vue-flow/core';
import { Background } from '@vue-flow/background';
import { Controls } from '@vue-flow/controls';
import { MiniMap } from '@vue-flow/minimap';
import { useWorkflowStore } from './stores/workflowStore';
import ToolPanel from './components/ToolPanel.vue';
import PropertiesPanel from './components/PropertiesPanel.vue';
import TriggerNode from './nodes/TriggerNode.vue';
import CreateTaskNode from './nodes/CreateTaskNode.vue';
import UpdateTaskNode from './nodes/UpdateTaskNode.vue';
import ConditionNode from './nodes/ConditionNode.vue';
import DelayNode from './nodes/DelayNode.vue';

// Styles
import '@vue-flow/core/dist/style.css';
import '@vue-flow/core/dist/theme-default.css';
import '@vue-flow/controls/dist/style.css';
import '@vue-flow/minimap/dist/style.css';

const workflowStore = useWorkflowStore();
const { project, screenToFlowCoordinate } = useVueFlow();

const saving = ref(false);
const notification = ref<{ message: string; type: string } | null>(null);

const canExecute = computed(() => {
  return workflowStore.currentWorkflowId && workflowStore.nodes.length > 0;
});

onMounted(async () => {
  // Get workflow ID from URL pathname
  const pathname = window.location.pathname;
  const match = pathname.match(/\/workflows\/([^\/]+)/);
  const workflowId = match ? match[1] : null;

  if (workflowId && workflowId !== 'new') {
    try {
      await workflowStore.loadWorkflow(workflowId);
    } catch (error) {
      showNotification('Failed to load workflow', 'error');
    }
  }
});

function onDrop(event: DragEvent) {
  const type = event.dataTransfer?.getData('application/vueflow');
  if (!type) return;

  const position = screenToFlowCoordinate({
    x: event.clientX,
    y: event.clientY,
  });

  workflowStore.addNode(type, position);
}

function onNodeClick(event: any) {
  workflowStore.selectNode(event.node);
}

function onPaneClick() {
  workflowStore.selectNode(null);
}

function onNodesChange(changes: any) {
  // Handle node position changes
  changes.forEach((change: any) => {
    if (change.type === 'position' && change.position) {
      const node = workflowStore.nodes.find(n => n.id === change.id);
      if (node) {
        node.position = change.position;
      }
    }
  });
}

function onEdgesChange(changes: any) {
  // Handle edge removals
  changes.forEach((change: any) => {
    if (change.type === 'remove') {
      workflowStore.edges = workflowStore.edges.filter(e => e.id !== change.id);
    }
  });
}

async function handleSave() {
  try {
    saving.value = true;
    await workflowStore.saveWorkflow();
    showNotification('Workflow saved successfully', 'success');
  } catch (error) {
    showNotification('Failed to save workflow', 'error');
  } finally {
    saving.value = false;
  }
}

async function handleExecute() {
  if (!workflowStore.currentWorkflowId) {
    showNotification('Please save the workflow first', 'warning');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

    await fetch(`${apiUrl}/v1/workflows/${workflowStore.currentWorkflowId}/execute`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    showNotification('Workflow executed successfully', 'success');
  } catch (error) {
    showNotification('Failed to execute workflow', 'error');
  }
}

function goBack() {
  window.location.href = '/workflows';
}

function showNotification(message: string, type: string) {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value = null;
  }, 3000);
}
</script>

<style scoped>
.workflow-builder {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.top-toolbar {
  height: 60px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.toolbar-left,
.toolbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.workflow-name-input {
  padding: 8px 12px;
  font-size: 16px;
  font-weight: 600;
  border: 1px solid transparent;
  border-radius: 6px;
  background: #f9fafb;
  min-width: 300px;
  transition: all 0.2s;
}

.workflow-name-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.toolbar-btn {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.toolbar-btn:hover:not(:disabled) {
  border-color: #3b82f6;
  background: #f0f9ff;
}

.toolbar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.toolbar-btn.back-btn {
  border-color: transparent;
  background: transparent;
  color: #6b7280;
}

.toolbar-btn.back-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.toolbar-btn.primary-btn {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.toolbar-btn.primary-btn:hover:not(:disabled) {
  background: #2563eb;
  border-color: #2563eb;
}

.builder-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.canvas-container {
  flex: 1;
  position: relative;
  background: #fafafa;
}

.notification {
  position: fixed;
  top: 80px;
  right: 20px;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background: #10b981;
  color: white;
}

.notification.error {
  background: #ef4444;
  color: white;
}

.notification.warning {
  background: #f59e0b;
  color: white;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
