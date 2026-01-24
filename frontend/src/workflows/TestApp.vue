<template>
  <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: red; color: white; padding: 50px; font-size: 24px; z-index: 99999;">
    <h1>Vue App Works! 🎉</h1>
    <p>If you see this, Vue is rendering correctly.</p>
    <button @click="count++" style="font-size: 20px; padding: 10px 20px; margin-top: 20px;">Count: {{ count }}</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const count = ref(0);

console.log('[TestApp] Vue component script loaded');

onMounted(() => {
  console.log('[TestApp] Component mounted to DOM');
  console.log('[TestApp] Component element:', document.querySelector('#workflow-builder-root'));
});
</script>
