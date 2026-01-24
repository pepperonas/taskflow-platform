<template>
  <div class="custom-node delay-node">
    <Handle type="target" :position="Position.Top" />
    <div class="node-header">
      <div class="node-icon">⏱️</div>
      <div class="node-title">{{ data.label || 'Delay' }}</div>
    </div>
    <div v-if="data.delayMs" class="node-details">
      <div class="detail-item">{{ formatDelay(data.delayMs) }}</div>
    </div>
    <Handle type="source" :position="Position.Bottom" />
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';

interface Props {
  data: {
    label?: string;
    delayMs?: number;
  };
}

defineProps<Props>();

function formatDelay(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${ms / 1000}s`;
  if (ms < 3600000) return `${ms / 60000}min`;
  return `${ms / 3600000}h`;
}
</script>

<style scoped>
.delay-node {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
}
</style>
