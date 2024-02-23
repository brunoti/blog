<script lang="ts">
	/* eslint-disable svelte/no-at-html-tags */
	import type { PageData } from './$types';
	import { Badge } from '$lib/components/ui/badge';
	import { formatDate } from '$lib/utils';
	import { ArrowLeftIcon } from 'lucide-svelte';

	export let data: PageData;
</script>

<svelte:head>
	<title>bop - {data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
</svelte:head>

<article
	class="prose prose-invert prose-h1:text-accent prose-h1:text-3xl prose-headings:text-secondary prose-li:m-0"
>
	<!-- Title -->
	<hgroup>
		<h1>{data.meta.title}</h1>
		<a href="/writings" class="bg-transparent text-secondary hover:text-accent font-medium !block">
			<ArrowLeftIcon class="inline-block mr-2" />GO BACK
		</a>
		<p class="text-secondary text-sm">
			<span class="font-medium">Published at:</span>
			{formatDate(data.meta.date)}
		</p>
	</hgroup>

	<!-- Tags -->
	<div class="tags space-x-2">
		{#each data.meta.tags as tag}
			<Badge href="/writings?tag={tag}">&num;{tag}</Badge>
		{/each}
	</div>

	<svelte:component this={data.content} />
</article>
