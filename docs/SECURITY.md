# Security Documentation

This document describes the security features and measures implemented in the TaskFlow Platform.

## SQL Injection Protection

The Database Integration feature includes comprehensive protection against SQL injection attacks and other security threats.

### Security Measures

#### 1. Query Type Restrictions
- **Only SELECT and WITH (CTE) queries are allowed**
- Write operations (INSERT, UPDATE, DELETE, DROP, etc.) are completely blocked
- Prevents data modification or deletion

#### 2. Dangerous Keyword Detection
The following SQL keywords are blocked:
- `DROP`, `DELETE`, `TRUNCATE`, `ALTER`, `CREATE`, `INSERT`, `UPDATE`
- `GRANT`, `REVOKE`, `EXEC`, `EXECUTE`
- SQL Server procedures: `xp_`, `sp_`
- Comment markers: `--`, `/*`, `*/`
- Script injection: `script`, `javascript`, `vbscript`, `onload`, `onerror`

**Word Boundary Validation**: Keywords are checked as whole words only, preventing false positives. For example:
- ✅ `SELECT created_at FROM tasks` - Allowed (column name)
- ❌ `CREATE TABLE test` - Blocked (dangerous keyword)

#### 3. SQL Injection Pattern Detection
- **Comment-based injection**: Detects `--`, `/*`, `*/` patterns
- **UNION-based injection**: Detects multiple UNION statements or suspicious UNION patterns
- **Stacked queries**: Detects multiple statements separated by semicolons

#### 4. Query Length Limit
- Maximum query length: 10,000 characters
- Prevents extremely long queries that could cause performance issues

#### 5. Security Alert Logging
All suspicious activity is logged with:
- User ID
- Query content
- Reason for blocking
- Timestamp

Example alert format:
```
╔══════════════════════════════════════════════════════════════╗
║              🚨 SECURITY ALERT - SQL INJECTION ATTEMPT      ║
╠══════════════════════════════════════════════════════════════╣
║ User ID:     admin                                           ║
║ Reason:      Query contains prohibited keyword: DROP         ║
║ Query:       DROP TABLE users; --                            ║
║ Timestamp:   Fri Jan 30 03:12:05 UTC 2026                     ║
╚══════════════════════════════════════════════════════════════╝
```

### Implementation Details

**Location**: `backend/task-service/src/main/java/io/celox/taskflow/task/controller/DatabaseController.java`

**Key Methods**:
- `validateQuery()` - Validates query for security threats
- `containsSqlInjectionPattern()` - Detects SQL injection patterns
- `logSecurityAlert()` - Logs security alerts

**Query Processing**:
1. Query is trimmed and validated
2. Trailing semicolons are automatically removed (JdbcTemplate requirement)
3. Security validation runs before execution
4. Only validated queries are executed

**Error Handling**:
- Root cause extraction from exception chain for clearer error messages
- PostgreSQL error messages are directly shown to users (e.g., "ERROR: column 'name' does not exist")
- SQL syntax errors are not logged as security alerts (only actual security threats trigger alerts)
- Improved error messages help users identify and fix query issues quickly

## Authentication & Authorization

### JWT Token Security
- Tokens are validated on every request
- Invalid or expired tokens are rejected
- Automatic redirect to login on authentication failure

### Error Handling
- **401 Unauthorized**: Returned when user is not authenticated
- **403 Forbidden**: Returned when user lacks required permissions
- Clear error messages guide users to resolve authentication issues

### Token Management
- Tokens stored in `localStorage` (frontend)
- Automatic token attachment to API requests via `axiosInstance`
- Automatic cleanup on authentication errors

## Best Practices

### For Developers
1. **Never bypass security validations** - All queries must go through validation
2. **Monitor security logs** - Review alerts regularly
3. **Keep dependencies updated** - Security patches are important
4. **Use parameterized queries** - When adding new database operations

### For Users
1. **Use SELECT queries only** - Write operations are not permitted
2. **Avoid suspicious patterns** - Even in legitimate queries
3. **Report security issues** - Contact administrators if you encounter problems

## Security Features Summary

| Feature | Status | Description |
|---------|--------|-------------|
| SQL Injection Protection | ✅ Active | Multi-layer validation and pattern detection |
| Query Type Restrictions | ✅ Active | Only SELECT and WITH queries allowed |
| Keyword Blocking | ✅ Active | Dangerous keywords blocked with word boundaries |
| Security Alert Logging | ✅ Active | All suspicious activity logged |
| Authentication | ✅ Active | JWT-based authentication required |
| Authorization | ✅ Active | Role-based access control |
| Error Handling | ✅ Active | Clear error messages without exposing internals |

## Monitoring

Security alerts are logged to:
- Application logs (standard output)
- System error stream (`System.err`)
- Can be integrated with log aggregation tools (ELK, Splunk, etc.)

## Reporting Security Issues

If you discover a security vulnerability, please:
1. **Do not** create a public issue
2. Contact: security@celox.io
3. Include detailed information about the vulnerability
4. Allow time for the issue to be addressed before public disclosure

---

**Last Updated**: February 2026  
**Version**: 1.1
