import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { BookOpen, Users, FileSpreadsheet, Settings, LogOut, Sun, Moon, Menu, X, User } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Exams from './components/Exams';
import Students from './components/Students';
import Results from './components/Results';
import Profile from './components/Profile';
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const desktopMenuRef = useRef<HTMLDivElement>(null);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) &&
        (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target as Node))
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <button onClick={toggleSidebar} className="text-foreground">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold text-primary flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          GradeMe
        </h1>
        <div ref={mobileMenuRef}>
          <button
            onClick={toggleUserMenu}
            className="relative w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <User className="h-5 w-5" />
          </button>
          {isUserMenuOpen && (
            <div className="absolute right-4 mt-2 w-48 rounded-md shadow-lg bg-card border border-border">
              <div className="py-2">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-card-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@example.com</p>
                </div>
                <Link
                  to="/profile"
                  onClick={closeUserMenu}
                  className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  View Profile
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6 hidden lg:block">
            <h1 className="text-2xl font-bold text-primary flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              GradeMe
            </h1>
          </div>
          <nav className="mt-6">
            <Link to="/" onClick={closeSidebar} className="flex items-center px-6 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <FileSpreadsheet className="h-5 w-5 mr-3" />
              Dashboard
            </Link>
            <Link to="/exams" onClick={closeSidebar} className="flex items-center px-6 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <BookOpen className="h-5 w-5 mr-3" />
              Exams
            </Link>
            <Link to="/students" onClick={closeSidebar} className="flex items-center px-6 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
              <Users className="h-5 w-5 mr-3" />
              Students
            </Link>
            <Link to="/results" onClick={closeSidebar} className="flex items-center px-6 py-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
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

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-end p-4 border-b border-border bg-card">
            <div className="relative" ref={desktopMenuRef}>
              <button
                onClick={toggleUserMenu}
                className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                <User className="h-6 w-6" />
              </button>
              
              {/* User Menu Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card border border-border">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-card-foreground">Admin User</p>
                      <p className="text-xs text-muted-foreground">admin@example.com</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={closeUserMenu}
                      className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
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
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Layout>
                  <Profile />
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