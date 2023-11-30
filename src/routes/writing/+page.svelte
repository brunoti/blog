<script lang="ts">
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>bop - writing</title>
</svelte:head>

<section class="flex flex-col space-y-5">
	{#each data.posts as post (post.slug)}
	  <article class="py-4 border-b border-b-blue-300">
			<h2 class="text-amber-400 tracking-wider font-xl">
				<a href="/writing/{post.slug}">
					{post.title}
				</a>
			</h2>
		</article>
	{/each}
</section>
