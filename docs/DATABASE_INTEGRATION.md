# Database Integration Documentation

## Overview

The Database Integration feature allows users to execute SQL queries directly against the PostgreSQL database through a secure, validated interface. This feature is designed for data retrieval, reporting, and workflow automation.

## Access

**URL**: `/integrations/database`  
**API Endpoint**: `POST /api/v1/database/query`

## Features

- ✅ **Secure Query Execution**: All queries are validated for security threats
- ✅ **Real-time Results**: Query results displayed immediately
- ✅ **Example Queries**: Pre-built examples for common use cases
- ✅ **Error Handling**: Clear error messages for debugging
- ✅ **Query History**: Track executed queries and their results

## Database Schema

### Tasks Table

The `tasks` table has the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title` | VARCHAR(200) | Task title (not `name`) |
| `description` | VARCHAR(2000) | Task description |
| `status` | VARCHAR(20) | Task status (OPEN, IN_PROGRESS, COMPLETED, CANCELLED) |
| `priority` | VARCHAR(20) | Task priority (LOW, MEDIUM, HIGH, URGENT) |
| `category` | VARCHAR(20) | Task category |
| `assignee_id` | UUID | Foreign key to users table |
| `due_date` | TIMESTAMP | Task due date |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Last update timestamp |
| `completed_at` | TIMESTAMP | Completion timestamp |

### Important Notes

⚠️ **Column Names**:
- Use `title` (not `name`) for task titles
- Use `assignee_id` (not `assigned_user_id`) for user references

⚠️ **Status Values**:
- Use uppercase enum values: `'OPEN'`, `'IN_PROGRESS'`, `'COMPLETED'`, `'CANCELLED'`
- Do not use lowercase values like `'pending'` or `'in_progress'`

## Example Queries

### 1. Select Open Tasks

```sql
SELECT id, title, status, created_at 
FROM tasks 
WHERE status = 'OPEN' 
ORDER BY created_at DESC 
LIMIT 10;
```

### 2. Count Workflows by Status

```sql
SELECT 
  COUNT(*) as total,
  COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active,
  COUNT(CASE WHEN status = 'DRAFT' THEN 1 END) as draft
FROM workflows;
```

### 3. Join Tasks with Users

```sql
SELECT 
  t.id,
  t.title,
  t.status,
  t.priority,
  u.email as assigned_to,
  u.username
FROM tasks t
LEFT JOIN users u ON t.assignee_id = u.id
WHERE t.status = 'IN_PROGRESS';
```

## Security Restrictions

### Allowed Operations

- ✅ `SELECT` queries
- ✅ `WITH` (Common Table Expressions - CTEs)
- ✅ `JOIN` operations
- ✅ Aggregate functions (`COUNT`, `SUM`, `AVG`, etc.)
- ✅ Subqueries

### Blocked Operations

- ❌ `INSERT`, `UPDATE`, `DELETE`
- ❌ `DROP`, `TRUNCATE`, `ALTER`, `CREATE`
- ❌ `GRANT`, `REVOKE`
- ❌ Stored procedures (`EXEC`, `EXECUTE`)
- ❌ Multiple statements (stacked queries)
- ❌ SQL injection patterns

For detailed security information, see [Security Documentation](SECURITY.md).

## Error Handling

The Database Integration provides clear error messages:

### Common Errors

1. **Column Not Found**
   ```
   ERROR: column "name" does not exist
   ```
   **Solution**: Use `title` instead of `name` for tasks table

2. **Invalid Status Value**
   ```
   ERROR: invalid input value for enum
   ```
   **Solution**: Use uppercase enum values: `'OPEN'`, `'IN_PROGRESS'`, etc.

3. **Security Validation Failed**
   ```
   Query contains prohibited keyword: DROP
   ```
   **Solution**: Only SELECT and WITH queries are allowed

### Error Message Improvements

- Root cause extraction from exception chain
- PostgreSQL error messages shown directly
- SQL syntax errors not logged as security alerts
- Clear guidance for fixing query issues

## API Usage

### Request

```bash
POST /api/v1/database/query
Content-Type: application/json
Authorization: Bearer <token>

{
  "query": "SELECT id, title, status FROM tasks WHERE status = 'OPEN' LIMIT 10"
}
```

### Response

```json
{
  "rows": [
    {
      "id": "a0c23ec1-de64-4711-90b9-26ddaf750957",
      "title": "Test Task",
      "status": "OPEN",
      "created_at": "2026-01-24T07:43:40.702+00:00"
    }
  ],
  "rowCount": 1,
  "executionTimeMs": 13,
  "error": null
}
```

### Error Response

```json
{
  "rows": null,
  "rowCount": 0,
  "executionTimeMs": 5,
  "error": "ERROR: column \"name\" does not exist"
}
```

## Best Practices

### 1. Use Correct Column Names

Always refer to the actual database schema:
- ✅ `SELECT title FROM tasks`
- ❌ `SELECT name FROM tasks`

### 2. Use Correct Enum Values

Always use uppercase enum values:
- ✅ `WHERE status = 'OPEN'`
- ❌ `WHERE status = 'pending'`

### 3. Limit Query Results

Always use `LIMIT` for large datasets:
```sql
SELECT * FROM tasks LIMIT 100;
```

### 4. Use Indexed Columns

For better performance, filter on indexed columns:
- `status` (indexed)
- `assignee_id` (indexed)
- `due_date` (indexed)

### 5. Test Queries First

Use the example queries as templates and modify them incrementally.

## Troubleshooting

### Query Returns No Results

1. Check if data exists: `SELECT COUNT(*) FROM tasks;`
2. Verify status values match enum values
3. Check for typos in column names

### Query Fails with Security Error

1. Ensure query starts with `SELECT` or `WITH`
2. Remove any dangerous keywords
3. Check for SQL injection patterns (comments, multiple statements)

### Slow Query Performance

1. Add `LIMIT` clause
2. Use indexed columns in `WHERE` clause
3. Avoid `SELECT *` - specify columns explicitly

## Integration with Workflows

Database queries can be used in workflows through the Database Node:

1. Add a Database Node to your workflow
2. Configure the SQL query
3. Use expression syntax for dynamic values: `{{ $trigger.field }}`
4. Access results in subsequent nodes: `{{ nodeId_result.rows }}`

## Monitoring

All database queries are logged with:
- User ID
- Query content
- Execution time
- Result count
- Errors (if any)

Security alerts are logged separately for suspicious activity.

## Support

For issues or questions:
- Check [Security Documentation](SECURITY.md) for security-related questions
- Review example queries in the UI
- Check application logs for detailed error information

---

**Last Updated**: January 2026  
**Version**: 1.0
