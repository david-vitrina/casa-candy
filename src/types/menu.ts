export type DailyMenuType = 'primero' | 'segundo' | null;

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
  daily_menu_type?: DailyMenuType;
}

export interface DailyMenuSettings {
  id: string;
  price: number;
  is_active: boolean;
  updated_at: string;
  updated_by?: string;
}