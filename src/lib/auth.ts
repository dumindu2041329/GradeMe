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
      try {
        const response = await api.post('/api/users/login', { email, password });
        const user = response.data;

        if (!user || !user._id || !user.email || !user.role) {
          throw new Error('Invalid user data received from server');
        }

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
      } catch (adminError: any) {
        if (!adminError.response) {
          throw new Error('Network error. Please check your connection and try again.');
        }

        if (adminError.response?.status === 401) {
          console.log('Admin login failed, trying student login...');
        } else if (adminError.response?.status === 429) {
          throw new Error('Too many login attempts. Please try again later.');
        } else if (adminError.response?.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }

        try {
          const studentResponse = await api.post('/api/students/login', { email, password });
          const student = studentResponse.data;

          if (!student || !student._id || !student.email) {
            throw new Error('Invalid student data received from server');
          }

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
        } catch (studentError: any) {
          if (!studentError.response) {
            throw new Error('Network error. Please check your connection and try again.');
          }

          if (studentError.response?.status === 401) {
            throw new Error('Invalid email or password.');
          } else if (studentError.response?.status === 429) {
            throw new Error('Too many login attempts. Please try again later.');
          } else if (studentError.response?.status >= 500) {
            throw new Error('Server error. Please try again later.');
          }

          throw new Error('Invalid credentials');
        }
      }
    } catch (error: any) {
      return { 
        user: null, 
        error: error instanceof Error 
          ? error 
          : new Error(error?.message || 'An unexpected error occurred. Please try again.') 
      };
    }
  },

  signOut: async () => {
    try {
      localStorage.removeItem('userRole');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userId');
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  },

  getUser: async () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');
    const userId = localStorage.getItem('userId');
    
    if (!isAuthenticated || !userRole || !userId) {
      return null;
    }

    try {
      const endpoint = userRole === 'admin' ? `/api/users/${userId}` : `/api/students/${userId}`;
      const response = await api.get(endpoint);
      const userData = response.data;

      if (!userData || !userData._id || !userData.email) {
        throw new Error('Invalid user data received from server');
      }

      return {
        id: userData._id,
        email: userData.email,
        role: userRole === 'admin' ? userData.role : 'student',
      };
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      return null;
    }
  },

  resetPassword: async (email: string): Promise<{ success: boolean; error: Error | null }> => {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const response = await api.post('/api/users/reset-password', { email });
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      return { success: true, error: null };
    } catch (error: any) {
      if (!error.response) {
        return {
          success: false,
          error: new Error('Network error. Please check your connection and try again.')
        };
      }

      if (error.response.status === 404) {
        return {
          success: false,
          error: new Error('No account found with this email address.')
        };
      }

      if (error.response.status === 429) {
        return {
          success: false,
          error: new Error('Too many reset attempts. Please try again later.')
        };
      }

      return { 
        success: false, 
        error: new Error(error.response?.data?.message || 'Failed to send reset email. Please try again.') 
      };
    }
  }
};