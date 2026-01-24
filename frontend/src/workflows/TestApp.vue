<template>
  <div style="background: red; color: white; padding: 50px; font-size: 24px;">
    <h1>Vue App Works! 🎉</h1>
    <p>If you see this, Vue is rendering correctly.</p>
    <button @click="count++">Count: {{ count }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);

console.log('[TestApp] Vue component loaded');
</script>
