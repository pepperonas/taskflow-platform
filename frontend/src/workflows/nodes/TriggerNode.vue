<template>
  <div class="custom-node trigger-node">
    <div class="node-header">
      <div class="node-icon">⚡</div>
      <div class="node-title">{{ data.label || 'Trigger' }}</div>
    </div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';

interface Props {
  data: {
    label?: string;
  };
}

defineProps<Props>();
</script>

<style scoped>
.custom-node {
  padding: 12px 16px;
  border-radius: 8px;
  background: white;
  border: 2px solid #10b981;
  min-width: 180px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.custom-node:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.trigger-node {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.node-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-icon {
  font-size: 20px;
  line-height: 1;
}

.node-title {
  font-weight: 600;
  font-size: 14px;
  color: #1f2937;
}
</style>
