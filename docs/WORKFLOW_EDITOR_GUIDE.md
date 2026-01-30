# TaskFlow Workflow Editor - User Guide

## Overview

The TaskFlow Workflow Editor is a powerful visual workflow automation tool inspired by n8n. It allows you to create, edit, and execute workflows using a drag-and-drop interface with full expression support.

---

## Getting Started

### Creating a New Workflow

1. Navigate to `/workflows` in the TaskFlow application
2. Click **"New Workflow"** button
3. The workflow editor will open with an empty canvas

### Basic Workflow Structure

A workflow consists of:
- **Nodes**: Individual steps or actions (triggers, tasks, conditions, etc.)
- **Connections**: Edges that define the execution flow between nodes
- **Configuration**: Node-specific settings and expressions

---

## Node Types

### 1. Trigger Node ⚡
**Purpose**: Starting point for workflow execution

**Use Cases**:
- Manual workflow execution
- Scheduled triggers (future feature)
- Webhook triggers (future feature)

**Configuration**: None (manual trigger)

---

### 2. Create Task Node 📝
**Purpose**: Create a new task in TaskFlow

**Configuration**:
- **Title**: Task title (supports expressions)
- **Description**: Task description (supports expressions)
- **Priority**: LOW | MEDIUM | HIGH | CRITICAL
- **Assignee ID**: Optional user ID to assign the task

**Example**:
```
Title: {{ $trigger.taskTitle }}
Description: {{ $trigger.taskDescription }}
Priority: HIGH
```

---

### 3. Update Task Node ✏️
**Purpose**: Update an existing task

**Configuration**:
- **Task ID**: ID of the task to update (required)
- **Fields to Update**: Select which fields to modify
  - Title
  - Description
  - Priority
  - Status (TODO, IN_PROGRESS, DONE)
  - Assignee

**Example**:
```
Task ID: {{ $trigger.taskId }}
Update Status: IN_PROGRESS
```

---

### 4. Condition Node 🔀
**Purpose**: Branch workflow based on a condition

**Configuration**:
- **Expression**: Boolean expression to evaluate

**Outputs**:
- **True** (green handle): Execute when condition is true
- **False** (red handle): Execute when condition is false

**Example Expressions**:
```javascript
{{ $trigger.priority }} === 'HIGH'
{{ $trigger.amount }} > 1000
{{ $nodes.createTask.status }} === 'success'
```

---

### 5. Delay Node ⏱️
**Purpose**: Pause workflow execution

**Configuration**:
- **Duration**: Number value
- **Unit**: Seconds | Minutes | Hours

**Example**: 5 minutes delay before sending reminder

---

### 6. Sticky Note 📝
**Purpose**: Add annotations and documentation to workflows

**Features**:
- Free-text note taking
- Yellow sticky note appearance
- Drag to position anywhere on canvas
- Does not participate in workflow execution

**Shortcut**: `Shift+S`

---

## Expression System

### Syntax

Expressions use double curly braces: `{{ expression }}`

### Available Variables

#### $trigger
Access trigger data passed when executing the workflow

**Examples**:
```javascript
{{ $trigger.taskId }}
{{ $trigger.title }}
{{ $trigger.priority }}
{{ $trigger.assigneeId }}
```

#### $nodes
Access output from previous nodes

**Format**: `{{ $nodes.nodeId.field }}`

**Example**:
```javascript
{{ $nodes.createTask.status }}
{{ $nodes.createTask.taskId }}
```

#### Built-in Functions

- `$now()` - Current timestamp
- `$json()` - Parse JSON string
- `$uuid()` - Generate UUID

### Expression Editor

**Features**:
- Syntax highlighting
- Variable autocomplete (`Ctrl+Space`)
- Context-aware suggestions
- Shows available variables based on node position

---

## Keyboard Shortcuts

### General
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd+K` | Open command palette |
| `Ctrl/Cmd+S` | Save workflow |
| `Ctrl/Cmd+Enter` | Execute workflow |
| `?` | Show keyboard shortcuts |

### Editing
| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd+C` | Copy selected nodes |
| `Ctrl/Cmd+V` | Paste nodes |
| `Ctrl/Cmd+D` | Duplicate selected nodes |
| `Delete` | Delete selected nodes |
| `Ctrl/Cmd+Z` | Undo |
| `Ctrl/Cmd+Shift+Z` | Redo |

### Nodes
| Shortcut | Action |
|----------|--------|
| `Shift+S` | Add sticky note |
| `D` | Toggle node disable/enable |
| `Right Click` | Open context menu |

### Canvas
| Action | How To |
|--------|--------|
| Zoom | Mouse wheel |
| Pan | Space + Drag |
| Variable Autocomplete | `Ctrl+Space` |

---

## Features

### 1. Node Configuration Panel

**Access**: Click any node on the canvas

**Features**:
- Edit node name
- Configure node-specific properties
- Use expression editor for dynamic values
- Save changes automatically

**Location**: Right sidebar (400px width)

---

### 2. Execution & Results

#### Execute Workflow

**Methods**:
1. Click **"Execute"** button in toolbar
2. Press `Ctrl/Cmd+Enter`
3. Use command palette → "Execute Workflow"

**Requirements**:
- Workflow must be saved first
- Shows real-time execution status

#### View Results

**Features**:
- Bottom drawer opens automatically after execution
- Shows execution log
- Displays trigger data
- Shows output for each node
- Color-coded status indicators:
  - ✅ Green = Success
  - ❌ Red = Failed
  - ⏭️ Gray = Skipped

---

### 3. Execution History

**Access**: Click **"History"** button in toolbar

**Features**:
- List of all past executions
- Timestamp and duration
- Status badges
- Click to view detailed results
- Refresh to reload

**Information Displayed**:
- Execution ID (truncated)
- Relative time ("5m ago", "2h ago")
- Status (COMPLETED, FAILED, RUNNING)
- Execution duration

---

### 4. Command Palette

**Access**: `Ctrl/Cmd+K`

**Features**:
- Quick search for actions
- Fuzzy search
- Keyboard navigation (↑↓ arrows)
- Press `Enter` to execute
- Shows keyboard shortcuts
- Grouped by category

**Available Commands**:
- Add node types (Trigger, CreateTask, UpdateTask, Condition, Delay, Sticky Note)
- Save/Execute workflow
- View execution history
- Undo/Redo
- Copy/Paste/Delete nodes
- Export/Import workflow
- Auto-arrange nodes

---

### 5. Auto-Save

**Features**:
- Saves every 30 seconds automatically
- Only saves if there are unsaved changes
- Silent saves (no notification spam)
- Shows "Saving..." indicator during save
- Displays "Saved Xm ago" after successful save

**Status Indicator**:
- `*` (asterisk) appears next to workflow name when unsaved
- Shows last saved time in toolbar

---

### 6. Copy/Paste & Duplicate

#### Copy-Paste
1. Select node(s)
2. Press `Ctrl/Cmd+C` to copy
3. Press `Ctrl/Cmd+V` to paste
4. Pasted nodes appear with 50px offset

#### Duplicate
1. Select node(s)
2. Press `Ctrl/Cmd+D`
3. Duplicated nodes appear with 50px offset

**Note**: All node configurations are preserved

---

### 7. Undo/Redo

**Features**:
- History of last 50 states
- Toolbar buttons with visual state
- Keyboard shortcuts
- Works for all canvas changes:
  - Adding/deleting nodes
  - Moving nodes
  - Connecting edges
  - Configuration changes

**Usage**:
- **Undo**: `Ctrl/Cmd+Z` or toolbar button
- **Redo**: `Ctrl/Cmd+Shift+Z` or toolbar button

---

### 8. Node Context Menu

**Access**: Right-click any node

**Actions**:
- **Execute Node**: Run single node (coming soon)
- **Duplicate**: Create a copy
- **Copy**: Copy to clipboard
- **Enable/Disable**: Toggle node active state
- **Delete**: Remove from canvas

---

### 9. Hover Actions

**Access**: Hover mouse over any node

**Actions**:
- ⏸️ **Disable**: Toggle node enabled/disabled
- 🗑️ **Delete**: Remove node from canvas

**Visual Feedback**:
- Floating action bar appears above node
- Only shows on non-disabled nodes
- Available on all node types

---

### 10. Node Disable/Enable

**Features**:
- Disabled nodes are skipped during execution
- Visual indicators:
  - Dashed border
  - 50% opacity
- Can be re-enabled anytime

**Methods to Disable**:
1. Right-click → "Disable"
2. Hover → Click ⏸️ button
3. Press `D` key (when selected)

---

### 11. Export/Import Workflow

#### Export
**Access**: Menu (⋮) → "Export Workflow"

**Features**:
- Downloads workflow as JSON file
- Includes all nodes, edges, and configurations
- Preserves node positions
- Filename: `{workflow-name}_workflow.json`

#### Import
**Access**: Menu (⋮) → "Import Workflow"

**Features**:
- Upload workflow JSON file
- Validates file format
- Loads all nodes and edges
- Appends " (Imported)" to workflow name
- Preserves all configurations

**Use Cases**:
- Backup workflows
- Share workflows with team
- Template workflows
- Version control

---

### 12. Auto-Arrange

**Access**: Menu (⋮) → "Auto-Arrange Nodes"

**Features**:
- Automatically arranges nodes in clean layout
- Uses Dagre graph layout algorithm
- Left-to-right flow
- Configurable spacing:
  - Horizontal: 80px
  - Vertical: 150px

**Use Cases**:
- Clean up messy workflows
- Standardize layout
- Improve readability

---

### 13. Grid Snapping

**Features**:
- Nodes snap to 15x15px grid
- Automatically enabled
- Helps align nodes
- Makes layouts cleaner

**No configuration needed** - works automatically!

---

### 14. Sticky Notes

**Features**:
- Yellow sticky note appearance
- Free-form text editing
- Drag to position
- Resize (min 200px, max 400px width)
- Delete via hover action

**Shortcuts**:
- Add: `Shift+S`
- Edit: Click note and type

**Use Cases**:
- Document workflow logic
- Add TODO notes
- Explain complex sections
- Team collaboration notes

---

## Best Practices

### 1. Workflow Organization

- ✅ Use sticky notes to document complex logic
- ✅ Name nodes descriptively
- ✅ Use auto-arrange for clean layouts
- ✅ Group related nodes visually
- ✅ Keep workflows focused (max 10-15 nodes)

### 2. Expression Writing

- ✅ Use autocomplete (`Ctrl+Space`)
- ✅ Test expressions with simple workflows first
- ✅ Use descriptive variable names in triggers
- ✅ Handle null/undefined values
- ✅ Keep expressions simple and readable

### 3. Error Handling

- ✅ Use condition nodes to check for errors
- ✅ Add fallback branches
- ✅ Test workflows before production use
- ✅ Check execution history for failures
- ✅ Review execution logs for debugging

### 4. Performance

- ✅ Disable unnecessary nodes during testing
- ✅ Use delays sparingly
- ✅ Keep workflows focused
- ✅ Monitor execution times
- ✅ Optimize long-running workflows

---

## Troubleshooting

### Workflow Won't Execute

**Issue**: Execute button is disabled

**Solutions**:
- Save workflow first (`Ctrl/Cmd+S`)
- Check that workflow has nodes
- Verify workflow is not currently executing

---

### Node Configuration Not Saving

**Issue**: Changes disappear after closing panel

**Solutions**:
- Ensure you're editing the correct node
- Wait for auto-save (check "Saved X ago")
- Manually save with `Ctrl/Cmd+S`
- Check browser console for errors

### Node Name Input Field Not Editable

**Issue**: Cannot type in the "Node Name" field in the properties panel

**Solution**: This issue has been fixed in version 1.0. The input field now uses a native HTML input element that properly handles events. If you still experience issues:
- Refresh the page (Ctrl/Cmd+R)
- Clear browser cache
- Check browser console for errors

---

### Expression Not Working

**Issue**: Expression doesn't evaluate correctly

**Solutions**:
- Check syntax: `{{ expression }}`
- Verify variable names
- Use autocomplete to ensure correct paths
- Check execution log for errors
- Test with simple expressions first

---

### Execution Failed

**Issue**: Workflow execution shows error

**Solutions**:
- Check execution log in results panel
- Verify all required fields are filled
- Check expression syntax
- Ensure connected nodes are valid
- Test individual nodes first

---

## Tips & Tricks

### 1. Quick Node Addition

Use command palette (`Ctrl/Cmd+K`) and type node name for fastest addition.

### 2. Bulk Operations

Select multiple nodes (Shift+Click) for:
- Bulk copy/paste
- Bulk delete
- Bulk move

### 3. Workflow Templates

1. Create workflow
2. Export as JSON
3. Import when needed
4. Modify as needed

### 4. Keyboard-Driven Workflow

Memorize shortcuts for 3x faster workflow editing:
- `Ctrl+K` → Search commands
- `Shift+S` → Add note
- `Ctrl+D` → Duplicate
- `?` → Show all shortcuts

### 5. Expression Testing

Create test workflows with:
1. Trigger node
2. Your expression in condition/task
3. Execute with sample data
4. Check results panel

---

## Support & Resources

### Documentation
- User Guide: `/docs/WORKFLOW_EDITOR_GUIDE.md` (this file)
- Technical Docs: `/docs/WORKFLOW_EDITOR_TECHNICAL.md`
- API Reference: `/docs/API.md`

### Keyboard Shortcuts
Press `?` anytime in the editor to see all shortcuts

### Command Palette
Press `Ctrl/Cmd+K` to search all available actions

### Help Button
Click `?` icon in toolbar for quick reference

---

## Version History

### Version 1.0 (Current)
**Released**: January 2026

**Features**:
- ✅ Full workflow editor with 5 node types
- ✅ Expression system with variables
- ✅ Execution & results display
- ✅ Execution history
- ✅ Copy/paste/duplicate nodes
- ✅ Undo/redo (50 states)
- ✅ Context menus
- ✅ Command palette
- ✅ Auto-save every 30 seconds
- ✅ Keyboard shortcuts (15+)
- ✅ Node disable/enable
- ✅ Hover actions
- ✅ Sticky notes
- ✅ Export/import workflows
- ✅ Auto-arrange layout
- ✅ Grid snapping

**Node Types**:
- Trigger (Manual)
- Create Task
- Update Task
- Condition
- Delay
- Sticky Note

---

## Frequently Asked Questions

### Q: Can I schedule workflows to run automatically?
**A**: Not yet. Currently, workflows are manually triggered. Scheduled triggers are planned for a future release.

### Q: Can I use JavaScript functions in expressions?
**A**: Limited support. You can use comparison operators and access properties. Full JavaScript evaluation is planned for future releases.

### Q: How many workflows can I create?
**A**: Unlimited workflows per user.

### Q: Can I share workflows with team members?
**A**: Yes, via export/import. Export as JSON and share the file.

### Q: Is there a workflow size limit?
**A**: No hard limit, but we recommend keeping workflows under 20 nodes for best performance and maintainability.

### Q: Can I nest workflows?
**A**: Not yet. Sub-workflow execution is planned for a future release.

### Q: What happens to disabled nodes?
**A**: Disabled nodes are completely skipped during execution. Their outputs are not available to downstream nodes.

### Q: Can I test a single node?
**A**: Single node execution is coming soon. Currently, you must execute the entire workflow.

---

**Last Updated**: January 2026
**Version**: 1.0
**Maintained by**: TaskFlow Team
