import { GradientText } from '@/components/ui/gradient-text';

const Footer = () => {
  return (
    <footer className="bg-deep-espresso text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-3xl font-bold">
              <GradientText variant="gold">Casa Candy</GradientText>
            </h3>
            <p className="text-white/70 leading-relaxed">
              Tradición culinaria en el corazón de Madrid. 
              Ven y disfruta de una experiencia gastronómica auténtica preparada con pasión.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-golden-mustard">Enlaces Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <a href="#inicio" className="text-white/70 hover:text-golden-mustard transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#menu" className="text-white/70 hover:text-golden-mustard transition-colors">
                  Nuestro Menú
                </a>
              </li>
              <li>
                <a href="#contacto" className="text-white/70 hover:text-golden-mustard transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media & Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-golden-mustard">Síguenos</h4>
            <div className="flex space-x-6">
              <a href="#" className="text-white/70 hover:text-golden-mustard transition-colors">
                Facebook
              </a>
              <a href="#" className="text-white/70 hover:text-golden-mustard transition-colors">
                Instagram
              </a>
              <a href="#" className="text-white/70 hover:text-golden-mustard transition-colors">
                Twitter
              </a>
            </div>
            <div className="space-y-2 pt-4">
              <p className="text-sm text-white/50">
                © 2024 Casa Candy. Todos los derechos reservados.
              </p>
              <p className="text-xs text-white/40">
                Imágenes cortesía de{' '}
                <a 
                  href="https://www.freepik.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-golden-mustard transition-colors"
                >
                  Freepik
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;