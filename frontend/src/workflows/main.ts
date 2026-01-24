import { createApp } from 'vue';
import { createPinia } from 'pinia';
// @ts-ignore
import WorkflowBuilderApp from './WorkflowBuilderApp.vue';
// @ts-ignore
import TestApp from './TestApp.vue';

export function mountWorkflowBuilder(elementId: string) {
  console.log('[mountWorkflowBuilder] Starting...');

  // Use TestApp to verify Vue is working
  const USE_TEST = true;
  const Component = USE_TEST ? TestApp : WorkflowBuilderApp;

  console.log('[mountWorkflowBuilder] Using component:', USE_TEST ? 'TestApp' : 'WorkflowBuilderApp');

  const app = createApp(Component);

  if (!USE_TEST) {
    const pinia = createPinia();
    app.use(pinia);
  }

  console.log('[mountWorkflowBuilder] Mounting to #' + elementId);
  app.mount(`#${elementId}`);
  console.log('[mountWorkflowBuilder] Mount complete');

  return app;
}
