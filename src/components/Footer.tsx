const LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#menu', label: 'Carta' },
  { href: '#contacto', label: 'Contacto' },
];

const Footer = () => {
  return (
    <footer className="bg-ink text-paper py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 gap-10 sm:gap-8 mb-10">
          <div>
            <h3 className="font-serif text-2xl mb-3">Casa Candy</h3>
            <p className="text-paper/60 leading-relaxed max-w-sm">
              Tradición culinaria en el corazón de Madrid. Ven y disfruta de una experiencia
              gastronómica auténtica preparada con pasión.
            </p>
          </div>
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-paper/40 mb-3">Enlaces</p>
            <ul className="space-y-2">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-paper/70 hover:text-terracotta transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-paper/15 flex flex-col sm:flex-row justify-between gap-2 text-xs text-paper/40">
          <p>© 2026 Casa Candy. Todos los derechos reservados.</p>
          <p>
            Imágenes cortesía de{' '}
            <a
              href="https://www.freepik.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-terracotta transition-colors"
            >
              Freepik
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
