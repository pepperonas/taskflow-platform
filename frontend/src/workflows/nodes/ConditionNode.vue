<template>
  <div class="custom-node condition-node">
    <Handle type="target" :position="Position.Top" />
    <div class="node-header">
      <div class="node-icon">🔀</div>
      <div class="node-title">{{ data.label || 'Condition' }}</div>
    </div>
    <div v-if="data.left && data.operator && data.right" class="node-details">
      <div class="detail-item">{{ data.left }} {{ data.operator }} {{ data.right }}</div>
    </div>
    <div class="node-handles">
      <Handle id="true" type="source" :position="Position.Bottom" style="left: 30%">
        <div class="handle-label">True</div>
      </Handle>
      <Handle id="false" type="source" :position="Position.Bottom" style="left: 70%">
        <div class="handle-label">False</div>
      </Handle>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core';

interface Props {
  data: {
    label?: string;
    left?: string;
    operator?: string;
    right?: string;
  };
}

defineProps<Props>();
</script>

<style scoped>
.condition-node {
  border-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.node-handles {
  position: relative;
  height: 20px;
}

.handle-label {
  position: absolute;
  top: 20px;
  font-size: 10px;
  color: #6b7280;
  white-space: nowrap;
  transform: translateX(-50%);
  background: white;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}
</style>
