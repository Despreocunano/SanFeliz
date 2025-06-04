import contentful from 'contentful';
type Entry<T extends contentful.EntrySkeletonType> = contentful.Entry<T>;

export const contentfulClient = contentful.createClient({
  space: import.meta.env.CONTENTFUL_SPACE_ID,
  accessToken: import.meta.env.CONTENTFUL_ACCESS_TOKEN,
  environment: 'master'
});

export interface ContentfulImage {
  fields: {
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

export interface SiteConfig {
  showOnlyFeatured: boolean;
  showCatering: boolean;
}

export interface CateringItem {
  name: string;
  description: string;
  image: ContentfulImage;
  options: {
    name: string;
    price: number;
    quantity: number;
  }[];
  type: 'dulce' | 'salado';
}

export interface BlogPost {
  title: string;
  slug: string;
  content: any;
  featuredImage: ContentfulImage;
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
  image: ContentfulImage;
  features: Array<{
    text: string;
  }>;
  badges: Array<{
    text: string;
    color: 'primary' | 'secondary';
  }>;
  defaultBeverages?: Array<{
    fields: Beverage;
  }>;
  defaultCakes?: Array<{
    fields: Cake;
  }>;
}

export interface BreakfastAddition {
  name: string;
  price: number;
  description?: string;
}

export interface BreakfastType {
  name: string;
  price: number;
  description?: string;
}

export interface Breakfast {
  name: string;
  slug: string;
  description: string;
  price: number;
  media: ContentfulImage;
  type: 'simple' | 'double' | 'bowl';
  category: {
    fields: BreakfastCategory;
  };
  defaultBeverages: Array<{
    fields: Beverage;
  }>;
  defaultCakes: Array<{
    fields: Cake;
  }>;
  availableAdditions?: Array<{
    fields: BreakfastAddition;
  }>;
  availableTypes?: Array<{
    fields: BreakfastType;
  }>;
  featured: boolean;
}

function transformEntry<T>(entry: Entry<any>): T {
  return entry.fields as T;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const entries = await contentfulClient.getEntries<SiteConfig>({
    content_type: 'siteConfig',
    limit: 1
  });

  return entries.items[0] ? transformEntry<SiteConfig>(entries.items[0]) : {
    showOnlyFeatured: false,
    showCatering: true
  };
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const entries = await contentfulClient.getEntries<BlogPost>({
    content_type: 'blogPost',
    order: ['-fields.publishDate'],
    include: 10
  });

  return entries.items.map(entry => transformEntry<BlogPost>(entry));
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const entries = await contentfulClient.getEntries<BlogPost>({
    content_type: 'blogPost',
    'fields.slug': slug,
    limit: 1,
    include: 10
  });

  return entries.items[0] ? transformEntry<BlogPost>(entries.items[0]) : null;
}

export async function getBreakfasts(): Promise<Breakfast[]> {
  try {
    const entries = await contentfulClient.getEntries<Breakfast>({
      content_type: 'breakfast',
      include: 10
    });

    return entries.items.map(entry => {
      const breakfast = transformEntry<Breakfast>(entry);
      console.log(`Processing breakfast "${breakfast.name}":`, {
        defaultBeverages: breakfast.defaultBeverages,
        defaultCakes: breakfast.defaultCakes
      });
      return breakfast;
    });
  } catch (error) {
    console.error('Error fetching breakfasts:', error);
    throw error;
  }
}

export async function getBreakfast(slug: string): Promise<Breakfast | null> {
  const entries = await contentfulClient.getEntries<Breakfast>({
    content_type: 'breakfast',
    'fields.slug': slug,
    limit: 1,
    include: 10
  });

  return entries.items[0] ? transformEntry<Breakfast>(entries.items[0]) : null;
}

export async function getFeaturedBreakfast(): Promise<FeaturedBreakfast | null> {
  try {
    const entries = await contentfulClient.getEntries<FeaturedBreakfast>({
      content_type: 'featuredBreakfast',
      limit: 1,
      include: 10
    });

    if (!entries.items[0]) {
      return null;
    }

    const featuredBreakfast = transformEntry<FeaturedBreakfast>(entries.items[0]);
    console.log('Featured breakfast:', {
      fields: Object.keys(featuredBreakfast),
      imageField: featuredBreakfast.image,
      imageRef: featuredBreakfast.image?.fields?.file?.url
    });

    return featuredBreakfast;
  } catch (error) {
    console.error('Error fetching featured breakfast:', error);
    throw error;
  }
}

export async function getBreakfastCategories(): Promise<BreakfastCategory[]> {
  const entries = await contentfulClient.getEntries<BreakfastCategory>({
    content_type: 'breakfastCategory',
    include: 10
  });

  return entries.items.map(entry => transformEntry<BreakfastCategory>(entry));
}

export async function getBeverages(): Promise<Beverage[]> {
  const entries = await contentfulClient.getEntries<Beverage>({
    content_type: 'beverage',
    include: 10
  });

  return entries.items.map(entry => transformEntry<Beverage>(entry));
}

export async function getCakes(): Promise<Cake[]> {
  const entries = await contentfulClient.getEntries<Cake>({
    content_type: 'cake',
    include: 10
  });

  return entries.items.map(entry => transformEntry<Cake>(entry));
}

export async function getCateringItems(): Promise<CateringItem[]> {
  try {
    const entries = await contentfulClient.getEntries<CateringItem>({
      content_type: 'cateringItem',
      include: 10
    });

    return entries.items.map(entry => transformEntry<CateringItem>(entry));
  } catch (error) {
    console.error('Error fetching catering items:', error);
    throw error;
  }
}