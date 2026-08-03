import { apiClient } from './client';

export interface ChartData {
  name: string;
  [key: string]: string | number;
}

export const analyticsApi = {
  getFinancialStats: () =>
    apiClient.get<ChartData[]>('/admin/dashboard/stats/financial'),

  getEnrollmentStats: () =>
    apiClient.get<ChartData[]>('/admin/dashboard/stats/enrollment'),
};
