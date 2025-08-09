import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-border z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold bg-gradient-to-r from-spanish-red to-spanish-orange bg-clip-text text-transparent">
            David Burger
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('inicio')}
              className="hover:text-spanish-red transition-colors"
            >
              Inicio
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('menu')}
              className="hover:text-spanish-red transition-colors"
            >
              Menú
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => scrollToSection('contacto')}
              className="hover:text-spanish-red transition-colors"
            >
              Contacto
            </Button>
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
                onClick={() => scrollToSection('inicio')}
                className="justify-start hover:text-spanish-red"
              >
                Inicio
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('menu')}
                className="justify-start hover:text-spanish-red"
              >
                Menú
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => scrollToSection('contacto')}
                className="justify-start hover:text-spanish-red"
              >
                Contacto
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;