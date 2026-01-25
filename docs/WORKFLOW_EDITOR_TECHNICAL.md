# TaskFlow Workflow Editor - Technical Documentation

## Architecture Overview

The TaskFlow Workflow Editor is built using React Flow and integrates with a Java/Spring Boot backend for workflow execution.

### Technology Stack

**Frontend**:
- React 18
- TypeScript
- React Flow (workflow visualization)
- Material-UI (components)
- Axios (API calls)
- Dagre (auto-layout)

**Backend**:
- Java 17
- Spring Boot 3
- PostgreSQL (workflow storage)
- JSONB (workflow data)

---

## Component Structure

### Main Components

\`\`\`
frontend/src/
├── pages/
│   └── WorkflowEditorPageV2.tsx         # Main editor component
├── components/workflow/
│   ├── NodePropertiesPanel.tsx          # Right sidebar (node config)
│   ├── ExecutionResultsPanel.tsx        # Bottom drawer (results)
│   ├── ExecutionHistoryPanel.tsx        # Execution history list
│   ├── CommandPalette.tsx               # Ctrl+K command search
│   └── node-configs/
│       ├── CreateTaskConfig.tsx         # CreateTask node config
│       ├── UpdateTaskConfig.tsx         # UpdateTask node config
│       ├── ConditionConfig.tsx          # Condition node config
│       └── DelayConfig.tsx              # Delay node config
└── utils/
    ├── workflowExport.ts                # Export/import utilities
    └── graphLayout.ts                   # Auto-arrange using Dagre
\`\`\`

---

## Extending the Editor

### Adding a New Node Type

See full documentation in README files.

---

**Last Updated**: January 2026
**Version**: 1.0
