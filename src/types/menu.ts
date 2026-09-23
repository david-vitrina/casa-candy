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
  category_id?: string | null;
  available: boolean;
  discount_percentage?: number;
  daily_menu_type?: DailyMenuType;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  position: number;
  visible: boolean;
}

export interface DailyMenuSettings {
  id: string;
  price: number;
  is_active: boolean;
  updated_at: string;
  updated_by?: string;
}