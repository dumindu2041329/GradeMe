import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowLeft, GraduationCap, Sun, Moon } from 'lucide-react';
import { auth } from '../lib/auth';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const hour = new Date().getHours();
    const shouldBeDark = hour < 6 || hour >= 18;

    let theme = savedTheme;
    if (!savedTheme) {
      theme = shouldBeDark || prefersDark ? 'dark' : 'light';
    }

    setIsDark(theme === 'dark');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

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
        <Card className="sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent className="py-8">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold mb-2">Check your email</CardTitle>
              <CardDescription className="mb-6">
                We've sent password reset instructions to {email}
              </CardDescription>
              <Button
                variant="link"
                onClick={() => {
                  setIsForgotPassword(false);
                  setResetEmailSent(false);
                  setEmail('');
                }}
                className="flex items-center gap-2 mx-auto"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center px-4 sm:px-6 lg:px-8">
      <Button
        variant="outline"
        size="icon"
        onClick={toggleTheme}
        className="absolute top-4 right-4"
      >
        {isDark ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Moon className="h-5 w-5" />
        )}
      </Button>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary via-primary/90 to-primary rounded-2xl shadow-xl flex items-center justify-center mb-4 transform hover:rotate-6 transition-transform duration-300">
            <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-2">GradeMe</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {isForgotPassword ? 'Reset your password' : 'Sign in to your account'}
          </p>
        </div>
      </div>

      <Card className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <CardContent className="py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>

            {!isForgotPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isForgotPassword ? 'Sending reset link...' : 'Signing in...'}
                </div>
              ) : (
                isForgotPassword ? 'Send reset link' : 'Sign in'
              )}
            </Button>

            <Button
              type="button"
              variant="link"
              onClick={() => {
                setIsForgotPassword(!isForgotPassword);
                setError(null);
              }}
              className="w-full"
            >
              {isForgotPassword ? 'Back to login' : 'Forgot your password?'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;