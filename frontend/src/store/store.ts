import { defineStore } from 'pinia';
import { REFRESH_TOKEN } from '../services/queries/graphqlAPI';

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
    user: JSON.parse(localStorage.getItem('user') || 'null'), // Retrieve user from local storage
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
      localStorage.setItem('user', JSON.stringify(user)); // Store user in local storage
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
      localStorage.removeItem('user'); // Remove user from local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    async refreshAccessToken(): Promise<string | null> {
      try {
        // Call the REFRESH_TOKEN mutation to get a new access token
        const newAccessToken = await REFRESH_TOKEN(this.refreshToken || '');

        // Update the stored access token in the store and local storage
        this.accessToken = newAccessToken;
        localStorage.setItem('accessToken', newAccessToken);

        return newAccessToken;
      } catch (error) {
        console.error("Error refreshing access token:", error);
        // Handle error as needed, e.g., log out the user or show an error message
        // You might want to throw an error here to be caught at the component level
        throw error;
      }
    },
  },
});
