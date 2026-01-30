import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PrivateRoute from '../PrivateRoute';
import authReducer from '../../../store/slices/authSlice';

const createMockStore = (initialAuthState: any) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: initialAuthState,
    },
  });
};

describe('PrivateRoute', () => {
  const TestComponent = () => <div>Protected Content</div>;

  it('should render children when user is authenticated', () => {
    const store = createMockStore({
      user: { id: '1', username: 'test', email: 'test@example.com' },
      token: 'jwt-token',
      loading: false,
      error: null,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PrivateRoute>
            <TestComponent />
          </PrivateRoute>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    const store = createMockStore({
      user: null,
      token: null,
      loading: false,
      error: null,
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <PrivateRoute>
            <TestComponent />
          </PrivateRoute>
        </BrowserRouter>
      </Provider>
    );

    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});
