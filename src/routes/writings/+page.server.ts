import type { Ord } from 'fp-ts/lib/Ord';
import * as A from 'fp-ts/lib/Array';
import * as O from 'fp-ts/lib/Option';
import { pipe, constTrue } from 'fp-ts/lib/function';
import { PostMetadata } from '$lib/types';
import type { PageServerLoad } from './$types';

const postOrd: Ord<PostMetadata> = {
	equals: (a, b) => a.slug === b.slug,
	compare: (a, b) => (new Date(b.date).getTime() > new Date(a.date).getTime() ? 1 : -1)
};

export const load: PageServerLoad = async ({ url }) => {
	const paths = import.meta.glob('/src/posts/*.md', { eager: true });
	const tag = O.fromNullable(url.searchParams.get('tag'));
	const posts = pipe(
		Object.keys(paths),
		A.map((path) =>
			PostMetadata.parse({
				slug: path.split('/').at(-1)?.replace('.md', ''),
				...(paths[path] as { metadata: Record<string, unknown> }).metadata
			})
		),
		A.filter(({ published }) => published),
		A.filter(
			pipe(
				tag,
				O.fold(
					() => constTrue,
					(tag) => (post: PostMetadata) => post.tags.includes(tag)
				)
			)
		),
		A.sort(postOrd)
	);

	return { posts };
};
