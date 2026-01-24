import axios from './axios';
import { AuthResponse, LoginDto, RegisterDto } from '../types';

export const authApi = {
  register: (data: RegisterDto) =>
    axios.post<AuthResponse>('/v1/auth/register', data),

  login: (data: LoginDto) => axios.post<AuthResponse>('/v1/auth/login', data),
};
