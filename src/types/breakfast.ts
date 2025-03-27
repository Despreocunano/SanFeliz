export type BreakfastType = 'simple' | 'double' | 'bowl';

export interface Breakfast {
  id: number;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: BreakfastType;
  featured: boolean;
}

export interface BreakfastCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}