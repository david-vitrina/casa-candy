import { scrollToMenu, scrollToContact } from '@/utils/scroll';
import { GradientText } from '@/components/ui/gradient-text';
import { GradientIcon } from '@/components/ui/gradient-icon';
import { GradientButton } from '@/components/ui/gradient-button';
import { UtensilsCrossed, Award, ChefHat } from 'lucide-react';

const Hero = () => {

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream-light via-background to-golden-mustard/10" />
      
      {/* Decorative elements */}
      <div className="absolute top-32 right-20 w-40 h-40 bg-golden-mustard/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-32 left-20 w-56 h-56 bg-toasted-brown/15 rounded-full blur-3xl animate-float" style={{animationDelay: '1.5s'}} />
      <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-warm-amber/15 rounded-full blur-2xl animate-float" style={{animationDelay: '3s'}} />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main content in single column */}
          <div className="text-center space-y-10 animate-fade-in mb-20">
            {/* Main heading */}
            <div className="space-y-4">
              <h1 className="text-7xl md:text-8xl font-bold leading-tight tracking-tight">
                <GradientText variant="primary">Casa Candy</GradientText>
              </h1>
              
              {/* Subtitle */}
              <p className="text-2xl md:text-3xl text-foreground/80 max-w-3xl mx-auto font-light leading-relaxed">
                Tradición culinaria con un toque contemporáneo. 
                Descubre sabores auténticos en cada plato.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-6">
              <GradientButton 
                size="lg" 
                onClick={scrollToMenu}
                className="px-12 py-7 text-lg rounded-full"
              >
                Explorar Menú
              </GradientButton>
              <GradientButton 
                variant="outline-spanish"
                size="lg"
                onClick={scrollToContact}
                className="px-12 py-7 text-lg rounded-full"
              >
                Reservar Mesa
              </GradientButton>
            </div>
          </div>
          
          {/* Features - Full width grid */}
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="text-center space-y-5 p-8 rounded-3xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:shadow-premium animate-slide-up border border-toasted-brown/10">
              <GradientIcon variant="red-orange" size="lg" className="mx-auto shadow-premium">
                <UtensilsCrossed className="h-8 w-8" />
              </GradientIcon>
              <h3 className="text-2xl font-bold text-foreground">Cocina Tradicional</h3>
              <p className="text-foreground/70 leading-relaxed text-base">
                Recetas auténticas preparadas con técnicas artesanales
              </p>
            </div>
            
            <div className="text-center space-y-5 p-8 rounded-3xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:shadow-premium animate-slide-up border border-toasted-brown/10" style={{animationDelay: '0.15s'}}>
              <GradientIcon variant="orange-gold" size="lg" className="mx-auto shadow-premium">
                <Award className="h-8 w-8" />
              </GradientIcon>
              <h3 className="text-2xl font-bold text-foreground">Ingredientes Premium</h3>
              <p className="text-foreground/70 leading-relaxed text-base">
                Selección cuidadosa de productos frescos de temporada
              </p>
            </div>
            
            <div className="text-center space-y-5 p-8 rounded-3xl bg-white/60 backdrop-blur-sm hover:bg-white/80 transition-all duration-300 hover:shadow-premium animate-slide-up border border-toasted-brown/10" style={{animationDelay: '0.3s'}}>
              <GradientIcon variant="gold-red" size="lg" className="mx-auto shadow-premium">
                <ChefHat className="h-8 w-8" />
              </GradientIcon>
              <h3 className="text-2xl font-bold text-foreground">Maestría Culinaria</h3>
              <p className="text-foreground/70 leading-relaxed text-base">
                Chef experimentado con pasión por la excelencia gastronómica
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;