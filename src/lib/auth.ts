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
      // First try admin login
      try {
        const response = await api.post('/users/login', { email, password });
        const user = response.data;

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
      } catch (adminError) {
        // If admin login fails, try student login
        const studentResponse = await api.post('/students/login', { email, password });
        const student = studentResponse.data;

        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'student');
        localStorage.setItem('userId', student._id);

        return {
          user: {
            id: student._id,
            email: student.email,
            role: 'student',
          },
          error: null,
        };
      }
    } catch (error: any) {
      return { 
        user: null, 
        error: new Error(error.response?.data?.message || 'Invalid email or password') 
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
      if (userRole === 'admin') {
        const response = await api.get(`/users/${userId}`);
        const user = response.data;

        return {
          id: user._id,
          email: user.email,
          role: user.role,
        };
      } else {
        const response = await api.get(`/students/${userId}`);
        const student = response.data;

        return {
          id: student._id,
          email: student.email,
          role: 'student',
        };
      }
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