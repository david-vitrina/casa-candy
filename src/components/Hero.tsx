import { scrollToMenu, scrollToContact } from '@/utils/scroll';
import { GradientText } from '@/components/ui/gradient-text';
import { GradientIcon } from '@/components/ui/gradient-icon';
import { GradientButton } from '@/components/ui/gradient-button';

const Hero = () => {

  return (
    <section id="inicio" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-candy-cream via-background to-candy-mint/10" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-candy-gold/30 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-candy-coral/15 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}} />
      <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-candy-mint/20 rounded-full blur-lg animate-float" style={{animationDelay: '2s'}} />
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          {/* Main heading */}
          <h1 className="text-6xl md:text-8xl font-bold leading-tight tracking-tight">
            <GradientText variant="primary">Casa Candy</GradientText>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto font-light">
            Donde cada bocado es una celebración. 
            Burgers gourmet con un toque dulce y especial que te hará sonreír.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <GradientButton 
              size="lg" 
              onClick={scrollToMenu}
              className="px-10 py-6 text-lg rounded-full"
            >
              Explorar Menú
            </GradientButton>
            <GradientButton 
              variant="outline-spanish"
              size="lg"
              onClick={scrollToContact}
              className="px-10 py-6 text-lg rounded-full"
            >
              Reservar Mesa
            </GradientButton>
          </div>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="text-center space-y-4 p-6 rounded-2xl hover:bg-white/50 transition-all duration-300 hover:shadow-soft animate-slide-up">
              <GradientIcon variant="red-orange" size="lg" className="mx-auto shadow-candy">
                <span className="text-3xl">🍔</span>
              </GradientIcon>
              <h3 className="text-xl font-bold text-foreground">Burgers Artesanales</h3>
              <p className="text-foreground/70 leading-relaxed">Combinaciones únicas que mezclan lo dulce con lo salado</p>
            </div>
            
            <div className="text-center space-y-4 p-6 rounded-2xl hover:bg-white/50 transition-all duration-300 hover:shadow-soft animate-slide-up" style={{animationDelay: '0.1s'}}>
              <GradientIcon variant="orange-gold" size="lg" className="mx-auto shadow-candy">
                <span className="text-3xl">✨</span>
              </GradientIcon>
              <h3 className="text-xl font-bold text-foreground">Ingredientes Premium</h3>
              <p className="text-foreground/70 leading-relaxed">Selección cuidadosa de productos frescos y de calidad</p>
            </div>
            
            <div className="text-center space-y-4 p-6 rounded-2xl hover:bg-white/50 transition-all duration-300 hover:shadow-soft animate-slide-up" style={{animationDelay: '0.2s'}}>
              <GradientIcon variant="gold-red" size="lg" className="mx-auto shadow-candy">
                <span className="text-3xl">🎨</span>
              </GradientIcon>
              <h3 className="text-xl font-bold text-foreground">Experiencia Única</h3>
              <p className="text-foreground/70 leading-relaxed">Cada burger es una obra de arte para disfrutar</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;