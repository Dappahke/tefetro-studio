// src/sanity/next-sanity.d.ts
declare module 'next-sanity' {
  export interface LiveConfig {
    client: any;
    serverToken?: string;
    browserToken?: string;
  }

  export function defineLive(config: LiveConfig): {
    sanityFetch: any;
    SanityLive: React.ComponentType;
  };

  export function createClient(config: any): any;
}