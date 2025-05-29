
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/92019ec6-4835-4a4f-b548-9968ced3e7e5.png" 
              alt="Rxdecode Logo" 
              className="h-8 w-8"
            />
            <span className="text-xl font-bold font-bricolage bg-gradient-to-r from-rxdecode-purple to-rxdecode-coral bg-clip-text text-transparent">
              Rxdecode
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-rxdecode-purple transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link 
              to="/upload" 
              className="text-gray-700 hover:text-rxdecode-purple transition-colors duration-200 font-medium"
            >
              Upload Prescription
            </Link>
            <Link 
              to="/search" 
              className="text-gray-700 hover:text-rxdecode-purple transition-colors duration-200 font-medium"
            >
              Search Medicine
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-700">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-rxdecode-purple to-rxdecode-coral hover:from-rxdecode-purple/90 hover:to-rxdecode-coral/90" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
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
              className="block text-gray-700 hover:text-rxdecode-purple transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/upload" 
              className="block text-gray-700 hover:text-rxdecode-purple transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Upload Prescription
            </Link>
            <Link 
              to="/search" 
              className="block text-gray-700 hover:text-rxdecode-purple transition-colors duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Search Medicine
            </Link>
            
            {isAuthenticated ? (
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2 text-gray-700 mb-2">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="w-full flex items-center justify-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t space-y-2">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-rxdecode-purple to-rxdecode-coral hover:from-rxdecode-purple/90 hover:to-rxdecode-coral/90" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
