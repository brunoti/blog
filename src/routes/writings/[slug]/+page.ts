import { PostMetadata } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { ZodError } from 'zod';

export const load: PageLoad = async ({ params }) => {
	try {
		const file = await import(`../../../posts/${params.slug}.md`);

		return {
			content: file.default,
			meta: PostMetadata.omit({ slug: true }).parse(file.metadata)
		} as {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			content: any;
			meta: PostMetadata;
		};
	} catch (err) {
		if (err instanceof ZodError) {
			console.error(err.message);
			throw error(500, err.message);
		}

		console.error(err);
		throw error(404, 'Post not found');
	}
};
