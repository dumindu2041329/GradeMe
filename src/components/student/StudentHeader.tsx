import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Sun, Moon, User } from 'lucide-react';

interface StudentHeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
}

const StudentHeader: React.FC<StudentHeaderProps> = ({ isDark, toggleTheme }) => {
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b border-border bg-card">
      <Link to="/student" className="flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold text-primary">GradeMe</span>
      </Link>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="flex items-center px-3 py-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent"
        >
          {isDark ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={toggleUserMenu}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <User className="h-6 w-6" />
          </button>
          
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card border border-border">
              <div className="py-2">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-card-foreground">Student User</p>
                  <p className="text-xs text-muted-foreground">student@example.com</p>
                </div>
                <Link
                  to="/student/profile"
                  className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentHeader;