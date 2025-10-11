import { Dish } from '@/types/menu';

// Fallback offline data - Casa Candy menu items
// Images will be loaded from Supabase Storage when online
export const menuItems: Dish[] = [
  // Appetizers
  {
    id: 'offline-1',
    name: 'Pincho de Bacalao',
    description: 'Posta de lomo de bacalao rebozada al punto de sal.',
    full_description: 'Delicioso pincho de bacalao rebozado, preparado con posta de lomo de bacalao de primera calidad, rebozada a la perfección y sazonada al punto de sal.',
    ingredients: ['Bacalao', 'Harina', 'Huevo', 'Sal'],
    price: 5.00,
    image: '/placeholder.svg',
    category: 'appetizer',
    available: true,
    is_daily_menu: false
  },
  {
    id: 'offline-2',
    name: 'Anillas de Calamar',
    description: 'Anillas de calamar XXL seleccionadas y rebozadas.',
    full_description: 'Anillas de calamar XXL cuidadosamente seleccionadas, rebozadas con nuestra receta especial y fritas al punto perfecto.',
    ingredients: ['Calamar', 'Harina', 'Huevo', 'Sal'],
    price: 10.50,
    image: '/placeholder.svg',
    category: 'appetizer',
    available: true,
    is_daily_menu: false
  },
  {
    id: 'offline-3',
    name: 'Sepia a la Plancha',
    description: 'Sepia troceada a la plancha con salsa de ajo, perejil y aceite de oliva.',
    full_description: 'Sepia fresca troceada y cocinada a la plancha, acompañada de una deliciosa salsa de ajo, perejil y aceite de oliva virgen extra.',
    ingredients: ['Sepia', 'Ajo', 'Perejil', 'Aceite de oliva'],
    price: 11.50,
    image: '/placeholder.svg',
    category: 'appetizer',
    available: true,
    is_daily_menu: false
  },
  {
    id: 'offline-4',
    name: 'Fuente de Patatas con Salsas',
    description: 'Patatas con ketchup, mahonesa, alioli casera, brava, rosa y barbacoa.',
    full_description: 'Generosa fuente de patatas fritas crujientes acompañadas de seis salsas diferentes: ketchup, mahonesa, alioli casero, brava, rosa y barbacoa.',
    ingredients: ['Patatas', 'Ketchup', 'Mahonesa', 'Alioli', 'Salsa brava', 'Salsa rosa', 'Barbacoa'],
    price: 8.00,
    image: '/placeholder.svg',
    category: 'appetizer',
    available: true,
    is_daily_menu: false
  },
  {
    id: 'offline-5',
    name: 'Pata de Pulpo a la Parrilla',
    description: 'Pata de pulpo (350g) a la parrilla con pimentón de la vera y patatas.',
    full_description: 'Pata de pulpo de 350g cocinada a la parrilla, acompañada de patatas y sazonada con pimentón de La Vera.',
    ingredients: ['Pulpo', 'Pimentón de La Vera', 'Patatas', 'Aceite de oliva', 'Sal'],
    price: 18.50,
    image: '/placeholder.svg',
    category: 'appetizer',
    available: true,
    is_daily_menu: false
  },

  // Main courses
  {
    id: 'offline-6',
    name: 'Hamburguesa Simple',
    description: 'Solo carne, queso y jamón york.',
    full_description: 'Hamburguesa clásica con carne de primera calidad, queso fundido y jamón york.',
    ingredients: ['Carne', 'Queso', 'Jamón york', 'Pan'],
    price: 5.50,
    image: '/placeholder.svg',
    category: 'main',
    available: true,
    is_daily_menu: false
  },
  {
    id: 'offline-7',
    name: 'Hamburguesa Completa',
    description: 'Carne mixta, queso, jamón york, lechuga, tomate, cebolla, pepinillo y frito.',
    full_description: 'Hamburguesa completa con carne mixta jugosa, queso, jamón york, lechuga fresca, tomate, cebolla, pepinillo y huevo frito.',
    ingredients: ['Carne mixta', 'Queso', 'Jamón york', 'Lechuga', 'Tomate', 'Cebolla', 'Pepinillo', 'Huevo'],
    price: 10.00,
    image: '/placeholder.svg',
    category: 'main',
    available: true,
    is_daily_menu: false
  },
  {
    id: 'offline-8',
    name: 'Hamburguesa de Buey',
    description: '200g de carne de Buey con los ingredientes de la completa.',
    full_description: 'Hamburguesa premium con 200g de carne de Buey de máxima calidad, acompañada de todos los ingredientes de la hamburguesa completa.',
    ingredients: ['Carne de Buey', 'Queso', 'Jamón york', 'Lechuga', 'Tomate', 'Cebolla', 'Pepinillo', 'Huevo'],
    price: 10.00,
    image: '/placeholder.svg',
    category: 'main',
    available: true,
    is_daily_menu: false
  },
  {
    id: 'offline-9',
    name: 'Serranito Casa Candy',
    description: 'Jamón Serrano a la plancha con pimiento frito y lomo de cerdo.',
    full_description: 'Nuestro bocadillo estrella con jamón serrano a la plancha, pimiento frito y lomo de cerdo, todo en pan recién horneado.',
    ingredients: ['Jamón Serrano', 'Lomo de cerdo', 'Pimiento frito', 'Pan'],
    price: 6.00,
    image: '/placeholder.svg',
    category: 'main',
    available: true,
    is_daily_menu: false
  },
  {
    id: 'offline-10',
    name: 'Plato 1. Lomo de Cerdo',
    description: 'Cinta de lomo a la plancha con patatas fritas y dos huevos.',
    full_description: 'Plato combinado con cinta de lomo de cerdo a la plancha, patatas fritas crujientes y dos huevos fritos.',
    ingredients: ['Lomo de cerdo', 'Patatas', 'Huevos', 'Aceite de oliva'],
    price: 9.50,
    image: '/placeholder.svg',
    category: 'main',
    available: true,
    is_daily_menu: false
  },
  {
    id: 'offline-11',
    name: 'Plato 2. Combinado de Bacalao',
    description: '2 postas de bacalao rebozado con ensalada mezclum.',
    full_description: 'Plato combinado con dos generosas postas de bacalao rebozado acompañadas de ensalada mezclum fresca.',
    ingredients: ['Bacalao', 'Harina', 'Huevo', 'Ensalada mezclum'],
    price: 11.00,
    image: '/placeholder.svg',
    category: 'main',
    available: true,
    is_daily_menu: false
  },
  {
    id: 'offline-12',
    name: 'Plato 4. Combinado de Pechuga',
    description: 'Dos filetes de pechuga de pollo, dos huevos fritos y patatas fritas.',
    full_description: 'Plato combinado abundante con dos filetes de pechuga de pollo a la plancha, dos huevos fritos y patatas fritas.',
    ingredients: ['Pechuga de pollo', 'Huevos', 'Patatas', 'Aceite de oliva'],
    price: 9.50,
    image: '/placeholder.svg',
    category: 'main',
    available: true,
    is_daily_menu: false
  },

  // Desserts
  {
    id: 'offline-13',
    name: 'Crepe Casero',
    description: 'Crepe elaborado artesanalmente.',
    full_description: 'Delicioso crepe casero elaborado con nuestra receta artesanal, con variedad de rellenos a elegir.',
    ingredients: ['Harina', 'Huevo', 'Leche', 'Azúcar', 'Mantequilla'],
    price: 5.50,
    image: '/placeholder.svg',
    category: 'dessert',
    available: true,
    is_daily_menu: false
  },
  {
    id: 'offline-14',
    name: 'Gofre Casero',
    description: 'Preparado con masa casera.',
    full_description: 'Gofre elaborado con masa casera, crujiente por fuera y esponjoso por dentro. Acompañado de toppings a elegir.',
    ingredients: ['Harina', 'Huevo', 'Leche', 'Azúcar', 'Mantequilla', 'Levadura'],
    price: 6.50,
    image: '/placeholder.svg',
    category: 'dessert',
    available: true,
    is_daily_menu: false
  },
  {
    id: 'offline-15',
    name: 'Tartas Artesanas',
    description: 'A consultar disponibilidad con el camarero.',
    full_description: 'Selección de tartas artesanas elaboradas diariamente. Pregunta a nuestro personal por las variedades disponibles del día.',
    ingredients: ['Consultar con el camarero'],
    price: 4.90,
    image: '/placeholder.svg',
    category: 'dessert',
    available: true,
    is_daily_menu: false
  }
];
