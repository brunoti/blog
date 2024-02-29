<script>
	import '../app.css';
	import { base } from '$app/paths';
	import NavLink from './NavLink.svelte';
	import { inject } from '@vercel/analytics';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	inject();
	injectSpeedInsights();
</script>

<main class="w-full flex flex-col items-center h-screen">
	<div class="w-full max-w-3xl">
		<nav class="w-full py-5 px-8 flex flex-row">
			<a href="/" class="block">
				<img src="{base}/logo.svg" alt="bop" class="w-[100px] mr-5 hover:opacity-80" />
			</a>
			<div
				class="grow flex flex-row text-secondary font-normal uppercase items-center space-x-2 tracking-wider"
			>
				<NavLink path="/">Home</NavLink>
				<NavLink path="/writings">Writings</NavLink>
			</div>
		</nav>
		<div class="px-8 pb-8">
			<slot />
		</div>
	</div>
	<footer class="mt-auto text-accent text-sm text-center py-4">
		&copy; {new Date().getFullYear()} - bop - all rights reserved
	</footer>
</main>
