import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { scrollToSection } from '@/utils/scroll';
import { RESTAURANT_CONFIG } from '@/config/restaurant';

const NAV_ITEMS = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'menu', label: 'Carta' },
  { id: 'contacto', label: 'Contacto' },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const { hasAnyPermission } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();

  const hasAdminAccess = isAdmin || hasAnyPermission(['edit_dishes', 'manage_availability', 'delete_dishes', 'manage_users']);

  const handleNavigation = (sectionId: string) => {
    if (location.pathname === '/') {
      scrollToSection(sectionId, () => setIsMenuOpen(false));
    } else {
      navigate('/');
      setIsMenuOpen(false);
      setTimeout(() => scrollToSection(sectionId), 100);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-paper/95 backdrop-blur-sm border-b border-line z-[100]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <button
            onClick={() => handleNavigation('inicio')}
            className="font-serif text-xl sm:text-2xl text-ink"
          >
            {RESTAURANT_CONFIG.name}
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-[0.08em] font-medium text-ink/80">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className="hover:text-terracotta transition-colors"
              >
                {item.label}
              </button>
            ))}
            {user ? (
              <>
                {hasAdminAccess && (
                  <button
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-1.5 hover:text-terracotta transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Admin
                  </button>
                )}
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 hover:text-terracotta transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="flex items-center gap-1.5 hover:text-terracotta transition-colors"
              >
                <User className="w-4 h-4" />
                Acceder
              </button>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-ink"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {isMenuOpen && (
          <nav className="md:hidden pb-6 pt-2 border-t border-line flex flex-col gap-1 text-sm uppercase tracking-[0.08em] font-medium text-ink/80">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id)}
                className="text-left py-3 hover:text-terracotta transition-colors"
              >
                {item.label}
              </button>
            ))}
            {user ? (
              <>
                {hasAdminAccess && (
                  <button
                    onClick={() => { navigate('/admin'); setIsMenuOpen(false); }}
                    className="text-left py-3 flex items-center gap-2 hover:text-terracotta transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Admin
                  </button>
                )}
                <button
                  onClick={() => { signOut(); setIsMenuOpen(false); }}
                  className="text-left py-3 flex items-center gap-2 hover:text-terracotta transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Salir
                </button>
              </>
            ) : (
              <button
                onClick={() => { navigate('/auth'); setIsMenuOpen(false); }}
                className="text-left py-3 flex items-center gap-2 hover:text-terracotta transition-colors"
              >
                <User className="w-4 h-4" />
                Acceder
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
