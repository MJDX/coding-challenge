import { defineStore } from 'pinia';

interface RootState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface User {
  id: number;
  username: string;
}

export const useAuthStore = defineStore('auth', {
  state: (): RootState => ({
    user: null,
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
  }),
  getters: {
    isAuthenticated(state): boolean {
      return state.accessToken !== null;
    },
  },
  actions: {
    setUser(user: User): void {
      this.user = user;
    },
    setTokens({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }): void {
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    },
    logout(): void {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
});
