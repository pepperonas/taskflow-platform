import { createApp } from 'vue';
import { createPinia } from 'pinia';
import WorkflowBuilderApp from './WorkflowBuilderApp.vue';

export function mountWorkflowBuilder(elementId: string) {
  const app = createApp(WorkflowBuilderApp);
  const pinia = createPinia();

  app.use(pinia);

  app.mount(`#${elementId}`);

  return app;
}
