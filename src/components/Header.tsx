import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { scrollToSection } from '@/utils/scroll';
import { GradientText } from '@/components/ui/gradient-text';
import { RESTAURANT_CONFIG } from '@/config/restaurant';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { hasAnyPermission } = usePermissions();
  const navigate = useNavigate();

  const hasAdminAccess = isAdmin || hasAnyPermission(['edit_dishes', 'manage_availability', 'delete_dishes', 'manage_users']);

  const handleScrollToSection = (sectionId: string) => {
    scrollToSection(sectionId, () => setIsMenuOpen(false));
  };

  return (
    <header className="fixed top-0 w-full bg-background/85 backdrop-blur-md border-b border-toasted-brown/15 z-50 shadow-soft">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-tight">
            <GradientText variant="primary">{RESTAURANT_CONFIG.name}</GradientText>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Button 
              variant="ghost" 
              onClick={() => handleScrollToSection('inicio')}
              className="hover:text-toasted-brown transition-all duration-300 font-medium"
            >
              Inicio
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleScrollToSection('menu')}
              className="hover:text-toasted-brown transition-all duration-300 font-medium"
            >
              Menú
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleScrollToSection('contacto')}
              className="hover:text-toasted-brown transition-all duration-300 font-medium"
            >
              Contacto
            </Button>
            {user ? (
              <>
                {hasAdminAccess && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/admin')}
                    className="hover:text-toasted-brown transition-all duration-300 font-medium"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={signOut}
                  className="hover:text-toasted-brown transition-all duration-300 font-medium"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                onClick={() => navigate('/auth')}
                className="hover:text-toasted-brown transition-all duration-300 font-medium"
              >
                <User className="w-4 h-4 mr-2" />
                Acceder
              </Button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                onClick={() => handleScrollToSection('inicio')}
                className="justify-start hover:text-toasted-brown transition-all duration-300"
              >
                Inicio
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleScrollToSection('menu')}
                className="justify-start hover:text-toasted-brown transition-all duration-300"
              >
                Menú
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleScrollToSection('contacto')}
                className="justify-start hover:text-toasted-brown transition-all duration-300"
              >
                Contacto
              </Button>
              {user ? (
                <>
                  {hasAdminAccess && (
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        navigate('/admin');
                        setIsMenuOpen(false);
                      }}
                      className="justify-start hover:text-toasted-brown transition-all duration-300"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Admin
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      signOut();
                      setIsMenuOpen(false);
                    }}
                    className="justify-start hover:text-toasted-brown transition-all duration-300"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                  </Button>
                </>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                  className="justify-start hover:text-toasted-brown transition-all duration-300"
                >
                  <User className="w-4 h-4 mr-2" />
                  Acceder
                </Button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;