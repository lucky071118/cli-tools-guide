import { defineCollection, z } from 'astro:content';

const tools = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // NOTE: `slug` is a reserved field in Astro 5 Content Collections — it is
    // stripped from frontmatter before schema validation. Routing uses entry.id
    // (the filename without extension, e.g. "bat" for bat.md) instead.
    category: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().optional(),
    installCommand: z.string().optional(),
    officialUrl: z.string().url().optional(),
    related: z.array(z.string()).optional(),
    // YAML parses date literals (2024-01-15) as Date objects, so use z.coerce.date()
    pubDate: z.coerce.date().optional(),
  }),
});

export const collections = { tools };
