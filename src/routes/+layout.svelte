<script lang="ts">
	import "../app.css";
	import "@fontsource/kanit";
	import favicon from "$lib/assets/favicon.svg";
	import { Toaster } from "$lib/components/ui/sonner";
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster></Toaster>
{@render children?.()}
