<script>
  import "../app.css";
	import { base } from '$app/paths'
	import { page } from '$app/stores';

</script>

<main class="w-full flex flex-col items-center">
	<div class="w-full max-w-3xl">
		<nav class="w-full py-5 px-8 flex flex-row">
			<a href="/" class="block">
				<img src="{base}/logo.svg" alt="bop" class="w-[100px] mr-5 hover:invert-[80%]">
			</a>
			<div class="grow flex flex-row space-x-5 text-amber-400 font-normal uppercase items-center tracking-wider">
				<a href="/" class="block p-1 hover:text-blue-300 {$page.url.pathname === '/' ? 'text-blue-300 hover:text-amber-400' : ''}">
					Home
				</a>
				<a href="/writing" class="block p-1 hover:text-blue-300 {$page.url.pathname === '/writing' ? 'text-blue-300 hover:text-amber-400' : ''}">
					Wiriting
				</a>
			</div>
		</nav>
		<div class="px-8 pb-8">
			<slot />
		</div>
	</div>
</main>
