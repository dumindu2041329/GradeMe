import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const handleBackClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (userRole === 'admin') {
      navigate('/');
    } else {
      navigate('/student');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-gradient-to-br from-card via-card to-muted rounded-2xl shadow-2xl border border-border p-8 md:p-12 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            {/* 404 Text with gradient */}
            <h1 className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/60 mb-4">
              404
            </h1>

            {/* Main content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-card-foreground mb-2">
                  Oops! Page not found
                </h2>
                <p className="text-muted-foreground text-lg">
                  Sorry, we can't find the page you're looking for. It might have been moved or deleted.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleBackClick}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium
                           hover:bg-primary/90 transition-all duration-200 group
                           focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                           shadow-lg hover:shadow-xl"
                >
                  <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
                  Return Home
                </button>
                <button
                  onClick={() => window.history.back()}
                  className="flex items-center justify-center gap-2 px-6 py-3 
                           bg-card text-card-foreground rounded-xl font-medium
                           border border-border
                           hover:bg-accent transition-all duration-200 group
                           focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  Go Back
                </button>
              </div>

              {/* Decorative dots */}
              <div className="absolute bottom-4 right-4 grid grid-cols-3 gap-2 opacity-30">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-primary"
                    style={{
                      opacity: ((i % 3) + Math.floor(i / 3)) / 4
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;