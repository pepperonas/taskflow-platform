# Testing Guide

This document provides a comprehensive guide to testing the TaskFlow Platform.

## Test Structure

### Backend Tests

Located in `backend/task-service/src/test/java/`

#### Unit Tests
- **Service Tests**: Test business logic in isolation
  - `TaskServiceTest.java` - Task service unit tests
  - `AuthServiceTest.java` - Authentication service tests
- **Controller Tests**: Test REST API endpoints
  - `TaskControllerTest.java` - Task API endpoint tests
  - `AuthControllerTest.java` - Authentication endpoint tests

#### Integration Tests
- **Database Integration**: Tests with real PostgreSQL using Testcontainers
  - `TaskIntegrationTest.java` - Full database integration tests

### Frontend Tests

Located in `frontend/src/`

#### Unit Tests
- **Redux Slice Tests**: Test state management
  - `store/slices/__tests__/authSlice.test.ts`
  - `store/slices/__tests__/tasksSlice.test.ts`
- **Component Tests**: Test React components
  - `components/common/__tests__/PrivateRoute.test.tsx`
  - `pages/__tests__/LoginPage.test.tsx`

#### E2E Tests
- **Playwright Tests**: End-to-end browser tests
  - `e2e/tests/auth.spec.ts` - Authentication flows
  - `e2e/tests/tasks.spec.ts` - Task management flows
  - `e2e/tests/workflows.spec.ts` - Workflow management flows

## Running Tests

### Backend Tests

#### Run all tests
```bash
cd backend
mvn test
```

#### Run specific test class
```bash
cd backend
mvn test -Dtest=TaskServiceTest
```

#### Run integration tests
```bash
cd backend
mvn verify
```

#### Run with coverage
```bash
cd backend
mvn test jacoco:report
```

### Frontend Tests

#### Run all tests
```bash
cd frontend
npm test
```

#### Run tests in watch mode
```bash
cd frontend
npm test -- --watch
```

#### Run tests with coverage
```bash
cd frontend
npm run test:coverage
```

#### Run E2E tests
```bash
cd frontend
npm run test:e2e
```

#### Run E2E tests with UI
```bash
cd frontend
npm run test:e2e:ui
```

## Test Coverage Goals

- **Backend**: Minimum 70% code coverage
- **Frontend**: Minimum 60% code coverage
- **Critical Paths**: 90%+ coverage (authentication, task creation, workflow execution)

## Writing Tests

### Backend Test Guidelines

1. **Use Given-When-Then pattern**
2. **Mock external dependencies** (Kafka, external APIs)
3. **Use Testcontainers for integration tests**
4. **Test both success and failure scenarios**

Example:
```java
@Test
void shouldCreateTaskSuccessfully() {
    // Given
    CreateTaskDto createDto = CreateTaskDto.builder()
            .title("Test Task")
            .build();
    
    // When
    TaskDto result = taskService.createTask(createDto);
    
    // Then
    assertNotNull(result);
    assertEquals("Test Task", result.getTitle());
}
```

### Frontend Test Guidelines

1. **Use React Testing Library** for component tests
2. **Test user interactions**, not implementation details
3. **Mock API calls** using jest.mock
4. **Use renderWithProviders** helper for Redux-connected components

Example:
```typescript
it('should render login form', () => {
  renderWithProviders(<LoginPage />);
  
  expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
});
```

### E2E Test Guidelines

1. **Test user flows**, not individual components
2. **Use data-testid** for reliable element selection
3. **Wait for network requests** to complete
4. **Clean up test data** after each test

Example:
```typescript
test('should create a new task', async ({ page }) => {
  await page.goto('/tasks');
  await page.getByRole('button', { name: /create/i }).click();
  await page.getByLabel(/title/i).fill('E2E Test Task');
  await page.getByRole('button', { name: /save/i }).click();
  await expect(page.getByText('E2E Test Task')).toBeVisible();
});
```

## CI/CD Integration

Tests run automatically on:
- **Push to main/develop branches**
- **Pull requests**

See `.github/workflows/tests.yml` for CI configuration.

## Test Data

### Backend Test Data
- Use `@BeforeEach` to set up test data
- Use `@Transactional` for database tests to auto-rollback
- Use Testcontainers for isolated database instances

### Frontend Test Data
- Mock API responses in tests
- Use factories for test data creation
- Clean up localStorage between tests

## Debugging Tests

### Backend
```bash
# Run with debug output
mvn test -X

# Run specific test with debugger
mvn -Dtest=TaskServiceTest -Dmaven.surefire.debug test
```

### Frontend
```bash
# Run tests with debug output
npm test -- --verbose

# Run tests in watch mode
npm test -- --watch
```

### E2E
```bash
# Run in headed mode
npx playwright test --headed

# Run with debug mode
npx playwright test --debug

# Run specific test
npx playwright test auth.spec.ts
```

## Best Practices

1. **Write tests first** (TDD) for new features
2. **Keep tests independent** - no shared state
3. **Use descriptive test names** - "should do X when Y"
4. **Test edge cases** - null, empty, invalid inputs
5. **Maintain test coverage** - aim for 70%+ overall
6. **Keep tests fast** - unit tests should run in < 1s
7. **Mock external services** - don't hit real APIs in tests
8. **Use fixtures** for common test data

## Troubleshooting

### Backend Tests Failing
- Check database connection (Testcontainers)
- Verify Kafka is not required for unit tests
- Check Spring context loading

### Frontend Tests Failing
- Clear node_modules and reinstall
- Check Jest configuration
- Verify mocks are set up correctly

### E2E Tests Failing
- Check if services are running
- Verify base URL is correct
- Check for timing issues (add waits)

## Resources

- [JUnit 5 Documentation](https://junit.org/junit5/docs/current/user-guide/)
- [Mockito Documentation](https://javadoc.io/doc/org.mockito/mockito-core/latest/org/mockito/Mockito.html)
- [Testcontainers Documentation](https://www.testcontainers.org/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)
