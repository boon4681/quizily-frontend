<script>
    import AppNav from "$lib/components/main/app-nav.svelte";
    import { authClient } from "$lib/auth-client";
    const session = authClient.useSession();
</script>

<AppNav></AppNav>
<div>
    {#if $session.data}
        <div>
            <p>
                {$session?.data?.user.name}
            </p>
            <button
                on:click={async () => {
                    await authClient.signOut();
                }}
            >
                Sign Out
            </button>
        </div>
    {/if}
</div>
