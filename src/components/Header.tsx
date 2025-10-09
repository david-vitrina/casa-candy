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
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold">
            <GradientText variant="primary">{RESTAURANT_CONFIG.name}</GradientText>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Button 
              variant="ghost" 
              onClick={() => handleScrollToSection('inicio')}
              className="hover:text-spanish-red transition-colors"
            >
              Inicio
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleScrollToSection('menu')}
              className="hover:text-spanish-red transition-colors"
            >
              Menú
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => handleScrollToSection('contacto')}
              className="hover:text-spanish-red transition-colors"
            >
              Contacto
            </Button>
            {user ? (
              <>
                {hasAdminAccess && (
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/admin')}
                    className="hover:text-spanish-red transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={signOut}
                  className="hover:text-spanish-red transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Salir
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                onClick={() => navigate('/auth')}
                className="hover:text-spanish-red transition-colors"
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
                className="justify-start hover:text-spanish-red"
              >
                Inicio
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleScrollToSection('menu')}
                className="justify-start hover:text-spanish-red"
              >
                Menú
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => handleScrollToSection('contacto')}
                className="justify-start hover:text-spanish-red"
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
                      className="justify-start hover:text-spanish-red"
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
                    className="justify-start hover:text-spanish-red"
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
                  className="justify-start hover:text-spanish-red"
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