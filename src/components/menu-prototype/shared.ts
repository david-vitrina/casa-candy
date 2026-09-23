// PROTOTIPO — tipos y utilidades compartidas por las variantes de carta.
import { Category, Dish } from '@/types/menu';

export interface CategoryGroup {
  category: Category;
  dishes: Dish[];
}

export interface VariantProps {
  groups: CategoryGroup[];
  daily: { price: number; primeros: Dish[]; segundos: Dish[] } | null;
  onDishClick: (dish: Dish) => void;
}

export const formatPrice = (value: number) =>
  new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);

export const hasPhoto = (dish: Dish) => !!dish.image && /^https?:\/\//.test(dish.image);

export const finalPrice = (dish: Dish) =>
  dish.discount_percentage && dish.discount_percentage > 0
    ? dish.price * (1 - dish.discount_percentage / 100)
    : dish.price;
