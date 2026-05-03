import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const tools = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tools' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().optional(),
    installCommand: z.string().optional(),
    officialUrl: z.string().url().optional(),
    related: z.array(z.string()).optional(),
    pubDate: z.coerce.date().optional(),
  }),
});

export const collections = { tools };
