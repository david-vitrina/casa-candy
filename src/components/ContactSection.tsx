import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { GradientText } from '@/components/ui/gradient-text';
import { GradientIcon } from '@/components/ui/gradient-icon';
import { GradientButton } from '@/components/ui/gradient-button';

const ContactSection = () => {
  return (
    <section id="contacto" className="py-24 bg-gradient-to-b from-cream-light/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <h2 className="text-5xl md:text-6xl font-bold">
            <GradientText>Contacto</GradientText>
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-light">
            ¿Tienes alguna pregunta o quieres hacer una reserva? Estamos aquí para atenderte
          </p>
        </div>

        {/* Contact Information - Centered Creative Layout */}
        <div className="max-w-5xl mx-auto">
          <Card className="border-0 shadow-2xl backdrop-blur-sm bg-card/80">
            <CardContent className="p-12">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Left Column */}
                <div className="space-y-8">
                  <div className="flex items-start space-x-4 group">
                    <GradientIcon variant="red-orange" className="flex-shrink-0 transform group-hover:scale-110 transition-transform">
                      <MapPin className="h-7 w-7" />
                    </GradientIcon>
                    <div>
                      <h4 className="font-bold text-lg text-foreground mb-2">Encuéntranos</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Calle Agustín Carreño, Local 3<br />
                        Casa Candy
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <GradientIcon variant="orange-gold" className="flex-shrink-0 transform group-hover:scale-110 transition-transform">
                      <Phone className="h-7 w-7" />
                    </GradientIcon>
                    <div>
                      <h4 className="font-bold text-lg text-foreground mb-2">Llámanos</h4>
                      <a 
                        href="tel:+34676075124" 
                        className="text-muted-foreground hover:text-toasted-brown transition-colors text-lg"
                      >
                        +34 676 075 124
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                  <div className="flex items-start space-x-4 group">
                    <GradientIcon variant="gold-red" className="flex-shrink-0 transform group-hover:scale-110 transition-transform">
                      <Mail className="h-7 w-7" />
                    </GradientIcon>
                    <div>
                      <h4 className="font-bold text-lg text-foreground mb-2">Escríbenos</h4>
                      <a 
                        href="mailto:ccandy@gmail.com" 
                        className="text-muted-foreground hover:text-toasted-brown transition-colors"
                      >
                        ccandy@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 group">
                    <GradientIcon variant="red-orange" className="flex-shrink-0 transform group-hover:scale-110 transition-transform">
                      <Clock className="h-7 w-7" />
                    </GradientIcon>
                    <div>
                      <h4 className="font-bold text-lg text-foreground mb-2">Horarios</h4>
                      <div className="text-muted-foreground space-y-1 leading-relaxed">
                        <p>Lun - Jue: 12:00 - 16:00, 20:00 - 24:00</p>
                        <p>Vie - Sáb: 12:00 - 02:00</p>
                        <p>Domingo: 12:00 - 23:00</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-12 pt-8 border-t border-border/50 text-center">
                <p className="text-foreground/80 text-lg mb-4">
                  ¿Listo para disfrutar de una experiencia gastronómica única?
                </p>
                <GradientButton 
                  onClick={() => window.location.href = 'tel:+34676075124'}
                  className="px-8 py-3"
                >
                  Reserva Ahora
                </GradientButton>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;