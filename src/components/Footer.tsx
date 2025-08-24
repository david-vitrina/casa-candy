import { GradientText } from '@/components/ui/gradient-text';

const Footer = () => {
  return (
    <footer className="bg-deep-burgundy text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">
              <GradientText variant="gold">David Burger</GradientText>
            </h3>
            <p className="text-white/80">
              Auténticos sabores españoles en el corazón de Madrid. 
              Ven y disfruta de nuestros platos tradicionales preparados con amor.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-spanish-gold">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#inicio" className="text-white/80 hover:text-spanish-gold transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#menu" className="text-white/80 hover:text-spanish-gold transition-colors">
                  Nuestro Menú
                </a>
              </li>
              <li>
                <a href="#contacto" className="text-white/80 hover:text-spanish-gold transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media & Hours */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-spanish-gold">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-white/80 hover:text-spanish-gold transition-colors">
                Facebook
              </a>
              <a href="#" className="text-white/80 hover:text-spanish-gold transition-colors">
                Instagram
              </a>
              <a href="#" className="text-white/80 hover:text-spanish-gold transition-colors">
                Twitter
              </a>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-white/60">
                © 2024 David Burger. Todos los derechos reservados.
              </p>
              <p className="text-xs text-white/40">
                Imágenes cortesía de{' '}
                <a 
                  href="https://www.freepik.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-spanish-gold transition-colors"
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