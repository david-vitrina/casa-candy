import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { GradientText } from '@/components/ui/gradient-text';
import { GradientIcon } from '@/components/ui/gradient-icon';
import { GradientButton } from '@/components/ui/gradient-button';

const ContactSection = () => {
  return (
    <section id="contacto" className="py-20 bg-gradient-to-b from-warm-cream/30 to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold">
            <GradientText>Contacto</GradientText>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            ¿Tienes alguna pregunta o quieres hacer una reserva? Estamos aquí para ayudarte
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-spanish-red mb-6">
              Información de Contacto
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <GradientIcon variant="red-orange" className="flex-shrink-0">
                  <MapPin className="h-6 w-6" />
                </GradientIcon>
                <div>
                  <h4 className="font-semibold text-foreground">Dirección</h4>
                  <p className="text-muted-foreground">
                    Calle de la Gastronomía, 123<br />
                    28001 Madrid, España
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <GradientIcon variant="orange-gold" className="flex-shrink-0">
                  <Phone className="h-6 w-6" />
                </GradientIcon>
                <div>
                  <h4 className="font-semibold text-foreground">Teléfono</h4>
                  <p className="text-muted-foreground">
                    +34 91 123 45 67
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <GradientIcon variant="gold-red" className="flex-shrink-0">
                  <Mail className="h-6 w-6" />
                </GradientIcon>
                <div>
                  <h4 className="font-semibold text-foreground">Email</h4>
                  <p className="text-muted-foreground">
                    info@davidburger.es
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <GradientIcon variant="red-orange" className="flex-shrink-0">
                  <Clock className="h-6 w-6" />
                </GradientIcon>
                <div>
                  <h4 className="font-semibold text-foreground">Horarios</h4>
                  <div className="text-muted-foreground">
                    <p>Lun - Jue: 12:00 - 16:00, 20:00 - 24:00</p>
                    <p>Vie - Sáb: 12:00 - 02:00</p>
                    <p>Domingo: 12:00 - 23:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-spanish-red mb-6">
                Envíanos un Mensaje
              </h3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-spanish-red/20 focus:border-spanish-red transition-colors"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-spanish-red/20 focus:border-spanish-red transition-colors"
                      placeholder="Tu teléfono"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-spanish-red/20 focus:border-spanish-red transition-colors"
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mensaje
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-spanish-red/20 focus:border-spanish-red transition-colors resize-none"
                    placeholder="¿En qué podemos ayudarte?"
                  />
                </div>
                
                <GradientButton 
                  type="submit"
                  className="w-full py-3"
                >
                  Enviar Mensaje
                </GradientButton>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;