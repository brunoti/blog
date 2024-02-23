import * as A from 'fp-ts/Array';
import * as O from 'fp-ts/Option';
import { pipe, constTrue } from 'fp-ts/function';
import { PostMetadata, PostMetadataOrd } from '$lib/types';
import type { PageServerLoad } from './$types';

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
		A.sort(PostMetadataOrd),
		A.takeLeft(3)
	);

	return { posts };
};
