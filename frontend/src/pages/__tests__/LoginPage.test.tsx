import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import LoginPage from '../LoginPage';
import authReducer from '../../store/slices/authSlice';
import { authApi } from '../../api/authApi';

// Mock the API
jest.mock('../../api/authApi');
const mockedAuthApi = authApi as jest.Mocked<typeof authApi>;

const createMockStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
  });
};

describe('LoginPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render login form', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByLabelText(/Benutzername/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Passwort/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Anmelden/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    const submitButton = screen.getByRole('button', { name: /Anmelden/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Form validation should prevent submission
      expect(mockedAuthApi.login).not.toHaveBeenCalled();
    });
  });

  it('should submit login form with valid data', async () => {
    const store = createMockStore();
    const mockResponse = {
      data: {
        token: 'jwt-token',
        user: { id: '1', username: 'test', email: 'test@example.com' },
      },
    };

    mockedAuthApi.login.mockResolvedValue(mockResponse);

    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    const usernameInput = screen.getByLabelText(/Benutzername/i);
    const passwordInput = screen.getByLabelText(/Passwort/i);
    const submitButton = screen.getByRole('button', { name: /Anmelden/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockedAuthApi.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });
  });

  it('should display error message on login failure', async () => {
    const store = createMockStore();
    mockedAuthApi.login.mockRejectedValue({
      response: { data: { message: 'Ungültige Anmeldedaten' } },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </Provider>
    );

    const usernameInput = screen.getByLabelText(/Benutzername/i);
    const passwordInput = screen.getByLabelText(/Passwort/i);
    const submitButton = screen.getByRole('button', { name: /Anmelden/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
