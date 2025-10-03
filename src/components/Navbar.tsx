import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Home, Sparkles, Search } from 'lucide-react';
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
              className="text-foreground hover:text-primary transition-colors duration-200 font-sans font-medium flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <Link 
              to="/generate" 
              className="text-foreground hover:text-primary transition-colors duration-200 font-sans font-medium flex items-center gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Generate
            </Link>
            <Link 
              to="/search" 
              className="text-foreground hover:text-primary transition-colors duration-200 font-sans font-medium flex items-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </Link>
          </div>

          {/* Auth Button - Right */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-foreground font-sans text-sm">{user?.name}</span>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="font-sans"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button 
                  className="bg-gradient-to-t from-[#0700FF] to-[#5661F9] hover:opacity-90 text-white font-sans"
                  size="sm"
                >
                  Login
                </Button>
              </Link>
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
            <Link 
              to="/search" 
              className="block text-foreground hover:text-primary transition-colors duration-200 font-sans font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Search
            </Link>
            
            <div className="pt-4 border-t">
              {isAuthenticated ? (
                <>
                  <div className="text-foreground font-sans text-sm mb-2">{user?.name}</div>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="w-full font-sans"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/login" className="block" onClick={() => setIsMenuOpen(false)}>
                  <Button 
                    className="w-full bg-gradient-to-t from-[#0700FF] to-[#5661F9] hover:opacity-90 text-white font-sans"
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