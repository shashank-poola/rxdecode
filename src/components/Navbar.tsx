import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Home, Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import logo from '@/assets/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleGoogleLogin = () => {
    // Google OAuth logic will be implemented later with Supabase
    console.log('Google login clicked - will be implemented with Supabase');
  };

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Rxdecode" className="h-10" />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors duration-200 font-space font-medium flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link 
              to="/upload" 
              className="text-foreground hover:text-primary transition-colors duration-200 font-space font-medium flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload
            </Link>
            <Link 
              to="/search" 
              className="text-foreground hover:text-primary transition-colors duration-200 font-space font-medium flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </Link>
          </div>

          {/* Auth Button - Right */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-foreground font-helvetica text-sm">{user?.name}</span>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="font-helvetica"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleGoogleLogin}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-helvetica flex items-center gap-2"
                size="sm"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4 animate-slide-in">
            <Link 
              to="/" 
              className="block text-foreground hover:text-primary transition-colors duration-200 font-space font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/upload" 
              className="block text-foreground hover:text-primary transition-colors duration-200 font-space font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Upload
            </Link>
            <Link 
              to="/search" 
              className="block text-foreground hover:text-primary transition-colors duration-200 font-space font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Search
            </Link>
            
            <div className="pt-4 border-t">
              {isAuthenticated ? (
                <>
                  <div className="text-foreground font-helvetica text-sm mb-2">{user?.name}</div>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="w-full font-helvetica"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={handleGoogleLogin}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-helvetica flex items-center justify-center gap-2"
                  size="sm"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;