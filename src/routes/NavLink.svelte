<script lang="ts">
	import { page } from '$app/stores';

	export let path: string;
</script>

<a
	href={path}
	class="block px-2 py-1 hover:text-accent {$page.url.pathname === path
		? 'text-accent hover:text-secondary border-b border-accent hover:border-secondary'
		: ''}"
>
	<slot />
</a>
