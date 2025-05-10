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
        // Check for network errors first
        if (!adminError.response) {
          throw new Error('Network error. Please check your connection and try again.');
        }

        // Handle specific admin login errors
        if (adminError.response?.status === 401) {
          // Don't throw here, try student login instead
          console.log('Admin login failed, trying student login...');
        } else if (adminError.response?.status === 429) {
          throw new Error('Too many login attempts. Please try again later.');
        } else if (adminError.response?.status >= 500) {
          throw new Error('Server error. Please try again later.');
        }

        // Try student login
        try {
          const studentResponse = await api.post('/students/login', { email, password });
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
          // Check for network errors
          if (!studentError.response) {
            throw new Error('Network error. Please check your connection and try again.');
          }

          // Handle specific student login errors
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
      // Handle any uncaught errors with a specific message
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
      const endpoint = userRole === 'admin' ? `/users/${userId}` : `/students/${userId}`;
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

      const response = await api.post('/users/reset-password', { email });
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }

      return { success: true, error: null };
    } catch (error: any) {
      // Handle specific error cases
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