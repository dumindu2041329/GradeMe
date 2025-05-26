import { mockUsers } from './mockData';

interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'student';
    name: string;
  } | null;
  error: Error | null;
}

export const auth = {
  signIn: async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const user = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid email or password');
      }

      const { password: _, ...userData } = user;
      
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userRole', userData.role);
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('userName', userData.name);

      return {
        user: userData,
        error: null,
      };
    } catch (error: any) {
      return { 
        user: null, 
        error: error instanceof Error ? error : new Error('An unexpected error occurred')
      };
    }
  },

  signOut: async () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
  },

  getUser: async () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userRole = localStorage.getItem('userRole') as 'admin' | 'student';
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    
    if (!isAuthenticated || !userRole || !userId || !userName) {
      return null;
    }

    return {
      id: userId,
      role: userRole,
      name: userName,
      email: mockUsers.find(u => u.id === userId)?.email || '',
    };
  },

  resetPassword: async (email: string): Promise<{ success: boolean; error: Error | null }> => {
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return {
        success: false,
        error: new Error('No account found with this email address.')
      };
    }

    return { success: true, error: null };
  }
};