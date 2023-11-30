<script lang="ts">
	import { base } from '$app/paths'
	import { Linkedin, Github, Mail, Coffee, X } from 'lucide-svelte'

</script>

<svelte:head>
	<title>bop - home</title>
</svelte:head>

<section class="w-full flex flex-row">
	<div class="block space-y-5">
		<h2 class="block text-2xl text-white font-bold tracking-wide">
			Hi, I'm Bruno. <small class="text-blue-300">a.k.a. bop</small>
		</h2>
		<div class="flex flex-row space-x-5">
			<section class="grow">
				<article class="block text-white text-base tracking-wide mb-8">
					Welcome to my personal website, where the world of software development unfolds. I am a dedicated software
					developer, deeply fascinated by the intricacies of functional programming. My expertise lies in
						<span class="text-amber-400 font-medium">JavaScript</span>,
						<span class="text-amber-400 font-medium">TypeScript </span>,
						<span class="text-amber-400 font-medium">React</span>,
						and <span class="text-amber-400 font-medium">React Native </span>, complemented by my exploration of
					<span class="text-amber-400 font-medium">Clojure </span> for personal projects.
					Also this website is built with the awesome <span class="text-amber-400 font-medium">SvelteKit</span>
					which I really love! Currently, I'm a <span class="text-amber-400 font-medium">Frontend Engineer at Kellton</span>,
					and here, through my writings and social media,
					I share insights and experiences from my coding journey.
				</article>
				<section class="grow space-x-5 flex flex-row text-amber-400">
					<a href="/"><Github /></a>
					<a href="/"><Linkedin /></a>
					<a href="/"><Coffee /></a>
					<a href="/"><Mail /></a>
					<a href="/"><X /></a>
				</section>
			</section>
			<aside class="w-[170px] shrink-0">
				<img src="{base}/bop.jpeg" alt="bop" class="w-full block rounded-md">
			</aside>
		</div>
	</div>
</section>
