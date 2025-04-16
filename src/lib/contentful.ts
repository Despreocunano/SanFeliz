import contentful from 'contentful';
import type { Entry, EntryFields } from 'contentful';

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

export interface FeaturedBreakfast {
  title: string;
  description: string;
  price: number;
  image: string | {
    fields: {
      file: {
        url: string;
      };
    };
  };
  features: {
    icon: string;
    text: string;
  }[];
  badges: {
    text: string;
    icon: string;
    color: string;
  }[];
}

export interface Breakfast {
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string | {
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

type ContentfulQuery<T> = {
  content_type: string;
  limit?: number;
  include?: number;
  order?: string[];
} & {
  [K in `fields.${Extract<keyof T, string>}`]?: string;
};

export async function getBlogPosts(): Promise<BlogPost[]> {
  const query: ContentfulQuery<BlogPost> = {
    content_type: 'blogPost',
    order: ['-fields.publishDate']
  };

  const entries = await contentfulClient.getEntries(query);

  return entries.items.map(item => {
    const fields = item.fields as any;
    return {
      title: fields.title,
      slug: fields.slug,
      content: fields.content,
      featuredImage: fields.featuredImage,
      excerpt: fields.excerpt,
      publishDate: fields.publishDate
    };
  });
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const query: ContentfulQuery<BlogPost> = {
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1
  };

  const entries = await contentfulClient.getEntries(query);

  if (!entries.items[0]) return null;

  const fields = entries.items[0].fields as any;
  return {
    title: fields.title,
    slug: fields.slug,
    content: fields.content,
    featuredImage: fields.featuredImage,
    excerpt: fields.excerpt,
    publishDate: fields.publishDate
  };
}

export async function getBreakfasts(): Promise<Breakfast[]> {
  const query: ContentfulQuery<Breakfast> = {
    content_type: 'breakfast',
    order: ['fields.name'],
    include: 2
  };

  const entries = await contentfulClient.getEntries(query);

  return entries.items.map(item => ({
    ...(item.fields as any),
    id: item.sys.id
  }));
}

export async function getBreakfast(slug: string): Promise<Breakfast | null> {
  const query: ContentfulQuery<Breakfast> = {
    content_type: 'breakfast',
    'fields.slug': slug,
    limit: 1,
    include: 2
  };

  const entries = await contentfulClient.getEntries(query);
  return entries.items[0]?.fields as any || null;
}

export async function getFeaturedBreakfast(): Promise<FeaturedBreakfast | null> {
  const query: ContentfulQuery<FeaturedBreakfast> = {
    content_type: 'featuredBreakfast',
    limit: 1,
    include: 2
  };

  const entries = await contentfulClient.getEntries(query);

  if (!entries.items[0]) return null;

  const fields = entries.items[0].fields as any;
  return {
    title: fields.title,
    description: fields.description,
    price: fields.price,
    image: fields.image,
    features: fields.features,
    badges: fields.badges
  };
}

export async function getBreakfastCategories(): Promise<BreakfastCategory[]> {
  const query: ContentfulQuery<BreakfastCategory> = {
    content_type: 'breakfastCategory',
    order: ['fields.name']
  };

  const entries = await contentfulClient.getEntries(query);

  return entries.items.map(item => ({
    ...(item.fields as any),
    id: item.sys.id
  }));
}

export async function getBeverages(): Promise<Beverage[]> {
  const query: ContentfulQuery<Beverage> = {
    content_type: 'beverage',
    order: ['fields.name']
  };

  const entries = await contentfulClient.getEntries(query);

  return entries.items.map(item => ({
    ...(item.fields as any),
    id: item.sys.id
  }));
}

export async function getCakes(): Promise<Cake[]> {
  const query: ContentfulQuery<Cake> = {
    content_type: 'cake',
    order: ['fields.name']
  };

  const entries = await contentfulClient.getEntries(query);

  return entries.items.map(item => ({
    ...(item.fields as any),
    id: item.sys.id
  }));
}