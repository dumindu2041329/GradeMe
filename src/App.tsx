import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { BookOpen, Users, FileSpreadsheet, Settings, LogOut, Sun, Moon } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Exams from './components/Exams';
import Students from './components/Students';
import Results from './components/Results';
import Login from './components/Login';

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const hour = new Date().getHours();
    const shouldBeDark = hour < 6 || hour >= 18;

    let theme = savedTheme;
    if (!savedTheme) {
      theme = shouldBeDark || prefersDark ? 'dark' : 'light';
    }

    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return children;
};

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        <aside className="w-64 bg-card border-r border-border">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              GradeMe
            </h1>
          </div>
          <nav className="mt-6">
            <Link to="/" className="flex items-center px-6 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <FileSpreadsheet className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
            <Link to="/exams" className="flex items-center px-6 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <BookOpen className="h-5 w-5 mr-3" />
              Exams
            </Link>
            <Link to="/students" className="flex items-center px-6 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <Users className="h-5 w-5 mr-3" />
              Students
            </Link>
            <Link to="/results" className="flex items-center px-6 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <FileSpreadsheet className="h-5 w-5 mr-3" />
              Results
            </Link>
          </nav>
          <div className="absolute bottom-0 w-64 p-6 space-y-2 border-t border-border">
            <button
              onClick={toggleTheme}
              className="flex items-center px-4 py-2 text-muted-foreground hover:text-foreground w-full rounded-md hover:bg-accent"
            >
              {isDark ? (
                <Sun className="h-5 w-5 mr-2" />
              ) : (
                <Moon className="h-5 w-5 mr-2" />
              )}
              {isDark ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-muted-foreground hover:text-destructive w-full rounded-md hover:bg-accent"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </aside>
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/exams"
            element={
              <PrivateRoute>
                <Layout>
                  <Exams />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/students"
            element={
              <PrivateRoute>
                <Layout>
                  <Students />
                </Layout>
              </PrivateRoute>
            }
          />
          <Route
            path="/results"
            element={
              <PrivateRoute>
                <Layout>
                  <Results />
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;