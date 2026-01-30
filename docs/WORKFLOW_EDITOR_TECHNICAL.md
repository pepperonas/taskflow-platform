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

## Known Issues & Solutions

### Node Name Input Field

**Issue**: The "Node Name" input field in the NodePropertiesPanel was not editable due to React Flow event handling conflicts.

**Solution**: 
- Replaced Material-UI TextField with native HTML input element
- Implemented local state management (`localLabel`) for controlled input
- Added `stopPropagation()` to all event handlers to prevent React Flow from intercepting events
- Configured Drawer with `hideBackdrop={true}` and proper `pointerEvents` settings

**Implementation Details**:
- Uses native `<input>` element instead of Material-UI TextField

### Node Configuration Input Fields

**Issue**: Other input fields in node configuration panels (not just Node Name) were not editable.

**Solution**:
- Added `stopPropagation()` to all event handlers (`onMouseDown`, `onClick`, `onKeyDown`, `onKeyPress`, `onKeyUp`, `onChange`, `onFocus`) on all input components
- Applied to `TextField`, `Select`, `Checkbox`, and `ExpressionEditor` components
- Applied to parent `Box` and `FormControl` elements
- Prevents event bubbling to React Flow or the Drawer backdrop

**Files Modified**:
- `ExpressionEditor.tsx`
- `CreateTaskConfig.tsx`
- `UpdateTaskConfig.tsx`
- `ConditionConfig.tsx`
- `DelayConfig.tsx`
- `HttpRequestConfig.tsx`
- `CodeConfig.tsx`
- `EmailConfig.tsx`
- Local state synchronizes with node data model
- All mouse and keyboard events properly isolated from React Flow canvas

---

## Extending the Editor

### Adding a New Node Type

See full documentation in README files.

---

**Last Updated**: January 2026
**Version**: 1.0
