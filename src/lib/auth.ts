import api from '../services/api';

interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'student';
  } | null;
  error: Error | null;
}

export const auth = {
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await api.post('/users/login', { email, password });
      const user = response.data;

      // Store auth state
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userId', user._id);

      return {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        error: null,
      };
    } catch (error: any) {
      return { 
        user: null, 
        error: new Error(error.response?.data?.message || 'Authentication failed') 
      };
    }
  },

  signOut: async () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
  },

  getUser: async () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    
    if (!isAuthenticated || !userRole || !userId) {
      return null;
    }

    try {
      const response = await api.get(`/users/${userId}`);
      const user = response.data;

      return {
        id: user._id,
        email: user.email,
        role: user.role,
      };
    } catch (error) {
      return null;
    }
  },

  resetPassword: async (email: string): Promise<{ success: boolean; error: Error | null }> => {
    try {
      await api.post('/users/reset-password', { email });
      return { success: true, error: null };
    } catch (error: any) {
      return { 
        success: false, 
        error: new Error(error.response?.data?.message || 'Failed to send reset email') 
      };
    }
  }
};