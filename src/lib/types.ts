import { z } from 'zod';
import type { Ord } from 'fp-ts/Ord';

export const PostMetadata = z.object({
	title: z.string(),
	slug: z.string(),
	description: z.string().optional(),
	date: z.string(),
	published: z.boolean(),
	tags: z.array(z.string())
});

export const PostMetadataOrd: Ord<PostMetadata> = {
	equals: (a, b) => a.slug === b.slug,
	compare: (a, b) => (new Date(b.date).getTime() > new Date(a.date).getTime() ? 1 : -1)
};

export type PostMetadata = z.infer<typeof PostMetadata>;
