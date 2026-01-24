<template>
  <div class="test-app">
    <h1>Vue App Works! 🎉</h1>
    <p>If you see this, Vue is rendering correctly.</p>
    <button @click="incrementCount">Count: {{ count }}</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'TestApp',
  setup() {
    console.log('[TestApp] Setup function called');

    const count = ref(0);

    function incrementCount() {
      count.value++;
      console.log('[TestApp] Count:', count.value);
    }

    onMounted(() => {
      console.log('[TestApp] Component mounted to DOM');
      console.log('[TestApp] Root element:', document.querySelector('#workflow-builder-root'));
    });

    return {
      count,
      incrementCount,
    };
  },
});
</script>

<style scoped>
.test-app {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: red;
  color: white;
  padding: 50px;
  font-size: 24px;
  z-index: 99999;
}

.test-app button {
  font-size: 20px;
  padding: 10px 20px;
  margin-top: 20px;
  cursor: pointer;
}
</style>
