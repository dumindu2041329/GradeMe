import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { auth } from '../lib/auth';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return 'Email is required';
    }
    if (!email.includes('@')) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const validateForm = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!isForgotPassword) {
      if (!password.trim()) {
        setError('Password is required');
        return false;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isForgotPassword) {
        const { success, error } = await auth.resetPassword(email);
        if (error) throw error;
        setResetEmailSent(true);
      } else {
        const { user, error } = await auth.signIn(email, password);
        if (error) throw error;
        if (!user) throw new Error('Authentication failed');

        // Store auth state
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', user.role);

        navigate(user.role === 'admin' ? '/' : '/student', { replace: true });
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (resetEmailSent) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-border">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Check your email</h2>
              <p className="text-muted-foreground mb-6">
                We've sent password reset instructions to {email}
              </p>
              <button
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetEmailSent(false);
                  setEmail('');
                }}
                className="text-primary hover:text-primary/90 flex items-center justify-center gap-2 mx-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-primary/10 p-3 ring-2 ring-primary/20">
            <Lock className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-foreground">
          {isForgotPassword ? 'Reset your password' : 'Sign in to your account'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-border">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-card-foreground">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-card-foreground">
                  Password
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-input rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-primary focus:border-primary sm:text-sm bg-background text-foreground pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isForgotPassword ? 'Sending reset link...' : 'Signing in...'}
                  </div>
                ) : (
                  isForgotPassword ? 'Send reset link' : 'Sign in'
                )}
              </button>
            </div>

            <div className="text-sm text-center">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(!isForgotPassword);
                  setError(null);
                }}
                className="text-primary hover:text-primary/90"
              >
                {isForgotPassword ? 'Back to login' : 'Forgot your password?'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;