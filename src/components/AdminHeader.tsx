import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, User } from 'lucide-react';

interface AdminHeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
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

  const toggleUserMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 border-b border-border bg-card">
        <button 
          onClick={toggleSidebar} 
          className="text-foreground relative w-8 h-8 flex items-center justify-center"
        >
          {isSidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
        <Link to="/" className="text-xl font-bold text-primary flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          GradeMe
        </Link>
        <div ref={userMenuRef}>
          <button
            onClick={toggleUserMenu}
            className="relative w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <User className="h-5 w-5" />
          </button>
          {isUserMenuOpen && (
            <div className="absolute right-4 mt-2 w-48 rounded-md shadow-lg bg-card border border-border z-50">
              <div className="py-2">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-card-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@example.com</p>
                </div>
                <Link
                  to="/profile"
                  className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  View Profile
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex fixed top-0 right-0 left-64 z-50 items-center justify-end h-[60px] p-4 border-b border-border bg-card">
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={toggleUserMenu}
            className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <User className="h-6 w-6" />
          </button>
          
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card border border-border z-50">
              <div className="py-2">
                <div className="px-4 py-2 border-b border-border">
                  <p className="text-sm font-medium text-card-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@example.com</p>
                </div>
                <Link
                  to="/profile"
                  className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  View Profile
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminHeader;