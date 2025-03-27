import type { Breakfast, BreakfastCategory } from '../types/breakfast';

export const breakfastCategories: BreakfastCategory[] = [
  {
    id: 'celebration',
    name: 'Para Celebrar',
    description: 'Desayunos especiales para festejar momentos únicos',
    icon: '🎉'
  },
  {
    id: 'romantic',
    name: 'Románticos',
    description: 'Perfectos para sorprender a esa persona especial',
    icon: '❤️'
  },
  {
    id: 'healthy',
    name: 'Saludables',
    description: 'Opciones nutritivas para comenzar el día',
    icon: '🥗'
  },
  {
    id: 'boxes',
    name: 'Cajas de Desayuno',
    description: 'Experiencias completas en una caja especial',
    icon: '📦'
  }
];

export const breakfasts: Breakfast[] = [
  {
    id: 1,
    categoryId: 'celebration',
    name: "Desayuno Cumpleaños Simple",
    description: "Celebra con waffles decorados, huevos revueltos, bacon y jugo natural.",
    price: 29990,
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800",
    type: "simple",
    featured: true
  },
  {
    id: 2,
    categoryId: 'celebration',
    name: "Desayuno Cumpleaños Full",
    description: "La experiencia completa de cumpleaños con decoración especial.",
    price: 39990,
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800",
    type: "double",
    featured: false
  },
  {
    id: 3,
    categoryId: 'romantic',
    name: "Desayuno Romántico (Para 2)",
    description: "Perfecto para sorprender a esa persona especial con pancakes en forma de corazón.",
    price: 44990,
    image: "https://images.unsplash.com/photo-1513442542250-854d436a73f2?w=800",
    type: "double",
    featured: true
  },
  {
    id: 4,
    categoryId: 'healthy',
    name: "Bowl Energético",
    description: "Bowl de açaí, granola casera, frutas frescas y yogurt griego.",
    price: 19990,
    image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=800",
    type: "bowl",
    featured: false
  },
  {
    id: 5,
    categoryId: 'boxes',
    name: "Brunch Familiar (Para 2)",
    description: "Completo brunch con huevos benedictinos, salmón ahumado y café.",
    price: 49990,
    image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800",
    type: "double",
    featured: true
  },
  {
    id: 6,
    categoryId: 'healthy',
    name: "Despertar Saludable",
    description: "Tostadas de aguacate, huevos pochados y jugo verde detox.",
    price: 24990,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800",
    type: "simple",
    featured: false
  },
  {
    id: 7,
    categoryId: 'healthy',
    name: "Bowl Tropical",
    description: "Bowl de mango, piña, coco rallado, chía y granola tropical.",
    price: 21990,
    image: "https://images.unsplash.com/photo-1494597564530-871f2b93ac55?w=800",
    type: "bowl",
    featured: false
  },
  {
    id: 8,
    categoryId: 'boxes',
    name: "Desayuno Ejecutivo (Para 2)",
    description: "Selección premium de croissants, quesos y jamón serrano.",
    price: 46990,
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800",
    type: "double",
    featured: false
  },
  {
    id: 9,
    categoryId: 'boxes',
    name: "Despertar Dulce",
    description: "French toast con frutas del bosque y sirope de maple.",
    price: 26990,
    image: "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=800",
    type: "simple",
    featured: false
  },
  {
    id: 10,
    categoryId: 'healthy',
    name: "Bowl Mediterráneo",
    description: "Bowl de yogurt griego, higos, miel, nueces y granola artesanal.",
    price: 23990,
    image: "https://images.unsplash.com/photo-1511690078903-71dc5a49f5e3?w=800",
    type: "bowl",
    featured: false
  }
];