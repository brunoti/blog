<script lang="ts">
	import { base } from '$app/paths';
	import { Linkedin, Github, Mail, Coffee, X } from 'lucide-svelte';

	export let data;
</script>

<svelte:head>
	<title>bop - home</title>
</svelte:head>

<section class="w-full flex flex-row">
	<div class="block space-y-5">
		<h2 class="block text-2xl text-white font-bold tracking-wide text-center md:text-left">
			Hi, I'm Bruno. <small class="text-accent">a.k.a. bop</small>
		</h2>
		<div class="flex flex-col-reverse justify-center md:flex-row space-x-5 sm:justify-start">
			<section class="grow">
				<article class="block text-white text-base tracking-wide mb-8">
					Welcome to my personal website, where the world of software development unfolds. I am a
					dedicated software developer, deeply fascinated by the intricacies of functional
					programming. My expertise lies in
					<span class="text-secondary font-medium">JavaScript</span>,
					<span class="text-secondary font-medium">TypeScript </span>,
					<span class="text-secondary font-medium">React</span>, and
					<span class="text-secondary font-medium">React Native</span>, complemented by my
					exploration of
					<span class="text-secondary font-medium">Clojure</span> and other
					<span class="text-secondary font-medium">functional programming</span>
					languages for personal projects. Also this website is built with the awesome
					<span class="text-secondary font-medium">SvelteKit</span>
					which I really love! Currently, I'm a
					<span class="text-secondary font-medium">Frontend Engineer at Kellton</span>, and here,
					through my writings and social media, I share insights and experiences from my coding
					journey.
				</article>
				<section
					class="grow space-x-5 flex flex-row text-secondary justify-center md:justify-start"
				>
					<a target="_blank" href="https://github.com/brunoti"><Github /></a>
					<a target="_blank" href="https://www.linkedin.com/in/bruno-oliveira-de-paula-7175699a/">
						<Linkedin />
					</a>
					<a target="_blank" href="https://www.buymeacoffee.com/bopdev"><Coffee /></a>
					<a target="_blank" href="mailto:brunohdbass+blog@gmail.com"><Mail /></a>
					<a target="_blank" href="https://x.com/original_bop"><X /></a>
				</section>
			</section>
			<aside class="w-[170px] shrink-0 mb-4">
				<img src="{base}/bop.jpeg" alt="bop" class="w-full block rounded-md" />
			</aside>
		</div>
	</div>
</section>

<div class="w-full h-[1px] bg-accent my-8"></div>

<section>
	<h2 class="block text-2xl text-white font-bold tracking-wide mb-4">Latest posts</h2>
	<section class="space-y-2">
		{#each data.posts as post}
			<article>
				<h3 class="text-secondary tracking-wide">
					<a
						class="block text-md font-normal hover:text-accent underline"
						href="/writings/{post.slug}"
					>
						• {post.title}
					</a>
				</h3>
			</article>
		{/each}
	</section>
</section>
