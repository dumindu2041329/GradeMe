interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'student';
  } | null;
  error: Error | null;
}

// Simple mock auth service for frontend demo
export const auth = {
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      // Mock successful login
      return {
        user: {
          id: '1',
          email,
          role: email.includes('admin') ? 'admin' : 'student',
        },
        error: null,
      };
    } catch (error: any) {
      return { 
        user: null, 
        error: new Error(error.message || 'An error occurred during sign in') 
      };
    }
  },

  signOut: async () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
  },

  getUser: async () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole');
    
    if (!isAuthenticated || !userRole) {
      return null;
    }

    return {
      id: '1',
      email: userRole === 'admin' ? 'admin@example.com' : 'student@example.com',
      role: userRole as 'admin' | 'student',
    };
  },

  resetPassword: async (email: string): Promise<{ success: boolean; error: Error | null }> => {
    try {
      // Mock password reset email
      console.log('Password reset email sent to:', email);
      return { success: true, error: null };
    } catch (error: any) {
      return { 
        success: false, 
        error: new Error(error.message || 'Failed to send reset email') 
      };
    }
  }
};