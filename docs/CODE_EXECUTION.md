# Code Execution Documentation

## Overview

The Code Execution feature allows users to execute custom JavaScript code within workflows in a secure, sandboxed GraalVM environment. This enables data transformation, conditional logic, and custom business rules.

## Access

**URL**: `/integrations/code`  
**API Endpoint**: `POST /api/v1/code/execute`

## Features

- ✅ **Sandboxed Execution**: Runs in isolated GraalVM context
- ✅ **Security Validation**: Blocks dangerous patterns (eval, require, etc.)
- ✅ **Timeout Protection**: Maximum 5 seconds per execution
- ✅ **Context Variables**: Access to `$trigger`, `$vars`, `$context`
- ✅ **Real-time Results**: Immediate execution feedback

## Security

### Blocked Patterns

The following JavaScript patterns are blocked for security:

- `eval()`, `Function()`
- `require()`, `import`
- `process.*`, `global.*`, `window.*`, `document.*`
- `fetch()`, `XMLHttpRequest`, `WebSocket`
- `setTimeout()`, `setInterval()`
- `child_process`, `fs.*`, `os.*`
- `__dirname`, `__filename`

### Sandbox Restrictions

- **No File System Access**: Cannot read or write files
- **No Network Access**: Cannot make external HTTP requests
- **No Native Code**: Cannot execute native code
- **No Process Creation**: Cannot create new processes
- **No Thread Creation**: Cannot create new threads

## Usage

### In Workflow Editor

1. Add a **Code Node** to your workflow
2. Configure the JavaScript code in the node properties panel
3. Access workflow context with variables:
   - `$trigger` - Trigger data
   - `$vars` - Workflow variables
   - `$context` - Execution context
   - `$nodeId` - Previous node outputs

### Example Code

```javascript
// Access trigger data
const name = $trigger.name || 'World';

// Transform data
const result = {
  message: `Hello, ${name}!`,
  uppercase: name.toUpperCase(),
  length: name.length
};

// Return result
return result;
```

### Date Manipulation Example

```javascript
const now = new Date();
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);

return {
  today: now.toISOString(),
  tomorrow: tomorrow.toISOString(),
  dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' })
};
```

### Data Transformation Example

```javascript
const data = $trigger.users || [];

return data.map(user => ({
  id: user.id,
  fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
  email: (user.email || '').toLowerCase()
}));
```

## API Usage

### Request

```bash
POST /api/v1/code/execute
Content-Type: application/json
Authorization: Bearer <token>

{
  "code": "return { result: $trigger.value * 2 };",
  "triggerData": {
    "value": 42
  }
}
```

### Response

```json
{
  "result": {
    "result": 84
  },
  "error": null,
  "executionTimeMs": 45
}
```

## Error Handling

### Validation Errors

If dangerous patterns are detected:

```json
{
  "result": null,
  "error": "Code validation failed: Dangerous pattern detected: eval",
  "executionTimeMs": 2
}
```

### Execution Errors

If code execution fails:

```json
{
  "result": null,
  "error": "JavaScript execution error: ReferenceError: x is not defined",
  "executionTimeMs": 15
}
```

### Timeout Errors

If execution exceeds 5 seconds:

```json
{
  "result": null,
  "error": "Code execution timeout (5000ms exceeded)",
  "executionTimeMs": 5000
}
```

## Best Practices

1. **Keep Code Simple**: Write clear, readable JavaScript
2. **Handle Errors**: Use try-catch for error handling
3. **Validate Input**: Check for undefined/null values
4. **Return Structured Data**: Return objects or arrays for better workflow integration
5. **Avoid Infinite Loops**: Ensure loops have exit conditions

## Limitations

- Maximum execution time: 5 seconds
- No file system access
- No network access
- No external library imports
- No access to Node.js APIs
- No access to browser APIs

## Security Alerts

All attempts to execute dangerous code patterns are logged as security alerts:

```
SECURITY ALERT: Dangerous code pattern detected: eval
SECURITY ALERT: Code validation failed: Dangerous pattern detected: eval
```

These alerts are monitored and can trigger additional security measures.

## Integration with Workflows

Code nodes can be used in combination with other nodes:

1. **HTTP Request → Code → Create Task**: Fetch data, transform it, create a task
2. **Database Query → Code → Email**: Query database, format results, send email
3. **Trigger → Code → Condition**: Process trigger data, make decisions

## Troubleshooting

### Code Not Executing

- Check browser console for errors
- Verify code syntax is valid JavaScript
- Ensure no blocked patterns are used
- Check execution timeout (max 5 seconds)

### Unexpected Results

- Verify `$trigger` data structure
- Check for undefined/null values
- Use console.log (if available) for debugging
- Review error messages in response

## Related Documentation

- [Workflow Editor Guide](WORKFLOW_EDITOR_GUIDE.md)
- [Security Documentation](SECURITY.md)
