<script lang="ts">
	/* eslint-disable svelte/no-at-html-tags */
	import type { PageData } from "./$types";

	export let data: PageData
</script>

<svelte:head>
	<title>bop - {data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
</svelte:head>

<article class="prose prose-invert">
  <!-- Title -->
	<hgroup>
		<h1>{data.meta.title}</h1>
		<p>Published at {data.meta.date}</p>
	</hgroup>

  <!-- Tags -->
	<div class="tags">
		{#each data.meta.tags as category}
			<span class="surface-4">&num;{category}</span>
		{/each}
	</div>

	<svelte:component this={data.content} />
</article>
