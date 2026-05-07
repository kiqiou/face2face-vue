import { authService } from '../utils/auth.js';

export async function authFetch(url: string, options: any = {}) {
  let token = localStorage.getItem('access_token');

  let response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    try {
      token = await authService.refreshAccessToken();

      response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      console.error('Разлогиниваем');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  }

  return response;
}
