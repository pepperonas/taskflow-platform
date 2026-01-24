<template>
  <div class="tool-panel">
    <div class="panel-header">
      <h3>Nodes</h3>
    </div>
    <div class="panel-content">
      <div class="node-category">
        <h4>Triggers</h4>
        <div
          class="node-item trigger"
          draggable="true"
          @dragstart="onDragStart($event, 'trigger')"
          @click="addNode('trigger')"
        >
          <span class="node-item-icon">⚡</span>
          <span class="node-item-label">Manual Trigger</span>
        </div>
      </div>

      <div class="node-category">
        <h4>Actions</h4>
        <div
          class="node-item create-task"
          draggable="true"
          @dragstart="onDragStart($event, 'createTask')"
          @click="addNode('createTask')"
        >
          <span class="node-item-icon">📝</span>
          <span class="node-item-label">Create Task</span>
        </div>
        <div
          class="node-item update-task"
          draggable="true"
          @dragstart="onDragStart($event, 'updateTask')"
          @click="addNode('updateTask')"
        >
          <span class="node-item-icon">✏️</span>
          <span class="node-item-label">Update Task</span>
        </div>
      </div>

      <div class="node-category">
        <h4>Logic</h4>
        <div
          class="node-item condition"
          draggable="true"
          @dragstart="onDragStart($event, 'condition')"
          @click="addNode('condition')"
        >
          <span class="node-item-icon">🔀</span>
          <span class="node-item-label">Condition</span>
        </div>
      </div>

      <div class="node-category">
        <h4>Utilities</h4>
        <div
          class="node-item delay"
          draggable="true"
          @dragstart="onDragStart($event, 'delay')"
          @click="addNode('delay')"
        >
          <span class="node-item-icon">⏱️</span>
          <span class="node-item-label">Delay</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWorkflowStore } from '../stores/workflowStore';

const workflowStore = useWorkflowStore();

function onDragStart(event: DragEvent, nodeType: string) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }
}

function addNode(type: string) {
  workflowStore.addNode(type);
}
</script>

<style scoped>
.tool-panel {
  width: 260px;
  height: 100%;
  background: #f9fafb;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.panel-content {
  padding: 12px;
  flex: 1;
  overflow-y: auto;
}

.node-category {
  margin-bottom: 20px;
}

.node-category h4 {
  margin: 0 0 8px 0;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.node-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  margin-bottom: 6px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  cursor: grab;
  transition: all 0.2s;
}

.node-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
  transform: translateX(4px);
}

.node-item:active {
  cursor: grabbing;
}

.node-item-icon {
  font-size: 18px;
  line-height: 1;
}

.node-item-label {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.node-item.trigger {
  border-left: 3px solid #10b981;
}

.node-item.create-task,
.node-item.update-task {
  border-left: 3px solid #3b82f6;
}

.node-item.condition {
  border-left: 3px solid #f59e0b;
}

.node-item.delay {
  border-left: 3px solid #8b5cf6;
}
</style>
