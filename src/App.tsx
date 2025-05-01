import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { BookOpen, Users, FileSpreadsheet, Settings, LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { auth } from './lib/auth';
import AdminHeader from './components/AdminHeader';
import Dashboard from './components/Dashboard';
import Exams from './components/Exams';
import ExamForm from './components/ExamForm';
import Students from './components/Students';
import StudentForm from './components/StudentForm';
import Results from './components/Results';
import Profile from './components/Profile';
import Login from './components/Login';
import StudentDashboard from './components/student/StudentDashboard';
import StudentProfile from './components/student/StudentProfile';
import ExamEnvironment from './components/student/ExamEnvironment';
import NotFound from './components/NotFound';

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

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
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
      <AdminHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex h-screen pt-[60px] lg:pt-0">
        {/* Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-[60px] lg:top-0 h-[calc(100vh-60px)] lg:h-screen w-64 bg-card border-r border-border z-50
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <Link to="/" className="hidden lg:flex items-center gap-2 p-4 h-[60px] border-b border-border">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">GradeMe</span>
          </Link>
          <nav className="flex-1">
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

          <div className="p-4 border-t border-border mt-auto">
            <button
              onClick={toggleTheme}
              className="flex items-center px-4 py-2 text-muted-foreground hover:text-foreground w-full rounded-md hover:bg-accent mb-2"
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
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <main className="flex-1 lg:pt-[60px]">{children}</main>
        </div>
      </div>
    </div>
  );
};

const PrivateRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole: 'admin' | 'student' }) => {
  const [user, setUser] = useState<{ role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await auth.getUser();
        if (!currentUser) {
          navigate('/login', { replace: true });
          return;
        }
        setUser(currentUser);
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/' : '/student'} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Admin Routes */}
          <Route path="/" element={
            <PrivateRoute allowedRole="admin">
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/exams" element={
            <PrivateRoute allowedRole="admin">
              <Layout>
                <Exams />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/exams/new" element={
            <PrivateRoute allowedRole="admin">
              <Layout>
                <ExamForm />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/exams/:id/edit" element={
            <PrivateRoute allowedRole="admin">
              <Layout>
                <ExamForm />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/students" element={
            <PrivateRoute allowedRole="admin">
              <Layout>
                <Students />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/students/new" element={
            <PrivateRoute allowedRole="admin">
              <Layout>
                <StudentForm />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/students/:id/edit" element={
            <PrivateRoute allowedRole="admin">
              <Layout>
                <StudentForm />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/results" element={
            <PrivateRoute allowedRole="admin">
              <Layout>
                <Results />
              </Layout>
            </PrivateRoute>
          } />
          <Route path="/profile" element={
            <PrivateRoute allowedRole="admin">
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          } />

          {/* Student Routes */}
          <Route path="/student" element={
            <PrivateRoute allowedRole="student">
              <StudentDashboard />
            </PrivateRoute>
          } />
          <Route path="/student/profile" element={
            <PrivateRoute allowedRole="student">
              <StudentProfile />
            </PrivateRoute>
          } />
          <Route path="/student/exams/:id" element={
            <PrivateRoute allowedRole="student">
              <ExamEnvironment />
            </PrivateRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;