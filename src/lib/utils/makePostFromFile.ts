import type { Post } from '$lib/types';

export function makePostFromFile(file: Record<string, unknown>, slug: string) {
	const metadata = file.metadata as Omit<Post, 'slug'>;
	return { ...metadata, slug } satisfies Post;
}
