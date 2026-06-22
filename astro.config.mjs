import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// output: 'static' (default) — Cloudflare Pages serves the generated /dist directory directly.
// The @astrojs/cloudflare adapter is only needed when using SSR (output: 'server' | 'hybrid').
export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
  site: 'https://cli-tools-guide.pages.dev',
  integrations: [sitemap()],
});
