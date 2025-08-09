export interface Dish {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  ingredients: string[];
  price: number;
  image: string;
  category: 'appetizer' | 'main' | 'dessert';
  available: boolean;
}