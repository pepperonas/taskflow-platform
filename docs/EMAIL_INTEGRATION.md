# Email Integration Documentation

## Overview

The Email Integration feature allows users to send emails directly through the TaskFlow platform using SMTP. This feature supports HTML templates, dynamic content, and can be used both standalone and within workflows.

## Access

**URL**: `/integrations/email`  
**API Endpoint**: `POST /api/v1/email/send`

## Features

- ✅ **SMTP Integration**: Send emails via configured SMTP server
- ✅ **HTML Support**: Rich HTML email templates
- ✅ **Dynamic Content**: Variable interpolation with `{{ }}` syntax
- ✅ **Template System**: Pre-built email templates for common use cases
- ✅ **Real-time Testing**: Test email sending directly from the UI
- ✅ **Workflow Integration**: Use Email nodes in workflows

## Configuration

### SMTP Settings

Email configuration is managed through environment variables:

```bash
MAIL_HOST=premium269-4.web-hosting.com
MAIL_PORT=465
MAIL_USERNAME=martin.pfeffer@celox.io
MAIL_PASSWORD=your-password
```

### Security

- ✅ Credentials are stored securely as environment variables
- ✅ Never committed to the repository
- ✅ SSL/TLS encryption for SMTP connections
- ✅ Authentication required for API access

## Email Templates

### 1. Task Completion

**Subject**: `Task {{ $trigger.task.name }} Completed`

**Body**:
```
Hello {{ $trigger.user.name }},

Your task "{{ $trigger.task.name }}" has been completed.

Status: {{ $trigger.task.status }}
Completed at: {{ $trigger.task.completedAt }}

View task: {{ $trigger.task.url }}

Best regards,
TaskFlow Platform
```

### 2. Workflow Alert

**Subject**: `Workflow Execution Alert`

**Body**:
```
Alert: {{ $trigger.workflow.name }}

The workflow "{{ $trigger.workflow.name }}" has encountered an issue.

Error: {{ $trigger.error.message }}
Time: {{ $now() }}

Please review the workflow execution.

TaskFlow Platform
```

### 3. Welcome Email

**Subject**: `Welcome to TaskFlow Platform`

**Body**:
```
Hello {{ $trigger.user.name }},

Welcome to TaskFlow Platform! We're excited to have you on board.

Your account has been successfully created.
Email: {{ $trigger.user.email }}

Get started by creating your first workflow.

Best regards,
TaskFlow Team
```

## Variable Interpolation

### Available Variables

- `{{ $trigger.field }}` - Access trigger data
- `{{ $vars.name }}` - Access workflow variables
- `{{ $nodeId_result.field }}` - Access previous node results

### Example Usage

```javascript
// In Email Node configuration
To: {{ $trigger.user.email }}
Subject: Task {{ $trigger.task.title }} Updated
Body: <h1>Task Update</h1><p>Status: {{ $trigger.task.status }}</p>
```

## API Usage

### Request

```bash
POST /api/v1/email/send
Content-Type: application/json
Authorization: Bearer <token>

{
  "to": "user@example.com",
  "subject": "Test Email",
  "body": "Hello, this is a test email!",
  "from": "martin.pfeffer@celox.io",
  "triggerData": {
    "user": {
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### Response

```json
{
  "success": true,
  "to": "user@example.com",
  "subject": "Test Email",
  "error": null,
  "executionTimeMs": 234
}
```

### Error Response

```json
{
  "success": false,
  "to": "user@example.com",
  "subject": null,
  "error": "Email sending failed: Connection timeout",
  "executionTimeMs": 5000
}
```

## Integration with Workflows

### Email Node Configuration

1. Add an Email Node to your workflow
2. Configure email fields:
   - **To**: Recipient email address (supports expressions)
   - **Subject**: Email subject (supports expressions)
   - **Body**: Email body (supports HTML and expressions)
   - **From**: Sender email address (optional, defaults to configured sender)

3. Use expression syntax for dynamic content:
   ```
   To: {{ $trigger.user.email }}
   Subject: Task {{ $trigger.task.title }} Completed
   Body: <h1>Task Completed</h1><p>{{ $trigger.task.description }}</p>
   ```

### Example Workflow

**Trigger → Create Task → Email**

1. Trigger node starts workflow
2. Create Task node creates a new task
3. Email node sends notification to assignee

**Configuration**:
```
Email Node:
  To: {{ createTask_result.assignee.email }}
  Subject: New Task: {{ createTask_result.title }}
  Body: A new task has been assigned to you.
```

## Error Handling

### Common Errors

1. **Connection Timeout**
   ```
   Email sending failed: Connection timeout
   ```
   **Solution**: Check SMTP server settings and network connectivity

2. **Authentication Failed**
   ```
   Email sending failed: Authentication failed
   ```
   **Solution**: Verify MAIL_USERNAME and MAIL_PASSWORD are correct

3. **Invalid Recipient**
   ```
   Email sending failed: Invalid email address
   ```
   **Solution**: Verify the recipient email address format

4. **SMTP Server Error**
   ```
   Email sending failed: SMTP server error
   ```
   **Solution**: Check SMTP server logs and configuration

### Error Logging

All email sending attempts are logged with:
- User ID
- Recipient email
- Subject
- Execution time
- Error details (if any)

## Best Practices

### 1. Use Templates

Start with pre-built templates and customize as needed:
- Task Completion
- Workflow Alerts
- Welcome Emails

### 2. Test Before Production

Always test email sending using the `/integrations/email` page before using in workflows.

### 3. Use HTML for Rich Content

HTML emails provide better formatting:
```html
<h1>Task Update</h1>
<p>Status: <strong>{{ $trigger.task.status }}</strong></p>
<ul>
  <li>Priority: {{ $trigger.task.priority }}</li>
  <li>Due Date: {{ $trigger.task.dueDate }}</li>
</ul>
```

### 4. Validate Email Addresses

Ensure email addresses are valid before sending:
- Use proper email format
- Check for typos
- Verify domain exists

### 5. Handle Errors Gracefully

In workflows, use Condition nodes to handle email failures:
```
If email_result.success:
  → Continue workflow
Else:
  → Log error
  → Send alert
```

## Security Considerations

### SMTP Credentials

- ✅ Stored as environment variables
- ✅ Never exposed in API responses
- ✅ Encrypted in transit (SSL/TLS)
- ✅ Rotated regularly

### Email Content

- ⚠️ Avoid sending sensitive data in emails
- ⚠️ Sanitize user input in email templates
- ⚠️ Use HTTPS for email links
- ⚠️ Implement rate limiting for email sending

## Monitoring

All email sending is monitored with:
- Success/failure rates
- Execution times
- Error patterns
- Security alerts

## Troubleshooting

### Emails Not Sending

1. **Check SMTP Configuration**
   - Verify MAIL_HOST, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD
   - Test SMTP connection manually

2. **Check Logs**
   ```bash
   docker logs docker-task-service-1 | grep -i email
   ```

3. **Verify Authentication**
   - Ensure JWT token is valid
   - Check user permissions

4. **Test Connection**
   - Use `/integrations/email` page to test
   - Check browser console for errors

### Emails Not Received

1. **Check Spam Folder**
   - Emails might be filtered as spam
   - Check sender reputation

2. **Verify Recipient Address**
   - Ensure email address is correct
   - Test with a known working address

3. **Check SMTP Server**
   - Verify SMTP server is operational
   - Check server logs for delivery issues

## Related Documentation

- [Workflow Editor Guide](WORKFLOW_EDITOR_GUIDE.md)
- [Security Documentation](SECURITY.md)
- [Database Integration](DATABASE_INTEGRATION.md)

---

**Last Updated**: January 2026  
**Version**: 1.0
