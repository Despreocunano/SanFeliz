import contentful from 'contentful';

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
  environment: 'master'
});

export interface BlogPost {
  title: string;
  slug: string;
  content: any;
  featuredImage: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  excerpt: string;
  publishDate: string;
}

export interface BreakfastCategory {
  name: string;
  description: string;
  icon: string;
}

export interface Beverage {
  name: string;
  type: 'hot' | 'cold';
}

export interface Cake {
  name: string;
}

export interface Breakfast {
  name: string;
  slug: string;
  description: string;
  price: number;
  image: {
    fields: {
      file: {
        url: string;
      };
    };
  };
  type: 'simple' | 'double' | 'bowl';
  category: {
    fields: BreakfastCategory;
  };
  defaultBeverages?: {
    fields: Beverage;
  }[];
  defaultCakes?: {
    fields: Cake;
  }[];
  featured: boolean;
}

export async function getBlogPosts() {
  const entries = await contentfulClient.getEntries({
    content_type: 'blogPost',
    order: '-fields.publishDate'
  });

  return entries.items.map(item => ({
    ...item.fields
  })) as BlogPost[];
}

export async function getBlogPost(slug: string) {
  const entries = await contentfulClient.getEntries({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1
  });

  return entries.items[0]?.fields as BlogPost;
}

export async function getBreakfasts() {
  const entries = await contentfulClient.getEntries({
    content_type: 'breakfast',
    order: 'fields.name',
    include: 2
  });

  return entries.items.map(item => ({
    ...item.fields,
    id: item.sys.id // Usamos el ID del sistema de Contentful
  })) as Breakfast[];
}

export async function getBreakfast(slug: string) {
  const entries = await contentfulClient.getEntries({
    content_type: 'breakfast',
    'fields.slug': slug,
    limit: 1,
    include: 2
  });

  return entries.items[0]?.fields as Breakfast;
}

export async function getBreakfastCategories() {
  const entries = await contentfulClient.getEntries({
    content_type: 'breakfastCategory',
    order: 'fields.name'
  });

  return entries.items.map(item => ({
    ...item.fields,
    id: item.sys.id // Usamos el ID del sistema de Contentful
  })) as BreakfastCategory[];
}

export async function getBeverages() {
  const entries = await contentfulClient.getEntries({
    content_type: 'beverage',
    order: 'fields.name'
  });

  return entries.items.map(item => ({
    ...item.fields,
    id: item.sys.id // Usamos el ID del sistema de Contentful
  })) as Beverage[];
}

export async function getCakes() {
  const entries = await contentfulClient.getEntries({
    content_type: 'cake',
    order: 'fields.name'
  });

  return entries.items.map(item => ({
    ...item.fields,
    id: item.sys.id // Usamos el ID del sistema de Contentful
  })) as Cake[];
}