import { scrollToMenu, scrollToContact } from '@/utils/scroll';
import { useHeroSettings } from '@/hooks/useHeroSettings';
import { UtensilsCrossed, Award, ChefHat } from 'lucide-react';
import heroBackgroundDefault from '@/assets/hero-background.jpg';

const FEATURES = [
  { icon: UtensilsCrossed, title: 'Cocina tradicional', body: 'Técnicas artesanales, recetas de siempre.' },
  { icon: Award, title: 'Ingredientes premium', body: 'Producto fresco de temporada.' },
  { icon: ChefHat, title: 'Maestría culinaria', body: 'Chef con pasión por el detalle.' },
];

const Hero = () => {
  const { settings } = useHeroSettings();
  const backgroundImage = settings.image_url || heroBackgroundDefault;

  return (
    <section id="inicio" className="pt-24 sm:pt-28">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center py-6 md:py-16">
          <div>
            <p className="uppercase tracking-[0.2em] text-xs font-medium text-olive mb-6">
              Restaurante · Cocina Española
            </p>
            <h1 className="font-serif text-6xl md:text-7xl leading-[0.95] text-ink mb-6 text-balance">
              Sabor de<br />
              <em className="italic font-medium text-terracotta">siempre</em>
            </h1>
            <p className="font-serif italic text-xl sm:text-2xl text-ink/80 max-w-md mb-8 text-balance">
              &ldquo;Por más vueltas que doy, a Casa Candy voy&rdquo;
            </p>
            <div className="flex flex-wrap gap-6 sm:gap-8 text-base">
              <button onClick={scrollToMenu} className="border-b-2 border-terracotta pb-1 text-ink font-medium">
                Ver la carta ↓
              </button>
              <button onClick={scrollToContact} className="pb-1 text-ink/60 hover:text-ink transition-colors font-medium">
                Reservar mesa →
              </button>
            </div>
          </div>
          <div className="relative order-first md:order-last">
            <img
              src={backgroundImage}
              alt="Casa Candy"
              className="w-full h-64 sm:h-80 md:h-[420px] object-cover"
              style={{ borderRadius: '58% 42% 68% 32% / 45% 55% 45% 55%' }}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 sm:gap-10 py-10 border-t border-b border-line">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-start gap-4 sm:block sm:text-left">
              <Icon className="w-6 h-6 text-terracotta flex-shrink-0 sm:mb-3" />
              <div>
                <h3 className="font-serif text-lg text-ink mb-1">{title}</h3>
                <p className="text-sm text-ink/60">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
