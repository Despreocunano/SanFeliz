export type BreakfastType = 'simple' | 'double' | 'bowl';

export interface BreakfastCategory {
  name: string;
  description: string;
  icon: string;
}

export interface Breakfast {
  name: string;
  description: string;
  price: number;
  image: string;
  type: BreakfastType;
  category: BreakfastCategory;
  featured: boolean;
}