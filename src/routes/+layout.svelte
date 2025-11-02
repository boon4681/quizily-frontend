<script lang="ts">
    import "../app.css";
    import "@fontsource/kanit";
    import favicon from "$lib/assets/favicon.svg";
    import { Toaster } from "$lib/components/ui/sonner";
    import { browser } from "$app/environment";
    import { QueryClientProvider, QueryClient } from "@tanstack/svelte-query";
    let { children } = $props();
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                enabled: browser,
            },
        },
    });
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={queryClient}>
    <Toaster></Toaster>
    {@render children?.()}
</QueryClientProvider>
