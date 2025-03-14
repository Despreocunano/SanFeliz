/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly PUBLIC_MERCADOPAGO_PUBLIC_KEY: string;
    readonly MERCADOPAGO_ACCESS_TOKEN: string;
    readonly SITE_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  
  interface Window {
    MercadoPago: any;
  }