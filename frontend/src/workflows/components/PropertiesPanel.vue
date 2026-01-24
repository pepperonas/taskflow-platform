<template>
  <div class="properties-panel">
    <div class="panel-header">
      <h3>{{ selectedNode ? 'Node Properties' : 'No Node Selected' }}</h3>
      <button v-if="selectedNode" class="delete-btn" @click="deleteNode">🗑️</button>
    </div>

    <div v-if="selectedNode" class="panel-content">
      <!-- Trigger Node -->
      <div v-if="selectedNode.type === 'trigger'" class="property-group">
        <label class="property-label">Label</label>
        <input
          v-model="selectedNode.data.label"
          type="text"
          class="property-input"
          placeholder="Manual Trigger"
        />
        <p class="property-hint">This node starts the workflow execution.</p>
      </div>

      <!-- Create Task Node -->
      <div v-else-if="selectedNode.type === 'createTask'" class="property-group">
        <label class="property-label">Label</label>
        <input
          v-model="selectedNode.data.label"
          type="text"
          class="property-input"
          placeholder="Create Task"
        />

        <label class="property-label">Task Title</label>
        <input
          v-model="selectedNode.data.title"
          type="text"
          class="property-input"
          placeholder="Enter task title"
        />

        <label class="property-label">Description</label>
        <textarea
          v-model="selectedNode.data.description"
          class="property-textarea"
          rows="3"
          placeholder="Task description..."
        />

        <label class="property-label">Priority</label>
        <select v-model="selectedNode.data.priority" class="property-select">
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>

        <label class="property-label">Category</label>
        <select v-model="selectedNode.data.category" class="property-select">
          <option value="WORK">Work</option>
          <option value="PERSONAL">Personal</option>
          <option value="DEVELOPMENT">Development</option>
          <option value="BUG">Bug</option>
          <option value="FEATURE">Feature</option>
        </select>

        <p class="property-hint">Use {{"{{"}}variable{{"}}"}} for dynamic values.</p>
      </div>

      <!-- Update Task Node -->
      <div v-else-if="selectedNode.type === 'updateTask'" class="property-group">
        <label class="property-label">Label</label>
        <input
          v-model="selectedNode.data.label"
          type="text"
          class="property-input"
          placeholder="Update Task"
        />

        <label class="property-label">Task ID Source</label>
        <input
          v-model="selectedNode.data.taskIdSource"
          type="text"
          class="property-input"
          placeholder="e.g., {{trigger.taskId}}"
        />

        <label class="property-label">Status</label>
        <select v-model="selectedNode.data.status" class="property-select">
          <option value="">-- No Change --</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      <!-- Condition Node -->
      <div v-else-if="selectedNode.type === 'condition'" class="property-group">
        <label class="property-label">Label</label>
        <input
          v-model="selectedNode.data.label"
          type="text"
          class="property-input"
          placeholder="Condition"
        />

        <label class="property-label">Left Value</label>
        <input
          v-model="selectedNode.data.left"
          type="text"
          class="property-input"
          placeholder="e.g., {{priority}}"
        />

        <label class="property-label">Operator</label>
        <select v-model="selectedNode.data.operator" class="property-select">
          <option value="equals">Equals (==)</option>
          <option value="notEquals">Not Equals (!=)</option>
          <option value="contains">Contains</option>
          <option value="greaterThan">Greater Than (&gt;)</option>
          <option value="lessThan">Less Than (&lt;)</option>
        </select>

        <label class="property-label">Right Value</label>
        <input
          v-model="selectedNode.data.right"
          type="text"
          class="property-input"
          placeholder="e.g., HIGH"
        />

        <p class="property-hint">Condition determines which path to follow.</p>
      </div>

      <!-- Delay Node -->
      <div v-else-if="selectedNode.type === 'delay'" class="property-group">
        <label class="property-label">Label</label>
        <input
          v-model="selectedNode.data.label"
          type="text"
          class="property-input"
          placeholder="Delay"
        />

        <label class="property-label">Delay (milliseconds)</label>
        <input
          v-model.number="selectedNode.data.delayMs"
          type="number"
          class="property-input"
          placeholder="1000"
          min="0"
        />

        <p class="property-hint">
          {{ formatDelay(selectedNode.data.delayMs || 1000) }}
        </p>
      </div>

      <div v-else class="property-group">
        <p class="property-hint">No properties available for this node type.</p>
      </div>
    </div>

    <div v-else class="panel-content empty-state">
      <p>Select a node to edit its properties</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useWorkflowStore } from '../stores/workflowStore';

const workflowStore = useWorkflowStore();

const selectedNode = computed(() => workflowStore.selectedNode);

function deleteNode() {
  if (selectedNode.value) {
    workflowStore.removeNode(selectedNode.value.id);
  }
}

function formatDelay(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${ms / 1000}s`;
  if (ms < 3600000) return `${ms / 60000}min`;
  return `${ms / 3600000}h`;
}
</script>

<style scoped>
.properties-panel {
  width: 320px;
  height: 100%;
  background: #f9fafb;
  border-left: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.panel-header {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.delete-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.delete-btn:hover {
  background: #dc2626;
}

.panel-content {
  padding: 16px;
  flex: 1;
  overflow-y: auto;
}

.panel-content.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  font-size: 14px;
}

.property-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.property-label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: -8px;
}

.property-input,
.property-textarea,
.property-select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s;
}

.property-input:focus,
.property-textarea:focus,
.property-select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.property-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.property-hint {
  font-size: 12px;
  color: #6b7280;
  margin: -6px 0 0 0;
  font-style: italic;
}
</style>
