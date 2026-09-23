import { Dish } from '@/types/menu';

const priceFormatter = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

// Formato español: «12,50 €».
export const formatPrice = (value: number) => priceFormatter.format(value);

export const finalPrice = (dish: Dish) =>
  dish.discount_percentage && dish.discount_percentage > 0
    ? dish.price * (1 - dish.discount_percentage / 100)
    : dish.price;

// Solo cuentan como foto las URLs reales; vacío o '/placeholder.svg' no.
export const hasPhoto = (dish: Dish) => !!dish.image && /^https?:\/\//.test(dish.image);
