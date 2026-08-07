import { GradientButton } from '@/components/ui/gradient-button';

const CONTACT_ITEMS = [
  { label: 'Dirección', value: <>Calle Agustín Carreño, Local 3<br />Casa Candy</> },
  { label: 'Teléfono', value: <a href="tel:+34676075124">+34 676 075 124</a> },
  { label: 'Email', value: <a href="mailto:ccandy@gmail.com">ccandy@gmail.com</a> },
  {
    label: 'Horario',
    value: (
      <>
        Lun–Jue 12:00–16:00, 20:00–24:00<br />
        Vie–Sáb 12:00–02:00<br />
        Domingo 12:00–23:00
      </>
    ),
  },
];

const ContactSection = () => {
  return (
    <section id="contacto" className="bg-olive text-paper py-16 sm:py-20">
      <div className="container mx-auto px-4 sm:px-6">
        <p className="uppercase tracking-[0.2em] text-xs font-medium text-paper/60 mb-3">Reserva tu mesa</p>
        <h2 className="font-serif text-4xl sm:text-5xl mb-12 text-balance">Contacto</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 mb-12">
          {CONTACT_ITEMS.map(({ label, value }) => (
            <div key={label}>
              <p className="uppercase tracking-[0.2em] text-xs text-paper/60 mb-2">{label}</p>
              <p className="font-serif text-lg leading-snug [&_a]:hover:text-terracotta [&_a]:transition-colors">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-paper/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-paper/80 max-w-md">
            ¿Tienes alguna pregunta o quieres hacer una reserva? Estamos aquí para atenderte.
          </p>
          <GradientButton
            onClick={() => (window.location.href = 'tel:+34676075124')}
            className="px-8 py-3 flex-shrink-0"
          >
            Reserva Ahora
          </GradientButton>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
