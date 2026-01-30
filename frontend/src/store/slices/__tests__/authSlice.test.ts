import { configureStore } from '@reduxjs/toolkit';
import authReducer, { login, register, logout } from '../authSlice';
import { authApi } from '../../../api/authApi';

// Mock the API
jest.mock('../../../api/authApi');
const mockedAuthApi = authApi as jest.Mocked<typeof authApi>;

describe('authSlice', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('logout', () => {
    it('should clear user and token from state and localStorage', () => {
      // Setup initial state
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: '1', username: 'test' }));

      store.dispatch(logout());

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('login', () => {
    it('should handle login pending state', () => {
      mockedAuthApi.login.mockImplementation(() => new Promise(() => {})); // Never resolves

      store.dispatch(login({ username: 'test', password: 'password' }));

      const state = store.getState().auth;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle successful login', async () => {
      const mockResponse = {
        data: {
          token: 'jwt-token',
          user: { id: '1', username: 'test', email: 'test@example.com' },
        },
      };

      mockedAuthApi.login.mockResolvedValue(mockResponse);

      await store.dispatch(login({ username: 'test', password: 'password' }));

      const state = store.getState().auth;
      expect(state.loading).toBe(false);
      expect(state.token).toBe('jwt-token');
      expect(state.user).toEqual(mockResponse.data.user);
      expect(localStorage.getItem('token')).toBe('jwt-token');
    });

    it('should handle login failure', async () => {
      const errorMessage = 'Invalid credentials';
      mockedAuthApi.login.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await store.dispatch(login({ username: 'test', password: 'wrong' }));

      const state = store.getState().auth;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.token).toBeNull();
    });
  });

  describe('register', () => {
    it('should handle registration pending state', () => {
      mockedAuthApi.register.mockImplementation(() => new Promise(() => {}));

      store.dispatch(register({ username: 'test', email: 'test@example.com', password: 'password' }));

      const state = store.getState().auth;
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle successful registration', async () => {
      const mockResponse = {
        data: {
          token: 'jwt-token',
          user: { id: '1', username: 'test', email: 'test@example.com' },
        },
      };

      mockedAuthApi.register.mockResolvedValue(mockResponse);

      await store.dispatch(register({ username: 'test', email: 'test@example.com', password: 'password' }));

      const state = store.getState().auth;
      expect(state.loading).toBe(false);
      expect(state.token).toBe('jwt-token');
      expect(state.user).toEqual(mockResponse.data.user);
    });

    it('should handle registration failure', async () => {
      const errorMessage = 'Username already exists';
      mockedAuthApi.register.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await store.dispatch(register({ username: 'test', email: 'test@example.com', password: 'password' }));

      const state = store.getState().auth;
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });
});
