<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { formatDate } from '$lib/utils';
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>bop - writings</title>
</svelte:head>

<section class="flex flex-col space-y-5">
	{#each data.posts as post (post.slug)}
		<article class="py-4 border-b border-b-accent">
			<h2 class="text-secondary tracking-wide space-y-2">
				<a class="block text-2xl font-bold hover:text-accent" href="/writings/{post.slug}">
					{post.title}
				</a>
				<div class="text-secondary text-sm">
					<span class="font-medium">Published at:</span> <time>{formatDate(post.date)}</time>
				</div>
				<div class="tags space-x-2">
					{#each post.tags as tag}
						<Badge href="/writings?tag={tag}" class="underline">&num;{tag}</Badge>
					{/each}
				</div>
			</h2>
		</article>
	{/each}
</section>
