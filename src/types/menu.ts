export interface Dish {
  id: string;
  name: string;
  description: string;
  full_description: string;
  ingredients: string[];
  price: number;
  image: string;
  category: 'appetizer' | 'main' | 'dessert';
  available: boolean;
  discount_percentage?: number;
  is_daily_menu?: boolean;
}