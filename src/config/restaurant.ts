/**
 * Configuración hardcodeada de Casa Candy
 * Esta configuración reemplaza el sistema multi-tenant
 */

export const RESTAURANT_CONFIG = {
  name: 'Casa Candy',
  // Colores en HSL format
  colors: {
    primary: '25 70% 50%',    // #D2691E Chocolate cálido
    secondary: '25 60% 30%',  // #8B4513 Marrón
    accent: '39 50% 60%',     // #CD853F Dorado cálido
  },
  contact: {
    phone: '+34 XXX XXX XXX',
    email: 'info@casacandy.com',
    address: 'Dirección del restaurante',
  },
  // Puedes agregar más configuraciones aquí
  features: {
    showPrices: true,
    enableDiscounts: true,
  },
} as const;
