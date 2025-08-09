import { Dish } from '@/types/menu';
import paellaImg from '@/assets/paella-valenciana.jpg';
import jamonImg from '@/assets/jamon-iberico.jpg';
import tortillaImg from '@/assets/tortilla-espanola.jpg';
import gazpachoImg from '@/assets/gazpacho.jpg';
import pulpoImg from '@/assets/pulpo-gallega.jpg';
import croquetasImg from '@/assets/croquetas.jpg';
import patatasImg from '@/assets/patatas-bravas.jpg';
import fabadaImg from '@/assets/fabada.jpg';
import churrosImg from '@/assets/churros.jpg';
import cremaImg from '@/assets/crema-catalana.jpg';

export const menuItems: Dish[] = [
  {
    id: '1',
    name: 'Paella Valenciana',
    description: 'Arroz tradicional con pollo, judías verdes y azafrán',
    full_description: 'La auténtica paella valenciana preparada con los ingredientes tradicionales: arroz bomba, pollo de corral, judías verdes tiernas, garrofón, tomate rallado, azafrán premium y aceite de oliva virgen extra. Cocinada lentamente en paellera de hierro para conseguir el socarrat perfecto.',
    ingredients: ['Arroz bomba', 'Pollo de corral', 'Judías verdes', 'Garrofón', 'Tomate', 'Azafrán', 'Aceite de oliva', 'Sal marina'],
    price: 18.50,
    image: paellaImg,
    category: 'main',
    available: true
  },
  {
    id: '2',
    name: 'Jamón Ibérico',
    description: 'Jamón ibérico de bellota cortado a cuchillo',
    full_description: 'Jamón ibérico de bellota de primera calidad, curado durante 36 meses en bodegas naturales. Cortado a mano al momento para conservar toda su jugosidad y sabor. Cada loncha es una experiencia gastronómica única.',
    ingredients: ['Jamón ibérico de bellota', 'Sal marina'],
    price: 22.00,
    image: jamonImg,
    category: 'appetizer',
    available: true
  },
  {
    id: '3',
    name: 'Tortilla Española',
    description: 'Tortilla de patatas tradicional con huevos camperos',
    full_description: 'La clásica tortilla española elaborada con patatas gallegas, huevos camperos de primera calidad y un toque de sal marina. Preparada al momento con el punto perfecto: cremosa por dentro y dorada por fuera.',
    ingredients: ['Patatas gallegas', 'Huevos camperos', 'Aceite de oliva', 'Sal marina'],
    price: 8.50,
    image: tortillaImg,
    category: 'appetizer',
    available: true
  },
  {
    id: '4',
    name: 'Gazpacho Andaluz',
    description: 'Sopa fría tradicional con tomates maduros',
    full_description: 'Refrescante gazpacho andaluz preparado con tomates maduros de la huerta, pepino, pimiento verde, cebolla dulce, ajo tierno y pan del día. Aliñado con aceite de oliva virgen extra y vinagre de Jerez.',
    ingredients: ['Tomates maduros', 'Pepino', 'Pimiento verde', 'Cebolla', 'Ajo', 'Pan', 'Aceite de oliva', 'Vinagre de Jerez'],
    price: 7.00,
    image: gazpachoImg,
    category: 'appetizer',
    available: true
  },
  {
    id: '5',
    name: 'Pulpo a la Gallega',
    description: 'Pulpo gallego con patatas, pimentón y aceite de oliva',
    full_description: 'Tierno pulpo gallego cocido tradicionalmente con laurel, servido sobre patatas gallegas cocidas. Aliñado con pimentón dulce de La Vera, sal gruesa y aceite de oliva virgen extra. Una delicia del mar.',
    ingredients: ['Pulpo gallego', 'Patatas', 'Pimentón dulce', 'Aceite de oliva', 'Sal gruesa', 'Laurel'],
    price: 16.00,
    image: pulpoImg,
    category: 'main',
    available: true
  },
  {
    id: '6',
    name: 'Croquetas de Jamón',
    description: 'Croquetas artesanales con jamón ibérico',
    full_description: 'Croquetas artesanales elaboradas con bechamel cremosa y jamón ibérico desmenuzado. Empanadas con pan rallado casero y fritas en aceite de oliva hasta conseguir una textura crujiente por fuera y cremosa por dentro.',
    ingredients: ['Harina', 'Leche', 'Jamón ibérico', 'Mantequilla', 'Huevo', 'Pan rallado', 'Aceite de oliva'],
    price: 9.50,
    image: croquetasImg,
    category: 'appetizer',
    available: true
  },
  {
    id: '7',
    name: 'Patatas Bravas',
    description: 'Patatas fritas con salsa brava y alioli',
    full_description: 'Patatas cortadas en dados irregulares y fritas hasta conseguir una textura crujiente. Servidas con nuestra salsa brava casera (tomate, pimentón picante, ajo) y alioli tradicional elaborado con ajo y aceite de oliva.',
    ingredients: ['Patatas', 'Tomate', 'Pimentón picante', 'Ajo', 'Aceite de oliva', 'Mayonesa', 'Vinagre'],
    price: 6.50,
    image: patatasImg,
    category: 'appetizer',
    available: true
  },
  {
    id: '8',
    name: 'Fabada Asturiana',
    description: 'Guiso de alubias blancas con chorizo y morcilla',
    full_description: 'Contundente fabada asturiana con alubias blancas fabes de la granja, chorizo asturiano, morcilla, lacón y panceta. Cocinada lentamente durante horas para conseguir la textura cremosa característica de este plato tradicional.',
    ingredients: ['Alubias blancas', 'Chorizo asturiano', 'Morcilla', 'Lacón', 'Panceta', 'Azafrán', 'Pimentón'],
    price: 14.00,
    image: fabadaImg,
    category: 'main',
    available: true
  },
  {
    id: '9',
    name: 'Churros con Chocolate',
    description: 'Churros recién hechos con chocolate espeso',
    full_description: 'Churros tradicionales recién fritos, crujientes por fuera y tiernos por dentro, espolvoreados con azúcar. Acompañados de chocolate caliente espeso preparado con cacao puro y leche entera. El postre perfecto para compartir.',
    ingredients: ['Harina', 'Agua', 'Sal', 'Aceite de girasol', 'Azúcar', 'Chocolate negro', 'Leche', 'Maicena'],
    price: 5.50,
    image: churrosImg,
    category: 'dessert',
    available: true
  },
  {
    id: '10',
    name: 'Crema Catalana',
    description: 'Crema tradicional catalana con azúcar quemado',
    full_description: 'Deliciosa crema catalana tradicional elaborada con leche fresca, yemas de huevo, azúcar y un toque de canela y limón. Terminada con una capa de azúcar caramelizado al momento con soplete para conseguir la textura crujiente característica.',
    ingredients: ['Leche fresca', 'Yemas de huevo', 'Azúcar', 'Maicena', 'Canela', 'Limón', 'Vainilla'],
    price: 6.00,
    image: cremaImg,
    category: 'dessert',
    available: true
  }
];