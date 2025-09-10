<script>
    import { goto } from "$app/navigation";
    import { authClient } from "$lib/auth-client";
    import { watch } from "runed";
    let { children } = $props();

    const session = authClient.useSession();

    watch(
        () => [$session],
        () => {
            if ($session.isPending || $session.isRefetching) {
                return;
            }
            if ($session.data) {
                goto("/");
            }
        },
    );
</script>

{#if !$session.isPending}
    {#if !$session.data}
        {@render children?.()}
    {/if}
{/if}
