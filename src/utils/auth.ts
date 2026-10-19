import { ref } from 'vue';
import { User } from '../models/user.js';
import { BASE_API } from '../composables/baseApi.js';

class AuthService {
  private ACCESS_TOKEN = 'access_token';
  private REFRESH_TOKEN = 'refresh_token';
  private USER = 'user';

  public currentUser = ref(this.getUser());
  private refreshPromise: Promise<string | null> | null = null;

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER);
    return user ? JSON.parse(user) : null;
  }

  setTokens(access: string, refresh: string, user: any) {
    localStorage.setItem(this.ACCESS_TOKEN, access);
    localStorage.setItem(this.REFRESH_TOKEN, refresh);
    localStorage.setItem(this.USER, JSON.stringify(user));

    this.currentUser.value = user;
  }

  updateUser(user: User) {
    localStorage.setItem(this.USER, JSON.stringify(user));
    this.currentUser.value = user;
  }

  logout() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.USER);

    this.currentUser.value = null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

    refreshAccessToken(): Promise<string | null> {
    if (!this.refreshPromise) {
      this.refreshPromise = this.doRefresh().finally(() => {
        this.refreshPromise = null;
      });
    }
    return this.refreshPromise;
  }

  private async doRefresh(): Promise<string | null> {
    const refresh = this.getRefreshToken();
    if (!refresh) {
      this.logout();
      return null;
    }

    try {
      const response = await fetch(BASE_API + 'api/users/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });

      // Сервер явно сказал "токен невалиден" — вот тогда выходим
      if (response.status === 400 || response.status === 401) {
        this.logout();
        return null;
      }

      // Сервер лёг / 5xx — не разлогиниваем, попробуем позже
      if (!response.ok) return null;

      const data = await response.json();
      localStorage.setItem(this.ACCESS_TOKEN, data.access);
      if (data.refresh) {
        localStorage.setItem(this.REFRESH_TOKEN, data.refresh); // при ротации
      }
      return data.access;
    } catch (err) {
      console.error('Refresh error:', err); // сеть моргнула — сессию не трогаем
      return null;
    }
  }
}

export const authService = new AuthService();
