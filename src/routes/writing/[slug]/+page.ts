import type { Post } from '$lib/types';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	try {
		const file = await import(
			/* @vite-ignore */
			`../../../posts/${params.slug}.md`
		);

		return {
			content: file.default,
			meta: file.metadata
		} as {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			content: any;
			meta: Post;
		};
	} catch (err) {
		console.error(err);
		throw error(404, 'Post not found');
	}
};
