<script>
    import { authClient } from "$lib/auth-client";
    import Guest from "./_guest.svelte";
    let { children } = $props();

    const session = authClient.useSession();
</script>

{#if !$session.isPending && !$session.isRefetching}
    {#if $session.data}
        {@render children?.()}
    {:else}
        <Guest></Guest>
    {/if}
{/if}
