import axios from './axios';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../types';

export const taskApi = {
  getAllTasks: () => axios.get<Task[]>('/v1/tasks'),

  getTaskById: (id: string) => axios.get<Task>(`/v1/tasks/${id}`),

  getTasksByAssignee: (assigneeId: string) =>
    axios.get<Task[]>(`/v1/tasks/assignee/${assigneeId}`),

  getTasksByStatus: (status: TaskStatus) =>
    axios.get<Task[]>(`/v1/tasks/status/${status}`),

  createTask: (task: CreateTaskDto) => axios.post<Task>('/v1/tasks', task),

  updateTask: (id: string, task: UpdateTaskDto) =>
    axios.put<Task>(`/v1/tasks/${id}`, task),

  deleteTask: (id: string) => axios.delete(`/v1/tasks/${id}`),
};
