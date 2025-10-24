import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  const hasAdminAccess = isAdmin || hasAnyPermission(['edit_dishes', 'manage_availability', 'delete_dishes', 'manage_users']);

  const handleNavigation = (sectionId: string) => {
    if (location.pathname === '/') {
      // Si ya estamos en la página principal, scroll directo
      scrollToSection(sectionId, () => setIsMenuOpen(false));
    } else {
      // Si estamos en otra ruta, navegar primero y luego scroll
      navigate('/');
      setIsMenuOpen(false);
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-background/85 backdrop-blur-md border-b border-toasted-brown/15 z-[100] shadow-soft rounded-b-lg">
      <div className="container mx-auto px-4 py-4 sm:py-3">
        <div className="flex items-center justify-between min-h-[56px] sm:min-h-0">
          {/* Logo */}
          <div 
            className="text-xl sm:text-2xl font-bold tracking-tight cursor-pointer" 
            onClick={() => handleNavigation('inicio')}
          >
            <GradientText variant="primary">{RESTAURANT_CONFIG.name}</GradientText>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('inicio')}
              className="hover:text-toasted-brown transition-all duration-300 font-medium"
            >
              Inicio
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('menu')}
              className="hover:text-toasted-brown transition-all duration-300 font-medium"
            >
              Menú
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleNavigation('contacto')}
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
            className="md:hidden h-10 w-10"
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
                onClick={() => handleNavigation('inicio')}
                className="justify-start hover:text-toasted-brown transition-all duration-300"
              >
                Inicio
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('menu')}
                className="justify-start hover:text-toasted-brown transition-all duration-300"
              >
                Menú
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleNavigation('contacto')}
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