/**
 * Scroll utilities for smooth navigation
 */
export const scrollToSection = (sectionId: string, callback?: () => void) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    if (callback) callback();
  }
};

export const scrollToMenu = () => scrollToSection('menu');
export const scrollToContact = () => scrollToSection('contacto');
export const scrollToTop = () => scrollToSection('inicio');