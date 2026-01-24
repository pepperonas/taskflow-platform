<template>
  <div class="custom-node create-task-node">
    <Handle type="target" :position="Position.Top" />
    <div class="node-header">
      <div class="node-icon">📝</div>
      <div class="node-title">{{ data.label || 'Create Task' }}</div>
    </div>
    <div v-if="data.title" class="node-details">
      <div class="detail-item">{{ data.title }}</div>
    </div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';

interface Props {
  data: {
    label?: string;
    title?: string;
    description?: string;
    priority?: string;
    category?: string;
  };
}

defineProps<Props>();
</script>

<style scoped>
.create-task-node {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
}

.node-details {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(59, 130, 246, 0.2);
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
