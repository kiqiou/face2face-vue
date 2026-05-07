import { ref } from 'vue';

class AuthService {
  private ACCESS_TOKEN = 'access_token';
  private REFRESH_TOKEN = 'refresh_token';
  private USER = 'user';

  public currentUser = ref(this.getUser());

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

  logout() {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem(this.USER);

    this.currentUser.value = null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  async refreshAccessToken(): Promise<string | null> {
    const refresh = this.getRefreshToken();

    if (!refresh) {
      this.logout();
      return null;
    }

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/api/users/token/refresh/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        }
      );

      if (!response.ok) {
        this.logout();
        return null;
      }

      const data = await response.json();

      localStorage.setItem(this.ACCESS_TOKEN, data.access);

      return data.access;
    } catch (err) {
      console.error('Refresh error:', err);
      this.logout();
      return null;
    }
  }
}

export const authService = new AuthService();
