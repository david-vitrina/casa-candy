import { Button } from '@/components/ui/button';

const Hero = () => {
  const scrollToMenu = () => {
    const element = document.getElementById('menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
            <span className="bg-gradient-to-r from-spanish-red via-spanish-orange to-spanish-gold bg-clip-text text-transparent">
              David Burger
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Sabores auténticos de España en cada bocado. 
            Descubre nuestra selección de platos tradicionales preparados con ingredientes de primera calidad.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <Button 
              size="lg" 
              onClick={scrollToMenu}
              className="bg-gradient-to-r from-spanish-red to-spanish-orange hover:from-spanish-red/90 hover:to-spanish-orange/90 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              Ver Nuestro Menú
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-spanish-red text-spanish-red hover:bg-spanish-red hover:text-white transition-all duration-300 px-8 py-3"
            >
              Hacer Reserva
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-spanish-red to-spanish-orange rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">🥘</span>
              </div>
              <h3 className="text-lg font-semibold">Platos Tradicionales</h3>
              <p className="text-muted-foreground">Recetas auténticas transmitidas de generación en generación</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-spanish-orange to-spanish-gold rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">🌟</span>
              </div>
              <h3 className="text-lg font-semibold">Ingredientes Premium</h3>
              <p className="text-muted-foreground">Solo utilizamos los mejores productos españoles</p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-spanish-gold to-spanish-red rounded-full flex items-center justify-center">
                <span className="text-2xl text-white">👨‍🍳</span>
              </div>
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