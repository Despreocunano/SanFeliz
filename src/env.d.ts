/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_MERCADOPAGO_PUBLIC_KEY: string;
  readonly MERCADOPAGO_ACCESS_TOKEN: string;
  readonly SITE_URL: string;
  readonly CONTENTFUL_SPACE_ID: string;
  readonly CONTENTFUL_ACCESS_TOKEN: string;
  readonly CONTENTFUL_GRAPHQL_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  MercadoPago: any;
}