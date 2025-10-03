import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
        <div className="flex justify-center items-center h-16 relative">
          {/* Logo - Left (absolute positioning) */}
          <Link to="/" className="absolute left-4 flex items-center">
            <img src={logo} alt="Rxdecode" className="h-8" />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden md:flex items-center gap-12 bg-muted rounded-full px-8 py-2">
            <Link 
              to="/" 
              className="text-foreground hover:text-primary transition-colors duration-200 font-sans font-medium"
            >
              Home
            </Link>
            <Link 
              to="/generate" 
              className="text-foreground hover:text-primary transition-colors duration-200 font-sans font-medium"
            >
              Generate
            </Link>
            {isAuthenticated ? (
              <Button 
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="font-sans"
              >
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button 
                  className="bg-gradient-to-t from-[#0700FF] to-[#5661F9] hover:opacity-90 text-white font-sans rounded-full"
                  size="sm"
                >
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden absolute right-4">
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
              className="block text-foreground hover:text-primary transition-colors duration-200 font-sans font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/generate" 
              className="block text-foreground hover:text-primary transition-colors duration-200 font-sans font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Generate
            </Link>
            
            <div className="pt-4 border-t">
              {isAuthenticated ? (
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="w-full font-sans"
                >
                  Logout
                </Button>
              ) : (
                <Link to="/login" className="block" onClick={() => setIsMenuOpen(false)}>
                  <Button 
                    className="w-full bg-gradient-to-t from-[#0700FF] to-[#5661F9] hover:opacity-90 text-white font-sans rounded-full"
                    size="sm"
                  >
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;