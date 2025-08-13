import { scrollToMenu, scrollToContact } from '@/utils/scroll';
import { GradientText } from '@/components/ui/gradient-text';
import { GradientIcon } from '@/components/ui/gradient-icon';
import { GradientButton } from '@/components/ui/gradient-button';

const Hero = () => {

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-warm-cream via-background to-spanish-gold/10" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-spanish-gold/20 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-spanish-red/10 rounded-full blur-2xl" />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <GradientText variant="primary">David Burger</GradientText>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Sabores auténticos de España en cada bocado. 
            Descubre nuestra selección de platos tradicionales preparados con ingredientes de primera calidad.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <GradientButton 
              size="lg" 
              onClick={scrollToMenu}
              className="px-8 py-3 rounded-lg"
            >
              Ver Nuestro Menú
            </GradientButton>
            <GradientButton 
              variant="outline-spanish"
              size="lg"
              onClick={scrollToContact}
              className="px-8 py-3"
            >
              Hacer Reserva
            </GradientButton>
          </div>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center space-y-3">
              <GradientIcon variant="red-orange" size="lg" className="mx-auto">
                <span className="text-2xl">🥘</span>
              </GradientIcon>
              <h3 className="text-lg font-semibold">Platos Tradicionales</h3>
              <p className="text-muted-foreground">Recetas auténticas transmitidas de generación en generación</p>
            </div>
            
            <div className="text-center space-y-3">
              <GradientIcon variant="orange-gold" size="lg" className="mx-auto">
                <span className="text-2xl">🌟</span>
              </GradientIcon>
              <h3 className="text-lg font-semibold">Ingredientes Premium</h3>
              <p className="text-muted-foreground">Solo utilizamos los mejores productos españoles</p>
            </div>
            
            <div className="text-center space-y-3">
              <GradientIcon variant="gold-red" size="lg" className="mx-auto">
                <span className="text-2xl">👨‍🍳</span>
              </GradientIcon>
              <h3 className="text-lg font-semibold">Preparación Artesanal</h3>
              <p className="text-muted-foreground">Cada plato preparado con técnicas tradicionales</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;