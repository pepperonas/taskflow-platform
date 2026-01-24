<template>
  <div class="custom-node update-task-node">
    <Handle type="target" :position="Position.Top" />
    <div class="node-header">
      <div class="node-icon">✏️</div>
      <div class="node-title">{{ data.label || 'Update Task' }}</div>
    </div>
    <div v-if="data.status" class="node-details">
      <div class="detail-item">Status: {{ data.status }}</div>
    </div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';

interface Props {
  data: {
    label?: string;
    taskIdSource?: string;
    status?: string;
  };
}

defineProps<Props>();
</script>

<style scoped>
.update-task-node {
  border-color: #06b6d4;
  background: linear-gradient(135deg, #ecfeff 0%, #cffafe 100%);
}

.node-details {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(6, 182, 212, 0.2);
}

.detail-item {
  font-size: 12px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}
</style>
