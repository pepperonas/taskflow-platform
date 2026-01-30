import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { store } from './store';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShowcasePage from './pages/ShowcasePage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import TaskDetailPage from './pages/TaskDetailPage';
import WorkflowsPage from './pages/WorkflowsPage';
import WorkflowEditorPageV2 from './pages/WorkflowEditorPageV2';
import CredentialsPage from './pages/CredentialsPage';
import HttpIntegrationPage from './pages/HttpIntegrationPage';
import CodeIntegrationPage from './pages/CodeIntegrationPage';
import DatabaseIntegrationPage from './pages/DatabaseIntegrationPage';
import EmailIntegrationPage from './pages/EmailIntegrationPage';
import SettingsPage from './pages/SettingsPage';
import PrivateRoute from './components/common/PrivateRoute';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected routes with MainLayout */}
            <Route
              path="/showcase"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <ShowcasePage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <DashboardPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <TasksPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/tasks/:id"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <TaskDetailPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/workflows"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <WorkflowsPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/workflows/:id/edit"
              element={
                <PrivateRoute>
                  <WorkflowEditorPageV2 />
                </PrivateRoute>
              }
            />
            <Route
              path="/workflows/new"
              element={
                <PrivateRoute>
                  <WorkflowEditorPageV2 />
                </PrivateRoute>
              }
            />
            <Route
              path="/credentials"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <CredentialsPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/integrations/http"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <HttpIntegrationPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/integrations/code"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <CodeIntegrationPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/integrations/database"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <DatabaseIntegrationPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/integrations/email"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <EmailIntegrationPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <MainLayout>
                    <SettingsPage />
                  </MainLayout>
                </PrivateRoute>
              }
            />

            {/* Redirect root to showcase */}
            <Route path="/" element={<Navigate to="/showcase" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
